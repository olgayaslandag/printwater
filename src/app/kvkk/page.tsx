import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Hero from '@/src/components/Hero'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description: 'PrintWater kişisel verilerin korunması hakkında KVKK aydınlatma metni.',
  alternates: {
    canonical: 'https://printwater.com/kvkk',
  },
}

const textStyle = { color: '#647386', lineHeight: '1.8', fontSize: '15px', margin: 0 }

export default function KvkkPage() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="YASAL BİLGİLER"
          title={<>KVKK<br />Aydınlatma Metni</>}
          description="Kişisel verilerinizin işlenmesine ilişkin haklarınız ve uygulamalarımız."
          bgImage="/img/corporate-office.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section soft">
          <div className="container" style={{ maxWidth: '860px' }}>
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">6698 SAYILI KANUN</div>
                <h2>Kişisel verilerin korunması</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gap: '32px' }}>
              <Reveal as="article" className="card" delay={100}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>Veri sorumlusu</h3>
                  <p style={textStyle}>
                    PrintWater olarak, veri sorumlusu sıfatıyla kişisel verilerinizin hukuka ve dürüstlük kurallarına
                    uygun biçimde işlenmesine, güvenliğinin sağlanmasına ve haklarınızın korunmasına önem veriyoruz.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={150}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>İşleme amaçları</h3>
                  <p style={textStyle}>
                    Kişisel verileriniz; iletişim taleplerini sonuçlandırmak, teklif ve proje süreçlerini yürütmek,
                    müşteri ilişkilerini yönetmek, hizmet kalitesini geliştirmek ve mevzuattan doğan yükümlülükleri
                    yerine getirmek için işlenebilir.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={200}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>Aktarım ve saklama</h3>
                  <p style={textStyle}>
                    Verileriniz, yalnızca işleme amacıyla sınırlı ve gerekli olduğu ölçüde; hizmet alınan tedarikçiler,
                    yetkili kurumlar veya kanunen yetkili kişilerle paylaşılabilir. Saklama süreleri, ilgili mevzuat ve
                    işleme amaçları dikkate alınarak belirlenir.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={250}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>Haklarınız</h3>
                  <p style={textStyle}>
                    KVKK kapsamında kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme,
                    silme veya yok etme, aktarılan kişileri öğrenme ve kanunda belirtilen diğer haklarınızı kullanma
                    hakkına sahipsiniz.
                  </p>
                </div>
              </Reveal>
              <Reveal as="article" className="card" delay={300}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3>Başvuru</h3>
                  <p style={textStyle}>
                    KVKK kapsamındaki taleplerinizi yazılı olarak veya{' '}
                    <a href="mailto:info@printwater.com" style={{ color: '#1684f5', fontWeight: 600 }}>info@printwater.com</a>{' '}
                    üzerinden iletebilirsiniz. Başvurular, kimlik doğrulama ve ilgili mevzuat hükümleri çerçevesinde
                    değerlendirilir.
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
