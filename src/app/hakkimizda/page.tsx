import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import BreadcrumbSchema from '@/src/components/Schema/BreadcrumbSchema'
import { SITE_URL } from '@/src/lib/site'

function IconTeam() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20v-1.2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 11.5a3 3 0 0 1-1-5.7M16.5 11.5a3 3 0 0 0 1-5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconLightbulb() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 17h6M10 20h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.3 14.5A6 6 0 1 1 15.7 14.5c-.7.5-1.1 1.2-1.2 2.1H9.5c-.1-.9-.5-1.6-1.2-2.1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 3v1M4.9 6l.7.7M19.1 6l-.7.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconTool() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 3.5 19 6v5.2c0 4.3-2.8 7.8-7 9.3-4.2-1.5-7-5-7-9.3V6l7-2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m8.8 12 2.1 2.1 4.4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTrophy() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 12.5V17M9 20h6M10 17h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: '1993 yılından beri matbaa ve tekstil endüstrileri için su arıtma, atıksu arıtma ve ortam nemlendirme teknolojileri üreten PrintWater hakkında.',
  openGraph: {
    title: 'Hakkımızda | PrintWater',
    description: '30 yıllık tecrübeyle matbaa ve tekstil endüstrileri için su teknolojileri çözümleri.',
    url: 'https://printwater.com/hakkimizda',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/corporate-office.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Hakkımızda',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Hakkımızda | PrintWater',
    description: '30 yıllık tecrübeyle matbaa ve tekstil endüstrileri için su teknolojileri çözümleri.',
    images: ['/img/corporate-office.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/hakkimizda',
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', url: SITE_URL },
        { name: 'Hakkımızda', url: 'https://printwater.com/hakkimizda' },
      ]} />
      <main>
        <Hero
          eyebrow="HAKKIMIZDA"
          title="PrintWater"
          description="1993 yılından beri matbaa ve tekstil endüstrilerine su teknolojileri çözümleri sunuyoruz."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">KURUMSAL</div>
                <h2>30 Yıllık Tecrübe, Geleceğe Yönelik Çözümler</h2>
              </div>
            </Reveal>
            <div className="about-split">
              <Reveal as="div" delay={100}>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Firmamız 1993 yılında baskı endüstrisine su, atıksu arıtma ve ortam nemlendirme teknolojileri üretmek için kurulmuştur.
                  2000 yılında edindiği tüm bilgi birikimi, tecrübeleri ve enerjisiyle, nemlendirme ve serinletme teknolojileri geliştirmeye başlamıştır.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Hizmet felsefemizi kurulduğumuz günden bu yana “Toplam Kalite” kavramı ve “Zamanında Hizmet” anlayışı çerçevesinde geliştirdik.
                  Bu anlayış doğrultusunda, yönetimden insan kaynaklarına, makina parkurundan teknolojiye kadar üretim sürecinin tüm bileşenlerinde,
                  kalite unsurunu esas aldık. Böylece, artan verimlilik ve ürün/hizmet kalitesini, koşulsuz müşteri memnuniyeti ilkesi ile birleştirdik.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Üretim alanınız ne olursa olsun, deneyim ve uzmanlığımız yardımıyla beklentileri aşan ürün üretimleri için profesyonel çözümler sunarız.
                  PrintWater’ın Nemlendirme ve Serinletme konusundaki eşsiz yaklaşımı sayesinde kapsamlı bilgiden, geniş çaplı araştırmalardan
                  ve tecrübe geçmişinden yararlanırsınız.
                </p>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/teknoloji-yaklasim.webp"
                  alt="PrintWater Teknoloji Yaklaşımı"
                  style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(11,35,57,0.15)' }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">DEĞERLERİMİZ</div>
                <h2>Bizim İçin Önemli Olanlar</h2>
              </div>
            </Reveal>
            <div className="values-grid">
              <Reveal as="article" key={0} className="card" delay={100}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#1684f5' }}>
                    <IconTeam />
                  </div>
                  <h3>Profesyonel Ekip</h3>
                  <p style={{ color: '#647386', lineHeight: '1.7' }}>
                    Üretimde hassas ve ince işçilik, hizmette sorunsuz ve güler yüzlü ekip arkadaşlarımız ile %100 müşteri memnuniyeti
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" key={1} className="card" delay={200}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#1684f5' }}>
                    <IconLightbulb />
                  </div>
                  <h3>Yaratıcı ve Orijinal</h3>
                  <p style={{ color: '#647386', lineHeight: '1.7' }}>
                    Sorunların tespiti ve çözümlerine odaklanmış, teknolojiyi yakından takip eden yenilikçi bir vizyon
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" key={2} className="card" delay={300}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#1684f5' }}>
                    <IconTool />
                  </div>
                  <h3>Kaliteli Malzeme</h3>
                  <p style={{ color: '#647386', lineHeight: '1.7' }}>
                    Üretiminden son kullanıcıya kadar tüm süreçlerin yakından yürütüldüğü, onlarca testten geçen kaliteli ürün ve malzemeler
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" key={3} className="card" delay={400}>
                <div className="card-body" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', color: '#1684f5' }}>
                    <IconTrophy />
                  </div>
                  <h3>Sektörde Uzman</h3>
                  <p style={{ color: '#647386', lineHeight: '1.7' }}>
                    30 seneyi aşkın sektör tecrübesi ve bilgi birikimi ile profesyonel hizmet anlayışı
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Contact />
      </main>
      <Footer />
    </>
  )
}
