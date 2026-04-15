'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import { snapLock, internalScrollLock } from '@/hooks/useScrollSnap'
import { getLenis } from '@/lib/lenis'
import HowToUseContent from './faq/HowToUseContent'
import PrintTypeContent from './faq/PrintTypeContent'
import NailTipTypeContent from './faq/NailTipTypeContent'
import StudioContent from './faq/StudioContent'
import FaqContent from './faq/FaqContent'

const tabData = [
  { value: 'how-to-use', trigger: '이용 방법' },
  { value: 'print-type', trigger: '프린트 방식' },
  { value: 'nailTip-type', trigger: '네일 팁 종류' },
  { value: 'studio', trigger: '네일 아트 스튜디오' },
  { value: 'faq', trigger: '가맹 문의 FAQ' },
]

function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'how-to-use':   return <HowToUseContent />
    case 'print-type':   return <PrintTypeContent />
    case 'nailTip-type': return <NailTipTypeContent />
    case 'studio':       return <StudioContent />
    case 'faq':          return <FaqContent />
    default:             return null
  }
}

/**
 * 스크롤 스텝
 * step0: title + tabs 노출, 모든 탭 비활성화
 * step1: title + tabs 노출, 기본값(faq) 탭 활성화
 * animating: step1 ↔ content 전환 중
 * content: 콘텐츠 노출, title + tabs 숨김
 */
type Phase = 'step0' | 'step1' | 'animating' | 'content'

export default function FaqSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const introRef    = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLDivElement>(null)
  const tabsRef     = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const tlRef       = useRef<gsap.core.Timeline | null>(null)
  const phaseRef    = useRef<Phase>('step0')
  const lockRef     = useRef(false)

  const [activeTab, setActiveTab]       = useState('faq')
  const [showActive, setShowActive]     = useState(false)
  // content 단계에서만 section 높이를 min-h-screen으로 열어줌
  // step0/step1은 h-screen으로 고정해 snap이 항상 100vh로 동작
  const [isContentPhase, setIsContentPhase] = useState(false)

  useHeaderSection(sectionRef, 'white')

  useEffect(() => {
    gsap.set(contentRef.current, { autoAlpha: 0, y: 40 })

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        phaseRef.current = 'content'
        if (introRef.current) introRef.current.style.pointerEvents = 'none'
      },
      onReverseComplete: () => {
        phaseRef.current = 'step1'
        setIsContentPhase(false)
        if (introRef.current) introRef.current.style.pointerEvents = ''
      },
    })

    tl.to(titleRef.current,   { y: -80, autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' })
    tl.to(tabsRef.current,    { y: -50, autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, 0)
    tl.to(contentRef.current, { autoAlpha: 1, y: 0,   duration: 0.5,  ease: 'power2.out'  }, 0.15)

    tlRef.current = tl
    return () => { tl.kill() }
  }, [])

  /** step0 → step1 */
  const goToStep1 = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    phaseRef.current = 'step1'
    internalScrollLock.active = true
    setShowActive(true)
    setTimeout(() => { lockRef.current = false }, 400)
  }, [])

  /** step1 → step0 */
  const goToStep0 = useCallback(() => {
    if (lockRef.current) return
    lockRef.current = true
    phaseRef.current = 'step0'
    internalScrollLock.active = false
    setShowActive(false)
    setTimeout(() => { lockRef.current = false }, 400)
  }, [])

  /** step1 → content */
  const goToContent = useCallback(() => {
    phaseRef.current = 'animating'
    internalScrollLock.active = true
    setIsContentPhase(true) // section을 min-h-screen으로 확장
    tlRef.current?.play()
  }, [])

  /** content → step1 */
  const goToStep1FromContent = useCallback(() => {
    phaseRef.current = 'animating'
    tlRef.current?.reverse()
    // setIsContentPhase(false)는 onReverseComplete에서 처리
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (snapLock.active) return

      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.top > 0 || rect.bottom <= 0) return

      const phase = phaseRef.current
      const scrollingDown = e.deltaY > 0
      const isAtSectionTop = Math.abs(rect.top) < window.innerHeight * 0.05

      if (phase === 'animating' || lockRef.current) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      // step0 → step1
      if (phase === 'step0' && scrollingDown) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToStep1()
        return
      }

      // step1 → content
      if (phase === 'step1' && scrollingDown) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToContent()
        return
      }

      // content + 스크롤 업
      if (phase === 'content' && !scrollingDown) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const section = sectionRef.current!
        const sectionTopY = section.getBoundingClientRect().top + window.scrollY
        const atTop = window.scrollY <= sectionTopY + 10

        if (atTop) {
          // 섹션 최상단 → step1으로 복귀
          goToStep1FromContent()
        } else {
          // 아직 content 내부 → Lenis로 위로 스크롤
          const lenis = getLenis()
          const target = Math.max(sectionTopY, window.scrollY - window.innerHeight * 0.7)
          lenis?.scrollTo(target, { duration: 0.6 })
        }
        return
      }

      // step1 → step0
      if (phase === 'step1' && !scrollingDown && isAtSectionTop) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToStep0()
        return
      }
    }

    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => window.removeEventListener('wheel', handleWheel, { capture: true })
  }, [goToStep0, goToStep1, goToContent, goToStep1FromContent])

  const handleTabClick = (value: string) => {
    if (phaseRef.current === 'step0') {
      phaseRef.current = 'step1'
      internalScrollLock.active = true
      setShowActive(true)
    }
    setActiveTab(value)

    setTimeout(() => {
      if (phaseRef.current === 'step1') {
        goToContent()
      }
    }, 250)
  }

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className={`relative bg-white ${isContentPhase ? 'min-h-screen' : 'h-screen overflow-hidden'}`}
    >
      {/* 인트로 오버레이: title + tab triggers */}
      <div
        ref={introRef}
        className="absolute top-0 left-0 right-0 h-screen z-20 flex flex-col items-center justify-center gap-6 px-8"
      >
        <div ref={titleRef}>
          <p className="text-center text-2xl font-semibold text-neutral-900 leading-snug tracking-tight whitespace-pre-line md:whitespace-normal md:text-3xl xl:text-4xl">
            {'네일톡톡에\n궁금한 점이 있으신가요?'}
          </p>
        </div>

        <div ref={tabsRef}>
          <ul className="flex flex-wrap justify-center gap-3 md:gap-4">
            {tabData.map((tab) => (
              <li key={tab.value}>
                <button
                  onClick={() => handleTabClick(tab.value)}
                  className={`px-6 py-4 rounded-full text-base font-semibold transition-colors md:text-lg cursor-pointer ${
                    showActive && activeTab === tab.value
                      ? 'bg-foreground text-white'
                      : 'bg-grayscale-100 text-grayscale-400 hover:bg-foreground hover:text-white'
                  }`}
                >
                  {tab.trigger}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      <div ref={contentRef} className="relative z-10 min-h-screen px-5 md:px-0 pt-[81px] md:pt-[123px] max-w-[68.75rem] mx-auto">
        <TabContent activeTab={activeTab} />
      </div>
    </section>
  )
}