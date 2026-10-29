'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import TopBar from './TopBar'
import NavBar from './NavBar'
import Offcanvas from './Offcanvas'
import Reveal from '@/src/components/Reveal'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)
  const tickingRef = useRef(false)

  const handleScroll = useCallback(() => {
    if (!tickingRef.current) {
      tickingRef.current = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20)
        tickingRef.current = false
      })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (offcanvasOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('offcanvas-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('offcanvas-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('offcanvas-open')
    }
  }, [offcanvasOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && offcanvasOpen) {
        setOffcanvasOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [offcanvasOpen])

  return (
    <>
      <Reveal>
        <TopBar />
      </Reveal>
      <Reveal delay={120}>
        <NavBar scrolled={scrolled} onMenuClick={() => setOffcanvasOpen(true)} />
      </Reveal>
      <Offcanvas isOpen={offcanvasOpen} onClose={() => setOffcanvasOpen(false)} />
    </>
  )
}