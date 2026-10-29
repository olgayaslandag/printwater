import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { guardPublicWrite, clientIp } from '@/src/lib/api/guard'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const rateBlocked = guardPublicWrite(request)
    if (rateBlocked) return rateBlocked

    const contentType = request.headers.get('content-type') || ''
    let body: any = {}
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}))
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await request.formData()
      form.forEach((value, key) => {
        body[key] = typeof value === 'string' ? value : value.toString()
      })
    } else {
      // form-data da desteklenebilir
      try {
        const form = await request.formData()
        form.forEach((value, key) => {
          if (typeof value === 'string') body[key] = value
        })
      } catch {
        body = await request.json().catch(() => ({}))
      }
    }

    // Honeypot: bot doluysa sessizce başarılı kabul et
    if (body.website || body.company || body.url) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const firstName = String(body.firstName || body.ad || '').trim()
    const lastName = String(body.lastName || body.soyad || '').trim()
    const email = String(body.email || body['e-posta'] || '').trim()
    const phone = String(body.phone || body.telefon || '').trim()
    const subject = String(body.subject || body.konu || '').trim()
    const message = String(body.message || body.mesaj || '').trim()

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json({ error: { message: 'Ad ve soyad gerekli' } }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: { message: 'Geçerli e-posta gerekli' } }, { status: 400 })
    }
    if (subject.length < 2) {
      return NextResponse.json({ error: { message: 'Konu gerekli' } }, { status: 400 })
    }
    if (message.length < 10) {
      return NextResponse.json({ error: { message: 'Mesaj en az 10 karakter olmalı' } }, { status: 400 })
    }
    // Uzunluk üst sınırları: büyük gövdenin SMTP/bellek yükünü engeller.
    if (firstName.length > 100 || lastName.length > 100 || email.length > 254 || phone.length > 40 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: { message: 'Gönderilen alanlar çok uzun' } }, { status: 400 })
    }

    const host = process.env.CONTACT_SMTP_HOST
    const port = process.env.CONTACT_SMTP_PORT ? Number(process.env.CONTACT_SMTP_PORT) : 587
    const user = process.env.CONTACT_SMTP_USER
    const pass = process.env.CONTACT_SMTP_PASS
    const to = process.env.CONTACT_TO
    const from = process.env.CONTACT_FROM || user

    if (!host || !to || !from) {
      return NextResponse.json({ error: { code: 'mail_not_configured', message: 'İletişim formu yapılandırılmamış' } }, { status: 503 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    })

    const text = [
      `Ad Soyad: ${firstName} ${lastName}`,
      `E-posta: ${email}`,
      `Telefon: ${phone || '-'}`,
      `Konu: ${subject}`,
      '',
      message,
      '',
      `IP: ${clientIp(request)}`,
    ].join('\n')

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `[PrintWater İletişim] ${subject}`,
      text,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: { message: 'Gönderim başarısız' } }, { status: 500 })
  }
}
