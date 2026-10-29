import assert from 'node:assert/strict'
import { test } from 'node:test'
import { authorizeRequest } from '../.kilo/test-build/api/guard.js'
import { NextRequest } from 'next/server'

function requestWith(token) {
  return new NextRequest('http://localhost/api/v1/articles', {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  })
}

test('guard: ARTICLES_API_TOKEN tanımlı değilse 503 fail-closed', async () => {
  delete process.env.ARTICLES_API_TOKEN
  const result = authorizeRequest(requestWith('herhangi-bir-token'))
  assert.equal(result.authorized, false)
  assert.equal(result.response.status, 503)
  const body = await result.response.json()
  assert.equal(body.error.code, 'api_not_configured')
})

test('guard: yanlış Bearer token 401 döner', async () => {
  process.env.ARTICLES_API_TOKEN = 'test-token-123'
  const result = authorizeRequest(requestWith('yanlis-token'))
  assert.equal(result.authorized, false)
  assert.equal(result.response.status, 401)
  const body = await result.response.json()
  assert.equal(body.error.code, 'unauthorized')
})

test('guard: doğru Bearer token geçer', async () => {
  process.env.ARTICLES_API_TOKEN = 'test-token-123'
  const result = authorizeRequest(requestWith('test-token-123'))
  assert.equal(result.authorized, true)
})

test('guard: authorization başlığı yoksa 401 döner', async () => {
  process.env.ARTICLES_API_TOKEN = 'test-token-123'
  const result = authorizeRequest(new NextRequest('http://localhost/api/v1/articles'))
  assert.equal(result.authorized, false)
  assert.equal(result.response.status, 401)
})
