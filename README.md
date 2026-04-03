# Nailtoctoc Interactive Homepage

스크롤 모션 중심의 인터랙티브 반응형 웹 홈페이지 샘플 프로젝트입니다.

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

```
nailtoctoc-homepage-sample/
├── public/
│   ├── data/
│   │   ├── home.json       # 메인 페이지 콘텐츠 mock 데이터
│   │   ├── products.json   # 서비스 목록 mock 데이터
│   │   └── reviews.json    # 고객 후기 mock 데이터
│   └── images/             # 이미지 리소스
├── src/
│   ├── app/
│   │   ├── globals.css     # 전역 스타일 (Tailwind + Lenis CSS)
│   │   ├── layout.tsx      # 루트 레이아웃 (SmoothScrollProvider 적용)
│   │   └── page.tsx        # 메인 페이지
│   ├── components/
│   │   ├── SmoothScrollProvider.tsx  # Lenis 전역 스무스 스크롤 래퍼
│   │   └── sections/
│   │       ├── HeroSection.tsx       # 히어로 섹션 (패럴랙스 + Framer Motion)
│   │       ├── FeaturesSection.tsx   # 특징 섹션 (GSAP ScrollTrigger 카드 등장)
│   │       └── ReviewsSection.tsx    # 후기 섹션 (Swiper 자동재생 슬라이더)
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

---

## 주요 구현 내용

### 스무스 스크롤 (Lenis)
- `src/lib/lenis.ts`에서 Lenis 인스턴스를 초기화하고 GSAP ticker와 동기화
- `SmoothScrollProvider`로 전체 앱에 전역 적용

### 스크롤 애니메이션 (GSAP + ScrollTrigger)
- **HeroSection**: 스크롤 시 텍스트 패럴랙스 효과 (`scrub: true`)
- **FeaturesSection**: 카드가 뷰포트에 진입할 때 순차적으로 등장 (`stagger`)

### 컴포넌트 모션 (Framer Motion)
- **HeroSection**: 페이지 로드 시 타이틀·서브텍스트 순차 페이드인
- 스크롤 인디케이터 바운스 애니메이션

### 슬라이더 (Swiper)
- **ReviewsSection**: 자동재생 슬라이더, 반응형 breakpoints 적용
- `public/data/reviews.json`에서 데이터 fetch

### Mock 데이터
서버 통신 없이 `public/data/` 경로의 JSON 파일을 fetch하여 사용:
```ts
const data = await fetch('/data/reviews.json').then(r => r.json())
```

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드 (정적 HTML → /out 폴더)
npm run build
```

---

## 빌드 방식

`next.config.ts`에 `output: 'export'` 설정으로 순수 정적 HTML/CSS/JS로 빌드됩니다.
서버 없이 CDN이나 정적 호스팅(Vercel, S3, GitHub Pages 등)에 바로 배포 가능합니다.
