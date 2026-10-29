'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-right').forEach((el) => {
        el.classList.add('is-visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    )

    let isPreloaderHidden = false

    const observeElements = () => {
      if (!isPreloaderHidden) {
        return
      }

      document.querySelectorAll('.reveal, .reveal-right').forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          observer.observe(el)
        }
      })
    }

    const checkInitiallyVisible = () => {
      document.querySelectorAll('.reveal, .reveal-right').forEach((el) => {
        if (!el.classList.contains('is-visible')) {
          const rect = el.getBoundingClientRect()
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
          if (isInViewport) {
            el.classList.add('is-visible')
          }
        }
      })
    }

    const mutationObserver = new MutationObserver((mutations) => {
      if (!isPreloaderHidden) {
        return
      }

      let shouldObserve = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldObserve = true
        }
      })
      if (shouldObserve) {
        observeElements()
      }
    })

    const handlePreloaderHide = () => {
      isPreloaderHidden = true
      observeElements()
      checkInitiallyVisible()
    }

    const handlePreloaderShow = () => {
      isPreloaderHidden = false
      observer.disconnect()
      document.querySelectorAll('.reveal, .reveal-right').forEach((el) => {
        el.classList.remove('is-visible')
      })
    }

    window.addEventListener('preloader-show', handlePreloaderShow)
    window.addEventListener('preloader-hide', handlePreloaderHide)

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('preloader-show', handlePreloaderShow)
      window.removeEventListener('preloader-hide', handlePreloaderHide)
    }
  }, [])

  return null
}
