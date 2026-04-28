// Admin shell layout — wraps every page under /admin/* with the unified
// dashboard chrome. Login is gated by the ADMIN_PASSWORD cookie set by
// app/[locale]/admin/actions.js → login(). Children render inside the
// shell content area only when the cookie is present; otherwise the
// login screen is shown directly (without the shell).
import { cookies } from 'next/headers'
import { dirFor, type AppLocale } from '@/i18n/routing'
import AdminShell from '@/components/admin/AdminShell'
import { login } from './actions.js'
import '@/components/admin/admin.css'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAuthenticated) {
    return (
      <div className="adm-login-wrap" dir={dirFor(locale)}>
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
        </div>
      </div>
    )
  }

  return (
    <div dir={dirFor(locale)}>
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
