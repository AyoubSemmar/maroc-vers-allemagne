import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import EligibilityChecker from './EligibilityChecker'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'eligibilityChecker' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default async function EligibilityCheckerPage({ params }: Props) {
  const { locale } = await params
  return <EligibilityChecker locale={locale} />
}
