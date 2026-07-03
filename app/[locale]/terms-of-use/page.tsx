import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import TermsOfUseContent from './TermsOfUseContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.terms' })
  return buildLocaleMetadata({
    locale,
    path: '/terms-of-use',
    title: `${t('title')} — GoGermany`,
    description: t('subtitle'),
  })
}

export default function TermsOfUsePage() {
  return (
    <ProvideNamespaces only={['static']}>
      <TermsOfUseContent />
    </ProvideNamespaces>
  )
}
