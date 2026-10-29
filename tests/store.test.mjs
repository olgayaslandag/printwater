import assert from 'node:assert/strict'
import { test } from 'node:test'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  createArticle,
  updateArticle,
  deleteArticle,
  listArticles,
  findArticle,
  slugExists,
} from '../.kilo/test-build/articles/store.js'

const seedSlug = 'endustriyel-nemlendirme-sistemleri'

const newArticle = {
  tag: 'TEKNIK BILGI',
  title: 'Test Makalesi',
  description: 'Bir test açıklaması.',
  image: '/img/test.webp',
  imageAlt: 'Test',
  slug: 'test-makalesi',
  content: '<h2>Merhaba</h2><p>İçerik.</p>',
  publishedAt: '2024-01-01T00:00:00.000Z',
}

function tempFile() {
  return path.join(
    os.tmpdir(),
    `pw-store-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.json`,
  )
}

/**
 * Her test için ARTICLES_DATA_FILE'i ${TMPDIR} altındaki geçici dosyaya
 * yönlendirir; gerçek data/articles.json'a asla dokunmaz.
 */
async function withDataFile(content, fn) {
  const file = tempFile()
  process.env.ARTICLES_DATA_FILE = file
  try {
    if (content !== undefined) await fs.writeFile(file, content, 'utf8')
    return await fn(file)
  } finally {
    delete process.env.ARTICLES_DATA_FILE
    try {
      await fs.unlink(file)
    } catch {}
  }
}

test('store: data dosyası yoksa seed fallback döner', async () => {
  await withDataFile(undefined, async () => {
    const articles = await listArticles()
    assert.equal(articles.length, 3)
    assert.ok(articles.some((a) => a.slug === seedSlug))
    assert.ok(await findArticle(seedSlug))
  })
})

test('store: bozuk JSON dosyası sessiz seed yerine hata fırlatır', async () => {
  await withDataFile('{not valid json', async () => {
    await assert.rejects(listArticles())
  })
})

test('store: yeni makale oluşturulur ve listelenir', async () => {
  await withDataFile(undefined, async () => {
    const created = await createArticle(newArticle)
    assert.equal(created.slug, 'test-makalesi')
    assert.equal(created.title, 'Test Makalesi')
    const all = await listArticles()
    assert.equal(all.length, 4) // 3 seed + 1 yeni
    const found = await findArticle('test-makalesi')
    assert.ok(found)
    assert.equal(found.title, 'Test Makalesi')
    assert.ok(await slugExists('test-makalesi'))
  })
})

test('store: slug çakışması null döner (orphan dosya bırakmaz)', async () => {
  await withDataFile(undefined, async () => {
    await createArticle(newArticle)
    const again = await createArticle(newArticle)
    assert.equal(again, null)
  })
})

test('store: makale güncellenir ve güncelleme kaydedilir', async () => {
  await withDataFile(undefined, async () => {
    await createArticle(newArticle)
    const updated = await updateArticle('test-makalesi', {
      title: 'Güncellenmiş Başlık',
      updatedAt: '2024-06-01T00:00:00.000Z',
    })
    assert.equal(updated.title, 'Güncellenmiş Başlık')
    assert.equal(updated.updatedAt, '2024-06-01T00:00:00.000Z')
    const current = await findArticle('test-makalesi')
    assert.equal(current.title, 'Güncellenmiş Başlık')
  })
})

test('store: mevcut olmayan slug güncellenemez null döner', async () => {
  await withDataFile(undefined, async () => {
    const updated = await updateArticle('yok-slug', { title: 'x' })
    assert.equal(updated, null)
  })
})

test('store: makale silinir', async () => {
  await withDataFile(undefined, async () => {
    await createArticle(newArticle)
    assert.ok(await slugExists('test-makalesi'))
    const removed = await deleteArticle('test-makalesi')
    assert.equal(removed.slug, 'test-makalesi')
    assert.equal(await findArticle('test-makalesi'), null)
    assert.equal(await slugExists('test-makalesi'), false)
  })
})
