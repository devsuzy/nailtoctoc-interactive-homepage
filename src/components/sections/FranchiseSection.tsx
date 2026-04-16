'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'

const franchises = [
  { text: '✓ 전담 매니저를 통한 \n정기/수신 컨설팅' },
  { text: '✓ 시즌, 이벤트별 \n신규 디자인 및 메뉴 제안' },
  { text: '✓ 마케팅 소재 \n(사진, 영상, 문구 등) 제공' },
  { text: '✓ 운영 관련 메뉴얼 및 \n공지사항 수시 업데이트' },
]

// 6개 스텝 × 각 1s = 총 6s 타임라인
// ScrollTrigger end: '+=600%' → 각 스텝당 100vh 스크롤
const STEP_1 = 1.0  // dim + title 완료
const STEP_2 = 2.0  // list 등장 완료
const STEP_3 = 3.0  // item[0] 강조
const STEP_4 = 4.0  // item[1] 강조
const STEP_5 = 5.0  // item[2] 강조
const TOTAL  = 6.0  // item[3] 강조 (end)

export default function FranchiseSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'transparent')

  const dimRef   = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>(Array(franchises.length).fill(null))

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 초기 상태
      gsap.set(dimRef.current,   { autoAlpha: 0 })
      gsap.set(titleRef.current, { autoAlpha: 0 })
      gsap.set(listRef.current,  { autoAlpha: 0 })
      itemRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0.5 }) })

      const tl = gsap.timeline()

      // Step 0→1: dim 등장 + title 등장
      tl.to(dimRef.current,   { autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 0)
      tl.to(titleRef.current, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.2)

      // Step 1→2: title 퇴장 + list 등장
      tl.to(titleRef.current, { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.inOut' }, STEP_1)
      tl.to(listRef.current,  { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, STEP_1 + 0.3)

      // Step 2→3: item[0] 강조
      tl.to(itemRefs.current[0], { opacity: 1, duration: 0.2, ease: 'power2.out' }, STEP_2)

      // Step 3→4: item[0→1]
      tl.to(itemRefs.current[0], { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, STEP_3)
      tl.to(itemRefs.current[1], { opacity: 1,   duration: 0.2, ease: 'power2.inOut' }, STEP_3)

      // Step 4→5: item[1→2]
      tl.to(itemRefs.current[1], { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, STEP_4)
      tl.to(itemRefs.current[2], { opacity: 1,   duration: 0.2, ease: 'power2.inOut' }, STEP_4)

      // Step 5→6: item[2→3]
      tl.to(itemRefs.current[2], { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, STEP_5)
      tl.to(itemRefs.current[3], { opacity: 1,   duration: 0.2, ease: 'power2.inOut' }, STEP_5)

      // 타임라인을 TOTAL까지 늘려 균등 간격 보장
      tl.set({}, {}, TOTAL)

      // ScrollTrigger: 실제 스크롤이 타임라인을 구동
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=600%',   // 6단계 × 100vh
        pin: true,
        scrub: 1.5,
        animation: tl,
        snap: {
          snapTo: [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1],
          duration: { min: 0.1, max: 0.6 },
          delay: 0,
          ease: 'power2.inOut',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
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

      {/* Title */}
      <div ref={titleRef} className="absolute inset-0 flex items-center justify-center px-10">
        <p className="text-center text-2xl font-bold text-white leading-snug drop-shadow-lg md:text-4xl xl:text-5xl">
          가맹 점주님들에게 <br />
          최고의 운영 지원을 약속합니다
        </p>
      </div>

      {/* List */}
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