import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import DisclaimerContent from './DisclaimerContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.disclaimer' })
  return buildLocaleMetadata({
    locale,
    path: '/disclaimer',
    title: `${t('title')} — GoGermany`,
    description: t('subtitle'),
  })
}

// Server wrapper: the 'static' namespace (~86 KB) is stripped from the global
// client bundle (lib/i18n-heavy); re-provide it here for the legal pages only.
export default function DisclaimerPage() {
  return (
    <ProvideNamespaces only={['static']}>
      <DisclaimerContent />
    </ProvideNamespaces>
  )
}
