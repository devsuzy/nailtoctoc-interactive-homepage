'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type HeaderType = 'transparent' | 'white'

interface HeaderContextValue {
  type: HeaderType
  visible: boolean
  setType: (type: HeaderType) => void
  setVisible: (visible: boolean) => void
}

const HeaderContext = createContext<HeaderContextValue | null>(null)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<HeaderType>('transparent')
  const [visible, setVisible] = useState(false)

  return (
    <HeaderContext.Provider value={{ type, visible, setType, setVisible }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const ctx = useContext(HeaderContext)
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider')
  return ctx
}