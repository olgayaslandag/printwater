/**
 * GET    /api/v1/articles/{slug} — Tek makale getirir (herkese açık okuma).
 * PUT    /api/v1/articles/{slug} — Mevcut makaleyi alan bazlı günceller (Bearer token).
 * DELETE /api/v1/articles/{slug} — Makaleyi siler (Bearer token).
 *
 * Bu projede PUT, RFC 7231 tam-değiştirme yerine kısmi yama (merge) semantiği
 * uygular: yalnızca gönderilen alanlar güncellenir. `slug` değiştirilemez.
 */

import { NextRequest, NextResponse } from 'next/server'
import { deleteArticle, findArticle, listArticles, updateArticle } from '@/src/lib/articles/store'
import { SLUG_PATTERN, validateUpdateInput } from '@/src/lib/articles/validation'
import { guardWriteRequest } from '@/src/lib/api/guard'
import { invalidateAfterMutation } from '@/src/lib/articles/revalidate'
import {
  deleteManagedUploadFile,
  normalizeArticleImage,
} from '@/src/lib/articles/image-handler'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { slug: string }
}

function notFoundResponse(slug: string): NextResponse {
  return NextResponse.json(
    { error: { code: 'not_found', message: `Makale bulunamadı: ${slug}` } },
    { status: 404 },
  )
}

function invalidSlugResponse(): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: 'invalid_slug',
        message: 'Slug biçimi geçersiz: yalnızca küçük harf, rakam ve tire kullanın.',
      },
    },
    { status: 400 },
  )
}

/** Yazma uçları için ortak ön kontrol `guardWriteRequest` (src/lib/api/guard.ts). */

/**
 * Verilen görsel yolunu başka hiçbir makale kullanmıyorsa diskten siler
 * (orphan temizliği). Yalnızca `deleteManagedUploadFile` güvenlik
 * allowlist'ine uyan `public/img/uploads/` dosyaları etkilenir.
 *
 * Yarış toleransı: kullanım kontrolü yazma kilidi dışında yapılır; iki yazma
 * isteği arasında milisaniyelik bir yarış penceresi kalabilir. Tek Node.js
 * süreci ve IP başına 30 istek/dk yazma limiti bu pencereyi pratikte ihmal
 * edilebilir kılar; kabul edilen davranış budur. En kötü durum, hâlâ
 * kullanılan bir dosyanın bir sonraki mutasyonda yeniden indirilebilir olması
 * ya da tek bir orphan dosyanın bir sonraki temizliğe kadar kalmasıdır.
 */
async function cleanupUploadImageIfUnused(imagePath: string | undefined): Promise<void> {
  if (!imagePath) return
  const remaining = await listArticles()
  const stillUsed = remaining.some((article) => article.image === imagePath)
  if (!stillUsed) {
    await deleteManagedUploadFile(imagePath)
  }
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { slug } = params
  if (!SLUG_PATTERN.test(slug)) return invalidSlugResponse()

  const article = await findArticle(slug)
  if (!article) return notFoundResponse(slug)
  return NextResponse.json(
    { data: article },
    { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } },
  )
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { slug } = params
  if (!SLUG_PATTERN.test(slug)) return invalidSlugResponse()

  const failure = guardWriteRequest(request)
  if (failure) return failure

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_json', message: 'İstek gövdesi geçerli JSON değil.' } },
      { status: 400 },
    )
  }

  const result = validateUpdateInput(body)
  if (!result.ok) {
    return NextResponse.json(
      { error: { code: 'validation_failed', message: 'Gönderilen alan geçersiz.', errors: result.errors } },
      { status: result.status },
    )
  }

  // Varlık kontrolü görsel indirmeden ÖNCE: olmayan slug'a PUT'ta dosya
  // indirilip 404 dönülürse diskte orphan kalırdı.
  const previous = await findArticle(slug)
  if (!previous) return notFoundResponse(slug)

  // Görseli işle: harici URL ise indirip public/img/'a kaydet, yerel yolu döndür.
  // İndirme başarısızsa ham harici adres korunur (next/image unoptimized olduğu
  // için tarayıcı doğrudan çeker).
  if (result.patch.image) {
    const processedImage = await normalizeArticleImage(result.patch.image, slug)
    if (processedImage) {
      result.patch.image = processedImage
    }
  }

  const updated = await updateArticle(slug, result.patch)
  if (!updated) {
    // Çok nadir yarış: findArticle ile updateArticle arasında makale silindi.
    // Bu istekte indirilen görseli sil; kayıtsız makale için orphan birikmesin.
    if (result.patch.image && result.patch.image !== previous.image) {
      await deleteManagedUploadFile(result.patch.image)
    }
    return notFoundResponse(slug)
  }

  // Görsel değiştiyse ve eski dosya başka makalede kullanılmıyorsa sil.
  if (previous?.image && previous.image !== updated.image) {
    await cleanupUploadImageIfUnused(previous.image)
  }

  invalidateAfterMutation(slug)
  return NextResponse.json({ data: updated })
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { slug } = params
  if (!SLUG_PATTERN.test(slug)) return invalidSlugResponse()

  const failure = guardWriteRequest(request)
  if (failure) return failure

  const removed = await deleteArticle(slug)
  if (!removed) return notFoundResponse(slug)

  // Silinen makalenin upload görselini kullanan başka makale yoksa dosyayı sil.
  await cleanupUploadImageIfUnused(removed.image)

  invalidateAfterMutation(slug)
  return NextResponse.json({ data: removed })
}
