'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface AudioButtonProps {
  text: string
  lang?: string
  size?: 'sm' | 'md'
  className?: string
}

export default function AudioButton({ text, lang = 'de-DE', size = 'md', className = '' }: AudioButtonProps) {
  const t = useTranslations('learnGerman.audio')
  const [playing, setPlaying] = useState(false)

  // Stop this button's speech when it unmounts (exercise modal closed, page
  // navigated away, etc.) — otherwise SpeechSynthesis keeps reading aloud after
  // the UI is gone. Only cancel if THIS button was the one playing, so an
  // unrelated button unmounting doesn't cut off active audio.
  const playingRef = useRef(false)
  useEffect(() => { playingRef.current = playing }, [playing])
  useEffect(() => () => {
    if (playingRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Lesson strings often mix German and a translation separated by an em-dash
  // (either order, e.g. "Ich bin Ahmed. — I am Ahmed." or
  // "التعريف بالنفس — Sich vorstellen"). Pick only the German half for TTS.
  // Strip markdown emphasis / formatting tokens before sending to TTS.
  // Some lesson strings come from authoring with **bold** or *italic*
  // hints — the SpeechSynthesis engine on iOS/Safari (and a few Android
  // voices) literally pronounces "asterisk", which broke pronunciation
  // for every lesson item that used the highlighter syntax. We also
  // unwrap markdown links like [text](url) → text and code fences `x`.
  function stripMarkdown(s: string): string {
    return s
      .replace(/\*\*([^*]+?)\*\*/g, '$1')
      .replace(/__([^_]+?)__/g, '$1')
      .replace(/(?<!\w)\*([^*\n]+?)\*(?!\w)/g, '$1')
      .replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '$1')
      .replace(/~~([^~]+?)~~/g, '$1')
      .replace(/`([^`\n]+?)`/g, '$1')
      .replace(/\[([^\]]+?)\]\([^)]+?\)/g, '$1')
      .replace(/[*_]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function germanOnly(s: string): string {
    const cleaned = stripMarkdown(s)
    const parts = cleaned.split(/\s+[—–]\s+/)
    if (parts.length < 2) return cleaned
    const score = (p: string) => {
      let n = 0
      if (/[äöüÄÖÜß]/.test(p)) n += 5
      if (/\b(ich|du|er|sie|es|wir|ihr|Sie|der|die|das|den|dem|ein|eine|ist|bin|bist|sind|seid|habe|hast|hat|haben|nicht|und|oder|mit|von|auf|zu|in|aus|für|über|nach|bei|Ich|Du|Er|Sie|Wir|Wie|Was|Wo|Woher|Wann|Warum|Mein|Dein|kommen|heißen|wohnen|sprechen|lernen|sein)\b/.test(p)) n += 3
      if (/[A-Za-zÄÖÜäöüß]/.test(p)) n += 1
      if (/[\u0600-\u06FF]/.test(p)) n -= 5 // Arabic penalty
      return n
    }
    let best = parts[0], bestScore = -Infinity
    for (const p of parts) {
      const sc = score(p)
      if (sc > bestScore) { bestScore = sc; best = p }
    }
    return best.trim()
  }

  function speak() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(germanOnly(text))
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
      title={t('listen')}
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
