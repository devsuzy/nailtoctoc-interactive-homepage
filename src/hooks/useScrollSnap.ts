'use client'

import { useEffect, useRef } from 'react'
import { getLenis } from '@/lib/lenis'

export function useScrollSnap() {
  const cooldownRef = useRef(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 쿨다운 중엔 스크롤 차단
      if (cooldownRef.current) {
        e.preventDefault()
        return
      }

      const sections = Array.from(
        document.querySelectorAll('[data-snap-section]')
      ) as HTMLElement[]

      if (sections.length === 0) return

      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const direction = e.deltaY > 0 ? 1 : -1

      // 현재 섹션 인덱스 계산
      let currentIndex = 0
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].getBoundingClientRect().top + scrollY
        if (scrollY >= top - viewportH * 0.3) {
          currentIndex = i
        }
      }

      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))

      if (targetIndex === currentIndex) return

      e.preventDefault()

      const lenis = getLenis()
      const targetTop =
        sections[targetIndex].getBoundingClientRect().top + scrollY

      cooldownRef.current = true

      if (lenis) {
        lenis.scrollTo(targetTop, { duration: 1.2 })
      } else {
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
      }

      setTimeout(() => {
        cooldownRef.current = false
      }, 1400)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])
}