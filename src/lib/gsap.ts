import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 모듈 로드 시점에 즉시 등록 (useEffect 실행 순서와 무관하게 보장)
gsap.registerPlugin(ScrollTrigger)

export function registerGsapPlugins(): void {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }