/**
 * Site genelinde tek origin kaynağı.
 *
 * OG/canonical URL'ler, JSON-LD ve sitemap aynı sabiti ve aynı görsel
 * normalizasyon kuralını kullanır; origin değişirse tek yerden güncellenir.
 */
export const SITE_URL = 'https://printwater.com'

/** Görsel yolunu mutlak URL'ye çevirir (göreceli yollar site origin'i ile). */
export function resolveImageUrl(image: string): string {
  return image.startsWith('http') ? image : `${SITE_URL}${image}`
}
