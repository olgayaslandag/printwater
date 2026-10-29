/**
 * Yazma işlemlerinden sonra Next.js önbelleklerinin geçersiz kılınması.
 *
 * API üzerinden eklenen/güncellenen/silinen makalelerin siteye yansıması
 * build beklememek için ilgili rotalar on-demand revalidate edilir.
 * (Sayfalar ISR `revalidate` değerleriyle de periyodik tazelenir — çift emniyet.)
 */

import { revalidatePath } from 'next/cache'

/**
 * Yeni makale: liste, ana sayfa ve sitemap yenilenir.
 *
 * Not: `revalidatePath('/sitemap.xml')` Next.js 14'te `app/sitemap.ts`
 * metadata rotasının önbellek girdisini ("ROUTE" türü) geçersiz kılamaz;
 * bu nedenle sitemap `src/app/sitemap.ts` içinde `force-dynamic` olarak
 * üretilir ve her istekte güncel depodan okunur. Çağrı ileri sürüm
 * uyumluluğu için burada bırakılmıştır; zararsızdır.
 */
export function invalidateAfterCreate(): void {
  revalidatePath('/blog')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
}

/** Güncelleme/silme: ilgili detay sayfası + liste + ana sayfa + sitemap. */
export function invalidateAfterMutation(slug: string): void {
  revalidatePath(`/blog/${slug}`)
  invalidateAfterCreate()
}
