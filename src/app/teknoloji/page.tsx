import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import ServiceSchema from '@/src/components/Schema/ServiceSchema'
import Technology from '@/src/components/Technology/index'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'

export const metadata: Metadata = {
  title: 'Teknoloji ve Yaklaşım',
  description: 'PrintWater teknoloji yaklaşımı: su kalitesi, kontrollü nemlendirme, teknik uzmanlık. Patenti sistemler, ROI odaklı projelendirme ve 7/24 destek.',
  openGraph: {
    title: 'Teknoloji ve Yaklaşım | PrintWater',
    description: 'Patenti su teknolojileri, ROI odaklı projelendirme ve 7/24 destek ile üretiminize değer katan çözümler.',
    url: 'https://printwater.com/teknoloji',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/modern-industrial.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Teknoloji ve Yaklaşım',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Teknoloji ve Yaklaşım | PrintWater',
    description: 'Patenti su teknolojileri, ROI odaklı projelendirme ve 7/24 destek ile üretiminize değer katan çözümler.',
    images: ['/img/modern-industrial.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/teknoloji',
  },
}

export default function TechnologyPage() {
  return (
    <>
      <Header />
      <ServiceSchema
        name="PrintWater Su Teknolojileri"
        description="Patenti su teknolojileri, ROI odaklı projelendirme ve 7/24 destek ile üretiminize değer katan çözümler."
        url="https://printwater.com/teknoloji"
        image="/img/modern-industrial.webp"
        providerName="PrintWater"
        providerUrl="https://printwater.com"
        areaServed="TR"
        category="Su Arıtma ve Nemlendirme Çözümleri"
      />
      <main>
        <Technology />

<Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">PATENTLİ SİSTEMLERİMİZ</div>
                <h2>Rekabet Avantajı Sağlayan Teknolojiler</h2>
              </div>
            </Reveal>
            <div className="tech-features-grid">
              {[
                {
                  title: 'Maldiv Nemlendirme Ünitesi',
                  desc: 'Patenti atomize nozul tasarımı ile 5-10 mikron zerreçik üretimi. Damlatma/ıslatma sıfır. %99.9 buharlaşma verimliliği. PLC entegre, bölgesel kontrol.',
                  benefits: ['Damlatma sıfır', 'Bölgesel kontrol', 'Enerji verimli', 'Kompakt tasarım']
                },
                {
                  title: 'Baskı Suyu Arıtma Kabini',
                  desc: 'Kapalı/Açık kabin modellerinde tam otomatik RO sistemi. Hardness dozaj, antiscalan, UV, paslanmaz tank/hidrofor. PLC + HMI operatör paneli.',
                  benefits: ['Tam otomatk', 'Modüler genişletilebilir', 'Uzaktan erişim', 'KVKK uyumlu']
                }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '32px', height: '100%' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '20px', color: '#061625' }}>{item.title}</h3>
                  <p style={{ color: '#344254', lineHeight: '1.7', marginBottom: '20px' }}>{item.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {item.benefits.map((b, i) => (
                      <Reveal as="li" key={i} delay={i * 40} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 500 }}>
                        {b}
                      </Reveal>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">SÜREÇ YÖNETİMİ</div>
                <h2>Keşiften Destekle: Tam Döngü Hizmet</h2>
              </div>
            </Reveal>
            <div className="process-grid">
              {[
                { step: '01', title: 'Keşif ve Analiz', desc: 'Saha keşfi, su analizi, mevcut sistem incelemesi, ihtiyaç belirleme, ön maliyet tahmini' },
                { step: '02', title: 'Projelendirme', desc: 'CFD simülasyon, sistem şeması, kapasite hesabı, malzeme listesi, ROI/feasibility raporu' },
                { step: '03', title: 'Üretim ve Test', desc: 'İmalat, fabrika kabul testleri (FAT), kalite kontrol, paketleme, lojistik planlama' },
                { step: '04', title: 'Kurulum ve Başlatma', desc: 'Saha montajı, boru/elektrik/otomasyon, site kabul testleri (SAT), operatör eğitimi' },
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '32px', paddingTop: '44px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '16px', left: '24px', background: '#1684f5', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 700 }}>{item.step}</div>
                  <h3 style={{ marginTop: '12px', marginBottom: '12px', fontSize: '18px', color: '#061625' }}>{item.title}</h3>
                  <p style={{ color: '#344254', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Contact />
      </main>
      <Footer />
    </>
  )
}