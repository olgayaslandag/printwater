import ContactInfo from './ContactInfo'
import Reveal from '@/src/components/Reveal'

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <Reveal as="div" className="contact-box" delay={0}>
          <div>
            <div className="kicker">PROJENİZİ KONUŞALIM</div>
            <h2>
              İhtiyacınız için doğru<br />
              çözümü birlikte bulalım.
            </h2>
          </div>
          <ContactInfo />
        </Reveal>
      </div>
    </section>
  )
}
