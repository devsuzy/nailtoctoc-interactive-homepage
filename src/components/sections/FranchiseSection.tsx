'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import { snapLock } from '@/hooks/useScrollSnap'

const franchises = [
  { text: '✓ 전담 매니저를 통한 \n정기/수신 컨설팅' },
  { text: '✓ 시즌, 이벤트별 \n신규 디자인 및 메뉴 제안' },
  { text: '✓ 마케팅 소재 \n(사진, 영상, 문구 등) 제공' },
  { text: '✓ 운영 관련 메뉴얼 및 \n공지사항 수시 업데이트' },
]

// Step 0: bg only
// Step 1: dim + title
// Step 2: franchise list (all 50%)
// Step 3~6: 각 항목 순서대로 강조 (opacity 1), 나머지 50%
const MAX_STEP = 6

const STEP_1 = 0.9   // dim(0+0.7) + title(0.25+0.6=0.85) 완료 후
const STEP_2 = 1.7   // list(1.0+0.6=1.6) 완료 후
const STEP_3 = 2.5   // item[0] highlight(2.0+0.4=2.4) 완료 후
const STEP_4 = 3.5   // item[0→1] crossfade(3.0+0.4=3.4) 완료 후
const STEP_5 = 4.5   // item[1→2] crossfade(4.0+0.4=4.4) 완료 후

export default function FranchiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'transparent')

  const dimRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>(Array(franchises.length).fill(null))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const stepRef = useRef(0)
  const stepTimesRef = useRef<number[]>([])
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    gsap.set(dimRef.current, { autoAlpha: 0 })
    gsap.set(titleRef.current, { autoAlpha: 0 })
    gsap.set(listRef.current, { autoAlpha: 0 })
    itemRefs.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 0.5 })
    })

    const tl = gsap.timeline({ paused: true })

    // Step 0 → 1: dim 먼저, title 뒤따라
    tl.to(dimRef.current, { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
    tl.to(titleRef.current, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.25)

    // Step 1 → 2: franchise list 등장 (모든 항목 50%)
    tl.to(titleRef.current, { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, 0.85)
    tl.to(listRef.current, { autoAlpha: 1, duration: 0.2, ease: 'power2.out' }, 1.0)

    // Step 2 → 3: item[0] 강조
    tl.to(itemRefs.current[0], { opacity: 1, duration: 0.2, ease: 'power2.out' }, 2.0)

    // Step 3 → 4: item[0] → 50%, item[1] → 100%
    tl.to(itemRefs.current[0], { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, 3.0)
    tl.to(itemRefs.current[1], { opacity: 1, duration: 0.2, ease: 'power2.inOut' }, 3.0)

    // Step 4 → 5: item[1] → 50%, item[2] → 100%
    tl.to(itemRefs.current[1], { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, 4.0)
    tl.to(itemRefs.current[2], { opacity: 1, duration: 0.2, ease: 'power2.inOut' }, 4.0)

    // Step 5 → 6: item[2] → 50%, item[3] → 100%
    tl.to(itemRefs.current[2], { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, 5.0)
    tl.to(itemRefs.current[3], { opacity: 1, duration: 0.2, ease: 'power2.inOut' }, 5.0)

    stepTimesRef.current = [0, STEP_1, STEP_2, STEP_3, STEP_4, STEP_5, tl.totalDuration()]
    tlRef.current = tl

    return () => { tl.kill() }
  }, [])

  const goToStep = useCallback((newStep: number) => {
    const tl = tlRef.current
    if (!tl || isAnimatingRef.current) return

    isAnimatingRef.current = true
    stepRef.current = newStep

    tl.tweenTo(stepTimesRef.current[newStep], {
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => { isAnimatingRef.current = false },
    })
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (snapLock.active) return

      const rect = sectionRef.current?.getBoundingClientRect()
      const isInView = rect && Math.abs(rect.top) < window.innerHeight * 0.05
      if (!isInView) return

      if (isAnimatingRef.current) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      const scrollingDown = e.deltaY > 0
      const step = stepRef.current

      if (scrollingDown && step < MAX_STEP) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToStep(step + 1)
      } else if (!scrollingDown && step > 0) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToStep(step - 1)
      }
      // step 0 + 스크롤업, step MAX + 스크롤다운 → scroll snap에 위임
    }

    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => window.removeEventListener('wheel', handleWheel, { capture: true })
  }, [goToStep])

  return (
    <section ref={sectionRef} data-snap-section className="relative h-screen overflow-hidden">
      {/* Mobile BG (< md) */}
      <div className="absolute inset-0 md:hidden">
        <Image src="/images/franchise-bg-mo-img.png" alt="franchise background" fill className="object-cover scale-[1.4] translate-y-[-14%]" priority />
      </div>

      {/* PC BG (>= md) */}
      <div className="absolute inset-0 hidden md:block">
        <Image src="/images/franchise-bg-pc-img.png" alt="franchise background" fill className="object-cover" priority />
      </div>

      {/* Dim */}
      <div ref={dimRef} className="absolute inset-0 bg-foreground/70" />

      {/* Title - 정중앙 독립 배치 */}
      <div ref={titleRef} className="absolute inset-0 flex items-center justify-center px-10">
        <p className="text-center text-2xl font-bold text-white leading-snug drop-shadow-lg md:text-4xl xl:text-5xl">
          가맹 점주님들에게 <br />
          최고의 운영 지원을 약속합니다
        </p>
      </div>

      {/* List - 정중앙 독립 배치 */}
      <div ref={listRef} className="absolute inset-0 flex items-center justify-center px-10">
        <ul className="flex flex-col gap-4 md:gap-6">
          {franchises.map((franchise, i) => (
            <li
              key={i}
              ref={(el) => { itemRefs.current[i] = el }}
              className="text-left text-2xl font-bold text-white leading-snug drop-shadow-lg md:text-4xl xl:text-5xl whitespace-pre-line md:whitespace-normal"
            >
              {franchise.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}