'use client'

import Reveal from '@/src/components/Reveal'
import { responsiveSrcSet } from '@/src/lib/images/responsive'

interface HeroProps {
  eyebrow?: string
  title: React.ReactNode
  description?: string
  bgImage: string
  minHeight?: string
  actions?: React.ReactNode
  className?: string
  priority?: boolean
}

export default function Hero({
  eyebrow,
  title,
  description,
  bgImage,
  minHeight = '650px',
  actions,
  className = '',
  priority = false,
}: HeroProps) {
  const rs = responsiveSrcSet(bgImage)
  return (
    <section className={`hero ${className}`.trim()} style={{ minHeight } as React.CSSProperties} aria-label="Hero Section">
      <div className="hero-bg" aria-hidden="true">
        <img
          src={bgImage}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="object-cover"
          {...(rs ? { srcSet: rs.srcSet, sizes: '100vw' } : {})}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            objectFit: 'cover',
            filter: 'blur(40px)',
            opacity: 0,
            transform: 'scale(1.1)',
            transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
            backgroundImage: `url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFBABAAAAAAAAAAAAAAAAAAAAAAP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB//2Q==")`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <div className="container">
        <div className="hero-content">
          {eyebrow && (
            <Reveal as="div" className="eyebrow" delay={0}>
              {eyebrow}
            </Reveal>
          )}
          <Reveal as="h1" delay={eyebrow ? 100 : 0}>
            {title}
          </Reveal>
          {description && (
            <Reveal as="p" delay={eyebrow ? 200 : 100}>
              {description}
            </Reveal>
          )}
          {actions && (
            <Reveal as="div" delay={eyebrow ? 300 : 200}>
              {actions}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
