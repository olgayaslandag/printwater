import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import BreadcrumbSchema from '@/src/components/Schema/BreadcrumbSchema'
import { SITE_URL } from '@/src/lib/site'

export const metadata: Metadata = {
  title: 'Kalite Politikamız',
  description: 'PrintWater kalite politikamız. Toplam kalite anlayışıyla müşteri memnuniyetini öncelikli hedefliyoruz.',
  openGraph: {
    title: 'Kalite Politikamız | PrintWater',
    description: 'Toplam kalite anlayışıyla müşteri memnuniyetini öncelikli hedefliyoruz.',
    url: 'https://printwater.com/kalite-politikamiz',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/corporate-office.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Kalite Politikamız',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Kalite Politikamız | PrintWater',
    description: 'Toplam kalite anlayışıyla müşteri memnuniyetini öncelikli hedefliyoruz.',
    images: ['/img/corporate-office.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/kalite-politikamiz',
  },
}

export default function QualityPolicyPage() {
  return (
    <>
      <Header />
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', url: SITE_URL },
        { name: 'Kalite Politikamız', url: 'https://printwater.com/kalite-politikamiz' },
      ]} />
      <main>
        <Hero
          eyebrow="KALİTE POLİTİKAMIZ"
          title={
            <>
              Toplam Kalite,<br />Sürekli İyileştirme
            </>
          }
          description="Kurulduğumuz günden bu yana kalite unsurunu esas aldık ve sürekli iyileştirme yolculuğundayız."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">KALİTE POLİTİKAMIZ</div>
                <h2>Kalite Her Aşamada Önceliğimiz</h2>
              </div>
            </Reveal>
            <Reveal as="div" delay={100}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {[
                  {
                    icon: '🎯',
                    title: 'Müşteri Odaklılık',
                    desc: 'Müşteri beklentilerini anlamak ve beklentileri aşan ürün ve hizmetler sunmak temel ilkemizdir.'
                  },
                  {
                    icon: '📋',
                    title: 'Sürekli İyileştirme',
                    desc: 'Tüm süreçlerimizi sürekli gözden geçiriyor ve iyileştiriyor, kalite standartlarımızı yükseltiyoruz.'
                  },
                  {
                    icon: '🤝',
                    title: 'Söz Veren İşbirliği',
                    desc: 'Çalışanlarımız, tedarikçilerimiz ve müşterilerimizle şeffaf iletişim kurarak güvene dayalı ilişkiler kuruyoruz.'
                  },
                  {
                    icon: '🔬',
                    title: 'Teknik Uzmanlık',
                    desc: 'Ar-Ge faaliyetlerine yatırım yaparak, en son teknolojileri ürünlerimize entegre ediyoruz.'
                  },
                  {
                    icon: '🌱',
                    title: 'Çevre Bilinci',
                    desc: 'Çevreye duyarlı üretim süreçleri ve enerji verimliliği odaklı çözümler üretiyoruz.'
                  },
                  {
                    icon: '🛡️',
                    title: 'Yasal Uyumluluk',
                    desc: 'Tüm mevzuat ve standartlara uygun hareket ederek, güvenilir ve kaliteli ürünler sunuyoruz.'
                  },
                ].map((item, index) => (
                  <Reveal key={index} as="article" className="card" delay={index * 100}>
                    <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
                      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{item.title}</h3>
                      <p style={{ color: '#647386', lineHeight: '1.7', margin: 0, fontSize: '14px' }}>{item.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">SÜREKLİ İYİLEŞTİRME</div>
                <h2>Kalite Yönetim Sistemi</h2>
              </div>
            </Reveal>
            <Reveal as="div" delay={100}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                <div>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                    Kalite yönetim sistemimiz, üretimden son kullanıcıya kadar tüm süreçlerde kaliteyi
                    esas alarak tasarlanmıştır. Tüm çalışanlarımızın kalite bilinci ve sorumluluğu ile,
                    sürekli iyileştirme kültürü oluşturuyoruz.
                  </p>
                  <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                    Ürünlerimiz geliştirme, tedarik, üretim, test, kurulum ve servis aşamalarında
                    titizlikle kontrol mekanizmaları uyguluyoruz. Bu sayede her bir ürünümüz,
                    en yüksek kalite standartlarını karşılayarak müşterilerimize ulaşır.
                  </p>
                </div>
                <Reveal as="div" direction="right" delay={200}>
                  <img
                    src="/img/teknoloji-yaklasim.webp"
                    alt="Kalite Yönetim Sistemi"
                    style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(11,35,57,0.15)' }}
                  />
                </Reveal>
              </div>
            </Reveal>
          </div>
        </Reveal>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
