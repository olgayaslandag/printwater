import manifest from '@/src/lib/images/responsive-manifest.json'

type ManifestEntry = {
  width: number
  variants: string[]
}

const m = manifest as Record<string, ManifestEntry>

/**
 * Manifest'te kayıtlıysa srcset üretir; yoksa null döner.
 * uploaded kapaklar gibi build-time varyantı olmayan görseller için güvenli geri düşüş.
 * sizes çağrı sahasında verilir.
 */
export function responsiveSrcSet(src: string): { srcSet: string } | null {
  const entry = m[src]
  if (!entry || !entry.variants || entry.variants.length === 0) return null
  const parts: string[] = []
  for (const v of entry.variants) {
    // v formu "/img/responsive/<rel>-480.webp"
    const wMatch = v.match(/-(\d+)\.webp$/)
    if (!wMatch) continue
    const w = parseInt(wMatch[1], 10)
    if (Number.isNaN(w)) continue
    parts.push(`${v} ${w}w`)
  }
  if (parts.length === 0) return null
  return { srcSet: parts.join(', ') }
}