/**
 * GET /api/img/{...path} — `public/img/` altındaki görselleri diskten servis eder.
 *
 * Neden gerekiyor?
 * Next.js 14 `next start`, `public/` dizinini sunucu başlangıcında bir kez
 * tarayıp dosya listesini önbelleğe alır. Bu nedenle API tarafında runtime
 * sırasında `public/img/` altına yazılan yeni görseller, sunucu yeniden
 * başlatılmadan `/img/...` adresinden servis edilemez.
 *
 * Çözüm: `next.config.js` içindeki `afterFiles` rewrite'i önce dosya sistemini
 * kontrol eder; mevcut (build anında kayıtlı) görseller Next.js'in statik
 * hattından servis edilir, yalnızca runtime'da eklenenler bu route handler'a
 * düşer ve diskten okunur.
 *
 * Güvenlik:
 * - Yol segmentleri doğrulanır (path traversal engellenir).
 * - Hedef dosyanın `public/img/` içinde olduğu mutlak yol üzerinden teyit edilir.
 * - Yalnızca izin verilen görsel uzantılarına izin verilir.
 */

import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'
import { Readable } from 'stream'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const PUBLIC_IMG_DIR = path.join(process.cwd(), 'public', 'img')

/** İzin verilen görsel uzantıları → MIME tipi. */
const ALLOWED_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

interface RouteContext {
  params: { path: string[] }
}

/**
 * İstek yolunu güvenli bir disk yoluna çevirir.
 * Geçersiz veya `public/img/` dışına kaçan yollar null döner.
 */
function resolveSafeFilePath(segments: string[]): string | null {
  if (!Array.isArray(segments) || segments.length === 0) return null
  if (segments.length > 5) return null

  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..') return null
    if (segment.includes('/') || segment.includes('\\')) return null
    if (segment.includes('\0')) return null
  }

  const fileName = segments[segments.length - 1]
  const extension = path.extname(fileName).toLowerCase()
  if (!ALLOWED_TYPES[extension]) return null

  const resolved = path.resolve(PUBLIC_IMG_DIR, ...segments)
  const root = path.resolve(PUBLIC_IMG_DIR)
  // Yol `public/img/` dışına çıkıyorsa reddet.
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null

  return resolved
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
): Promise<Response> {
  const filePath = resolveSafeFilePath(params.path)
  if (!filePath) {
    return new Response('Not found', { status: 404 })
  }

  let fileStat: Awaited<ReturnType<typeof stat>>
  try {
    fileStat = await stat(filePath)
  } catch {
    return new Response('Not found', { status: 404 })
  }
  if (!fileStat.isFile()) {
    return new Response('Not found', { status: 404 })
  }

  const contentType = ALLOWED_TYPES[path.extname(filePath).toLowerCase()]
  const etag = `"${fileStat.size.toString(16)}-${fileStat.mtimeMs.toString(16)}"`

  // Koşullu istek desteği (ETag).
  if (request.headers.get('if-none-match') === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } })
  }

  const stream = Readable.toWeb(
    createReadStream(filePath),
  ) as unknown as ReadableStream<Uint8Array>

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileStat.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: etag,
    },
  })
}
