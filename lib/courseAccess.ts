// Shared course-access date logic. A live-class booking grants access while
// its access_until date is today or later; a lapsed date locks the student out
// (they see the renewal screen) until the admin extends it another month.
//
// access_until is a plain 'YYYY-MM-DD' (Postgres date). We compare it against
// today's UTC date string so the server (UTC) and the browser evaluate access
// identically, avoiding a locale/timezone split near midnight.

/** Today as 'YYYY-MM-DD' in UTC. */
function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** True while the booking's access_until is today or in the future. */
export function isAccessActive(accessUntil: string | null | undefined): boolean {
  if (!accessUntil) return false
  return accessUntil.slice(0, 10) >= todayIso()
}

/**
 * Whole days until access lapses: > 0 upcoming, 0 today, < 0 already expired,
 * null when no date is set (never paid).
 */
export function accessDaysLeft(accessUntil: string | null | undefined): number | null {
  if (!accessUntil) return null
  const [y, m, d] = accessUntil.slice(0, 10).split('-').map(Number)
  const until = Date.UTC(y, m - 1, d)
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((until - today) / 86_400_000)
}

/** Add n whole months to a 'YYYY-MM-DD' date, returning 'YYYY-MM-DD' (UTC). */
export function addMonths(accessUntil: string, n: number): string {
  const [y, m, d] = accessUntil.slice(0, 10).split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCMonth(dt.getUTCMonth() + n)
  return dt.toISOString().slice(0, 10)
}

/**
 * The date a grant/renew should extend TO: one month past whichever is later —
 * today or the current (still-valid) expiry — so renewing early stacks the
 * remaining days instead of throwing them away.
 */
export function nextAccessUntil(current: string | null | undefined): string {
  const today = todayIso()
  const base = current && current.slice(0, 10) > today ? current.slice(0, 10) : today
  return addMonths(base, 1)
}

/** Format 'YYYY-MM-DD' for display (default fr-FR → DD/MM/YYYY), UTC-stable. */
export function formatAccessDate(accessUntil: string, locale = 'fr-FR'): string {
  const [y, m, d] = accessUntil.slice(0, 10).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  })
}
