import type { Level, VocabItem } from '@/lib/german-data/types'

/** mastery (Leitner box) at or above this counts as "learned" for the meter.
 *  Was 3, but combined with round-building only reviewing ~half of each
 *  round, a word needed several rounds before ever showing up as "learned" —
 *  from the student's view the counter looked stuck at 0 even though every
 *  answer was saving correctly. 2 correct answers is still a real signal
 *  (not a single lucky guess) while making progress visible much sooner. */
export const VOCAB_LEARNED_THRESHOLD = 2

/** Stable id for a vocab item, e.g. "A1:der Tisch". German is unique enough
 *  within a level; the level prefix keeps keys distinct across levels. */
export function wordKey(levelId: string, german: string): string {
  return `${levelId}:${german}`
}

export type VocabEntry = { item: VocabItem; key: string }

/** All unique vocab in a level (deduped by German across lessons). */
export function collectLevelVocab(level: Level): VocabEntry[] {
  const seen = new Set<string>()
  const out: VocabEntry[] = []
  for (const lesson of level.lessons) {
    for (const item of lesson.vocabulary) {
      const key = wordKey(level.id, item.german)
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ item, key })
    }
  }
  return out
}

/** Leitner update: a correct recall promotes one box (cap 5); a miss demotes
 *  one box (floor 0) so a word the student forgot resurfaces sooner. */
export function nextMastery(prev: number, correct: boolean): number {
  return correct ? Math.min(5, prev + 1) : Math.max(0, prev - 1)
}
