import Image from 'next/image'

const printTypes = [
  {
    id: 1,
    title: '시럽',
    desc: '시럽은 투명한 느낌으로 표현되는 프린트 방식이에요. 특히 흰색 영역은 완전히 투명하게 프린트 돼요.',
    img: '/images/print-type-img-1.png',
  },
  {
    id: 2,
    title: '솔리드',
    desc: '솔리드는 전체 디자인이 불투명하고 선명하게 프린트되는 방식이에요.',
    img: '/images/print-type-img-2.png',
  },
  {
    id: 3,
    title: '스탬프',
    desc: '스탬프는 흰색 영역만 투명하게 표현되고, 나머지 컬러는 불투명하게 프린트돼요.',
    img: '/images/print-type-img-3.png',
  },
]

export default function PrintTypeContent() {
  return (
    <ul className="grid grid-cols-1 gap-14 md:gap-8">
      {printTypes.map((type) => (
        <li key={type.id} className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div className="relative w-full h-full max-w-96 min-h-96 md:flex-1 rounded-2xl overflow-hidden">
            <Image src={type.img} alt={type.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-2 md:flex-1 md:gap-3">
            <p className="text-base font-semibold text-foreground md:text-xl">{type.title}</p>
            <p className="text-sm text-grayscale-700 leading-snug md:text-base">{type.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}