import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import GlobalSchemas from '@/src/components/Schema/GlobalSchemas'
import RevealObserver from '@/src/components/Reveal/RevealObserver'
import CookieConsent from '@/src/components/CookieConsent'
import Preloader from '@/src/components/Preloader'
import Analytics from '@/src/components/Analytics'
import WhatsAppButton from '@/src/components/WhatsAppButton'
import '@/src/styles/style.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#061625',
}

export const metadata: Metadata = {
  title: {
    default: 'PrintWater — Su Teknolojileri',
    template: '%s | PrintWater',
  },
  description: 'PrintWater, matbaa ve tekstil endüstrileri için baskı suyu arıtma, atıksu arıtma ve kontrollü ortam nemlendirme sistemleri üretir ve kurar.',
  keywords: [
    'baskı suyu arıtma',
    'matbaa nemlendirme sistemleri',
    'tekstil nemlendirme',
    'endüstriyel nemlendirme',
    'ters ozmoz sistemi',
    'su arıtma teknolojileri',
  ],
  authors: [{ name: 'PrintWater', url: 'https://printwater.com' }],
  creator: 'PrintWater',
  publisher: 'PrintWater',
  category: 'Industrial Water Technology',
  formatDetection: {
    telephone: true,
    address: false,
    email: true,
  },
  appleWebApp: {
    capable: true,
    title: 'PrintWater',
    statusBarStyle: 'black-translucent',
  },
  metadataBase: new URL('https://printwater.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://printwater.com',
    siteName: 'PrintWater',
    title: 'PrintWater — Su Teknolojileri',
    description: 'Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme teknolojileri.',
    images: [
      {
        url: '/img/hero-printwater-su-teknolojileri.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Su Teknolojileri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    creator: '@printwater',
    title: 'PrintWater — Su Teknolojileri',
    description: 'Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme teknolojileri.',
    images: ['/img/hero-printwater-su-teknolojileri.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${inter.variable} antialiased`}>
      <head>
        <meta name="google-site-verification" content="6k4XlzFkc-kNjUOzTWfy96SWZoCOo1NGHpCTPe-NbPc" />
        <link rel="preload" as="image" href="/img/hero-printwater-su-teknolojileri.webp" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* CSS artık Next.js modülü olarak yüklenir */}
      </head>
      <body className={`${inter.className}`}>
        <GlobalSchemas />
        <RevealObserver />
        <Preloader />
        <Analytics />
        {children}
        <CookieConsent />
        <WhatsAppButton />
      </body>
    </html>
  )
}
