'use client'

interface ServiceSchemaProps {
  name: string
  description: string
  url: string
  image?: string
  providerName?: string
  providerUrl?: string
  areaServed?: string
  category?: string
}

export default function ServiceSchema({
  name,
  description,
  url,
  image,
  providerName = 'PrintWater',
  providerUrl = 'https://printwater.com',
  areaServed = 'TR',
  category = 'Su Teknolojileri',
}: ServiceSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    image,
    provider: {
      '@type': 'Organization',
      name: providerName,
      url: providerUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: areaServed,
    },
    category,
    serviceType: 'Su Arıtma ve Nemlendirme Çözümleri',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}