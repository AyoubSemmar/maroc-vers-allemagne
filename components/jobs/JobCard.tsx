'use client'

import { useTranslations } from 'next-intl'

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

export default function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  const t = useTranslations('ausbJobs')
  const dateStr = job.published_at || job.created_at
  const d = dateStr ? new Date(dateStr) : null
  const diffDays = d ? Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)) : 999
  const isFresh = diffDays <= 3

  return (
    <article className="aj-card">
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
      </div>

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
