import { footerLinks } from './footerLinks'
import FooterColumn from './FooterColumn'
import Reveal from '@/src/components/Reveal'
import Link from 'next/link'

export default function Footer() {
  return (
    <Reveal as="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <img src="/img/logo_white.webp" alt="PrintWater Logo" width="200" height="40" />
            </div>
            <p>
              Su teknolojileriyle daha verimli, daha sürdürülebilir bir gelecek için güvenilir çözüm ortağınız.
            </p>
          </div>
          <FooterColumn title="KURUMSAL" links={footerLinks.corporate} delay={100} />
          <FooterColumn title="ÇÖZÜMLERİMİZ" links={footerLinks.solutions} delay={200} />
          <FooterColumn title="BİLGİ MERKEZİ" links={footerLinks.infoCenter} delay={300} />
        </div>
        <div className="footer-bottom">
          <span>© 2026 PrintWater. Tüm hakları saklıdır.</span>
          <span>
            <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link>
            {' · '}
            <Link href="/kvkk">KVKK</Link>
          </span>
        </div>
      </div>
    </Reveal>
  )
}
