'use client'

import Reveal from '@/src/components/Reveal'
import Link from 'next/link'
import { responsiveSrcSet } from '@/src/lib/images/responsive'

interface ServiceCardProps {
  number: string
  title: string
  description: string
  image: string
  imageAlt: string
  slug: string
  features?: string[]
  href?: string
  delay?: number
}

export default function ServiceCard({ number, title, description, image, imageAlt, slug, features = [], href, delay = 0 }: ServiceCardProps) {
  const serviceHref = href ?? `/hizmetler/${slug}`
  const rs = responsiveSrcSet(image)

  return (
    <Reveal as="article" className="card" delay={delay}>
      <Link href={serviceHref} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="card-img" style={{ position: 'relative', aspectRatio: '1' }}>
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className="object-cover"
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
              objectFit: 'cover',
              backgroundImage: `url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFBABAAAAAAAAAAAAAAAAAAAAAAP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB//2Q==")`,
              backgroundSize: 'cover',
              backgroundPosition: '50% 50%',
            }}
            {...(rs ? { srcSet: rs.srcSet, sizes: '(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw' } : {})}
          />
        </div>
        <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="number">{number}</div>
          <h3>{title}</h3>
          <small style={{ color: '#647386', lineHeight: '1.7', marginBottom: '16px', flex: 1 }}>{description}</small>
          {features.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {features.map((feature, i) => (
                <li key={i} style={{ background: '#f5f8fb', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#344254' }}>
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <span className="link">DETAYLI İNCELE →</span>
        </div>
      </Link>
    </Reveal>
  )
}