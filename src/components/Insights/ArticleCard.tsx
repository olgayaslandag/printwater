'use client'

import Reveal from '@/src/components/Reveal'
import Link from 'next/link'
import { responsiveSrcSet } from '@/src/lib/images/responsive'

interface ArticleCardProps {
  tag: string
  title: string
  description: string
  image: string
  imageAlt: string
  slug: string
  delay?: number
}

export default function ArticleCard({ tag, title, description, image, imageAlt, slug, delay = 0 }: ArticleCardProps) {
  const rs = responsiveSrcSet(image)
  return (
    <Reveal as="article" className="article" delay={delay}>
      <Link href={`/blog/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div className="article-img" style={{ position: 'relative', aspectRatio: '4/3' }}>
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
            {...(rs ? { srcSet: rs.srcSet, sizes: '(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw' } : {})}
          />
        </div>
        <div className="article-body">
          <div className="tag">{tag}</div>
          <h3>{title}</h3>
          <small style={{ color: '#647386', lineHeight: '1.65', display: 'block', marginTop: '8px', marginBottom: '16px' }}>{description}</small>
          <span className="link">DEVAMINI OKU →</span>
        </div>
      </Link>
    </Reveal>
  )
}