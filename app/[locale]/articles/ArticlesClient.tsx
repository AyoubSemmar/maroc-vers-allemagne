'use client'

import { useState } from 'react'

type Article = {
  id: number
  title: string
  summary: string
  category: string
  date: string
  image_url: string | null
  featured: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  'البنوك': '🏦 البنوك',
  'شرائح الاتصال': '📱 الاتصالات',
  'الجامعات': '🎓 الجامعات',
  'العمل': '💼 العمل',
  'Ausbildung': '🛠 Ausbildung',
  'التأشيرة والأوراق': '📄 التأشيرة',
  'السكن': '🏠 السكن',
}

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState('الكل')

  const categories = ['الكل', ...Array.from(new Set(articles.map(a => a.category)))]

  const filtered = activeCategory === 'الكل'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const featured = filtered.filter(a => a.featured)
  const rest     = filtered.filter(a => !a.featured)

  return (
    <div dir="rtl">
      {/* Category filter pills */}
      <div className="rihla-articles-filter">
        <div className="rihla-articles-filter-inner">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rihla-cat-pill${activeCategory === cat ? ' active' : ''}`}
            >
              {cat === 'الكل' ? '🗂 الكل' : (CATEGORY_LABELS[cat] ?? cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="rihla-articles-body wrap">

        {/* Featured articles */}
        {featured.length > 0 && (
          <section className="rihla-articles-section">
            <div className="rihla-articles-section-head">
              <span className="rihla-section-badge">⭐ مميزة</span>
              <h2>المقالات المختارة</h2>
            </div>
            <div className="rihla-articles-grid featured">
              {featured.map(a => (
                <ArticleCard key={a.id} article={a} size="large" />
              ))}
            </div>
          </section>
        )}

        {/* All other articles */}
        {rest.length > 0 && (
          <section className="rihla-articles-section">
            {featured.length > 0 && (
              <div className="rihla-articles-section-head">
                <h2>جميع المقالات</h2>
              </div>
            )}
            <div className="rihla-articles-grid">
              {rest.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="rihla-articles-empty">
            <span>📭</span>
            <p>لا توجد مقالات في هذه الفئة حتى الآن.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article, size = 'normal' }: { article: Article; size?: 'large' | 'normal' }) {
  return (
    <a href={`/articles/${article.id}`} className={`rihla-article-card-link${size === 'large' ? ' large' : ''}`}>
      <div className="rihla-acard-img">
        {article.image_url
          ? <img src={article.image_url} alt={article.title} />
          : <div className="rihla-acard-img-placeholder">{categoryEmoji(article.category)}</div>
        }
        {article.featured && <span className="rihla-acard-star">⭐</span>}
      </div>
      <div className="rihla-acard-body">
        <span className="rihla-acard-cat">{CATEGORY_LABELS[article.category] ?? article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <span className="rihla-acard-date">{formatDate(article.date)}</span>
      </div>
    </a>
  )
}

function categoryEmoji(cat: string) {
  const map: Record<string, string> = {
    'البنوك': '🏦', 'شرائح الاتصال': '📱', 'الجامعات': '🎓',
    'العمل': '💼', 'Ausbildung': '🛠', 'التأشيرة والأوراق': '📄', 'السكن': '🏠',
  }
  return map[cat] ?? '📰'
}

function formatDate(d: string) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch { return d }
}
