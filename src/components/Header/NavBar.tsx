'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from './navLinks'

interface NavBarProps {
  onMenuClick: () => void
  scrolled: boolean
}

export default function NavBar({ onMenuClick, scrolled }: NavBarProps) {
  const pathname = usePathname()

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container nav-inner">
        <Link href="/" className="logo" aria-label="PrintWater Ana Sayfa">
          <img src="/img/logo.webp" alt="PrintWater Logo" width="200" height="40" />
        </Link>

        <div className="menu">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <Link href="/iletisim" className="nav-cta">
          İletişime Geç →
        </Link>

        <span
          className="mobile"
          onClick={onMenuClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onMenuClick()}
          aria-label="Menüyü aç"
        >
          ☰
        </span>
      </div>
    </nav>
  )
}