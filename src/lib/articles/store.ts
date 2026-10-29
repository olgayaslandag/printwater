/**
 * Bilgi Merkezi kalıcı veri deposu (Seçenek 1: JSON dosya depolama).
 *
 * - Okuma: `data/articles.json` varsa ondan, yoksa statik tohumdan (seed.ts)
 *   beslenir. Böylece API hiç kullanılmamışken site eski davranışıyla çalışır.
 * - Yazma: atomik (tmp dosya + rename) ve tek sıralı yazma kilidiyle yapılır;
 *   eşzamanlı CRUD istekleri dosyayı bozamaz.
 * - Not: Sunucusuz (serverless/Vercel) ortamlarda dosya sistemi kalıcı değildir;
 *   o durumda `ARTICLES_DATA_FILE` kalıcı bir diske işaret etmeli ya da
 *   veritabanı tabanlı bir store'a geçilmelidir (bkz. .kilo/build/api-docs.md).
 */

import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import path from 'path'
import SEED_ARTICLES from './seed'
import type { Article } from './types'

/** Veri dosyasının mutlak yolu (env ile taşınabilir). */
export function getDataFilePath(): string {
  const fromEnv = process.env.ARTICLES_DATA_FILE
  return fromEnv ? path.resolve(fromEnv) : path.join(process.cwd(), 'data', 'articles.json')
}

/**
 * Basit Promise zinciri tabanlı yazma kilidi (read-modify-write yarışını önler).
 * BU KILIT YALNIZCA TEK NODE SÜRECİ İÇİN GEÇERLIDIR. Cluster/PM2 veya birden
 * fazla konteyner örneği aynı JSON dosyaya yazarsa read-modify-write yarışı
 * (satır kaybı) oluşabilir. Çoklu süreç için dosya kilidi (flock) veya veritabanı
 * tabanlı bir store gerekir (bkz. docs/api-docs.md Dağıtım Notları).
 */
let writeChain: Promise<unknown> = Promise.resolve()

function withWriteLock<T>(task: () => Promise<T>): Promise<T> {
  const next = writeChain.then(task, task)
  // Kilit zinciri hata durumunda da devam etsin.
  writeChain = next.catch(() => undefined)
  return next
}

/** Dosyadan makaleleri okur; dosya yoksa null döner (seed fallback için). */
async function readFromFile(): Promise<Article[] | null> {
  try {
    const raw = await readFile(getDataFilePath(), 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      throw new Error('articles.json bir dizi değil')
    }
    return parsed as Article[]
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    if (code === 'ENOENT') return null
    // Bozuk dosya sessizce seed'e düşmesin; hata net olsun.
    throw new Error(`[articles-store] Veri dosyası okunamadı: ${(error as Error).message}`)
  }
}

/** Atomik yazma: önce .tmp, sonra rename. */
async function writeToFile(articles: Article[]): Promise<void> {
  const file = getDataFilePath()
  await mkdir(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(articles, null, 2)}\n`, 'utf8')
  await rename(tmp, file)
}

/** Yayındaki tüm makaleler (yayın tarihine göre yeni → eski). */
export async function listArticles(): Promise<Article[]> {
  const fromFile = await readFromFile()
  const articles = fromFile ?? SEED_ARTICLES
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

/** Slug ile tek makale; bulunamazsa null. */
export async function findArticle(slug: string): Promise<Article | null> {
  const articles = await listArticles()
  return articles.find((article) => article.slug === slug) ?? null
}

/** Slug'ın kullanımda olup olmadığını dosya/seed üzerinden kontrol eder. */
export async function slugExists(slug: string): Promise<boolean> {
  return (await findArticle(slug)) !== null
}

/** Yeni makale ekler; slug çakışırsa null döner (çağıran 409'a çevirir). */
export async function createArticle(article: Article): Promise<Article | null> {
  return withWriteLock(async () => {
    const current = (await readFromFile()) ?? [...SEED_ARTICLES]
    if (current.some((existing) => existing.slug === article.slug)) {
      return null
    }
    await writeToFile([...current, article])
    return article
  })
}

/**
 * Mevcut makaleyi alan bazlı günceller (PATCH semantiği PUT gövdesinde).
 * Bulunamazsa null döner.
 */
export async function updateArticle(
  slug: string,
  patch: Partial<Article>,
): Promise<Article | null> {
  return withWriteLock(async () => {
    const current = (await readFromFile()) ?? [...SEED_ARTICLES]
    const index = current.findIndex((article) => article.slug === slug)
    if (index === -1) return null
    const updated: Article = { ...current[index], ...patch, slug }
    current[index] = updated
    await writeToFile(current)
    return updated
  })
}

/** Makaleyi siler; silinen nesneyi, bulunamazsa null döner. */
export async function deleteArticle(slug: string): Promise<Article | null> {
  return withWriteLock(async () => {
    const current = (await readFromFile()) ?? [...SEED_ARTICLES]
    const index = current.findIndex((article) => article.slug === slug)
    if (index === -1) return null
    const [removed] = current.splice(index, 1)
    await writeToFile(current)
    return removed
  })
}
