'use client'

interface ContactPageSchemaProps {
  name: string
  description: string
  url: string
  address?: string
  phone?: string
  email?: string
  hours?: string
}

export default function ContactPageSchema({
  name,
  description,
  url,
  address,
  phone,
  email,
  hours,
}: ContactPageSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    description,
    url,
    ...(address && { address }),
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    ...(hours && { operatingHours: [hours] }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}