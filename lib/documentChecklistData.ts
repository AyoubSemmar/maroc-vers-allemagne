// Document Checklist Generator — pure data + filter logic.
//
// Sources (cross-checked Q1 2026):
// - German missions' standard national-visa document lists
// - APS (Akademische Prüfstelle) fee schedule
// - Goethe-Institut fee schedule
// - Sperrkonto requirement: €992/month × 12 = €11,904 (BAMF 2026)
// - National D-visa fee €75 (BMI Schedule 2025)
//
// Origin-country fees vary worldwide. Internal cost figures are stored in a
// single base unit and converted to rough EUR estimates via EUR_PER_BASE for
// display; only the fixed German-side costs (Sperrkonto, D-visa fee) are exact.

export const EUR_TO_MAD = 10.7  // base-unit → EUR divisor (rough estimate)

export type PathKey = 'ausbildung' | 'studium'
export type EducationKey = 'bac' | 'bac_plus_2' | 'bac_plus_3' | 'bac_plus_5'
export type FamilyKey = 'single' | 'married' | 'married_kids'
export type CategoryKey =
  | 'identity'
  | 'academic'
  | 'language'
  | 'application'
  | 'employer'
  | 'university'
  | 'financial'
  | 'health'
  | 'housing'
  | 'visa_procedure'

export type ChecklistInput = {
  path: PathKey
  education: EducationKey
  family: FamilyKey
  vorab?: boolean         // ausbildung only
  apsDone?: boolean       // studium only — if false, document is required
  hasGermanCert?: boolean // already passed B1/B2 → don't add to cost
  bringFamily?: boolean   // brings spouse/kids — adds family-reunification docs
}

export type Doc = {
  id: string
  category: CategoryKey
  costMad: [number, number]  // [min, max] in MAD; [0, 0] means free
  timelineDays: [number, number]
  needsApostille: boolean
  needsSwornTranslation: boolean
  /** Mandatory for the path even if optional flags are true */
  mandatory: boolean
  /** ID of an alternative document — show as "or" pair */
  alternativeTo?: string
  /** Pages typically needing sworn translation (used for total-cost calc). 0 if no translation. */
  translationPages?: number
  /** When does this document apply, given the user's input? */
  applies(input: ChecklistInput): boolean
}

const ALWAYS = () => true
const isAusb = (i: ChecklistInput) => i.path === 'ausbildung'
const isStud = (i: ChecklistInput) => i.path === 'studium'

export const DOCUMENTS: Doc[] = [
  // ── 1. IDENTITY & CIVIL STATUS ─────────────────────────────────
  { id: 'passport',           category: 'identity', costMad: [500, 600],  timelineDays: [14, 28], needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'biometric_photos',   category: 'identity', costMad: [50, 100],   timelineDays: [0, 1],   needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'birth_certificate',  category: 'identity', costMad: [10, 30],    timelineDays: [1, 3],   needsApostille: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: ALWAYS },
  { id: 'police_clearance',   category: 'identity', costMad: [30, 50],    timelineDays: [3, 10],  needsApostille: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: ALWAYS },
  { id: 'marriage_certificate', category: 'identity', costMad: [10, 30],  timelineDays: [1, 3],   needsApostille: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 1, applies: (i) => !!i.bringFamily && (i.family === 'married' || i.family === 'married_kids') },
  { id: 'children_birth_certs', category: 'identity', costMad: [20, 60],  timelineDays: [1, 3],   needsApostille: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 2, applies: (i) => !!i.bringFamily && i.family === 'married_kids' },

  // ── 2. ACADEMIC ────────────────────────────────────────────────
  { id: 'bac_diploma',        category: 'academic', costMad: [0, 100],    timelineDays: [7, 14],  needsApostille: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: ALWAYS },
  { id: 'bac_transcripts',    category: 'academic', costMad: [0, 100],    timelineDays: [7, 14],  needsApostille: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 2, applies: ALWAYS },
  { id: 'higher_ed_diploma',  category: 'academic', costMad: [100, 500],  timelineDays: [14, 28], needsApostille: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 1, applies: (i) => i.education !== 'bac' },
  { id: 'higher_ed_transcripts', category: 'academic', costMad: [100, 500], timelineDays: [14, 28], needsApostille: true, needsSwornTranslation: true, mandatory: false, translationPages: 3, applies: (i) => i.education !== 'bac' },
  { id: 'aps_certificate',    category: 'academic', costMad: [550, 600],  timelineDays: [42, 56], needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: (i) => isStud(i) && !i.apsDone },
  { id: 'anabin_check',       category: 'academic', costMad: [0, 0],      timelineDays: [0, 1],   needsApostille: false, needsSwornTranslation: false, mandatory: false, applies: ALWAYS },
  { id: 'studienkolleg',      category: 'academic', costMad: [0, 200],    timelineDays: [28, 56], needsApostille: false, needsSwornTranslation: false, mandatory: false, applies: (i) => isStud(i) && i.education === 'bac' },

  // ── 3. LANGUAGE ───────────────────────────────────────────────
  { id: 'german_b1',          category: 'language', costMad: [1500, 2500], timelineDays: [42, 84], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: (i) => isAusb(i) && !i.hasGermanCert },
  { id: 'german_b2',          category: 'language', costMad: [2000, 3000], timelineDays: [42, 84], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: (i) => isStud(i) && !i.hasGermanCert },

  // ── 4. APPLICATION (CV / motivation / form) ────────────────────
  { id: 'visa_application_form', category: 'application', costMad: [0, 0], timelineDays: [0, 1], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
  { id: 'cv_german',          category: 'application', costMad: [0, 0],  timelineDays: [0, 1], needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'motivation_letter',  category: 'application', costMad: [0, 0],  timelineDays: [0, 1], needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },

  // ── 5. EMPLOYER (Ausbildung) / UNIVERSITY (Studium) ─────────────
  { id: 'ausbildungsvertrag', category: 'employer', costMad: [0, 0],   timelineDays: [7, 30],   needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: isAusb },
  { id: 'taetigkeitsbeschreibung', category: 'employer', costMad: [0, 0], timelineDays: [3, 10], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: isAusb },
  { id: 'vorab_zustimmung',   category: 'employer', costMad: [0, 0],   timelineDays: [14, 28],  needsApostille: false, needsSwornTranslation: false, mandatory: false, applies: (i) => isAusb(i) && i.vorab === true },
  { id: 'university_admission', category: 'university', costMad: [0, 0], timelineDays: [28, 84], needsApostille: false, needsSwornTranslation: false, mandatory: true,  applies: isStud },

  // ── 6. FINANCIAL ──────────────────────────────────────────────
  { id: 'sperrkonto',         category: 'financial', costMad: [950, 1230], timelineDays: [7, 14], needsApostille: false, needsSwornTranslation: false, mandatory: true,
    /* studium always; ausbildung if salary low — we surface as conditional but assume mandatory */
    applies: (i) => isStud(i) || isAusb(i) },
  { id: 'verpflichtungserklaerung', category: 'financial', costMad: [310, 310], timelineDays: [7, 14], needsApostille: false, needsSwornTranslation: false, mandatory: false, alternativeTo: 'sperrkonto',
    applies: (i) => isStud(i) || isAusb(i) },
  { id: 'bank_statements',    category: 'financial', costMad: [50, 100], timelineDays: [1, 3], needsApostille: false, needsSwornTranslation: false, mandatory: false, applies: ALWAYS },

  // ── 7. HEALTH & ACCOMMODATION ─────────────────────────────────
  { id: 'travel_health_insurance', category: 'health', costMad: [320, 960], timelineDays: [0, 1], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
  { id: 'accommodation_proof', category: 'housing', costMad: [0, 1600], timelineDays: [7, 14], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },

  // ── 8. VISA PROCEDURE ─────────────────────────────────────────
  { id: 'tls_appointment',    category: 'visa_procedure', costMad: [320, 430], timelineDays: [30, 90], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
  { id: 'visa_fee',           category: 'visa_procedure', costMad: [800, 800], timelineDays: [0, 1], needsApostille: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
]

// Apostille fee per document (range)
export const APOSTILLE_FEE_PER_DOC: [number, number] = [50, 100]
// Sworn translation per A4 page (range)
export const TRANSLATION_FEE_PER_PAGE: [number, number] = [150, 300]

export type CalcResult = {
  applicableDocs: Doc[]
  byCategory: Record<CategoryKey, Doc[]>
  totalDocs: number
  /** Doc costs themselves */
  baseCostMad: [number, number]
  /** Sum of apostille fees */
  apostilleCostMad: [number, number]
  apostilleCount: number
  /** Sum of translation fees (sum of pages × per-page rate) */
  translationCostMad: [number, number]
  translationPages: number
  /** Grand total cost in MAD */
  totalCostMad: [number, number]
  /** Same in EUR */
  totalCostEur: [number, number]
  /** Longest single document timeline (sequential bottleneck) */
  longestTimelineDays: [number, number]
  /** Realistic end-to-end timeline accounting for parallelizable work */
  realisticTimelineWeeks: [number, number]
}

export function calculate(input: ChecklistInput): CalcResult {
  const applicableDocs = DOCUMENTS.filter(d => d.applies(input))
  const byCategory = applicableDocs.reduce<Record<CategoryKey, Doc[]>>((acc, d) => {
    (acc[d.category] = acc[d.category] || []).push(d)
    return acc
  }, {} as Record<CategoryKey, Doc[]>)

  const sumRange = (arr: [number, number][]): [number, number] =>
    arr.reduce<[number, number]>((acc, [lo, hi]) => [acc[0] + lo, acc[1] + hi], [0, 0])

  const baseCostMad = sumRange(applicableDocs.map(d => d.costMad))

  const apostilleCount = applicableDocs.filter(d => d.needsApostille).length
  const apostilleCostMad: [number, number] = [
    apostilleCount * APOSTILLE_FEE_PER_DOC[0],
    apostilleCount * APOSTILLE_FEE_PER_DOC[1],
  ]

  const translationPages = applicableDocs.reduce((s, d) => s + (d.translationPages || 0), 0)
  const translationCostMad: [number, number] = [
    translationPages * TRANSLATION_FEE_PER_PAGE[0],
    translationPages * TRANSLATION_FEE_PER_PAGE[1],
  ]

  const totalCostMad: [number, number] = [
    baseCostMad[0] + apostilleCostMad[0] + translationCostMad[0],
    baseCostMad[1] + apostilleCostMad[1] + translationCostMad[1],
  ]
  const totalCostEur: [number, number] = [
    Math.round(totalCostMad[0] / EUR_TO_MAD),
    Math.round(totalCostMad[1] / EUR_TO_MAD),
  ]

  // Longest single doc timeline (the sequential bottleneck)
  const longestTimelineDays = applicableDocs.reduce<[number, number]>(
    (acc, d) => [Math.max(acc[0], d.timelineDays[0]), Math.max(acc[1], d.timelineDays[1])],
    [0, 0]
  )

  // Realistic estimate = bottleneck + ~30% buffer for parallel work + back-and-forth
  const realisticTimelineWeeks: [number, number] = [
    Math.ceil((longestTimelineDays[0] * 1.2) / 7),
    Math.ceil((longestTimelineDays[1] * 1.4) / 7),
  ]

  return {
    applicableDocs,
    byCategory,
    totalDocs: applicableDocs.length,
    baseCostMad,
    apostilleCostMad,
    apostilleCount,
    translationCostMad,
    translationPages,
    totalCostMad,
    totalCostEur,
    longestTimelineDays,
    realisticTimelineWeeks,
  }
}

export const CATEGORY_ORDER: CategoryKey[] = [
  'identity', 'academic', 'language', 'application',
  'employer', 'university', 'financial', 'health', 'housing', 'visa_procedure',
]

export const CATEGORY_ICON: Record<CategoryKey, string> = {
  identity: '👤',
  academic: '🎓',
  language: '🗣️',
  application: '📝',
  employer: '💼',
  university: '🏛️',
  financial: '💰',
  health: '⚕️',
  housing: '🏠',
  visa_procedure: '🛂',
}
