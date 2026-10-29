import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import { ServiceSchema, BreadcrumbSchema } from '@/src/components/Schema'

export const metadata: Metadata = {
  title: 'Tekstil Dijital Baskı Nemlendirme',
  description: 'Dijital baskı makineleri için ideal ortam koşulları: 21-23°C sıcaklık, %50-55 RH nem. Mürekkep tıkanması önleme, baskı kalitesi artırma, mürekkep tasarrufu.',
  openGraph: {
    title: 'Tekstil Dijital Baskı Nemlendirme | PrintWater',
    description: 'Dijital baskı makineleri için ideal ortam koşulları: 21-23°C, %50-55 RH. Mürekkep tıkanması önleme, baskı kalitesi artırma.',
    url: 'https://printwater.com/hizmetler/tekstil-dijital-baski-nemlendirme',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/digital-printing.webp',
        width: 1200,
        height: 630,
        alt: 'Tekstil Dijital Baskı Nemlendirme Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Tekstil Dijital Baskı Nemlendirme | PrintWater',
    description: 'Dijital baskı makineleri için ideal ortam koşulları: 21-23°C, %50-55 RH.',
    images: ['/img/digital-printing.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/hizmetler/tekstil-dijital-baski-nemlendirme',
  },
}

const breadcrumbs = [
  { name: 'Ana Sayfa', url: 'https://printwater.com' },
  { name: 'Hizmetlerimiz', url: 'https://printwater.com/hizmetler' },
  { name: 'Tekstil Dijital Baskı Nemlendirme', url: 'https://printwater.com/hizmetler/tekstil-dijital-baski-nemlendirme' },
]

export default function TekstilDigitalPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="HİZMETLERİMİZ / TEKSTİL DİJİTAL"
          title= <>
            Tekstil Dijital Baskı<br />Nemlendirme Sistemleri
          </>
          description="Dijital Baskı Makinesi üreticileri ve mürekkep imal eden firmalar tarafından tanımlanan ideal parametreler: 21-23°C ortam sıcaklığı, %50-55 RH bağıl nem. PrintWater ile makine performansını maximize edin."
          bgImage="/img/digital-printing.webp"
          minHeight="400px"
          priority
        />

        <BreadcrumbSchema items={breadcrumbs} />
        <ServiceSchema
          name="Tekstil Dijital Baskı Nemlendirme Sistemi"
          description="Dijital baskı makineleri için ideal ortam koşulları: 21-23°C sıcaklık, %50-55 RH nem. Mürekkep tıkanması önleme, baskı kalitesi artırma, mürekkep tasarrufu."
          url="https://printwater.com/hizmetler/tekstil-dijital-baski-nemlendirme"
          image="https://printwater.com/img/digital-printing.webp"
          category="Su Teknolojileri"
        />

        <Reveal as="section" className="section">
          <div className="container">
            <div className="service-split">
              <Reveal as="div" direction="right" delay={0}>
                <img
                  src="/img/tekstil-dijital-baski-nemlendirme.webp"
                  alt="Tekstil Dijital Baskı Nemlendirme Sistemi"
                  style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)' }}
                />
              </Reveal>
              <Reveal as="div" delay={100}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>İdeal Ortam Parametreleri</h2>
                <div style={{ background: '#f5f8fb', borderRadius: '16px', padding: '32px', marginBottom: '24px' }}>
                  <div className="service-params-grid">
                    <div style={{ textAlign: 'center', background: 'white', padding: '24px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '36px', fontWeight: 800, color: '#1684f5' }}>21-23°C</div>
                      <div style={{ fontSize: '14px', color: '#647386', marginTop: '4px' }}>Ortam Sıcaklığı</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '24px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '36px', fontWeight: 800, color: '#1684f5' }}>%50-55 RH</div>
                      <div style={{ fontSize: '14px', color: '#647386', marginTop: '4px' }}>Bağıl Nem</div>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Ortam nem ve ısı değeri, dijital baskı işleminde neden hayati öneme sahiptir? Dijital Baskı Makinesi üreticileri, mürekkep imal eden firmalar ve literatürler ideal baskı ortamı parametrelerini 21-23°C ortam sıcaklığı ve %50-55 RH bağıl nem olarak tanımlamışlardır.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Düşük nemde kuru hava mürekkebin kurumasına ve kafalarda tıkanmalara neden olur. Arıza, servis bakım maliyetleri artar, makine performansı ve iş verimliliği düşer. Baskı kalitesinde renk canlılığı azalır, detay kaybı ve kenar keskinliği düşüklüğü görülür. Metrekare başına mürekkep tüketimi artar.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Ortam nem değeri %50-55 aralığında sabit tutulduğunda makine maksimum performans ile çalışır, makine duruşları ve bakım masrafları önemli oranda azalır. Daha canlı renkler, daha net detay ve kenar keskinliği elde edilir. Kağıt en uygun gerilme ve kopma dayanımına sahip olur, katlama işlemlerinde yırtılma riski azalır. Personel için 20-24°C ve %50-55 nem değerinde solunum yolları korunur, alerji ve astım riski azalır. UV sterilize su ile hijyen kriterleri sağlanır.
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">DÜŞÜK NEMİN ETKİLERİ</div>
                <h2>Dijital Baskıda Yaşanan Problemler</h2>
              </div>
            </Reveal>
            <div className="faq-grid">
              {[
                {
                  title: 'Mürekkep Kuruma ve Kafa Tıkanıklığı',
                  desc: 'Düşük nemde mürekkep kafalarda kurur, sıklıkla tıkanma yaşanır. Bu durum arıza ve servis bakım maliyetlerini artırır, makine duruşlarına neden olur.'
                },
                {
                  title: 'Baskı Kalitesi Kayıpları',
                  desc: 'Gözle görülür kalite düşüşleri: renk canlılığı azalır, detay kaybı olur, kenar keskinliği düşer. Metrekare başına mürekkep tüketimi artar.'
                },
                {
                  title: 'Kağıt/Kumaş Boyut Değişimi',
                  desc: 'Düşük nemde kağıt/kumaş metre başına 1-3 mm küçülür. Bu da kayıt (registration) hatalarına, renk uyumsuzluğuna ve işlem zorluklarına yol açar.'
                },
                {
                  title: 'Mekanik Özellik Düşüklüğü',
                  desc: 'Katlanabilme, gerilme dayanımı ve kopma dayanımı azalır. Düşük nemli malzeme işlem sırasında yırtılabilir, bu da hurda oranını artırır.'
                }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '18px', color: '#061625' }}>{item.title}</h3>
                  <p style={{ color: '#344254', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">KONTROLLÜ NEMLİN FAYDALARI</div>
                <h2>%50-55 RH Sağladığınızda Elde Edilecekler</h2>
              </div>
            </Reveal>
            <div className="service-features-grid">
              {[
                { title: 'Maksimum Makine Performansı', items: ['Makine duruşları minimize', 'Arıza/bakım masrafları %60+ azalır', 'Kesintisüz üretim', 'Üretim verimliliği artışı'] },
                { title: 'Üstün Baskı Kalitesi', items: ['Daha canlı/parlak renkler', 'Daha net detay ve kenar keskinliği', 'Mürekkep tasarrufu %20-30', 'Tutarlı renk reproduktifliği'] },
                { title: 'Sağlıklı Çalışma Ortamı', items: ['Solunum yolları koruması', 'Alerji/astım riski azalır', 'Gribal hastalıklar düşer', 'Personel verimliliği artar', 'UV sterilize su ile hijyen'] }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px', color: '#061625' }}>{item.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {item.items.map((i, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#344254' }}>
                        <span style={{ color: '#62c51d', fontSize: '18px' }}>✓</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">VİDEOLAR</div>
                <h2>Dijital Baskı İçin Tamamlayıcı Çözümlerimiz</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {[
                { src: 'https://video.wixstatic.com/video/ec0ef2_72e2d9c04a06415f97078e444658f202/480p/mp4/file.mp4', cover: '/img/external-698eff302604.webp', title: 'Sistem Videosu 1' },
                { src: 'https://video.wixstatic.com/video/ec0ef2_5b65b964697d47659a330112d74e82d6/480p/mp4/file.mp4', cover: '/img/external-1570e117cf34.webp', title: 'Sistem Videosu 2' },
                { src: 'https://video.wixstatic.com/video/ec0ef2_7bc133464d81461a903e523424b3117b/360p/mp4/file.mp4', cover: '/img/external-3f4beda6d6d4.webp', title: 'Sistem Videosu 3' }
              ].map((video, index) => (
                <Reveal as="div" key={index} delay={index * 100} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(11,35,57,0.1)' }}>
                  <video
                    controls
                    preload="none"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                    poster={video.cover}
                  >
                    <source src={video.src} type="video/mp4" />
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
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
