'use client'

import { useState, type ReactNode } from 'react'
import type { Lesson, Level, GrammarTable, VocabItem, Gender } from '@/lib/german-data/types'
import { useProgress } from '@/lib/useProgress'
import AudioButton from '@/components/learn-german/AudioButton'
import DragDropExercise from '@/components/learn-german/DragDropExercise'
import MatchingExercise from '@/components/learn-german/MatchingExercise'
import SpeakingExercise from '@/components/learn-german/SpeakingExercise'

type Tab = 'grammar' | 'vocab' | 'exercise'

// Renders mixed Arabic/German text with proper bidi isolation.
// Any quoted phrase or inline Latin run is wrapped in <bdi dir="ltr"> so
// punctuation (., ?, !) stays attached correctly to the German phrase.
function BidiText({ text, className }: { text: string; className?: string }) {
  // Match quoted runs (various quote styles) OR runs of Latin letters + punctuation
  const regex = /"[^"]+"|„[^"]+(?:"|")|«[^»]+»|'[^']+'|[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß0-9 ,.\-!?':;()]*[A-Za-zÄÖÜäöüß.!?]/g
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match
  let key = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>)
    }
    parts.push(
      <bdi key={key++} dir="ltr" style={{ unicodeBidi: 'isolate' }}>
        {match[0]}
      </bdi>
    )
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>)
  }
  return <span className={className}>{parts}</span>
}

const GENDER_STYLES: Record<Gender, { bg: string; text: string; label: string }> = {
  der: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'der' },
  die: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'die' },
  das: { bg: 'bg-green-100', text: 'text-green-700', label: 'das' },
  pl:  { bg: 'bg-purple-100', text: 'text-purple-700', label: 'pl.' },
}

const TABLE_HEADER_COLORS: Record<string, string> = {
  Nominativ: 'bg-blue-600 text-white',
  Akkusativ: 'bg-orange-500 text-white',
  Dativ: 'bg-purple-600 text-white',
  Genitiv: 'bg-red-600 text-white',
  Maskulin: 'bg-blue-500 text-white',
  Feminin: 'bg-pink-500 text-white',
  Neutrum: 'bg-green-600 text-white',
  Plural: 'bg-purple-500 text-white',
  ich: 'bg-green-600 text-white',
  du: 'bg-teal-600 text-white',
  er: 'bg-blue-600 text-white',
  sie: 'bg-pink-600 text-white',
  es: 'bg-gray-600 text-white',
  wir: 'bg-indigo-600 text-white',
  ihr: 'bg-orange-600 text-white',
  Sie: 'bg-red-700 text-white',
}

function GrammarTableRenderer({ table }: { table: GrammarTable }) {
  return (
    <div className="my-4">
      {table.title && (
        <p className="text-sm font-semibold text-gray-600 mb-2">{table.title}</p>
      )}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm border-collapse" dir="ltr">
          <thead>
            <tr>
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-2.5 font-semibold text-center border-b border-white/20
                    ${TABLE_HEADER_COLORS[h] ?? 'bg-gray-700 text-white'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr
                key={ri}
                className={`${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${row.highlight ? 'font-semibold bg-yellow-50' : ''}`}
              >
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-2.5 text-center border-b border-gray-100 text-gray-800
                      ${ci === 0 ? 'font-semibold text-gray-600 bg-gray-50' : ''}
                      ${row.highlight ? 'text-gray-900' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <p className="text-xs text-gray-500 mt-1.5 mr-1">📌 {table.note}</p>
      )}
    </div>
  )
}

function VocabCard({ item, index }: { item: VocabItem; index: number }) {
  const [flipped, setFlipped] = useState(false)
  const g = item.gender ? GENDER_STYLES[item.gender] : null

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* German word + gender badge + audio */}
          <div className="flex items-center gap-2 flex-wrap">
            {g && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${g.bg} ${g.text}`}>
                {g.label}
              </span>
            )}
            <span className="font-bold text-gray-900 text-lg leading-tight" dir="ltr">
              {item.german}
            </span>
            {item.plural && (
              <span className="text-xs text-gray-400" dir="ltr">· {item.plural}</span>
            )}
            <AudioButton text={item.german} size="sm" />
          </div>

          {/* Type badge */}
          {item.type && (
            <span className="text-xs text-gray-400 mt-0.5 block">{typeLabel(item.type)}</span>
          )}

          {/* Translation */}
          <div className={`mt-2 transition-all ${flipped ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <span className="text-green-700 font-medium">{item.arabic}</span>
          </div>

          {/* Example */}
          {item.example && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 italic flex-1" dir="ltr">{item.example}</p>
                <AudioButton text={item.example} size="sm" />
              </div>
              {item.exampleArabic && (
                <p className="text-xs text-gray-400 mt-0.5">{item.exampleArabic}</p>
              )}
            </div>
          )}
        </div>

        {/* Flip hint */}
        {!flipped && (
          <div className="shrink-0 text-gray-300 group-hover:text-green-400 transition-colors text-xs mt-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

function typeLabel(t: string): string {
  const map: Record<string, string> = {
    noun: 'اسم',
    verb: 'فعل',
    adjective: 'صفة',
    adverb: 'ظرف',
    phrase: 'عبارة',
    preposition: 'حرف جر',
    conjunction: 'أداة ربط',
    pronoun: 'ضمير',
    number: 'رقم',
  }
  return map[t] ?? t
}

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
  const [matchingResults, setMatchingResults] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [vocabSearch, setVocabSearch] = useState('')
  const { completeLesson, isAdmin } = useProgress(level.id)

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'grammar', label: 'القواعد', emoji: '📖' },
    { id: 'vocab', label: 'المفردات', emoji: '📝' },
    { id: 'exercise', label: 'التمارين', emoji: '✏️' },
  ]

  const questions = lesson.exercise.questions

  function calculateScore() {
    let correct = 0
    for (const q of questions) {
      if (q.type === 'matching') {
        if (matchingResults[q.id]) correct++
      } else if (q.type === 'speaking') {
        correct++ // speaking always counts if attempted
      } else {
        const ans = (answers[q.id] ?? '').trim().toLowerCase()
        const expected = q.answer.trim().toLowerCase()
        if (ans === expected) correct++
      }
    }
    return Math.round((correct / questions.length) * 100)
  }

  const score = submitted ? calculateScore() : null

  function handleAnswer(questionId: string, value: string) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function handleMatchingResult(questionId: string, correct: boolean) {
    setMatchingResults(prev => ({ ...prev, [questionId]: correct }))
  }

  function handleSubmit() {
    const nonMatchingNonSpeaking = questions.filter(q => q.type !== 'matching' && q.type !== 'speaking')
    if (nonMatchingNonSpeaking.some(q => !answers[q.id])) return
    const s = calculateScore()
    setSubmitted(true)
    if (s >= 70 || isAdmin) completeLesson(lesson.id, nextLesson?.id ?? null)
  }

  const answeredCount = questions.filter(q => {
    if (q.type === 'matching') return matchingResults[q.id] !== undefined
    if (q.type === 'speaking') return true
    return !!answers[q.id]
  }).length

  const filteredVocab = lesson.vocabulary.filter(v =>
    !vocabSearch || v.german.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    v.arabic.includes(vocabSearch)
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <a
              href={`/learn-german/${level.id.toLowerCase()}`}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-700 transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              {level.id}
            </a>
            <span className="text-gray-300">/</span>
            <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-lg ${level.color}`}>
              {level.id}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-snug">{lesson.title}</h1>
              <p className="text-xs text-gray-400 mt-0.5">درس {lesson.order} · {lesson.vocabulary.length} كلمة · {questions.length} تمرين</p>
            </div>
            <AudioButton text={lesson.title} size="sm" className="mt-1 shrink-0" />
          </div>

          {/* Tab bar */}
          <div className="flex gap-2 mt-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${tab === t.id
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <span>{t.emoji}</span> {t.label}
                {t.id === 'vocab' && <span className="text-xs opacity-70">({lesson.vocabulary.length})</span>}
                {t.id === 'exercise' && <span className="text-xs opacity-70">({questions.length})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ══════════════════ GRAMMAR TAB ══════════════════ */}
        {tab === 'grammar' && (
          <div className="flex flex-col gap-6">

            {/* Grammar title card */}
            <div className={`rounded-2xl p-5 ${level.color} bg-opacity-10 border border-opacity-20`}
              style={{ backgroundColor: 'var(--tw-bg-opacity)' }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${level.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {level.id}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{lesson.grammar.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">قواعد الدرس</p>
                </div>
              </div>
            </div>

            {/* Main explanation */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                <BidiText text={lesson.grammar.content} />
              </div>
            </div>

            {/* Grammar tables */}
            {lesson.grammar.tables && lesson.grammar.tables.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs">📊</span>
                  جداول القواعد
                </h3>
                {lesson.grammar.tables.map((table, i) => (
                  <GrammarTableRenderer key={i} table={table} />
                ))}
              </div>
            )}

            {/* Rules cards */}
            {lesson.grammar.rules && lesson.grammar.rules.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-xs">📌</span>
                  القواعد الأساسية
                </h3>
                {lesson.grammar.rules.map((rule, i) => (
                  <div key={i} className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <p className="font-semibold text-orange-900 text-sm mb-2">
                      <BidiText text={rule.rule} />
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-white border border-orange-200 text-orange-800 text-sm px-3 py-1 rounded-lg font-medium" dir="ltr">
                        {rule.example}
                      </span>
                      <AudioButton text={rule.example} size="sm" />
                      <span className="text-gray-500 text-sm">← <BidiText text={rule.translation} /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Golden tip */}
            {lesson.grammar.tip && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex gap-3">
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <p className="font-bold text-yellow-900 text-sm mb-1">نصيحة ذهبية</p>
                  <p className="text-yellow-800 text-sm leading-relaxed">
                    <BidiText text={lesson.grammar.tip} />
                  </p>
                </div>
              </div>
            )}

            {/* Examples */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 text-green-700 rounded-lg flex items-center justify-center text-xs">✍️</span>
                أمثلة تطبيقية
              </h3>
              <div className="flex flex-col gap-3">
                {lesson.grammar.examples.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <span className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-gray-800 text-sm flex-1" dir="ltr">{ex}</p>
                    <AudioButton text={ex} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setTab('vocab')}
              className="w-full bg-green-700 text-white rounded-2xl py-4 font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
            >
              التالي: المفردات
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
            </button>
          </div>
        )}

        {/* ══════════════════ VOCAB TAB ══════════════════ */}
        {tab === 'vocab' && (
          <div className="flex flex-col gap-4">

            {/* Header + search */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-lg font-bold text-gray-900">المفردات</h2>
                <p className="text-xs text-gray-400">{lesson.vocabulary.length} كلمة · اضغط على أي بطاقة لرؤية الترجمة</p>
              </div>
              <input
                type="text"
                placeholder="ابحث..."
                value={vocabSearch}
                onChange={e => setVocabSearch(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-400 w-44"
              />
            </div>

            {/* Gender legend */}
            <div className="flex items-center gap-3 flex-wrap">
              {(Object.entries(GENDER_STYLES) as [Gender, typeof GENDER_STYLES[Gender]][]).map(([g, s]) => (
                <span key={g} className={`text-xs px-2.5 py-1 rounded-md font-semibold ${s.bg} ${s.text}`}>
                  {s.label} — {g === 'der' ? 'مذكر' : g === 'die' ? 'مؤنث' : g === 'das' ? 'محايد' : 'جمع'}
                </span>
              ))}
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredVocab.map((item, i) => (
                <VocabCard key={i} item={item} index={i} />
              ))}
            </div>

            {filteredVocab.length === 0 && (
              <p className="text-center text-gray-400 py-8">لا توجد نتائج للبحث</p>
            )}

            <button
              onClick={() => setTab('exercise')}
              className="w-full bg-green-700 text-white rounded-2xl py-4 font-semibold hover:bg-green-800 transition-colors flex items-center justify-center gap-2 mt-2"
            >
              التالي: التمارين
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
            </button>
          </div>
        )}

        {/* ══════════════════ EXERCISE TAB ══════════════════ */}
        {tab === 'exercise' && (
          <div className="flex flex-col gap-6">

            {/* Progress bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-semibold text-gray-700">التقدم</span>
                <span className="text-gray-400">{answeredCount} / {questions.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, i) => {
              const selected = answers[q.id] ?? ''
              const isCorrect = submitted && q.type !== 'matching' && q.type !== 'speaking' &&
                selected.trim().toLowerCase() === q.answer.trim().toLowerCase()
              const isWrong = submitted && q.type !== 'matching' && q.type !== 'speaking' && !isCorrect

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl border-2 p-5 transition-all
                    ${submitted && q.type !== 'matching' && q.type !== 'speaking'
                      ? isCorrect ? 'border-green-300' : 'border-red-300'
                      : 'border-gray-200'
                    }`}
                >
                  {/* Question header */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5
                      ${submitted && q.type !== 'matching' && q.type !== 'speaking'
                        ? isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                          ${q.type === 'multiple-choice' ? 'bg-blue-50 text-blue-600' :
                            q.type === 'fill-blank' ? 'bg-orange-50 text-orange-600' :
                            q.type === 'drag-drop' ? 'bg-purple-50 text-purple-600' :
                            q.type === 'matching' ? 'bg-teal-50 text-teal-600' :
                            'bg-pink-50 text-pink-600'}`}>
                          {q.type === 'multiple-choice' ? 'اختيار من متعدد' :
                           q.type === 'fill-blank' ? 'أكمل الفراغ' :
                           q.type === 'drag-drop' ? 'رتب الكلمات' :
                           q.type === 'matching' ? 'صل بين الكلمات' :
                           '🎤 تحدث'}
                        </span>
                        {q.audioPrompt && <AudioButton text={q.audioPrompt} size="sm" />}
                      </div>
                      <p className="font-semibold text-gray-900 mt-1.5 text-sm leading-relaxed">
                        <BidiText text={q.question} />
                      </p>
                      {q.hint && !submitted && (
                        <p className="text-xs text-gray-400 mt-1">💡 <BidiText text={q.hint} /></p>
                      )}
                    </div>
                  </div>

                  {/* ── Multiple choice ── */}
                  {q.type === 'multiple-choice' && (
                    <div className="flex flex-col gap-2 mr-10">
                      {q.options?.map((opt) => {
                        const isSel = selected === opt
                        const isAns = opt === q.answer
                        let cls = 'border-gray-200 text-gray-700 hover:border-green-400 hover:bg-green-50'
                        if (isSel && !submitted) cls = 'border-green-600 bg-green-50 text-green-800 font-medium'
                        if (submitted && isAns) cls = 'border-green-500 bg-green-50 text-green-800 font-medium'
                        if (submitted && isSel && !isAns) cls = 'border-red-400 bg-red-50 text-red-700'
                        return (
                          <button
                            key={opt}
                            onClick={() => handleAnswer(q.id, opt)}
                            className={`w-full text-right border-2 rounded-xl px-4 py-3 text-sm transition-all ${cls}`}
                          >
                            {submitted && isAns && <span className="ml-2">✅</span>}
                            {submitted && isSel && !isAns && <span className="ml-2">❌</span>}
                            <span dir="ltr">{opt}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* ── Fill blank ── */}
                  {q.type === 'fill-blank' && (
                    <div className="mr-10">
                      <input
                        type="text"
                        value={selected}
                        onChange={e => !submitted && handleAnswer(q.id, e.target.value)}
                        placeholder="اكتب إجابتك هنا..."
                        className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors
                          ${submitted
                            ? isCorrect
                              ? 'border-green-500 bg-green-50 text-green-800'
                              : 'border-red-400 bg-red-50 text-red-700'
                            : 'border-gray-300 focus:border-green-500 text-gray-900'
                          }`}
                        dir="ltr"
                      />
                      {submitted && isWrong && (
                        <p className="text-sm text-green-700 mt-2">✅ الإجابة الصحيحة: <strong dir="ltr">{q.answer}</strong></p>
                      )}
                      {submitted && isCorrect && (
                        <p className="text-sm text-green-600 mt-2">✅ إجابة صحيحة!</p>
                      )}
                    </div>
                  )}

                  {/* ── Drag-drop ── */}
                  {q.type === 'drag-drop' && q.words && (
                    <div className="mr-10">
                      <DragDropExercise
                        words={q.words}
                        answer={q.answer}
                        submitted={submitted}
                        onCorrect={() => {}}
                        onAnswer={val => handleAnswer(q.id, val)}
                      />
                    </div>
                  )}

                  {/* ── Matching ── */}
                  {q.type === 'matching' && q.pairs && (
                    <div className="mr-4">
                      <MatchingExercise
                        pairs={q.pairs}
                        submitted={submitted}
                        onAnswer={correct => handleMatchingResult(q.id, correct)}
                      />
                    </div>
                  )}

                  {/* ── Speaking ── */}
                  {q.type === 'speaking' && (
                    <div className="mr-10">
                      <SpeakingExercise
                        target={q.answer}
                        hint={q.hint}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Submit / Score */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < questions.filter(q => q.type !== 'matching' && q.type !== 'speaking').length}
                className="w-full bg-green-700 text-white rounded-2xl py-4 font-semibold hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                تحقق من الإجابات ({answeredCount}/{questions.length})
              </button>
            ) : (
              <div className={`rounded-3xl p-8 text-center border-2 ${score! >= 70 ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                {score! >= 70 ? (
                  <div className="text-5xl mb-3">🏆</div>
                ) : (
                  <div className="text-5xl mb-3">💪</div>
                )}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className={`text-4xl font-black ${score! >= 70 ? 'text-green-700' : 'text-orange-600'}`}>
                    {score}%
                  </div>
                  {/* Mini circular progress */}
                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={score! >= 70 ? '#16a34a' : '#f97316'} strokeWidth="3"
                      strokeDasharray={`${score} ${100 - score!}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">
                  {score! >= 90 ? 'ممتاز! أتقنت هذا الدرس بجدارة 🌟' :
                   score! >= 70 ? 'أحسنت! يمكنك الانتقال للدرس التالي.' :
                   'حاول مراجعة القواعد والمفردات والمحاولة مجدداً.'}
                </p>

                <div className="flex flex-wrap gap-3 justify-center mt-5">
                  {nextLesson && score! >= 70 && (
                    <a
                      href={`/learn-german/${level.id.toLowerCase()}/${nextLesson.id}`}
                      className="bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-800"
                    >
                      الدرس التالي: {nextLesson.title} ←
                    </a>
                  )}
                  {!nextLesson && score! >= 70 && (
                    <a
                      href={`/learn-german/${level.id.toLowerCase()}`}
                      className="bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-800"
                    >
                      🎉 أكملت المستوى! العودة ←
                    </a>
                  )}
                  <button
                    onClick={() => { setSubmitted(false); setAnswers({}); setMatchingResults({}) }}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold
                      ${score! < 70
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {score! < 70 ? 'حاول مجدداً' : 'راجع الإجابات'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
