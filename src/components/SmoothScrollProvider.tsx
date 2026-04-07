'use client'

import { useLenis } from '@/hooks/useLenis'
import { useScrollSnap } from '@/hooks/useScrollSnap'

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useLenis()
  useScrollSnap()
  return <>{children}</>
}
