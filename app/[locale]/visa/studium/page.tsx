import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import VisaGuide from '@/components/visa/VisaGuide'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'visaGuide.studium' })
  return buildLocaleMetadata({
    locale,
    path: '/visa/studium',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default async function VisaStudiumPage({ params }: Props) {
  const { locale } = await params
  return <VisaGuide flow="studium" locale={locale} />
}
