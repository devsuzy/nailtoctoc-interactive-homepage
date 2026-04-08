import type { Metadata } from 'next'
import './globals.css'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import { HeaderProvider } from '@/contexts/HeaderContext'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: '네일톡톡 홈페이지',
  description: '인터랙티브 반응형 웹으로 제작한 네일톡톡 홈페이지 리뉴얼',
  icons: {
    icon: '/favicon.ico',
  },
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
