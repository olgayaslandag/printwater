/**
 * Bilgi Merkezi API güvenlik yardımcıları: Bearer token doğrulama ve
 * bellek-içi hız sınırlama (rate limit).
 *
 * Token yalnızca ortam değişkeninden okunur (güvenlik kuralı: hardcode yasak).
 * Token tanımlı değilse yazma uçları FAIL-CLOSED davranır: 503 döner, böylece
 * yapılandırmasız ortamda içeriğe kimse yazamaz.
 */

import { createHash, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

function sha256(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest()
}

/**
 * İstek başlığındaki `Authorization: Bearer <token>` değerini ortam
 * değişkenindeki `ARTICLES_API_TOKEN` ile zaman-sabiti (timing-safe)
 * karşılaştırır. Hatalı durumda döneceği NextResponse 401/503 üretir.
 */
export function authorizeRequest(
  request: NextRequest,
): { authorized: true } | { authorized: false; response: NextResponse } {
  const configuredToken = process.env.ARTICLES_API_TOKEN

  if (!configuredToken) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: {
            code: 'api_not_configured',
            message: 'Yazma uçları devre dışı: ARTICLES_API_TOKEN ortam değişkeni tanımlı değil.',
          },
        },
        { status: 503 },
      ),
    }
  }

  const header = request.headers.get('authorization') ?? ''
  const match = /^Bearer\s+(.+)$/i.exec(header.trim())
  const provided = match?.[1] ?? ''

  // timingSafeEqual eşit uzunluk ister; hash'leyerek uzunluk sızıntısını da kapat.
  const expectedHash = sha256(configuredToken)
  const providedHash = sha256(provided)
  if (!provided || !timingSafeEqual(expectedHash, providedHash)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: { code: 'unauthorized', message: 'Geçersiz veya eksik Bearer token.' } },
        { status: 401 },
      ),
    }
  }

  return { authorized: true }
}

// ---------------------------------------------------------------------------
// Bellek içi sabit pencere hız sınırlayıcı (yazma uçları için).
// Tek Node sürecinde çalışır; çok süreçli (cluster) kurulumda sınır gevşer,
// üretimde reverse-proxy seviyesinde limit önerilir (api-docs.md'de belirtildi).
// ---------------------------------------------------------------------------

interface Window {
  count: number
  resetAt: number
}

const buckets = new Map<string, Window>()
const WINDOW_MS = 60_000
const WRITE_LIMIT = 30 // IP başına dakika

export interface RateResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

export function checkWriteRateLimit(ip: string): RateResult {
  const now = Date.now()
  const bucket = buckets.get(ip)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    // Basit bellek süpürme: çok eski kovaları at.
    if (buckets.size > 1000) {
      buckets.forEach((value, key) => {
        if (value.resetAt <= now) buckets.delete(key)
      })
    }
    return { allowed: true, remaining: WRITE_LIMIT - 1, retryAfterSeconds: 0 }
  }

  if (bucket.count >= WRITE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    }
  }

  bucket.count += 1
  return {
    allowed: true,
    remaining: WRITE_LIMIT - bucket.count,
    retryAfterSeconds: 0,
  }
}

/**
 * `x-forwarded-for` varsa ilk IP'yi, yoksa socket değerini döndürür.
 *
 * GÜVEN MODELİ: Bu başlık istemci tarafından sahtelenebilir. Değer yalnızca
 * şu topolojide güvenilirdir: konteyner portu `127.0.0.1`'e bağlıdır
 * (docker-compose.yml) ve önündeki nginx (`docs/nginx-printwater.conf.example`)
 * `X-Forwarded-For` başlığını `$remote_addr` ile EZEREK set eder. Port doğrudan
 * dışarı açılırsa rate-limit kovası başlık sahteciliğiyle atlanabilir —
 * portu loopback'e bağlamadan bu uçları dışarı açmayın.
 */
export function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Yazma uçları (POST/PUT/DELETE) için ortak ön kontrol: önce IP tabanlı hız
 * sınırı (kaba kuvvet token denemelerine karşı ilk katman), sonra Bearer token
 * doğrulaması. Yetkisizlikte dönecek yanıtı, yetkilide null döner.
 *
 * Tüm yazma route'ları bu fonksiyonu kullanır; koruma sırası tek yerden
 * yönetilir (POST/PUT/DELETE arası Politika sapması olmasın).
 */
export function guardWriteRequest(request: NextRequest): NextResponse | null {
  const rate = checkWriteRateLimit(clientIp(request))
  if (!rate.allowed) {
    return NextResponse.json(
      { error: { code: 'rate_limited', message: 'Çok fazla yazma isteği. Lütfen bekleyin.' } },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    )
  }
  const auth = authorizeRequest(request)
  return auth.authorized ? null : auth.response
}


/**
 * Genel form istekleri için IP tabanlı rate limit (auth gerektirmez).
 * Ayrı bucket kullanarak bearer token gerektiren yazma uçlarıyla karışmaz.
 */
export function guardPublicWrite(request: NextRequest): NextResponse | null {
  const rate = checkWriteRateLimit('contact:' + clientIp(request))
  if (!rate.allowed) {
    return NextResponse.json(
      { error: { code: 'rate_limited', message: 'Çok fazla istek. Lütfen bekleyin.' } },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    )
  }
  return null
}
