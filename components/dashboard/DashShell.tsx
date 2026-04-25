'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase-browser'
import { fetchDocuments, type UserDocument } from '@/lib/documents'
import DashSidebar from './DashSidebar'
import DashTopbar from './DashTopbar'

export type ShellProfile = {
  whatsapp?: string | null
  status?: string | null
  avatar_url?: string | null
} | null

export type ShellContext = {
  user: any
  profile: ShellProfile
  docs: UserDocument[]
  completionPct: number
  missing: { key: string; label: string; href: string }[]
  refresh: () => void
}

const ShellCtx = createContext<ShellContext | null>(null)

export function useShell(): ShellContext {
  const v = useContext(ShellCtx)
  if (!v) throw new Error('useShell must be used inside <DashShell>')
  return v
}

// ── Profile completion heuristic ─────────────────────────────
// Five core fields: photo, first name, last name, email, phone.
export function computeCompletion(
  profile: ShellProfile,
  user: any,
  _docs: UserDocument[],
  labels: Record<string, string>,
) {
  const meta = user?.user_metadata ?? {}
  const firstName = (meta.first_name || '').trim()
  const lastName  = (meta.last_name  || '').trim()
  const email     = (user?.email || '').trim()
  const phone     = (profile?.whatsapp || '').toString().trim()
  const avatar    = profile?.avatar_url || meta.avatar_url || meta.picture || ''

  const items = [
    { key: 'photo',     done: !!avatar,    href: '/dashboard/profile', label: labels.photo },
    { key: 'firstName', done: !!firstName, href: '/dashboard/profile', label: labels.firstName },
    { key: 'lastName',  done: !!lastName,  href: '/dashboard/profile', label: labels.lastName },
    { key: 'email',     done: !!email,     href: '/dashboard/profile', label: labels.email },
    { key: 'phone',     done: !!phone,     href: '/dashboard/profile', label: labels.phone },
  ]
  const done = items.filter(i => i.done).length
  const pct = Math.round((done / items.length) * 100)
  return { items, pct }
}

/**
 * Shell wrapper lives in app/[locale]/dashboard/layout.tsx so that navigating
 * between dashboard pages only swaps the content area (no re-mount of the
 * sidebar or re-fetch of profile/docs). Children consume the shell via
 * `useShell()`.
 */
export default function DashShell({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as AppLocale
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  // Read labels from i18n directly — the provider is mounted in root layout.
  const tMiss = useTranslations('dashboard.profilePage.missing')
  const labels = useMemo(() => ({
    photo:     tMiss('photo'),
    firstName: tMiss('firstName'),
    lastName:  tMiss('lastName'),
    email:     tMiss('email'),
    phone:     tMiss('phone'),
  }), [tMiss])

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<ShellProfile>(null)
  const [docs, setDocs] = useState<UserDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [bumpKey, setBumpKey] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto-close the mobile drawer whenever the route changes.
  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return
      if (!data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
      const { data: prof } = await supabase
        .from('profiles')
        .select('whatsapp, status, avatar_url')
        .eq('user_id', data.user.id)
        .single()
      if (!cancelled) setProfile(prof ?? null)
      try {
        const d = await fetchDocuments()
        if (!cancelled) setDocs(d)
      } catch {}
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bumpKey])

  const { items, pct } = useMemo(
    () => computeCompletion(profile, user, docs, labels),
    [profile, user, docs, labels],
  )
  const missing = items.filter(i => !i.done)

  const userInitial = useMemo(() => {
    const meta = user?.user_metadata ?? {}
    const first: string | undefined = meta.first_name
    if (first && first.trim()) return first.trim().charAt(0).toUpperCase()
    const email: string | undefined = user?.email
    if (!email) return '?'
    return email.trim().charAt(0).toUpperCase() || '?'
  }, [user])

  const avatarSrc =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null

  const ctx: ShellContext = useMemo(() => ({
    user,
    profile,
    docs,
    completionPct: pct,
    missing,
    refresh: () => setBumpKey(k => k + 1),
  }), [user, profile, docs, pct, missing])

  if (loading) {
    return (
      <div className="dashshell" dir={dirFor(locale)}>
        <div className="dashshell-loading">…</div>
      </div>
    )
  }

  return (
    <ShellCtx.Provider value={ctx}>
      <div className={`dashshell ${mobileOpen ? 'is-mobile-open' : ''}`} dir={dirFor(locale)}>
        <DashSidebar
          completionPct={pct}
          userInitial={userInitial}
          isMobileOpen={mobileOpen}
        />
        {mobileOpen && (
          <button
            type="button"
            className="dashshell-backdrop"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div className="dashshell-main">
          <DashTopbar
            avatarSrc={avatarSrc}
            userInitial={userInitial}
            onMobileMenu={() => setMobileOpen(v => !v)}
          />
          <div className="dashshell-content">
            <div key={pathname} className="dashshell-view">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ShellCtx.Provider>
  )
}
