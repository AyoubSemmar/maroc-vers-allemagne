'use client'

import { Category } from '@/lib/jobCategories'
import JobCard, { Job } from './JobCard'

type Props = {
  category: Category
  jobs: Job[]
  onApply: (job: Job) => void
}

export default function CategorySection({ category, jobs, onApply }: Props) {
  return (
    <section className="aj-category">
      <header className="aj-category-header">
        <span className="aj-category-icon">{category.icon}</span>
        <h2 className="aj-category-title">
          {category.nameAr} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 14 }}>· {category.nameEn}</span>
        </h2>
        <span className="aj-category-count">{jobs.length}</span>
      </header>

      {jobs.length === 0 ? (
        <div className="aj-cat-empty">
          لا توجد عروض متاحة حالياً في هذا القطاع. تحقق لاحقاً.
        </div>
      ) : (
        <div className="aj-grid">
          {jobs.map(j => <JobCard key={j.id} job={j} onApply={onApply} />)}
        </div>
      )}
    </section>
  )
}
