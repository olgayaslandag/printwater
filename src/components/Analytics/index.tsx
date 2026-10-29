'use client'

import { useEffect } from 'react'

const GA_ID = 'G-9KX9J35YBL'
const CONSENT_KEY = 'printwater-cookie-consent'

export default function Analytics() {
  useEffect(() => {
    const load = () => {
      if (document.getElementById('ga-script')) return
      const s = document.createElement('script')
      s.id = 'ga-script'
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(s)
      const inline = document.createElement('script')
      inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`
      document.head.appendChild(inline)
    }

    const check = () => {
      if (localStorage.getItem(CONSENT_KEY) === 'accepted') load()
    }

    check()
    const handler = () => check()
    window.addEventListener('storage', handler)
    window.addEventListener('printwater-consent', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('printwater-consent', handler)
    }
  }, [])

  return null
}
