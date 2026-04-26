'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { CATEGORIES, CATEGORIES_ORDER, CategoryKey } from '@/lib/jobCategories'
import CategorySection from '@/components/jobs/CategorySection'
import ApplyModal from '@/components/jobs/ApplyModal'
import { Job } from '@/components/jobs/JobCard'
import { dirFor, type AppLocale } from '@/i18n/routing'
import './ausbildung-jobs.css'

type Props = {
  jobs: Job[]
  lastUpdated?: string | null
}

const INTL: Record<AppLocale, string> = { ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE' }

export default function AusbildungJobsClient({ jobs, lastUpdated }: Props) {
  const t = useTranslations('ausbJobs')
  const locale = useLocale() as AppLocale
  const [filter, setFilter] = useState<CategoryKey | 'all'>('all')
  const [applyJob, setApplyJob] = useState<Job | null>(null)

  // Group jobs by category
  const jobsByCategory = useMemo(() => {
    const map: Record<CategoryKey, Job[]> = {
      hospitality: [], handwerk: [], it: [], healthcare: [], logistics: [],
    }
    for (const j of jobs) {
      const key = j.category as CategoryKey
      if (map[key]) map[key].push(j)
    }
    return map
  }, [jobs])

  const total = jobs.length
  const visibleCategories = filter === 'all' ? CATEGORIES_ORDER : [filter]

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
            const count = jobsByCategory[k].length
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

        {/* Categories */}
        {total === 0 ? (
          <div className="aj-empty">
            <div className="aj-empty-icon">📭</div>
            <p>{t('emptyTitle')}</p>
            <p style={{ fontSize: 12.5, marginTop: 8 }}>{t('emptyHint')}</p>
          </div>
        ) : (
          visibleCategories.map(k => (
            <CategorySection
              key={k}
              categoryKey={k}
              category={CATEGORIES[k]}
              jobs={jobsByCategory[k]}
              onApply={j => setApplyJob(j)}
            />
          ))
        )}
      </div>

      {/* Apply Modal */}
      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}
    </div>
  )
}
