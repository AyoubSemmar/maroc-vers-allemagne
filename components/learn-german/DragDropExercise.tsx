'use client'

import { useState, useEffect } from 'react'

interface Props {
  words: string[]
  answer: string
  onCorrect: () => void
  submitted: boolean
  onAnswer: (a: string) => void
}

export default function DragDropExercise({ words, answer, onCorrect, submitted, onAnswer }: Props) {
  const [bank, setBank] = useState<string[]>([])
  const [placed, setPlaced] = useState<string[]>([])

  // Shuffle words on mount
  useEffect(() => {
    setBank([...words].sort(() => Math.random() - 0.5))
    setPlaced([])
  }, [words.join(',')])

  function addWord(word: string, idx: number) {
    if (submitted) return
    const newBank = [...bank]
    newBank.splice(idx, 1)
    const newPlaced = [...placed, word]
    setBank(newBank)
    setPlaced(newPlaced)
    onAnswer(newPlaced.join(' '))
  }

  function removeWord(word: string, idx: number) {
    if (submitted) return
    const newPlaced = [...placed]
    newPlaced.splice(idx, 1)
    setPlaced(newPlaced)
    setBank([...bank, word])
    onAnswer(newPlaced.join(' '))
  }

  const isCorrect = submitted && placed.join(' ').trim().toLowerCase() === answer.trim().toLowerCase()
  const isWrong = submitted && !isCorrect

  return (
    <div className="flex flex-col gap-3">
      {/* Answer area */}
      <div
        className={`min-h-14 rounded-xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-center transition-colors
          ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
        dir="ltr"
      >
        {placed.length === 0 && (
          <span className="text-gray-400 text-sm select-none">اضغط على الكلمات لترتيب الجملة...</span>
        )}
        {placed.map((word, i) => (
          <button
            key={`placed-${i}`}
            onClick={() => removeWord(word, i)}
            disabled={submitted}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
              ${submitted
                ? isCorrect
                  ? 'bg-green-100 border-green-400 text-green-800'
                  : 'bg-red-100 border-red-400 text-red-700'
                : 'bg-white border-green-400 text-green-800 hover:bg-red-50 hover:border-red-300 hover:text-red-700 cursor-pointer'
              }`}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2" dir="ltr">
        {bank.map((word, i) => (
          <button
            key={`bank-${i}`}
            onClick={() => addWord(word, i)}
            disabled={submitted}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700
              hover:border-green-500 hover:bg-green-50 hover:text-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {word}
          </button>
        ))}
      </div>

      {submitted && isWrong && (
        <p className="text-sm text-green-700 mt-1">
          ✅ الإجابة الصحيحة: <strong dir="ltr">{answer}</strong>
        </p>
      )}
      {submitted && isCorrect && (
        <p className="text-sm text-green-600 mt-1">✅ ممتاز! الترتيب صحيح.</p>
      )}
    </div>
  )
}
