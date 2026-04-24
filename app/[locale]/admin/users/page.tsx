import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import type { AppLocale } from '@/i18n/routing'
import AdminUsersClient from './AdminUsersClient'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  const { locale } = await params
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect(`/${locale}/auth/login`)
  if (!(await isAdmin(user.id))) redirect(`/${locale}`)

  return <AdminUsersClient />
}
