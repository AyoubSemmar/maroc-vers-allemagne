import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import LivingCostCalculator from './LivingCostCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'livingCost' })
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  }
}

export default async function LivingCostCalculatorPage({ params }: Props) {
  const { locale } = await params
  return <LivingCostCalculator locale={locale} />
}
