import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ToolSeoSection from '@/components/seo/ToolSeoSection'
import RelatedTools from '@/components/seo/RelatedTools'
import MigrationTimeline from './MigrationTimeline'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'migrationTimeline' })
  return buildLocaleMetadata({
    locale,
    path: '/tools/migration-timeline',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default async function MigrationTimelinePage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <MigrationTimeline locale={locale} />
      <ToolSeoSection locale={locale} namespace="migrationTimeline" />
      <RelatedTools locale={locale} current="migrationTimeline" />
    </>
  )
}
