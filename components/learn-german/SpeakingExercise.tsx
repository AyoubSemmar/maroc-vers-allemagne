'use client'

import { useState, useRef } from 'react'
import AudioButton from './AudioButton'

interface Props {
  target: string
  hint?: string
  onResult?: (success: boolean) => void
}

export default function SpeakingExercise({ target, hint, onResult }: Props) {
  const [state, setState] = useState<'idle' | 'listening' | 'success' | 'retry' | 'unsupported'>('idle')
  const [transcript, setTranscript] = useState('')
  const recogRef = useRef<any>(null)

  function startListening() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setState('unsupported')
      return
    }

    const recog = new SpeechRecognition()
    recogRef.current = recog
    recog.lang = 'de-DE'
    recog.interimResults = false
    recog.maxAlternatives = 3

    recog.onstart = () => setState('listening')

    recog.onresult = (event: any) => {
      const results: string[] = []
      for (let i = 0; i < event.results[0].length; i++) {
        results.push(event.results[0][i].transcript.toLowerCase().trim())
      }
      const tgt = target.toLowerCase().trim()
      const matched = results.some(r => {
        const similarity = r === tgt || r.includes(tgt) || tgt.includes(r) ||
          levenshtein(r, tgt) <= Math.floor(tgt.length * 0.25)
        return similarity
      })
      setTranscript(results[0])
      setState(matched ? 'success' : 'retry')
      onResult?.(matched)
    }

    recog.onerror = () => setState('retry')
    recog.onend = () => {
      if (state === 'listening') setState('retry')
    }

    recog.start()
  }

  function stopListening() {
    recogRef.current?.stop()
  }

  function reset() {
    setTranscript('')
    setState('idle')
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Target sentence */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between gap-3" dir="ltr">
        <p className="font-semibold text-blue-900 text-base">{target}</p>
        <AudioButton text={target} size="md" />
      </div>

      {hint && (
        <p className="text-xs text-gray-400 text-right">💡 {hint}</p>
      )}

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        {state === 'idle' && (
          <button
            onClick={startListening}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            <MicIcon className="w-5 h-5" />
            اضغط وتكلم بالألمانية
          </button>
        )}

        {state === 'listening' && (
          <button
            onClick={stopListening}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-all shadow-md animate-pulse"
          >
            <MicIcon className="w-5 h-5" />
            جاري الاستماع... اضغط للإيقاف
          </button>
        )}

        {state === 'success' && (
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-700 font-semibold">ممتاز! النطق صحيح</p>
            {transcript && <p className="text-xs text-gray-400 mt-1 dir-ltr">{transcript}</p>}
            <button onClick={reset} className="mt-3 text-sm text-blue-600 hover:underline">حاول مجدداً</button>
          </div>
        )}

        {state === 'retry' && (
          <div className="text-center">
            <div className="text-3xl mb-2">🎤</div>
            <p className="text-orange-600 font-medium">حاول مرة أخرى</p>
            {transcript && (
              <p className="text-xs text-gray-500 mt-1">سمعت: <span dir="ltr" className="font-medium">{transcript}</span></p>
            )}
            <button onClick={reset} className="mt-3 flex items-center gap-2 mx-auto bg-orange-500 text-white px-5 py-2 rounded-full text-sm hover:bg-orange-600">
              <MicIcon className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        )}

        {state === 'unsupported' && (
          <p className="text-sm text-gray-500 text-center bg-gray-100 rounded-xl px-4 py-3">
            ⚠️ متصفحك لا يدعم التعرف على الكلام. جرب Chrome أو Edge.
          </p>
        )}
      </div>
    </div>
  )
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
    </svg>
  )
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}
