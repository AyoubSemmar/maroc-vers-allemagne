import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContentHub, { type HubData, type HubItem } from '@/components/ContentHub'
import type { AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.simcards' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default async function SimcardsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.simcards' })
  const data: HubData = {
    eyebrow: t('eyebrow'),
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    items: t.raw('items') as HubItem[],
  }
  return <ContentHub data={data} locale={locale} />
}
