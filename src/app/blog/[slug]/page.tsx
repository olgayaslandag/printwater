import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Hero from '@/src/components/Hero'
import { getArticleBySlug, getArticles, type Article } from '@/src/components/Insights/articles'
import { SITE_URL, resolveImageUrl } from '@/src/lib/site'
import { ArticleSchema, BreadcrumbSchema } from '@/src/components/Schema'

// İçerik kalıcı depodan (articles store) okunur: build'de bilinen slug'lar
// prerender edilir, API ile eklenen yeni slug'lar istek üzerine üretilir ve
// 5 dakikada bir tazelenir (ISR). API yazmalarında revalidatePath tetiklenir.
export const dynamicParams = true
export const revalidate = 300

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const articles = await getArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

/**
 * Makalenin TEK yayın tarihi. Bozuk/eksik veri build'de patlar; böylece
 * OG `publishedTime`, JSON-LD `datePublished` ve görünen tarih asla
 * farklı "now" değerlerine düşmez.
 */
function resolvePublishedDate(article: Article): Date {
  const date = new Date(article.publishedAt)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`[Insights] Geçersiz publishedAt (slug: ${article.slug})`)
  }
  return date
}

function displayDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(date)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Makale Bulunamadı | PrintWater' }

  const url = `${SITE_URL}/blog/${article.slug}`
  const image = resolveImageUrl(article.image)
  const publishedTime = resolvePublishedDate(article).toISOString()

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: `${article.title} | PrintWater Blog`,
      description: article.description,
      url,
      siteName: 'PrintWater',
      locale: 'tr_TR',
      type: 'article',
      publishedTime,
      authors: ['PrintWater Uzman Ekibi'],
      section: article.tag,
      images: [{ url: image, width: 1200, height: 630, alt: article.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@printwater',
      title: `${article.title} | PrintWater Blog`,
      description: article.description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  }
}

function ArticleContent({ article }: { article: Article }) {
  const date = resolvePublishedDate(article)
  const publishedAt = date.toISOString()
  const displayDateStr = displayDate(date)
  const url = `${SITE_URL}/blog/${article.slug}`

  const breadcrumbs = [
    { name: 'Ana Sayfa', url: SITE_URL },
    { name: 'Bilgi Merkezi', url: `${SITE_URL}/blog` },
    { name: article.title, url },
  ]

  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow={`MAKALE · ${article.tag}`}
          title={article.title}
          description={article.description}
          bgImage={article.image}
          minHeight="400px"
          priority
        />

        <BreadcrumbSchema items={breadcrumbs} />
        <ArticleSchema
          title={article.title}
          description={article.description}
          url={url}
          image={resolveImageUrl(article.image)}
          datePublished={publishedAt}
          dateModified={article.updatedAt ?? article.publishedAt}
          authorName="PrintWater Uzman Ekibi"
          category={article.tag}
          tags={[article.tag]}
        />

        <article>
          <Reveal as="section" className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', fontSize: '14px', color: '#647386' }}>
                <span>📅 {displayDateStr}</span>
                <span>🏷️ {article.tag}</span>
              </div>

              {/* İçerik kaynağı API ile yönetilebilir; yazımlarda sunucu
                  tarafında sanitize edilmiş HTML saklanır (lib/articles/sanitize.ts). */}
              <div
                className="article-content"
                style={{ fontSize: '18px', lineHeight: '1.8', color: '#344254' }}
                dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
              />

              <div style={{ marginTop: '48px', padding: '32px', background: '#f5f8fb', borderRadius: '16px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '16px', color: '#061625' }}>Projeniz İçin Uzman Destek Alın</h3>
                <p style={{ marginBottom: '24px', color: '#344254' }}>Ücretsiz keşif, ön çalışma ve maliyet analizi için iletişime geçin.</p>
                <a href="/iletisim" className="btn btn-primary" style={{ marginRight: '16px', display: 'inline-block' }}>
                  İLETİŞİM FORMU
                </a>
                <a href="tel:+902122695242" className="btn btn-ghost">
                  0212 269 52 42
                </a>
              </div>
            </div>
          </Reveal>
        </article>
        <Footer />
      </main>
    </>
  )
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return <ArticleContent article={article} />
}
