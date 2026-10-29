/**
 * Bilgi Merkezi veri katmanı — geriye dönük uyumluluk arayüzü.
 *
 * İçerik artık kalıcı depoda (src/lib/articles/store.ts); bu dosya eski
 * import yollarını (`@/src/components/Insights/articles`) ve async imzaları
 * koruyan ince bir yönlendiricidir. Statik tohum: src/lib/articles/seed.ts.
 */

import type { Article } from '../../lib/articles/types'
import { findArticle, listArticles } from '../../lib/articles/store'

export type { Article }

/** Yayındaki tüm makaleleri getirir (yeni → eski). */
export async function getArticles(): Promise<Article[]> {
  return listArticles()
}

/**
 * Slug ile tek makale getirir; bulunamazsa null → sayfa notFound() edebilir.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return findArticle(slug)
}
