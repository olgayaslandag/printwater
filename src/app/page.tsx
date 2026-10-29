import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Hero from '@/src/components/Hero'
import Stats from '@/src/components/Stats/index'
import Services from '@/src/components/Services/index'
import Technology from '@/src/components/Technology/index'
import Insights from '@/src/components/Insights/index'
import VideoGallery from '@/src/components/VideoGallery'
import Contact from '@/src/components/Contact/index'
import Footer from '@/src/components/Footer/index'
import HeroActions from '@/src/components/Hero/HeroActions'

export const metadata: Metadata = {
  title: 'PrintWater — Su Teknolojileri',
  description: 'Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme teknolojileri. Baskı suyu arıtma, atıksu arıtma, nemlendirme sistemleri.',
  openGraph: {
    title: 'PrintWater — Su Teknolojileri',
    description: 'Matbaa ve tekstil endüstrileri için su arıtma ve nemlendirme teknolojileri.',
    url: 'https://printwater.com',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/hero-printwater-su-teknolojileri.webp',
        width: 1920,
        height: 1080,
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
  alternates: {
    canonical: 'https://printwater.com',
  },
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero
          eyebrow="TEMİZ SU · MÜKEMMEL BASKI"
          title= <>
            MATBAA BASKI<br />
            ENDÜSTRİSİ İÇİN<br />
            <span>SU TEKNOLOJİLERİ</span>
          </>
          description="Offset ve dijital baskı endüstrilerine patenti şirketimize ait; baskı suyu arıtma sistemleri, atıksu arıtma sistemleri ile baskı yapılan alanlara ortam nemlendirme teknolojileri üretip tesis ediyoruz."
          bgImage="/img/hero-printwater-su-teknolojileri.webp"
          minHeight="650px"
          actions={<HeroActions />}
          priority
        />
        <Stats />
        <Services />
        <Technology />
        <Insights />
        <VideoGallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}