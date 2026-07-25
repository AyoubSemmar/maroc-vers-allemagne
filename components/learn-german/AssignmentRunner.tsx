'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import AudioButton from '@/components/learn-german/AudioButton'
import SkillIcon from '@/components/learn-german/SkillIcon'
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
    // Lesson grouping for pre-generated devoirs (see scripts/generate-devoirs).
    lessonOrder?: number
    lessonId?: string
    lessonTitle?: string
  } | null
  due_at: string | null
}

type McqReveal = {
  score: number
  saved?: boolean
  correctCount: number
  total: number
  perQuestion: { correct: number; picked: number | null; ok: boolean; explanation: string }[]
}
type WriteReveal = {
  score: number
  saved?: boolean
  ai_feedback: {
    corrected: string
    tip: string
    wordCount: number
    mistakes: { original: string; correction: string; explanation: string; type?: string }[]
  }
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
  const t = useTranslations('learnGerman.devoirs')
  const pathname = usePathname()
  const isMcq = assignment.skill !== 'schreiben'
  const questions = assignment.content?.questions ?? []
  // Pre-generated lesson devoirs carry the lesson's base (Arabic) theme in
  // their stored title — show the localized skill name instead. Ad-hoc
  // teacher assignments (no lessonId) keep their custom title.
  const isLessonDevoir = !!assignment.content?.lessonId

  const [choices, setChoices] = useState<number[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsLogin, setNeedsLogin] = useState(false)
  const [mcqResult, setMcqResult] = useState<McqReveal | null>(null)
  const [writeResult, setWriteResult] = useState<WriteReveal | null>(null)

  const done = mcqResult || writeResult
  const notSaved = done ? (mcqResult ?? writeResult)!.saved === false : false
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
      if (!res.ok) {
        if (res.status === 401 && data.code === 'auth_required') setNeedsLogin(true)
        else setError(data.error || t('errGeneric'))
        return
      }
      if (isMcq) setMcqResult(data as McqReveal)
      else setWriteResult(data as WriteReveal)
      onGraded(assignment.id, data.score ?? 0)
    } catch {
      setError(t('errNetwork'))
    } finally {
      setBusy(false)
    }
  }

  const allAnswered = isMcq
    ? questions.length > 0 && questions.every((_, i) => choices[i] != null)
    : wordCount >= (assignment.content?.minWords ?? 1)

  const loginHref = `/login?next=${encodeURIComponent(pathname)}`

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <SkillIcon skill={assignment.skill} size={13} /> {SKILL_LABELS[assignment.skill]} · {assignment.level_id}
            </p>
            <h3 className="font-bold text-gray-900 truncate" dir={isLessonDevoir ? undefined : 'ltr'}>
              {isLessonDevoir ? t(`skillDesc.${assignment.skill}`) : assignment.title}
            </h3>
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
              <span className="text-sm text-indigo-900">{t('listenHint')}</span>
            </div>
          )}

          {/* Lesen: show the passage */}
          {assignment.skill === 'lesen' && assignment.content?.text && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">{t('textLabel')}</span>
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
                        {rev && oi === rev.correct && '✓ '}
                        {rev && oi === rev.picked && oi !== rev.correct && '✗ '}
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {rev?.explanation && (
                  <p className="text-xs text-gray-500 mt-2">{rev.explanation}</p>
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
                placeholder={t('writeHint')}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {t('words', { n: wordCount })}
                {assignment.content?.minWords ? ` · ${t('goal', { min: assignment.content.minWords, max: assignment.content.maxWords ?? assignment.content.minWords })}` : ''}
              </p>
            </div>
          )}

          {/* Schreiben feedback */}
          {writeResult && (
            <div className="flex flex-col gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 mb-1">✓ {t('corrected')}</p>
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
                <p className="text-sm bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900">{writeResult.ai_feedback.tip}</p>
              )}
            </div>
          )}

          {/* Signed-out user hit an AI-graded skill: sell the free account. */}
          {needsLogin && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-green-900 mb-1">{t('loginTitle')}</p>
              <p className="text-xs text-green-800 mb-3">{t('loginBody')}</p>
              <Link href={loginHref} className="inline-block bg-green-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-green-800">
                {t('loginCta')}
              </Link>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Footer */}
          {!done ? (
            !needsLogin && (
              <button
                onClick={submit}
                disabled={!allAnswered || busy}
                className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold hover:bg-green-800 disabled:opacity-40"
              >
                {busy ? t('grading') : t('submit')}
              </button>
            )
          ) : (
            <div className="text-center">
              <div className="text-4xl font-black text-green-700">
                {(mcqResult?.score ?? writeResult?.score)}<span className="text-lg text-gray-300">/100</span>
              </div>
              {mcqResult && <p className="text-sm text-gray-500 mt-1">{t('correctCount', { n: mcqResult.correctCount, total: mcqResult.total })}</p>}
              {notSaved && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
                  {t('notSaved')}{' '}
                  <Link href={loginHref} className="font-semibold underline text-green-800">
                    {t('loginCta')}
                  </Link>
                </div>
              )}
              <button onClick={onClose} className="mt-4 bg-gray-100 text-gray-700 rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-gray-200">
                {t('close')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
