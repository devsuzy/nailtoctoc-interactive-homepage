'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useHeaderSection } from "@/hooks/useHeaderSection";

interface Feature {
  id: number
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    id: 1,
    title: '전문가 네일 아티스트',
    description: '숙련된 네일 아티스트가 섬세하게 작업합니다.',
    icon: '✦',
  },
  {
    id: 2,
    title: '프리미엄 재료',
    description: '피부에 안전하고 오래 지속되는 재료만 사용합니다.',
    icon: '◈',
  },
  {
    id: 3,
    title: '간편한 예약',
    description: '앱에서 쉽고 빠르게 원하는 시간에 예약하세요.',
    icon: '◎',
  },
]

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'white')
  const cardsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-white relative h-screen overflow-hidden py-32 m-auto"
    >
      <div className="m-auto max-w-6xl px-6">
        <h2 className="mb-4 text-center text-sm font-medium tracking-[0.3em] text-neutral-400 uppercase">
          Features
        </h2>
        <p className="mb-20 text-center text-4xl font-bold text-neutral-900">
          왜 Nailtoctoc인가요?
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.id}
              ref={(el) => {
                if (el) cardsRef.current[i] = el
              }}
              className="group rounded-2xl border border-neutral-100 bg-neutral-50 p-8 transition-all duration-300 hover:border-neutral-200 hover:bg-white hover:shadow-lg"
            >
              <span className="mb-6 block text-3xl">{feature.icon}</span>
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">
                {feature.title}
              </h3>
              <p className="text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
