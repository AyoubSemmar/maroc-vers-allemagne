'use client'

import { useLocale, useTranslations } from 'next-intl'

export type JobEnrichment = {
  summary?: { de?: string; fr?: string; en?: string; ar?: string } | null
  translations?: { ar?: string; fr?: string; en?: string } | null
  salary?: {
    min_monthly_eur?: number | null
    max_monthly_eur?: number | null
    year_1_eur?: number | null
    year_2_eur?: number | null
    year_3_eur?: number | null
  } | null
  duration_months?: number | null
  what_youll_learn?: string[]
  requirements?: string[]
  benefits?: string[]
  language_required?: 'A2' | 'B1' | 'B2' | 'C1' | null
  abi_required?: boolean
  is_internationally_open?: boolean
  tags?: string[]
}

export type Job = {
  id: string
  external_id: string
  title: string
  company: string
  location: string
  description: string | null
  category: string
  external_url: string | null
  apply_url?: string | null
  contact_email?: string | null
  phone?: string | null
  anstellungsart?: string | null
  published_at: string | null
  created_at: string
  enrichment_json?: JobEnrichment | null
}

// Strip the goausbildung.com markdown boilerplate ("### Über diese Ausbildung\nWillkommen bei …")
// and produce a 2-line preview suitable for the card.
function cleanExcerpt(md: string, max = 160): string {
  const stripped = md
    .replace(/^### Über diese Ausbildung\n/i, '')
    .replace(/Willkommen bei [^!]+!\s*/i, '')
    .replace(/^### .+$/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return stripped.length > max ? stripped.slice(0, max).trimEnd() + '…' : stripped
}

export default function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const t = useTranslations('ausbJobs')
  const locale = useLocale()
  const e = job.enrichment_json
  const translated = (locale === 'ar' || locale === 'fr' || locale === 'en')
    ? e?.translations?.[locale]
    : null
  const description = translated || job.description

  return (
    <article className={`aj-card ${e ? 'aj-card--enriched' : ''}`}>
      <h3 className="aj-card-title" title={job.title}>{job.title}</h3>

      <p className="aj-card-company">
        <span className="aj-card-company-icon">🏢</span>
        <span>{job.company}</span>
      </p>

      {job.location && job.location !== '—' && (
        <p className="aj-card-location">
          <span>📍</span>
          <span>{job.location}</span>
        </p>
      )}

      {description && (
        <p className="aj-card-excerpt">{cleanExcerpt(description)}</p>
      )}

      <div className="aj-card-badges">
        {job.anstellungsart && (
          <span className="aj-badge aj-badge-type">⏱ {job.anstellungsart}</span>
        )}
        {job.phone && <span className="aj-badge aj-badge-phone">📞</span>}
        {job.contact_email && <span className="aj-badge aj-badge-email">✉️</span>}
        {job.apply_url && <span className="aj-badge aj-badge-link">🔗</span>}
        {e?.duration_months && <span className="aj-badge aj-badge-duration">⏳ {e.duration_months} mo</span>}
      </div>

      <div className="aj-card-meta aj-card-meta--right">
        <button type="button" className="aj-card-apply" onClick={() => onApply(job)}>
          {t('card.apply')}
        </button>
      </div>
    </article>
  )
}
