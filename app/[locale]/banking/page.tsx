import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContentHub, { type HubData, type HubItem } from '@/components/ContentHub'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.banking' })
  return buildLocaleMetadata({
    locale,
    path: '/banking',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default async function BankingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.banking' })
  const data: HubData = {
    eyebrow: t('eyebrow'),
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    items: t.raw('items') as HubItem[],
  }
  return <ContentHub data={data} locale={locale} />
}
