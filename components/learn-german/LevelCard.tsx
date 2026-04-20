'use client'

import { useProgress } from '@/lib/useProgress'
import type { Level } from '@/lib/german-data/types'

export default function LevelCard({ level, index }: { level: Level; index: number }) {
  const { completedCount, loaded } = useProgress(level.id)
  const isAvailable = level.lessons.length > 0
  const pct = isAvailable && loaded ? Math.round((completedCount / level.lessons.length) * 100) : 0
  const isLocked = index > 0 // will expand this in Step 8

  return (
    <a
      href={isAvailable && !isLocked ? `/learn-german/${level.id.toLowerCase()}` : '#'}
      className={`relative bg-white rounded-2xl border-2 p-6 transition-all block
        ${isAvailable && !isLocked
          ? 'border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
          : 'border-gray-100 opacity-60 cursor-not-allowed'
        }`}
    >
      {isLocked && <span className="absolute top-4 left-4 text-gray-400 text-xl">🔒</span>}

      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg mb-4 ${level.color}`}>
        {level.id}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{level.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{level.description}</p>
        </div>
        <span className="text-2xl mr-2">{level.emoji}</span>
      </div>

      {isAvailable && loaded && (
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{completedCount} / {level.lessons.length} دروس</p>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {isAvailable ? `${level.lessons.length} دروس` : 'قريباً'}
        </span>
        {isAvailable && !isLocked && (
          <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
            {pct > 0 ? 'متابعة ←' : 'ابدأ الآن ←'}
          </span>
        )}
      </div>
    </a>
  )
}
