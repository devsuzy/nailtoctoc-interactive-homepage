'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import Image from 'next/image'
import IcoScrollDown from '@/assets/icons/ico-scroll-down.svg'

const frames = [
  { text: '수백가지의 네일 아트를', image: '/images/intro-img-1.png' },
  { text: '앱을 통해 결제하고', image: '/images/intro-img-2.png' },
  { text: '5분만에 프린트!', image: '/images/intro-img-3.png' },
]

interface Take2Props {
  started: boolean
}

export default function IntroTake2({ started }: Take2Props) {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'transparent')
  const [activeFrame, setActiveFrame] = useState(0)

  useEffect(() => {
    if (!started) return

    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % frames.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [started])

  return (
    <section ref={sectionRef} data-snap-section className="relative h-screen overflow-hidden">
      {frames.map((frame, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            activeFrame === i ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={frame.image}
            alt={frame.text}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-center text-[2rem] font-bold text-white drop-shadow-lg md:text-6xl xl:text-7xl">
              {frame.text}
            </p>
          </div>
        </div>
      ))}
      <motion.div
        className="absolute bottom-14 md:bottom-16 xl:bottom-20 left-1/2 -translate-x-1/2 w-12 h-12"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <IcoScrollDown />
      </motion.div>
    </section>
  )
}