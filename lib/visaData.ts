// Visa-procedure data for Moroccans. Two flows: Studium (national D-visa
// under §16b AufenthG) and Ausbildung (national D-visa under §16a AufenthG).
//
// Sources cross-referenced 2026-04 (verify before quoting in production):
//   • Auswärtiges Amt — Visa for studies / Berufsausbildung
//   • Deutsche Botschaft Rabat / Generalkonsulat Casablanca
//   • TLScontact Maroc (visa intake provider)
//   • make-it-in-germany.com
//   • Goethe-Institut Casablanca / Rabat
//   • Fintiba / Expatrio / Coracle (Sperrkonto providers)
//
// Numbers are 2026 estimates rounded for clarity. The Eligibility-Checker /
// Document-Checklist tools have the more precise per-document breakdowns.

export type VisaFlow = 'studium' | 'ausbildung'

export type VisaStep = {
  /** Step number for visual ordering. */
  n: number
  /** i18n key under static.visa.<flow>.steps.<id>.{title,desc,duration?} */
  id: string
  /** Suggested duration label (e.g. "2–6 months"). i18n via duration. */
  hasDuration: boolean
}

export type VisaDoc = {
  id: string
  /** Critical = blocker if missing. Important = strongly recommended. */
  importance: 'critical' | 'important' | 'recommended'
  /** Whether the document needs apostille from Moroccan MAEC. */
  apostille?: boolean
  /** Whether the document needs sworn translation (assermentée) into German. */
  swornTranslation?: boolean
}

export type VisaCost = {
  id: string
  amountMad: number   // approximate, MAD
  amountEur?: number  // shown when the cost is fixed in EUR (e.g. visa fee)
  /** Whether this cost is required (true) or only sometimes (false). */
  required: boolean
}

export type VisaRejection = {
  id: string
  severity: 'high' | 'medium'
}

export type VisaFlowData = {
  flow: VisaFlow
  /** Aufenthaltsgesetz section. */
  legalBasis: string
  /** Steps in order. */
  steps: VisaStep[]
  /** Documents in display order. */
  docs: VisaDoc[]
  /** Cost line items in display order. */
  costs: VisaCost[]
  /** Common rejection reasons, ordered by frequency. */
  rejections: VisaRejection[]
}

// ── Studium (university student) ─────────────────────────────
export const STUDIUM: VisaFlowData = {
  flow: 'studium',
  legalBasis: '§16b AufenthG',
  steps: [
    { n: 1, id: 'aps',          hasDuration: true  }, // 6–12 weeks
    { n: 2, id: 'language',     hasDuration: true  }, // depends on level
    { n: 3, id: 'apply_uni',    hasDuration: true  }, // 4–12 weeks
    { n: 4, id: 'sperrkonto',   hasDuration: true  }, // 1–4 weeks
    { n: 5, id: 'insurance',    hasDuration: true  }, // 1 week
    { n: 6, id: 'apostille',    hasDuration: true  }, // 1–4 weeks
    { n: 7, id: 'tls_appt',     hasDuration: true  }, // 1–3 months
    { n: 8, id: 'submit',       hasDuration: false }, // day-of
    { n: 9, id: 'decision',     hasDuration: true  }, // 4–12 weeks
    { n: 10, id: 'pickup',      hasDuration: false },
  ],
  docs: [
    { id: 'passport',           importance: 'critical' },
    { id: 'photos',             importance: 'critical' },
    { id: 'aps_certificate',    importance: 'critical', apostille: false },
    { id: 'admission_letter',   importance: 'critical' },
    { id: 'sperrkonto_proof',   importance: 'critical' },
    { id: 'health_insurance',   importance: 'critical' },
    { id: 'language_cert',      importance: 'critical' },
    { id: 'bac_diploma',        importance: 'critical', apostille: true, swornTranslation: true },
    { id: 'transcripts',        importance: 'critical', apostille: true, swornTranslation: true },
    { id: 'birth_certificate',  importance: 'critical', apostille: true, swornTranslation: true },
    { id: 'cv',                 importance: 'critical' },
    { id: 'motivation_letter',  importance: 'critical' },
    { id: 'criminal_record',    importance: 'important', apostille: true, swornTranslation: true },
    { id: 'application_form',   importance: 'critical' },
    { id: 'declaration_truth',  importance: 'critical' },
  ],
  costs: [
    { id: 'visa_fee',           amountMad: 810,   amountEur: 75,    required: true },
    { id: 'sperrkonto_setup',   amountMad: 1100,  amountEur: 100,   required: true },
    { id: 'sperrkonto_block',   amountMad: 130000, amountEur: 11904, required: true },
    { id: 'health_insurance',   amountMad: 1500,  amountEur: 130,   required: true },
    { id: 'language_test',      amountMad: 1800,                   required: true },
    { id: 'aps_fee',            amountMad: 2700,  amountEur: 250,   required: true },
    { id: 'apostille_total',    amountMad: 600,                    required: true },
    { id: 'sworn_translation',  amountMad: 2000,                   required: true },
    { id: 'tls_service_fee',    amountMad: 350,                    required: true },
    { id: 'photos',             amountMad: 80,                     required: true },
    { id: 'passport',           amountMad: 500,                    required: false },
  ],
  rejections: [
    { id: 'weak_finances',      severity: 'high' },
    { id: 'doubt_return',       severity: 'high' },
    { id: 'weak_motivation',    severity: 'high' },
    { id: 'language_below',     severity: 'high' },
    { id: 'fake_documents',     severity: 'high' },
    { id: 'no_aps',             severity: 'high' },
    { id: 'incomplete_file',    severity: 'medium' },
    { id: 'health_insurance',   severity: 'medium' },
    { id: 'apostille_missing',  severity: 'medium' },
  ],
}

// ── Ausbildung (vocational training) ─────────────────────────
export const AUSBILDUNG: VisaFlowData = {
  flow: 'ausbildung',
  legalBasis: '§16a AufenthG',
  steps: [
    { n: 1, id: 'language_b1',   hasDuration: true }, // 6–12 months
    { n: 2, id: 'find_employer', hasDuration: true }, // 1–6 months
    { n: 3, id: 'sign_contract', hasDuration: true }, // 1–4 weeks
    { n: 4, id: 'finances',      hasDuration: true }, // depends
    { n: 5, id: 'insurance',     hasDuration: true },
    { n: 6, id: 'apostille',     hasDuration: true },
    { n: 7, id: 'tls_appt',      hasDuration: true },
    { n: 8, id: 'submit',        hasDuration: false },
    { n: 9, id: 'ba_zav',        hasDuration: true }, // BA-ZAV approval
    { n: 10, id: 'decision',     hasDuration: true },
    { n: 11, id: 'pickup',       hasDuration: false },
  ],
  docs: [
    { id: 'passport',           importance: 'critical' },
    { id: 'photos',             importance: 'critical' },
    { id: 'ausbildung_contract', importance: 'critical' },
    { id: 'language_cert',      importance: 'critical' },
    { id: 'finances_proof',     importance: 'critical' },
    { id: 'health_insurance',   importance: 'critical' },
    { id: 'school_diploma',     importance: 'critical', apostille: true, swornTranslation: true },
    { id: 'birth_certificate',  importance: 'critical', apostille: true, swornTranslation: true },
    { id: 'cv',                 importance: 'critical' },
    { id: 'motivation_letter',  importance: 'critical' },
    { id: 'criminal_record',    importance: 'important', apostille: true, swornTranslation: true },
    { id: 'application_form',   importance: 'critical' },
    { id: 'declaration_truth',  importance: 'critical' },
    { id: 'professional_recognition', importance: 'recommended' },
  ],
  costs: [
    { id: 'visa_fee',           amountMad: 810,   amountEur: 75,    required: true },
    { id: 'language_courses',   amountMad: 7000,                   required: true },
    { id: 'language_test',      amountMad: 1800,                   required: true },
    { id: 'sperrkonto_block',   amountMad: 65000, amountEur: 5957,  required: false },
    { id: 'health_insurance',   amountMad: 1500,  amountEur: 130,   required: true },
    { id: 'apostille_total',    amountMad: 500,                    required: true },
    { id: 'sworn_translation',  amountMad: 1500,                   required: true },
    { id: 'tls_service_fee',    amountMad: 350,                    required: true },
    { id: 'photos',             amountMad: 80,                     required: true },
    { id: 'passport',           amountMad: 500,                    required: false },
  ],
  rejections: [
    { id: 'weak_finances',      severity: 'high' },
    { id: 'language_below',     severity: 'high' },
    { id: 'contract_doubts',    severity: 'high' },
    { id: 'doubt_return',       severity: 'medium' },
    { id: 'fake_documents',     severity: 'high' },
    { id: 'incomplete_file',    severity: 'medium' },
    { id: 'apostille_missing',  severity: 'medium' },
    { id: 'school_diploma',     severity: 'medium' },
  ],
}

export const VISA_DATA: Record<VisaFlow, VisaFlowData> = {
  studium: STUDIUM,
  ausbildung: AUSBILDUNG,
}

/** Compute total in MAD (with EUR equivalent for display). */
export function totalCost(flow: VisaFlow, includeOptional = false) {
  const items = VISA_DATA[flow].costs.filter(c => includeOptional || c.required)
  const totalMad = items.reduce((s, c) => s + c.amountMad, 0)
  const totalEur = Math.round(totalMad / 10.9)
  return { totalMad, totalEur, items }
}
