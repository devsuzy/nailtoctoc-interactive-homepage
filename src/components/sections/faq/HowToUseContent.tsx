import Image from 'next/image'

const steps = [
  {
    id: 1,
    title: '네일톡톡 앱을 설치해 주세요',
    desc: '서비스 이용을 위해 앱 설치가 필요해요. 아이폰은 앱스토어, 안드로이드는 구글 플레이에서 설치할 수 있어요.',
    img: '/images/how-to-use-img-1.png',
  },
  {
    id: 2,
    title: '앱을 열고 간편하게 회원가입을 진행해 주세요',
    desc: '네이버, 카카오 등 간편 로그인을 이용하면 빠르게 가입할 수 있어요.',
    img: '/images/how-to-use-img-2.png',
  },
  {
    id: 3,
    title: '원하는 네일 상품을 선택해 구매해 주세요',
    desc: '구매한 상품의 QR코드로 키오스크를 이용할 수 있어요.',
    img: '/images/how-to-use-img-3.png',
  },
  {
    id: 4,
    title: '구매한 상품 QR코드를 키오스크에 스캔하고 서비스를 이용해 주세요',
    desc: '구매한 상품 QR코드는 앱 내 정보 → 결제내역에서 확인할 수 있어요.',
    img: '/images/how-to-use-img-4.png',
  },
]

export default function HowToUseContent() {
  return (
    <ul className="flex flex-col gap-14 md:gap-8">
      {steps.map((step) => (
        <li key={step.id} className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div className="relative w-full aspect-square shrink-0 rounded-2xl overflow-hidden md:w-48 md:h-48">
            <Image src={step.img} alt={step.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <span className="text-sm font-semibold text-primary tracking-normal md:text-base">0{step.id}</span>
            <p className="text-base font-semibold text-foreground leading-snug md:text-xl">{step.title}</p>
            <p className="text-sm text-grayscale-700">{step.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}