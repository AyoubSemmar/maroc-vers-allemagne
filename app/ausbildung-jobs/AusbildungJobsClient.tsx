'use client'

import { useMemo, useState } from 'react'
import { CATEGORIES, CATEGORIES_ORDER, CategoryKey } from '@/lib/jobCategories'
import CategorySection from '@/components/jobs/CategorySection'
import ApplyModal from '@/components/jobs/ApplyModal'
import { Job } from '@/components/jobs/JobCard'
import './ausbildung-jobs.css'

type Props = {
  jobs: Job[]
  lastUpdated?: string | null
}

export default function AusbildungJobsClient({ jobs, lastUpdated }: Props) {
  const [filter, setFilter] = useState<CategoryKey | 'all'>('all')
  const [applyJob, setApplyJob] = useState<Job | null>(null)

  // Group jobs by category
  const jobsByCategory = useMemo(() => {
    const map: Record<CategoryKey, Job[]> = {
      hospitality: [], handwerk: [], it: [], healthcare: [],
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
    <div className="aj-root" dir="rtl">
      {/* Header */}
      <header className="aj-header">
        <div className="wrap">
          <p className="aj-eyebrow">🔍 فرص Ausbildung</p>
          <h1>Ausbildung Jobs</h1>
          <p className="aj-subtitle">
            آخر عروض التدريب المهني من وكالة العمل الألمانية (Bundesagentur für Arbeit)، مصنّفة حسب القطاع. قدّم مباشرة بإيميل مولّد بالذكاء الاصطناعي.
          </p>
          <div className="aj-header-meta">
            <span>📊 {total} عرض متاح</span>
            {lastUpdated && <span>🔄 آخر تحديث: {new Date(lastUpdated).toLocaleDateString('ar-MA')}</span>}
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
            الكل ({total})
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
                {cat.icon} {cat.nameAr} ({count})
              </button>
            )
          })}
        </div>

        {/* Categories */}
        {total === 0 ? (
          <div className="aj-empty">
            <div className="aj-empty-icon">📭</div>
            <p>لا توجد عروض متاحة حالياً.</p>
            <p style={{ fontSize: 12.5, marginTop: 8 }}>
              يتم تحديث العروض يومياً. عد غداً.
            </p>
          </div>
        ) : (
          visibleCategories.map(k => (
            <CategorySection
              key={k}
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
