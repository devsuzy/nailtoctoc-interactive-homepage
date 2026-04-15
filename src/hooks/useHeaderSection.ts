'use client'

import { useEffect, RefObject } from 'react'
import { useHeader } from '@/contexts/HeaderContext'
import type { HeaderType } from '@/contexts/HeaderContext'

export function useHeaderSection(ref: RefObject<HTMLElement | null>, type: HeaderType) {
  const { setType, setVisible } = useHeader()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setType(type)
          setVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, type, setType, setVisible])
}