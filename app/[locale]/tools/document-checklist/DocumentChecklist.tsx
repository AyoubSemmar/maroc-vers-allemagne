'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import BookConsultationButton from '@/components/BookConsultationButton'
import {
  CATEGORY_ICON,
  CATEGORY_ORDER,
  COUNTRIES,
  COUNTRY_ORDER,
  calculate,
  type AuthMethod,
  type CountryKey,
  type ChecklistInput,
  type Doc,
  type EducationKey,
  type FamilyKey,
  type PathKey,
} from '@/lib/documentChecklistData'
import './document-checklist.css'

const PATHS: PathKey[] = ['ausbildung', 'studium']
const EDUCATIONS: EducationKey[] = ['bac', 'bac_plus_2', 'bac_plus_3', 'bac_plus_5']
const FAMILIES: FamilyKey[] = ['single', 'married', 'married_kids']

const PATH_ICON: Record<PathKey, string> = { ausbildung: '🛠', studium: '🎓' }

const INTL: Record<AppLocale, string> = { ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE' }

const STORAGE_KEY = 'gogermany.documentChecklist.checked.v1'
const COUNTRY_KEY = 'gogermany.documentChecklist.country.v1'

export default function DocumentChecklist({ locale }: { locale: AppLocale }) {
  const t = useTranslations('documentChecklist')
  const dir = dirFor(locale)
  const fmt = useMemo(() => new Intl.NumberFormat(INTL[locale], { maximumFractionDigits: 0 }), [locale])

  // ── Inputs ────────────────────────────────────────────────
  const [country, setCountry] = useState<CountryKey>('ma')
  const [path, setPath] = useState<PathKey>('ausbildung')
  const [education, setEducation] = useState<EducationKey>('bac')
  const [family, setFamily] = useState<FamilyKey>('single')
  const [vorab, setVorab] = useState(false)
  const [apsDone, setApsDone] = useState(false)
  const [hasGermanCert, setHasGermanCert] = useState(false)
  const [bringFamily, setBringFamily] = useState(false)

  // Restore the saved country once on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COUNTRY_KEY) as CountryKey | null
      if (saved && saved in COUNTRIES) setCountry(saved)
    } catch {}
  }, [])
  function selectCountry(c: CountryKey) {
    setCountry(c)
    try { localStorage.setItem(COUNTRY_KEY, c) } catch {}
  }

  const input: ChecklistInput = { country, path, education, family, vorab, apsDone, hasGermanCert, bringFamily }
  const result = useMemo(() => calculate(input), [country, path, education, family, vorab, apsDone, hasGermanCert, bringFamily])

  const rule = COUNTRIES[country]
  const authLabel = result.authMethod === 'apostille' ? t('apostille') : t('legalization')

  // ── Persisted checkbox state ──────────────────────────────
  const [checked, setChecked] = useState<Set<string>>(() => new Set())
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(new Set(JSON.parse(raw)))
    } catch {}
  }, [])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked])) } catch {}
  }, [checked])

  function toggleCheck(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const checkedInScope = result.applicableDocs.filter(d => checked.has(d.id)).length
  const completionPct = result.totalDocs > 0
    ? Math.round((checkedInScope / result.totalDocs) * 100)
    : 0

  // ── Currency / time helpers (EUR is the universal anchor) ──
  function eur(lo: number, hi: number) {
    if (lo === 0 && hi === 0) return t('free')
    if (lo === hi) return `€${fmt.format(lo)}`
    return `€${fmt.format(lo)}–${fmt.format(hi)}`
  }
  function rangeDays(lo: number, hi: number) {
    if (lo === 0 && hi <= 1) return t('sameDay')
    if (hi <= 14) return `${lo}–${hi} ${t('days')}`
    return `${Math.ceil(lo / 7)}–${Math.ceil(hi / 7)} ${t('weeks')}`
  }

  return (
    <div className="dcl-root" dir={dir}>
      {/* Hero */}
      <header className="dcl-hero">
        <div className="wrap">
          <span className="dcl-eyebrow"><span className="dcl-eyebrow-dot" />{t('eyebrow')}</span>
          <h1 className="dcl-title">{t('title')}</h1>
          <p className="dcl-subtitle">{t('subtitle')}</p>
        </div>
      </header>

      <div className="dcl-body wrap">
        <div className="dcl-grid">
          {/* ── FORM ─────────────────────────────────────── */}
          <section className="dcl-form-card">
            <h2 className="dcl-section-title">{t('formTitle')}</h2>

            <div className="dcl-field">
              <label className="dcl-label">🌍 {t('countryLabel')}</label>
              <select className="dcl-select" value={country} onChange={e => selectCountry(e.target.value as CountryKey)}>
                {COUNTRY_ORDER.map(c => (
                  <option key={c} value={c}>{COUNTRIES[c].flag} {COUNTRIES[c].name[locale]}</option>
                ))}
              </select>
            </div>

            <div className="dcl-field">
              <label className="dcl-label">🧭 {t('pathLabel')}</label>
              <div className="dcl-pill-grid dcl-pill-grid--2">
                {PATHS.map(p => (
                  <button key={p} type="button" className={`dcl-pill${path === p ? ' is-active' : ''}`} onClick={() => setPath(p)}>
                    <span className="dcl-pill-icon">{PATH_ICON[p]}</span>
                    <span className="dcl-pill-label">{t(`path.${p}`)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="dcl-field">
              <label className="dcl-label">🎓 {t('educationLabel')}</label>
              <select className="dcl-select" value={education} onChange={e => setEducation(e.target.value as EducationKey)}>
                {EDUCATIONS.map(e => <option key={e} value={e}>{t(`education.${e}`)}</option>)}
              </select>
            </div>

            <div className="dcl-field">
              <label className="dcl-label">👨‍👩‍👧 {t('familyLabel')}</label>
              <select className="dcl-select" value={family} onChange={e => setFamily(e.target.value as FamilyKey)}>
                {FAMILIES.map(f => <option key={f} value={f}>{t(`family.${f}`)}</option>)}
              </select>
            </div>

            {path === 'ausbildung' && (
              <label className="dcl-toggle">
                <input type="checkbox" checked={vorab} onChange={e => setVorab(e.target.checked)} />
                <span className="dcl-toggle-track" aria-hidden />
                <span className="dcl-toggle-text">
                  <span className="dcl-toggle-title">{t('vorabTitle')}</span>
                  <span className="dcl-toggle-sub">{t('vorabHint')}</span>
                </span>
              </label>
            )}

            {path === 'studium' && rule.apsRequired && (
              <label className="dcl-toggle">
                <input type="checkbox" checked={apsDone} onChange={e => setApsDone(e.target.checked)} />
                <span className="dcl-toggle-track" aria-hidden />
                <span className="dcl-toggle-text">
                  <span className="dcl-toggle-title">{t('apsDoneTitle')}</span>
                  <span className="dcl-toggle-sub">{t('apsDoneHint')}</span>
                </span>
              </label>
            )}

            <label className="dcl-toggle">
              <input type="checkbox" checked={hasGermanCert} onChange={e => setHasGermanCert(e.target.checked)} />
              <span className="dcl-toggle-track" aria-hidden />
              <span className="dcl-toggle-text">
                <span className="dcl-toggle-title">{t('germanCertTitle')}</span>
                <span className="dcl-toggle-sub">{t('germanCertHint')}</span>
              </span>
            </label>

            {family !== 'single' && (
              <label className="dcl-toggle">
                <input type="checkbox" checked={bringFamily} onChange={e => setBringFamily(e.target.checked)} />
                <span className="dcl-toggle-track" aria-hidden />
                <span className="dcl-toggle-text">
                  <span className="dcl-toggle-title">{t('bringFamilyTitle')}</span>
                  <span className="dcl-toggle-sub">{t('bringFamilyHint')}</span>
                </span>
              </label>
            )}
          </section>

          {/* ── SUMMARY ──────────────────────────────────── */}
          <section className="dcl-summary-card">
            <span className="dcl-summary-eyebrow">{t('summaryEyebrow')}</span>
            <h2 className="dcl-summary-total">{result.totalDocs} {t('documents')}</h2>
            <p className="dcl-summary-sub">
              {t('summarySubCountry', { path: t(`path.${path}`), country: rule.name[locale] })}
            </p>

            <div className="dcl-summary-row">
              <span>{t('totalCost')}</span>
              <strong>{eur(result.totalCostEur[0], result.totalCostEur[1])}</strong>
            </div>
            <div className="dcl-summary-row">
              <span>{result.authMethod === 'apostille' ? t('apostilleCount', { n: result.authCount }) : t('legalizationCount', { n: result.authCount })}</span>
              <strong>{eur(result.authCostEur[0], result.authCostEur[1])}</strong>
            </div>
            <div className="dcl-summary-row">
              <span>{t('translationPages', { n: result.translationPages })}</span>
              <strong>{eur(result.translationCostEur[0], result.translationCostEur[1])}</strong>
            </div>
            {(result.apsCostEur[0] > 0 || result.apsCostEur[1] > 0) && (
              <div className="dcl-summary-row">
                <span>{t('apsFee')}</span>
                <strong>{eur(result.apsCostEur[0], result.apsCostEur[1])}</strong>
              </div>
            )}
            <div className="dcl-summary-row dcl-summary-row--big">
              <span>{t('estimatedTimeline')}</span>
              <strong>{result.realisticTimelineWeeks[0]}–{result.realisticTimelineWeeks[1]} {t('weeks')}</strong>
            </div>

            {/* Progress */}
            <div className="dcl-progress">
              <div className="dcl-progress-bar"><div className="dcl-progress-fill" style={{ width: `${completionPct}%` }} /></div>
              <p className="dcl-progress-label">{t('progressLabel', { done: checkedInScope, total: result.totalDocs })}</p>
            </div>
          </section>
        </div>

        {/* ── COUNTRY NOTE + DISCLAIMER ─────────────────────── */}
        {rule.noteKey && (
          <div className="dcl-country-note">
            <span aria-hidden>ℹ️</span>
            <p>{t(`countryNote.${rule.noteKey}` as any, { country: rule.name[locale], method: authLabel })}</p>
          </div>
        )}
        <p className="dcl-disclaimer">{t('disclaimer')}</p>

        {/* ── DOCUMENT LIST ─────────────────────────────────── */}
        <h2 className="dcl-list-title">{t('listTitle')}</h2>
        <div className="dcl-list">
          {CATEGORY_ORDER.map(cat => {
            const docs = result.byCategory[cat]
            if (!docs || docs.length === 0) return null
            return (
              <section key={cat} className="dcl-cat">
                <h3 className="dcl-cat-title">
                  <span className="dcl-cat-icon">{CATEGORY_ICON[cat]}</span>
                  {t(`category.${cat}`)}
                  <span className="dcl-cat-count">{docs.length}</span>
                </h3>
                <ul className="dcl-cat-list">
                  {docs.map(d => (
                    <DocRow
                      key={d.id}
                      doc={d}
                      authMethod={result.authMethod}
                      authLabel={authLabel}
                      checked={checked.has(d.id)}
                      onToggle={() => toggleCheck(d.id)}
                      eur={eur}
                      rangeDays={rangeDays}
                      t={t}
                    />
                  ))}
                </ul>
              </section>
            )
          })}
        </div>

        {/* CTA */}
        <section className="dcl-cta">
          <h2 className="dcl-cta-title">{t('ctaTitle')}</h2>
          <p className="dcl-cta-sub">{t('ctaSub')}</p>
          <BookConsultationButton variant="on-cta" topic="document-checklist" />
        </section>
      </div>
    </div>
  )
}

function DocRow({
  doc, authMethod, authLabel, checked, onToggle, eur, rangeDays, t,
}: {
  doc: Doc
  authMethod: AuthMethod
  authLabel: string
  checked: boolean
  onToggle: () => void
  eur: (lo: number, hi: number) => string
  rangeDays: (lo: number, hi: number) => string
  t: ReturnType<typeof useTranslations>
}) {
  const [expanded, setExpanded] = useState(false)
  const cost = doc.costEur
  const days = doc.timelineDays
  return (
    <li className={`dcl-row${checked ? ' is-checked' : ''}`}>
      <label className="dcl-row-check">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="dcl-row-check-mark" aria-hidden />
      </label>
      <div className="dcl-row-body">
        <div className="dcl-row-head">
          <h4 className="dcl-row-name">{t(`docs.${doc.id}.name` as any)}</h4>
          {doc.mandatory && <span className="dcl-badge dcl-badge--mandatory">{t('mandatory')}</span>}
          {doc.alternativeTo && <span className="dcl-badge dcl-badge--alt">{t('orAlternative')}</span>}
          {doc.needsAuth && (
            <span className={`dcl-badge ${authMethod === 'apostille' ? 'dcl-badge--apostille' : 'dcl-badge--legalization'}`}>{authLabel}</span>
          )}
          {doc.needsSwornTranslation && <span className="dcl-badge dcl-badge--translation">{t('swornTranslation')}</span>}
        </div>
        <p className="dcl-row-where"><span aria-hidden>📍</span> {t(`docs.${doc.id}.where` as any)}</p>
        <div className="dcl-row-meta">
          <span className="dcl-row-cost">💰 {eur(cost[0], cost[1])}</span>
          <span className="dcl-row-time">⏳ {rangeDays(days[0], days[1])}</span>
          <button type="button" className="dcl-row-more" onClick={() => setExpanded(v => !v)}>
            {expanded ? t('hideTip') : t('showTip')}
          </button>
        </div>
        {expanded && <p className="dcl-row-notes">{t(`docs.${doc.id}.notes` as any)}</p>}
      </div>
    </li>
  )
}
