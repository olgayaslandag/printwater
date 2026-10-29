const path = require('path')

// next/image uzaktan adres allowlist'i (site domaini).
const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'printwater.com',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    // Görseller public/img altında zaten optimize (webp/pre-sized); Node host'ta
    // WASM optimizer maliyeti yerine doğrudan sunulur.
    unoptimized: true,
    remotePatterns,
  },
  allowedDevOrigins: ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', '127.0.0.1:3001'],
  // Runtime'da `public/img/` altına yazılan görseller Next.js'in build anındaki
  // statik dosya listesinde yer almaz. `afterFiles` rewrite'i önce dosya
  // sistemini kontrol eder: build anında kayıtlı görseller Next.js'in statik
  // hattından (hızlı) servis edilir, yalnızca yeni eklenenler `/api/img/`
  // route handler'ına düşer ve diskten okunur.
  rewrites: async () => {
    return {
      afterFiles: [
        { source: '/img/:path*', destination: '/api/img/:path*' },
      ],
    }
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname
    return config
  },
}

module.exports = nextConfig
