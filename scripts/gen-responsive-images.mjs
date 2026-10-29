#!/usr/bin/env node
/**
 * Build-time responsive görseller üretir.
 *
 * public/img/ altındaki .jpg/.jpeg/.png görselleri için public/img/responsive/
 * dizinine <basename>-<w>.webp varyantları üretir. Varyant üretimi sadece
 * orijinal boyutundan daha küçük (veya eşit ama istenmeyebilir) genişliklerde
 * yapılır; büyütme yok. Idempotent: mevcut ve daha yeni varyant dokunulmaz.
 * Manifest üretir: srcset oluşturmak için kullanılır.
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { IMAGE_LIMITS, buildWebpOptions, shouldUseLossless, RESPONSIVE_WIDTHS } from './image-config.mjs'

const ROOT_DIR = path.resolve('.')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const IMG_DIR = path.join(PUBLIC_DIR, 'img')
const OUT_DIR = path.join(IMG_DIR, 'responsive')
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'lib', 'images', 'responsive-manifest.json')

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png'])

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (path.relative(IMG_DIR, full).startsWith('responsive')) continue
      walk(full, results)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (IMAGE_EXTS.has(ext)) results.push(full)
    }
  }
  return results
}

function isNewerOrEqual(target, source) {
  try {
    const t = fs.statSync(target)
    const s = fs.statSync(source)
    return t.mtimeMs >= s.mtimeMs
  } catch {
    return false
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const sources = walk(IMG_DIR)
  const manifest = {}

  for (const src of sources) {
    const rel = path.relative(IMG_DIR, src) // e.g. hero-....webp? no, .jpg/.png
    const dir = path.dirname(rel)
    const base = path.basename(rel, path.extname(rel))
    const ext = path.extname(rel).toLowerCase()

    try {
      const image = sharp(src)
      const meta = await image.metadata()
      const width = meta.width || 0
      const height = meta.height || 0
      if (!width || !height) continue
      const hasAlpha = Boolean(meta.hasAlpha)
      const maxEdge = Math.max(width, height)
      const lossless = shouldUseLossless(base, hasAlpha, maxEdge)
      const options = buildWebpOptions(hasAlpha, lossless)
      const eff = Math.min(IMAGE_LIMITS.WEBP_EFFORT, options.effort ?? IMAGE_LIMITS.WEBP_EFFORT)

      const variants = []
      for (const w of RESPONSIVE_WIDTHS) {
        if (w >= width) continue // büyütme yok
        const outName = `${base}-${w}.webp`
        const outDir = dir === '.' ? OUT_DIR : path.join(OUT_DIR, dir)
        fs.mkdirSync(outDir, { recursive: true })
        const outPath = path.join(outDir, outName)
        if (!isNewerOrEqual(outPath, src)) {
          await sharp(src)
            .resize({ width: w, withoutEnlargement: true })
            .webp({ ...options, effort: eff })
            .toFile(outPath)
        }
        const variantRel = dir === '.' ? `responsive/${outName}` : `responsive/${dir.replace(/\\/g, '/')}/${outName}`
        variants.push(`/img/${variantRel.replace(/\\/g, '/')}`)
      }
      if (variants.length > 0) {
        const keyRel = rel.replace(/\\/g, '/').replace(/\.[^.]+$/, '.webp')
        const key = '/img/' + keyRel
        manifest[key] = {
          width,
          variants: variants,
        }
      }
    } catch (err) {
      console.error('responsive-gen hata:', src, err.message)
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log(`Responsive varyantları üretildi: ${Object.keys(manifest).length} kaynak`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
