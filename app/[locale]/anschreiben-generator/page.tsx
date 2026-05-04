import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import AnschreibenClient from './AnschreibenClient'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import './anschreiben.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'anschreiben' })
  return buildLocaleMetadata({
    locale,
    path: '/anschreiben-generator',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default function AnschreibenPage() {
  return <AnschreibenClient />
}
