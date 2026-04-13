'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import { snapLock } from '@/hooks/useScrollSnap'

const imageConfigs = [
  {
    src: '/images/vision-img-1.png',
    initX: '-65vw', initY: '-55vh',
    sizeClass: 'w-[38vw] h-[10vh] top-[26%] left-[-8%] md:top-[12%] md:left-[6%] md:w-[20vw] md:h-[16vh]',
  },
  {
    src: '/images/vision-img-2.png',
    initX: '0px', initY: '-110vh',
    sizeClass: 'w-[46vw] h-[18vh] top-[13%] right-[0%] md:top-[11%] md:right-[4%] md:w-[18vw] md:h-[24vh]',
  },
  {
    src: '/images/vision-img-3.png',
    initX: '65vw', initY: '-55vh',
    sizeClass: 'w-[28vw] h-[16vh] top-[24%] right-[6%] md:top-[26%] md:right-[1%] md:w-[8vw] md:h-[16vh]',
  },
  {
    src: '/images/vision-img-4.png',
    initX: '-65vw', initY: '55vh',
    sizeClass: 'w-[30vw] h-[18vh] bottom-[16%] left-[-6%] md:bottom-[22%] md:left-[-1%] md:w-[18vw] md:h-[28vh]',
  },
  {
    src: '/images/vision-img-5.png',
    initX: '0px', initY: '110vh',
    sizeClass: 'w-[26vw] h-[14vh] bottom-[9%] left-[14%] md:bottom-[0%] md:left-[20%] md:w-[10vw] md:h-[16vh]',
  },
  {
    src: '/images/vision-img-6.png',
    initX: '65vw', initY: '55vh',
    sizeClass: 'w-[26vw] h-[14vh] bottom-[16%] right-[5%] md:bottom-[10%] md:right-[6%] md:w-[11vw] md:h-[21vh]',
  },
]

const features = [
  {
    id: 1,
    title: 'AI 손톱 인식 기술로 \n 더 정교해진 네일 프린트',
    description: '손톱 모양과 위치를 AI가 자동으로 인식해, \n 디자인이 어긋나지 않도록 정확하게 프린트해요',
    icon: '/images/feature-img-1.svg',
  },
  {
    id: 2,
    title: '안전한 잉크 사용으로 \n 손톱까지 생각한 네일',
    description: '유럽 화장품 안전 기준을 충족한 고품질 \n 잉크로 안심하고 사용할 수 있어요',
    icon: '/images/feature-img-2.svg',
  },
  {
    id: 3,
    title: '빠른 프린팅 기술로 \n 단 5분 네일 완성',
    description: '디자인 선택부터 프린트까지 단 \n 5분이면 네일이 완성돼요',
    icon: '/images/feature-img-3.svg',
  },
]

// 섹션 진입 시 자동으로 이미지 등장 (0.3초 딜레이)
// stepRef -1      : 진입 전 / intro 재생 중
// Step 0 (2.2s)   : 이미지 화면 안 (스크롤 대기)
// Step 1 (3.2s)   : 이미지 퇴장 + 피처 1 표시
// Step 2 (3.8s)   : 피처 2 표시
// Step 3 (totalDur): 피처 3 표시
const INTRO_END_TIME = 2.2
const FEAT_1_TIME = 3.2
const FEAT_2_TIME = 3.8

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'white')

  const imgRefs = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null))
  const textRef = useRef<HTMLDivElement>(null)
  const take2Ref = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>(Array(3).fill(null))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const stepRef = useRef(-1) // -1: intro 미완료, 0~3: 스크롤 단계
  const stepTimesRef = useRef<number[]>([INTRO_END_TIME, FEAT_1_TIME, FEAT_2_TIME, 5.0])
  const isAnimatingRef = useRef(false)
  const introPlayedRef = useRef(false)

  const resetSection = useCallback(() => {
    const tl = tlRef.current
    if (tl) tl.pause().seek(0)
    introPlayedRef.current = false
    stepRef.current = -1
    isAnimatingRef.current = false
    imageConfigs.forEach((config, i) => {
      if (imgRefs.current[i]) gsap.set(imgRefs.current[i], { x: config.initX, y: config.initY })
    })
    if (take2Ref.current) gsap.set(take2Ref.current, { autoAlpha: 0 })
    if (featureRefs.current[0]) gsap.set(featureRefs.current[0], { autoAlpha: 1 })
    if (featureRefs.current[1]) gsap.set(featureRefs.current[1], { autoAlpha: 0 })
    if (featureRefs.current[2]) gsap.set(featureRefs.current[2], { autoAlpha: 0 })
    if (textRef.current) gsap.set(textRef.current, { opacity: 1 })
  }, [])

  // GSAP 타임라인 구성
  useEffect(() => {
    imageConfigs.forEach((config, i) => {
      if (imgRefs.current[i]) gsap.set(imgRefs.current[i], { x: config.initX, y: config.initY })
    })
    if (take2Ref.current) gsap.set(take2Ref.current, { autoAlpha: 0 })
    if (featureRefs.current[1]) gsap.set(featureRefs.current[1], { autoAlpha: 0 })
    if (featureRefs.current[2]) gsap.set(featureRefs.current[2], { autoAlpha: 0 })
    if (textRef.current) gsap.set(textRef.current, { opacity: 1 })

    const tl = gsap.timeline({ paused: true })

    // Phase 1: 이미지 진입 (0.3초 딜레이 후 사방에서 등장)
    imageConfigs.forEach((_, i) => {
      tl.to(
        imgRefs.current[i],
        { x: 0, y: 0, duration: 1.2, ease: 'power3.out' },
        0.3 + i * 0.1,
      )
    })
    // INTRO_END_TIME = 3.0s (이미지 등장 완료, 스크롤 대기)

    // Phase 2: 이미지 퇴장 + 피처 1 등장
    imageConfigs.forEach((config, i) => {
      tl.to(
        imgRefs.current[i],
        { x: config.initX, y: config.initY, duration: 1.0, ease: 'power2.in' },
        INTRO_END_TIME + i * 0.08,
      )
    })
    tl.to(textRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, INTRO_END_TIME)
    tl.to(take2Ref.current, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, INTRO_END_TIME + 0.4)

    // 피처 1 → 2 크로스페이드
    tl.to(featureRefs.current[0], { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, FEAT_1_TIME + 0.2)
    tl.to(featureRefs.current[1], { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, FEAT_1_TIME + 0.2)

    // 피처 2 → 3 크로스페이드
    tl.to(featureRefs.current[1], { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, FEAT_2_TIME + 0.2)
    tl.to(featureRefs.current[2], { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, FEAT_2_TIME + 0.2)

    stepTimesRef.current = [INTRO_END_TIME, FEAT_1_TIME, FEAT_2_TIME, tl.totalDuration()]
    tlRef.current = tl

    return () => { tl.kill() }
  }, [])

  // 섹션 진입 감지 → 0.3초 딜레이 후 intro 자동 재생
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const tl = tlRef.current
        if (!tl) return

        if (entry.isIntersecting) {
          if (!introPlayedRef.current) {
            introPlayedRef.current = true
            stepRef.current = -1
            // 타임라인을 INTRO_END_TIME까지 실시간(ease: none)으로 재생
            tl.tweenTo(INTRO_END_TIME, {
              duration: INTRO_END_TIME,
              ease: 'none',
              onComplete: () => { stepRef.current = 0 },
            })
          }
        } else {
          // 섹션 이탈 시 리셋 (다시 진입하면 이미지가 처음부터 등장)
          resetSection()
        }
      })
    }, { threshold: 0.5 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [resetSection])

  // 지정 스텝으로 타임라인 이동
  const goToStep = useCallback((newStep: number) => {
    const tl = tlRef.current
    if (!tl || isAnimatingRef.current) return

    isAnimatingRef.current = true
    stepRef.current = newStep

    tl.tweenTo(stepTimesRef.current[newStep], {
      duration: 1.0,
      ease: 'power3.out',
      onComplete: () => {
        isAnimatingRef.current = false
      },
    })
  }, [])

  // 스크롤 이벤트 캡처
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (snapLock.active) return

      const rect = sectionRef.current?.getBoundingClientRect()
      const isInView = rect && Math.abs(rect.top) < window.innerHeight * 0.05
      if (!isInView) return

      const step = stepRef.current

      // intro 진행 중 또는 애니메이션 중 스크롤 차단
      if (step < 0 || isAnimatingRef.current) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }

      const scrollingDown = e.deltaY > 0

      if (scrollingDown && step < 3) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToStep(step + 1)
      } else if (!scrollingDown && step > 0) {
        e.preventDefault()
        e.stopImmediatePropagation()
        goToStep(step - 1)
      }
      // step 0 + 스크롤업, step 3 + 스크롤다운 → scroll snap에 위임
    }

    window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
    return () => window.removeEventListener('wheel', handleWheel, { capture: true })
  }, [goToStep])

  return (
    <section
      ref={sectionRef}
      data-snap-section
      className="relative h-screen overflow-hidden bg-white"
    >
      {/* 이미지들 */}
      {imageConfigs.map((config, i) => (
        <div
          key={i}
          ref={(el) => { imgRefs.current[i] = el }}
          className={`absolute overflow-hidden rounded-xl ${config.sizeClass}`}
        >
          <Image src={config.src} alt="" fill className="object-cover" sizes="30vw" />
        </div>
      ))}

      {/* 중앙 텍스트 */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center z-10 px-20 pointer-events-none"
      >
        <p className="text-center text-2xl md:text-4xl xl:text-5xl font-bold text-neutral-900 leading-snug tracking-tight break-all whitespace-pre-line md:whitespace-normal">
          네일톡톡은 네일을 {'\n'} 더 쉽고 빠르게<br />
          만들겠다는 목표를 위해 {'\n'} 나아가고 있습니다.
        </p>
      </div>

      {/* 피처 영역 컨테이너 */}
      <div ref={take2Ref} className="absolute inset-0 z-20 bg-white">
        {features.map((feature, i) => (
          <div
            key={feature.id}
            ref={(el) => { featureRefs.current[i] = el }}
            className="absolute inset-0 flex items-center justify-center px-8 md:px-0"
          >
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 max-w-6xl w-full">
              <Image
                src={feature.icon}
                alt=""
                width={250}
                height={250}
                className="w-60 h-60 md:w-[31.25rem] md:h-[31.25rem] shrink-0"
                priority={i === 0}
              />
              <div className="flex flex-col gap-3 md:gap-5">
                <h3 className="text-2xl md:text-4xl xl:text-5xl font-bold text-neutral-900 leading-snug whitespace-pre-line text-center md:text-left">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-lg xl:text-xl text-neutral-500 leading-snug whitespace-pre-line text-center md:text-left">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}