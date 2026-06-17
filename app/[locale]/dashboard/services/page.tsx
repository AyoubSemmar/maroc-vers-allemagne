import { notFound } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'
import { CONSULTATIONS_ENABLED } from '@/lib/featureFlags'
import Services from './Services'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  // Consultation service is paused — the whole services catalogue is hidden.
  if (!CONSULTATIONS_ENABLED) notFound()
  return <Services locale={locale} />
}
