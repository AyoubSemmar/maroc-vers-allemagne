'use client'

import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import Pager, { usePageSize } from '@/components/Pager'

type Article = {
  id: number
  title: string
  summary: string
  category: string
  date: string
  image_url: string | null
  featured: boolean
}

const LOCALE_TO_INTL: Record<AppLocale, string> = {
  ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE',
}

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const t = useTranslations('articles')
  const locale = useLocale() as AppLocale
  const [activeCategory, setActiveCategory] = useState<string>('__ALL__')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const categories = Array.from(new Set(articles.map(a => a.category)))

  const filtered = activeCategory === '__ALL__'
    ? articles
    : articles.filter(a => a.category === activeCategory)

  const featured = filtered.filter(a => a.featured)
  const rest     = filtered.filter(a => !a.featured)

  // Paginate the non-featured list (10 mobile / 20 desktop). Reset to
  // page 1 whenever the filter changes so the user doesn't end up on a
  // page that no longer exists.
  const pageSize = usePageSize()
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [activeCategory])
  const totalPages = Math.max(1, Math.ceil(rest.length / pageSize))
  const pageRest = rest.slice((page - 1) * pageSize, page * pageSize)

  function catLabel(cat: string): string {
    // t.raw to avoid an error for unknown categories — falls back to raw cat
    try { return t(`cat.${cat}` as any) } catch { return cat }
  }

  function formatDate(d: string) {
    if (!d) return ''
    try {
      return new Date(d).toLocaleDateString(LOCALE_TO_INTL[locale], {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return d }
  }

  function categoryEmoji(cat: string) {
    const map: Record<string, string> = {
      'البنوك': '🏦', 'شرائح الاتصال': '📱', 'الجامعات': '🎓',
      'العمل': '💼', 'Ausbildung': '🛠', 'التأشيرة والأوراق': '📄', 'السكن': '🏠',
    }
    return map[cat] ?? '📰'
  }

  return (
    <div dir={dirFor(locale)}>
      {/* Category filter pills */}
      <div className="rihla-articles-filter">
        <div className="rihla-articles-filter-inner">
          <button
            onClick={() => setActiveCategory('__ALL__')}
            className={`rihla-cat-pill${activeCategory === '__ALL__' ? ' active' : ''}`}
          >
            {t('allFilter')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rihla-cat-pill${activeCategory === cat ? ' active' : ''}`}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="rihla-articles-body wrap">
        {/* View-mode toggle: grid ⇄ list */}
        <div className="rihla-articles-view" role="group" aria-label="View mode">
          <button
            type="button"
            className={`rihla-view-btn${view === 'grid' ? ' active' : ''}`}
            onClick={() => setView('grid')}
            aria-pressed={view === 'grid'}
            aria-label="Grid view"
            title="Grid"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            type="button"
            className={`rihla-view-btn${view === 'list' ? ' active' : ''}`}
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
            aria-label="List view"
            title="List"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <line x1="2" y1="3.5" x2="14" y2="3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="2" y1="12.5" x2="14" y2="12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Featured articles */}
        {featured.length > 0 && (
          <section className="rihla-articles-section">
            <div className="rihla-articles-section-head">
              <span className="rihla-section-badge">{t('featuredBadge')}</span>
              <h2>{t('featuredHeading')}</h2>
            </div>
            <div className={`rihla-articles-grid featured${view === 'list' ? ' list' : ''}`}>
              {featured.map(a => (
                <ArticleCard key={a.id} article={a} size={view === 'list' ? 'normal' : 'large'} view={view}
                  catLabel={catLabel} categoryEmoji={categoryEmoji} formatDate={formatDate} />
              ))}
            </div>
          </section>
        )}

        {/* All other articles (paginated: 10 mobile / 20 desktop) */}
        {rest.length > 0 && (
          <section id="articles-rest" className="rihla-articles-section">
            {featured.length > 0 && (
              <div className="rihla-articles-section-head">
                <h2>{t('allHeading')}</h2>
              </div>
            )}
            <div className={`rihla-articles-grid${view === 'list' ? ' list' : ''}`}>
              {pageRest.map(a => (
                <ArticleCard key={a.id} article={a} view={view}
                  catLabel={catLabel} categoryEmoji={categoryEmoji} formatDate={formatDate} />
              ))}
            </div>
            <Pager page={page} total={totalPages} onChange={setPage} scrollToId="articles-rest" />
          </section>
        )}

        {filtered.length === 0 && (
          <div className="rihla-articles-empty">
            <span>📭</span>
            <p>{t('emptyCategory')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({
  article, size = 'normal', view = 'grid', catLabel, categoryEmoji, formatDate,
}: {
  article: Article; size?: 'large' | 'normal'; view?: 'grid' | 'list'
  catLabel: (cat: string) => string
  categoryEmoji: (cat: string) => string
  formatDate: (d: string) => string
}) {
  return (
    <Link href={`/articles/${article.id}`} className={`rihla-article-card-link${size === 'large' ? ' large' : ''}${view === 'list' ? ' list' : ''}`}>
      <div className="rihla-acard-img">
        {article.image_url
          ? // eslint-disable-next-line @next/next/no-img-element
            <img src={article.image_url} alt={article.title} loading="lazy" decoding="async" />
          : <div className="rihla-acard-img-placeholder">{categoryEmoji(article.category)}</div>
        }
        {article.featured && (
          <span className="rihla-acard-star" aria-label="Featured" title="Featured">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.5l2.94 6.34 6.95.74-5.21 4.74 1.46 6.83L12 17.6l-6.14 3.55 1.46-6.83-5.21-4.74 6.95-.74L12 2.5z" />
            </svg>
          </span>
        )}
      </div>
      <div className="rihla-acard-body">
        <span className="rihla-acard-cat">{catLabel(article.category)}</span>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
        <span className="rihla-acard-date">{formatDate(article.date)}</span>
      </div>
    </Link>
  )
}
