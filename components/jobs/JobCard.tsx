'use client'

import { formatRelativeDateAr } from '@/lib/dateFormatter'

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

export default function JobCard({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
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
          {isFresh && '🆕 '}{formatRelativeDateAr(dateStr || new Date().toISOString())}
        </span>
        <button type="button" className="aj-card-apply" onClick={() => onApply(job)}>
          تقديم ←
        </button>
      </div>
    </article>
  )
}
