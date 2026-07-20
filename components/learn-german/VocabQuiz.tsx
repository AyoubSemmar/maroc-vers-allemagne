'use client'

import { useMemo, useState } from 'react'
import type { Level } from '@/lib/german-data/types'
import { collectLevelVocab, VOCAB_LEARNED_THRESHOLD, type VocabEntry } from '@/lib/learn-german/vocab'
import type { useVocabProgress } from '@/lib/useVocabProgress'
import AudioButton from '@/components/learn-german/AudioButton'

const ROUND = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Direction = 'de2ar' | 'ar2de'

type Q = {
  entry: VocabEntry
  direction: Direction
  options: string[]   // the visible choices
  answer: string      // the correct choice
}

/**
 * A 10-question vocabulary round. Multiple choice both ways:
 *   de2ar — show the German word, pick its meaning
 *   ar2de — show the meaning, pick the German word
 * Each answer updates the student's per-word mastery (Leitner). Weak/unseen
 * words are surfaced first so the round targets what they don't yet know.
 */
export default function VocabQuiz({
  level,
  vocab,
}: {
  level: Level
  vocab: ReturnType<typeof useVocabProgress>
}) {
  const { byKey, learnedCount, recordAnswer, loaded } = vocab
  const allEntries = useMemo(() => collectLevelVocab(level), [level])

  const [round, setRound] = useState<Q[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  function buildRound(): Q[] {
    // Alternate between words due for review (attempted before, not yet at
    // the mastery threshold — weakest first) and brand-new words. A pure
    // "lowest mastery first" sort buries every attempted word behind the
    // entire unseen pool (620 words = 62 rounds before any repeat), so a
    // word answered correctly once would never resurface for a real chance
    // to climb to "learned" — from the student's view, progress looked like
    // it wasn't saving even though every answer is persisted.
    const due = shuffle(allEntries.filter(e => {
      const m = byKey[e.key]?.mastery
      return m != null && m < VOCAB_LEARNED_THRESHOLD
    })).sort((a, b) => (byKey[a.key]?.mastery ?? 0) - (byKey[b.key]?.mastery ?? 0))
    const fresh = shuffle(allEntries.filter(e => byKey[e.key] == null))

    const target = Math.min(ROUND, allEntries.length)
    const picks: VocabEntry[] = []
    let di = 0, fi = 0
    while (picks.length < target && (di < due.length || fi < fresh.length)) {
      if (di < due.length && (picks.length % 2 === 0 || fi >= fresh.length)) picks.push(due[di++])
      else if (fi < fresh.length) picks.push(fresh[fi++])
      else picks.push(due[di++])
    }
    return picks.map(entry => {
      const direction: Direction = Math.random() < 0.5 ? 'de2ar' : 'ar2de'
      const answer = direction === 'de2ar' ? entry.item.arabic : entry.item.german
      const distractors = shuffle(allEntries.filter(e => e.key !== entry.key))
        .slice(0, 3)
        .map(e => (direction === 'de2ar' ? e.item.arabic : e.item.german))
      const options = shuffle([answer, ...distractors])
      return { entry, direction, options, answer }
    })
  }

  function start() {
    setRound(buildRound())
    setIdx(0)
    setPicked(null)
    setCorrectCount(0)
  }

  function choose(opt: string) {
    if (picked || !round) return
    setPicked(opt)
    const q = round[idx]
    const isCorrect = opt === q.answer
    if (isCorrect) setCorrectCount(c => c + 1)
    recordAnswer(q.entry.key, isCorrect)
  }

  function next() {
    if (!round) return
    if (idx + 1 >= round.length) { setRound(null); return }
    setIdx(idx + 1)
    setPicked(null)
  }

  const total = allEntries.length

  // ── Idle / summary card ──
  if (!round) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <h3 className="text-lg font-bold text-gray-900">{level.id} — Vocabulaire</h3>
        <div className="my-4">
          <div className="text-3xl font-black text-green-700">
            {loaded ? learnedCount : '…'} <span className="text-gray-300">/</span> {total}
          </div>
          <p className="text-xs text-gray-400 mt-1">mots mémorisés</p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${total ? (learnedCount / total) * 100 : 0}%` }}
            />
          </div>
        </div>
        <button
          onClick={start}
          disabled={total < 4}
          className="w-full bg-green-700 text-white rounded-xl py-3 font-semibold hover:bg-green-800 transition-colors disabled:opacity-40"
        >
          {learnedCount > 0 ? 'Continuer l’entraînement' : 'Commencer'}
        </button>
      </div>
    )
  }

  const q = round[idx]
  const prompt = q.direction === 'de2ar' ? q.entry.item.german : q.entry.item.arabic
  const promptDir = q.direction === 'de2ar' ? 'ltr' : 'rtl'
  const optionDir = q.direction === 'de2ar' ? 'rtl' : 'ltr'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <span>{idx + 1} / {round.length}</span>
        <span>✓ {correctCount}</span>
      </div>

      <div className="text-center mb-5">
        <p className="text-xs text-gray-400 mb-1">
          {q.direction === 'de2ar' ? 'Que signifie ce mot ?' : 'Comment dit-on en allemand ?'}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-gray-900" dir={promptDir}>{prompt}</span>
          {q.direction === 'de2ar' && <AudioButton text={q.entry.item.german} size="sm" />}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {q.options.map(opt => {
          const isAns = opt === q.answer
          const isPicked = picked === opt
          let cls = 'border-gray-200 text-gray-700 hover:border-green-400 hover:bg-green-50'
          if (picked) {
            if (isAns) cls = 'border-green-500 bg-green-50 text-green-800 font-medium'
            else if (isPicked) cls = 'border-red-400 bg-red-50 text-red-700'
            else cls = 'border-gray-200 text-gray-400'
          }
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              disabled={!!picked}
              className={`w-full border-2 rounded-xl px-4 py-3 text-sm transition-all text-center ${cls}`}
              dir={optionDir}
            >
              {picked && isAns && <span className="mr-1">✓</span>}
              {picked && isPicked && !isAns && <span className="mr-1">✗</span>}
              {opt}
            </button>
          )
        })}
      </div>

      {picked && (
        <button
          onClick={next}
          className="w-full mt-5 bg-green-700 text-white rounded-xl py-3 font-semibold hover:bg-green-800 transition-colors"
        >
          {idx + 1 >= round.length ? 'Terminer' : 'Suivant →'}
        </button>
      )}
    </div>
  )
}
