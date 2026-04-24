import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CVBuilderClient from './CVBuilderClient'
import type { AppLocale } from '@/i18n/routing'
import './cv-builder.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cvBuilder' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default function CVBuilderPage() {
  return <CVBuilderClient />
}
