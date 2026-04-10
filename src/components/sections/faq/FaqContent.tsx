'use client'

import { useState } from 'react'
import IcoPlus from '@/assets/icons/ico-plus.svg'
import IcoMinus from '@/assets/icons/ico-minus.svg'

const items = [
  {
    q: '네일톡톡 가맹점은 어떤 브랜드인가요?',
    a: '네일톡톡은 합리적인 가격과 빠른 시술, 그리고 위생과 디자인 퀄리티를 모두 잡는 네일 전문 브랜드에요. \n 트렌디한 포인트 디자인에 집중해, 회전율과 만족도를 동시에 높이는 운영 방식을 지향해요.'
  },
  {
    q: '오픈 후에는 어떤 운영 지원을 받게 되나요?',
    a: '• 전담 매니저를 통한 정기/수시 컨설팅\n • 시즌·이벤트별 신규 디자인 및 메뉴 제안\n • 마케팅 소재(사진, 영상, 문구 등) 제공\n • 운영 관련 매뉴얼 및 공지사항 수시 업데이트'
  },
  {
    q: '기계만으로 전문적인 네일 아트 퀄리티 보장이 가능한가요?',
    a: '네일톡톡은 AI 손톱 인식, 정밀 측정·위치 제어 기술과 UV 잉크로 구성된 자동화 시스템을 통해 누가 사용하더라도 전문가 수준의 일정한 퀄리티를 구현할 수 있어요. 기계가 디자인 위치·색감·마감을 표준화해 출력하기 때문에 숙련도와 관계없이 안정적인 결과물을 제공해요.'
  },
  {
    q: '운영을 하게 될 경우 기계의 소모품과 부품을 쉽게 교체할 수 있나요?',
    a: '네일아트 스튜디오는 소모품과 핵심 부품을 누구나 쉽게 교체할 수 있도록 모듈화된 구조로 설계돼 있어요. \n UV 잉크·네일팁 등 단순 분리 방식으로 바로 교체할 수 있어요.'
  },
  {
    q: '설치 후 바로 운영이 가능한가요?',
    a: '네일톡톡은 기본 세팅이 완료된 상태로 설치되기 때문에 전원 연결 후 바로 운영이 가능한 즉시 구동형 시스템이에요.\n 손톱 인식, 프린팅, 경화까지 모든 공정이 자동화되어 있어 별도의 기술 교육 없이도 빠르게 운영을 시작할 수 있어요.'
  },
]

export default function FaqContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <ul className="flex flex-col">
      {items.map((item, i) => (
        <li key={i} className="border-b border-foreground/10">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
          >
            <span className="text-sm font-semibold text-foreground md:text-lg">{item.q}</span>
            {openIndex === i ? <IcoMinus /> : <IcoPlus />}
          </button>
          <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <p className="p-5 mb-5 bg-grayscale-100 rounded-lg text-sm text-grayscale-700 leading-snug tracking-tight md:text-lg whitespace-pre-line">
                {item.a}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}