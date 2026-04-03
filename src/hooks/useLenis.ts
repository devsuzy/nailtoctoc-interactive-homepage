'use client'

import { useEffect } from 'react'
import { registerGsapPlugins } from '@/lib/gsap'
import { initLenis, destroyLenis } from '@/lib/lenis'

export function useLenis() {
  useEffect(() => {
    registerGsapPlugins()
    const lenis = initLenis()

    return () => {
      destroyLenis()
    }
  }, [])
}
