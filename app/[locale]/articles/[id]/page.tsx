import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { localizeRow, localizeRows } from '@/lib/i18n-content'
import ArticleContent from '@/components/ArticleContent'
import HelpfulButton from '@/components/HelpfulButton'
import FAQAccordion from '@/components/FAQAccordion'
import ShareButtons from '@/components/ShareButtons'

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

  const { data: rawRelated } = await supabase
    .from('articles')
    .select('id, title, summary, category, date, image_url, translations')
    .eq('category', article.category)
    .neq('id', id)
    .order('date', { ascending: false })
    .limit(3)
  const related = localizeRows(rawRelated as any, locale)

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
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
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
                    <img src={r.image_url} alt={r.title} className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
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
