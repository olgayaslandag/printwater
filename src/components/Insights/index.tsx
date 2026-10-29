import { getArticles } from './articles'
import ArticleCard from './ArticleCard'
import Reveal from '@/src/components/Reveal'
import Link from 'next/link'

export default async function Insights() {
  const articles = await getArticles()

  return (
    <section id="insights" className="section">
      <div className="container">
        <Reveal as="div" className="section-head" delay={0}>
          <div>
            <div className="kicker">BİLGİ MERKEZİ</div>
            <h2>Teknoloji ve Sürdürülebilirlik</h2>
          </div>
          <Link href="/blog" className="link">Tüm Makaleler →</Link>
        </Reveal>
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
      </div>
    </section>
  )
}
