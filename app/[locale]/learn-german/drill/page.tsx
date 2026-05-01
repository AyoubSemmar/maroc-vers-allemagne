import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ConjugationDrill from '@/components/learn-german/ConjugationDrill'
import type { AppLocale } from '@/i18n/routing'
import './drill.css'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'learnGerman.drill' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default async function ConjugationDrillPage({ params }: Props) {
  await params
  return <ConjugationDrill />
}
