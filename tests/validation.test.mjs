import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateCreateInput, validateUpdateInput, slugify, SLUG_PATTERN } from '../.kilo/test-build/articles/validation.js'

const baseInput = {
  tag: 'MAKALE',
  title: 'Nemlendirme Sistemleri',
  description: 'Ortam nem kontrolü hakkında kapsamlı bir açıklama.',
  image: '/img/nemlendirme-sistemi.webp',
  imageAlt: 'Nemlendirme Sistemi',
  content: '<h2>Giriş</h2><p>İçerik burası.</p>',
}

test('validateCreateInput: eksik zorunlu alanlar 400 ile hata döner', () => {
  const r = validateCreateInput({})
  assert.equal(r.ok, false)
  assert.equal(r.status, 400)
  assert.ok(r.errors.includes('tag zorunludur'))
  assert.ok(r.errors.includes('title zorunludur'))
  assert.ok(r.errors.includes('description zorunludur'))
  assert.ok(r.errors.includes('image zorunludur'))
  assert.ok(r.errors.includes('imageAlt zorunludur (erişilebilirlik)'))
  assert.ok(
    r.errors.includes('content zorunludur (boş veya tamamen geçersiz HTML)'),
  )
})

test('validateCreateInput: geçersiz image URL reddedilir', () => {
  const r = validateCreateInput({ ...baseInput, image: 'ftp://example.com/x.webp' })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('image geçersiz')))
})

test('validateCreateInput: javascript: image reddedilir', () => {
  const r = validateCreateInput({ ...baseInput, image: 'javascript:alert(1)' })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('image geçersiz')))
})

test('validateCreateInput: geçersiz slug biçimi reddedilir', () => {
  const r = validateCreateInput({ ...baseInput, slug: 'Merhaba Dünya!' })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('slug biçimi geçersiz')))
})

test('validateCreateInput: SLUG_PATTERN geçerli slugları kabul eder', () => {
  assert.equal(SLUG_PATTERN.test('nemlendirme-sistemleri'), true)
  assert.equal(SLUG_PATTERN.test('makale-123'), true)
  assert.equal(SLUG_PATTERN.test('Merhaba'), false)
  assert.equal(SLUG_PATTERN.test('a__b'), false)
})

test('validateCreateInput: slug başlıktan türetilir (Türkçe harf dönüşümü)', () => {
  const r = validateCreateInput({ ...baseInput, title: 'Endüstriyel Nemlendirme Sistemleri' })
  assert.equal(r.ok, true)
  assert.equal(r.article.slug, 'endustriyel-nemlendirme-sistemleri')
})

test('validateCreateInput: slugify Türkçe karakter dönüşümü', () => {
  assert.equal(slugify('Çanakkale ı Öğünüş'), 'canakkale-i-ogunus')
})

test('validateCreateInput: başarı sonucu article ve tarihler içerir', () => {
  const r = validateCreateInput(baseInput)
  assert.equal(r.ok, true)
  assert.equal(r.article.title, 'Nemlendirme Sistemleri')
  assert.equal(r.article.slug, 'nemlendirme-sistemleri')
  assert.equal(r.article.tag, 'MAKALE')
  assert.ok(r.article.publishedAt)
  assert.equal(r.article.updatedAt, r.article.publishedAt)
})

test('validateCreateInput: yalnızca script içeriği content olarak kabul edilmez', () => {
  const r = validateCreateInput({ ...baseInput, content: '<script>alert(1)</script>' })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('content zorunludur')))
})

test('validateUpdateInput: boş gövde hata döner', () => {
  const r = validateUpdateInput({})
  assert.equal(r.ok, false)
  assert.equal(r.status, 400)
  assert.ok(r.errors.includes('Güncellenecek en az bir alan gönderilmelidir'))
})

test('validateUpdateInput: slug alanı gönderilirse hata', () => {
  const r = validateUpdateInput({ slug: 'yeni-slug' })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('slug değiştirilemez')))
})

test('validateUpdateInput: geçerli yama updatedAt otomatik güncellenir', () => {
  const r = validateUpdateInput({ title: 'Yeni Başlık' })
  assert.equal(r.ok, true)
  assert.equal(r.patch.title, 'Yeni Başlık')
  assert.ok(r.patch.updatedAt)
})

test('validateUpdateInput: geçersiz image reddedilir', () => {
  const r = validateUpdateInput({ image: 'javascript:alert(1)' })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('image geçersiz')))
})

test('validateUpdateInput: geçerli content sanitize edilerek yamaya eklenir', () => {
  const r = validateUpdateInput({ content: '<h2>X</h2><script>bad</script>' })
  assert.equal(r.ok, true)
  assert.ok(r.patch.content.includes('<h2>X</h2>'))
  assert.ok(!r.patch.content.includes('<script>'))
})
