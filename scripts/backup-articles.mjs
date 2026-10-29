#!/usr/bin/env node
/**
 * Bilgi Merkezi veri deposu (articles.json) yedekleme betiği.
 *
 * Bağımlılıksız Node.js (ESM); cron veya systemd timer ile günlük çalıştırılır.
 *
 * Davranış:
 * - Kaynak: `ARTICLES_DATA_FILE` env'i (yoksa `data/articles.json`).
 *   ⚠ Yol sözleşmesinin sahibi `src/lib/articles/store.ts` → `getDataFilePath()`
 *   'dür; store'daki varsayılanı veya env adını değiştirirseniz bu betiği de
 *   eşitleyin (bağımlılıksız betik TS modülünü import edemez).
 * - Hedef: `ARTICLES_BACKUP_DIR` env'i (yoksa `backups/articles/`).
 * - Kaynak dosyaya zaman damgalı kopya yazar: `articles-<ISO>.json`.
 * - `latest.json` sembolik bağını en yeni kopyaya günceller (symlink
 *   desteklenmezse düz kopya olarak yazar).
 * - En yeni `ARTICLES_BACKUP_KEEP` (varsayılan 14) kopyayı saklar, eskileri siler.
 * - Kaynak yoksa:
 *   - Env **ayarlanmamışsa** (API hiç yazmamış, seed fallback aktif) sessizce
 *     0 ile çıkar; cron günlüğü kirlenmez.
 *   - Env **açıkça ayarlanmışsa** beklenen dosyanın yokluğu bir yapılandırma
 *     hatasıdır: hata loglanır ve 1 ile çıkılır (sessiz veri kaybı olmasın).
 *
 * Örnek crontab satırı (her gece 03:00):
 *   0 3 * * * cd /app && /usr/local/bin/node scripts/backup-articles.mjs
 */

import { access, copyFile, mkdir, readdir, stat, symlink, unlink } from 'node:fs/promises'
import path from 'node:path'

const SOURCE = process.env.ARTICLES_DATA_FILE
  ? path.resolve(process.env.ARTICLES_DATA_FILE)
  : path.resolve('data/articles.json')

const BACKUP_DIR = process.env.ARTICLES_BACKUP_DIR
  ? path.resolve(process.env.ARTICLES_BACKUP_DIR)
  : path.resolve('backups/articles')

/** Saklanacak yedek sayısı; test için env ile düşürülebilir. */
const KEEP = Number.parseInt(process.env.ARTICLES_BACKUP_KEEP ?? '14', 10)
const KEEP_SAFE = Number.isFinite(KEEP) && KEEP >= 1 ? KEEP : 14

const BACKUP_NAME_PREFIX = 'articles-'
const BACKUP_NAME_SUFFIX = '.json'
const LATEST_NAME = 'latest.json'

/** `2026-10-27T19-00-00-123Z` biçiminde, dosya adına uygun zaman damgası. */
function timestampForFileName(date) {
  return date.toISOString().replace(/[:.]/g, '-')
}

/** Yedek dosya adlarından kronolojik sıralanabilir anahtar üretir. */
function backupSortKey(name) {
  // articles-<timestamp>.json → timestamp UTF-8 sıralaması kronolojiktir.
  return name.slice(BACKUP_NAME_PREFIX.length, -BACKUP_NAME_SUFFIX.length)
}

async function main() {
  const explicitSource = Boolean(process.env.ARTICLES_DATA_FILE)

  // Kaynak yoksa: env ayarlanmamışsa sessiz çık (API hiç yazmadıysa seed
  // fallback zaten veriyi statik tohumdan besler; yedeklenecek runtime verisi
  // yoktur). Env açıkça ayarlanmışsa bu bir yapılandırma hatasıdır — yüksek
  // sesle bildir, aksi halde yedekler hatasız gibi görünürken durur.
  try {
    await access(SOURCE)
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === 'ENOENT') {
      if (explicitSource) {
        console.error(
          `[backup-articles] ARTICLES_DATA_FILE ayarlı ama kaynak dosya yok: ${SOURCE}`,
        )
        process.exitCode = 1
      }
      return
    }
    throw error
  }

  await mkdir(BACKUP_DIR, { recursive: true })

  const stamp = timestampForFileName(new Date())
  const backupName = `${BACKUP_NAME_PREFIX}${stamp}${BACKUP_NAME_SUFFIX}`
  const backupPath = path.join(BACKUP_DIR, backupName)
  await copyFile(SOURCE, backupPath)

  // latest.json: symlink destekleniyorsa bağ, değilse düz kopya.
  const latestPath = path.join(BACKUP_DIR, LATEST_NAME)
  try {
    await unlink(latestPath).catch(() => undefined)
    await symlink(backupName, latestPath)
  } catch {
    try {
      await copyFile(backupPath, latestPath)
    } catch (error) {
      console.error('[backup-articles] latest.json güncellenemedi:', error)
    }
  }

  // Rotasyon: en yeni KEEP_SAFE kopyayı tut, eskileri sil.
  const entries = await readdir(BACKUP_DIR)
  const backups = entries
    .filter((name) => name.startsWith(BACKUP_NAME_PREFIX) && name.endsWith(BACKUP_NAME_SUFFIX))
    .sort((a, b) => backupSortKey(b).localeCompare(backupSortKey(a))) // yeni → eski

  for (const stale of backups.slice(KEEP_SAFE)) {
    try {
      await unlink(path.join(BACKUP_DIR, stale))
    } catch (error) {
      console.error('[backup-articles] Eski yedek silinemedi:', stale, error)
    }
  }

  process.stdout.write(`[backup-articles] ${backupPath} (${backups.length}/${KEEP_SAFE})\n`)
}

main().catch((error) => {
  console.error('[backup-articles] Yedekleme başarısız:', error)
  process.exit(1)
})
