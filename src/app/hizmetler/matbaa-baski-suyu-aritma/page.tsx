import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import { ServiceSchema, BreadcrumbSchema } from '@/src/components/Schema'

export const metadata: Metadata = {
  title: 'Matbaa Baskı Suyu Arıtma Sistemleri',
  description: 'Matbaa baskı prosesi için ideal su kalitesi sağlayan kapalı ve açık kabin modelleri baskı suyu arıtma sistemleri. PLC kontrol, ters ozmoz, hazne ve dozaj sistemleri.',
  openGraph: {
    title: 'Matbaa Baskı Suyu Arıtma Sistemleri | PrintWater',
    description: 'Kapalı ve açık kabin modellerinde tam otomatik RO sistemleri. Ideal baskı suyu kalitesi için.',
    url: 'https://printwater.com/hizmetler/matbaa-baski-suyu-aritma',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/water-treatment-ro.webp',
        width: 1200,
        height: 630,
        alt: 'Matbaa Baskı Suyu Arıtma Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Matbaa Baskı Suyu Arıtma Sistemleri | PrintWater',
    description: 'Kapalı ve açık kabin modellerinde tam otomatik RO sistemleri.',
    images: ['/img/water-treatment-ro.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/hizmetler/matbaa-baski-suyu-aritma',
  },
}

const breadcrumbs = [
  { name: 'Ana Sayfa', url: 'https://printwater.com' },
  { name: 'Hizmetlerimiz', url: 'https://printwater.com/hizmetler' },
  { name: 'Matbaa Baskı Suyu Arıtma', url: 'https://printwater.com/hizmetler/matbaa-baski-suyu-aritma' },
]

export default function SuAritmaPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="HİZMETLERİMİZ / SU ARITMA"
          title= <>
            Matbaa Baskı Suyu<br />Arıtma Sistemleri
          </>
          description="Şebeke ve diğer su kaynaklarının arıtılmadan baskı prosesinde kullanımı, baskı kalitesini, verimliliği ve maliyetleri olumsuz yönde etkiler. PrintWater ile ideal baskı suyuna kavuşun."
          bgImage="/img/water-treatment-ro.webp"
          minHeight="400px"
          priority
        />

        <BreadcrumbSchema items={breadcrumbs} />
        <ServiceSchema
          name="Matbaa Baskı Suyu Arıtma Sistemi"
          description="Matbaa baskı prosesi için ideal su kalitesi sağlayan kapalı ve açık kabin modelleri baskı suyu arıtma sistemleri. PLC kontrol, ters ozmoz, hazne ve dozaj sistemleri."
          url="https://printwater.com/hizmetler/matbaa-baski-suyu-aritma"
          image="https://printwater.com/img/water-treatment-ro.webp"
          category="Su Teknolojileri"
        />

        <Reveal as="section" className="section">
          <div className="container">
            <div className="product-split">
              <Reveal as="div" delay={0}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Kapalı Kabin Modeli: Kompakt ve Tam Otomatik Baskı Suyu Arıtma</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Printwater Baskı Suyu Arıtma Sistemleri, baskı prosesi için en ideal suyu hazırlar. Kompakt ve tam otomatik çalışan sistemdir. Tüm bileşenler estetik ve fonksiyonel bir kabin içinde barındırılır.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Şebeke ve diğer su kaynaklarının arıtılmadan baskı prosesinde kullanımı, baskı kalitesini, verimliliği ve maliyetleri olumsuz yönde etkiler. Doğal su kaynaklarında sertlik değeri ve diğer parametreler mevsimsel, günlük hatta saatlik olarak bile değişebildiğinden baskı sürecinde sık sık gözden geçirmeyi ve yeni duruma göre ayar yapmayı gerektirmektedir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Kapalı kabin modeli, endüstriyel standartlara uygun paslanmaz çelik yapısı ile uzun ömürlü kullanım sunar. Kompakt tasarımı sayesinde az alanda maksimum performans sağlar. Otomatik kontrol sistemi ile operatör müdahalesi minimum seviyededir. Bakım kolaylığı ve enerji verimliliği ön planda tutularak tasarlanmıştır. Tüm proses parametreleri PLC üzerinden izlenir ve kaydedilir.
                </p>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/matbaa-baski-suyu-kapali-kabin.webp"
                  alt="Matbaa Baskı Suyu Arıtma Sistemi - Kapalı Kabin Modeli"
                  style={{ width: '100%', height: '550px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)', background: '#FFF' }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <div className="features-grid">
              {[
                { title: 'PLC Operatör Paneli', desc: 'Yüksek performanslı PLC kontrol sistemine entegre, kolay kullanılabilen operatör paneli. Gerekli bilgileri, limit değerleri ve arıza detaylarını ekranda gösterir, sesli ikaz ile destekler.', img: '/img/external-412f43497d01.webp' },
                { title: 'Hardness Dozaj Pompası', desc: 'Debiyle oransal dozaj pompası, safsuya uygun oranda hardness kimyasalını hat üzerinde ilave ederek sertliği ayarlanmış baskı suyunu, hazne suyu soğutma ünitelerine gönderir.', img: '/img/external-7427e3bb5a6a.webp' },
                { title: 'Paslanmaz Hidrofor', desc: 'Kaliteli paslanmaz hidrofor sistemi, baskı makinelerine ideal basınç ve debide suyun transferini sağlar.', img: '/img/external-466eaeb06938.webp' },
                { title: 'Antiscalan Dozaj Pompası', desc: 'Stabil değerlerde, sterilize saf su üretimini sağlamak ve membran ünitesini korumak için antiscalan kimyasalını dozajlar.', img: '/img/external-e713224c4809.webp' }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                  </div>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px', color: '#061625' }}>{item.title}</h3>
                  <p style={{ color: '#647386', lineHeight: '1.6', margin: 0, fontSize: '13px' }}>{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <div className="product-split">
              <Reveal as="div" direction="right" delay={0}>
                <img
                  src="/img/matbaa-baski-suyu-acik-kabin.webp"
                  alt="Matbaa Baskı Suyu Arıtma Sistemi - Açık Kabin Modeli"
                  style={{ width: '100%', height: '450px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)', background: '#FFF' }}
                />
              </Reveal>
              <Reveal as="div" delay={100}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Açık Kabin Modeli: Yüksek Kapasiteli ve Genişletilebilir Baskı Suyu Arıtma</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Daha büyük kapasiteli ve genişletilebilir yapıda, endüstriyel ölçekli baskı tesisleri için tasarlanmıştır. Bakım ve müdahale kolaylığı sağlar.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Açık kabin yapısı sayesinde tüm bileşenlere kolay erişim sağlanır. Yüksek debi kapasitesi ile büyük ölçekli üretim hatlarının ihtiyaçlarını karşılar. Modüler tasarımı ile kapasite artışı ve sistem genişletmesi esnasında minimum kesinti ile yükseltme imkanı sunar.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Endüstriyel ortamlara dayanıklı malzeme kalitesi ve özel proje gereksinimlerine göre özelleştirilebilir yapısı ile farklı üretim ihtiyaçları için esnek çözümler sunar. Enerji verimliliği için optimize edilmiş pompa sistemleri ile işletme maliyetleri minimize edilir. Uzaktan izleme ve teşhis destekli PLC sistemi ile operasyonel verimlilik artırılır.
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <div className="features-grid">
              {[
                { title: 'Seviye Kontrol Sistemi', desc: 'Hazne suyu ve kimyasal bidonlarda seviye kontrolünü sağlar. Kaliteli paslanmazdan üretilmiş sistem, bidon içinde kimyasal bittiğini sensörüyle algılayarak sesli ikaz ile operatörü bilgilendirir.', img: '/img/external-8bb25129e5ca.webp' },
                { title: 'Paslanmaz Tank', desc: 'Osmos ünitesi tarafından üretilen saf su, kabinin arka bölümünde konuşlandırılmış paslanmaz depo içinde rezerve edilir. Isı ve ışık izolasyonu yapılan tank, safsuyu steril olarak muhafaza edebilmektedir.', img: '/img/external-fca870a63326.webp' },
                { title: 'Reverse Osmos Ünitesi', desc: 'Membran ünitesi düşük iletkenlikte kaliteli saf su üretimini sağlar.', img: '/img/external-3e97360814dd.webp' },
                { title: 'Yüksek Basınç Pompası', desc: 'Yüksek basınçlı suyu membran ünitesine pompalar.', img: '/img/external-3e97360814dd.webp' }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                  </div>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px', color: '#061625' }}>{item.title}</h3>
                  <p style={{ color: '#647386', lineHeight: '1.6', margin: 0, fontSize: '13px' }}>{item.desc}</p>
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
