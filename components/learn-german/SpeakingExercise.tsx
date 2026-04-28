'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import AudioButton from './AudioButton'

interface Props {
  target: string
  hint?: string
  onResult?: (success: boolean) => void
}

type State =
  | 'idle'
  | 'listening'
  | 'success'
  | 'retry'
  | 'unsupported'
  | 'insecure'        // browser blocks SpeechRecognition outside HTTPS / localhost
  | 'no-mic'          // permission denied or no microphone
  | 'no-speech'       // user stayed silent

export default function SpeakingExercise({ target, hint, onResult }: Props) {
  const t = useTranslations('learnGerman.speaking')
  const [state, setState] = useState<State>('idle')
  const stateRef = useRef<State>('idle')               // ← read inside async callbacks
  const [transcript, setTranscript] = useState('')
  const [errorDetail, setErrorDetail] = useState<string>('')
  const recogRef = useRef<any>(null)

  // Keep stateRef in sync so onend / onerror can read the current value
  // instead of the stale value captured when start() was called.
  useEffect(() => { stateRef.current = state }, [state])

  // Cleanup: stop any in-flight recognition when the component unmounts.
  useEffect(() => {
    return () => {
      try { recogRef.current?.stop() } catch {}
      try { recogRef.current?.abort?.() } catch {}
    }
  }, [])

  function startListening() {
    setErrorDetail('')
    setTranscript('')

    // Browser support check
    const SpeechRecognition =
      (typeof window !== 'undefined') &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

    if (!SpeechRecognition) {
      setState('unsupported')
      return
    }

    // SpeechRecognition only works in a secure context (HTTPS or localhost).
    // window.isSecureContext is the canonical check.
    if (typeof window !== 'undefined' && window.isSecureContext === false) {
      setState('insecure')
      return
    }

    // Stop any previous instance before starting a new one. start() throws
    // InvalidStateError otherwise.
    try { recogRef.current?.abort?.() } catch {}

    const recog = new SpeechRecognition()
    recogRef.current = recog
    recog.lang = 'de-DE'
    recog.interimResults = false
    recog.maxAlternatives = 3
    recog.continuous = false

    recog.onstart = () => setState('listening')

    recog.onresult = (event: any) => {
      const alts: string[] = []
      const resultSet = event.results?.[0]
      if (resultSet) {
        for (let i = 0; i < resultSet.length; i++) {
          alts.push(String(resultSet[i].transcript || '').toLowerCase().trim())
        }
      }
      const tgt = target.toLowerCase().trim()
      const matched = alts.some(r => {
        if (!r) return false
        if (r === tgt || r.includes(tgt) || tgt.includes(r)) return true
        // Allow up to 25% Levenshtein distance for forgiving comparison.
        return levenshtein(r, tgt) <= Math.floor(tgt.length * 0.25)
      })
      setTranscript(alts[0] || '')
      setState(matched ? 'success' : 'retry')
      onResult?.(matched)
    }

    recog.onerror = (e: any) => {
      const code = String(e?.error || '')
      setErrorDetail(code)
      // Map error codes to dedicated states so the UI can give a useful hint.
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        setState('no-mic')
      } else if (code === 'no-speech') {
        setState('no-speech')
      } else if (code === 'audio-capture') {
        setState('no-mic')
      } else {
        setState('retry')
      }
    }

    recog.onend = () => {
      // If we're still in 'listening' here it means recognition ended
      // without firing onresult (silence, no audio captured, etc.).
      // Read the LATEST state via ref — closure-captured `state` is stale.
      if (stateRef.current === 'listening') {
        setState('no-speech')
      }
    }

    try {
      recog.start()
    } catch (err: any) {
      setErrorDetail(err?.message || String(err))
      setState('retry')
    }
  }

  function stopListening() {
    try { recogRef.current?.stop() } catch {}
  }

  function reset() {
    setTranscript('')
    setErrorDetail('')
    setState('idle')
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between gap-3" dir="ltr">
        <p className="font-semibold text-blue-900 text-base">{target}</p>
        <AudioButton text={target} size="md" />
      </div>

      {hint && (
        <p className="text-xs text-gray-400 text-right">💡 {hint}</p>
      )}

      <div className="flex flex-col items-center gap-3">
        {state === 'idle' && (
          <button
            onClick={startListening}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            <MicIcon className="w-5 h-5" />
            {t('press')}
          </button>
        )}

        {state === 'listening' && (
          <button
            onClick={stopListening}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-all shadow-md animate-pulse"
          >
            <MicIcon className="w-5 h-5" />
            {t('listening')}
          </button>
        )}

        {state === 'success' && (
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-700 font-semibold">{t('success')}</p>
            {transcript && <p className="text-xs text-gray-400 mt-1" dir="ltr">{transcript}</p>}
            <button onClick={reset} className="mt-3 text-sm text-blue-600 hover:underline">{t('tryAgain')}</button>
          </div>
        )}

        {state === 'retry' && (
          <div className="text-center">
            <div className="text-3xl mb-2">🎤</div>
            <p className="text-orange-600 font-medium">{t('retry')}</p>
            {transcript && (
              <p className="text-xs text-gray-500 mt-1">
                {t('heard')}<span dir="ltr" className="font-medium">{transcript}</span>
              </p>
            )}
            <button onClick={reset} className="mt-3 flex items-center gap-2 mx-auto bg-orange-500 text-white px-5 py-2 rounded-full text-sm hover:bg-orange-600">
              <MicIcon className="w-4 h-4" />
              {t('retryBtn')}
            </button>
          </div>
        )}

        {state === 'no-speech' && (
          <div className="text-center">
            <div className="text-3xl mb-2">🤫</div>
            <p className="text-gray-700 font-medium">{safeT(t, 'noSpeech', "We didn't hear anything. Try again, a bit louder.")}</p>
            <button onClick={reset} className="mt-3 flex items-center gap-2 mx-auto bg-blue-600 text-white px-5 py-2 rounded-full text-sm hover:bg-blue-700">
              <MicIcon className="w-4 h-4" />
              {t('retryBtn')}
            </button>
          </div>
        )}

        {state === 'no-mic' && (
          <div className="text-center max-w-md">
            <div className="text-3xl mb-2">🚫</div>
            <p className="text-red-700 font-semibold">{safeT(t, 'noMicTitle', 'Microphone access blocked')}</p>
            <p className="text-xs text-gray-600 mt-1">
              {safeT(
                t,
                'noMicBody',
                'Click the lock icon in your browser address bar and allow microphone access for this site, then refresh the page.',
              )}
            </p>
            <button onClick={reset} className="mt-3 text-sm text-blue-600 hover:underline">{t('tryAgain')}</button>
          </div>
        )}

        {state === 'unsupported' && (
          <p className="text-sm text-gray-500 text-center bg-gray-100 rounded-xl px-4 py-3 max-w-md">
            {safeT(
              t,
              'unsupported',
              "Speech recognition isn't available in this browser. Try the latest Chrome, Edge, or Safari.",
            )}
          </p>
        )}

        {state === 'insecure' && (
          <p className="text-sm text-gray-500 text-center bg-gray-100 rounded-xl px-4 py-3 max-w-md">
            {safeT(
              t,
              'insecure',
              'Speaking exercises require HTTPS. Open the site via https://gogermany.ma to use the microphone.',
            )}
          </p>
        )}

        {errorDetail && (state === 'retry' || state === 'no-mic') && (
          <p className="text-[10px] text-gray-400 font-mono">[{errorDetail}]</p>
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

/** Translate `key` from the speaking namespace, falling back to `fallback`
 *  if next-intl raises (key missing in messages). */
function safeT(
  t: ReturnType<typeof useTranslations>,
  key: string,
  fallback: string,
): string {
  try {
    const v = t(key as any)
    if (typeof v === 'string' && v && !v.startsWith('learnGerman.speaking.')) return v
    return fallback
  } catch {
    return fallback
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
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
