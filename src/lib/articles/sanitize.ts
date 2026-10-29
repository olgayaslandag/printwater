/**
 * API üzerinden gelen makale HTML gövdesi için sunucu tarafı temizlik.
 *
 * Makale içeriği sitede `dangerouslySetInnerHTML` ile render edildiğinden,
 * dış platformdan gelen içerik XSS riski taşır. Regex tabanlı kara-liste
 * temizliği gerçek bir HTML parser'ın atlayabildiği vektörleri kapatamaz
 * (örn. tırnaklı değerden sonra `/` ayracıyla eklenen `onerror=...` özniteliği
 * veya `javascript&colon;` / `javascript&#58;` gibi entity kodlamalı şemalar).
 *
 * Bu nedenle temizlik DOMPurify (isomorphic-dompurify; Node tarafında jsdom
 * parser'ıyla) üzerinden **allowlist** yaklaşımıyla yapılır:
 *   - Yalnızca {@link ALLOWED_TAGS} / {@link ALLOWED_ATTR} içindeki etiket ve
 *     öznitelikler korunur; geri kalan her şey (script, iframe, form, svg,
 *     math, tüm on* olay yöneticileri...) parser seviyesinde kaldırılır.
 *   - URL şemaları için DOMPurify'in entity-aware denetimi devrededir
 *     (`javascript&colon;` gibi kodlamalar ayrıştırmadan önce çözülür).
 *   - `data:` yalnızca eski politika ile aynı biçimde rastgele medya
 *     tiplerine (png/jpeg/webp/gif;base64) izin verir.
 *   - `style` niteliği korunur (mevcut içerik bunlara bağımlıdır).
 */

import DOMPurify from 'isomorphic-dompurify'

/** Gövdede kalmasına izin verilen etiketler (mevcut içerik kümesi + yaygın güvenli eklentiler). */
const ALLOWED_TAGS = [
  'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup', 'mark',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'col', 'colgroup',
  'a', 'img', 'figure', 'figcaption',
  'div', 'span',
]

/** Korunan öznitelikler; olay yöneticileri (on*) listede yok → hep kaldırılır. */
const ALLOWED_ATTR = [
  'href', 'src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height',
  'loading', 'decoding',
  'colspan', 'rowspan', 'span', 'start', 'type',
  'style', 'class', 'target', 'rel',
]

/**
 * URI şemaları: güvenli tanımlı şemalar + eski politikadaki `data:image/...`
 * medya tipi allowlist'i. `javascript:`/`vbscript:` ve `data:text/html` gibi
 * şemalar bu desenle eşleşmez → DOMPurify özniteliği kaldırır.
 */
const ALLOWED_URI_REGEXP =
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|data:image\/(?:png|jpe?g|webp|gif);base64,|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i

export function sanitizeArticleHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
  }).trim()
}
