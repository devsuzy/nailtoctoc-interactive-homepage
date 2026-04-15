import type { Metadata } from 'next'
import Footer from '@/components/layout/Footer'
import InquirySection from '@/components/sections/inquiry/InquirySection'

export const metadata: Metadata = {
  title: '가맹문의 | 네일톡톡',
  description: '네일톡톡 가맹문의 페이지입니다.',
}

export default function InquiryPage() {
  return (
    <main>
      <InquirySection />
      <Footer />
    </main>
  )
}