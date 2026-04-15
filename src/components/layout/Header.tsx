'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useHeader } from '@/contexts/HeaderContext'
import Link from "next/link";
import IcoLogoWhite from '@/assets/icons/ico-logo-white.svg'
import IcoLogoBlack from '@/assets/icons/ico-logo-black.svg'

export default function Header() {
  const { type, visible } = useHeader()
  const isTransparent = type === 'transparent'

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-5 py-3 transition-colors duration-500 md:px-16 md:py-4 ${
            isTransparent ? 'bg-transparent' : 'bg-white border border-b-px border-grayscale-200'
          }`}
        >
          {/* 로고 */}
          <Link
            href="/"
            className='transition-colors duration-500'
          >
            {isTransparent ? <IcoLogoWhite /> : <IcoLogoBlack />}
          </Link>

          {/* 가맹문의 버튼 */}
          <Link
            href="/inquiry"
            className='rounded-full align-middle px-4 py-2 text-sm font-semibold leading-[120%] md:leading-[100%] transition-colors duration-300 md:py-3 md:text-base bg-primary text-white'
          >
            상담 신청
          </Link>
        </motion.header>
      )}
    </AnimatePresence>
  )
}