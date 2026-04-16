'use client'

import { useEffect, useRef } from 'react'
import { getLenis } from '@/lib/lenis'

// FeaturesSection에서 스냅 애니메이션 진행 여부를 확인하기 위한 공유 잠금
export const snapLock = { active: false }

// 섹션 내부에서 스크롤을 자체 처리할 때 useScrollSnap의 스냅을 차단하는 플래그
export const internalScrollLock = { active: false }

export function useScrollSnap() {
  const isScrollingRef = useRef(false)
  const touchStartYRef = useRef(0)

  useEffect(() => {
    const snapToDirection = (direction: 1 | -1, preventDefault: () => void, stopPropagation: () => void) => {
      if (internalScrollLock.active) return false
      if (isScrollingRef.current) {
        preventDefault()
        stopPropagation()
        return false
      }

      const sections = Array.from(
        document.querySelectorAll('[data-snap-section]')
      ) as HTMLElement[]

      if (sections.length === 0) return false

      const scrollY = window.scrollY
      const viewportH = window.innerHeight

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
        if (direction > 0) {
          const sectionBottom = sections[currentIndex].getBoundingClientRect().bottom
          if (sectionBottom > viewportH + 1) return false
        }
        preventDefault()
        stopPropagation()
        return false
      }

      // 높이가 큰 섹션(e.g. FaqSection) 내부에서 위로 스크롤 시 섹션 top에 도달하기 전까지 자연 스크롤 허용
      if (direction < 0) {
        const sectionTop = sections[currentIndex].getBoundingClientRect().top
        if (sectionTop < -1) return false
      }

      preventDefault()
      stopPropagation()

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

      return true
    }

    const handleWheel = (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 1 : -1
      snapToDirection(
        direction,
        () => e.preventDefault(),
        () => e.stopImmediatePropagation()
      )
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      // 스냅 애니메이션 진행 중에는 터치 스크롤 차단
      if (isScrollingRef.current) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY
      // 최소 스와이프 거리 미달 시 무시 (단순 탭 등)
      if (Math.abs(deltaY) < 50) return

      const direction = deltaY > 0 ? 1 : -1
      snapToDirection(
        direction,
        () => e.preventDefault(),
        () => {}
      )
    }

    // capture: true → FeaturesSection(capture, 먼저 등록) 이후, Lenis(bubble) 이전에 실행
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel, true)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])
}