'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  value: string
  duration?: number
}

export default function Counter({ value, duration = 1500 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  const parsed = value.match(/^(\D*)(\d+)(.*)$/)
  const hasNumber = Boolean(parsed)
  const prefix = parsed ? parsed[1] : ''
  const target = parsed ? parseInt(parsed[2], 10) : 0
  const suffix = parsed ? parsed[3] : ''

  useEffect(() => {
    if (started) return
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setStarted(true)
      setDisplay(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started, target])

  useEffect(() => {
    if (!started || !hasNumber) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, hasNumber, target, duration])

  if (!hasNumber) {
    return <span ref={ref}>{value}</span>
  }

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
