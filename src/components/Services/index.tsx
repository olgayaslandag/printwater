import { services } from './services'
import ServiceCard from './ServiceCard'
import Reveal from '@/src/components/Reveal'
import Link from 'next/link'

export default function Services() {
  return (
    <section id="services" className="section soft">
      <div className="container">
        <Reveal as="div" className="section-head" delay={0}>
          <div>
            <div className="kicker">HİZMETLERİMİZ</div>
            <h2>İhtiyacınıza Özel Çözümler</h2>
          </div>
          <Link href="/hizmetler" className="link">Tüm Çözümler →</Link>
        </Reveal>
        <div className="services">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} delay={index * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
