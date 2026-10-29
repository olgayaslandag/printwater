import Link from 'next/link'

export default function HeroActions() {
  return (
    <div className="actions">
      <Link href="#services" className="btn btn-primary">
        ÇÖZÜMLERİMİZİ KEŞFEDİN →
      </Link>
      <Link href="#technology" className="btn btn-ghost">
        ○ TEKNOLOJİ
      </Link>
    </div>
  )
}
