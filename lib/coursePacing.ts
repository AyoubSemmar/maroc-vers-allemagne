// Weekly pacing for live-class cohorts. The group's start_date anchors a
// 2-lessons-per-week rhythm; the dashboard highlights "this week's" lessons
// and dims future ones. Soft pacing only — nothing is ever locked, fast
// students can work ahead. UTC date math to match lib/courseAccess.

export const LESSONS_PER_WEEK = 2

/**
 * 1-based course week for a cohort. Returns:
 *  - null  → no start_date set (no pacing),
 *  - 0     → cohort starts in the future,
 *  - n ≥ 1 → current week number.
 */
export function courseWeek(startDate: string | null | undefined): number | null {
  if (!startDate) return null
  const [y, m, d] = startDate.slice(0, 10).split('-').map(Number)
  const start = Date.UTC(y, m - 1, d)
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const diffDays = Math.floor((today - start) / 86_400_000)
  if (diffDays < 0) return 0
  return Math.floor(diffDays / 7) + 1
}

/** Inclusive lesson-order range [first, last] scheduled for a given week. */
export function weekLessonRange(week: number): [number, number] {
  return [(week - 1) * LESSONS_PER_WEEK + 1, week * LESSONS_PER_WEEK]
}
