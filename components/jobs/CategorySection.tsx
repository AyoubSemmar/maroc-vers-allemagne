'use client'

import { useTranslations } from 'next-intl'
import { Category, CategoryKey } from '@/lib/jobCategories'
import JobCard, { Job } from './JobCard'

type Props = {
  category: Category
  categoryKey: CategoryKey
  jobs: Job[]
  onApply: (job: Job) => void
}

export default function CategorySection({ category, categoryKey, jobs, onApply }: Props) {
  const t = useTranslations('ausbJobs')
  return (
    <section className="aj-category">
      <header className="aj-category-header">
        <span className="aj-category-icon">{category.icon}</span>
        <h2 className="aj-category-title">
          {t(`cats.${categoryKey}` as any)} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 14 }}>· {category.nameEn}</span>
        </h2>
        <span className="aj-category-count">{jobs.length}</span>
      </header>

      {jobs.length === 0 ? (
        <div className="aj-cat-empty">{t('catEmpty')}</div>
      ) : (
        <div className="aj-grid">
          {jobs.map(j => <JobCard key={j.id} job={j} onApply={onApply} />)}
        </div>
      )}
    </section>
  )
}
