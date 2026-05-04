import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { localizeRows } from '@/lib/i18n-content'
import { ARTICLE_LIST_FIELDS, rehydrateTranslationsList } from '@/lib/article-list-select'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ArticlesClient from './ArticlesClient'

// 10-min ISR: list pages don't need to reflect a new article instantly,
// and the cache layer cuts Supabase egress by 1-2 orders of magnitude.
export const revalidate = 600

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })
  return buildLocaleMetadata({
    locale,
    path: '/articles',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })

  // Featured articles first, then by date descending. Lightweight select
  // grabs only title/summary per locale (not the full translations JSONB)
  // — see lib/article-list-select.ts for the egress story.
  const { data: rawArticles } = await supabase
    .from('articles')
    .select(ARTICLE_LIST_FIELDS)
    .order('featured', { ascending: false })
    .order('date',     { ascending: false })

  const localized = localizeRows(rehydrateTranslationsList(rawArticles as any), locale) as any[]
  const articles = localized.map(({ translations, ...rest }) => rest)
  const total = articles.length
  const featCount = articles.filter((a: any) => a.featured).length

  return (
    <div dir={dirFor(locale)}>
      {/* Page header */}
      <header className="rihla-articles-header">
        <div className="wrap">
          <p className="rihla-articles-eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="rihla-articles-subtitle">
            {t('subtitle')}
          </p>
          <div className="rihla-articles-stats">
            <span>{t('stats.articles', { n: total })}</span>
            <span>{t('stats.featured', { n: featCount })}</span>
          </div>
        </div>
      </header>

      <ArticlesClient articles={(articles as any) ?? []} />
    </div>
  )
}
