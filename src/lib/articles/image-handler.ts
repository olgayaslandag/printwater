/**
 * Harici görsel URL'lerini indirip `public/img/uploads/` dizinine WebP olarak kaydeder.
 *
 * Kaydedilen görseller `public/img/uploads/` altında tutulur; böylece elle
 * yüklenen statik görsellerle (`public/img/*.webp` vb.) ayrılır ve runtime
 * artefaktları tek klasörden temizlenebilir.
 *
 * Görsel işleme (statik `scripts/optimize-images.mjs` betiğiyle tutarlı):
 * - İndirilen görsel EXIF yönlendirmesi uygulanarak normalize edilir.
 * - En uzun kenar `MAX_DIMENSION` (1920px) ile sınırlanır; büyütme yapılmaz.
 * - Çıktı her zaman WebP formatındadır.
 * - Alfa (şeffaflık) kanalı korunur (`alphaQuality: 100`); küçük grafik/logo
 *   görselleri kayıpsız (lossless) WebP olarak üretilir.
 *
 * Güvenlik ve dayanıklılık kontrolleri:
 * - Yalnızca `http` / `https` şemaları; SSRF'a karşı özel IP aralıkları engellenir.
 * - DNS rebinding koruması: soket, doğrulamadan geçen adreslere DNS-pinned
 *   agent ile bağlanır (doğrulama ile fetch ayrı çözümleme yapmaz).
 * - Yönlendirmeler elle izlenir ve her adımda hedef sunucu yeniden doğrulanır.
 * - İstekler `FETCH_TIMEOUT_MS` süresinde zaman aşımına uğrar.
 * - Yanıt `Content-Length` başlığı ve akış üzerindeki gerçek boyut ile sınırlanır.
 * - MIME tipi `image/jpeg`, `image/png`, `image/webp` ile sınırlıdır ve içerik
 *   magic byte'ları ile doğrulanır.
 * - Dosya adı slug + zaman damgası ile benzersizdir ve uzantısı `.webp`'dir.
 *
 * Başarı durumunda kaydedilen dosyanın site içi yolu (`/img/...`) döner;
 * hata durumunda `null` döner.
 */

import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'
import dns from 'node:dns/promises'
import net from 'node:net'
import { Agent, fetch as undiciFetch, type Response as UndiciResponse } from 'undici'
import sharp from 'sharp'
import { slugify } from './validation'
// Görsel işleme kuralları statik betikle PAYLAŞILIR (tek kaynak).
import { IMAGE_LIMITS, shouldUseLossless, buildWebpOptions } from '../../../scripts/image-config.mjs'

const PUBLIC_IMG_DIR = path.join(process.cwd(), 'public', 'img', 'uploads')
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const FETCH_TIMEOUT_MS = 15_000
const MAX_REDIRECTS = 3

/**
 * DNS-pinned fetch agent: soket, doğrulamadan geçen adreslere bağlanır.
 *
 * `assertPublicHost` hostname'i çözüp doğrular; ancak `fetch` kendi DNS
 * çözümlemesini ayrı yaparsa saldırgan iki sorguya farklı cevap vererek
 * (DNS rebinding) doğrulamayı atlayabilir. Bu agent, bağlantı kurulurken
 * yapılan `lookup` içinde adresleri yeniden denetler; özel ağ adresine
 * çözümlenen herhangi bir kayıt bağlantıyı reddettirir. Böylece soket
 * daima denetlenmiş bir adrese gider.
 */
const SAFE_FETCH_AGENT = new Agent({
  connect: {
    lookup: (hostname, options, callback) => {
      const family =
        options.family === 4 || options.family === 6 ? options.family : 0
      dns
        .lookup(hostname, { family, all: true })
        .then((addresses) => {
          if (addresses.length === 0) {
            callback(new Error('Sunucu adresi çözümlenemedi'), [])
            return
          }
          if (addresses.some((entry) => isPrivateAddress(entry.address))) {
            callback(new Error('Özel ağ adreslerine erişim engellendi'), [])
            return
          }
          callback(null, addresses)
        })
        .catch((error: Error) => {
          callback(error, [])
        })
    },
  },
})

/** İzin verilen görsel MIME tipleri (allowlist). */
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

/** MIME tipi → beklenen magic byte imzaları. */
const MIME_SIGNATURES: Record<string, number[][]> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/webp': [
    [0x52, 0x49, 0x46, 0x46], // "RIFF"
    [0x57, 0x45, 0x42, 0x50], // "WEBP"
  ],
}

/** Görsel olmayan içeriklerin yanlışlıkla kaydedilmesini engeller. */
function hasValidSignature(mimeType: string, bytes: Uint8Array): boolean {
  const signatures = MIME_SIGNATURES[mimeType]
  if (!signatures) return false
  return signatures.some((signature) => {
    if (bytes.length < signature.length) return false
    return signature.every((byte, index) => bytes[index] === byte)
  })
}

/** Benzersiz dosya adı üretir: `<slug>-cover-<timestamp>.webp`. */
function buildUniqueFileName(slug: string | undefined): string {
  const timestamp = Date.now()
  const base = slug ? slugify(slug) : ''
  const suffix = base ? `${base}-cover` : 'cover'
  return `${suffix}-${timestamp}.webp`
}

/** URL yolundan kaynak dosya adını çıkarır (logo kontrolü için). */
function sourceNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    return path.posix.basename(pathname)
  } catch {
    return ''
  }
}

/**
 * Ham görsel byte'larını WebP formatına dönüştürür.
 *
 * - EXIF yönlendirmesi uygulanır (`rotate`).
 * - En uzun kenar `IMAGE_LIMITS.MAX_DIMENSION` (1920px) ile sınırlanır;
 *   büyütme yapılmaz.
 * - Alfa kanalı korunur; küçük grafik/logo görselleri kayıpsız (lossless) üretilir.
 *
 * @param bytes Kaynak görselin ham byte'ları.
 * @param options `sourceName` verilirse "logo" kontrolünde kullanılır.
 * @returns WebP formatında ham buffer.
 */
export async function convertToWebp(
  bytes: Uint8Array,
  options?: { sourceName?: string },
): Promise<Buffer> {
  const metadata = await sharp(bytes, { failOn: 'error' }).metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  if (!width || !height) {
    throw new Error('Görsel boyutları okunamadı')
  }

  const hasAlpha = Boolean(metadata.hasAlpha)
  const maxEdge = Math.max(width, height)
  const lossless = shouldUseLossless(options?.sourceName ?? '', hasAlpha, maxEdge)

  const pipeline = sharp(bytes, { failOn: 'error' })
    .rotate()
    .resize({
      width: IMAGE_LIMITS.MAX_DIMENSION,
      height: IMAGE_LIMITS.MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })

  return pipeline.webp(buildWebpOptions(hasAlpha, lossless)).toBuffer()
}

/** IPv4/IPv6 adresi özel (yerel) ağ aralığında mı? */
function isPrivateAddress(address: string): boolean {
  if (net.isIPv4(address)) {
    const parts = address.split('.').map(Number)
    const [a, b] = parts
    if (a === 0 || a === 10 || a === 127) return true
    if (a === 169 && b === 254) return true // link-local
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
    if (a >= 224) return true // multicast / reserved
    return false
  }
  if (net.isIPv6(address)) {
    const normalized = address.toLowerCase()
    if (normalized === '::1' || normalized === '::') return true
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true // unique local
    if (normalized.startsWith('fe80')) return true // link-local
    if (normalized.startsWith('::ffff:')) {
      return isPrivateAddress(normalized.slice('::ffff:'.length))
    }
    return false
  }
  return true
}

/**
 * Hedef sunucunun genel internete açık bir adrese çözümlendiğini doğrular.
 * SSRF'a karşı koruma: localhost, özel ağ ve link-local adresler reddedilir.
 */
async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!host) throw new Error('URL host bilgisi eksik')
  if (host === 'localhost' || host.endsWith('.localhost')) {
    throw new Error('Yerel adreslere erişim engellendi')
  }
  if (host.endsWith('.local') || host.endsWith('.internal')) {
    throw new Error('Yerel ağ adreslerine erişim engellendi')
  }

  if (net.isIP(host)) {
    if (isPrivateAddress(host)) throw new Error('Özel ağ adreslerine erişim engellendi')
    return
  }

  let addresses: Array<{ address: string }>
  try {
    addresses = await dns.lookup(host, { all: true })
  } catch {
    throw new Error('Sunucu adresi çözümlenemedi')
  }
  if (addresses.length === 0) throw new Error('Sunucu adresi çözümlenemedi')
  for (const entry of addresses) {
    if (isPrivateAddress(entry.address)) {
      throw new Error('Özel ağ adreslerine erişim engellendi')
    }
  }
}

/** `https://...` veya `http://...` biçiminde geçerli bir URL mi? */
export function isExternalImageUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value)) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/** Yanıt gövdesini boyut sınırına uyarak okur. */
async function readLimitedBody(
  response: UndiciResponse,
): Promise<Uint8Array | null> {
  if (!response.body) return null
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      total += value.byteLength
      if (total > MAX_SIZE_BYTES) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  return new Uint8Array(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))))
}

/**
 * Verilen URL'yi indirir, doğrular, WebP'ye dönüştürür ve `public/img/uploads/`
 * altına kaydeder. Yönlendirmeler en fazla {@link MAX_REDIRECTS} kez izlenir.
 */
async function downloadAndSave(
  startUrl: string,
  slug: string | undefined,
): Promise<string | null> {
  let currentUrl = startUrl

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    const parsed = new URL(currentUrl)
    await assertPublicHost(parsed.hostname)

    // DNS-pinned agent: bağlantı, denetlenmiş adreslere kurulur (rebinding koruması).
    const response = await undiciFetch(parsed.toString(), {
      redirect: 'manual',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: 'image/*' },
      dispatcher: SAFE_FETCH_AGENT,
    })

    // 3xx → hedefi doğrulayarak izle.
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) {
        console.error('[image-handler] Yönlendirme hedefi eksik:', response.status)
        return null
      }
      const nextUrl = new URL(location, parsed).toString()
      if (!isExternalImageUrl(nextUrl)) {
        console.error('[image-handler] Geçersiz yönlendirme hedefi')
        return null
      }
      currentUrl = nextUrl
      continue
    }

    if (!response.ok) {
      console.error('[image-handler] Görsel indirilemedi, HTTP durumu:', response.status)
      return null
    }

    // MIME tipi kontrolü (charset parametresi yok sayılır).
    const rawContentType = response.headers.get('content-type') ?? ''
    const contentType = rawContentType.split(';')[0].trim().toLowerCase()
    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      console.error('[image-handler] Desteklenmeyen görsel MIME tipi:', contentType || 'bilinmiyor')
      return null
    }

    // Content-Length ön kontrolü.
    const declaredLength = Number(response.headers.get('content-length') ?? '0')
    if (Number.isFinite(declaredLength) && declaredLength > MAX_SIZE_BYTES) {
      console.error('[image-handler] Görsel boyutu sınırı aşıyor (content-length)')
      return null
    }

    const bytes = await readLimitedBody(response)
    if (!bytes) {
      console.error('[image-handler] Görsel okunamadı veya 5 MB sınırı aşıldı')
      return null
    }
    if (bytes.length === 0) {
      console.error('[image-handler] Görsel içeriği boş')
      return null
    }

    // İçerik gerçekten bir görsel mi?
    if (!hasValidSignature(contentType, bytes)) {
      console.error('[image-handler] İçerik imzası MIME tipiyle uyuşmuyor:', contentType)
      return null
    }

    // İndirilen ham byte'lar WebP'ye dönüştürülür (max 1920x1920, alfa korunur).
    let webpBuffer: Buffer
    try {
      webpBuffer = await convertToWebp(bytes, {
        sourceName: sourceNameFromUrl(parsed.toString()),
      })
    } catch (error) {
      console.error('[image-handler] Görsel WebP\'ye dönüştürülemedi:', error)
      return null
    }

    const fileName = buildUniqueFileName(slug)
    await mkdir(PUBLIC_IMG_DIR, { recursive: true })
    await writeFile(path.join(PUBLIC_IMG_DIR, fileName), webpBuffer)

    return `/img/uploads/${fileName}`
  }

  console.error('[image-handler] Yönlendirme limiti aşıldı')
  return null
}

/**
 * Makale `image` alanını işler.
 *
 * - `/img/...` gibi site içi yollar doğrudan geçirilir.
 * - `https://` / `http://` adresleri indirilir, WebP'ye dönüştürülür ve
 *   `public/img/uploads/` altına kaydedilir, ardından yerel yol döner.
 * - Desteklenmeyen bir değer veya indirme hatasında `null` döner.
 */
export async function normalizeArticleImage(
  imageValue: string | undefined,
  slug?: string,
): Promise<string | null> {
  if (typeof imageValue !== 'string') return null
  const trimmed = imageValue.trim()
  if (!trimmed) return null

  // Site içi yollar doğrudan kabul edilir.
  if (trimmed.startsWith('/')) return trimmed

  // Harici adresler indirilir.
  if (!isExternalImageUrl(trimmed)) {
    console.error('[image-handler] Desteklenmeyen görsel değeri')
    return null
  }

  try {
    return await downloadAndSave(trimmed, slug)
  } catch (error) {
    console.error('[image-handler] Görsel indirme/kaydetme hatası:', error)
    return null
  }
}

/** Yalnızca API tarafından yönetilen upload yolları için ön ek ve dosya adı deseni. */
const UPLOAD_URL_PREFIX = '/img/uploads/'
const UPLOAD_FILE_NAME_PATTERN = /^[a-z0-9.-]+\.webp$/

/**
 * Artık hiçbir makale tarafından kullanılmayan (orphan) bir upload görselini
 * `public/img/uploads/` dizininden siler.
 *
 * Güvenlik kuralları (en kritik hata yüzeyi):
 * - Yalnızca `/img/uploads/` ön ekiyle başlayan yollar kabul edilir; elle
 *   eklenen `/img/*.webp` statik görsellerine **asla** dokunulmaz.
 * - Dosya adı `^[a-z0-9.-]+\.webp$` desenine uymalıdır (nokta-yol dizileri
 *   ve alt dizinler elenir).
 * - `path.resolve` ile hedefin gerçekten `public/img/uploads/` içinde kaldığı
 *   bir kez daha doğrulanır (path traversal koruması).
 * - Silme hatası yalnızca loglanır, throw edilmez; API yanıtını bozmamalı.
 */
export async function deleteManagedUploadFile(imagePath: string): Promise<void> {
  if (typeof imagePath !== 'string' || !imagePath.startsWith(UPLOAD_URL_PREFIX)) {
    return
  }

  const fileName = imagePath.slice(UPLOAD_URL_PREFIX.length)
  if (!UPLOAD_FILE_NAME_PATTERN.test(fileName)) return

  // Traversal koruması: çözümlenen hedef uploads kökünden çıkamaz.
  const uploadsRoot = path.resolve(PUBLIC_IMG_DIR)
  const target = path.resolve(uploadsRoot, fileName)
  if (target !== uploadsRoot && !target.startsWith(uploadsRoot + path.sep)) {
    console.error('[image-handler] Upload silme reddedildi (kök dışı hedef):', imagePath)
    return
  }

  try {
    await unlink(target)
  } catch (error) {
    // ENOENT: dosya zaten yok — sorun değil. Diğer hatalar loglanır.
    console.error('[image-handler] Upload görseli silinemedi:', (error as Error).message)
  }
}
