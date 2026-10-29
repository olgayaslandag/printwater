'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from './navLinks'

interface OffcanvasProps {
  isOpen: boolean
  onClose: () => void
}

export default function Offcanvas({ isOpen, onClose }: OffcanvasProps) {
  const pathname = usePathname()

  return (
    <>
      <div
        className={`offcanvas-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`offcanvas-panel ${isOpen ? 'visible' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
      >
        <div className="offcanvas-header">
          <span className="offcanvas-close" onClick={onClose} aria-label="Menüyü kapat">
            ✕
          </span>
        </div>
        <nav className="offcanvas-nav">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
          <Link href="/iletisim" className="nav-cta" onClick={onClose}>
            İletişime Geç →
          </Link>
        </nav>
      </div>
    </>
  )
}
