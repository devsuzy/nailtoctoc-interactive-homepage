'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'
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

// step0: 섹션 진입 (탭 비활성)
// step1: 탭 활성
// animating: 전환 중
// content: 컨텐츠 노출
type Phase = 'step0' | 'step1' | 'animating' | 'content'

export default function FaqSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const introRef    = useRef<HTMLDivElement>(null)
  const titleRef    = useRef<HTMLDivElement>(null)
  const tabsRef     = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const tlRef       = useRef<gsap.core.Timeline | null>(null)
  const phaseRef    = useRef<Phase>('step0')

  const [activeTab, setActiveTab]           = useState('faq')
  const [showActive, setShowActive]         = useState(false)
  const [isContentPhase, setIsContentPhase] = useState(false)

  useHeaderSection(sectionRef, 'white')

  // ── 단계별 전환 함수 (effects보다 먼저 선언) ─────────────
  const goToStep1 = useCallback(() => {
    phaseRef.current = 'step1'
    setShowActive(true)
  }, [])

  const goToStep0 = useCallback(() => {
    phaseRef.current = 'step0'
    setShowActive(false)
  }, [])

  const goToContent = useCallback(() => {
    if (phaseRef.current !== 'step1') return
    phaseRef.current = 'animating'
    setIsContentPhase(true)
    requestAnimationFrame(() => tlRef.current?.play())
  }, [])

  const goToIntro = useCallback(() => {
    if (phaseRef.current !== 'content') return
    phaseRef.current = 'animating'
    // Lenis momentum 초기화: 섹션 상단으로 즉시 스냅 (관성으로 섹션이 지나치는 것 방지)
    const lenis = getLenis()
    if (lenis && sectionRef.current) {
      const r = sectionRef.current.getBoundingClientRect()
      lenis.scrollTo(window.scrollY + r.top, { immediate: true })
    }
    tlRef.current?.reverse()
  }, [])

  // ── intro ↔ content 전환 타임라인 ──────────────────────────
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
        setShowActive(true)
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

  // ── Lenis 스크롤 감지 ──────────────────────────────────────
  // lenis.stop() 대신 scrollTo(immediate)로 위치 고정 → 스크롤바 항상 표시
  // React 자식 effect가 먼저 실행되므로 setTimeout(0)으로 Lenis 초기화 후 구독
  useEffect(() => {
    let offFn: (() => void) | undefined

    const timer = setTimeout(() => {
      const lenis = getLenis()
      if (!lenis) return

      const onLenisScroll = (l: { direction: 1 | -1 | 0 }) => {
        const phase = phaseRef.current
        const rect = sectionRef.current?.getBoundingClientRect()
        if (!rect) return

        // ▼ 아래로 스크롤: step0/step1에서 섹션 상단 접근 시 스냅
        if ((phase === 'step0' || phase === 'step1') && l.direction === 1) {
          if (Math.abs(rect.top) < 1) return  // 이미 섹션 상단 (무한 루프 방지)
          if (rect.top > -10 && rect.top < 100) {
            lenis.scrollTo(window.scrollY + rect.top, { immediate: true })
          }
          return
        }

        // ▲ 위로 스크롤: content에서 섹션 상단 도달 시 goToIntro 트리거
        // wheel 이벤트 없는 Lenis 관성 스크롤도 캐치 (범위 확장: 빠른 모멘텀 대응)
        if (phase === 'content' && l.direction === -1 && rect.top > -30 && rect.top < 15) {
          goToIntro()
          return
        }

        // ▲ 위로 스크롤: step1에서 drift 방지 (안전장치)
        if (phase === 'step1' && l.direction === -1 && rect.top < -1 && rect.top > -30) {
          lenis.scrollTo(window.scrollY + rect.top, { immediate: true })
        }
      }

      lenis.on('scroll', onLenisScroll)
      offFn = () => lenis.off('scroll', onLenisScroll)
    }, 0)

    return () => {
      clearTimeout(timer)
      offFn?.()
    }
  }, [goToIntro])

  // ── Wheel (PC) ────────────────────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const phase = phaseRef.current
      if (phase === 'animating') {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return

      const atSectionTop = Math.abs(rect.top) < 15
      const scrollingDown = e.deltaY > 0

      if (phase === 'step0' || phase === 'step1') {
        if (!atSectionTop) return

        if (scrollingDown) {
          // 아래 스크롤: Lenis에 전달하지 않고 단계 전환
          e.preventDefault()
          e.stopImmediatePropagation()
          if (phase === 'step0') goToStep1()
          else goToContent()
        } else {
          if (phase === 'step1') {
            e.preventDefault()
            e.stopImmediatePropagation()
            goToStep0()
          }
          // step0 위로 스크롤: preventDefault 없음 → Lenis가 이벤트 수신 → 이전 섹션으로
        }
      } else if (phase === 'content') {
        if (!scrollingDown && atSectionTop) {
          e.preventDefault()
          e.stopImmediatePropagation()
          goToIntro()
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => window.removeEventListener('wheel', handleWheel, { capture: true })
  }, [goToStep0, goToStep1, goToContent, goToIntro])

  // ── Touch (Mobile) ────────────────────────────────────────
  useEffect(() => {
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      const phase = phaseRef.current
      if (phase === 'animating') {
        e.preventDefault()
        return
      }
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      if (Math.abs(rect.top) >= 15) return

      const currentY   = e.touches[0].clientY
      const movingUp   = currentY < touchStartY  // 손가락 위로 = 페이지 아래로 스크롤
      const movingDown = currentY > touchStartY  // 손가락 아래로 = 페이지 위로 스크롤

      if (phase === 'step0') {
        // 페이지 아래 스크롤(손가락 위)만 차단 → 페이지 위 스크롤(손가락 아래)은 허용(이전 섹션)
        if (movingUp) e.preventDefault()
      } else if (phase === 'step1') {
        e.preventDefault()  // 양방향 차단
      } else if (phase === 'content') {
        // 페이지 위 스크롤(손가락 아래) 차단 → goToIntro 트리거 보호
        if (movingDown) e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const phase = phaseRef.current
      if (phase === 'animating') return

      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return

      const deltaY      = touchStartY - e.changedTouches[0].clientY
      const swipedDown  = deltaY > 40
      const swipedUp    = deltaY < -40
      const atSectionTop = Math.abs(rect.top) < 15

      if (phase === 'step0' || phase === 'step1') {
        if (!atSectionTop) return
        if (swipedDown) {
          if (phase === 'step0') goToStep1()
          else goToContent()
        } else if (swipedUp) {
          if (phase === 'step1') goToStep0()
          // step0 위 스와이프: 자연 스크롤 (preventDefault 없음)
        }
      } else if (phase === 'content' && swipedUp && atSectionTop) {
        goToIntro()
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove',  handleTouchMove,  { passive: false })
    window.addEventListener('touchend',   handleTouchEnd,   { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove',  handleTouchMove)
      window.removeEventListener('touchend',   handleTouchEnd)
    }
  }, [goToStep0, goToStep1, goToContent, goToIntro])

  // ── Tab 클릭 → step1 건너뛰고 바로 content ───────────────
  const handleTabClick = (value: string) => {
    setActiveTab(value)
    if (phaseRef.current === 'step0') {
      phaseRef.current = 'step1'
      setShowActive(true)
    }
    if (phaseRef.current === 'step1') goToContent()
  }

  return (
    <section
      ref={sectionRef}
      className={`relative bg-white ${isContentPhase ? 'min-h-screen' : 'h-screen overflow-hidden'}`}
    >
      {/* 인트로 오버레이: title + tabs */}
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