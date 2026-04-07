# 💅 Nailtoctoc Interactive Homepage

사이드 프로젝트로 만든 인터랙티브 반응형 웹으로 만든 네일톡톡 홈페이지 입니다.
애니메이션 라이브러리인 Lenis와 GSAP을 함께 연동하여 스크롤에 따라 부드럽게 모션이 전환되면서
자연스러운 플로우 경험을 강조한 랜딩 페이지 입니다. 

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Static Export) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 스크롤 모션 | GSAP + ScrollTrigger |
| 스무스 스크롤 | Lenis |
| 컴포넌트 모션 | Framer Motion |
| 슬라이더 | Swiper |

---

## 프로젝트 구조
```aiignore
nailtoctoc-homepage-sample/
├── public/
│   ├── data/
│   │   ├── home.json       # 메인 페이지 콘텐츠 mock 데이터
│   │   ├── products.json   # 서비스 목록 mock 데이터
│   │   └── reviews.json    # 고객 후기 mock 데이터
│   └── images/             # 이미지 리소스
├── src/
│   ├── assets/             # svg 아이콘 리소스
│   ├── app/
│   │   ├── globals.css     # 전역 스타일 (Tailwind + Lenis CSS)
│   │   ├── layout.tsx      # 루트 레이아웃 (SmoothScrollProvider 적용)
│   │   └── page.tsx        # 메인 페이지
│   ├── components/
│   │   ├── SmoothScrollProvider.tsx  # Lenis 전역 스무스 스크롤 래퍼
│   │   └── sections/
│   ├── hooks/
│   │   └── useLenis.ts     # Lenis + GSAP 동기화 훅
│   ├── lib/
│   │   ├── gsap.ts         # GSAP ScrollTrigger 플러그인 등록
│   │   └── lenis.ts        # Lenis 인스턴스 초기화 및 관리
│   └── types/
│       └── swiper.d.ts     # Swiper CSS 타입 선언
├── next.config.ts          # Next.js 설정 (static export)
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

--

## 주요 구현 내용

- 페이지 진입 시 인트로 애니메이션 자동 재생 및 슬라이드 퇴장 전환
- 자동 슬라이드 (루프, 타이머 기반)
- 스크롤 위치에 따른 헤더 유형 자동 전환 (투명 / 화이트)
- 부드로운 스크롤 경험 (Lenis + GSAP 동기화)
- 반응형 레이아웃 (모바일 / 태블릿 / 데스크탑)

---

## 실행 방법

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 정적 빌드 → /out
```