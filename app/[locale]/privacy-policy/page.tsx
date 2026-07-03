import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import PrivacyPolicyContent from './PrivacyPolicyContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.privacy' })
  return buildLocaleMetadata({
    locale,
    path: '/privacy-policy',
    title: `${t('title')} — GoGermany`,
    description: t('subtitle'),
  })
}

export default function PrivacyPolicyPage() {
  return (
    <ProvideNamespaces only={['static']}>
      <PrivacyPolicyContent />
    </ProvideNamespaces>
  )
}
