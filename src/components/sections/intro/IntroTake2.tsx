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

const scrollSteps = [
  { id: 1, text: null },
  { id: 2, text: '스크롤을 아래로 내려주세요' },
  { id: 3, text: null },
]

interface Take2Props {
  started: boolean
}

export default function IntroTake2({ started }: Take2Props) {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'transparent')

  const [activeFrame, setActiveFrame] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!started) return

    const interval = setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % frames.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [started])

  useEffect(() => {
    if (!started) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % scrollSteps.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [started])

  const isTextStep = activeStep === 1
  const isClosingStep = activeStep === 2

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
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

          <div className="absolute inset-0 bg-foreground/30" />

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-center text-[2rem] font-bold text-white drop-shadow-lg md:text-6xl xl:text-7xl">
              {frame.text}
            </p>
          </div>
        </div>
      ))}

      <div className="absolute bottom-14 left-0 right-0 flex justify-center md:bottom-16 xl:bottom-20">
        <motion.div
          className="relative flex h-12 items-center justify-center overflow-hidden bg-white/70"
          animate={{
            width: isTextStep ? 282 : 48,
            borderRadius: isTextStep ? 24 : 999,
          }}
          transition={{
            width: {
              duration: 0.55,
              ease: [0.4, 0, 0.2, 1],
            },
            borderRadius: {
              duration: 0.2,
              ease: 'easeOut',
            },
          }}
        >
          <motion.span
            className="absolute left-4 whitespace-nowrap text-xl font-semibold"
            animate={{
              opacity: isTextStep ? 1 : 0,
              x: isTextStep ? 0 : 8,
            }}
            transition={{
              opacity: {
                duration: isTextStep ? 0.25 : 0.1,
                delay: isTextStep ? 0.25 : 0,
              },
              x: {
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
          >
            스크롤을 아래로 내려주세요
          </motion.span>

          <motion.div
            className="absolute right-1 flex h-10 w-10 items-center justify-center"
            transition={{
              duration: isClosingStep ? 0.08 : 0.2,
              ease: 'easeInOut',
            }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <IcoScrollDown />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}