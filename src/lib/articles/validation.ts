/**
 * API girdi doğrulama ve slug üretimi.
 *
 * Kurallar `.kilo/rules/coding-standards.md` (a11y: imageAlt zorunlu) ve
 * `content-rules.md` (benzersiz slug, tek H1 — gövde H1 içeremez) ile
 * uyumludur. Hatalar alan bazında toplanıp tek yanıtta döner.
 */

import type { Article, ArticleInput } from './types'
import { sanitizeArticleHtml } from './sanitize'

/** Slug biçimi: küçük harf/ rakam, tireyle ayrılmış gruplar. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const LIMITS = {
  slug: 200,
  tag: 60,
  title: 200,
  description: 500,
  image: 500,
  imageAlt: 250,
  content: 200_000,
} as const

/** Türkçe karakterleri de kapsayan URL-güvenli slug üretir. */
export function slugify(input: string): string {
  const trMap: Record<string, string> = {
    ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
    â: 'a', î: 'i', û: 'u', é: 'e', è: 'e',
  }
  return input
    // Türkçe harfi önceden değiştir; NFKD önceden çalışırsa ç/ş/ü/ö/ğ/Ç gibi
    // harfler temel+birleştiriş işaretine ayrılır ve işaret tireyle
    // değiştirilir (ör. "Çanakkale" → "c-anakkale" yerine "canakkale" çıkar).
    .replace(/[çğıöşüâîûéèÇĞİÖŞÜÂÎÛÉÈ]/g, (ch) => trMap[ch] ?? ch)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, LIMITS.slug)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function checkLength(
  errors: string[],
  field: keyof typeof LIMITS,
  value: string,
): void {
  if (value.length > LIMITS[field]) {
    errors.push(`${field} en fazla ${LIMITS[field]} karakter olabilir (gelen: ${value.length})`)
  }
}

/** Görsel alanı hem site içi /img/ yolları hem de harici https:// / http:// URL'lerini kabul eder. */
function isValidImage(value: string): boolean {
  return value.startsWith('/img/') || value.startsWith('/') || /^https?:\/\//i.test(value)
}

function validateIsoDate(value: string): boolean {
  return !Number.isNaN(new Date(value).getTime())
}

export interface CreateResult {
  ok: true
  article: Article
}

export interface FailureResult {
  ok: false
  /** HTTP durum kodu: 400 doğrulama, 422 biçim vb. */
  status: number
  errors: string[]
}

/**
 * POST gövdesini doğrular → temizlenmiş Article üretir.
 * slug yoksa başlıktan türetilir; publishedAt yoksa şimdi kullanılır.
 */
export function validateCreateInput(raw: unknown): CreateResult | FailureResult {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, status: 400, errors: ['İstek gövdesi bir JSON nesnesi olmalıdır'] }
  }
  const input = raw as ArticleInput
  const errors: string[] = []

  const tag = isNonEmptyString(input.tag) ? input.tag.trim() : ''
  const title = isNonEmptyString(input.title) ? input.title.trim() : ''
  const description = isNonEmptyString(input.description) ? input.description.trim() : ''
  const image = isNonEmptyString(input.image) ? input.image.trim() : ''
  const imageAlt = isNonEmptyString(input.imageAlt) ? input.imageAlt.trim() : ''
  const rawContent = typeof input.content === 'string' ? input.content : ''
  const content = sanitizeArticleHtml(rawContent)

  if (!tag) errors.push('tag zorunludur')
  if (!title) errors.push('title zorunludur')
  if (!description) errors.push('description zorunludur')
  if (!image) errors.push('image zorunludur')
  if (!imageAlt) errors.push('imageAlt zorunludur (erişilebilirlik)')
  if (!content.trim()) errors.push('content zorunludur (boş veya tamamen geçersiz HTML)')

  if (tag) checkLength(errors, 'tag', tag)
  if (title) checkLength(errors, 'title', title)
  if (description) checkLength(errors, 'description', description)
  if (image) checkLength(errors, 'image', image)
  if (imageAlt) checkLength(errors, 'imageAlt', imageAlt)
  if (content) checkLength(errors, 'content', content)

  if (image && !isValidImage(image)) {
    errors.push('image geçersiz bir URL veya yol. /img/ ile başlayan bir yol veya https:// / http:// adresi olmalıdır')
  }

  let slug: string
  if (isNonEmptyString(input.slug)) {
    slug = input.slug.trim().toLowerCase()
    if (!SLUG_PATTERN.test(slug)) {
      errors.push('slug biçimi geçersiz: yalnızca küçük harf, rakam ve tire kullanın')
    }
    checkLength(errors, 'slug', slug)
  } else {
    slug = slugify(title)
    if (!slug) errors.push('slug üretilemedi: title veya slug zorunludur')
  }

  let publishedAt = new Date().toISOString()
  if (input.publishedAt !== undefined) {
    if (!isNonEmptyString(input.publishedAt) || !validateIsoDate(input.publishedAt)) {
      errors.push('publishedAt geçerli bir ISO-8601 tarih metni olmalıdır')
    } else {
      publishedAt = new Date(input.publishedAt).toISOString()
    }
  }

  if (errors.length > 0) {
    return { ok: false, status: 400, errors }
  }

  return {
    ok: true,
    article: { tag, title, description, image, imageAlt, slug, content, publishedAt, updatedAt: publishedAt },
  }
}

/**
 * PUT gövdesini doğrular → yalnızca verilen alanlardan yama üretir.
 * slug alanı yok sayılır (kaynak kimliği URL'den gelir).
 */
export function validateUpdateInput(raw: unknown): { ok: true; patch: Partial<Article> } | FailureResult {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { ok: false, status: 400, errors: ['İstek gövdesi bir JSON nesnesi olmalıdır'] }
  }
  const input = raw as ArticleInput
  const errors: string[] = []
  const patch: Partial<Article> = {}

  if (Object.keys(input).length === 0) {
    errors.push('Güncellenecek en az bir alan gönderilmelidir')
  }
  if (input.slug !== undefined) {
    errors.push('slug değiştirilemez; kaynak adresi URL parametresinden alınır')
  }

  const stringFields = ['tag', 'title', 'description', 'image', 'imageAlt'] as const
  for (const field of stringFields) {
    const value = input[field]
    if (value === undefined) continue
    if (!isNonEmptyString(value)) {
      errors.push(`${field} boş olmayan bir metin olmalıdır`)
      continue
    }
    const trimmed = value.trim()
    checkLength(errors, field, trimmed)
    if (field === 'image' && !isValidImage(trimmed)) {
      errors.push('image geçersiz bir URL veya yol. /img/ ile başlayan bir yol veya https:// / http:// adresi olmalıdır')
    }
    patch[field] = trimmed
  }

  if (input.content !== undefined) {
    if (typeof input.content !== 'string') {
      errors.push('content metin olmalıdır')
    } else {
      const content = sanitizeArticleHtml(input.content)
      checkLength(errors, 'content', content)
      if (!content.trim()) {
        errors.push('content boş veya tamamen geçersiz HTML olamaz')
      } else {
        patch.content = content
      }
    }
  }

  if (input.publishedAt !== undefined) {
    if (!isNonEmptyString(input.publishedAt) || !validateIsoDate(input.publishedAt)) {
      errors.push('publishedAt geçerli bir ISO-8601 tarih metni olmalıdır')
    } else {
      patch.publishedAt = new Date(input.publishedAt).toISOString()
    }
  }

  if (input.updatedAt !== undefined) {
    if (!isNonEmptyString(input.updatedAt) || !validateIsoDate(input.updatedAt)) {
      errors.push('updatedAt geçerli bir ISO-8601 tarih metni olmalıdır')
    } else {
      patch.updatedAt = new Date(input.updatedAt).toISOString()
    }
  }

  if (errors.length > 0) {
    return { ok: false, status: 400, errors }
  }
  // Değişiklik yapıldığında updatedAt'i otomatik olarak güncelle
  if (Object.keys(patch).length > 0) {
    patch.updatedAt = new Date().toISOString()
  }
  return { ok: true, patch }
}
