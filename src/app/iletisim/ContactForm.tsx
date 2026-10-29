'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus(null)
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const body: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (typeof value === 'string') body[key] = value
    })

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus({ type: 'success', message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' })
        form.reset()
      } else {
        setStatus({ type: 'error', message: data?.error?.message || 'Gönderim başarısız. Lütfen tekrar deneyin.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Gönderim başarısız. Lütfen tekrar deneyin.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ padding: '40px' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '24px' }}>Mesaj Gönderin</h3>
      <form onSubmit={onSubmit}>
        <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Ad</label>
            <input type="text" id="firstName" name="firstName" required minLength={2} style={{ width: '100%', padding: '14px 16px', border: '1px solid #dfe8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div>
            <label htmlFor="lastName" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Soyad</label>
            <input type="text" id="lastName" name="lastName" required minLength={2} style={{ width: '100%', padding: '14px 16px', border: '1px solid #dfe8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>E-Posta</label>
            <input type="email" id="email" name="email" required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dfe8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
          <div>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Telefon</label>
            <input type="tel" id="phone" name="phone" style={{ width: '100%', padding: '14px 16px', border: '1px solid #dfe8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
          </div>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="subject" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Konu</label>
          <select id="subject" name="subject" required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dfe8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
            <option value="">Konu Seçiniz</option>
            <option value="su-aritma">Su Arıtma Sistemleri</option>
            <option value="nemlendirme">Nemlendirme Sistemleri</option>
            <option value="teknik-destek">Teknik Destek</option>
            <option value="proje-talep">Proje Talebi</option>
            <option value="diger">Diğer</option>
          </select>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Mesaj</label>
          <textarea id="message" name="message" rows={5} required minLength={10} style={{ width: '100%', padding: '14px 16px', border: '1px solid #dfe8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
        </div>
        {status && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', background: status.type === 'success' ? '#f0fdf4' : '#fef2f2', color: status.type === 'success' ? '#166534' : '#991b1b', fontSize: '14px' }}>
            {status.message}
          </div>
        )}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px 32px', fontSize: '14px' }} disabled={loading}>
          {loading ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}
        </button>
      </form>
    </div>
  )
}
