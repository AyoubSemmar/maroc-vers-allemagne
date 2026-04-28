'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Category, CategoryKey } from '@/lib/jobCategories'
import JobCard, { Job } from './JobCard'

type Props = {
  category: Category
  categoryKey: CategoryKey
  jobs: Job[]
  view?: 'grid' | 'list'
  onApply: (job: Job) => void
}

// Cap the initial render at this many cards per category. The user reveals
// the rest with "Show more" — this keeps mobile hydration cheap when a
// category has hundreds of listings.
const INITIAL_VISIBLE = 12

export default function CategorySection({ category, categoryKey, jobs, view = 'grid', onApply }: Props) {
  const t = useTranslations('ausbJobs')
  const [expanded, setExpanded] = useState(false)
  const total = jobs.length
  const visible = expanded || total <= INITIAL_VISIBLE ? jobs : jobs.slice(0, INITIAL_VISIBLE)
  const hidden = total - visible.length

  return (
    <section className="aj-category">
      <header className="aj-category-header">
        <span className="aj-category-icon">{category.icon}</span>
        <h2 className="aj-category-title">
          {t(`cats.${categoryKey}` as any)} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 14 }}>· {category.nameEn}</span>
        </h2>
        <span className="aj-category-count">{total}</span>
      </header>

      {total === 0 ? (
        <div className="aj-cat-empty">{t('catEmpty')}</div>
      ) : (
        <>
          <div className={`aj-grid${view === 'list' ? ' aj-grid--list' : ''}`}>
            {visible.map(j => <JobCard key={j.id} job={j} onApply={onApply} />)}
          </div>
          {total > INITIAL_VISIBLE && (
            <div className="aj-cat-more">
              <button
                type="button"
                className="aj-cat-more-btn"
                onClick={() => setExpanded(e => !e)}
              >
                {expanded ? t('showLess') : t('showMore', { n: hidden })}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
