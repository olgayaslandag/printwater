import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import ContactForm from './ContactForm'
import Hero from '@/src/components/Hero'
import ContactPageSchema from '@/src/components/Schema/ContactPageSchema'

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'PrintWater ile iletişime geçin. Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme çözümleri hakkında bilgi almak için bizimle iletişime geçebilirsiniz.',
  openGraph: {
    title: 'İletişim | PrintWater',
    description: 'Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme çözümleri. Bizimle iletişime geçin.',
    url: 'https://printwater.com/iletisim',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/corporate-office.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater İletişim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'İletişim | PrintWater',
    description: 'Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme çözümleri. Bizimle iletişime geçin.',
    images: ['/img/corporate-office.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/iletisim',
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <ContactPageSchema
        name="PrintWater İletişim Sayfası"
        description="Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme çözümleri hakkında iletişim bilgileri."
        url="https://printwater.com/iletisim"
        address="Talatpaşa Mahallesi, Çelebi Cad. No:43, 34418 Kâğıthane / İstanbul, Türkiye"
        phone="+902122695242"
        email="info@printwater.com"
        hours="Pazartesi - Cuma: 09:00 - 18:00"
      />
      <main>
        <Hero
          eyebrow="İLETİŞİM"
          title= <>
            Projeniz için<br />Bizimle İletişime Geçin
          </>
          description="Teknik ihtiyaçlarınızı paylaşın, size uygun çözüm için iletişime geçelim."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section" id="contact-form">
          <div className="container">
              <div className="contact-split">
              <Reveal as="div" delay={0}>
                <h2 style={{ fontSize: '32px', marginBottom: '24px', color: '#061625' }}>Bize Ulaşın</h2>
                <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#647386', marginBottom: '32px' }}>
                  Herhangi bir sorunuz, proje talebiniz veya teknik destek ihtiyacınız varsa aşağıdaki formu doldurun
                  veya doğrudan bizimle iletişime geçin. En kısa sürede size dönüş yapacağız.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <Reveal as="div" delay={100} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                     <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #1684f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1684f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                         <circle cx="12" cy="10" r="3" />
                       </svg>
                     </div>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>Adres</h3>
                      <p style={{ margin: 0, color: '#647386', lineHeight: '1.7' }}>
                        Talatpaşa Mahallesi, Çelebi Cad. No:43<br />
                        34418 Kâğıthane / İstanbul, Türkiye
                      </p>
                    </div>
                  </Reveal>

                   <Reveal as="div" delay={200} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                     <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #1684f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1684f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                       </svg>
                     </div>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>Telefon</h3>
                      <p style={{ margin: 0, color: '#647386', lineHeight: '1.7' }}>
                        <a href="tel:+902122695242" style={{ color: '#647386', textDecoration: 'none' }}>+90 212 269 52 42</a><br />
                        <a href="tel:+905333542595" style={{ color: '#647386', textDecoration: 'none' }}>+90 533 354 25 95</a>
                      </p>
                    </div>
                  </Reveal>

                   <Reveal as="div" delay={300} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                     <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #1684f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1684f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                         <rect x="2" y="4" width="20" height="16" rx="2" />
                         <path d="M22 4L12 13L2 4" />
                       </svg>
                     </div>
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>E-Posta</h3>
                      <p style={{ margin: 0, color: '#647386', lineHeight: '1.7' }}>
                        <a href="mailto:info@printwater.com" style={{ color: '#647386', textDecoration: 'none' }}>info@printwater.com</a><br />
                        <a href="mailto:info@sisnem.com" style={{ color: '#647386', textDecoration: 'none' }}>info@sisnem.com</a>
                      </p>
                    </div>
                  </Reveal>
                </div>
              </Reveal>

              <Reveal as="div" delay={400}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">SİKÇA SORULAN SORULAR</div>
                <h2>Hızlı Cevaplar</h2>
              </div>
            </Reveal>
            <div className="faq-grid">
              {[
                {
                  q: 'Hangi bölgelerde hizmet veriyorsunuz?',
                  a: 'Türkiye geneli ve yurt dışı projelerde hizmet vermektedir. İstanbul merkezli olarak tüm marmara, ege, akdeniz, iç anadolu ve karadeniz bölgesine proje ve servis desteği sunuyoruz.'
                },
                {
                  q: 'Proje için keşif ücreti alıyor musunuz?',
                  a: 'İlk keşif ve ön çalışma ücretsizdir. Proje kapsamına göre detaylı projelendirme ve maliyet analizi sunuyoruz.'
                },
                {
                  q: 'Garanti ve servis süreci nasıl işliyor?',
                  a: 'Tüm sistemlerimiz 2 yıl garanti kapsamındadır. 7/24 teknik destek hattımız ve yetkili servis ağımız ile kesintisiz üretiminiz için yanınızdayız.'
                },
                {
                  q: 'Ödeme seçenekleriniz nelerdir?',
                  a: 'Proje bazlı peşinat ve taksitlendirme seçenekleri, kredi kartı, banka havalesi/EFT ve finansman/leasing imkanları sunuyoruz.'
                }
              ].map((faq, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>{faq.q}</h3>
                  <p style={{ color: '#647386', lineHeight: '1.7', margin: 0 }}>{faq.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  )
}