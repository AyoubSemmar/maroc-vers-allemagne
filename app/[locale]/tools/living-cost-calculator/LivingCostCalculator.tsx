'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import {
  CITIES,
  LIFESTYLE,
  PARTNER_MULTIPLIER,
  SECTOR_STIPEND,
  calculate,
  type AccommodationKey,
  type CityKey,
  type LifestyleKey,
  type SectorKey,
} from '@/lib/livingCostData'
import './living-cost-calculator.css'

const ACCOMMODATIONS: AccommodationKey[] = ['dormitory', 'shared', 'studio', 'apartment']
const LIFESTYLES: LifestyleKey[] = ['budget', 'moderate', 'comfortable']
const SECTORS: SectorKey[] = [
  'healthcare', 'it', 'engineering', 'automotive', 'handwerk',
  'hospitality', 'retail', 'education', 'media', 'public_service',
  'finance', 'logistics',
]

const TIER_COLOR: Record<1 | 2 | 3 | 4, string> = {
  1: 'lcc-tier-1', 2: 'lcc-tier-2', 3: 'lcc-tier-3', 4: 'lcc-tier-4',
}

const ACCOMMODATION_ICONS: Record<AccommodationKey, string> = {
  dormitory: '🏠', shared: '👥', studio: '🛏️', apartment: '🏢',
}

const LIFESTYLE_ICONS: Record<LifestyleKey, string> = {
  budget: '💰', moderate: '⚖️', comfortable: '✨',
}

const INTL: Record<AppLocale, string> = { ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE' }

export default function LivingCostCalculator({ locale }: { locale: AppLocale }) {
  const t = useTranslations('livingCost')
  const dir = dirFor(locale)
  const fmt = useMemo(() => new Intl.NumberFormat(INTL[locale], { maximumFractionDigits: 0 }), [locale])

  const [city, setCity] = useState<CityKey>('berlin')
  const [accommodation, setAccommodation] = useState<AccommodationKey>('shared')
  const [lifestyle, setLifestyle] = useState<LifestyleKey>('moderate')
  const [sector, setSector] = useState<SectorKey>('healthcare')
  const [stipend, setStipend] = useState<number>(SECTOR_STIPEND.healthcare)
  const [withPartner, setWithPartner] = useState(false)

  // When sector changes, prefill the stipend (but don't override edits).
  function changeSector(next: SectorKey) {
    setSector(next)
    setStipend(SECTOR_STIPEND[next])
  }

  const result = useMemo(
    () => calculate({ city, accommodation, lifestyle, stipendMonthlyEur: stipend, withPartner }),
    [city, accommodation, lifestyle, stipend, withPartner]
  )

  const cityObj = CITIES.find(c => c.key === city)!

  // Donut chart: each cost category as a slice.
  const slices = [
    { key: 'rent',          value: result.rent,          color: 'var(--lcc-c-rent)' },
    { key: 'food',          value: result.food,          color: 'var(--lcc-c-food)' },
    { key: 'transport',     value: result.transport,     color: 'var(--lcc-c-transport)' },
    { key: 'utilities',     value: result.utilities,     color: 'var(--lcc-c-utilities)' },
    { key: 'insurance',     value: result.insurance,     color: 'var(--lcc-c-insurance)' },
    { key: 'entertainment', value: result.entertainment, color: 'var(--lcc-c-entertainment)' },
  ]

  // SVG donut math
  const radius = 70, stroke = 22, circumference = 2 * Math.PI * radius
  let cumulative = 0

  return (
    <div className="lcc-root" dir={dir}>
      {/* Hero */}
      <header className="lcc-hero">
        <div className="wrap">
          <span className="lcc-eyebrow">
            <span className="lcc-eyebrow-dot" />{t('eyebrow')}
          </span>
          <h1 className="lcc-title">{t('title')}</h1>
          <p className="lcc-subtitle">{t('subtitle')}</p>
          <div className="lcc-hero-badges">
            <span className="lcc-hero-badge">📊 {t('badgeOfficial')}</span>
            <span className="lcc-hero-badge">🏛️ {t('badgeDestatis')}</span>
            <span className="lcc-hero-badge">🆓 {t('badgeFree')}</span>
          </div>
        </div>
      </header>

      <div className="lcc-body wrap">
        <div className="lcc-grid">
          {/* ── FORM ─────────────────────────────────────── */}
          <section className="lcc-form-card">
            <h2 className="lcc-section-title">{t('formTitle')}</h2>

            {/* City */}
            <div className="lcc-field">
              <label className="lcc-label">
                <span className="lcc-label-icon">📍</span>{t('cityLabel')}
              </label>
              <select className="lcc-select" value={city} onChange={e => setCity(e.target.value as CityKey)}>
                {([1, 2, 3, 4] as const).map(tier => (
                  <optgroup key={tier} label={t(`tier.${tier}`)}>
                    {CITIES.filter(c => c.tier === tier).map(c => (
                      <option key={c.key} value={c.key}>{t(`city.${c.key}`)}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <span className={`lcc-tier-pill ${TIER_COLOR[cityObj.tier]}`}>
                {t(`tier.${cityObj.tier}`)}
              </span>
            </div>

            {/* Accommodation type — pill grid */}
            <div className="lcc-field">
              <label className="lcc-label">
                <span className="lcc-label-icon">🏘️</span>{t('accommodationLabel')}
              </label>
              <div className="lcc-pill-grid">
                {ACCOMMODATIONS.map(a => (
                  <button
                    key={a}
                    type="button"
                    className={`lcc-pill${accommodation === a ? ' is-active' : ''}`}
                    onClick={() => setAccommodation(a)}
                  >
                    <span className="lcc-pill-icon">{ACCOMMODATION_ICONS[a]}</span>
                    <span className="lcc-pill-label">{t(`accommodation.${a}.name`)}</span>
                    <span className="lcc-pill-sub">€{fmt.format(cityObj.rent[a][0])}–{fmt.format(cityObj.rent[a][1])}</span>
                  </button>
                ))}
              </div>
              <p className="lcc-hint">{t(`accommodation.${accommodation}.hint`)}</p>
            </div>

            {/* Lifestyle */}
            <div className="lcc-field">
              <label className="lcc-label">
                <span className="lcc-label-icon">🌿</span>{t('lifestyleLabel')}
              </label>
              <div className="lcc-pill-grid lcc-pill-grid--3">
                {LIFESTYLES.map(l => (
                  <button
                    key={l}
                    type="button"
                    className={`lcc-pill${lifestyle === l ? ' is-active' : ''}`}
                    onClick={() => setLifestyle(l)}
                  >
                    <span className="lcc-pill-icon">{LIFESTYLE_ICONS[l]}</span>
                    <span className="lcc-pill-label">{t(`lifestyle.${l}.name`)}</span>
                    <span className="lcc-pill-sub">{t(`lifestyle.${l}.sub`, { food: LIFESTYLE[l].food })}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sector */}
            <div className="lcc-field">
              <label className="lcc-label">
                <span className="lcc-label-icon">💼</span>{t('sectorLabel')}
              </label>
              <select className="lcc-select" value={sector} onChange={e => changeSector(e.target.value as SectorKey)}>
                {SECTORS.map(s => (
                  <option key={s} value={s}>
                    {t(`sector.${s}`)} · €{SECTOR_STIPEND[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* Stipend (number input) */}
            <div className="lcc-field">
              <label className="lcc-label">
                <span className="lcc-label-icon">💶</span>{t('stipendLabel')}
              </label>
              <div className="lcc-stipend">
                <span className="lcc-stipend-prefix">€</span>
                <input
                  type="number"
                  className="lcc-stipend-input"
                  value={stipend}
                  min={0}
                  max={5000}
                  step={50}
                  onChange={e => setStipend(parseInt(e.target.value, 10) || 0)}
                />
                <span className="lcc-stipend-suffix">/{t('perMonth')}</span>
              </div>
              <p className="lcc-hint">{t('stipendHint')}</p>
            </div>

            {/* Partner toggle */}
            <label className="lcc-toggle">
              <input
                type="checkbox"
                checked={withPartner}
                onChange={e => setWithPartner(e.target.checked)}
              />
              <span className="lcc-toggle-track" aria-hidden />
              <div className="lcc-toggle-text">
                <span className="lcc-toggle-title">{t('partnerLabel')}</span>
                <span className="lcc-toggle-sub">{t('partnerHint', { pct: Math.round((PARTNER_MULTIPLIER - 1) * 100) })}</span>
              </div>
            </label>
          </section>

          {/* ── RESULT ───────────────────────────────────── */}
          <section className="lcc-result-card">
            <div className="lcc-result-head">
              <span className="lcc-result-eyebrow">{t('resultEyebrow')}</span>
              <h2 className="lcc-result-total">€{fmt.format(result.total)}</h2>
              <p className="lcc-result-sub">
                {t('resultSubtitle', { city: t(`city.${city}`) })}
              </p>
            </div>

            {/* Donut chart */}
            <div className="lcc-donut-wrap">
              <svg className="lcc-donut" viewBox="0 0 200 200" role="img" aria-label={t('resultEyebrow')}>
                <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--line-soft)" strokeWidth={stroke} />
                {slices.map(s => {
                  const frac = s.value / result.total
                  const dash = frac * circumference
                  const offset = -cumulative
                  cumulative += dash
                  return (
                    <circle
                      key={s.key}
                      cx="100" cy="100" r={radius}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={stroke}
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={offset}
                      transform="rotate(-90 100 100)"
                    />
                  )
                })}
                <text x="100" y="95" textAnchor="middle" className="lcc-donut-num">€{fmt.format(result.total)}</text>
                <text x="100" y="115" textAnchor="middle" className="lcc-donut-label">{t('perMonth')}</text>
              </svg>
            </div>

            {/* Stipend coverage bar */}
            <div className={`lcc-coverage ${result.surplus >= 0 ? 'is-surplus' : 'is-deficit'}`}>
              <div className="lcc-coverage-row">
                <span>{t('stipendShort')}</span>
                <strong>€{fmt.format(result.stipend)}</strong>
              </div>
              <div className="lcc-coverage-row">
                <span>{t('costsShort')}</span>
                <strong>€{fmt.format(result.total)}</strong>
              </div>
              <div className="lcc-coverage-row lcc-coverage-row--big">
                <span>{result.surplus >= 0 ? t('surplus') : t('deficit')}</span>
                <strong>€{fmt.format(Math.abs(result.surplus))}</strong>
              </div>
              <p className="lcc-coverage-hint">
                {result.surplus >= 0 ? t('surplusHint') : t('deficitHint')}
              </p>
            </div>

            {/* Breakdown */}
            <div className="lcc-breakdown">
              <h3 className="lcc-breakdown-title">{t('breakdownTitle')}</h3>
              {slices.map(s => {
                const pct = Math.round((s.value / result.total) * 100)
                return (
                  <div key={s.key} className="lcc-breakdown-row">
                    <span className="lcc-breakdown-dot" style={{ background: s.color }} />
                    <span className="lcc-breakdown-label">{t(`category.${s.key}`)}</span>
                    <span className="lcc-breakdown-pct">{pct}%</span>
                    <span className="lcc-breakdown-value">€{fmt.format(s.value)}</span>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Disclosure */}
        <section className="lcc-info-card">
          <h2 className="lcc-section-title">{t('infoTitle')}</h2>
          <ul className="lcc-info-list">
            <li>{t('infoBlocked')}</li>
            <li>{t('infoSetup')}</li>
            <li>{t('infoEstimate')}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
