/**
 * Bilgi Merkezi makale sözleşmesi.
 *
 * Hem statik tohum kaynağı (seed.ts) hem de API üzerinden gelen yazımlar
 * (store.ts + /api/v1/articles) bu tek arayüzü kullanır.
 */

export interface Article {
  /** Kategori etiketi (örn. "MAKALE", "TEKNİK BİLGİ"). */
  tag: string
  /** Makale başlığı (H1 olarak render edilir). */
  title: string
  /** Liste/OG kartı için kısa özet. */
  description: string
  /** Kapak görseli: site içi yol ("/img/...") veya https tam adres. */
  image: string
  /** Erişilebilirlik: görsel alt metni (zorunlu). */
  imageAlt: string
  /** URL kimliği: küçük harf, tireli, benzersiz. */
  slug: string
  /** Temizlenmiş (sanitize edilmiş) statik HTML gövde. */
  content: string
  /** ISO-8601 yayın tarihi. */
  publishedAt: string
  /** ISO-8601 son güncelleme tarihi; yoksa publishedAt kullanılır. */
  updatedAt?: string
}

/** API'ye dışarıdan gönderilen ham nesne; alanlar zorunlu olmayabilir. */
export type ArticleInput = Partial<Record<keyof Article, unknown>>
