// When a class group's video call is joinable. Window: from 15 min before the
// start time until the class END time (so a student who drops mid-class can
// always rejoin), on the group's class days, in Morocco time.
// Africa/Casablanca via Intl handles the UTC+1 / Ramadan-UTC+0 shifts without
// us hardcoding an offset.
export const CASABLANCA_TZ = 'Africa/Casablanca'
export const OPEN_BEFORE_MIN = 15
/** Fallback class length when the schedule has no end time. */
export const DEFAULT_CLASS_MIN = 90

export type ClassWindow = { startHour: number; startMin: number; endHour: number; endMin: number; days: number[] }

const DAY_TOKENS: Record<string, number> = {
  dim: 0, sun: 0, lun: 1, mon: 1, mar: 2, tue: 2, mer: 3, wed: 3,
  jeu: 4, thu: 4, ven: 5, fri: 5, sam: 6, sat: 6,
}

/** Class days from the schedule text: ranges first ("Lun-Ven", "Sam-Dim"),
 *  then individual day tokens ("Lun/Mer/Ven 16:00-17:30" → [1,3,5]). */
function parseDays(schedule: string, groupId: string): number[] {
  const s = schedule.toLowerCase()
  if (/lun\s*-\s*ven|mon\s*-\s*fri/.test(s)) return [1, 2, 3, 4, 5]
  if (/sam\s*-\s*dim|sat\s*-\s*sun/.test(s) || /weekend/i.test(groupId)) return [6, 0]
  const days = [...new Set(
    Object.entries(DAY_TOKENS).filter(([tok]) => s.includes(tok)).map(([, d]) => d),
  )].sort((a, b) => a - b)
  return days.length ? days : [1, 2, 3, 4, 5]
}

/** Derive start/end time + class days from a group's schedule text + id.
 *  schedule e.g. "Lun/Mer/Ven 16:00-17:30" / "Lun-Ven 16:00-17:00". */
export function parseClassWindow(schedule: string | null, groupId: string): ClassWindow {
  const times = [...(schedule || '').matchAll(/(\d{1,2}):(\d{2})/g)]
  const startHour = times[0] ? Number(times[0][1]) : 0
  const startMin = times[0] ? Number(times[0][2]) : 0
  const endTotal = times[1]
    ? Number(times[1][1]) * 60 + Number(times[1][2])
    : startHour * 60 + startMin + DEFAULT_CLASS_MIN
  return {
    startHour,
    startMin,
    endHour: Math.floor(endTotal / 60) % 24,
    endMin: endTotal % 60,
    days: parseDays(schedule || '', groupId),
  }
}

/** Current wall-clock minutes-of-day + weekday (0=Sun) in Morocco. */
export function casablancaNow(now: Date = new Date()): { minutes: number; weekday: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CASABLANCA_TZ, hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit',
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value || ''
  const hour = Number(get('hour')) % 24
  const minute = Number(get('minute'))
  const wd: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return { minutes: hour * 60 + minute, weekday: wd[get('weekday')] ?? now.getDay() }
}

function fmt(min: number): string {
  const h = Math.floor(((min % 1440) + 1440) % 1440 / 60)
  const m = ((min % 60) + 60) % 60
  return `${h}h${String(m).padStart(2, '0')}`
}

export function callWindowState(w: ClassWindow, now: Date = new Date()): {
  open: boolean
  opensAtLabel: string
  closesAtLabel: string
} {
  const { minutes, weekday } = casablancaNow(now)
  const start = w.startHour * 60 + w.startMin
  const openMin = start - OPEN_BEFORE_MIN
  // Open until the class ends, so a dropped connection can always rejoin.
  const closeMin = w.endHour * 60 + w.endMin
  const open = w.days.includes(weekday) && minutes >= openMin && minutes <= closeMin
  return { open, opensAtLabel: fmt(openMin), closesAtLabel: fmt(closeMin) }
}
