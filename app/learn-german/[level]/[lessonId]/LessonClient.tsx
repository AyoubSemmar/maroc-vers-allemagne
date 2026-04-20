'use client'

import { useState } from 'react'
import type { Lesson, Level } from '@/lib/german-data/types'
import { useProgress } from '@/lib/useProgress'

type Tab = 'grammar' | 'vocab' | 'exercise'

export default function LessonClient({
  lesson,
  level,
  nextLesson,
}: {
  lesson: Lesson
  level: Level
  nextLesson: Lesson | null
}) {
  const [tab, setTab] = useState<Tab>('grammar')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const { completeLesson } = useProgress(level.id)

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'grammar', label: 'القواعد', emoji: '📖' },
    { id: 'vocab', label: 'المفردات', emoji: '📝' },
    { id: 'exercise', label: 'التمرين', emoji: '✏️' },
  ]

  const questions = lesson.exercise.questions
  const score = submitted
    ? Math.round((questions.filter((q) =>
        (answers[q.id] ?? '').trim().toLowerCase() === q.answer.trim().toLowerCase()
      ).length / questions.length) * 100)
    : null

  function handleAnswer(questionId: string, option: string) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  function handleSubmit() {
    if (Object.keys(answers).length < questions.length) return
    const s = Math.round((questions.filter((q) =>
      (answers[q.id] ?? '').trim().toLowerCase() === q.answer.trim().toLowerCase()
    ).length / questions.length) * 100)
    setSubmitted(true)
    if (s >= 75) completeLesson(lesson.id, nextLesson?.id ?? null)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <a
            href={`/learn-german/${level.id.toLowerCase()}`}
            className="text-sm text-green-700 hover:underline mb-3 block"
          >
            → العودة إلى {level.id}
          </a>
          <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>

          {/* Tab bar */}
          <div className="flex gap-2 mt-5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${tab === t.id
                    ? 'bg-green-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* ── GRAMMAR TAB ── */}
        {tab === 'grammar' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{lesson.grammar.title}</h2>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-gray-700 leading-relaxed text-sm whitespace-pre-line mb-6">
              {lesson.grammar.content}
            </div>
            <h3 className="font-semibold text-gray-700 mb-3">أمثلة:</h3>
            <div className="flex flex-col gap-2">
              {lesson.grammar.examples.map((ex, i) => (
                <div key={i} className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-gray-800">
                  {ex}
                </div>
              ))}
            </div>
            <button
              onClick={() => setTab('vocab')}
              className="mt-8 w-full bg-green-700 text-white rounded-full py-3 font-medium hover:bg-green-800"
            >
              التالي: المفردات ←
            </button>
          </div>
        )}

        {/* ── VOCAB TAB ── */}
        {tab === 'vocab' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              المفردات ({lesson.vocabulary.length} كلمة)
            </h2>
            <div className="flex flex-col gap-3">
              {lesson.vocabulary.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{item.german}</p>
                    {item.example && (
                      <p className="text-xs text-gray-400 mt-1 italic">{item.example}</p>
                    )}
                  </div>
                  <span className="text-green-700 font-medium text-sm bg-green-50 px-3 py-1 rounded-full shrink-0">
                    {item.arabic}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setTab('exercise')}
              className="mt-8 w-full bg-green-700 text-white rounded-full py-3 font-medium hover:bg-green-800"
            >
              التالي: التمرين ←
            </button>
          </div>
        )}

        {/* ── EXERCISE TAB ── */}
        {tab === 'exercise' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              اختبر نفسك ({questions.length} أسئلة)
            </h2>

            <div className="flex flex-col gap-6">
              {questions.map((q, i) => {
                const selected = answers[q.id] ?? ''
                const isCorrect = submitted && selected.trim().toLowerCase() === q.answer.trim().toLowerCase()
                const isWrong = submitted && !isCorrect

                return (
                  <div key={q.id} className={`bg-white rounded-2xl border p-5 transition-colors
                    ${submitted ? (isCorrect ? 'border-green-300' : 'border-red-300') : 'border-gray-200'}`}>

                    <p className="font-semibold text-gray-900 mb-1">
                      {i + 1}. {q.question}
                    </p>

                    {q.hint && !submitted && (
                      <p className="text-xs text-gray-400 mb-3">💡 {q.hint}</p>
                    )}

                    {/* Multiple choice */}
                    {q.type === 'multiple-choice' && (
                      <div className="flex flex-col gap-2 mt-3">
                        {q.options?.map((opt) => {
                          const isSelected = selected === opt
                          const isAnswer = opt === q.answer
                          let style = 'border-gray-200 text-gray-700 hover:border-green-400'
                          if (isSelected && !submitted) style = 'border-green-600 bg-green-50 text-green-800'
                          if (submitted && isAnswer) style = 'border-green-500 bg-green-50 text-green-800'
                          if (submitted && isSelected && !isAnswer) style = 'border-red-400 bg-red-50 text-red-700'
                          return (
                            <button
                              key={opt}
                              onClick={() => handleAnswer(q.id, opt)}
                              className={`w-full text-right border rounded-xl px-4 py-3 text-sm transition-colors ${style}`}
                            >
                              {submitted && isAnswer && '✅ '}
                              {submitted && isSelected && !isAnswer && '❌ '}
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* Fill in the blank */}
                    {q.type === 'fill-blank' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={selected}
                          onChange={(e) => !submitted && handleAnswer(q.id, e.target.value)}
                          placeholder="اكتب إجابتك هنا..."
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors
                            ${submitted
                              ? isCorrect
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-red-400 bg-red-50 text-red-700'
                              : 'border-gray-300 focus:border-green-500 text-gray-900'
                            }`}
                          dir="ltr"
                        />
                        {submitted && isWrong && (
                          <p className="text-sm text-green-700 mt-2">✅ الإجابة الصحيحة: <strong>{q.answer}</strong></p>
                        )}
                        {submitted && isCorrect && (
                          <p className="text-sm text-green-600 mt-2">✅ إجابة صحيحة!</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Submit / Score */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="mt-8 w-full bg-green-700 text-white rounded-full py-3 font-medium hover:bg-green-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                تحقق من الإجابات
              </button>
            ) : (
              <div className={`mt-8 rounded-2xl p-6 text-center ${score! >= 75 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                <div className="text-4xl mb-2">{score! >= 75 ? '🎉' : '💪'}</div>
                <p className="text-2xl font-bold text-gray-900">{score}%</p>
                <p className="text-gray-600 text-sm mt-1">
                  {score! >= 75 ? 'ممتاز! أتقنت هذا الدرس.' : 'حاول مراجعة الدرس والمحاولة مجدداً.'}
                </p>
                {nextLesson && score! >= 75 && (
                  <a
                    href={`/learn-german/${level.id.toLowerCase()}/${nextLesson.id}`}
                    className="mt-4 inline-block bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-800"
                  >
                    الدرس التالي: {nextLesson.title} ←
                  </a>
                )}
                {!nextLesson && score! >= 75 && (
                  <a
                    href={`/learn-german/${level.id.toLowerCase()}`}
                    className="mt-4 inline-block bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-800"
                  >
                    العودة إلى المستوى ←
                  </a>
                )}
                {score! < 75 && (
                  <button
                    onClick={() => { setSubmitted(false); setAnswers({}) }}
                    className="mt-4 inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600"
                  >
                    حاول مجدداً
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
