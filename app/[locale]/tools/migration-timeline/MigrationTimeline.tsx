'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import BookConsultationButton from '@/components/BookConsultationButton'
import {
  calculate,
  fmtMonths,
  LEVEL_ORDER,
  type EducationKey,
  type IntensityKey,
  type LevelKey,
  type PathKey,
} from '@/lib/migrationTimelineData'
import './migration-timeline.css'

const INTENSITIES: IntensityKey[] = ['slow', 'normal', 'intensive']
const EDUCATIONS: EducationKey[] = ['bac', 'university', 'other']
const PATHS: PathKey[] = ['ausbildung', 'studium']

const PATH_ICON: Record<PathKey, string> = { ausbildung: '🛠', studium: '🎓' }
const INTENSITY_ICON: Record<IntensityKey, string> = { slow: '🐢', normal: '⚖️', intensive: '🔥' }

const PHASE_COLOR: Record<string, string> = {
  german:      'var(--mtl-c-german)',
  application: 'var(--mtl-c-application)',
  visa:        'var(--mtl-c-visa)',
  relocation:  'var(--mtl-c-relocation)',
}

export default function MigrationTimeline({ locale }: { locale: AppLocale }) {
  const t = useTranslations('migrationTimeline')
  const dir = dirFor(locale)

  const [path, setPath] = useState<PathKey>('ausbildung')
  const [currentLevel, setCurrentLevel] = useState<LevelKey>('A1')
  const [intensity, setIntensity] = useState<IntensityKey>('normal')
  const [education, setEducation] = useState<EducationKey>('bac')
  const [vorab, setVorab] = useState(false)

  const result = useMemo(
    () => calculate({ path, currentLevel, intensity, education, vorab }),
    [path, currentLevel, intensity, education, vorab]
  )

  const totalForBar = result.totalSlow || 1

  return (
    <div className="mtl-root" dir={dir}>
      {/* Hero */}
      <header className="mtl-hero">
        <div className="wrap">
          <span className="mtl-eyebrow">
            <span className="mtl-eyebrow-dot" />{t('eyebrow')}
          </span>
          <h1 className="mtl-title">{t('title')}</h1>
          <p className="mtl-subtitle">{t('subtitle')}</p>
        </div>
      </header>

      <div className="mtl-body wrap">
        <div className="mtl-grid">
          {/* ── FORM ─────────────────────────────────────── */}
          <section className="mtl-form-card">
            <h2 className="mtl-section-title">{t('formTitle')}</h2>

            {/* Path */}
            <div className="mtl-field">
              <label className="mtl-label">
                <span className="mtl-label-icon">🧭</span>{t('pathLabel')}
              </label>
              <div className="mtl-pill-grid mtl-pill-grid--2">
                {PATHS.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`mtl-pill${path === p ? ' is-active' : ''}`}
                    onClick={() => setPath(p)}
                  >
                    <span className="mtl-pill-icon">{PATH_ICON[p]}</span>
                    <span className="mtl-pill-label">{t(`path.${p}.name`)}</span>
                    <span className="mtl-pill-sub">{t(`path.${p}.sub`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current German level */}
            <div className="mtl-field">
              <label className="mtl-label">
                <span className="mtl-label-icon">🗣️</span>{t('levelLabel')}
              </label>
              <div className="mtl-level-bar">
                {LEVEL_ORDER.map(lv => (
                  <button
                    key={lv}
                    type="button"
                    className={`mtl-level-btn${currentLevel === lv ? ' is-active' : ''}`}
                    onClick={() => setCurrentLevel(lv)}
                  >
                    {lv}
                  </button>
                ))}
              </div>
              <p className="mtl-hint">{t('levelHint', { target: t(`path.${path}.target`) })}</p>
            </div>

            {/* Intensity */}
            <div className="mtl-field">
              <label className="mtl-label">
                <span className="mtl-label-icon">⚡</span>{t('intensityLabel')}
              </label>
              <div className="mtl-pill-grid mtl-pill-grid--3">
                {INTENSITIES.map(i => (
                  <button
                    key={i}
                    type="button"
                    className={`mtl-pill${intensity === i ? ' is-active' : ''}`}
                    onClick={() => setIntensity(i)}
                  >
                    <span className="mtl-pill-icon">{INTENSITY_ICON[i]}</span>
                    <span className="mtl-pill-label">{t(`intensity.${i}.name`)}</span>
                    <span className="mtl-pill-sub">{t(`intensity.${i}.sub`)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mtl-field">
              <label className="mtl-label">
                <span className="mtl-label-icon">🎓</span>{t('educationLabel')}
              </label>
              <select className="mtl-select" value={education} onChange={e => setEducation(e.target.value as EducationKey)}>
                {EDUCATIONS.map(ed => (
                  <option key={ed} value={ed}>{t(`education.${ed}`)}</option>
                ))}
              </select>
            </div>

            {/* Vorab (only for Ausbildung) */}
            {path === 'ausbildung' && (
              <label className="mtl-toggle">
                <input
                  type="checkbox"
                  checked={vorab}
                  onChange={e => setVorab(e.target.checked)}
                />
                <span className="mtl-toggle-track" aria-hidden />
                <div className="mtl-toggle-text">
                  <span className="mtl-toggle-title">{t('vorabLabel')}</span>
                  <span className="mtl-toggle-sub">{t('vorabHint')}</span>
                </div>
              </label>
            )}
          </section>

          {/* ── RESULT ───────────────────────────────────── */}
          <section className="mtl-result-card">
            <div className="mtl-result-head">
              <span className="mtl-result-eyebrow">{t('resultEyebrow')}</span>
              <h2 className="mtl-result-total">
                {fmtMonths(result.totalFast)}–{fmtMonths(result.totalSlow)}
              </h2>
              <p className="mtl-result-unit-line">{t('months')}</p>
              <p className="mtl-result-sub">
                {t('avgScenario', { n: fmtMonths(result.totalAverage) })}
              </p>
            </div>

            {/* Three-scenario comparison */}
            <div className="mtl-scenarios">
              <div className="mtl-scenario">
                <span className="mtl-scenario-icon">🚀</span>
                <span className="mtl-scenario-label">{t('fast')}</span>
                <strong>{fmtMonths(result.totalFast)} {t('mo')}</strong>
              </div>
              <div className="mtl-scenario mtl-scenario--avg">
                <span className="mtl-scenario-icon">📊</span>
                <span className="mtl-scenario-label">{t('average')}</span>
                <strong>{fmtMonths(result.totalAverage)} {t('mo')}</strong>
              </div>
              <div className="mtl-scenario">
                <span className="mtl-scenario-icon">🐢</span>
                <span className="mtl-scenario-label">{t('slow')}</span>
                <strong>{fmtMonths(result.totalSlow)} {t('mo')}</strong>
              </div>
            </div>

            {/* Phase breakdown — stacked timeline */}
            <h3 className="mtl-breakdown-title">{t('phasesTitle')}</h3>
            <div className="mtl-stack">
              {result.phases.map(p => {
                const widthPct = Math.max(2, (p.range.avg / totalForBar) * 100)
                return (
                  <div key={p.key} className="mtl-stack-row">
                    <div className="mtl-stack-meta">
                      <span className="mtl-stack-dot" style={{ background: PHASE_COLOR[p.key] }} />
                      <span className="mtl-stack-label">{t(`phase.${p.key}`)}</span>
                      {p.detail && <span className="mtl-stack-detail">{p.detail}</span>}
                    </div>
                    <div className="mtl-stack-bar">
                      <div
                        className="mtl-stack-bar-fill"
                        style={{ width: `${widthPct}%`, background: PHASE_COLOR[p.key] }}
                      />
                    </div>
                    <span className="mtl-stack-range">
                      {fmtMonths(p.range.min)}–{fmtMonths(p.range.max)} {t('mo')}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Insights */}
        {result.insights.length > 0 && (
          <section className="mtl-info-card">
            <h2 className="mtl-section-title">⚠️ {t('insightsTitle')}</h2>
            <ul className="mtl-info-list mtl-info-list--warn">
              {result.insights.map(k => (
                <li key={k}>{t(`insights.${k}` as any)}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Tips */}
        <section className="mtl-info-card mtl-info-card--tips">
          <h2 className="mtl-section-title">💡 {t('tipsTitle')}</h2>
          <ul className="mtl-info-list">
            {result.tips.map(k => (
              <li key={k}>{t(`tips.${k}` as any)}</li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mtl-cta">
          <h2 className="mtl-cta-title">{t('ctaTitle')}</h2>
          <p className="mtl-cta-sub">{t('ctaSub')}</p>
          <BookConsultationButton variant="on-cta" topic="migration-timeline" />
        </section>
      </div>
    </div>
  )
}
