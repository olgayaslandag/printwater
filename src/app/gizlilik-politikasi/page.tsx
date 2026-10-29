import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Hero from '@/src/components/Hero'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description: 'PrintWater gizlilik politikası ve kişisel verilerin korunmasına ilişkin bilgilendirme.',
  alternates: {
    canonical: 'https://printwater.com/gizlilik-politikasi',
  },
}

const textStyle = { color: '#647386', lineHeight: '1.8', fontSize: '15px', margin: 0 }

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="YASAL BİLGİLER"
          title={<>Gizlilik<br />Politikası</>}
          description="Kişisel verilerinizin güvenliği ve gizliliği bizim için önemlidir."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section">
          <div className="container" style={{ maxWidth: '860px' }}>
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">GİZLİLİK POLİTİKASI</div>
                <h2>Verilerinizin güvenliği</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gap: '32px' }}>
              <Reveal as="article" className="card" delay={100}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>1. Kapsam</h3>
                  <p style={textStyle}>
                    Bu politika, PrintWater web sitesini ziyaret eden kullanıcıların bilgilerinin nasıl toplandığını,
                    kullanıldığını, saklandığını ve korunduğunu açıklar. Siteyi kullanarak bu politikada belirtilen
                    uygulamaları kabul etmiş olursunuz.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={150}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>2. Toplanan bilgiler</h3>
                  <p style={textStyle}>
                    İletişim formları aracılığıyla ad, soyad, e-posta adresi, telefon numarası ve mesaj içeriği gibi
                    bilgileri paylaşabilirsiniz. Ayrıca site güvenliği ve performansı için tarayıcı, cihaz ve ziyaret
                    bilgileri teknik olarak işlenebilir.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={200}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>3. Bilgilerin kullanım amacı</h3>
                  <p style={textStyle}>
                    Paylaştığınız bilgiler; taleplerinize yanıt vermek, ürün ve hizmetlerimiz hakkında iletişim kurmak,
                    teknik destek sunmak, site deneyimini geliştirmek ve yasal yükümlülükleri yerine getirmek amacıyla
                    kullanılabilir.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={250}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>4. Saklama ve güvenlik</h3>
                  <p style={textStyle}>
                    Kişisel veriler, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuata uygun şekilde saklanır.
                    Verilerin yetkisiz erişime, kayba veya kötüye kullanıma karşı korunması için uygun idari ve teknik
                    tedbirler uygulanır.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={300}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>5. İletişim</h3>
                  <p style={textStyle}>
                    Gizlilik uygulamalarımız hakkında sorularınız veya talepleriniz için{' '}
                    <a href="mailto:info@printwater.com" style={{ color: '#1684f5', fontWeight: 600 }}>info@printwater.com</a>{' '}
                    adresinden bizimle iletişime geçebilirsiniz.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  )
}
