// When a class group's video call is joinable. Window: from 15 min before the
// start time until 30 min after it (e.g. a 16:00 class is open 15:45–16:30),
// on the group's class days, in Morocco time. Africa/Casablanca via Intl
// handles the UTC+1 / Ramadan-UTC+0 shifts without us hardcoding an offset.
export const CASABLANCA_TZ = 'Africa/Casablanca'
export const OPEN_BEFORE_MIN = 15
export const CLOSE_AFTER_MIN = 30

export type ClassWindow = { startHour: number; startMin: number; days: number[] }

/** Derive start time + class days from a group's schedule text + id.
 *  schedule e.g. "Lun-Ven 16:00-17:00" / "Sam-Dim 16:00-19:00". */
export function parseClassWindow(schedule: string | null, groupId: string): ClassWindow {
  const m = (schedule || '').match(/(\d{1,2}):(\d{2})/)
  const startHour = m ? Number(m[1]) : 0
  const startMin = m ? Number(m[2]) : 0
  const isWeekend = /weekend/i.test(groupId) || /sam|dim|sat|sun/i.test(schedule || '')
  return { startHour, startMin, days: isWeekend ? [6, 0] : [1, 2, 3, 4, 5] }
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
  const closeMin = start + CLOSE_AFTER_MIN
  const open = w.days.includes(weekday) && minutes >= openMin && minutes <= closeMin
  return { open, opensAtLabel: fmt(openMin), closesAtLabel: fmt(closeMin) }
}
