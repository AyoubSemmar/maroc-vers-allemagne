'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'

export type UniversityRow = {
  id: string
  name: string
  city: string | null
  state: string | null
  type: string | null
  founded: number | null
  studentCount: number | null
  website: string | null
  logoUrl: string | null
}

import UniLogo from '@/components/universities/UniLogo'

const TYPE_LABEL_KEYS: Record<string, string> = {
  university:        'typeUniversity',
  applied_sciences:  'typeAppliedSciences',
  technical:         'typeTechnical',
  art:               'typeArt',
  music:             'typeMusic',
  medical:           'typeMedical',
  pedagogical:       'typePedagogical',
  theological:       'typeTheological',
  dual:              'typeDual',
}

export default function UniversitiesClient({
  universities,
  locale,
}: {
  universities: UniversityRow[]
  locale: AppLocale
}) {
  const t = useTranslations('universities')
  const [query, setQuery] = useState('')
  const [city, setCity] = useState<string>('')
  const [type, setType] = useState<string>('')
  const dir = dirFor(locale)

  // Distinct cities + types found in the dataset, sorted by frequency.
  const cities = useMemo(() => {
    const counts = new Map<string, number>()
    for (const u of universities) {
      if (!u.city) continue
      counts.set(u.city, (counts.get(u.city) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [universities])

  const types = useMemo(() => {
    const set = new Set<string>()
    for (const u of universities) if (u.type) set.add(u.type)
    return [...set].sort()
  }, [universities])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return universities.filter((u) => {
      if (city && u.city !== city) return false
      if (type && u.type !== type) return false
      if (q && !u.name.toLowerCase().includes(q) && !(u.city ?? '').toLowerCase().includes(q)) return false
      return true
    })
  }, [universities, query, city, type])

  return (
    <div className="rihla unis-page" dir={dir}>
      <section className="unis-hero">
        <div className="wrap">
          <span className="eyebrow"><span className="eyebrow-dot" />{t('eyebrow')}</span>
          <h1 className="unis-hero-title">{t('title')}</h1>
          <p className="unis-hero-sub">{t('subtitle', { n: universities.length })}</p>

          <div className="unis-filters">
            <input
              type="search"
              className="unis-search"
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('searchPlaceholder')}
            />
            <select className="unis-select" value={city} onChange={(e) => setCity(e.target.value)} aria-label={t('cityFilter')}>
              <option value="">{t('allCities')}</option>
              {cities.map(([c, n]) => (
                <option key={c} value={c}>{c} ({n})</option>
              ))}
            </select>
            <select className="unis-select" value={type} onChange={(e) => setType(e.target.value)} aria-label={t('typeFilter')}>
              <option value="">{t('allTypes')}</option>
              {types.map((tk) => (
                <option key={tk} value={tk}>{t(TYPE_LABEL_KEYS[tk] ?? 'typeUniversity')}</option>
              ))}
            </select>
            {(query || city || type) && (
              <button
                type="button"
                className="unis-clear"
                onClick={() => { setQuery(''); setCity(''); setType('') }}
              >
                {t('clearFilters')}
              </button>
            )}
          </div>

          <p className="unis-count">{t('resultsCount', { n: filtered.length })}</p>
        </div>
      </section>

      <section className="unis-list">
        <div className="wrap">
          {filtered.length === 0 ? (
            <div className="unis-empty">
              <span aria-hidden style={{ fontSize: 36 }}>🎓</span>
              <p>{t('noResults')}</p>
            </div>
          ) : (
            <div className="unis-grid">
              {filtered.map((u) => (
                <Link key={u.id} href={`/universities/${u.id}`} className="unis-card">
                  <div className="unis-card-logo" aria-hidden>
                    <UniLogo src={u.logoUrl} fallback={u.name.charAt(0)} fallbackClassName="unis-card-logo-fallback" />
                  </div>
                  <div className="unis-card-body">
                    <h3 className="unis-card-name">{u.name}</h3>
                    <div className="unis-card-meta">
                      {u.city && <span className="unis-card-city">📍 {u.city}</span>}
                      {u.type && (
                        <span className="unis-card-type">
                          {t(TYPE_LABEL_KEYS[u.type] ?? 'typeUniversity')}
                        </span>
                      )}
                    </div>
                    {u.studentCount && (
                      <p className="unis-card-students">
                        {t('students', { n: u.studentCount.toLocaleString(locale) })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
