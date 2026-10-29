import Link from 'next/link'
import Reveal from '@/src/components/Reveal'

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
  delay?: number
}

export default function FooterColumn({ title, links, delay = 0 }: FooterColumnProps) {
  return (
    <Reveal delay={delay}>
      <h4>{title}</h4>
      {links.map((link, index) => (
        <Link key={index} href={link.href}>
          {link.label}
        </Link>
      ))}
    </Reveal>
  )
}
