// Admin shell layout — wraps every page under /admin/* with the unified
// dashboard chrome. Login is gated by the ADMIN_PASSWORD cookie set by
// app/[locale]/admin/actions.js → login(). Children render inside the
// shell content area only when the cookie is present; otherwise the
// login screen is shown directly (without the shell).
import { cookies } from 'next/headers'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { login } from './actions.js'
import { createClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/entitlements'
import '@/components/admin/admin.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params
  const cookieStore = await cookies()
  let isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'

  // Identity-based access: a signed-in Supabase user flagged profiles.is_admin
  // gets straight in — no shared password needed. This is the "log in with my
  // account and the console opens" path.
  if (!isAuthenticated) {
    try {
      const sb = await createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user && (await isAdmin(user.id))) isAuthenticated = true
    } catch {}
  }

  if (!isAuthenticated) {
    return (
      <div className="adm-login-wrap" dir={dirFor(locale as AppLocale)}>
        <div className="adm-login-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 11,
              background: 'linear-gradient(135deg, #F08A2E 0%, #F4C842 100%)',
              display: 'grid', placeItems: 'center',
              color: 'white', fontWeight: 900, fontSize: 24,
              boxShadow: '0 8px 22px -8px rgba(232,124,55,0.5)',
            }}>G</div>
            <div>
              <strong style={{ fontSize: 17, fontWeight: 800 }}>GoGermany</strong>
              <div style={{ fontSize: 12, color: '#7d8398', letterSpacing: '0.04em' }}>Admin Console</div>
            </div>
          </div>
          <h1>Welcome back</h1>
          <p>Enter your admin password to continue. The session lasts 24&nbsp;hours.</p>
          <form action={login}>
            <input
              type="password"
              name="password"
              placeholder="Admin password"
              className="adm-input"
              required
              autoFocus
            />
            <button type="submit" className="adm-btn">Sign in →</button>
          </form>
          <p style={{ marginTop: 16, fontSize: 13, color: '#7d8398' }}>
            Or <Link href="/login" style={{ color: '#F08A2E', fontWeight: 600 }}>log in with your admin account</Link> — admins skip the password.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div dir={dirFor(locale as AppLocale)}>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
