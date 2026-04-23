'use client'

import { useState } from 'react'

interface AudioButtonProps {
  text: string
  lang?: string
  size?: 'sm' | 'md'
  className?: string
}

export default function AudioButton({ text, lang = 'de-DE', size = 'md', className = '' }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false)

  function speak() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.82
    utterance.pitch = 1
    utterance.onstart = () => setPlaying(true)
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utterance)
  }

  const sizeClass = size === 'sm'
    ? 'w-7 h-7 text-xs'
    : 'w-9 h-9 text-sm'

  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak() }}
      title="استمع للنطق"
      className={`${sizeClass} rounded-full flex items-center justify-center transition-all shrink-0
        ${playing
          ? 'bg-green-600 text-white scale-110 shadow-lg shadow-green-200'
          : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
        } ${className}`}
    >
      {playing ? (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  )
}
