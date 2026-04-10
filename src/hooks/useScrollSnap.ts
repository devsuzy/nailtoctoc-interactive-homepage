'use client'

import { useEffect, useRef } from 'react'
import { getLenis } from '@/lib/lenis'

// FeaturesSection에서 스냅 애니메이션 진행 여부를 확인하기 위한 공유 잠금
export const snapLock = { active: false }

export function useScrollSnap() {
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 스냅 애니메이션 진행 중 → 모든 스크롤 완전 차단 (Lenis 포함)
      if (isScrollingRef.current) {
        e.preventDefault()
        e.stopImmediatePropagation()
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

      // 경계에서 더 이상 이동 불가
      if (targetIndex === currentIndex) {
        // 마지막 섹션에서 아래로 스크롤 시, 섹션에 더 볼 컨텐츠가 있으면 자연 스크롤 허용
        if (direction > 0) {
          const sectionBottom = sections[currentIndex].getBoundingClientRect().bottom
          if (sectionBottom > viewportH + 1) return
        }
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      // 높이가 큰 섹션(e.g. FaqSection) 내부에서 위로 스크롤 시 섹션 top에 도달하기 전까지 자연 스크롤 허용
      if (direction < 0) {
        const sectionTop = sections[currentIndex].getBoundingClientRect().top
        if (sectionTop < -1) return
      }

      e.preventDefault()
      e.stopImmediatePropagation()

      const lenis = getLenis()
      const targetTop = sections[targetIndex].getBoundingClientRect().top + scrollY

      isScrollingRef.current = true
      snapLock.active = true

      const unlock = () => {
        isScrollingRef.current = false
        snapLock.active = false
      }

      // 안전 타임아웃 (onComplete 미호출 대비)
      const safetyTimer = setTimeout(unlock, 1600)

      if (lenis) {
        lenis.scrollTo(targetTop, {
          duration: 1.2,
          onComplete: () => {
            clearTimeout(safetyTimer)
            unlock()
          },
        })
      } else {
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
        setTimeout(() => {
          clearTimeout(safetyTimer)
          unlock()
        }, 1200)
      }
    }

    // capture: true → FeaturesSection(capture, 먼저 등록) 이후, Lenis(bubble) 이전에 실행
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    return () => window.removeEventListener('wheel', handleWheel, true)
  }, [])
}