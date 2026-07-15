'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Pair { left: string; right: string }

interface Props {
  pairs: Pair[]
  submitted: boolean
  onAnswer: (correct: boolean) => void
}

export default function MatchingExercise({ pairs, submitted, onAnswer }: Props) {
  const t = useTranslations('learnGerman.matching')
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matched, setMatched] = useState<Record<number, number>>({}) // leftIdx → rightIdx
  const [shuffledRight, setShuffledRight] = useState<Pair[]>([])
  const [wrongFlash, setWrongFlash] = useState<number | null>(null)

  useEffect(() => {
    setShuffledRight([...pairs].sort(() => Math.random() - 0.5))
    setMatched({})
    setSelectedLeft(null)
  }, [pairs.length])

  useEffect(() => {
    if (Object.keys(matched).length === pairs.length) {
      // Check all correct
      const allCorrect = Object.entries(matched).every(([li, ri]) => {
        return pairs[Number(li)].right === shuffledRight[Number(ri)].right
      })
      onAnswer(allCorrect)
    }
  }, [matched])

  function selectLeft(i: number) {
    if (submitted) return
    // If already matched, unmatch
    if (matched[i] !== undefined) {
      const newMatched = { ...matched }
      delete newMatched[i]
      setMatched(newMatched)
      setSelectedLeft(i)
      return
    }
    setSelectedLeft(i)
  }

  function selectRight(ri: number) {
    if (submitted || selectedLeft === null) return
    // Check if right side already used
    const alreadyUsed = Object.values(matched).includes(ri)
    if (alreadyUsed) return

    const isCorrect = pairs[selectedLeft].right === shuffledRight[ri].right

    if (!isCorrect) {
      setWrongFlash(ri)
      setTimeout(() => setWrongFlash(null), 600)
      setSelectedLeft(null)
      return
    }

    setMatched(prev => ({ ...prev, [selectedLeft]: ri }))
    setSelectedLeft(null)
  }

  function getLeftState(i: number) {
    if (matched[i] !== undefined) return 'matched'
    if (selectedLeft === i) return 'selected'
    return 'idle'
  }

  function getRightState(ri: number) {
    const matchedLeftIdx = Object.entries(matched).find(([, v]) => Number(v) === ri)
    if (matchedLeftIdx) {
      const isCorrect = !submitted || pairs[Number(matchedLeftIdx[0])].right === shuffledRight[ri].right
      return isCorrect ? 'matched-correct' : 'matched-wrong'
    }
    if (wrongFlash === ri) return 'flash-wrong'
    if (selectedLeft !== null) return 'available'
    return 'idle'
  }

  const leftColors: Record<string, string> = {
    matched: 'bg-green-100 border-green-500 text-green-900',
    selected: 'bg-blue-100 border-blue-500 text-blue-900 ring-2 ring-blue-300',
    idle: 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 hover:bg-blue-50',
  }

  const rightColors: Record<string, string> = {
    'matched-correct': 'bg-green-100 border-green-500 text-green-900',
    'matched-wrong': 'bg-red-100 border-red-400 text-red-700',
    'flash-wrong': 'bg-red-100 border-red-400 text-red-700 animate-pulse',
    available: 'bg-white border-gray-300 text-gray-800 hover:border-green-400 hover:bg-green-50 cursor-pointer',
    idle: 'bg-white border-gray-200 text-gray-500',
  }

  return (
    <div className="grid grid-cols-2 gap-3" dir="ltr">
      {/* Left column: German */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-gray-400 text-center mb-1">{t('de')}</p>
        {pairs.map((pair, i) => (
          <button
            key={i}
            onClick={() => selectLeft(i)}
            disabled={submitted}
            className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-left transition-all
              ${leftColors[getLeftState(i)]}
              ${submitted ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            {matched[i] !== undefined && <span className="mr-1">✓</span>}
            {pair.left}
          </button>
        ))}
      </div>

      {/* Right column: Arabic */}
      <div className="flex flex-col gap-2" dir="rtl">
        <p className="text-xs font-semibold text-gray-400 text-center mb-1">{t('ar')}</p>
        {shuffledRight.map((pair, ri) => (
          <button
            key={ri}
            onClick={() => selectRight(ri)}
            disabled={submitted || selectedLeft === null}
            className={`w-full px-3 py-2.5 rounded-xl border-2 text-sm font-medium text-right transition-all
              ${rightColors[getRightState(ri)]}
              ${submitted || selectedLeft === null ? 'cursor-default' : ''}
            `}
          >
            {pair.right}
          </button>
        ))}
      </div>
    </div>
  )
}
