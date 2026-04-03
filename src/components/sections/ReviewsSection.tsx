'use client'

import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { gsap } from '@/lib/gsap'
import 'swiper/css'
import 'swiper/css/pagination'

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // mock JSON 데이터 로드
    fetch('/data/reviews.json')
      .then((r) => r.json())
      .then((data) => setReviews(data))
      .catch(() => {
        // fallback 데이터
        setReviews([
          { id: 1, name: '김지은', rating: 5, comment: '정말 꼼꼼하게 해주셔서 너무 만족해요!', date: '2024.03' },
          { id: 2, name: '박수진', rating: 5, comment: '디자인도 예쁘고 유지력도 완벽해요.', date: '2024.03' },
          { id: 3, name: '이민지', rating: 5, comment: '매번 올 때마다 결과물이 기대 이상이에요!', date: '2024.02' },
          { id: 4, name: '최예린', rating: 5, comment: '아티스트분이 친절하고 실력도 최고!', date: '2024.02' },
        ])
      })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-neutral-950 py-32 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-center text-sm font-medium tracking-[0.3em] text-neutral-400 uppercase">
          Reviews
        </h2>
        <p className="mb-16 text-center text-4xl font-bold">
          고객 후기
        </p>

        {reviews.length > 0 && (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                  <div className="mb-4 flex text-yellow-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mb-6 text-neutral-300 leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{review.name}</span>
                    <span className="text-sm text-neutral-500">{review.date}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}
