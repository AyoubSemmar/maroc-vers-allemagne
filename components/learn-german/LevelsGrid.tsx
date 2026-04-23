'use client'

import { useEffect, useState } from 'react'
import { levels } from '@/lib/german-data'
import type { Level } from '@/lib/german-data/types'
import { createClient } from '@/lib/supabase-browser'

const ADMIN_EMAIL = 'ayoubsemmar@gmail.com'

type ProgressMap = Record<string, number> // levelId → completedCount

function readAllProgress(): ProgressMap {
  const map: ProgressMap = {}
  for (const level of levels) {
    try {
      const raw = localStorage.getItem(`german_progress_${level.id}`)
      const p = raw ? JSON.parse(raw) : null
      map[level.id] = p?.completedLessons?.length ?? 0
    } catch {
      map[level.id] = 0
    }
  }
  return map
}

function isLevelUnlocked(level: Level, index: number, progressMap: ProgressMap, isAdmin: boolean): boolean {
  if (isAdmin) return true
  if (index === 0) return true
  const prev = levels[index - 1]
  if (prev.lessons.length === 0) return false
  return (progressMap[prev.id] ?? 0) >= prev.lessons.length
}

export default function LevelsGrid() {
  const [progressMap, setProgressMap] = useState<ProgressMap>({})
  const [loaded, setLoaded] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setProgressMap(readAllProgress())
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(user?.email === ADMIN_EMAIL)
      setLoaded(true)
    })
  }, [])

  if (!loaded) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {levels.map((level, index) => {
        const isAvailable = level.lessons.length > 0
        const unlocked = isLevelUnlocked(level, index, progressMap, isAdmin)
        const completedCount = progressMap[level.id] ?? 0
        const pct = isAvailable ? Math.round((completedCount / level.lessons.length) * 100) : 0
        const allDone = isAvailable && completedCount >= level.lessons.length

        // 3 states: locked | unlocked+no content | unlocked+has content
        const locked = !unlocked
        const comingSoon = unlocked && !isAvailable

        return (
          <a
            key={level.id}
            href={isAvailable && unlocked ? `/learn-german/${level.id.toLowerCase()}` : '#'}
            className={`relative bg-white rounded-2xl border-2 p-6 transition-all block
              ${isAvailable && unlocked ? 'border-gray-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
              ${locked ? 'opacity-50 cursor-not-allowed border-gray-100' : ''}
              ${comingSoon ? 'border-dashed border-gray-300 cursor-default' : ''}
              ${allDone ? 'border-green-200' : ''}
            `}
          >
            {/* Badges */}
            {locked  && <span className="absolute top-4 left-4 text-gray-400 text-xl">🔒</span>}
            {allDone && <span className="absolute top-4 left-4 text-green-500 text-xl">✅</span>}
            {comingSoon && <span className="absolute top-4 left-4 text-blue-400 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">قريباً</span>}

            {/* Level badge */}
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

            {/* Progress bar */}
            {isAvailable && unlocked && (
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
              {isAvailable && unlocked && (
                <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {pct > 0 ? 'متابعة ←' : 'ابدأ الآن ←'}
                </span>
              )}
              {locked && (
                <span className="text-xs text-gray-400">أكمل {levels[index - 1]?.id} أولاً</span>
              )}
            </div>
          </a>
        )
      })}
    </div>
  )
}
