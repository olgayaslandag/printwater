import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*.json$'],
    },
    sitemap: 'https://printwater.com/sitemap.xml',
    host: 'https://printwater.com',
  }
}