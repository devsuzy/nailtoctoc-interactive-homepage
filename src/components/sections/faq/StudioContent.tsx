'use client'

import Image from 'next/image'
import { useState } from 'react'

const studios = [
  { name: "검정색", bgColor: 'foreground', img: '/images/studio-img-1.png' },
  { name: "흰색", bgColor: 'white', img: '/images/studio-img-2.png' },
]

export default function StudioContent() {
  const [activeTab, setActiveTab] = useState(0)
  const studio = studios[activeTab]

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <ul className="flex gap-3 justify-center">
        {studios.map((s, i) => (
          <li key={s.name}>
            <button
              onClick={() => setActiveTab(i)}
              className={`flex gap-2 items-center justify-center p-3 text-base font-medium transition-colors cursor-pointer border-b-[3px] ${
                activeTab === i
                  ? 'border-primary'
                  : 'border-transparent'
              }`}
            >
              <span className={`block w-5 h-5 rounded-full bg-${s.bgColor} border border-grayscale-200`}></span>
              {s.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="relative w-full min-h-[34rem] md:min-h-[60rem] rounded-2xl overflow-hidden">
        <Image src={studio.img} alt={`${studio.name} 스튜디오`} fill className="object-contain" />
      </div>
    </div>
  )
}