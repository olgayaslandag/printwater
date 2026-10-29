'use client'

export default function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PrintWater',
    url: 'https://printwater.com',
    logo: 'https://printwater.com/img/logo.webp',
    image: 'https://printwater.com/img/hero-printwater-su-teknolojileri.webp',
    description: 'Matbaa ve tekstil endüstrileri için su arıtma ve kontrollü nemlendirme teknolojileri.',
    areaServed: 'TR',
    knowsAbout: [
      'Baskı suyu arıtma sistemleri',
      'Endüstriyel nemlendirme sistemleri',
      'Tekstil üretiminde nem kontrolü',
    ],
    sameAs: [
      'https://www.linkedin.com/company/printwater',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-212-269-52-42',
      contactType: 'customer service',
      availableLanguage: ['Turkish', 'English'],
      areaServed: 'TR',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
      addressLocality: 'Istanbul',
      addressRegion: 'Istanbul',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
