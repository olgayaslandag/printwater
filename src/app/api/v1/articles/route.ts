/**
 * GET  /api/v1/articles — Bilgi Merkezi makale listesini döner (herkese açık okuma).
 * POST /api/v1/articles — Yeni makale ekler (Bearer token + hız sınırı).
 *
 * Yanıt gövdesi biçimi:
 *   başarılı → { data: ... }          hata → { error: { code, message, errors? } }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createArticle, listArticles, slugExists } from '@/src/lib/articles/store'
import { validateCreateInput } from '@/src/lib/articles/validation'
import { guardWriteRequest } from '@/src/lib/api/guard'
import { invalidateAfterCreate } from '@/src/lib/articles/revalidate'
import { deleteManagedUploadFile, normalizeArticleImage } from '@/src/lib/articles/image-handler'

// Liste uçları istek başlığı okur; önbelleğe alınmadan her istekte canlı çalışsın.
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  const articles = await listArticles()
  return NextResponse.json(
    { count: articles.length, data: articles },
    { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } },
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1) Ortak yazma koruması: hız sınırı + Bearer token doğrulaması.
  const failure = guardWriteRequest(request)
  if (failure) return failure

  // 2) Gövde ayrıştırma.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: { code: 'invalid_json', message: 'İstek gövdesi geçerli JSON değil.' } },
      { status: 400 },
    )
  }

  // 3) Doğrulama + temizlik.
  const result = validateCreateInput(body)
  if (!result.ok) {
    return NextResponse.json(
      { error: { code: 'validation_failed', message: 'Gönderilen alan geçersiz.', errors: result.errors } },
      { status: result.status },
    )
  }

  // 4) Slug çakışması → görsel indirilmeden ÖNCE kontrol edilir; aksi halde
  //    409 yolunda indirilen dosya diskte orphan olarak kalır.
  if (await slugExists(result.article.slug)) {
    return NextResponse.json(
      {
        error: {
          code: 'slug_conflict',
          message: `Bu slug zaten kullanımda: ${result.article.slug}`,
        },
      },
      { status: 409 },
    )
  }

  // 5) Görseli işle: harici URL ise indirip public/img/'a kaydet, yerel yolu döndür
  const processedImage = await normalizeArticleImage(result.article.image, result.article.slug)
  if (!processedImage) {
    return NextResponse.json(
      { error: { code: 'image_processing_failed', message: 'Görsel işlenemedi.' } },
      { status: 400 },
    )
  }
  result.article.image = processedImage

  // 6) Kalıcı yazım (kilit altında).
  const created = await createArticle(result.article)
  if (!created) {
    // Kilit altında oluşabilecek çok nadir yarış: istemci tekrar denesin.
    // Az önce indirilen görseli sil; kayıtsız makale için orphan birikmesin.
    await deleteManagedUploadFile(processedImage)
    return NextResponse.json(
      { error: { code: 'slug_conflict', message: 'Slug bu sırada dolu; tekrar deneyin.' } },
      { status: 409 },
    )
  }

  // 7) Site önbelleklerini tazele.
  invalidateAfterCreate()

  return NextResponse.json({ data: created }, { status: 201 })
}
