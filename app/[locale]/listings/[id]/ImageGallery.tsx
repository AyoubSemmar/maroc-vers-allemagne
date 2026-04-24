'use client'

import { useState } from 'react'

export default function ImageGallery({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full h-72 rounded-xl overflow-hidden bg-gray-100">
        <img src={images[current]} alt="" className="w-full h-full object-cover" />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-white"
            >›</button>
            <button
              onClick={() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-gray-800 hover:bg-white"
            >‹</button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`flex-1 h-16 rounded-lg overflow-hidden border-2 ${current === i ? 'border-green-600' : 'border-transparent'}`}>
              <img src={src} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
