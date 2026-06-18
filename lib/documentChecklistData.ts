// Document Checklist Generator — pure data + filter logic.
//
// Country-aware: requirements for a German national (D) visa differ by
// the applicant's country of origin in three decision-critical ways:
//   1. APS certificate — only required for some countries (China, India,
//      Vietnam, Mongolia, Pakistan, Bangladesh as of 2022+).
//   2. Document authentication — Hague-apostille ONLY where Germany
//      accepts it. NB: "joined the Hague Convention" is not enough —
//      Germany objected to several accessions (e.g. Morocco), so those
//      countries still need full consular legalization by the German
//      mission. We model the *effective* method per country.
//   3. Cost + timeline of those steps.
//
// All costs are EUR ranges (the universal anchor for a Germany-bound
// process — Sperrkonto, visa fee etc. are set in EUR). Origin-side civil
// costs vary locally and are best-effort estimates; the UI shows a
// "verify with the German mission" disclaimer.
//
// Germany-side facts (country-independent):
//   - Sperrkonto: €992/month × 12 = €11,904 (BAMF 2026)
//   - National D-visa fee €75 (BMI Schedule 2025)
//   - APS fees: India ~€225, China ~€340, Vietnam ~€140 (official APS)

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

// ── Country dimension ───────────────────────────────────────────────
export type CountryKey =
  | 'ma' | 'dz' | 'tn' | 'eg' | 'ng'      // Africa / MENA
  | 'in' | 'cn' | 'vn' | 'pk'             // Asia (APS-heavy)
  | 'tr' | 'ph' | 'br'                    // Turkey, Philippines, Brazil
  | 'other'                              // generic fallback

/** Document-authentication method Germany accepts FROM this country. */
export type AuthMethod = 'apostille' | 'legalization'

export type CountryRule = {
  /** Localised display names. */
  name: { ar: string; fr: string; en: string; de: string; es: string }
  flag: string
  /** apostille (Hague + Germany accepts) OR full consular legalization. */
  auth: AuthMethod
  /** Per-document authentication fee, EUR [min,max]. */
  authFeeEur: [number, number]
  /** Extra days the authentication step adds (sequential bottleneck). */
  authDays: [number, number]
  /** Sworn translation, EUR per A4 page [min,max]. */
  translationPerPageEur: [number, number]
  /** Does this country require the APS certificate for Studium? */
  apsRequired: boolean
  /** APS fee EUR [min,max] (only used when apsRequired). */
  apsFeeEur: [number, number]
  /** i18n key for a short country-specific note (documentChecklist.countryNote.<key>). */
  noteKey?: string
}

// Best-verified as of Q2 2026. The single source of truth — correct a
// value here and the whole tool updates. apsRequired list per APS/DAAD;
// auth method reflects whether Germany accepts apostille from the country
// (not merely Hague membership).
export const COUNTRIES: Record<CountryKey, CountryRule> = {
  ma: { name: { ar: 'المغرب', fr: 'Maroc', en: 'Morocco', de: 'Marokko', es: 'Marruecos' }, flag: '🇲🇦',
        auth: 'legalization', authFeeEur: [30, 80], authDays: [21, 42], translationPerPageEur: [15, 30],
        apsRequired: false, apsFeeEur: [0, 0], noteKey: 'ma' },
  dz: { name: { ar: 'الجزائر', fr: 'Algérie', en: 'Algeria', de: 'Algerien', es: 'Argelia' }, flag: '🇩🇿',
        auth: 'legalization', authFeeEur: [30, 80], authDays: [21, 42], translationPerPageEur: [20, 45],
        apsRequired: false, apsFeeEur: [0, 0] },
  tn: { name: { ar: 'تونس', fr: 'Tunisie', en: 'Tunisia', de: 'Tunesien', es: 'Túnez' }, flag: '🇹🇳',
        auth: 'legalization', authFeeEur: [30, 80], authDays: [21, 42], translationPerPageEur: [20, 45],
        apsRequired: false, apsFeeEur: [0, 0] },
  eg: { name: { ar: 'مصر', fr: 'Égypte', en: 'Egypt', de: 'Ägypten', es: 'Egipto' }, flag: '🇪🇬',
        auth: 'legalization', authFeeEur: [40, 100], authDays: [28, 56], translationPerPageEur: [20, 50],
        apsRequired: false, apsFeeEur: [0, 0] },
  ng: { name: { ar: 'نيجيريا', fr: 'Nigéria', en: 'Nigeria', de: 'Nigeria', es: 'Nigeria' }, flag: '🇳🇬',
        auth: 'legalization', authFeeEur: [40, 120], authDays: [28, 70], translationPerPageEur: [25, 60],
        apsRequired: false, apsFeeEur: [0, 0], noteKey: 'legalizationSlow' },
  in: { name: { ar: 'الهند', fr: 'Inde', en: 'India', de: 'Indien', es: 'India' }, flag: '🇮🇳',
        auth: 'apostille', authFeeEur: [3, 15], authDays: [7, 21], translationPerPageEur: [20, 50],
        apsRequired: true, apsFeeEur: [225, 225], noteKey: 'aps' },
  cn: { name: { ar: 'الصين', fr: 'Chine', en: 'China', de: 'China', es: 'China' }, flag: '🇨🇳',
        auth: 'apostille', authFeeEur: [10, 40], authDays: [7, 21], translationPerPageEur: [25, 60],
        apsRequired: true, apsFeeEur: [340, 340], noteKey: 'aps' },
  vn: { name: { ar: 'فيتنام', fr: 'Vietnam', en: 'Vietnam', de: 'Vietnam', es: 'Vietnam' }, flag: '🇻🇳',
        auth: 'legalization', authFeeEur: [20, 60], authDays: [21, 42], translationPerPageEur: [20, 50],
        apsRequired: true, apsFeeEur: [140, 140], noteKey: 'aps' },
  pk: { name: { ar: 'باكستان', fr: 'Pakistan', en: 'Pakistan', de: 'Pakistan', es: 'Pakistán' }, flag: '🇵🇰',
        auth: 'legalization', authFeeEur: [20, 70], authDays: [21, 49], translationPerPageEur: [20, 50],
        apsRequired: true, apsFeeEur: [100, 200], noteKey: 'aps' },
  tr: { name: { ar: 'تركيا', fr: 'Turquie', en: 'Turkey', de: 'Türkei', es: 'Turquía' }, flag: '🇹🇷',
        auth: 'apostille', authFeeEur: [5, 25], authDays: [3, 14], translationPerPageEur: [15, 40],
        apsRequired: false, apsFeeEur: [0, 0] },
  ph: { name: { ar: 'الفلبين', fr: 'Philippines', en: 'Philippines', de: 'Philippinen', es: 'Filipinas' }, flag: '🇵🇭',
        auth: 'apostille', authFeeEur: [3, 15], authDays: [7, 21], translationPerPageEur: [20, 45],
        apsRequired: false, apsFeeEur: [0, 0] },
  br: { name: { ar: 'البرازيل', fr: 'Brésil', en: 'Brazil', de: 'Brasilien', es: 'Brasil' }, flag: '🇧🇷',
        auth: 'apostille', authFeeEur: [10, 30], authDays: [3, 14], translationPerPageEur: [25, 60],
        apsRequired: false, apsFeeEur: [0, 0] },
  other: { name: { ar: 'بلد آخر', fr: 'Autre pays', en: 'Other country', de: 'Anderes Land', es: 'Otro país' }, flag: '🌍',
        auth: 'legalization', authFeeEur: [30, 100], authDays: [21, 56], translationPerPageEur: [20, 60],
        apsRequired: false, apsFeeEur: [0, 0], noteKey: 'generic' },
}

export const COUNTRY_ORDER: CountryKey[] = [
  'ma', 'dz', 'tn', 'eg', 'ng', 'tr', 'in', 'cn', 'vn', 'pk', 'ph', 'br', 'other',
]

export type ChecklistInput = {
  country: CountryKey
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
  /** Intrinsic cost of obtaining the doc, EUR [min,max]; [0,0] = free. Excludes auth + translation. */
  costEur: [number, number]
  timelineDays: [number, number]
  /** Doc must be authenticated (apostille/legalization) for use in Germany. */
  needsAuth: boolean
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
  { id: 'passport',           category: 'identity', costEur: [40, 90],  timelineDays: [14, 28], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'biometric_photos',   category: 'identity', costEur: [5, 15],   timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'birth_certificate',  category: 'identity', costEur: [2, 15],   timelineDays: [1, 3],   needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: ALWAYS },
  { id: 'police_clearance',   category: 'identity', costEur: [5, 40],   timelineDays: [3, 10],  needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: ALWAYS },
  { id: 'marriage_certificate', category: 'identity', costEur: [2, 15], timelineDays: [1, 3],   needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 1, applies: (i) => !!i.bringFamily && (i.family === 'married' || i.family === 'married_kids') },
  { id: 'children_birth_certs', category: 'identity', costEur: [4, 20], timelineDays: [1, 3],   needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 2, applies: (i) => !!i.bringFamily && i.family === 'married_kids' },

  // ── 2. ACADEMIC ────────────────────────────────────────────────
  { id: 'bac_diploma',        category: 'academic', costEur: [0, 15],   timelineDays: [7, 14],  needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 1, applies: ALWAYS },
  { id: 'bac_transcripts',    category: 'academic', costEur: [0, 15],   timelineDays: [7, 14],  needsAuth: true,  needsSwornTranslation: true,  mandatory: true,  translationPages: 2, applies: ALWAYS },
  { id: 'higher_ed_diploma',  category: 'academic', costEur: [10, 50],  timelineDays: [14, 28], needsAuth: true,  needsSwornTranslation: true,  mandatory: false, translationPages: 1, applies: (i) => i.education !== 'bac' },
  { id: 'higher_ed_transcripts', category: 'academic', costEur: [10, 50], timelineDays: [14, 28], needsAuth: true, needsSwornTranslation: true, mandatory: false, translationPages: 3, applies: (i) => i.education !== 'bac' },
  { id: 'aps_certificate',    category: 'academic', costEur: [0, 0],    timelineDays: [42, 140], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: (i) => isStud(i) && !i.apsDone && COUNTRIES[i.country].apsRequired },
  { id: 'anabin_check',       category: 'academic', costEur: [0, 0],    timelineDays: [0, 1],   needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: ALWAYS },
  { id: 'studienkolleg',      category: 'academic', costEur: [0, 20],   timelineDays: [28, 56], needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: (i) => isStud(i) && i.education === 'bac' },

  // ── 3. LANGUAGE ───────────────────────────────────────────────
  { id: 'german_b1',          category: 'language', costEur: [150, 280], timelineDays: [42, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: (i) => isAusb(i) && !i.hasGermanCert },
  { id: 'german_b2',          category: 'language', costEur: [180, 320], timelineDays: [42, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: (i) => isStud(i) && !i.hasGermanCert },

  // ── 4. APPLICATION (CV / motivation / form) ────────────────────
  { id: 'visa_application_form', category: 'application', costEur: [0, 0], timelineDays: [0, 1], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
  { id: 'cv_german',          category: 'application', costEur: [0, 0],  timelineDays: [0, 1], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },
  { id: 'motivation_letter',  category: 'application', costEur: [0, 0],  timelineDays: [0, 1], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: ALWAYS },

  // ── 5. EMPLOYER (Ausbildung) / UNIVERSITY (Studium) ─────────────
  { id: 'ausbildungsvertrag', category: 'employer', costEur: [0, 0],   timelineDays: [7, 30],   needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isAusb },
  { id: 'taetigkeitsbeschreibung', category: 'employer', costEur: [0, 0], timelineDays: [3, 10], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: isAusb },
  { id: 'vorab_zustimmung',   category: 'employer', costEur: [0, 0],   timelineDays: [14, 28],  needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: (i) => isAusb(i) && i.vorab === true },
  { id: 'university_admission', category: 'university', costEur: [0, 0], timelineDays: [28, 84], needsAuth: false, needsSwornTranslation: false, mandatory: true,  applies: isStud },

  // ── 6. FINANCIAL ──────────────────────────────────────────────
  { id: 'sperrkonto',         category: 'financial', costEur: [89, 150], timelineDays: [7, 14], needsAuth: false, needsSwornTranslation: false, mandatory: true,
    applies: (i) => isStud(i) || isAusb(i) },
  { id: 'verpflichtungserklaerung', category: 'financial', costEur: [29, 29], timelineDays: [7, 14], needsAuth: false, needsSwornTranslation: false, mandatory: false, alternativeTo: 'sperrkonto',
    applies: (i) => isStud(i) || isAusb(i) },
  { id: 'bank_statements',    category: 'financial', costEur: [5, 15], timelineDays: [1, 3], needsAuth: false, needsSwornTranslation: false, mandatory: false, applies: ALWAYS },

  // ── 7. HEALTH & ACCOMMODATION ─────────────────────────────────
  { id: 'travel_health_insurance', category: 'health', costEur: [30, 90], timelineDays: [0, 1], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
  { id: 'accommodation_proof', category: 'housing', costEur: [0, 150], timelineDays: [7, 14], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },

  // ── 8. VISA PROCEDURE ─────────────────────────────────────────
  { id: 'visa_appointment',   category: 'visa_procedure', costEur: [0, 40], timelineDays: [30, 90], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
  { id: 'visa_fee',           category: 'visa_procedure', costEur: [75, 75], timelineDays: [0, 1], needsAuth: false, needsSwornTranslation: false, mandatory: true, applies: ALWAYS },
]

export type CalcResult = {
  applicableDocs: Doc[]
  byCategory: Record<CategoryKey, Doc[]>
  totalDocs: number
  /** Doc costs themselves (EUR) */
  baseCostEur: [number, number]
  /** Sum of authentication fees (apostille/legalization), EUR */
  authCostEur: [number, number]
  authCount: number
  /** Which method applies for the chosen country. */
  authMethod: AuthMethod
  /** Sum of translation fees (pages × per-page rate), EUR */
  translationCostEur: [number, number]
  translationPages: number
  /** APS fee (EUR) if applicable, else [0,0] */
  apsCostEur: [number, number]
  /** Grand total cost in EUR */
  totalCostEur: [number, number]
  /** Longest single document timeline (sequential bottleneck) */
  longestTimelineDays: [number, number]
  /** Realistic end-to-end timeline accounting for parallelizable work */
  realisticTimelineWeeks: [number, number]
}

export function calculate(input: ChecklistInput): CalcResult {
  const country = COUNTRIES[input.country] ?? COUNTRIES.other
  const applicableDocs = DOCUMENTS.filter(d => d.applies(input))
  const byCategory = applicableDocs.reduce<Record<CategoryKey, Doc[]>>((acc, d) => {
    (acc[d.category] = acc[d.category] || []).push(d)
    return acc
  }, {} as Record<CategoryKey, Doc[]>)

  const sumRange = (arr: [number, number][]): [number, number] =>
    arr.reduce<[number, number]>((acc, [lo, hi]) => [acc[0] + lo, acc[1] + hi], [0, 0])

  const baseCostEur = sumRange(applicableDocs.map(d => d.costEur))

  // Authentication (apostille or consular legalization), per applicable doc.
  const authCount = applicableDocs.filter(d => d.needsAuth).length
  const authCostEur: [number, number] = [
    authCount * country.authFeeEur[0],
    authCount * country.authFeeEur[1],
  ]

  const translationPages = applicableDocs.reduce((s, d) => s + (d.translationPages || 0), 0)
  const translationCostEur: [number, number] = [
    translationPages * country.translationPerPageEur[0],
    translationPages * country.translationPerPageEur[1],
  ]

  // APS fee — only when the APS doc is actually in scope.
  const apsInScope = applicableDocs.some(d => d.id === 'aps_certificate')
  const apsCostEur: [number, number] = apsInScope ? country.apsFeeEur : [0, 0]

  const totalCostEur: [number, number] = [
    baseCostEur[0] + authCostEur[0] + translationCostEur[0] + apsCostEur[0],
    baseCostEur[1] + authCostEur[1] + translationCostEur[1] + apsCostEur[1],
  ]

  // Longest single doc timeline (the sequential bottleneck). The auth
  // step stretches every authenticated doc, so fold the country's auth
  // days into the bottleneck.
  const docBottleneck = applicableDocs.reduce<[number, number]>(
    (acc, d) => {
      const extra: [number, number] = d.needsAuth ? country.authDays : [0, 0]
      return [Math.max(acc[0], d.timelineDays[0] + extra[0]), Math.max(acc[1], d.timelineDays[1] + extra[1])]
    },
    [0, 0],
  )

  const realisticTimelineWeeks: [number, number] = [
    Math.ceil((docBottleneck[0] * 1.2) / 7),
    Math.ceil((docBottleneck[1] * 1.4) / 7),
  ]

  return {
    applicableDocs,
    byCategory,
    totalDocs: applicableDocs.length,
    baseCostEur,
    authCostEur,
    authCount,
    authMethod: country.auth,
    translationCostEur,
    translationPages,
    apsCostEur,
    totalCostEur,
    longestTimelineDays: docBottleneck,
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
