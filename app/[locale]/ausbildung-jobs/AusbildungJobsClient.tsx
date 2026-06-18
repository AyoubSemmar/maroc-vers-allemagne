'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CATEGORIES, CATEGORIES_ORDER, CategoryKey } from '@/lib/jobCategories'
import JobCard, { Job } from '@/components/jobs/JobCard'
import ApplyModal from '@/components/jobs/ApplyModal'
import ApplyForYouCta from '@/components/ApplyForYouCta'
import Pager, { usePageSize } from '@/components/Pager'
import { dirFor, type AppLocale } from '@/i18n/routing'
import './ausbildung-jobs.css'

type Props = {
  jobs: Job[]
  lastUpdated?: string | null
}

const INTL: Record<AppLocale, string> = { ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE', es: 'es-ES', tr: 'tr-TR', fa: 'fa-IR', pt: 'pt-BR', ru: 'ru-RU' }

export default function AusbildungJobsClient({ jobs, lastUpdated }: Props) {
  const t = useTranslations('ausbJobs')
  const locale = useLocale() as AppLocale
  const [filter, setFilter] = useState<CategoryKey | 'all'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [applyJob, setApplyJob] = useState<Job | null>(null)

  // Per-category counts only — used to label the filter pills. The list
  // itself is rendered as a single flat paginated grid (20 desktop /
  // 10 mobile per page), regardless of which categories are present.
  const countsByCategory = useMemo(() => {
    const map: Record<CategoryKey, number> = {
      hospitality: 0, handwerk: 0, it: 0, healthcare: 0, logistics: 0, education: 0, media: 0,
      public_service: 0, retail: 0, automotive: 0, engineering: 0, finance: 0,
    }
    for (const j of jobs) {
      const key = j.category as CategoryKey
      if (key in map) map[key] += 1
    }
    return map
  }, [jobs])

  // Active filter applied to the full list — order preserved from the
  // server (enriched_at DESC, then published_at DESC).
  const filteredJobs = useMemo(
    () => (filter === 'all' ? jobs : jobs.filter(j => j.category === filter)),
    [jobs, filter],
  )

  // Pagination: 20 desktop / 10 mobile across the whole filtered list.
  // Resets to page 1 whenever the user changes the filter.
  const pageSize = usePageSize()
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [filter])
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize))
  const visibleJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

  const total = jobs.length

  return (
    <div className="aj-root" dir={dirFor(locale)}>
      {/* Header */}
      <header className="aj-header">
        <div className="wrap">
          <p className="aj-eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="aj-subtitle">{t('subtitle')}</p>
          <div className="aj-header-meta">
            <span>{t('offersCount', { n: total })}</span>
            {lastUpdated && <span>{t('lastUpdated', { date: new Date(lastUpdated).toLocaleDateString(INTL[locale]) })}</span>}
          </div>
        </div>
      </header>

      <div className="aj-body wrap">
        <ApplyForYouCta />
        {/* Category filter */}
        <div className="aj-filter-bar">
          <button
            type="button"
            className={`aj-filter-btn${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('all', { n: total })}
          </button>
          {CATEGORIES_ORDER.map(k => {
            const cat = CATEGORIES[k]
            const count = countsByCategory[k]
            return (
              <button
                key={k}
                type="button"
                className={`aj-filter-btn${filter === k ? ' active' : ''}`}
                onClick={() => setFilter(k)}
              >
                {cat.icon} {t(`cats.${k}` as any)} ({count})
              </button>
            )
          })}
        </div>

        {/* View-mode toggle: grid ⇄ list */}
        <div className="aj-view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={`aj-view-btn${view === 'grid' ? ' active' : ''}`}
            onClick={() => setView('grid')}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
            title="Grid"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            className={`aj-view-btn${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
            title="List"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <line x1="2" y1="3.5" x2="14" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="12.5" x2="14" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Flat paginated grid — 20 desktop / 10 mobile per page */}
        {total === 0 ? (
          <div className="aj-empty">
            <div className="aj-empty-icon">📭</div>
            <p>{t('emptyTitle')}</p>
            <p style={{ fontSize: 12.5, marginTop: 8 }}>{t('emptyHint')}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="aj-cat-empty">{t('catEmpty')}</div>
        ) : (
          <section id="aj-results">
            <div className={`aj-grid${view === 'list' ? ' aj-grid--list' : ''}`}>
              {visibleJobs.map(j => (
                <JobCard key={j.id} job={j} onApply={setApplyJob} />
              ))}
            </div>
            <Pager page={page} total={totalPages} onChange={setPage} scrollToId="aj-results" />
          </section>
        )}
      </div>

      {/* Apply Modal */}
      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}
    </div>
  )
}
