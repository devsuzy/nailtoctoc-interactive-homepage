'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import { snapLock } from '@/hooks/useScrollSnap'
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

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const phaseRef = useRef<'header' | 'animating' | 'content'>('header')
  const [activeTab, setActiveTab] = useState('faq')

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
        phaseRef.current = 'header'
        if (introRef.current) introRef.current.style.pointerEvents = ''
      },
    })

    tl.to(titleRef.current, { y: -80, autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' })
    tl.to(tabsRef.current, { y: -50, autoAlpha: 0, duration: 0.45, ease: 'power2.inOut' }, 0)
    tl.to(contentRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.15)

    tlRef.current = tl

    return () => { tl.kill() }
  }, [])

  const goToContent = useCallback(() => {
    phaseRef.current = 'animating'
    tlRef.current?.play()
  }, [])

  const goToHeader = useCallback(() => {
    phaseRef.current = 'animating'
    tlRef.current?.reverse()
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

      if (phase === 'animating') {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      if (phase === 'header' && scrollingDown) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToContent()
        return
      }

      if (phase === 'content' && !scrollingDown && isAtSectionTop) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToHeader()
        return
      }
    }

    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => window.removeEventListener('wheel', handleWheel, { capture: true })
  }, [goToContent, goToHeader])

  return (
    <section ref={sectionRef} data-snap-section className="relative bg-white min-h-screen">
      {/* 인트로 오버레이: title + tab triggers */}
      <div
        ref={introRef}
        className="absolute top-0 left-0 right-0 h-screen z-20 flex flex-col items-center justify-center gap-10 px-8"
      >
        <div ref={titleRef}>
          <p className="text-center text-2xl font-semibold text-neutral-900 leading-snug tracking-tight whitespace-pre-line md:whitespace-normal md:text-3xl xl:text-4xl">
            {'네일톡톡에\n궁금한 점이 있으신가요?'}
          </p>
        </div>

        <div ref={tabsRef}>
          <ul className="flex flex-wrap justify-center gap-4">
            {tabData.map((tab) => (
              <li key={tab.value}>
                <button
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors md:px-5 md:text-base cursor-pointer ${
                    activeTab === tab.value
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

      {/* 컨텐츠 영역: 탭별 독립 컴포넌트 */}
      <div ref={contentRef} className="relative z-10 min-h-screen px-5 md:px-0 pt-32 pb-24 max-w-3xl mx-auto">
        <TabContent activeTab={activeTab} />
      </div>
    </section>
  )
}