'use client'

import { useTranslations } from 'next-intl'

export type JobEnrichment = {
  summary?: { de?: string; fr?: string; en?: string; ar?: string } | null
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
  anstellungsart?: string | null
  published_at: string | null
  created_at: string
  enrichment_json?: JobEnrichment | null
}

function formatRelative(dateStr: string, t: (key: string, v?: any) => string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const diffDays = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return t('rel.today')
  if (diffDays === 1) return t('rel.oneDay')
  if (diffDays === 2) return t('rel.twoDays')
  if (diffDays <= 10) return t('rel.fewDays', { n: diffDays })
  return t('rel.manyDays', { n: diffDays })
}

function formatSalary(salary: NonNullable<JobEnrichment['salary']>): string | null {
  const min = salary.min_monthly_eur ?? salary.year_1_eur
  const max = salary.max_monthly_eur ?? salary.year_3_eur
  if (!min && !max) return null
  if (min && max && min !== max) return `€${min.toLocaleString()}–${max.toLocaleString()} / mo`
  return `€${(min ?? max)!.toLocaleString()} / mo`
}

export default function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const t = useTranslations('ausbJobs')
  const dateStr = job.published_at || job.created_at
  const d = dateStr ? new Date(dateStr) : null
  const diffDays = d ? Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)) : 999
  const isFresh = diffDays <= 3
  const e = job.enrichment_json
  const salaryStr = e?.salary ? formatSalary(e.salary) : null

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

      <div className="aj-card-badges">
        {job.anstellungsart && (
          <span className="aj-badge aj-badge-type">⏱ {job.anstellungsart}</span>
        )}
        {salaryStr && <span className="aj-badge aj-badge-salary">💶 {salaryStr}</span>}
        {e?.duration_months && <span className="aj-badge aj-badge-duration">⏳ {e.duration_months} mo</span>}
        {e?.language_required && <span className="aj-badge aj-badge-lang">🗣 {e.language_required}</span>}
      </div>

      {e?.what_youll_learn && e.what_youll_learn.length > 0 && (
        <ul className="aj-card-learn">
          {e.what_youll_learn.slice(0, 3).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}

      <div className="aj-card-meta">
        <span className={`aj-card-date${isFresh ? ' fresh' : ''}`}>
          {isFresh && t('card.freshPrefix')}{formatRelative(dateStr || new Date().toISOString(), t as any)}
        </span>
        <button type="button" className="aj-card-apply" onClick={() => onApply(job)}>
          {t('card.apply')}
        </button>
      </div>
    </article>
  )
}
