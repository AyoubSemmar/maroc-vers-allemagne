'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function HelpfulButton({
  articleId,
  initialYes,
  initialNo,
}: {
  articleId: string
  initialYes: number
  initialNo: number
}) {
  const [yes, setYes] = useState(initialYes)
  const [no, setNo] = useState(initialNo)
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null)
  const supabase = createClient()

  async function vote(type: 'yes' | 'no') {
    if (voted) return
    setVoted(type)

    if (type === 'yes') {
      setYes((v) => v + 1)
      await supabase.from('articles').update({ helpful_yes: yes + 1 }).eq('id', articleId)
    } else {
      setNo((v) => v + 1)
      await supabase.from('articles').update({ helpful_no: no + 1 }).eq('id', articleId)
    }
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8 text-center">
      <p className="text-gray-600 font-medium mb-4">هل كان هذا المقال مفيداً؟</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => vote('yes')}
          disabled={!!voted}
          className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all
            ${voted === 'yes'
              ? 'bg-green-600 text-white border-green-600'
              : 'border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-700'
            } disabled:cursor-default`}
        >
          👍 نعم {yes > 0 && <span className="bg-white/30 rounded-full px-2">{yes}</span>}
        </button>
        <button
          onClick={() => vote('no')}
          disabled={!!voted}
          className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all
            ${voted === 'no'
              ? 'bg-red-500 text-white border-red-500'
              : 'border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500'
            } disabled:cursor-default`}
        >
          👎 لا {no > 0 && <span className="bg-white/30 rounded-full px-2">{no}</span>}
        </button>
      </div>
      {voted && (
        <p className="text-sm text-gray-400 mt-4">شكراً على رأيك! 🙏</p>
      )}
    </div>
  )
}
