'use client'

import { useState } from 'react'

export default function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={images[current]}
          alt={`Listing photo ${current + 1} of ${images.length}`}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1))}
              aria-label="Previous photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center text-gray-800 text-lg hover:bg-white"
            >›</button>
            <button
              type="button"
              onClick={() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1))}
              aria-label="Next photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-10 h-10 flex items-center justify-center text-gray-800 text-lg hover:bg-white"
            >‹</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={current === i}
              className={`flex-1 h-16 rounded-lg overflow-hidden border-2 ${current === i ? 'border-green-600' : 'border-transparent'}`}
            >
              <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
