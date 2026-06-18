import { notFound } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'
import { CONSULTATIONS_ENABLED } from '@/lib/featureFlags'
import Services from './Services'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  if (!CONSULTATIONS_ENABLED) notFound()
  const { locale } = await params
  return <Services locale={locale} />
}
