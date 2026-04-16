'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useHeaderSection } from '@/hooks/useHeaderSection'

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

// 4개 스텝 × 각 1s = 총 4s 타임라인
// ScrollTrigger end: '+=400%' → 각 스텝당 100vh 스크롤
const INTRO_END = 1.0  // 이미지 진입 완료
const FEAT_1    = 2.0  // 피처 1 표시
const FEAT_2    = 3.0  // 피처 2 표시
const TOTAL     = 4.0  // 피처 3 표시 (end)

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'white')

  const imgRefs     = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null))
  const textRef     = useRef<HTMLDivElement>(null)
  const take2Ref    = useRef<HTMLDivElement>(null)
  const featureRefs = useRef<(HTMLDivElement | null)[]>(Array(3).fill(null))

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 초기 상태
      imageConfigs.forEach((config, i) => {
        gsap.set(imgRefs.current[i], { x: config.initX, y: config.initY })
      })
      gsap.set(take2Ref.current,      { autoAlpha: 0 })
      gsap.set(featureRefs.current[0], { autoAlpha: 1 })
      gsap.set(featureRefs.current[1], { autoAlpha: 0 })
      gsap.set(featureRefs.current[2], { autoAlpha: 0 })
      gsap.set(textRef.current,        { opacity: 1 })

      const tl = gsap.timeline()

      // Step 0→1 (0 ~ INTRO_END): 이미지 사방에서 진입
      imageConfigs.forEach((_, i) => {
        tl.to(imgRefs.current[i], { x: 0, y: 0, duration: 0.6, ease: 'power3.out' }, 0.04 + i * 0.05)
      })

      // Step 1→2 (INTRO_END ~ FEAT_1): 이미지 퇴장 + 피처 1 등장
      imageConfigs.forEach((config, i) => {
        tl.to(imgRefs.current[i], { x: config.initX, y: config.initY, duration: 0.4, ease: 'power2.in' }, INTRO_END + i * 0.04)
      })
      tl.to(textRef.current,  { opacity: 0, duration: 0.3, ease: 'power2.in' },  INTRO_END)
      tl.to(take2Ref.current, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, INTRO_END + 0.5)

      // Step 2→3 (FEAT_1 ~ FEAT_2): 피처 1 → 2
      tl.to(featureRefs.current[0], { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, FEAT_1 + 0.2)
      tl.to(featureRefs.current[1], { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, FEAT_1 + 0.2)

      // Step 3→4 (FEAT_2 ~ TOTAL): 피처 2 → 3
      tl.to(featureRefs.current[1], { autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' }, FEAT_2 + 0.2)
      tl.to(featureRefs.current[2], { autoAlpha: 1, duration: 0.2, ease: 'power2.inOut' }, FEAT_2 + 0.2)

      // 타임라인을 TOTAL까지 늘려 균등 간격 보장
      tl.set({}, {}, TOTAL)

      // ScrollTrigger: 실제 스크롤이 타임라인을 구동
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',   // 4단계 × 100vh
        pin: true,
        scrub: 1.5,
        animation: tl,
        snap: {
          snapTo: [0, INTRO_END / TOTAL, FEAT_1 / TOTAL, FEAT_2 / TOTAL, 1],
          duration: { min: 0.1, max: 0.6 },
          delay: 0,
          ease: 'power2.inOut',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
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