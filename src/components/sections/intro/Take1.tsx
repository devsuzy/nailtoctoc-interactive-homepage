'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

const lines = ['쉽고, 빠르게', '5분만에 완성되는', '네일아트 프린트']

// 마지막 문장 등장 완료: 0.35 * 2 + 0.75 = 1.45s → 1초 대기 → 2.45s에 퇴장

interface Take1Props {
  onComplete: () => void
}

export default function Take1({ onComplete }: Take1Props) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2450)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.section
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      exit={{ y: '-100%', transition: { duration: 1.0, ease: [0.76, 0, 0.36, 1] } }}
    >
      <div className="flex flex-col items-center gap-4 md:gap-6 xl:gap-8">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.75,
                delay: i * 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
            className="text-center text-[2rem] font-bold text-primary md:text-6xl xl:text-7xl"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.section>
  )
}
