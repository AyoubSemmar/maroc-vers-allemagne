import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import JsonLd from '@/components/seo/JsonLd'
import ArticleContent from '@/components/ArticleContent'
import Icon from '@/components/ui/Icon'
import { grammarTopics, localizedTopic, plainDescription } from '@/lib/german-data/grammar-topics'
import '../../learn-german.css'
import '../grammar.css'

export function generateStaticParams() {
  return grammarTopics.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const data = localizedTopic(slug, locale)
  if (!data) return {}
  const t = await getTranslations({ locale, namespace: 'grammarSeo' })
  const title = `${data.lesson.grammar.title} — ${t('metaTitleSuffix', { level: data.topic.levelId })} | GoGermany`
  const description = plainDescription(data.lesson.grammar.content)
  return buildLocaleMetadata({ locale, path: `/learn-german/grammar/${slug}`, title, description })
}

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>
}) {
  const { locale, slug } = await params
  const data = localizedTopic(slug, locale)
  if (!data) notFound()
  const { lesson, topic, prev, next } = data
  const g = lesson.grammar
  const t = await getTranslations({ locale, namespace: 'grammarSeo' })
  const dir = dirFor(locale)
  const levelPath = `/learn-german/${topic.levelId.toLowerCase()}`
  const SITE = 'https://www.gogermany.ma'

  return (
    <div className="lg-root" dir={dir}>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'LearningResource',
            name: g.title,
            inLanguage: locale,
            learningResourceType: 'Grammar explanation',
            educationalLevel: topic.levelId,
            teaches: g.title,
            isAccessibleForFree: true,
            url: `${SITE}/${locale}/learn-german/grammar/${slug}`,
            provider: { '@type': 'Organization', name: 'GoGermany', url: SITE },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Learn German', item: `${SITE}/${locale}/learn-german` },
              { '@type': 'ListItem', position: 2, name: t('breadcrumbGrammar'), item: `${SITE}/${locale}/learn-german/grammar` },
              { '@type': 'ListItem', position: 3, name: g.title, item: `${SITE}/${locale}/learn-german/grammar/${slug}` },
            ],
          },
        ]}
      />

      <div className="gs-wrap">
        <nav className="gs-crumbs" aria-label="Breadcrumb">
          <Link href="/learn-german">Learn German</Link>
          <span className="gs-crumb-sep">›</span>
          <Link href="/learn-german/grammar">{t('breadcrumbGrammar')}</Link>
          <span className="gs-crumb-sep">›</span>
          <span className="gs-crumb-current">{g.title}</span>
        </nav>

        <span className="gs-level-badge">{topic.levelId}</span>
        <h1 className="gs-title">{g.title}</h1>

        <Link href={levelPath} className="gs-practice">
          <Icon name="play" size={16} /> {t('practice')}
        </Link>

        <article className="gs-content">
          <ArticleContent content={g.content} />
        </article>

        {Array.isArray(g.tables) && g.tables.length > 0 && (
          <section className="gs-section">
            {g.tables.map((tbl, i) => (
              <div key={i} className="gs-table-block">
                {tbl.title && <h3 className="gs-h3">{tbl.title}</h3>}
                <div className="gs-table-scroll">
                  <table className="gs-table">
                    {tbl.headers?.length > 0 && (
                      <thead>
                        <tr>{tbl.headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
                      </thead>
                    )}
                    <tbody>
                      {tbl.rows.map((r, ri) => (
                        <tr key={ri} className={r.highlight ? 'gs-row-hi' : undefined}>
                          {r.cells.map((c, ci) => <td key={ci}>{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tbl.note && <p className="gs-note">{tbl.note}</p>}
              </div>
            ))}
          </section>
        )}

        {Array.isArray(g.rules) && g.rules.length > 0 && (
          <section className="gs-section">
            <h2 className="gs-h2">{t('rulesLabel')}</h2>
            <div className="gs-rules">
              {g.rules.map((r, i) => (
                <div key={i} className="gs-rule">
                  <p className="gs-rule-text">{r.rule}</p>
                  <p className="gs-rule-ex" lang="de" dir="ltr">{r.example}</p>
                  <p className="gs-rule-tr">{r.translation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {Array.isArray(g.examples) && g.examples.length > 0 && (
          <section className="gs-section">
            <h2 className="gs-h2">{t('examplesLabel')}</h2>
            <ul className="gs-examples">
              {g.examples.map((ex, i) => <li key={i} lang="de" dir="ltr">{ex}</li>)}
            </ul>
          </section>
        )}

        {g.tip && (
          <aside className="gs-tip">
            <span className="gs-tip-label"><Icon name="lightbulb" size={16} /> {t('tipLabel')}</span>
            <p>{g.tip}</p>
          </aside>
        )}

        <div className="gs-nav">
          {prev ? (
            <Link href={`/learn-german/grammar/${prev.slug}`} className="gs-nav-link">‹ {prev.enTitle}</Link>
          ) : <span />}
          {next && (
            <Link href={`/learn-german/grammar/${next.slug}`} className="gs-nav-link gs-nav-next">{next.enTitle} ›</Link>
          )}
        </div>

        <Link href="/learn-german/grammar" className="gs-all">{t('allTopics')} →</Link>
      </div>
    </div>
  )
}
