// Eligibility Checker — pure rules engine.
//
// Sources cross-checked Q1 2026:
// - German Residence Act (AufenthG) §16a (Ausbildung) and §16b (Studium)
// - BAMF criteria 2025 for non-EU applicants
// - APS (Akademische Prüfstelle) requirements — apply only to some countries
// - Anabin database categorisation (H+, H-, H+/-)

export type PathKey = 'ausbildung' | 'studium'
export type StudiumGoal = 'bachelor' | 'master'  // only relevant for studium
export type EducationKey = 'no_bac' | 'bac' | 'bac_plus_2' | 'bac_plus_3' | 'bac_plus_5'
export type GermanLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type FinancialKey = 'sperrkonto' | 'sponsor' | 'salary_covers' | 'family_support' | 'need_help'

export type EligibilityInput = {
  path: PathKey
  age: number
  education: EducationKey
  germanLevel: GermanLevel
  studiumGoal?: StudiumGoal     // studium only
  hasContract?: boolean         // ausbildung only — signed Ausbildungsvertrag
  hasAdmission?: boolean        // studium only — Zulassung
  hasAps?: boolean              // studium only — APS certificate
  /** Bac average on /20. Studium-only filter — ≥14/20 = direct Bachelor;
   *  12–13.99 = Studienkolleg likely required; <12 = usually doesn't qualify. */
  bacAverage?: number
  financial: FinancialKey
  passportValid12mo: boolean
  cleanRecord: boolean
  englishTaughtProgram?: boolean  // studium only — relaxes German requirement to A1
}

const LEVEL_ORDER: GermanLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']
const levelAtLeast = (current: GermanLevel, target: GermanLevel) =>
  LEVEL_ORDER.indexOf(current) >= LEVEL_ORDER.indexOf(target)

export type Status = 'pass' | 'warn' | 'fail' | 'na'
export type Category = 'language' | 'education' | 'application' | 'financial' | 'personal'

export type Rule = {
  id: string
  category: Category
  /** True if this requirement, when failed, blocks the visa. */
  blocker: boolean
  /** Higher = more important for the readiness score. */
  weight: 1 | 2 | 3
  evaluate(input: EligibilityInput): { status: Status; explainKey: string }
  appliesTo: PathKey[]
}

const RULES: Rule[] = [
  // ── Language ───────────────────────────────────────────────
  {
    id: 'german_level_ausbildung',
    category: 'language',
    blocker: true,
    weight: 3,
    appliesTo: ['ausbildung'],
    evaluate: ({ germanLevel }) => {
      if (levelAtLeast(germanLevel, 'B2')) return { status: 'pass', explainKey: 'german_level_ausbildung.b2_strong' }
      if (levelAtLeast(germanLevel, 'B1')) return { status: 'pass', explainKey: 'german_level_ausbildung.b1_min' }
      if (levelAtLeast(germanLevel, 'A2')) return { status: 'warn', explainKey: 'german_level_ausbildung.a2_close' }
      return { status: 'fail', explainKey: 'german_level_ausbildung.below' }
    },
  },
  {
    id: 'german_level_studium',
    category: 'language',
    blocker: true,
    weight: 3,
    appliesTo: ['studium'],
    evaluate: ({ germanLevel, englishTaughtProgram }) => {
      if (englishTaughtProgram) {
        if (levelAtLeast(germanLevel, 'A1')) return { status: 'pass', explainKey: 'german_level_studium.english_program' }
        return { status: 'warn', explainKey: 'german_level_studium.english_program_a1' }
      }
      if (levelAtLeast(germanLevel, 'C1')) return { status: 'pass', explainKey: 'german_level_studium.c1_strong' }
      if (levelAtLeast(germanLevel, 'B2')) return { status: 'pass', explainKey: 'german_level_studium.b2_min' }
      if (levelAtLeast(germanLevel, 'B1')) return { status: 'warn', explainKey: 'german_level_studium.b1_close' }
      return { status: 'fail', explainKey: 'german_level_studium.below' }
    },
  },

  // ── Education ──────────────────────────────────────────────
  {
    id: 'education_ausbildung',
    category: 'education',
    blocker: false,
    weight: 1,
    appliesTo: ['ausbildung'],
    evaluate: ({ education }) => {
      if (education === 'no_bac') return { status: 'warn', explainKey: 'education_ausbildung.no_bac' }
      return { status: 'pass', explainKey: 'education_ausbildung.bac_ok' }
    },
  },
  {
    id: 'education_studium_bachelor',
    category: 'education',
    blocker: true,
    weight: 3,
    appliesTo: ['studium'],
    evaluate: ({ education, studiumGoal }) => {
      if (studiumGoal !== 'bachelor') return { status: 'na', explainKey: '' }
      if (education === 'no_bac') return { status: 'fail', explainKey: 'education_studium_bachelor.no_bac' }
      return { status: 'pass', explainKey: 'education_studium_bachelor.bac_ok' }
    },
  },
  {
    id: 'bac_grade_studium',
    category: 'education',
    blocker: false,
    weight: 2,
    appliesTo: ['studium'],
    evaluate: ({ bacAverage, studiumGoal, education }) => {
      // Only matters for Bachelor (Master uses university grades, not Bac)
      if (studiumGoal !== 'bachelor') return { status: 'na', explainKey: '' }
      if (education === 'no_bac' || bacAverage === undefined) return { status: 'na', explainKey: '' }
      if (bacAverage >= 14) return { status: 'pass', explainKey: 'bac_grade_studium.tres_bien' }
      if (bacAverage >= 12) return { status: 'warn', explainKey: 'bac_grade_studium.assez_bien' }
      if (bacAverage >= 10) return { status: 'fail', explainKey: 'bac_grade_studium.passable' }
      return { status: 'fail', explainKey: 'bac_grade_studium.failing' }
    },
  },
  {
    id: 'education_studium_master',
    category: 'education',
    blocker: true,
    weight: 3,
    appliesTo: ['studium'],
    evaluate: ({ education, studiumGoal }) => {
      if (studiumGoal !== 'master') return { status: 'na', explainKey: '' }
      if (education === 'bac_plus_5' || education === 'bac_plus_3') return { status: 'pass', explainKey: 'education_studium_master.licence_ok' }
      if (education === 'bac_plus_2') return { status: 'warn', explainKey: 'education_studium_master.bac_plus_2' }
      return { status: 'fail', explainKey: 'education_studium_master.below' }
    },
  },

  // ── Application: contract or admission ─────────────────────
  {
    id: 'contract_ausbildung',
    category: 'application',
    blocker: true,
    weight: 3,
    appliesTo: ['ausbildung'],
    evaluate: ({ hasContract }) => {
      if (hasContract) return { status: 'pass', explainKey: 'contract_ausbildung.have' }
      return { status: 'fail', explainKey: 'contract_ausbildung.missing' }
    },
  },
  {
    id: 'admission_studium',
    category: 'application',
    blocker: true,
    weight: 3,
    appliesTo: ['studium'],
    evaluate: ({ hasAdmission }) => {
      if (hasAdmission) return { status: 'pass', explainKey: 'admission_studium.have' }
      return { status: 'fail', explainKey: 'admission_studium.missing' }
    },
  },
  {
    id: 'aps_studium',
    category: 'application',
    blocker: true,
    weight: 3,
    appliesTo: ['studium'],
    evaluate: ({ hasAps }) => {
      if (hasAps) return { status: 'pass', explainKey: 'aps_studium.have' }
      return { status: 'fail', explainKey: 'aps_studium.missing' }
    },
  },

  // ── Financial ──────────────────────────────────────────────
  {
    id: 'financial_proof',
    category: 'financial',
    blocker: true,
    weight: 2,
    appliesTo: ['ausbildung', 'studium'],
    evaluate: ({ financial, path }) => {
      if (financial === 'need_help') return { status: 'fail', explainKey: 'financial_proof.need_help' }
      if (path === 'studium' && financial === 'salary_covers') {
        return { status: 'fail', explainKey: 'financial_proof.studium_no_salary' }
      }
      if (financial === 'sperrkonto') return { status: 'pass', explainKey: 'financial_proof.sperrkonto' }
      if (financial === 'sponsor') return { status: 'pass', explainKey: 'financial_proof.sponsor' }
      if (financial === 'salary_covers') return { status: 'pass', explainKey: 'financial_proof.salary_ausbildung' }
      if (financial === 'family_support') return { status: 'warn', explainKey: 'financial_proof.family' }
      return { status: 'warn', explainKey: 'financial_proof.unclear' }
    },
  },

  // ── Personal ───────────────────────────────────────────────
  {
    id: 'passport',
    category: 'personal',
    blocker: true,
    weight: 1,
    appliesTo: ['ausbildung', 'studium'],
    evaluate: ({ passportValid12mo }) => {
      if (passportValid12mo) return { status: 'pass', explainKey: 'passport.valid' }
      return { status: 'fail', explainKey: 'passport.expiring' }
    },
  },
  {
    id: 'clean_record',
    category: 'personal',
    blocker: false,
    weight: 1,
    appliesTo: ['ausbildung', 'studium'],
    evaluate: ({ cleanRecord }) => {
      if (cleanRecord) return { status: 'pass', explainKey: 'clean_record.clean' }
      return { status: 'warn', explainKey: 'clean_record.case_by_case' }
    },
  },
  {
    id: 'age_ausbildung',
    category: 'personal',
    blocker: false,
    weight: 1,
    appliesTo: ['ausbildung'],
    evaluate: ({ age }) => {
      if (age <= 30) return { status: 'pass', explainKey: 'age_ausbildung.young' }
      if (age <= 35) return { status: 'pass', explainKey: 'age_ausbildung.mid' }
      if (age <= 40) return { status: 'warn', explainKey: 'age_ausbildung.older' }
      return { status: 'warn', explainKey: 'age_ausbildung.much_older' }
    },
  },
]

export type RuleResult = {
  rule: Rule
  status: Status
  explainKey: string
}

export type CalcResult = {
  results: RuleResult[]
  blockers: RuleResult[]      // status=fail and rule.blocker=true
  warnings: RuleResult[]      // status=warn or non-blocker fail
  passes: RuleResult[]        // status=pass
  /** 0–100 score weighted by rule.weight */
  readinessPct: number
  overall: 'eligible' | 'conditional' | 'not_yet'
}

export function evaluate(input: EligibilityInput): CalcResult {
  const applicableRules = RULES.filter(r => r.appliesTo.includes(input.path))
  const results: RuleResult[] = applicableRules
    .map(rule => {
      const out = rule.evaluate(input)
      return { rule, status: out.status, explainKey: out.explainKey }
    })
    .filter(r => r.status !== 'na')

  const blockers = results.filter(r => r.status === 'fail' && r.rule.blocker)
  const warnings = results.filter(r => r.status === 'warn' || (r.status === 'fail' && !r.rule.blocker))
  const passes = results.filter(r => r.status === 'pass')

  // Score: weighted percentage, pass=1, warn=0.5, fail=0
  const totalWeight = results.reduce((s, r) => s + r.rule.weight, 0)
  const earned = results.reduce((s, r) => {
    const factor = r.status === 'pass' ? 1 : r.status === 'warn' ? 0.5 : 0
    return s + r.rule.weight * factor
  }, 0)
  const readinessPct = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100)

  let overall: 'eligible' | 'conditional' | 'not_yet'
  if (blockers.length === 0 && warnings.length <= 1) overall = 'eligible'
  else if (blockers.length === 0) overall = 'conditional'
  else overall = 'not_yet'

  return { results, blockers, warnings, passes, readinessPct, overall }
}

export const CATEGORY_ORDER: Category[] = ['language', 'education', 'application', 'financial', 'personal']
export const CATEGORY_ICON: Record<Category, string> = {
  language: '🗣️',
  education: '🎓',
  application: '📝',
  financial: '💰',
  personal: '👤',
}
