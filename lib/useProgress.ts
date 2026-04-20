'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { LevelId } from './german-data/types'

type LevelProgress = {
  completedLessons: string[]
  currentLesson: string | null
}

const defaultProgress = (): LevelProgress => ({
  completedLessons: [],
  currentLesson: null,
})

function localKey(levelId: LevelId) {
  return `german_progress_${levelId}`
}

function readLocal(levelId: LevelId): LevelProgress {
  try {
    const raw = localStorage.getItem(localKey(levelId))
    return raw ? JSON.parse(raw) : defaultProgress()
  } catch {
    return defaultProgress()
  }
}

function writeLocal(levelId: LevelId, progress: LevelProgress) {
  localStorage.setItem(localKey(levelId), JSON.stringify(progress))
}

export function useProgress(levelId: LevelId) {
  const [progress, setProgress] = useState<LevelProgress>(defaultProgress())
  const [loaded, setLoaded] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Load from Supabase
        const { data } = await supabase
          .from('user_progress')
          .select('completed_lessons, current_lesson')
          .eq('user_id', user.id)
          .eq('level_id', levelId)
          .single()

        if (data) {
          const p: LevelProgress = {
            completedLessons: data.completed_lessons ?? [],
            currentLesson: data.current_lesson ?? null,
          }
          setProgress(p)
          writeLocal(levelId, p) // keep local in sync
        } else {
          // First time for this level — seed from localStorage if any
          const local = readLocal(levelId)
          setProgress(local)
        }
      } else {
        // Not logged in — use localStorage only
        setProgress(readLocal(levelId))
      }

      setLoaded(true)
    }

    load()
  }, [levelId])

  async function completeLesson(lessonId: string, nextLessonId: string | null) {
    const updated: LevelProgress = {
      completedLessons: progress.completedLessons.includes(lessonId)
        ? progress.completedLessons
        : [...progress.completedLessons, lessonId],
      currentLesson: nextLessonId ?? lessonId,
    }

    setProgress(updated)
    writeLocal(levelId, updated)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          level_id: levelId,
          completed_lessons: updated.completedLessons,
          current_lesson: updated.currentLesson,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,level_id' })
    }
  }

  function isLessonUnlocked(lessonId: string, lessonOrder: number): boolean {
    if (lessonOrder === 1) return true
    return progress.completedLessons.length >= lessonOrder - 1
  }

  function isLessonCompleted(lessonId: string): boolean {
    return progress.completedLessons.includes(lessonId)
  }

  const completedCount = progress.completedLessons.length

  return { progress, completedCount, isLessonUnlocked, isLessonCompleted, completeLesson, loaded }
}
