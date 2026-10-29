import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sanitizeArticleHtml } from '../.kilo/test-build/articles/sanitize.js'

test('sanitize: script etiketi ve on* olay yöneticileri kaldırılır', () => {
  const out = sanitizeArticleHtml(
    '<h2>Merhaba</h2><script>alert(1)</script><p onerror="x()">paragraf</p>',
  )
  assert.ok(!out.includes('<script>'))
  assert.ok(!out.includes('onerror'))
  assert.ok(out.includes('<h2>Merhaba</h2>'))
  assert.ok(out.includes('<p>paragraf</p>'))
})

test('sanitize: javascript: şeması kaldırılır', () => {
  const out = sanitizeArticleHtml('<a href="javascript:alert(1)">link</a>')
  assert.ok(!out.includes('javascript'))
  assert.ok(out.includes('<a>link</a>') || out.includes('link'))
})

test('sanitize: style elementi kaldırılır, style özelliği korunur', () => {
  const out = sanitizeArticleHtml(
    '<style>body{color:red}</style><p style="color:blue">yazı</p>',
  )
  assert.ok(!out.includes('<style>'))
  assert.ok(!out.includes('</style>'))
  assert.ok(out.includes('style='))
  assert.ok(out.includes('color:blue'))
})

test('sanitize: h2, p, strong, ul/li korunur', () => {
  const out = sanitizeArticleHtml(
    '<h2>Başlık</h2><p>Metin <strong>kalın</strong></p><ul><li>a</li><li>b</li></ul>',
  )
  assert.ok(out.includes('<h2>Başlık</h2>'))
  assert.ok(out.includes('<strong>kalın</strong>'))
  assert.ok(out.includes('<li>a</li>'))
  assert.ok(out.includes('<li>b</li>'))
})

test('sanitize: data:image/png;base64 img kaynağı korunur', () => {
  const out = sanitizeArticleHtml('<img src="data:image/png;base64,iVBORw0KGgo" alt="x">')
  assert.ok(out.includes('data:image/png;base64'))
  assert.ok(out.includes('alt="x"'))
})

test('sanitize: class, target, rel anchor özelliği korunur', () => {
  const out = sanitizeArticleHtml(
    '<a href="https://example.com" target="_blank" rel="noopener" class="x">link</a>',
  )
  assert.ok(out.includes('target="_blank"'))
  assert.ok(out.includes('rel="noopener"'))
  assert.ok(out.includes('class="x"'))
})

test('sanitize: iframe gibi izin verilmeyen etiketler kaldırılır', () => {
  const out = sanitizeArticleHtml('<iframe src="https://x"></iframe><p>metin</p>')
  assert.ok(!out.includes('<iframe>'))
  assert.ok(out.includes('<p>metin</p>'))
})
