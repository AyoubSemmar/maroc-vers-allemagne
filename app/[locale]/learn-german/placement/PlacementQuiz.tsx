'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

// 12-question ladder (4×A1, 4×A2, 4×B1). A block is "validated" with ≥3
// correct; the recommended level is the first non-validated block. French UI —
// the quiz exists to route Moroccan students into the right live-class cohort.
type Q = { level: 'a1' | 'a2' | 'b1'; q: string; options: string[]; correct: number }

const QUESTIONS: Q[] = [
  { level: 'a1', q: 'Ich ___ aus Marokko.', options: ['komme', 'kommst', 'kommt', 'kommen'], correct: 0 },
  { level: 'a1', q: '___ heißt du?', options: ['Was', 'Wie', 'Wo', 'Wer'], correct: 1 },
  { level: 'a1', q: 'Das ist ___ Buch.', options: ['eine', 'einen', 'ein', 'einem'], correct: 2 },
  { level: 'a1', q: 'Wir ___ zusammen Deutsch.', options: ['lernt', 'lernst', 'lerne', 'lernen'], correct: 3 },
  { level: 'a2', q: 'Gestern ___ ich ins Kino gegangen.', options: ['bin', 'habe', 'war', 'hatte'], correct: 0 },
  { level: 'a2', q: 'Er ist größer ___ ich.', options: ['wie', 'als', 'von', 'dass'], correct: 1 },
  { level: 'a2', q: 'Ich freue mich ___ deinen Besuch.', options: ['über', 'an', 'auf', 'mit'], correct: 2 },
  { level: 'a2', q: '___ ich Zeit habe, besuche ich dich.', options: ['Ob', 'Als', 'Dass', 'Wenn'], correct: 3 },
  { level: 'b1', q: 'Der Brief ___ gestern geschickt.', options: ['wurde', 'wird', 'war', 'hat'], correct: 0 },
  { level: 'b1', q: 'Ich weiß nicht, ___ er morgen kommt.', options: ['dass', 'ob', 'weil', 'wenn'], correct: 1 },
  { level: 'b1', q: '___ des Regens sind wir gewandert.', options: ['Wegen', 'Während', 'Trotz', 'Statt'], correct: 2 },
  { level: 'b1', q: 'Das ist der Mann, ___ Auto gestohlen wurde.', options: ['deren', 'dem', 'den', 'dessen'], correct: 3 },
]

const LEVEL_LABEL: Record<string, string> = { a1: 'A1 — Débutant', a2: 'A2 — Élémentaire', b1: 'B1 — Intermédiaire' }

function recommend(answers: number[]): 'a1' | 'a2' | 'b1' {
  const score = (lvl: Q['level']) =>
    QUESTIONS.reduce((s, q, i) => s + (q.level === lvl && answers[i] === q.correct ? 1 : 0), 0)
  if (score('a1') < 3) return 'a1'
  if (score('a2') < 3) return 'a2'
  return 'b1'
}

export default function PlacementQuiz() {
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1))
  const [done, setDone] = useState(false)

  const answered = answers.filter((a) => a >= 0).length
  const level = recommend(answers)

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-3">🎯</div>
        <p className="text-sm text-gray-500">Niveau recommandé</p>
        <p className="text-3xl font-black text-green-700 mt-1">{LEVEL_LABEL[level]}</p>
        <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">
          D&rsquo;après vos réponses, le groupe <strong>{level.toUpperCase()}</strong> est le bon point de départ.
          Choisissez un horaire et réservez votre place — ou commencez par les leçons gratuites.
        </p>
        <div className="flex gap-3 justify-center flex-wrap mt-6">
          <Link
            href="/learn-german/classes"
            className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-6 py-3"
          >
            🎥 Voir les groupes {level.toUpperCase()}
          </Link>
          <Link
            href={`/learn-german/${level}`}
            className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-sm font-semibold px-6 py-3"
          >
            📚 Leçons gratuites {level.toUpperCase()}
          </Link>
        </div>
        <button
          onClick={() => { setAnswers(Array(QUESTIONS.length).fill(-1)); setDone(false) }}
          className="block mx-auto mt-5 text-xs text-gray-400 hover:text-gray-600"
        >
          ↻ Refaire le test
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-semibold text-gray-700">Progression</span>
          <span className="text-gray-400">{answered} / {QUESTIONS.length}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {QUESTIONS.map((q, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="font-semibold text-gray-900 mb-3 text-sm">
            <span className="inline-flex w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold items-center justify-center mr-2">{i + 1}</span>
            <span dir="ltr">{q.q}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oi) => (
              <button
                key={oi}
                onClick={() => setAnswers((prev) => prev.map((a, ai) => (ai === i ? oi : a)))}
                className={`border-2 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  answers[i] === oi
                    ? 'border-green-600 bg-green-50 text-green-800 font-semibold'
                    : 'border-gray-200 text-gray-700 hover:border-green-300'
                }`}
                dir="ltr"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setDone(true)}
        disabled={answered < QUESTIONS.length}
        className="w-full bg-green-700 text-white rounded-2xl py-4 font-semibold hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Voir mon niveau ({answered}/{QUESTIONS.length})
      </button>
    </div>
  )
}
