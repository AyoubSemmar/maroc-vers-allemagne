// Auth: the admin shell layout already gated the cookie. The actual
// API endpoint /api/admin/grant separately enforces a Supabase profile
// .is_admin check, so this page can render for any cookie-authenticated
// admin — operations will fail loudly if the calling Supabase user isn't
// also flagged as is_admin.
import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import type { AppLocale } from '@/i18n/routing'
import AdminUsersClient from './AdminUsersClient'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  await params
  // Probe whether the caller is *also* a Supabase admin so we can show
  // a banner. This is informational only — actual writes are enforced
  // server-side.
  let supabaseAdminOk = false
  try {
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    supabaseAdminOk = !!(user && (await isAdmin(user.id)))
  } catch {}

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">User management</h1>
          <p className="adm-page-sub">Look up users by email, grant credits, set premium expiry, or unlock specific templates / German levels. All operations are audited and require a Supabase admin session — operations from a non-admin session will return 403.</p>
        </div>
      </header>

      {!supabaseAdminOk && (
        <div className="adm-banner adm-banner--warn">
          ⚠️ You&rsquo;re signed in to the admin console (cookie) but <strong>not</strong> as a Supabase admin user. Grant operations will fail with 403. Sign in to <code>/auth/login</code> with an account whose <code>profiles.is_admin = true</code>.
        </div>
      )}

      <AdminUsersClient />
    </>
  )
}
