'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { LevelId } from './german-data/types'
import { nextMastery, VOCAB_LEARNED_THRESHOLD } from './learn-german/vocab'

export type VocabStat = { mastery: number; seen: number; correct: number }
type ProgressMap = Record<string, VocabStat>

/**
 * Per-word vocab mastery for one level. Loads the student's `vocab_progress`
 * rows, exposes a learned count for the dashboard meter, and persists each
 * answer (Leitner box up/down). Signed-out users get an in-memory session
 * only — nothing to attach progress to.
 */
export function useVocabProgress(levelId: LevelId) {
  const [byKey, setByKey] = useState<ProgressMap>({})
  const [loaded, setLoaded] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let active = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('vocab_progress')
          .select('word_key, mastery, seen, correct')
          .eq('user_id', user.id)
          .eq('level_id', levelId)
        if (active && data) {
          const map: ProgressMap = {}
          for (const r of data) {
            map[r.word_key] = { mastery: r.mastery ?? 0, seen: r.seen ?? 0, correct: r.correct ?? 0 }
          }
          setByKey(map)
        }
      }
      if (active) setLoaded(true)
    }
    load()
    return () => { active = false }
  }, [levelId])

  async function recordAnswer(key: string, correct: boolean) {
    const prev = byKey[key] ?? { mastery: 0, seen: 0, correct: 0 }
    const updated: VocabStat = {
      mastery: nextMastery(prev.mastery, correct),
      seen: prev.seen + 1,
      correct: prev.correct + (correct ? 1 : 0),
    }
    setByKey(prevMap => ({ ...prevMap, [key]: updated }))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('vocab_progress').upsert({
      user_id: user.id,
      word_key: key,
      level_id: levelId,
      mastery: updated.mastery,
      seen: updated.seen,
      correct: updated.correct,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,word_key' })
  }

  const learnedCount = Object.values(byKey).filter(s => s.mastery >= VOCAB_LEARNED_THRESHOLD).length

  return { byKey, learnedCount, recordAnswer, loaded }
}
