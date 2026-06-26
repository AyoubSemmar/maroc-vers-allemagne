'use client'

import { useState } from 'react'
import AudioButton from '@/components/learn-german/AudioButton'
import { SKILL_LABELS, type Skill } from '@/lib/learn-german/assignmentAI'

export type ClientAssignment = {
  id: string
  skill: Skill
  level_id: string
  title: string
  instructions: string | null
  content: {
    text?: string
    questions?: { q: string; options: string[] }[]
    minWords?: number
    maxWords?: number
  } | null
  due_at: string | null
}

type McqReveal = {
  score: number
  correctCount: number
  total: number
  perQuestion: { correct: number; picked: number | null; ok: boolean; explanation: string }[]
}
type WriteReveal = {
  score: number
  ai_feedback: {
    corrected: string
    tip: string
    wordCount: number
    mistakes: { original: string; correction: string; explanation: string; type?: string }[]
  }
}

const SKILL_EMOJI: Record<Skill, string> = {
  grammar: '🧩', lesen: '📖', schreiben: '✍️', hoeren: '🎧',
}

export default function AssignmentRunner({
  assignment,
  locale,
  onClose,
  onGraded,
}: {
  assignment: ClientAssignment
  locale: string
  onClose: () => void
  onGraded: (assignmentId: string, score: number) => void
}) {
  const isMcq = assignment.skill !== 'schreiben'
  const questions = assignment.content?.questions ?? []

  const [choices, setChoices] = useState<number[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mcqResult, setMcqResult] = useState<McqReveal | null>(null)
  const [writeResult, setWriteResult] = useState<WriteReveal | null>(null)

  const done = mcqResult || writeResult
  const wordCount = (text.trim().match(/\S+/g) ?? []).length

  async function submit() {
    setBusy(true)
    setError(null)
    try {
      const payload: any = { assignmentId: assignment.id, locale }
      if (isMcq) payload.choices = questions.map((_, i) => (choices[i] ?? -1))
      else payload.text = text
      const res = await fetch('/api/learn-german/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur.'); return }
      if (isMcq) setMcqResult(data as McqReveal)
      else setWriteResult(data as WriteReveal)
      onGraded(assignment.id, data.score ?? 0)
    } catch {
      setError('Erreur réseau. Réessayez.')
    } finally {
      setBusy(false)
    }
  }

  const allAnswered = isMcq
    ? questions.length > 0 && questions.every((_, i) => choices[i] != null)
    : wordCount >= (assignment.content?.minWords ?? 1)

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="min-w-0">
            <p className="text-xs text-gray-400">{SKILL_EMOJI[assignment.skill]} {SKILL_LABELS[assignment.skill]} · {assignment.level_id}</p>
            <h3 className="font-bold text-gray-900 truncate" dir="ltr">{assignment.title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl shrink-0">✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {assignment.instructions && (
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{assignment.instructions}</p>
          )}

          {/* Hören: play the script, never show it */}
          {assignment.skill === 'hoeren' && assignment.content?.text && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
              <AudioButton text={assignment.content.text} size="md" />
              <span className="text-sm text-indigo-900">🎧 Écoutez l’audio, puis répondez. Vous pouvez réécouter.</span>
            </div>
          )}

          {/* Lesen: show the passage */}
          {assignment.skill === 'lesen' && assignment.content?.text && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Text</span>
                <AudioButton text={assignment.content.text} size="sm" />
              </div>
              <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line" dir="ltr">{assignment.content.text}</p>
            </div>
          )}

          {/* MCQ questions */}
          {isMcq && questions.map((q, qi) => {
            const rev = mcqResult?.perQuestion[qi]
            return (
              <div key={qi} className="border border-gray-200 rounded-xl p-4">
                <p className="font-semibold text-sm text-gray-900 mb-3" dir="ltr">{qi + 1}. {q.q}</p>
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, oi) => {
                    const picked = choices[qi] === oi
                    let cls = 'border-gray-200 text-gray-700 hover:border-green-400'
                    if (!done && picked) cls = 'border-green-600 bg-green-50 text-green-800'
                    if (rev) {
                      if (oi === rev.correct) cls = 'border-green-500 bg-green-50 text-green-800'
                      else if (oi === rev.picked) cls = 'border-red-400 bg-red-50 text-red-700'
                      else cls = 'border-gray-200 text-gray-400'
                    }
                    return (
                      <button
                        key={oi}
                        disabled={!!done}
                        onClick={() => setChoices(prev => { const n = [...prev]; n[qi] = oi; return n })}
                        className={`text-left border-2 rounded-lg px-3 py-2 text-sm transition-all ${cls}`}
                        dir="ltr"
                      >
                        {rev && oi === rev.correct && '✅ '}
                        {rev && oi === rev.picked && oi !== rev.correct && '❌ '}
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {rev?.explanation && (
                  <p className="text-xs text-gray-500 mt-2">💡 {rev.explanation}</p>
                )}
              </div>
            )
          })}

          {/* Schreiben textarea */}
          {!isMcq && !writeResult && (
            <div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={8}
                dir="ltr"
                placeholder="Schreiben Sie hier auf Deutsch…"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {wordCount} mots
                {assignment.content?.minWords ? ` · objectif ${assignment.content.minWords}–${assignment.content.maxWords}` : ''}
              </p>
            </div>
          )}

          {/* Schreiben feedback */}
          {writeResult && (
            <div className="flex flex-col gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 mb-1">✅ Version corrigée</p>
                <p className="text-sm text-green-900" dir="ltr">{writeResult.ai_feedback.corrected}</p>
              </div>
              {writeResult.ai_feedback.mistakes.length > 0 && (
                <div className="flex flex-col gap-2">
                  {writeResult.ai_feedback.mistakes.map((m, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 text-sm">
                      <span className="text-red-600 line-through" dir="ltr">{m.original}</span>
                      {' → '}
                      <span className="text-green-700 font-medium" dir="ltr">{m.correction}</span>
                      <p className="text-xs text-gray-500 mt-1">{m.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
              {writeResult.ai_feedback.tip && (
                <p className="text-sm bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">💡 {writeResult.ai_feedback.tip}</p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Footer */}
          {!done ? (
            <button
              onClick={submit}
              disabled={!allAnswered || busy}
              className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold hover:bg-green-800 disabled:opacity-40"
            >
              {busy ? 'Correction…' : 'Soumettre pour correction'}
            </button>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-black text-green-700">
                {(mcqResult?.score ?? writeResult?.score)}<span className="text-lg text-gray-300">/100</span>
              </div>
              {mcqResult && <p className="text-sm text-gray-500 mt-1">{mcqResult.correctCount}/{mcqResult.total} correctes</p>}
              <button onClick={onClose} className="mt-4 bg-gray-100 text-gray-700 rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-gray-200">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
