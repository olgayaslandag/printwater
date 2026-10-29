import { techItems } from './techItems'
import TechItem from './TechItem'
import TechVisual from './TechVisual'
import Reveal from '@/src/components/Reveal'

export default function Technology() {
  return (
    <section id="technology" className="tech">
      <div className="container tech-grid">
        <Reveal as="div" delay={0} direction="right">
          <div className="kicker">TEKNOLOJİ & YAKLAŞIM</div>
          <h2>
            Suyu doğru yönetiyoruz.<br />
            Üretime değer katıyoruz.
          </h2>
          <p>
            PrintWater; baskı ve tekstil proseslerinde su kalitesi, nem ve çevresel koşulların üretim performansına etkisini odağına alan çözümler geliştirir.
          </p>
          <div className="tech-list">
            {techItems.map((item, index) => (
              <TechItem key={index} {...item} delay={index * 140} />
            ))}
          </div>
        </Reveal>
        <Reveal as="div" delay={200} direction="right">
          <TechVisual />
        </Reveal>
      </div>
    </section>
  )
}
