import type { Metadata } from 'next'
import './globals.css'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import { HeaderProvider } from '@/contexts/HeaderContext'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'Nailtoctoc',
  description: 'Nailtoctoc Homepage',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <HeaderProvider>
          <Header />
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </HeaderProvider>
      </body>
    </html>
  )
}
