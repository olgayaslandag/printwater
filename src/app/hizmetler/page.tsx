import type { Metadata } from 'next'
import Header from '@/src/components/Header/index'
import Footer from '@/src/components/Footer/index'
import Reveal from '@/src/components/Reveal'
import Contact from '@/src/components/Contact/index'
import { services } from '@/src/components/Services/services'
import ServiceCard from '@/src/components/Services/ServiceCard'
import Hero from '@/src/components/Hero'
import ServiceSchema from '@/src/components/Schema/ServiceSchema'

export const metadata: Metadata = {
  title: 'Hizmetlerimiz',
  description: 'Matbaa baskı suyu arıtma, matbaa baskı nemlendirme, tekstil dijital baskı nemlendirme ve tekstil dokuma nemlendirme çözümleri.',
  openGraph: {
    title: 'Hizmetlerimiz | PrintWater',
    description: 'Baskı ve tekstil endüstrilerine özel su arıtma ve nemlendirme çözümleri.',
    url: 'https://printwater.com/hizmetler',
    siteName: 'PrintWater',
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: '/img/water-treatment-ro.webp',
        width: 1200,
        height: 630,
        alt: 'PrintWater Hizmetlerimiz',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@printwater',
    title: 'Hizmetlerimiz | PrintWater',
    description: 'Baskı ve tekstil endüstrilerine özel su arıtma ve nemlendirme çözümleri.',
    images: ['/img/water-treatment-ro.webp'],
  },
  alternates: {
    canonical: 'https://printwater.com/hizmetler',
  },
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <ServiceSchema
        name="PrintWater Hizmetlerimiz"
        description="Matbaa baskı suyu arıtma, matbaa baskı nemlendirme, tekstil dijital baskı nemlendirme ve tekstil dokuma nemlendirme çözümleri."
        url="https://printwater.com/hizmetler"
        image="/img/water-treatment-ro.webp"
        providerName="PrintWater"
        providerUrl="https://printwater.com"
        areaServed="TR"
        category="Su Arıtma ve Nemlendirme Çözümleri"
      />
      <main>
        <Hero
          eyebrow="HİZMETLERİMİZ"
          title= <>
            İhtiyacınıza Özel<br />Çözümler
          </>
          description="Baskı ve tekstil endüstrilerine özel geliştirdiğimiz su arıtma ve nemlendirme çözümleriyle üretim süreçlerinizi daha verimli, kaliteli ve sürdürülebilir hale getiriyoruz."
          bgImage="/img/water-treatment-ro.webp"
          minHeight="400px"
          priority
        />

        <Reveal as="section" className="section soft">
          <div className="container">
            <div className="services">
              {services.map((service, index) => (
                <ServiceCard key={index} {...service} href={`/hizmetler/${service.slug}`} delay={index * 120} />
              ))}
            </div>
          </div>
        </Reveal>

        <Contact />
      </main>
      <Footer />
    </>
  )
}