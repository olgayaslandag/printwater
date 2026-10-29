import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import BreadcrumbSchema from '@/src/components/Schema/BreadcrumbSchema'
import { SITE_URL } from '@/src/lib/site'

function IconStar() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconStrength() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconRocket() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14.5 3.5c2.6.4 4.7 2.5 5 5.1.4 3.2-1.5 6.5-5.7 10l-3.2-3.2c3.4-4.2 4.3-8.1 3.9-11.9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m10.6 15.4-3.1.8-1.7 2.9 3.5-.5 1.3-3.2ZM8.6 11.4 5 10l-2 1.7 3.5 2.1 2.1-2.4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="15.7" cy="8.3" r="1.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function IconBalance() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.2 2M12 3.5V5M12 19v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'İnsan Kaynakları',
  description: 'PrintWater insan kaynakları. Dinamik ekibimizle birlikte çalışın. Kariyer fırsatları ve açık pozisyonlar.',
  openGraph: {
    title: 'İnsan Kaynakları | PrintWater',
    description: 'Dinamik ekibimizle birlikte çalışın. Kariyer fırsatları ve açık pozisyonlar.',
    url: 'https://printwater.com/insan-kaynaklari',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/corporate-office.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater İnsan Kaynakları',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'İnsan Kaynakları | PrintWater',
    description: 'Dinamik ekibimizle birlikte çalışın. Kariyer fırsatları ve açık pozisyonlar.',
    images: ['/img/corporate-office.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/insan-kaynaklari',
  },
}

export default function HumanResourcesPage() {
  return (
    <>
      <Header />
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', url: SITE_URL },
        { name: 'İnsan Kaynakları', url: 'https://printwater.com/insan-kaynaklari' },
      ]} />
      <main>
        <Hero
          eyebrow="İNSAN KAYNAKLARI"
          title={
            <>
              Birlikte Büyüyen,<br />Birlikte Gelişen Ekibiz
            </>
          }
          description="Yaratıcı, özgüvenli ve öğrenmeye açık bireyleri aramızda görmekten mutluluk duyarız."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">EKİP KULTÜRÜMÜZ</div>
                <h2>Değerlerimizle Bireyi Öncelikli Tutuyoruz</h2>
              </div>
            </Reveal>
            <Reveal as="div" delay={100}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                {[
                  {
                    icon: <IconStar />,
                    title: 'Gelişim Fırsatı',
                    desc: 'Sürekli eğitim ve gelişim programları ile kariyerinizi ilerletin.'
                  },
                  {
                    icon: <IconStrength />,
                    title: 'Güçlü Ekip Ruhu',
                    desc: 'İşbirliği içinde çalıştığımız, birbirimize destek olduğumuz bir ortam.'
                  },
                  {
                    icon: <IconRocket />,
                    title: 'Yenilikçi Yaklaşım',
                    desc: 'Fikirlerinizi öncelikli tuttuğumuz, yenilikçi projelere yer verdiğimiz bir ortam.'
                  },
                  {
                    icon: <IconBalance />,
                    title: 'İş-Yaşam Dengesi',
                    desc: 'Verimli çalışma saatleri ve esnek çalışma imkanları ile yaşam kalitenizi koruyun.'
                  },
                ].map((item, index) => (
                  <Reveal key={index} as="article" className="card" delay={index * 100}>
                    <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#1684f5' }}>
                        {item.icon}
                      </div>
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
                <div className="kicker">KARİYER</div>
                <h2>Açık Pozisyonlar</h2>
              </div>
            </Reveal>
            <Reveal as="div" delay={100}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {[
                  {
                    title: 'Satış Mühendisi',
                    loc: 'İstanbul / Tam Zamanlı',
                    desc: 'Matbaa ve tekstil endüstrilerine su arıtma ve nemlendirme sistemleri satışı.'
                  },
                  {
                    title: 'Teknik Servis Uzmanı',
                    loc: 'İstanbul / Tam Zamanlı',
                    desc: 'Sistem bakım, onarım ve kurulum işlemleri. Mekatronik veya elektrik-elektronik mezunları.'
                  },
                  {
                    title: 'Proje Mühendisi',
                    loc: 'İstanbul / Tam Zamanlı',
                    desc: 'Endüstriyel su arıtma ve nemlendirme projelerinin planlanması ve yürütülmesi.'
                  },
                  {
                    title: 'Stajyer Mühendis',
                    loc: 'İstanbul / Staj',
                    desc: 'Mühendislik bölümü son sınıf öğrencileri için staj programı.'
                  },
                ].map((job, index) => (
                  <Reveal key={index} as="article" className="card" delay={index * 100}>
                    <div className="card-body" style={{ padding: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>{job.title}</h3>
                        <span style={{ fontSize: '12px', color: '#647386', fontWeight: 600 }}>{job.loc}</span>
                      </div>
                      <p style={{ color: '#647386', lineHeight: '1.7', margin: 0, fontSize: '14px' }}>{job.desc}</p>
                      <a href="/iletisim" className="link" style={{ marginTop: '16px' }}>BAŞVURU YAP →</a>
                    </div>
                  </Reveal>
                ))}
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
