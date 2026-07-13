// The community listings board was retired in favour of the Furnished
// Housing finder. This route now redirects there so old links/bookmarks
// keep working.
import { redirect } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'

export default async function ListingsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  redirect(`/${locale}/tools/furnished-housing`)
}
