// Articles and listings were split into their own pages. Keep this route as a
// redirect so old bookmarks / links land on the new Articles page.
import { redirect } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'

export default async function AdminContentRedirect({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  redirect(`/${locale}/console-x7k9/articles`)
}
