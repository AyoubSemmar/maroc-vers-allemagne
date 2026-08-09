import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import JsonLd from '@/components/seo/JsonLd'
import Icon from '@/components/ui/Icon'
import { grammarTopicsByLevel } from '@/lib/german-data/grammar-topics'
import '../learn-german.css'
import './grammar.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grammarSeo' })
  return buildLocaleMetadata({
    locale,
    path: '/learn-german/grammar',
    title: t('hubMetaTitle'),
    description: t('hubMetaDesc'),
  })
}

export default async function GrammarHubPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grammarSeo' })
  const dir = dirFor(locale)
  const groups = grammarTopicsByLevel(locale)
  const SITE = 'https://www.gogermany.ma'

  return (
    <div className="lg-root" dir={dir}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Learn German', item: `${SITE}/${locale}/learn-german` },
            { '@type': 'ListItem', position: 2, name: t('breadcrumbGrammar'), item: `${SITE}/${locale}/learn-german/grammar` },
          ],
        }}
      />

      <header className="lg-hero">
        <div className="wrap">
          <span className="lg-eyebrow"><span className="lg-eyebrow-dot" />{t('eyebrow')}</span>
          <h1 className="lg-title">{t('hubTitle')}</h1>
          <p className="lg-subtitle">{t('hubIntro')}</p>
        </div>
      </header>

      <div className="gs-wrap">
        {groups.map(({ level, topics }) => (
          <section key={level.id} className="gs-level-group">
            <h2 className="gs-level-heading">
              <span className="gs-level-badge">{level.id}</span>
              <span>{level.title}</span>
            </h2>
            <ul className="gs-topic-list">
              {topics.map(({ topic, title }) => (
                <li key={topic.slug}>
                  <Link href={`/learn-german/grammar/${topic.slug}`} className="gs-topic-link">
                    <Icon name="book" size={16} />
                    <span>{title}</span>
                    <span className="gs-topic-arrow">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
