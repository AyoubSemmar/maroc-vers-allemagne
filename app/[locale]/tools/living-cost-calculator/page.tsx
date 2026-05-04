import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ToolSeoSection from '@/components/seo/ToolSeoSection'
import LivingCostCalculator from './LivingCostCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'livingCost' })
  return buildLocaleMetadata({
    locale,
    path: '/tools/living-cost-calculator',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default async function LivingCostCalculatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <LivingCostCalculator locale={locale} />
      <ToolSeoSection locale={locale} namespace="livingCost" />
    </>
  )
}
