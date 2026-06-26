// Renders the Ausbildung visa guide inside the dashboard shell.
// Re-uses the same client component as /visa/ausbildung.
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import VisaGuide from '@/components/visa/VisaGuide'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import type { AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'visaGuide.ausbildung' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default async function DashboardVisaAusbildungPage({ params }: Props) {
  const { locale } = await params
  return (
    <ProvideNamespaces only={['visaGuide']}>
      <VisaGuide flow="ausbildung" locale={locale} />
    </ProvideNamespaces>
  )
}
