import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import { ServiceSchema, BreadcrumbSchema } from '@/src/components/Schema'

export const metadata: Metadata = {
  title: 'Tekstil Dokuma Nemlendirme Sistemleri',
  description: 'Yüksek basınçlı atomize nemlendirme ile tekstil dokumada statik elektrik önleme, iplik kopması azaltma, toz bastırma, gramaj koruma ve verimlilik artışı.',
  openGraph: {
    title: 'Tekstil Dokuma Nemlendirme Sistemleri | PrintWater',
    description: 'Dokuma tesisleri için %55-60 RH ideal nem seviyesi. Statik elektrik, iplik kopması, toz sorunlarını çözün.',
    url: 'https://printwater.com/hizmetler/tekstil-dokuma-nemlendirme',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/textile-factory.webp',
        width: 1200,
        height: 630,
        alt: 'Tekstil Dokuma Nemlendirme Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Tekstil Dokuma Nemlendirme Sistemleri | PrintWater',
    description: 'Dokuma tesisleri için %55-60 RH ideal nem seviyesi. Statik elektrik, iplik kopması, toz sorunlarını çözün.',
    images: ['/img/textile-factory.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/hizmetler/tekstil-dokuma-nemlendirme',
  },
}

const breadcrumbs = [
  { name: 'Ana Sayfa', url: 'https://printwater.com' },
  { name: 'Hizmetlerimiz', url: 'https://printwater.com/hizmetler' },
  { name: 'Tekstil Dokuma Nemlendirme', url: 'https://printwater.com/hizmetler/tekstil-dokuma-nemlendirme' },
]

export default function TekstilDokumaPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="HİZMETLERİMİZ / TEKSTİL DOKUMA"
          title= <>
            Tekstil Dokuma<br />Nemlendirme Sistemleri
          </>
          description="Yüksek basınçlı atomize teknolojisi ile dokuma tesislerinde %55-60 RH ideal nem seviyesi. Statik elektrik, iplik kopması, toz, tiftiklenme sorunlarını kökünden çözün."
          bgImage="/img/textile-factory.webp"
          minHeight="400px"
          priority
        />

        <BreadcrumbSchema items={breadcrumbs} />
        <ServiceSchema
          name="Tekstil Dokuma Nemlendirme Sistemi"
          description="Yüksek basınçlı atomize nemlendirme ile tekstil dokumada statik elektrik önleme, iplik kopması azaltma, toz bastırma, gramaj koruma ve verimlilik artışı."
          url="https://printwater.com/hizmetler/tekstil-dokuma-nemlendirme"
          image="https://printwater.com/img/textile-factory.webp"
          category="Su Teknolojileri"
        />

        <Reveal as="section" className="section">
          <div className="container">
            <div className="service-split">
              <Reveal as="div" delay={0}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Kuru Hava Neden Olan Sorunlar</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Nem oranı düştüğünde pamuk ve yün ipliğinde ciddi üretim sorunları ortaya çıkar:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { icon: '⚡', title: 'Statik Elektriklenme', desc: 'Sürtünme katsayısı artar, iplikler birbirine yapışır, makine duruşlarına neden olur' },
                    { icon: '🧵', title: 'İplik Kopması', desc: 'Daha zayıf, kırılgan, elastikiyeti azalan iplik kopmalarına yol açar, verimlilik düşer' },
                    { icon: '⚖️', title: 'Gramaj Kaybı', desc: 'Malzeme nem kaybettiği için hafifler, ekonomik kayıplara ve karlılık düşüşüne neden olur' },
                    { icon: '💨', title: 'Toz ve Tiftiklenme', desc: 'Ortam toz oranı yüksek seviyelere çıkar, personel sağlığını ve makine ömrünü etkiler' },
                    { icon: '📐', title: 'Kumaş Çekilmesi', desc: 'Boyutsal istikrarsızlık, sonraki işlemlerde (boya, baskı, 앙프레) uyumsuzluk yaratır' }
                  ].map((item, index) => (
                    <Reveal as="li" key={index} delay={index * 80} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#fef2f2', borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
                      <span style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <h4 style={{ margin: '0 0 4px', color: '#061625' }}>{item.title}</h4>
                        <p style={{ margin: 0, color: '#344254', fontSize: '14px', lineHeight: '1.6' }}>{item.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/tekstil-dokuma-nemlendirme.webp"
                  alt="Tekstil Dokuma Nemlendirme Sistemi Uygulaması"
                  style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)' }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">İDEAL NEMLİN FAYDALARI</div>
                <h2>%55-60 RH Sağlandığında Elde Edilen Sonuçlar</h2>
              </div>
            </Reveal>
            <div className="service-features-grid">
              {[
                { title: 'Ürün Kalitesi ve Verim', items: ['İplik mukavemeti artar, kopma azalır', 'Makine hızları ve performansı artar', 'Düzgün doku yapısı, kaliteli kumaş', 'Hurda oranı minimum seviyeye iner'] },
                { title: 'Ekonomik Kazanç', items: ['Malzemeler gerçek ağırlıklarına ulaşır', 'Gramaj kaybı önlenir, kar artar', 'Makine duruşları minimize edilir', 'İplik tüketimi optimize edilir'] },
                { title: 'Sağlık ve Çevre', items: ['Toz bastırılır, sağlıklı ortam', 'Personel için konforlu hava', 'Statik elektrik güvenlik riski kalkar', 'UV sterilizasyon ile hijyenik üretim'] }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px', color: '#061625' }}>{item.title}</h3>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {item.items.map((i, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#344254', lineHeight: '1.6' }}>
                        <span style={{ color: '#62c51d', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <div className="service-split">
              <Reveal as="div" delay={0}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Yüksek Basınçlı Atomize Teknolojisi</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Sistemler, 70-100 bar basınçla saf suyu 5-10 mikron boyutunda zerreçiklere ayırarak ortama yayar.
                  Bu mikro zerreçikler anında buharlaşarak ıslatma veya damlama yapmadan nem sağlar.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Atomize nemlendirme; ortam ısısını da düşürerek (serinletme etkisi) yaz aylarında ek klimalama maliyetini azaltır.
                  PLC kontrollü sistem, her doku makinesi bölgesinde ayrı nem kontrolü sağlayabilir.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    '70-100 bar yüksek basınç pompa üniteleri',
                    'Paslanmaz nozul istasyonları (damlatma yapmaz)',
                    'Bölgesel nem sensörleri ile hassas kontrol',
                    'RO + UV sterilizasyon ile hijyenik su',
                    'Paslanmaz hidrofor ve tank sistemi',
                    'Tam otomatk PLC + HMI operatör paneli',
                    'Uzaktan erişim ve izleme (IoT ready)',
                    'Enerji verimli invertörlü pompa sürücüleri'
                  ].map((item, index) => (
                    <Reveal as="li" key={index} delay={index * 60} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#344254' }}>
                      <span style={{ color: '#1684f5', fontSize: '18px' }}>→</span>
                      <span>{item}</span>
                    </Reveal>
                  ))}
                </ul>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/teknoloji-yaklasim.webp"
                  alt="Atomize Nemlendirme Sistemi Şeması"
                  style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)' }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">VİDEOLAR</div>
                <h2>Tekstil Sektörüne Yönelik Diğer Sistemlerimiz</h2>
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
