import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, routing, type AppLocale } from '@/i18n/routing'
import { localizeRow, localizeRows } from '@/lib/i18n-content'
import { articleListFields, applyLocaleAvailability, rehydrateTranslationsList } from '@/lib/article-list-select'
import { catLabelFrom } from '@/lib/article-cat'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import RelevantToolCta from '@/components/articles/RelevantToolCta'
import AdRail from '@/components/ads/AdRail'
import AdSlot from '@/components/ads/AdSlot'
import ArticleContent from '@/components/ArticleContent'
import ArticleComments from '@/components/ArticleComments'
import HelpfulButton from '@/components/HelpfulButton'
import FAQAccordion from '@/components/FAQAccordion'
import ShareButtons from '@/components/ShareButtons'

// 1-hour ISR for individual articles. They change rarely; this slashes
// Supabase egress on the most-deep-linked routes.
export const revalidate = 3600

const SITE_URL = 'https://www.gogermany.ma'

/** Per-article metadata pulls the localised title/summary/image straight
 *  from the DB row so each article × locale gets a unique <title>,
 *  description, OG image and canonical. Hreflang alternates are declared
 *  ONLY for the locales the article was actually written in
 *  (translations._meta.locales); a locale it wasn't translated into renders
 *  a fallback for UX but is marked noindex so Google doesn't index the
 *  duplicate. Without the per-locale title, Google saw many pages with the
 *  same generic GoGermany title — none of them ranked. */
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
  const image       = article.image_url || `${SITE_URL}/opengraph-image`

  // Locales this article was actually written in (see memory
  // article-locale-policy). Older articles with no _meta predate the policy
  // and are treated as available in every locale, matching sitemap.ts.
  const metaLocs: string[] = Array.isArray((row as any)?.translations?._meta?.locales)
    ? (row as any).translations._meta.locales
    : [...routing.locales]
  const available = routing.locales.filter((l) => metaLocs.includes(l))
  const isAvailable = available.includes(locale)

  // Hreflang must list ONLY the locales the article exists in — otherwise
  // every country-specific article advertises 12 URLs, 8 of which serve
  // duplicate fallback content and self-canonicalise. Google then can't pick
  // a canonical → "duplicate without user-selected canonical" in GSC.
  const languages: Record<string, string> = {}
  for (const l of available) {
    languages[l] = `${SITE_URL}/${l}/articles/${id}`
  }

  // For a locale the article was NOT translated into, the page still renders
  // a fallback (English/Arabic) for UX, but it must NOT be indexed — it's a
  // duplicate. Point its canonical at the primary available locale and mark
  // it noindex,follow so Google drops the duplicate while still crawling out.
  const primaryLocale = available.includes('en') ? 'en' : available.includes('ar') ? 'ar' : available[0] ?? locale
  // x-default → the primary available locale, so Google has a single fallback
  // for unmatched languages (mirrors buildLocaleMetadata for the rest of the site).
  languages['x-default'] = `${SITE_URL}/${primaryLocale}/articles/${id}`
  const canonical = isAvailable
    ? `${SITE_URL}/${locale}/articles/${id}`
    : `${SITE_URL}/${primaryLocale}/articles/${id}`

  return {
    title,
    description,
    ...(isAvailable ? {} : { robots: { index: false, follow: true } }),
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

  // Internal linking is a key SEO lever on a low-authority site: more relevant
  // cross-links = more crawl paths + equity spread + engagement, and fewer
  // orphaned older articles. Pull a wider related set (up to 8), and mix newest
  // with a deterministic-by-id spread so older articles in a big category also
  // get linked, not just the most recent few.
  const { data: rawRelated } = await applyLocaleAvailability(
    supabase
      .from('articles')
      .select(articleListFields(locale))
      .eq('category', article.category)
      .neq('id', id)
      .order('date', { ascending: false })
      .limit(60),
    locale,
  )
  const relatedRows = rehydrateTranslationsList(rawRelated as any, locale) as any[]
  // Rotate the pick by this article's id so different articles surface
  // different neighbours (spreading internal links across the whole category),
  // while staying stable per-article for ISR caching.
  const RELATED_COUNT = 8
  let relatedPick = relatedRows
  if (relatedRows.length > RELATED_COUNT) {
    const seed = Number(id) || 0
    const start = seed % relatedRows.length
    const rotated = [...relatedRows.slice(start), ...relatedRows.slice(0, start)]
    // Keep the 3 newest (most relevant/fresh) + a spread of others.
    const newest = relatedRows.slice(0, 3)
    const rest = rotated.filter((r) => !newest.some((n) => n.id === r.id))
    relatedPick = [...newest, ...rest].slice(0, RELATED_COUNT)
  }
  const related = localizeRows(relatedPick, locale)

  function catLabel(cat: string): string {
    return catLabelFrom(t as any, cat)
  }

  // Render the body split at H2 section breaks, dropping an in-content ad after
  // the intro and then every few sections — so a long article carries several
  // impressions as the reader scrolls, not just one. The first unit is the
  // Native Banner (blends best); the rest are duplicable 300×250 banners.
  function renderBody(md: string) {
    if (!md || md.length < 900) return <ArticleContent content={md} />
    const sections = md.split(/(?=\n## )/g) // keep each "## …" with its section
    if (sections.length < 2) return <ArticleContent content={md} />

    const out: ReactNode[] = []
    let ads = 0
    sections.forEach((seg, i) => {
      out.push(<ArticleContent key={`sec-${i}`} content={seg} />)
      const isLast = i === sections.length - 1
      // After the intro (i===0), then every 3rd section; never after the last.
      const due = i === 0 || i % 3 === 0
      if (!isLast && due) {
        out.push(
          <AdSlot
            key={`ad-${i}`}
            format="in-article"
            forceBanner={ads > 0}
            className="my-8"
          />,
        )
        ads++
      }
    })
    return <>{out}</>
  }

  // ── JSON-LD: Article + FAQPage rich-result schema ────────────
  const SITE = 'https://www.gogermany.ma'
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.date,
    image: article.image_url ? [article.image_url] : undefined,
    inLanguage: locale,
    // Editorial-team authorship for E-E-A-T, linked to the about page that
    // describes who writes/reviews the content.
    author: {
      '@type': 'Organization',
      name: 'GoGermany Editorial Team',
      url: `${SITE}/${locale}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GoGermany.ma',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/${locale}/articles/${article.id}` },
    articleSection: catLabel(article.category),
  }
  // NB: the FAQ JSON-LD is emitted by <FAQAccordion> (co-located with the
  // visible FAQ). Don't duplicate it here — two FAQPage nodes on one page
  // make Google discard both.

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      {/* eslint-disable react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <AdRail className="py-12">
        <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Breadcrumbs
            visible
            items={[
              { name: 'GoGermany', path: `/${locale}` },
              { name: catLabel(article.category), path: `/${locale}/categories/${encodeURIComponent(article.category)}` },
              { name: article.title, path: `/${locale}/articles/${article.id}` },
            ]}
          />
        </div>

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

        {/* Visible byline — E-E-A-T authorship signal, links to the
            editorial team's about page. */}
        <p className="text-xs text-gray-400 mb-6">
          <Link href="/about" className="hover:underline">{t('byline')}</Link>
          {' · '}{article.date}
        </p>

        <p className="text-lg text-gray-600 mb-8 border-r-4 border-green-500 pr-4">
          {article.summary}
        </p>

        {renderBody(article.content)}

        {/* Topic-cluster internal link: send the reader to the tool that
            matches this article's category (SEO internal links + conversion). */}
        <RelevantToolCta locale={locale} category={article.category} />

        <FAQAccordion faqs={article.faqs || []} />

        <ShareButtons title={article.title} />

        <HelpfulButton
          articleId={article.id}
          initialYes={article.helpful_yes ?? 0}
          initialNo={article.helpful_no ?? 0}
        />

        <ArticleComments articleId={article.id} />

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
      </AdRail>
    </div>
  )
}
