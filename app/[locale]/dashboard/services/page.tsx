import type { AppLocale } from '@/i18n/routing'
import Services from './Services'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  return <Services locale={locale} />
}
