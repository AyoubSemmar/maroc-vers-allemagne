'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Category, CategoryKey } from '@/lib/jobCategories'
import JobCard, { Job } from './JobCard'
import Pager, { usePageSize } from '@/components/Pager'

type Props = {
  category: Category
  categoryKey: CategoryKey
  jobs: Job[]
  view?: 'grid' | 'list'
  onApply: (job: Job) => void
}

export default function CategorySection({ category, categoryKey, jobs, view = 'grid', onApply }: Props) {
  const t = useTranslations('ausbJobs')
  const total = jobs.length

  // Paginate cards: 10 mobile / 20 desktop. The category-section anchor
  // id lets the Pager scroll the user back to the top of this category
  // after a page change so they don't end up mid-list.
  const pageSize = usePageSize()
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [categoryKey, total])
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const visible = jobs.slice((page - 1) * pageSize, page * pageSize)

  const anchorId = `aj-cat-${categoryKey}`

  return (
    <section id={anchorId} className="aj-category">
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
          <Pager page={page} total={totalPages} onChange={setPage} scrollToId={anchorId} />
        </>
      )}
    </section>
  )
}
