// The community listings board was retired in favour of the Furnished
// Housing finder. This dashboard route redirects to the finder wrapper.
import { redirect } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'

export default async function DashboardHousingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/furnished-housing`)
}
