'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import IntroTake1 from './intro/IntroTake1'
import IntroTake2 from './intro/IntroTake2'
import { useHeader } from '@/contexts/HeaderContext'

export default function IntroSection() {
  const [showTake1, setShowTake1] = useState(true)
  const [take2Started, setTake2Started] = useState(false)
  const { setVisible } = useHeader()

  const handleTake1Complete = useCallback(() => {
    setShowTake1(false)
    setVisible(true)
    setTimeout(() => setTake2Started(true), 0)
  }, [setVisible])

  return (
    <>
      <AnimatePresence>
        {showTake1 && <IntroTake1 onComplete={handleTake1Complete} />}
      </AnimatePresence>
      <IntroTake2 started={take2Started} />
    </>
  )
}
