import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { localizeRows } from '@/lib/i18n-content'
import ArticlesClient from './ArticlesClient'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })

  // Featured articles first, then by date descending
  const { data: rawArticles } = await supabase
    .from('articles')
    .select('id, title, summary, category, date, image_url, featured, translations')
    .order('featured', { ascending: false })
    .order('date',     { ascending: false })

  // localizeRow has already overridden title/summary with the per-locale
  // text, so the translations JSONB blob (which still carries `content`
  // and `faqs` for every other locale) is dead weight on the wire.
  const localized = localizeRows(rawArticles as any, locale) as any[]
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
