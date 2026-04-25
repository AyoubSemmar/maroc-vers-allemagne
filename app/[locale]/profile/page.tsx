import { redirect } from 'next/navigation'
import type { AppLocale } from '@/i18n/routing'

// The profile UI now lives under /dashboard/profile so it shares the dashboard
// shell (sidebar + topbar). Keep this route as a permanent redirect so old
// links (emails, bookmarks, etc.) continue to work.
export default async function ProfileRedirect({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/profile`)
}
