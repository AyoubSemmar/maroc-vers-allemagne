'use client'

import { useState } from 'react'
import { useCatLabel } from '@/lib/article-cat'

type Article = {
  id: string
  title: string
  summary: string
  category: string
  date: string
  image_url: string | null
}

// Each card is 18vw wide, 1.5vw margin each side → 21vw per step
// To center card i: translateX = 41vw - i * 21vw
const CARD_VW = 18
const GAP_VW = 3
const STEP_VW = CARD_VW + GAP_VW
const OFFSET_VW = 50 - CARD_VW / 2

export default function FeaturedCarousel({ articles }: { articles: Article[] }) {
  const [current, setCurrent] = useState(Math.floor(articles.length / 2))
  const catLabel = useCatLabel()

  if (!articles || articles.length === 0) return null

  const prev = () => setCurrent((c) => Math.max(0, c - 1))
  const next = () => setCurrent((c) => Math.min(articles.length - 1, c + 1))

  return (
    <div className="py-10 bg-white border-b border-gray-100">

      {/* Title */}
      <div className="max-w-5xl mx-auto px-4 mb-6" dir="rtl">
        <h2 className="text-xl font-semibold text-gray-800">⭐ مقالات مميزة</h2>
      </div>

      {/* Track — full width, no overflow clip on sides so cards peek */}
      <div className="overflow-hidden" dir="ltr">
        <div
          className="flex items-center transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(calc(${OFFSET_VW}vw - ${current * STEP_VW}vw))` }}
        >
          {articles.map((article, i) => {
            const dist = Math.abs(i - current)
            const isCenter = dist === 0
            const isNear = dist === 1
            // scale and opacity based on distance from center
            const scale = isCenter ? 1.08 : isNear ? 0.97 : 0.88
            const opacity = isCenter ? 1 : isNear ? 0.7 : 0.4

            return (
              <a
                key={article.id}
                href={`/articles/${article.id}`}
                className="flex-shrink-0 rounded-2xl overflow-hidden relative block transition-all duration-500"
                style={{
                  width: `${CARD_VW}vw`,
                  marginLeft: `${GAP_VW / 2}vw`,
                  marginRight: `${GAP_VW / 2}vw`,
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: 10 - dist,
                  boxShadow: isCenter ? '0 20px 40px rgba(0,0,0,0.25)' : 'none',
                }}
              >
                {/* Image */}
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full object-cover"
                    style={{ height: isCenter ? '220px' : '180px', transition: 'height 0.5s ease' }}
                  />
                ) : (
                  <div className="w-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl"
                    style={{ height: isCenter ? '220px' : '180px' }}>
                    📰
                  </div>
                )}

                {/* Gradient + text overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3" dir="rtl">
                  <span className="text-xs text-white/90 bg-white/20 px-2 py-0.5 rounded-full">
                    {catLabel(article.category)}
                  </span>
                  <h3 className="text-white font-bold leading-snug mt-1 text-sm line-clamp-2">
                    {article.title}
                  </h3>
                  {isCenter && (
                    <p className="text-white/60 text-xs mt-1">{article.date}</p>
                  )}
                </div>

                {/* Active ring */}
                {isCenter && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-green-400 pointer-events-none" />
                )}
              </a>
            )
          })}
        </div>
      </div>

      {/* Dots + arrows */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={prev}
          disabled={current === 0}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          ‹
        </button>

        {articles.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? '16px' : '8px',
              height: i === current ? '16px' : '8px',
              backgroundColor: i === current ? '#15803d' : '#d1d5db',
            }}
          />
        ))}

        <button
          onClick={next}
          disabled={current === articles.length - 1}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  )
}
