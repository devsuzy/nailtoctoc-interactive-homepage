'use client'

import { useEffect, useRef } from 'react'
import { getLenis } from '@/lib/lenis'

// FeaturesSection에서 스냅 애니메이션 진행 여부를 확인하기 위한 공유 잠금
export const snapLock = { active: false }

// 섹션 내부에서 스크롤을 자체 처리할 때 useScrollSnap의 스냅을 차단하는 플래그
export const internalScrollLock = { active: false }

function getSections() {
  return Array.from(document.querySelectorAll('[data-snap-section]')) as HTMLElement[]
}

function getCurrentIndex(sections: HTMLElement[], scrollY: number, viewportH: number) {
  let currentIndex = 0
  for (let i = 0; i < sections.length; i++) {
    const top = sections[i].getBoundingClientRect().top + scrollY
    if (scrollY >= top - viewportH * 0.3) currentIndex = i
  }
  return currentIndex
}

export function useScrollSnap() {
  const isScrollingRef = useRef(false)
  const touchStartYRef = useRef(0)
  const touchInterceptingRef = useRef(false)
  const touchDirectionRef = useRef<1 | -1>(1)

  useEffect(() => {
    const executeSnap = (direction: 1 | -1) => {
      const sections = getSections()
      if (sections.length === 0) return

      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const currentIndex = getCurrentIndex(sections, scrollY, viewportH)
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))

      if (targetIndex === currentIndex) return

      const lenis = getLenis()
      const targetTop = sections[targetIndex].getBoundingClientRect().top + scrollY

      isScrollingRef.current = true
      snapLock.active = true

      const unlock = () => {
        isScrollingRef.current = false
        snapLock.active = false
      }

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

    // ─── Wheel (Desktop) ───────────────────────────────────────────────
    const handleWheel = (e: WheelEvent) => {
      if (internalScrollLock.active) return
      if (isScrollingRef.current) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      const sections = getSections()
      if (sections.length === 0) return

      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const direction = e.deltaY > 0 ? 1 : -1
      const currentIndex = getCurrentIndex(sections, scrollY, viewportH)
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))

      if (targetIndex === currentIndex) {
        if (direction > 0) {
          const sectionBottom = sections[currentIndex].getBoundingClientRect().bottom
          if (sectionBottom > viewportH + 1) return
        }
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      if (direction < 0) {
        const sectionTop = sections[currentIndex].getBoundingClientRect().top
        if (sectionTop < -1) return
      }

      e.preventDefault()
      e.stopImmediatePropagation()
      executeSnap(direction)
    }

    // ─── Touch (Mobile) ────────────────────────────────────────────────
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY
      touchInterceptingRef.current = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      // 스냅 애니메이션 진행 중 → 모든 터치 차단
      if (isScrollingRef.current) {
        e.preventDefault()
        return
      }

      if (internalScrollLock.active) return

      const deltaY = touchStartYRef.current - e.touches[0].clientY

      // 방향 판단에 충분한 거리가 쌓이기 전 → 대기
      if (Math.abs(deltaY) < 8) return

      const direction = deltaY > 0 ? 1 : -1
      const sections = getSections()
      if (sections.length === 0) return

      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      const currentIndex = getCurrentIndex(sections, scrollY, viewportH)
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction))

      // 이미 인터셉트 중이면 계속 차단
      if (touchInterceptingRef.current) {
        e.preventDefault()
        return
      }

      // 경계 도달 → 스냅 불필요, 자연 스크롤 허용
      if (targetIndex === currentIndex) {
        if (direction > 0) {
          const sectionBottom = sections[currentIndex].getBoundingClientRect().bottom
          if (sectionBottom > viewportH + 1) return
        }
        return
      }

      // 높이가 큰 섹션 내부 위로 스크롤 → 자연 스크롤 허용
      if (direction < 0) {
        const sectionTop = sections[currentIndex].getBoundingClientRect().top
        if (sectionTop < -1) return
      }

      // 스냅 대상 섹션 → 네이티브 스크롤 차단 시작
      touchInterceptingRef.current = true
      touchDirectionRef.current = direction
      e.preventDefault()
    }

    const handleTouchEnd = () => {
      if (!touchInterceptingRef.current) return
      touchInterceptingRef.current = false

      const deltaY = touchStartYRef.current - (window.scrollY) // 이미 저장된 direction 사용
      executeSnap(touchDirectionRef.current)
    }

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel, true)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])
}