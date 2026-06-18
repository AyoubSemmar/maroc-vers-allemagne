'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import BookConsultationButton from '@/components/BookConsultationButton'
import { CONSULTATIONS_ENABLED } from '@/lib/featureFlags'
import {
  CATEGORY_ICON,
  CATEGORY_ORDER,
  evaluate,
  type EducationKey,
  type EligibilityInput,
  type FinancialKey,
  type GermanLevel,
  type PathKey,
  type StudiumGoal,
} from '@/lib/eligibilityCheckerData'
import { COUNTRIES, COUNTRY_ORDER, type CountryKey } from '@/lib/documentChecklistData'
import './eligibility-checker.css'

const PATHS: PathKey[] = ['ausbildung', 'studium']
const PATH_ICON: Record<PathKey, string> = { ausbildung: '🛠', studium: '🎓' }
const EDUCATIONS: EducationKey[] = ['no_bac', 'bac', 'bac_plus_2', 'bac_plus_3', 'bac_plus_5']
const LEVELS: GermanLevel[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1']
const FINANCIALS: FinancialKey[] = ['sperrkonto', 'sponsor', 'salary_covers', 'family_support', 'need_help']
const STUDIUM_GOALS: StudiumGoal[] = ['bachelor', 'master']

const STATUS_COLOR: Record<string, string> = {
  pass: 'var(--ec-c-pass)',
  warn: 'var(--ec-c-warn)',
  fail: 'var(--ec-c-fail)',
}

export default function EligibilityChecker({ locale }: { locale: AppLocale }) {
  const t = useTranslations('eligibilityChecker')
  const dir = dirFor(locale)

  const [country, setCountry] = useState<CountryKey>('ma')
  const [path, setPath] = useState<PathKey>('ausbildung')
  const [age, setAge] = useState(22)
  const [education, setEducation] = useState<EducationKey>('bac')
  const [germanLevel, setGermanLevel] = useState<GermanLevel>('A2')
  const [studiumGoal, setStudiumGoal] = useState<StudiumGoal>('bachelor')
  const [hasContract, setHasContract] = useState(false)
  const [hasAdmission, setHasAdmission] = useState(false)
  const [hasAps, setHasAps] = useState(false)
  const [englishTaughtProgram, setEnglishTaughtProgram] = useState(false)
  const [bacAverage, setBacAverage] = useState<number>(13)
  const [financial, setFinancial] = useState<FinancialKey>('sperrkonto')
  const [passportValid12mo, setPassportValid12mo] = useState(true)
  const [cleanRecord, setCleanRecord] = useState(true)

  const input: EligibilityInput = {
    country, path, age, education, germanLevel, studiumGoal, hasContract, hasAdmission, hasAps,
    bacAverage, englishTaughtProgram, financial, passportValid12mo, cleanRecord,
  }
  const result = useMemo(() => evaluate(input),
    [country, path, age, education, germanLevel, studiumGoal, hasContract, hasAdmission, hasAps,
      bacAverage, englishTaughtProgram, financial, passportValid12mo, cleanRecord])

  const apsNeeded = COUNTRIES[country]?.apsRequired ?? false

  const overallText = result.overall === 'eligible' ? t('overall.eligible')
    : result.overall === 'conditional' ? t('overall.conditional')
    : t('overall.notYet')
  const overallSub = result.overall === 'eligible' ? t('overall.eligibleSub')
    : result.overall === 'conditional' ? t('overall.conditionalSub')
    : t('overall.notYetSub')

  return (
    <div className={`ec-root ec-status--${result.overall}`} dir={dir}>
      {/* Hero */}
      <header className="ec-hero">
        <div className="wrap">
          <span className="ec-eyebrow"><span className="ec-eyebrow-dot" />{t('eyebrow')}</span>
          <h1 className="ec-title">{t('title')}</h1>
          <p className="ec-subtitle">{t('subtitle')}</p>
        </div>
      </header>

      <div className="ec-body wrap">
        <div className="ec-grid">
          {/* ── FORM ─────────────────────────────────────── */}
          <section className="ec-form-card">
            <h2 className="ec-section-title">{t('formTitle')}</h2>

            {/* Country */}
            <div className="ec-field">
              <label className="ec-label">🌍 {t('countryLabel')}</label>
              <select className="ec-select" value={country} onChange={e => setCountry(e.target.value as CountryKey)}>
                {COUNTRY_ORDER.map(c => (
                  <option key={c} value={c}>{COUNTRIES[c].flag} {COUNTRIES[c].name[locale]}</option>
                ))}
              </select>
            </div>

            {/* Path */}
            <div className="ec-field">
              <label className="ec-label">🧭 {t('pathLabel')}</label>
              <div className="ec-pill-grid ec-pill-grid--2">
                {PATHS.map(p => (
                  <button key={p} type="button" className={`ec-pill${path === p ? ' is-active' : ''}`} onClick={() => setPath(p)}>
                    <span className="ec-pill-icon">{PATH_ICON[p]}</span>
                    <span className="ec-pill-label">{t(`path.${p}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {path === 'studium' && (
              <div className="ec-field">
                <label className="ec-label">🎯 {t('studiumGoalLabel')}</label>
                <div className="ec-pill-grid ec-pill-grid--2">
                  {STUDIUM_GOALS.map(g => (
                    <button key={g} type="button" className={`ec-pill${studiumGoal === g ? ' is-active' : ''}`} onClick={() => setStudiumGoal(g)}>
                      <span className="ec-pill-label">{t(`studiumGoal.${g}`)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Age */}
            <div className="ec-field">
              <label className="ec-label">🎂 {t('ageLabel')}</label>
              <input type="number" className="ec-input" value={age} min={15} max={70} onChange={e => setAge(parseInt(e.target.value, 10) || 0)} />
            </div>

            {/* Education */}
            <div className="ec-field">
              <label className="ec-label">🎓 {t('educationLabel')}</label>
              <select className="ec-select" value={education} onChange={e => setEducation(e.target.value as EducationKey)}>
                {EDUCATIONS.map(ed => <option key={ed} value={ed}>{t(`education.${ed}`)}</option>)}
              </select>
            </div>

            {/* Bac average — only for Studium Bachelor (Moroccan Bac ≥ 14/20 needed) */}
            {path === 'studium' && studiumGoal === 'bachelor' && education !== 'no_bac' && (
              <div className="ec-field">
                <label className="ec-label">📊 {t('bacAverageLabel')}</label>
                <div className="ec-bac-input">
                  <input
                    type="number"
                    className="ec-input"
                    value={bacAverage}
                    min={0}
                    max={20}
                    step={0.1}
                    onChange={e => setBacAverage(parseFloat(e.target.value) || 0)}
                  />
                  <span className="ec-bac-suffix">/ 20</span>
                </div>
                <p className="ec-hint">{t('bacAverageHint')}</p>
              </div>
            )}

            {/* German level */}
            <div className="ec-field">
              <label className="ec-label">🗣️ {t('germanLabel')}</label>
              <div className="ec-level-bar">
                {LEVELS.map(lv => (
                  <button key={lv} type="button" className={`ec-level-btn${germanLevel === lv ? ' is-active' : ''}`} onClick={() => setGermanLevel(lv)}>
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            {/* Path-specific toggles */}
            {path === 'ausbildung' && (
              <label className="ec-toggle">
                <input type="checkbox" checked={hasContract} onChange={e => setHasContract(e.target.checked)} />
                <span className="ec-toggle-track" aria-hidden />
                <span className="ec-toggle-text">
                  <span className="ec-toggle-title">{t('hasContractTitle')}</span>
                  <span className="ec-toggle-sub">{t('hasContractHint')}</span>
                </span>
              </label>
            )}

            {path === 'studium' && (
              <>
                <label className="ec-toggle">
                  <input type="checkbox" checked={hasAdmission} onChange={e => setHasAdmission(e.target.checked)} />
                  <span className="ec-toggle-track" aria-hidden />
                  <span className="ec-toggle-text">
                    <span className="ec-toggle-title">{t('hasAdmissionTitle')}</span>
                    <span className="ec-toggle-sub">{t('hasAdmissionHint')}</span>
                  </span>
                </label>
                {apsNeeded && (
                  <label className="ec-toggle">
                    <input type="checkbox" checked={hasAps} onChange={e => setHasAps(e.target.checked)} />
                    <span className="ec-toggle-track" aria-hidden />
                    <span className="ec-toggle-text">
                      <span className="ec-toggle-title">{t('hasApsTitle')}</span>
                      <span className="ec-toggle-sub">{t('hasApsHint')}</span>
                    </span>
                  </label>
                )}
                <label className="ec-toggle">
                  <input type="checkbox" checked={englishTaughtProgram} onChange={e => setEnglishTaughtProgram(e.target.checked)} />
                  <span className="ec-toggle-track" aria-hidden />
                  <span className="ec-toggle-text">
                    <span className="ec-toggle-title">{t('englishProgramTitle')}</span>
                    <span className="ec-toggle-sub">{t('englishProgramHint')}</span>
                  </span>
                </label>
              </>
            )}

            {/* Financial */}
            <div className="ec-field">
              <label className="ec-label">💰 {t('financialLabel')}</label>
              <select className="ec-select" value={financial} onChange={e => setFinancial(e.target.value as FinancialKey)}>
                {FINANCIALS.map(f => <option key={f} value={f}>{t(`financial.${f}`)}</option>)}
              </select>
            </div>

            {/* Personal */}
            <label className="ec-toggle">
              <input type="checkbox" checked={passportValid12mo} onChange={e => setPassportValid12mo(e.target.checked)} />
              <span className="ec-toggle-track" aria-hidden />
              <span className="ec-toggle-text">
                <span className="ec-toggle-title">{t('passportTitle')}</span>
                <span className="ec-toggle-sub">{t('passportHint')}</span>
              </span>
            </label>
            <label className="ec-toggle">
              <input type="checkbox" checked={cleanRecord} onChange={e => setCleanRecord(e.target.checked)} />
              <span className="ec-toggle-track" aria-hidden />
              <span className="ec-toggle-text">
                <span className="ec-toggle-title">{t('cleanRecordTitle')}</span>
                <span className="ec-toggle-sub">{t('cleanRecordHint')}</span>
              </span>
            </label>
          </section>

          {/* ── RESULT ───────────────────────────────────── */}
          <section className="ec-result-card">
            <div className={`ec-status ec-status-${result.overall}`}>
              <span className="ec-status-icon">
                {result.overall === 'eligible' ? '✅' : result.overall === 'conditional' ? '⚠️' : '❌'}
              </span>
              <h2 className="ec-status-title">{overallText}</h2>
              <p className="ec-status-sub">{overallSub}</p>
            </div>

            {/* Readiness gauge */}
            <div className="ec-readiness">
              <div className="ec-readiness-num">{result.readinessPct}%</div>
              <div className="ec-readiness-label">{t('readinessLabel')}</div>
              <div className="ec-readiness-bar">
                <div className="ec-readiness-fill" style={{ width: `${result.readinessPct}%` }} />
              </div>
            </div>

            {/* Counts */}
            <div className="ec-counts">
              <div className="ec-count ec-count--pass">
                <strong>{result.passes.length}</strong>
                <span>{t('countPass')}</span>
              </div>
              <div className="ec-count ec-count--warn">
                <strong>{result.warnings.length}</strong>
                <span>{t('countWarn')}</span>
              </div>
              <div className="ec-count ec-count--fail">
                <strong>{result.blockers.length}</strong>
                <span>{t('countBlocker')}</span>
              </div>
            </div>
          </section>
        </div>

        {/* ── BLOCKERS ────────────────────────────────────── */}
        {result.blockers.length > 0 && (
          <section className="ec-section ec-section--blockers">
            <h2 className="ec-block-title">❌ {t('blockersTitle')}</h2>
            <p className="ec-block-sub">{t('blockersSub')}</p>
            <ul className="ec-list">
              {result.blockers.map(r => (
                <RuleRow key={r.rule.id} t={t} result={r} />
              ))}
            </ul>
          </section>
        )}

        {/* ── WARNINGS ────────────────────────────────────── */}
        {result.warnings.length > 0 && (
          <section className="ec-section ec-section--warnings">
            <h2 className="ec-block-title">⚠️ {t('warningsTitle')}</h2>
            <p className="ec-block-sub">{t('warningsSub')}</p>
            <ul className="ec-list">
              {result.warnings.map(r => (
                <RuleRow key={r.rule.id} t={t} result={r} />
              ))}
            </ul>
          </section>
        )}

        {/* ── PASSES ──────────────────────────────────────── */}
        {result.passes.length > 0 && (
          <section className="ec-section ec-section--passes">
            <h2 className="ec-block-title">✅ {t('passesTitle')}</h2>
            <ul className="ec-list ec-list--passes">
              {result.passes.map(r => (
                <li key={r.rule.id} className="ec-pass-row">
                  <span className="ec-pass-icon">{CATEGORY_ICON[r.rule.category]}</span>
                  <span>{t(`rules.${r.rule.id}.title`)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        {CONSULTATIONS_ENABLED && (
        <section className="ec-cta">
          <h2 className="ec-cta-title">{t('ctaTitle')}</h2>
          <p className="ec-cta-sub">{t('ctaSub')}</p>
          <BookConsultationButton variant="on-cta" topic="eligibility" />
        </section>
        )}
      </div>
    </div>
  )
}

function RuleRow({ t, result }: { t: ReturnType<typeof useTranslations>; result: { rule: any; status: string; explainKey: string } }) {
  return (
    <li className={`ec-row ec-row--${result.status}`}>
      <span className="ec-row-icon" style={{ background: STATUS_COLOR[result.status] || 'var(--line)' }}>
        {result.status === 'pass' ? '✓' : result.status === 'warn' ? '!' : '✕'}
      </span>
      <div className="ec-row-body">
        <h3 className="ec-row-title">{t(`rules.${result.rule.id}.title`)}</h3>
        <p className="ec-row-explain">{t(`explain.${result.explainKey}`)}</p>
      </div>
    </li>
  )
}
