import Image from 'next/image'

const nailTipTypes = [
  { name: '라운드 숏',     img: '/images/nailTip-type-img-1.png' },
  { name: '오발 미디움',   img: '/images/nailTip-type-img-2.png' },
  { name: '아몬드 숏',     img: '/images/nailTip-type-img-3.png' },
  { name: '아몬드 미디움', img: '/images/nailTip-type-img-4.png' },
  { name: '아몬드 롱',     img: '/images/nailTip-type-img-5.png' },
  { name: '스퀘어 미디움', img: '/images/nailTip-type-img-6.png' },
  { name: '스퀘어 롱',     img: '/images/nailTip-type-img-7.png' },
  { name: '코핀 미디움',   img: '/images/nailTip-type-img-8.png' },
  { name: '코핀 롱',       img: '/images/nailTip-type-img-9.png' },
  { name: '스틸레토 롱',   img: '/images/nailTip-type-img-10.png' },
]

export default function NailTipTypeContent() {
  return (
    <ul className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-x-8 md:gap-y-14">
      {nailTipTypes.map((type) => (
        <li key={type.name} className="flex flex-col items-center gap-4">
          <div className="relative w-full h-full min-w-40 min-h-80 md:min-h-[30rem] overflow-hidden">
            <Image src={type.img} alt={type.name} fill className="object-cover" />
          </div>
          <p className="text-sm text-center text-foreground font-medium leading-snug md:text-base">{type.name}</p>
        </li>
      ))}
    </ul>
  )
}