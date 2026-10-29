import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import Hero from '@/src/components/Hero'
import { getArticles } from '@/src/components/Insights/articles'
import ArticleCard from '@/src/components/Insights/ArticleCard'

export const metadata: Metadata = {
  title: 'Bilgi Merkezi',
  description: 'Endüstriyel nemlendirme, su kalitesi, dijital baskı teknolojileri hakkında teknik makaleler, rehberler ve endüstri içgörüleri.',
  openGraph: {
    title: 'Bilgi Merkezi | PrintWater',
    description: 'Endüstriyel nemlendirme, su kalitesi ve dijital baskı teknolojileri hakkında uzman yazılar ve teknik rehberler.',
    url: 'https://printwater.com/blog',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/modern-industrial.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Bilgi Merkezi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Bilgi Merkezi | PrintWater',
    description: 'Endüstriyel nemlendirme, su kalitesi ve dijital baskı teknolojileri hakkında uzman yazılar ve teknik rehberler.',
    images: ['/img/modern-industrial.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/blog',
  },
}

// Bilgi Merkezi listesi: kalıcı depodan (articles store) beslenir.
// Sayfa ISR ile 5 dakikada bir tazelenir; API yazmalarında ayrıca
// revalidatePath ile anında geçersiz kılınır (bkz. lib/articles/revalidate.ts).
export const revalidate = 300

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="BİLGİ MERKEZİ"
          title= <>
            Teknoloji ve<br />Sürdürülebilirlik
          </>
          description="Endüstriyel nemlendirme, su kalitesi ve dijital baskı teknolojileri hakkında uzman yazılar, teknik rehberler ve endüstri içgörüleri."
          bgImage="/img/modern-industrial.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section">
          <div className="container">
            <div className="insights">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  tag={article.tag}
                  title={article.title}
                  description={article.description}
                  image={article.image}
                  imageAlt={article.imageAlt}
                  slug={article.slug}
                  delay={index * 140}
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <a href="/iletisim" className="btn btn-primary" style={{ display: 'inline-block' }}>
                KONU ÖNERİSİNDE BULUNUN
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" className="section soft">
          <div className="container">
            <Reveal as="div" className="section-head" delay={0}>
              <div>
                <div className="kicker">KATEGORİLER</div>
                <h2>İlginizi Çekebilir Diğer Konular</h2>
              </div>
            </Reveal>
            <div className="categories-grid">
              {[
                { title: 'Su Arıtma Teknolojileri', desc: 'RO, UV, yumuşatma, dozaj, atık su arıtma ve endüstriyel su işletme sistemleri.', count: '5 Makale' },
                { title: 'Nemlendirme ve HVAC', desc: 'Atomize, buharlı, ultrasonik nemlendirme. Sektörel uygulamalar, hesaplama yöntemleri.', count: '7 Makale' },
                { title: 'Dijital Baskı ve Tekstil', desc: 'Inkjet, UV, latex, sublimasyon, reaktif baskı. Mürekkepler, medyalar, ortam koşulları.', count: '6 Makale' },
              ].map((cat, index) => (
                <Reveal as="div" key={index} className="card" delay={index * 100} style={{ padding: '32px', textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '20px', color: '#061625' }}>{cat.title}</h3>
                  <p style={{ color: '#647386', lineHeight: '1.7', marginBottom: '16px' }}>{cat.desc}</p>
                  <span style={{ fontSize: '14px', color: '#1684f5', fontWeight: 600 }}>{cat.count}</span>
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