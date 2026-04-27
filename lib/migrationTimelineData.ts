// Germany Migration Timeline Calculator — pure logic + lookup tables.
// All values are months. Sources: DAAD pre-arrival guide, BAMF visa
// processing averages 2025, ZAB recognition timelines, plus the
// goausbildung playbook for Vorab approval.

export type PathKey = 'ausbildung' | 'studium'
export type LevelKey = 'A0' | 'A1' | 'A2' | 'B1' | 'B2'
export type IntensityKey = 'slow' | 'normal' | 'intensive'
export type EducationKey = 'bac' | 'university' | 'other'

export const LEVEL_ORDER: LevelKey[] = ['A0', 'A1', 'A2', 'B1', 'B2']

// Months it takes to climb one level. [min, max].
const STEP_MONTHS: Record<string, [number, number]> = {
  'A0->A1': [1, 2],
  'A1->A2': [2, 3],
  'A2->B1': [3, 5],
  'B1->B2': [4, 6],
}

const INTENSITY_MULT: Record<IntensityKey, number> = {
  intensive: 0.7,
  normal: 1.0,
  slow: 1.3,
}

// Target German level by path.
export const TARGET_LEVEL: Record<PathKey, LevelKey> = {
  ausbildung: 'B1',
  studium:    'B2',
}

export type Range = { min: number; max: number; avg: number }
const r = (min: number, max: number): Range => ({ min, max, avg: (min + max) / 2 })

export type CalcInput = {
  path: PathKey
  currentLevel: LevelKey
  intensity: IntensityKey
  education: EducationKey
  /** Only meaningful when path === 'ausbildung'. */
  vorab?: boolean
}

export type Phase = {
  key: 'german' | 'application' | 'visa' | 'relocation'
  range: Range
  /** Optional sub-detail (e.g. "Target: B1"). */
  detail?: string
}

export type CalcResult = {
  phases: Phase[]
  totalFast: number
  totalAverage: number
  totalSlow: number
  insights: string[]
  tips: string[]
}

function germanLearningMonths(current: LevelKey, target: LevelKey, intensity: IntensityKey): Range {
  const fromIdx = LEVEL_ORDER.indexOf(current)
  const toIdx = LEVEL_ORDER.indexOf(target)
  if (toIdx <= fromIdx) return r(0, 0)
  let min = 0, max = 0
  for (let i = fromIdx; i < toIdx; i++) {
    const step = STEP_MONTHS[`${LEVEL_ORDER[i]}->${LEVEL_ORDER[i + 1]}`]
    min += step[0]
    max += step[1]
  }
  const m = INTENSITY_MULT[intensity]
  return r(Math.round(min * m * 10) / 10, Math.round(max * m * 10) / 10)
}

export function calculate(input: CalcInput): CalcResult {
  const target = TARGET_LEVEL[input.path]
  const german = germanLearningMonths(input.currentLevel, target, input.intensity)

  let application: Range, visa: Range, relocation: Range
  if (input.path === 'ausbildung') {
    application = r(2, 6)
    visa = input.vorab ? r(2, 3) : r(6, 10)
    relocation = r(1, 2)
  } else {
    application = r(4, 8)
    visa = r(6, 10)
    relocation = r(1, 2)
  }

  const phases: Phase[] = [
    { key: 'german',      range: german,      detail: `${input.currentLevel} → ${target}` },
    { key: 'application', range: application },
    { key: 'visa',        range: visa, detail: input.path === 'ausbildung' ? (input.vorab ? 'Vorab ✓' : 'Without Vorab') : undefined },
    { key: 'relocation',  range: relocation },
  ]

  const totalFast = phases.reduce((s, p) => s + p.range.min, 0)
  const totalSlow = phases.reduce((s, p) => s + p.range.max, 0)
  const totalAverage = phases.reduce((s, p) => s + p.range.avg, 0)

  // ── Insights & tips ────────────────────────────────────────
  const insights: string[] = []
  const tips: string[] = []

  if (LEVEL_ORDER.indexOf(input.currentLevel) <= LEVEL_ORDER.indexOf('A1')) {
    insights.push('lowGerman')
    tips.push('intensiveCourse')
  }
  if (input.path === 'ausbildung' && !input.vorab) {
    insights.push('noVorab')
    tips.push('getVorab')
  }
  if (input.intensity === 'slow') {
    insights.push('slowPace')
    tips.push('switchPace')
  }
  if (input.path === 'studium') {
    insights.push('studyDocs')
    tips.push('uniAssistEarly')
  }
  // Always-on universal tips
  tips.push('startDocs')
  tips.push('bookConsult')

  return { phases, totalFast, totalAverage, totalSlow, insights, tips }
}

// Pretty-print months as "X.Y" with at most 1 decimal, dropping trailing .0.
export function fmtMonths(n: number): string {
  const r = Math.round(n * 10) / 10
  return r % 1 === 0 ? String(r) : r.toFixed(1)
}
