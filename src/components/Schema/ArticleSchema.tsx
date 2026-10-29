'use client'

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified?: string
  authorName: string
  authorUrl?: string
  publisherName?: string
  publisherLogo?: string
  category?: string
  tags?: string[]
  readTime?: string
}

export default function ArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'PrintWater Uzman Ekibi',
  authorUrl = 'https://printwater.com/hakkimizda',
  publisherName = 'PrintWater',
  publisherLogo = 'https://printwater.com/img/logo.webp',
  category,
  tags,
  readTime,
}: ArticleSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    image: {
      '@type': 'ImageObject',
      url: image,
    },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: category,
    keywords: tags?.join(', '),
    timeRequired: readTime,
    inLanguage: 'tr-TR',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
