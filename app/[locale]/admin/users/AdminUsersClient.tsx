'use client'

import { useEffect, useMemo, useState } from 'react'

type UserSnapshot = {
  id: string
  email: string
  is_admin: boolean
  is_premium: boolean
  premium_until: string | null
  motivation_free_used: boolean
  status?: string | null
  created_at?: string | null
  last_sign_in_at?: string | null
  banned_until?: string | null
  credits: { photo: number; cv: number; motivation: number }
  unlocks: { kind: 'template' | 'german_level'; key: string }[]
}

const TEMPLATE_KEYS = ['classic', 'elegant-pro', 'modern-pro', 'minimal-pro']
const GERMAN_LEVELS = ['A2', 'B1', 'B2', 'C1']

type Filter = 'all' | 'premium' | 'free' | 'admin' | 'has-credits' | 'banned'

type DailyUsage = { photo: number; cv: number; motivation: number; reading: number; writing: number }

export default function AdminUsersClient() {
  const [users, setUsers]       = useState<UserSnapshot[] | null>(null)
  const [selected, setSelected] = useState<UserSnapshot | null>(null)
  const [usage, setUsage]       = useState<DailyUsage | null>(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<Filter>('all')
  const [loading, setLoading]   = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [msg, setMsg]           = useState('')
  const [error, setError]       = useState('')

  // Fetch today's usage whenever a user is selected.
  useEffect(() => {
    if (!selected) { setUsage(null); return }
    let cancelled = false
    fetch('/api/admin/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getUsage', email: selected.email }),
    }).then(r => r.json()).then(data => {
      if (cancelled) return
      if (data.usage) setUsage(data.usage)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [selected?.email])

  // Initial load — fetch all users on mount.
  useEffect(() => { reload() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function reload() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'listUsers', limit: 500 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      setUsers(data.users || [])
      // Refresh selected user if any
      if (selected) {
        const fresh = (data.users || []).find((u: UserSnapshot) => u.id === selected.id)
        if (fresh) setSelected(fresh)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  async function action(action: string, payload: Record<string, any> = {}, target?: UserSnapshot) {
    const t = target ?? selected
    if (!t) return
    setActionLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email: t.email, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      if (data.user) {
        // Update both selected + the row in the list
        setSelected(data.user)
        setUsers(prev => prev?.map(u => u.id === data.user.id ? data.user : u) ?? null)
      } else if (data.deleted) {
        setUsers(prev => prev?.filter(u => u.id !== t.id) ?? null)
        setSelected(null)
      }
      setMsg('✅ Updated')
      setTimeout(() => setMsg(''), 1800)
    } catch (e: any) {
      setMsg('❌ ' + (e?.message || 'error'))
    } finally {
      setActionLoading(false)
    }
  }

  // ── Filters ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!users) return []
    const needle = search.trim().toLowerCase()
    return users.filter(u => {
      if (needle && !u.email.toLowerCase().includes(needle) && !u.id.includes(needle)) return false
      const premiumActive = u.is_premium && (!u.premium_until || new Date(u.premium_until) > new Date())
      const banned = u.banned_until && new Date(u.banned_until) > new Date()
      const hasCredits = u.credits.photo + u.credits.cv + u.credits.motivation > 0
      switch (filter) {
        case 'premium':     return premiumActive
        case 'free':        return !premiumActive && !banned
        case 'admin':       return u.is_admin
        case 'has-credits': return hasCredits
        case 'banned':      return !!banned
        default:            return true
      }
    })
  }, [users, search, filter])

  const stats = useMemo(() => {
    if (!users) return { total: 0, premium: 0, admin: 0, banned: 0, withCredits: 0, recent: 0 }
    const now = Date.now()
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
    let premium = 0, admin = 0, banned = 0, withCredits = 0, recent = 0
    for (const u of users) {
      const premiumActive = u.is_premium && (!u.premium_until || new Date(u.premium_until).getTime() > now)
      if (premiumActive) premium++
      if (u.is_admin) admin++
      if (u.banned_until && new Date(u.banned_until).getTime() > now) banned++
      if (u.credits.photo + u.credits.cv + u.credits.motivation > 0) withCredits++
      if (u.created_at && new Date(u.created_at).getTime() > sevenDaysAgo) recent++
    }
    return { total: users.length, premium, admin, banned, withCredits, recent }
  }, [users])

  return (
    <>
      {/* KPIs */}
      <div className="adm-kpi-grid">
        <div className="adm-kpi adm-kpi--brand">
          <div className="adm-kpi-label">Total users</div>
          <div className="adm-kpi-value">{stats.total}</div>
          <div className="adm-kpi-sub">+{stats.recent} in the last 7 days</div>
        </div>
        <div className="adm-kpi adm-kpi--gold">
          <div className="adm-kpi-label">Premium</div>
          <div className="adm-kpi-value">{stats.premium}</div>
          <div className="adm-kpi-sub">{stats.total > 0 ? Math.round((stats.premium / stats.total) * 100) : 0}% of total</div>
        </div>
        <div className="adm-kpi adm-kpi--green">
          <div className="adm-kpi-label">Has paid credits</div>
          <div className="adm-kpi-value">{stats.withCredits}</div>
          <div className="adm-kpi-sub">photo + cv + letter combined</div>
        </div>
        <div className="adm-kpi adm-kpi--violet">
          <div className="adm-kpi-label">Admins</div>
          <div className="adm-kpi-value">{stats.admin}</div>
          <div className="adm-kpi-sub">profiles.is_admin = true</div>
        </div>
        <div className="adm-kpi adm-kpi--red">
          <div className="adm-kpi-label">Banned</div>
          <div className="adm-kpi-value">{stats.banned}</div>
          <div className="adm-kpi-sub">currently locked out</div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="adm-input"
            placeholder="🔍 Search by email or user ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 260 }}
          />
          <button className="adm-btn adm-btn--ghost" onClick={reload} disabled={loading}>
            {loading ? '⏳ Loading…' : '↻ Refresh'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          {([
            ['all',         `All (${stats.total})`],
            ['premium',     `Premium (${stats.premium})`],
            ['free',        `Free (${stats.total - stats.premium - stats.banned})`],
            ['has-credits', `With credits (${stats.withCredits})`],
            ['admin',       `Admins (${stats.admin})`],
            ['banned',      `Banned (${stats.banned})`],
          ] as [Filter, string][]).map(([k, label]) => (
            <button
              key={k}
              className="adm-btn adm-btn--ghost"
              onClick={() => setFilter(k)}
              style={{
                padding: '6px 14px', fontSize: 12,
                background: filter === k ? 'var(--adm-brand)' : undefined,
                color: filter === k ? '#1a1a1a' : undefined,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {error && <div className="adm-banner" style={{ marginTop: 12, marginBottom: 0, color: 'var(--adm-red)' }}>⚠️ {error}</div>}
      </div>

      {/* User table */}
      <div className="adm-card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        {loading && users === null ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-ink-mute)' }}>Loading users…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-ink-mute)' }}>
            {search ? `No users matching "${search}".` : 'No users found.'}
          </div>
        ) : (
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Credits</th>
                  <th style={{ textAlign: 'center' }}>Unlocks</th>
                  <th>Joined</th>
                  <th>Last sign-in</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const premiumActive = u.is_premium && (!u.premium_until || new Date(u.premium_until) > new Date())
                  const banned = u.banned_until && new Date(u.banned_until) > new Date()
                  const totalCredits = u.credits.photo + u.credits.cv + u.credits.motivation
                  return (
                    <tr
                      key={u.id}
                      onClick={() => setSelected(u)}
                      style={{ cursor: 'pointer', background: selected?.id === u.id ? 'var(--adm-bg-elev)' : undefined }}
                    >
                      <td>
                        <div style={{ fontWeight: 700 }}>{u.email}</div>
                        <div style={{ fontSize: 10, color: 'var(--adm-ink-mute)', fontFamily: 'monospace' }}>{u.id.slice(0, 12)}…</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {u.is_admin    && <span className="adm-pill adm-pill--brand">★ admin</span>}
                          {premiumActive && <span className="adm-pill adm-pill--good">💎 premium</span>}
                          {banned        && <span className="adm-pill" style={{ background: 'color-mix(in srgb, var(--adm-red) 18%, transparent)', color: 'var(--adm-red)', borderColor: 'color-mix(in srgb, var(--adm-red) 35%, transparent)' }}>🚫 banned</span>}
                          {!u.is_admin && !premiumActive && !banned && <span className="adm-pill">free</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                        {totalCredits === 0
                          ? <span style={{ color: 'var(--adm-ink-mute)' }}>—</span>
                          : <span style={{ color: 'var(--adm-green)', fontWeight: 700 }}>{totalCredits}</span>}
                      </td>
                      <td style={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                        {u.unlocks.length === 0
                          ? <span style={{ color: 'var(--adm-ink-mute)' }}>—</span>
                          : <span style={{ fontWeight: 700 }}>{u.unlocks.length}</span>}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--adm-ink-soft)' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--adm-ink-soft)' }}>
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : <span style={{ color: 'var(--adm-ink-mute)' }}>never</span>}
                      </td>
                      <td>
                        <span className="adm-link" onClick={(e) => { e.stopPropagation(); setSelected(u) }}>
                          {selected?.id === u.id ? '▼ Selected' : 'Manage →'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail panel for selected user */}
      {selected && (
        <UserDetailPanel
          user={selected}
          usage={usage}
          loading={actionLoading}
          msg={msg}
          onAction={action}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

// ─── Detail panel ─────────────────────────────────────────
function UserDetailPanel({
  user, usage, loading, msg, onAction, onClose,
}: {
  user: UserSnapshot
  usage: DailyUsage | null
  loading: boolean
  msg: string
  onAction: (action: string, payload?: Record<string, any>) => void
  onClose: () => void
}) {
  const premiumActive = user.is_premium && (!user.premium_until || new Date(user.premium_until) > new Date())
  const banned = user.banned_until && new Date(user.banned_until) > new Date()
  const hasUnlock = (kind: 'template' | 'german_level', key: string) =>
    !!user.unlocks.find(u => u.kind === kind && u.key === key)

  function confirmAndDelete() {
    if (typeof window === 'undefined') return
    const ok = window.confirm(`Delete ${user.email}? This is permanent and cascades through all related rows.`)
    if (ok) onAction('deleteUser')
  }

  return (
    <div className="adm-card" style={{ marginBottom: 16, borderColor: 'var(--adm-brand)', borderWidth: 2 }}>
      <div className="adm-card-head">
        <h3 className="adm-card-title">⚙ Manage — {user.email}</h3>
        <button className="adm-link" style={{ background: 'none', border: 0, cursor: 'pointer' }} onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {msg && <div className={`adm-banner ${msg.startsWith('✅') ? 'adm-banner--good' : ''}`} style={{ marginBottom: 12 }}>{msg}</div>}

      <div style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginBottom: 14, fontFamily: 'monospace' }}>{user.id}</div>

      {/* Premium */}
      <Section title="💎 Premium">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span className={`adm-pill ${premiumActive ? 'adm-pill--good' : ''}`}>
            {premiumActive
              ? (user.premium_until ? `Active until ${user.premium_until.slice(0, 10)}` : 'Active (no expiry)')
              : '○ Inactive'}
          </span>
          {!premiumActive ? (
            <>
              <button className="adm-btn adm-btn--ghost" disabled={loading}
                onClick={() => onAction('setPremium', { isPremium: true, until: new Date(Date.now() + 30 * 864e5).toISOString() })}>
                + Grant 30 days
              </button>
              <button className="adm-btn adm-btn--ghost" disabled={loading}
                onClick={() => onAction('setPremium', { isPremium: true })}>
                + Grant forever
              </button>
            </>
          ) : (
            <>
              <button className="adm-btn adm-btn--ghost" disabled={loading}
                onClick={() => onAction('setPremium', { isPremium: true, until: new Date(Date.now() + 30 * 864e5).toISOString() })}>
                Extend +30 days
              </button>
              <button className="adm-btn adm-btn--danger" disabled={loading}
                onClick={() => onAction('setPremium', { isPremium: false })}>
                ✕ Revoke
              </button>
            </>
          )}
        </div>
      </Section>

      {/* Today's free usage */}
      <Section title="📊 Today's free usage (UTC)">
        <p style={{ fontSize: 12, color: 'var(--adm-ink-soft)', marginTop: -4, marginBottom: 10 }}>
          Every signed-in user gets a free daily allowance. After the cap they fall through to paid credits (below).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 8 }}>
          <UsageTile label="📷 Photo enhance" used={usage?.photo ?? 0}      cap={2} unit="/ day" />
          <UsageTile label="📄 CV improve"    used={usage?.cv ?? 0}         cap={1} unit="/ day" />
          <UsageTile label="✍️ Motivation"     used={usage?.motivation ?? 0} cap={1} unit="/ day" />
          <UsageTile label="📖 Lesen (reading)"     used={usage?.reading ?? 0} cap={10} unit="/ day · 2/level × 5" />
          <UsageTile label="✍️ Schreiben (writing)" used={usage?.writing ?? 0} cap={10} unit="/ day · 2/level × 5" />
        </div>
      </Section>

      {/* Credits */}
      <Section title="💳 Extra paid credits (after the free daily cap)">
        <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr auto', gap: '12px 18px', alignItems: 'center' }}>
          <CreditRow label="Photo AI"          value={user.credits.photo}      onAdd={n => onAction('addCredits', { feature: 'photo',      amount: n })} loading={loading} />
          <CreditRow label="CV enhance"        value={user.credits.cv}         onAdd={n => onAction('addCredits', { feature: 'cv',         amount: n })} loading={loading} />
          <CreditRow label="Motivation letter" value={user.credits.motivation} onAdd={n => onAction('addCredits', { feature: 'motivation', amount: n })} loading={loading} />
        </div>
      </Section>

      {/* Unlocks */}
      <Section title="🎨 Pro CV templates (paid one-time unlocks)">
        <UnlockGrid items={TEMPLATE_KEYS} kind="template" hasUnlock={hasUnlock} loading={loading} onAction={onAction} />
      </Section>
      <Section title="🇩🇪 German levels — legacy">
        <p style={{ fontSize: 12, color: 'var(--adm-ink-soft)', marginTop: -4, marginBottom: 10, lineHeight: 1.5 }}>
          ℹ All German lessons are 100% free for any signed-in user — these per-level unlocks are from the older paid model and no longer gate access. Kept here in case the field is read elsewhere; safe to leave at "locked".
        </p>
        <UnlockGrid items={GERMAN_LEVELS} kind="german_level" hasUnlock={hasUnlock} loading={loading} onAction={onAction} />
      </Section>

      {/* Block / delete */}
      <Section title="🛡 Account access">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {banned ? (
            <>
              <span className="adm-pill" style={{ background: 'color-mix(in srgb, var(--adm-red) 18%, transparent)', color: 'var(--adm-red)' }}>
                🚫 Banned until {user.banned_until?.slice(0, 10)}
              </span>
              <button className="adm-btn adm-btn--ghost" disabled={loading}
                onClick={() => onAction('ban', { duration: 0 })}>
                ↻ Unban now
              </button>
            </>
          ) : (
            <>
              <span className="adm-pill adm-pill--good">✓ Account active</span>
              <button className="adm-btn adm-btn--ghost" disabled={loading}
                onClick={() => onAction('ban', { duration: 24 })}>
                Block 24h
              </button>
              <button className="adm-btn adm-btn--ghost" disabled={loading}
                onClick={() => onAction('ban', { duration: 24 * 7 })}>
                Block 7 days
              </button>
              <button className="adm-btn adm-btn--danger" disabled={loading}
                onClick={() => onAction('ban', { duration: 'forever' })}>
                🚫 Ban permanently
              </button>
            </>
          )}
          <div style={{ flex: 1 }} />
          <button className="adm-btn adm-btn--danger" disabled={loading} onClick={confirmAndDelete}>
            🗑 Delete user
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 8 }}>
          Banning prevents login (Supabase auth-level). Deleting is permanent and cascades through all user-owned rows.
        </p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBlock: 14, borderTop: '1px solid var(--adm-line)' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--adm-ink)', marginBottom: 10 }}>{title}</div>
      <div>{children}</div>
    </div>
  )
}

function UsageTile({ label, used, cap, unit }: { label: string; used: number; cap: number; unit: string }) {
  const pct = Math.min(100, Math.round((used / cap) * 100))
  const exhausted = used >= cap
  const accent = exhausted ? 'var(--adm-red)' : (used > 0 ? 'var(--adm-gold)' : 'var(--adm-green)')
  return (
    <div style={{
      padding: '10px 12px',
      background: 'var(--adm-bg-elev)',
      border: '1px solid var(--adm-line)',
      borderRadius: 8,
    }}>
      <div style={{ fontSize: 11, color: 'var(--adm-ink-mute)', fontWeight: 700, letterSpacing: 0.04, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: accent, fontVariantNumeric: 'tabular-nums' }}>{used}</span>
        <span style={{ fontSize: 13, color: 'var(--adm-ink-mute)' }}>/ {cap}</span>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--adm-ink-mute)', marginTop: 2 }}>{unit}</div>
      <div style={{
        marginTop: 6,
        height: 4,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: accent,
          transition: 'width 0.2s',
        }} />
      </div>
    </div>
  )
}

function CreditRow({ label, value, onAdd, loading }: { label: string; value: number; onAdd: (n: number) => void; loading: boolean }) {
  const has = value > 0
  return (
    <>
      <div style={{ fontSize: 14, color: 'var(--adm-ink)', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13 }}>
        <span style={{
          display: 'inline-block',
          minWidth: 36, textAlign: 'center',
          padding: '3px 10px', borderRadius: 6,
          background: has ? 'color-mix(in srgb, var(--adm-green) 14%, transparent)' : 'var(--adm-bg-elev)',
          color:      has ? 'var(--adm-green)' : 'var(--adm-ink-mute)',
          fontWeight: 800,
          border: '1px solid ' + (has ? 'color-mix(in srgb, var(--adm-green) 35%, transparent)' : 'var(--adm-line)'),
        }}>{value}</span>
        <span style={{ color: 'var(--adm-ink-mute)', marginInlineStart: 8 }}>credit(s)</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading} onClick={() => onAdd(1)}>+1</button>
        <button className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading} onClick={() => onAdd(5)}>+5</button>
        <button className="adm-btn adm-btn--danger"  style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading || !has} onClick={() => onAdd(-value)}>reset</button>
      </div>
    </>
  )
}

function UnlockGrid({ items, kind, hasUnlock, loading, onAction }: {
  items: string[]
  kind: 'template' | 'german_level'
  hasUnlock: (k: 'template' | 'german_level', key: string) => boolean
  loading: boolean
  onAction: (action: string, payload?: Record<string, any>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(k => {
        const on = hasUnlock(kind, k)
        return (
          <div key={k} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', borderRadius: 8,
            border: '1px solid ' + (on ? 'color-mix(in srgb, var(--adm-green) 35%, transparent)' : 'var(--adm-line)'),
            background: on ? 'color-mix(in srgb, var(--adm-green) 8%, transparent)' : 'var(--adm-bg-elev)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, color: on ? 'var(--adm-green)' : 'var(--adm-ink-mute)' }}>{on ? '✓' : '○'}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--adm-ink)' }}>{k}</span>
              <span style={{ fontSize: 12, color: on ? 'var(--adm-green)' : 'var(--adm-ink-mute)' }}>
                {on ? 'unlocked' : 'locked'}
              </span>
            </div>
            {on
              ? <button className="adm-btn adm-btn--danger" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading}
                  onClick={() => onAction('revokeUnlock', { kind, key: k })}>✕ Revoke</button>
              : <button className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading}
                  onClick={() => onAction('grantUnlock', { kind, key: k })}>+ Unlock</button>
            }
          </div>
        )
      })}
    </div>
  )
}
