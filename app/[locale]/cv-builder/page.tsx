import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CVBuilderClient from './CVBuilderClient'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ToolSeoSection from '@/components/seo/ToolSeoSection'
import './cv-builder.css'

export async function generateMetadata({ params }: { params: Promise<{ locale: AppLocale }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cvBuilder' })
  return buildLocaleMetadata({
    locale,
    path: '/cv-builder',
    title: t('metaTitle'),
    description: t('metaDesc'),
  })
}

export default async function CVBuilderPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  return (
    <>
      <CVBuilderClient />
      <ToolSeoSection locale={locale} namespace="cvBuilder" />
    </>
  )
}
