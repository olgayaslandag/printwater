import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import BreadcrumbSchema from '@/src/components/Schema/BreadcrumbSchema'
import { SITE_URL } from '@/src/lib/site'

export const metadata: Metadata = {
  title: 'Vizyon & Misyon',
  description: 'PrintWater vizyonu ve misyonu. Sürdürülebilir su teknolojileri ile sektöre yön veriyoruz.',
  openGraph: {
    title: 'Vizyon & Misyon | PrintWater',
    description: 'Sürdürülebilir su teknolojileri ile sektöre yön veriyoruz.',
    url: 'https://printwater.com/vizyon-misyon',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/corporate-office.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Vizyon & Misyon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Vizyon & Misyon | PrintWater',
    description: 'Sürdürülebilir su teknolojileri ile sektöre yön veriyoruz.',
    images: ['/img/corporate-office.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/vizyon-misyon',
  },
}

export default function VisionMissionPage() {
  return (
    <>
      <Header />
      <BreadcrumbSchema items={[
        { name: 'Ana Sayfa', url: SITE_URL },
        { name: 'Vizyon & Misyon', url: 'https://printwater.com/vizyon-misyon' },
      ]} />
      <main>
        <Hero
          eyebrow="VİZYON & MİSYON"
          title={
            <>
              Geleceği Şekillendiren<br />Sürdürülebilir Vizyon
            </>
          }
          description="30 yıllık tecrübemizle, su teknolojileri alanında sektörü takip eden yenilikçi çözümler üretiyoruz."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">VİZYONUMUZ</div>
                <h2>Sektörde Öncü Bir Marka Olmak</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
              <Reveal as="div" delay={100}>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Vizyonumuz, su teknolojileri alanında dünya standartlarında üretim ve hizmet sunarak,
                  sektörde öncü ve yenilikçi bir marka olmaktır. Sürdürülebilir çözümler üreterek,
                  müşterilerimizin yanında olmak ve çevreye duyarlı bir gelecek inşa etmek en büyük hedefimizdir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Ulusal ve uluslararası arenada rekabet edebilir, fark yaratan projeler üretebilmek için
                  Ar-Ge çalışmalarına yatırım yapıyor, en son teknolojileri takip ediyor ve kalite standartlarımızı
                  sürekli iyileştiriyoruz.
                </p>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/teknoloji-yaklasim.webp"
                  alt="Vizyon"
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
                <div className="kicker">MİSYONUMUZ</div>
                <h2>Değer Katmak İçin Buradayız</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
              <Reveal as="div" delay={100}>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Misyonumuz, matbaa ve tekstil endüstrilerine en verimli su arıtma, atıksu arıtma ve
                  nemlendirme teknolojilerini sunmak, müşterilerimizin üretim süreçlerini optimize etmek
                  ve çevreye duyarlı çözümlerle sektöre yön vermektir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '24px', color: '#344254' }}>
                  Müşteri memnuniyetini öncelikli kabul ederek, uzman ekibimiz ve 30 yılı aşkın tecrübemizle
                  beklentileri aşan hizmet sunuyoruz. Proje bazlı çözümlerimizle, tesislerinizin verimliliğini
                  artırmanıza ve sürdürülebilir üretim hedeflerinize ulaşmanıza yardımcı oluyoruz.
                </p>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/teknoloji-yaklasim.webp"
                  alt="Misyon"
                  style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(11,35,57,0.15)' }}
                />
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
