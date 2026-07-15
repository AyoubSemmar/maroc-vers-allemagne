'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { LevelId } from './german-data/types'

type LevelProgress = {
  completedLessons: string[]
  currentLesson: string | null
}

export type LessonScore = { best: number; last: number; attempts: number }
type ScoreMap = Record<string, LessonScore>

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

const ADMIN_EMAIL = 'ayoubsemmar@gmail.com'

export function useProgress(levelId: LevelId) {
  const [progress, setProgress] = useState<LevelProgress>(defaultProgress())
  const [scores, setScores] = useState<ScoreMap>({})
  const [loaded, setLoaded] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthed(!!user)
      if (user?.email === ADMIN_EMAIL) setIsAdmin(true)

      if (user) {
        // Load banked exercise scores for this level (best-effort).
        const { data: scoreRows } = await supabase
          .from('lesson_scores')
          .select('lesson_id, best_score, last_score, attempts')
          .eq('user_id', user.id)
          .eq('level_id', levelId)
        if (scoreRows) {
          const map: ScoreMap = {}
          for (const r of scoreRows) {
            map[r.lesson_id] = { best: r.best_score ?? 0, last: r.last_score ?? 0, attempts: r.attempts ?? 0 }
          }
          setScores(map)
        }

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

  /**
   * Bank an exercise score for a lesson. Tracks best + last + attempts so the
   * course dashboard and teacher gradebook can show real grades. No-op for
   * signed-out users (nothing to attach the grade to).
   */
  async function saveLessonScore(lessonId: string, score: number) {
    const s = Math.max(0, Math.min(100, Math.round(score)))
    const prev = scores[lessonId] ?? { best: 0, last: 0, attempts: 0 }
    const updated: LessonScore = {
      best: Math.max(prev.best, s),
      last: s,
      attempts: prev.attempts + 1,
    }
    setScores(prevMap => ({ ...prevMap, [lessonId]: updated }))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('lesson_scores').upsert({
      user_id: user.id,
      level_id: levelId,
      lesson_id: lessonId,
      best_score: updated.best,
      last_score: updated.last,
      attempts: updated.attempts,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })
  }

  /**
   * Every level and every lesson is open to everyone — signed in or not,
   * in any order. An account is only needed to SAVE progress and scores
   * (signed-out learners still get localStorage persistence on this
   * device; the nudge in LessonsList sells the account for cloud sync).
   */
  function isLessonUnlocked(_lessonId: string, _lessonOrder: number): boolean {
    return true
  }

  function isLessonCompleted(lessonId: string): boolean {
    return progress.completedLessons.includes(lessonId)
  }

  const completedCount = progress.completedLessons.length

  return { progress, scores, completedCount, isLessonUnlocked, isLessonCompleted, completeLesson, saveLessonScore, loaded, isAdmin, isAuthed }
}
