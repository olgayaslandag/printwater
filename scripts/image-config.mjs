/**
 * Görsel işleme kurallarının TEK kaynağı.
 *
 * Bu modül hem statik optimizasyon betiği (`scripts/optimize-images.mjs`) hem
 * de runtime görsel işleyicisi (`src/lib/articles/image-handler.ts`) tarafından
 * kullanılır; kalite/boyut kuralları burada değiştirilir, iki tarafın çıktısı
 * daima tutarlı kalır.
 */

/** WebP çıktı kuralları (statik betik ve API indirme akışı ortak kullanır). */
export const IMAGE_LIMITS = {
  /** En uzun kenar sınırı; büyütme yapılmaz. */
  MAX_DIMENSION: 1920,
  /** Bu kenara kadar olan alfa'lı görseller kayıpsız (lossless) üretilir. */
  SMALL_GRAPHIC_MAX_EDGE: 600,
  /** Kayıpsız çıktı kalitesi. */
  LOSSLESS_QUALITY: 100,
  /** Fotoğraf çıktı kalitesi. */
  PHOTO_QUALITY: 80,
  /** sharp WebP kodlama çabası (0-6). */
  WEBP_EFFORT: 6,
}

/** Build-time responsive varyantları için genişlikler (100vw için srcset). */
export const RESPONSIVE_WIDTHS = [480, 768, 1024, 1440, 1920]

/**
 * Küçük/logo/grafik görseller için kayıpsız çıktı gerekip gerekmediğini belirler.
 * Yalnızca alfa kanalı olan görseller kayıpsız üretilebilir; logo adlı dosyalar
 * küçük olmasa da grafik niteliğinde olduğu için kayıpsız üretilir.
 *
 * @param {string} sourceName Kaynak dosya adı (yol değil; logo testi için).
 * @param {boolean} hasAlpha Görselin alfa kanalı var mı?
 * @param {number} maxEdge En uzun kenar (px).
 * @returns {boolean}
 */
export function shouldUseLossless(sourceName, hasAlpha, maxEdge) {
  if (!hasAlpha) {
    return false
  }
  if (maxEdge <= IMAGE_LIMITS.SMALL_GRAPHIC_MAX_EDGE) {
    return true
  }
  return /logo/i.test(sourceName)
}

/**
 * sharp `.webp()` çağrısına geçilecek seçenekleri üretir.
 *
 * @param {boolean} hasAlpha Görselin alfa kanalı var mı?
 * @param {boolean} lossless Kayıpsız çıktı isteniyor mu?
 * @returns {import('sharp').WebpOptions}
 */
export function buildWebpOptions(hasAlpha, lossless) {
  if (hasAlpha) {
    return {
      quality: lossless ? IMAGE_LIMITS.LOSSLESS_QUALITY : IMAGE_LIMITS.PHOTO_QUALITY,
      alphaQuality: 100,
      smartSubsample: true,
      lossless,
      effort: IMAGE_LIMITS.WEBP_EFFORT,
    }
  }
  return {
    quality: IMAGE_LIMITS.PHOTO_QUALITY,
    effort: IMAGE_LIMITS.WEBP_EFFORT,
  }
}
