import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, routing, type AppLocale } from '@/i18n/routing'
import { localizeRow, localizeRows } from '@/lib/i18n-content'
import { articleListFields, applyLocaleAvailability, rehydrateTranslationsList } from '@/lib/article-list-select'
import ArticleContent from '@/components/ArticleContent'
import HelpfulButton from '@/components/HelpfulButton'
import FAQAccordion from '@/components/FAQAccordion'
import ShareButtons from '@/components/ShareButtons'

// 1-hour ISR for individual articles. They change rarely; this slashes
// Supabase egress on the most-deep-linked routes.
export const revalidate = 3600

const SITE_URL = 'https://gogermany.ma'

/** Per-article metadata pulls the localised title/summary/image straight
 *  from the DB row so each of the 136 articles × 4 locales gets a
 *  unique <title>, description, OG image and canonical. Hreflang
 *  alternates declared for all 4 locales (the translations JSONB has
 *  the same article in each language). Without this, Google sees 544
 *  pages with the same generic GoGermany title — none of them rank. */
export async function generateMetadata({
  params,
}: { params: Promise<{ id: string; locale: AppLocale }> }): Promise<Metadata> {
  const { id, locale } = await params

  const { data: row } = await supabase
    .from('articles')
    .select('id, title, summary, image_url, date, category, translations')
    .eq('id', id)
    .single()

  if (!row) {
    return { title: 'Article not found — GoGermany' }
  }

  const article: any = localizeRow(row as any, locale)
  const title       = `${article.title} — GoGermany`
  const description = (article.summary as string)?.slice(0, 158) || `Read on GoGermany — guides for moving to Germany.`
  const canonical   = `${SITE_URL}/${locale}/articles/${id}`
  const image       = article.image_url || `${SITE_URL}/opengraph-image`

  // Hreflang alternates — every locale has its own URL for this same
  // article (the translations JSONB serves the right language per locale).
  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}/articles/${id}`
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'GoGermany',
      locale,
      images: image ? [{ url: image, width: 1200, height: 630, alt: article.title }] : undefined,
      publishedTime: article.date || undefined,
      section: article.category || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string; locale: AppLocale }> }) {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: 'articles' })

  const { data: rawArticle } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  const article: any = rawArticle ? localizeRow(rawArticle as any, locale) : null

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
        <p className="text-gray-500">{t('notFound')}</p>
      </div>
    )
  }

  const { data: rawRelated } = await applyLocaleAvailability(
    supabase
      .from('articles')
      .select(articleListFields(locale))
      .eq('category', article.category)
      .neq('id', id)
      .order('date', { ascending: false })
      .limit(3),
    locale,
  )
  const related = localizeRows(rehydrateTranslationsList(rawRelated as any, locale), locale)

  function catLabel(cat: string): string {
    try { return t(`cat.${cat}` as any) } catch { return cat }
  }

  // ── JSON-LD: Article + FAQPage rich-result schema ────────────
  const SITE = 'https://gogermany.ma'
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    image: article.image_url ? [article.image_url] : undefined,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'GoGermany.ma' },
    publisher: {
      '@type': 'Organization',
      name: 'GoGermany.ma',
      url: SITE,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/${locale}/articles/${article.id}` },
    articleSection: catLabel(article.category),
  }
  const faqLd = Array.isArray(article.faqs) && article.faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.q ?? f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.a ?? f.answer },
        })),
      }
    : null

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      {/* eslint-disable react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-green-700 hover:underline mb-6 block">
          {t('backToHome')}
        </Link>

        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-72 object-cover rounded-xl mb-6"
          />
        )}

        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
          {catLabel(article.category)}
        </span>

        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          {article.title}
        </h1>

        <p className="text-xs text-gray-400 mb-6">{article.date}</p>

        <p className="text-lg text-gray-600 mb-8 border-r-4 border-green-500 pr-4">
          {article.summary}
        </p>

        <ArticleContent content={article.content} />

        <FAQAccordion faqs={article.faqs || []} />

        <ShareButtons title={article.title} />

        <HelpfulButton
          articleId={article.id}
          initialYes={article.helpful_yes ?? 0}
          initialNo={article.helpful_no ?? 0}
        />

        {related && related.length > 0 && (
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('related')}</h2>
            <div className="flex flex-col gap-4">
              {related.map((r: any) => (
                <Link
                  key={r.id}
                  href={`/articles/${r.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow flex items-center gap-4 p-4"
                >
                  <div className="flex-1">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                      {catLabel(r.category)}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2">{r.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.summary}</p>
                    <p className="text-xs text-gray-400 mt-2">{r.date}</p>
                  </div>
                  {r.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image_url} alt={r.title} loading="lazy" decoding="async" width={96} height={64} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
