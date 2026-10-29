import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import { ServiceSchema, BreadcrumbSchema } from '@/src/components/Schema'

export const metadata: Metadata = {
  title: 'Matbaa Baskı Nemlendirme Sistemleri',
  description: 'Matbaa baskı atölyelerinde kağıt boyut stabilitesi, statik elektrik önleme ve baskı kalitesi için %45-55 RH kontrollü nemlendirme sistemleri.',
  openGraph: {
    title: 'Matbaa Baskı Nemlendirme Sistemleri | PrintWater',
    description: 'Matbaa atölyeleri için %45-55 RH kontrollü nemlendirme. Kağıt boyut stabilitesi, statik kontrol, mükemmel baskı kalitesi.',
    url: 'https://printwater.com/hizmetler/matbaa-baski-nemlendirme',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/printing-press.webp',
        width: 1200,
        height: 630,
        alt: 'Matbaa Baskı Nemlendirme Sistemi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Matbaa Baskı Nemlendirme Sistemleri | PrintWater',
    description: 'Matbaa atölyeleri için %45-55 RH kontrollü nemlendirme.',
    images: ['/img/printing-press.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/hizmetler/matbaa-baski-nemlendirme',
  },
}

const breadcrumbs = [
  { name: 'Ana Sayfa', url: 'https://printwater.com' },
  { name: 'Hizmetlerimiz', url: 'https://printwater.com/hizmetler' },
  { name: 'Matbaa Baskı Nemlendirme', url: 'https://printwater.com/hizmetler/matbaa-baski-nemlendirme' },
]

export default function MatbaaNemlendirmePage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="HİZMETLERİMİZ / NEMLENDİRME"
          title= <>
            Matbaa Baskı<br />Nemlendirme Sistemleri
          </>
          description="Grafik endüstrisinde kâğıt için en uygun ortamı elde etmek amacıyla sıcaklık ve nem kontrolü. %45-55 RH bağıl nemde kağıt boyut stabilitesi, statik elektrik önleme ve mükemmel baskı kalitesi."
          bgImage="/img/printing-press.webp"
          minHeight="400px"
          priority
        />

        <BreadcrumbSchema items={breadcrumbs} />
        <ServiceSchema
          name="Matbaa Baskı Nemlendirme Sistemi"
          description="Matbaa baskı atölyelerinde kağıt boyut stabilitesi, statik elektrik önleme ve baskı kalitesi için %45-55 RH kontrollü nemlendirme sistemleri."
          url="https://printwater.com/hizmetler/matbaa-baski-nemlendirme"
          image="https://printwater.com/img/printing-press.webp"
          category="Su Teknolojileri"
        />

        <Reveal as="section" className="section">
          <div className="container">
            <div className="service-split">
              <Reveal as="div" delay={0}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Matbaa Nemlendirme Sistemleri</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Hava nemlendirme sistemleri suyu uygun bir atmosfere dönüştürür, böylece makineler, insanlar ve hayvanlar için mükemmel bir ortam oluşturur.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Bir alanın hava şartları ortamda bulunan materyallerin tutarlılığı üzerinde önemli bir etkiye sahiptir. Materyaller (kağıt, kumaş, tahta, gıda ürünleri vs. gibi) hava çok kuru olduğunda şekil, ağırlık ve kalite değişikliğine uğrar.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '24px' }}>
                  Sistem tarafından ortama verilen 5-10 mikron büyüklüğünde su zerrecikleri, hiçbir şekilde damlama veya ıslatma yapmadan ortam havası içerisinde tamamiyle buharlaşarak kuruldukları yerde ideal nemlendirme sağlar.
                </p>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/matbaa-baski-nemlendirme.webp"
                  alt="Matbaa Baskı Nemlendirme Sistemi"
                  style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)' }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">MALDİV NEMLENDİRME ÜNİTESİ</div>
                <h2>Matbaa Tesisleri İçin Özel Mühendislik</h2>
              </div>
            </Reveal>
            <div className="service-split">
              <Reveal as="div" delay={100}>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Grafik endüstrisinde kâğıt için en uygun ortamı elde etmek amacıyla pek çok işlem yapılır. Sıcaklık ve nemdeki aşırı büyük farklar kâğıtta düzeltilemez hasarlara yola açabilir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Kağıt, karton ve diğer organik materyaller için en uygun ortam üretim işleminde <strong>20-21°C sıcaklıkta %50-55 RH (Bağıl Nem)</strong>’dir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Doğru biçimde kondisyonlanmış kağıt, kâğıttaki su içeriği %6,5-9 arasındadır. Eğer çevredeki nem oranı daha düşükse, kağıt daima etrafına nem saçar. Bunun nedeni kâğıttaki buhar basıncının etrafındaki havada bulunan buhar basıncından daha yüksek olmasıdır. Kağıdın doğal su içeriğini dışarı salmasını önlemek için, sabit bağıl nemin %45-55 RH seviyesinde tutulması gerekir. Bu nemde kâğıdın esnekliği korunur ve baskı mürekkebinin uygulanması da en uygun koşullarda gerçekleşir.
                </p>
                <Reveal as="div" delay={200}>
                  <a href="/iletisim" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
                    DETAYLI TEKNİK KATALOG İSTEYİN
                  </a>
                </Reveal>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/teknoloji-yaklasim.webp"
                  alt="Maldiv Nemlendirme Ünitesi Şeması"
                  style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 50px rgba(11,35,57,0.1)' }}
                />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <Reveal as="div" delay={0}>
              <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Düşük Nem Neden Olan Sorunlar</h2>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  {
                    title: '1. Kağıt kenarının daralması',
                    desc: 'Palet üzerindeki bir kâğıt istifinde, paletin ortasındaki yoğun temas bu bölgeden nem salınmasını önlediğinden önce kâğıdın açıkta kalan kenarları nem salar. Bu da istifte çok bilinen kenar daralması sorununa ve sonuçta da baskı makinesinde problemler yaşanmasına neden olur. Baskı sırasında kâğıdın makasa girmesinde sorun yarattığı için kenar daralması her baskı atölyesinin kâbusudur. Bu durum kâğıtların baskı makinesinde katlanmasına yol açar.'
                  },
                  {
                    title: '2. Boyut değişimi',
                    desc: 'Bağıl nemdeki farklılık kâğıt tabakasının tümünde boyut değişimine yol açar, ancak çapraz yönlü değişimler boylamasına değişimlerden 1,5 ila 4 kat daha fazla olur. Doğru biçimde kondisyonlanmış büyük bir tabaka kâğıt, düşük bağıl nemde gerçekleştirilen bir baskı işleminde, metre başına 2 ila 3 mm küçülecektir.'
                  },
                  {
                    title: '3. Uyumsuzluklar',
                    desc: 'Boyutta sadece 1 mm.lik değişiklik 4,8 yarım tonlu noktalarda uyumsuzluk anlamına gelir ki bu da tabi ki ciddi bir uyumsuzluktur.'
                  },
                  {
                    title: '4. Kâğıdın mekanik özellikleri – esnekliğini koruyun',
                    desc: 'Havadaki bağıl nem, kâğıdın mekanik özellikleri üzerinde güçlü bir etkiye sahiptir. Mücellitlik açısından, katlanabilme özelliğinin yanı sıra gerilme dayanımı, patlama dayanımı ve kopma dayanımı gibi mekanik özelliklerin korunması da önemlidir. % 50-65 RH\'de kağıt en uygun gerilme dayanımı ve patlama dayanımına sahiptir. Kopma dayanımı ve katlanabilme özelliği en fazla % 85 bağıl neme kadar arttırılır. Katlama işlemi sırasında, düşük su içeriğine sahip kağıt katlandığında yırtılacaktır.'
                  },
                  {
                    title: '5. Kuru kâğıt – hazne solüsyonunu emer',
                    desc: 'Kağıt kuru olduğunda su emmek için her yolu dener. Hazne solüsyonunu emerken ortaya çıkan sonuç genellikle hazne solüsyonunun oransal olarak çok düşük miktarda verilmesi olur. Doğru nem beslemesine sahip olmayan baskı atölyelerinde, ilk geçişte bu durumun örneğin ilk renk merdanesi aracılığıyla fazladan %20, sonraki renk merdanesine %10, vs. besleme yapılmasıyla sık sık telafi edilmesi gerekir.'
                  },
                  {
                    title: '6. Statik elektrik',
                    desc: '%40\'ın altındaki RH seviyelerinde kağıt elektrik yüklemeye başlar. Statik elektrikle ilgili sorunlar genellikle kağıt besleyicisinin kağıtları birbirinden ayıramadığı kağıt alma işlemi sırasında yaşanır. Baskı makinesi, statik elektrik nedeniyle iki kağıt birden alır.'
                  },
                  {
                    title: '7. Personel çalışma ortamı',
                    desc: 'En yüksek çalışma verimliliği, mukoza zarının kurumasından kaynaklanan sorunların önlenmesi ile alerji ve astım nedenlerinin en aza indirgenmesi için 20-24 C sıcaklık ve %30-60 RH seviyesinde neme sahip olan "konfor alanı" adıyla bilinen ortamda elde edilir.'
                  }
                ].map((item, index) => (
                  <Reveal as="li" key={index} style={{ color: '#344254', lineHeight: '1.7' }}>
                    <div style={{ fontWeight: 600, color: '#061625', marginBottom: '6px' }}>{item.title}</div>
                    <div style={{ fontSize: '15px' }}>{item.desc}</div>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">SİSTEM BİLEŞENLERİ</div>
                <h2>Yüksek Basınçlı Atomize Nemlendirme Teknolojisi</h2>
              </div>
            </Reveal>
            <div className="service-features-grid">
              {[
                {
                  title: 'PLC Operatör Paneli',
                  desc: 'Yüksek performanslı PLC kontrol sistemine entegre, kolay kullanılabilen operatör paneli. Gerekli bilgileri, limit değerleri ve arıza detaylarını ekranda gösterir, sesli ikaz ile destekler.',
                  img: '/img/external-412f43497d01.webp'
                },
                {
                  title: 'Nem Sensörü',
                  desc: 'Ölçülen nem değeri PLC\'ye aktarılır. Sistemin ideal aralıkta çalışması sağlanır.',
                   img: '/img/external-fd3868ed7184.webp'
                },
                {
                  title: 'Solenoid Valf (100 bar)',
                  desc: 'Özel tasarım, 100 bar elektrikli valf sayesinde kesinlikle damlatma ve ıslatma yapmaz. Anlık tepki süresi ile kontrol sağlanır.',
                   img: '/img/external-6fad4ec5ac3a.webp'
                },
                {
                  title: 'Yüksek Basınç Pompası',
                  desc: 'Yüksek basınçlı suyu membran ünitesine pompalar. Nozul istasyonlarına 70 bar yüksek basınçla saf su gönderir.',
                   img: '/img/external-509edd56a693.webp'
                },
                {
                  title: 'Paslanmaz Hidrofor',
                  desc: 'Kaliteli paslanmaz hidrofor sistemi, baskı makinelerine ideal basınç ve debide suyun transferini sağlar.',
                   img: '/img/external-509edd56a693.webp'
                },
                {
                  title: 'Reverse Osmos Ünitesi',
                  desc: 'Membran ünitesi düşük iletkenlikte kaliteli saf su üretimini sağlar.',
                   img: '/img/external-c99d9ab7aba3.webp'
                },
                {
                  title: 'Ultraviole Sistemi',
                  desc: 'Ortama verilen su zerreciklerini sterilize ederek hijyen kriterlerini sağlar.',
                   img: '/img/external-10c2ee5b988f.webp'
                },
                {
                  title: 'Paslanmaz Tank',
                  desc: 'Osmos ünitesi tarafından üretilen saf su, kabinin arka bölümünde konuşlandırılmış paslanmaz depo içinde rezerve edilir. Isı ve ışık izolasyonu yapılan tank, safsuyu steril olarak muhafaza edebilmektedir.',
                   img: '/img/external-8bb25129e5ca.webp'
                },
                {
                  title: 'Maldiv Nemlendirme Ünitesi',
                  desc: 'Grafik endüstrisinde kâğıt için en uygun ortamı elde etmek amacıyla pek çok işlem yapılır. 5-10 mikron büyüklüğünde su zerrecikleri, damlama veya ıslatma yapmadan ortam havasında tamamen buharlaşarak ideal nemlendirme sağlar.',
                   img: '/img/external-fc7bb8ce4067.webp'
                }
              ].map((item, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} />
                  </div>
                  <h3 style={{ marginBottom: '12px', fontSize: '18px', color: '#061625' }}>{item.title}</h3>
                  <p style={{ color: '#647386', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">MALDİV NEMLENDİRME ÜNİTESİ</div>
                <h2>Endüstriyel Standartlarda Çözüm</h2>
              </div>
            </Reveal>
            <div className="service-split">
              <Reveal as="div" delay={100}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Maldiv Nemlendirme Ünitesi</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Grafik endüstrisinde kâğıt için en uygun ortamı elde etmek amacıyla pek çok işlem yapılır. Sıcaklık ve nemdeki aşırı büyük farklar kâğıtta düzeltilemez hasarlara yola açabilir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Kağıt, karton ve diğer organik materyaller için en uygun ortam üretim işleminde <strong>20-21°C sıcaklıkta %50-55 RH (Bağıl Nem)</strong>’dir.
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#344254', marginBottom: '16px' }}>
                  Doğru biçimde kondisyonlanmış kağıt, kâğıttaki su içeriği %6,5-9 arasındadır. Eğer çevredeki nem oranı daha düşükse, kağıt daima etrafına nem saçar. Bunun nedeni kâğıttaki buhar basıncının etrafındaki havada bulunan buhar basıncından daha yüksek olmasıdır. Kağıdın doğal su içeriğini dışarı salmasını önlemek için, sabit bağıl nemin %45-55 RH seviyesinde tutulması gerekir. Bu nemde kâğıdın esnekliği korunur ve baskı mürekkebinin uygulanması da en uygun koşullarda gerçekleşir.
                </p>
                <Reveal as="div" delay={200}>
                  <a href="/iletisim" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
                    DETAYLI TEKNİK KATALOG İSTEYİN
                  </a>
                </Reveal>
              </Reveal>
              <Reveal as="div" direction="right" delay={200}>
                <img
                  src="/img/teknoloji-yaklasim.webp"
                  alt="Maldiv Nemlendirme Ünitesi Şeması"
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
                <h2>Diğer Endüstriyel Su Çözümlerimiz</h2>
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
