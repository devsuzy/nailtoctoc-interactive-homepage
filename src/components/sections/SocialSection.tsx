'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import IcoNaverBlog from '@/assets/icons/ico-naver-blog.svg'
import IcoInstagram from '@/assets/icons/ico-instagram.svg'
import IcoArrow from '@/assets/icons/ico-arrow.svg'

interface ListItem {
  id: number
  title: string
  source: string
  createdAt: string
  thumbnail: string
  url: string
}

const PC_PER_PAGE = 6
const MO_PER_PAGE = 4

export default function SocialSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [items, setItems] = useState<ListItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useHeaderSection(sectionRef, 'white')

  useEffect(() => {
    fetch('/data/list.json')
      .then((res) => res.json())
      .then((data: ListItem[]) =>
        setItems([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
      )
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      setCurrentPage(1)
    }
    setIsMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const perPage = isMobile ? MO_PER_PAGE : PC_PER_PAGE
  const totalPages = Math.ceil(items.length / perPage)
  const pagedItems = items.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <section ref={sectionRef} className="bg-white py-20 px-5 max-w-[68.75rem] mx-auto md:px-0 md:py-[7.5rem]">
      <div className="max-w-screen-xl mx-auto">
        {/* 섹션 타이틀 */}
        <div className="flex flex-col justify-between gap-5 mb-5 md:mb-8 md:flex-row">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
            네일톡톡의 이야기를, <br />
            더 들여다 보고 싶다면?
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href="https://blog.naver.com/nailtoctoc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-grayscale-100 px-3 py-2 md:py-3 text-xs font-medium text-foreground hover:bg-grayscale-200 transition-colors md:text-sm md:gap-3"
            >
              <IcoNaverBlog />
              <span className="flex gap-0.5">네이버 블로그 <IcoArrow /></span>
            </Link>
            <Link
              href="https://www.instagram.com/nailtoctoc_official"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-grayscale-100 px-3 py-2 md:py-3 text-xs font-medium text-foreground hover:bg-grayscale-200 transition-colors md:text-sm md:gap-3"
            >
              <IcoInstagram />
              <span className="flex gap-0.5">인스타그램 <IcoArrow /></span>
            </Link>
          </div>
        </div>

        {/* 리스트 그리드 */}
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
          {pagedItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-row gap-5"
              >
                {/* 썸네일 */}
                <div className="min-w-[6.875rem] md:min-w-[12.5rem] min-h-[6.875rem] md:min-h-[12.5rem] relative rounded-xl overflow-hidden">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* 텍스트 */}
                <div className="flex flex-col justify-center gap-3 flex-1">
                  <p className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline md:text-xl">
                    {item.title}
                  </p>
                  <div className="flex gap-3 text-xs text-grayscale-700 md:text-sm">
                    <p>{item.source}</p>
                    <span className="w-px h-3 bg-foreground/30"></span>
                    <p>{item.createdAt}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-grayscale-200 text-grayscale-400 disabled:opacity-30 hover:border-foreground hover:text-foreground transition-colors cursor-pointer disabled:cursor-default"
              aria-label="이전 페이지"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M6 1L1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  page === currentPage
                    ? 'bg-grayscale-100 text-foreground'
                    : 'text-grayscale-400 hover:text-grayscale-100'
                }`}
                aria-label={`${page}페이지`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-grayscale-200 text-grayscale-400 disabled:opacity-30 hover:border-foreground hover:text-foreground transition-colors cursor-pointer disabled:cursor-default"
              aria-label="다음 페이지"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}