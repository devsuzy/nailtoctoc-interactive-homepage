'use client'

import { useRef, useState } from 'react'
import { useHeaderSection } from '@/hooks/useHeaderSection'
import IcoChevronDown from '@/assets/icons/ico-chevron-down.svg'
import IcoCheckbox from '@/assets/icons/ico-checkbox.svg'

export default function InquirySection() {
  const sectionRef = useRef<HTMLElement>(null)
  useHeaderSection(sectionRef, 'white')

  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = () => {
    if (!privacyChecked) {
      alert('개인정보 수집 및 이용에 동의해 주세요.')
      return
    }
    alert('상담 문의를 성공적으로 제출했습니다!')
    setForm({
      name: '',
      phone: '',
      email: '',
      message: '',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-[linear-gradient(180deg,_#FFEFF3_0%,_#FFA1B8_180.66%,_#FFD5DF_208.8%)]"
    >
      <div className="max-w-[405px] mx-auto pt-[97px] px-5 pb-20 md:px-0 md:pt-[270px] md:pb-[200px]">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground text-center tracking-tight leading-[1.4] whitespace-pre-line md:text-[1.75rem] md:whitespace-normal">
            {'문의 주시면 빠르게\n 안내 도와드릴게요'}
          </h1>
          <p className="mt-2 text-sm text-center text-black/50 md:text-base">
            <span className="text-primary">5분안에</span> 이메일로 먼저 안내 드릴 예정이예요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="flex flex-col gap-2">

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {/* 이름 */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="이름"
              className="w-full p-4 rounded-lg bg-white text-sm text-foreground placeholder:text-grayscale-400 outline-none focus:ring-2 focus:ring-primary/40 transition"
            />

            {/* 휴대폰 */}
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="휴대번호"
              className="w-full p-4 rounded-lg bg-white text-sm text-foreground placeholder:text-grayscale-400 outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* 이메일 */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="이메일"
            className="w-full p-4 rounded-lg bg-white text-sm text-foreground placeholder:text-grayscale-400 outline-none focus:ring-2 focus:ring-primary/40 transition"
          />

          {/* 문의내용 */}
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="문의 내용 (문의 내용을 토대로 개인화된 상담을 진행해 드릴예정이예요)"
            rows={10}
            className="w-full p-4 rounded-lg bg-white text-sm text-foreground placeholder:text-grayscale-400 outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
          />

          {/* 개인정보 동의 - 아코디언 */}
          <div className="rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 pt-1 pb-2 md:pt-2">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyChecked}
                onChange={e => setPrivacyChecked(e.target.checked)}
                className="sr-only"
              />
              <label htmlFor="privacy" className={`flex-shrink-0 cursor-pointer transition-colors ${privacyChecked ? 'text-primary' : 'text-[#A58A91]'}`}>
                <IcoCheckbox />
              </label>
              <label htmlFor="privacy" className="flex-1 text-sm text-foreground cursor-pointer">
                <b className="font-semibold">[필수] </b>필수 항목 모두 동의
              </label>
              <button
                type="button"
                onClick={() => setPrivacyOpen(prev => !prev)}
                className="flex-shrink-0 cursor-pointer"
                aria-label="개인정보 동의 내용 펼치기"
              >
                {<IcoChevronDown className={privacyOpen ? 'rotate-180' : ''} />}
              </button>
            </div>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${privacyOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 bg-white/70 p-3 ml-6 rounded-xl tracking-tight text-sm text-foreground/70">
                  <p><b className="font-medium text-foreground">목적: </b>비즈니스 문의에 따른 이메일 소통 및 유선 상담</p>
                  <p><b className="font-medium text-foreground">항목: </b>업체명, 이름, 연락처, 이메일</p>
                  <p><b className="font-medium text-foreground">기간: </b>목적 달성 후 1년 보관</p>
                </div>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className={`mt-6 w-full py-4 rounded-xl text-base font-semibold transition hover:opacity-90 active:scale-[0.98] cursor-pointer 
            ${privacyChecked ? 'bg-primary text-white' : 'bg-[#E7B0BD] text-[#A78089]'}`}
          >
            동의하고 문의하기
          </button>

        </form>
      </div>
    </section>
  )
}