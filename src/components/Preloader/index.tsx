'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    window.dispatchEvent(new Event('preloader-show'))

    const timer = setTimeout(() => {
      setIsLoading(false)
      window.dispatchEvent(new Event('preloader-hide'))
    }, 0)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="preloader" aria-hidden="true">
      <img src="/img/logo.webp" alt="PrintWater" className="preloader-logo" />
    </div>
  )
}
