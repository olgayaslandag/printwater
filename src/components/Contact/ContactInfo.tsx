import Reveal from '@/src/components/Reveal'

export default function ContactInfo() {
  return (
    <div className="contact-right">
      <Reveal as="div" className="contact-number" delay={100}>0212 269 52 42</Reveal>
      <Reveal as="div" delay={200}>
        <a href="mailto:info@printwater.com" className="contact-mail">info@printwater.com</a>
      </Reveal>
    </div>
  )
}
