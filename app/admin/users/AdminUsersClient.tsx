'use client'

import { useState } from 'react'

type UserSnapshot = {
  id: string
  email: string
  is_admin: boolean
  is_premium: boolean
  premium_until: string | null
  motivation_free_used: boolean
  credits: { photo: number; cv: number; motivation: number }
  unlocks: { kind: 'template' | 'german_level'; key: string }[]
}

const TEMPLATE_KEYS = ['classic', 'elegant-pro', 'modern-pro', 'minimal-pro']
const GERMAN_LEVELS = ['A2', 'B1', 'B2', 'C1']

export default function AdminUsersClient() {
  const [email, setEmail]     = useState('')
  const [user, setUser]       = useState<UserSnapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState('')

  async function call(action: string, payload: Record<string, any> = {}) {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      if (data.user) setUser(data.user)
      setMsg(action === 'lookup' ? '✅ Loaded' : '✅ Updated')
    } catch (e: any) {
      setMsg('❌ ' + (e?.message || 'error'))
    } finally {
      setLoading(false)
    }
  }

  const hasUnlock = (kind: 'template' | 'german_level', key: string) =>
    !!user?.unlocks.find(u => u.kind === kind && u.key === key)

  // ── Access summary: one-line per feature that plainly tells you
  // what this user CAN use right now, and why ──────────────────────
  function accessSummary(u: UserSnapshot) {
    const premiumActive = u.is_premium && (!u.premium_until || new Date(u.premium_until) > new Date())
    const premiumLabel = premiumActive
      ? (u.premium_until ? `Premium (until ${u.premium_until.slice(0, 10)})` : 'Premium (no expiry)')
      : 'Not premium'

    return [
      { label: 'Premium',           value: premiumLabel,                                          active: premiumActive },
      { label: 'Photo AI',          value: premiumActive ? '5/day (premium)'       : `${u.credits.photo} credit(s)`,      active: premiumActive || u.credits.photo > 0 },
      { label: 'CV enhance',        value: premiumActive ? '2/day (premium)'       : `${u.credits.cv} credit(s)`,         active: premiumActive || u.credits.cv > 0 },
      { label: 'Motivation letter', value: premiumActive ? '2/day (premium)'       : `${u.credits.motivation} credit(s)` + (u.motivation_free_used ? '' : ' + 1 free try available'), active: premiumActive || u.credits.motivation > 0 || !u.motivation_free_used },
      { label: 'Ausbildung jobs',   value: premiumActive ? 'Unlimited (premium)'   : '10 reveals/day (free)',              active: true },
      { label: 'Pro templates',     value: premiumActive ? 'All (premium)'         : unlocksForKind(u, 'template').join(', ') || 'None unlocked', active: premiumActive || unlocksForKind(u, 'template').length > 0 },
      { label: 'German levels',     value: premiumActive ? 'All (premium)'         : ('A1 (free) ' + (unlocksForKind(u, 'german_level').length ? '+ ' + unlocksForKind(u, 'german_level').join(', ') : '')), active: true },
    ]
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 0' }}>
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#111', colorScheme: 'light' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#111' }}>Admin — Entitlements</h1>
      <p style={{ color: '#333', marginBottom: 24, fontSize: 14 }}>
        Look up a user by email, see exactly what they have access to, and grant or revoke entitlements.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #888', borderRadius: 8, color: '#111', background: '#fff' }}
        />
        <button onClick={() => call('lookup')} disabled={!email || loading} style={btnPrimary}>
          {loading ? '...' : 'Lookup'}
        </button>
      </div>

      {msg && <div style={{ marginBottom: 16, fontSize: 14, fontWeight: 600, color: msg.startsWith('✅') ? '#087' : '#c33' }}>{msg}</div>}

      {user && (
        <div style={{ border: '1px solid #bbb', borderRadius: 10, padding: 20, background: '#fff', color: '#111' }}>
          {/* ── Header ── */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user.email}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
              {user.id}
              {user.is_admin && <span style={badge('#0ea5a0')}>admin</span>}
            </div>
          </div>

          {/* ── Current access summary (read-only) ── */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              📋 Currently has access to:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 14px', fontSize: 13 }}>
              {accessSummary(user).map(row => (
                <div key={row.label} style={{ display: 'contents' }}>
                  <div style={{ color: '#475569', fontWeight: 600 }}>{row.label}</div>
                  <div style={{ color: row.active ? '#0f172a' : '#94a3b8' }}>
                    {row.active ? '✓' : '○'} {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Premium ── */}
          <Section title="Premium">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <StatusPill active={user.is_premium}>
                {user.is_premium
                  ? (user.premium_until ? `Active until ${user.premium_until.slice(0, 10)}` : 'Active (no expiry)')
                  : 'Inactive'}
              </StatusPill>
              {!user.is_premium && (
                <>
                  <button style={btn} disabled={loading}
                    onClick={() => {
                      const until = new Date(Date.now() + 30 * 864e5).toISOString()
                      call('setPremium', { isPremium: true, until })
                    }}>
                    + Grant 30 days
                  </button>
                  <button style={btn} disabled={loading}
                    onClick={() => call('setPremium', { isPremium: true })}>
                    + Grant forever
                  </button>
                </>
              )}
              {user.is_premium && (
                <>
                  <button style={btn} disabled={loading}
                    onClick={() => {
                      const until = new Date(Date.now() + 30 * 864e5).toISOString()
                      call('setPremium', { isPremium: true, until })
                    }}>
                    Extend +30 days
                  </button>
                  <button style={btnDanger} disabled={loading}
                    onClick={() => call('setPremium', { isPremium: false })}>
                    ✕ Revoke premium
                  </button>
                </>
              )}
            </div>
          </Section>

          {/* ── Credits ── */}
          <Section title="Pay-per-use credits">
            <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr auto', gap: '10px 14px', alignItems: 'center' }}>
              <CreditRow label="Photo AI"          value={user.credits.photo}      onAdd={n => call('addCredits', { feature: 'photo',      amount: n })} loading={loading} />
              <CreditRow label="CV enhance"        value={user.credits.cv}         onAdd={n => call('addCredits', { feature: 'cv',         amount: n })} loading={loading} />
              <CreditRow label="Motivation letter" value={user.credits.motivation} onAdd={n => call('addCredits', { feature: 'motivation', amount: n })} loading={loading} />
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: '#f9fafb', border: '1px solid #d1d5db', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ fontSize: 13 }}>
                <strong>Motivation letter — free lifetime try:</strong>{' '}
                <span style={{ color: user.motivation_free_used ? '#b91c1c' : '#166534', fontWeight: 700 }}>
                  {user.motivation_free_used ? '✕ Used' : '✓ Available'}
                </span>
              </div>
              {user.motivation_free_used && (
                <button style={btn} disabled={loading}
                  onClick={() => call('resetMotivationFreeTry')}>
                  ↻ Restore free try
                </button>
              )}
            </div>
          </Section>

          {/* ── Templates ── */}
          <Section title="Pro templates (one-time unlocks)">
            <UnlockGrid items={TEMPLATE_KEYS} kind="template" hasUnlock={hasUnlock} loading={loading} onGrant={call} />
          </Section>

          {/* ── German levels ── */}
          <Section title="German levels (A1 is free for everyone)">
            <UnlockGrid items={GERMAN_LEVELS} kind="german_level" hasUnlock={hasUnlock} loading={loading} onGrant={call} />
          </Section>
        </div>
      )}
    </div>
    </div>
  )
}

function unlocksForKind(u: UserSnapshot, kind: 'template' | 'german_level'): string[] {
  return u.unlocks.filter(x => x.kind === kind).map(x => x.key)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #ddd' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 10 }}>{title}</div>
      <div>{children}</div>
    </div>
  )
}

function StatusPill({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: 999,
      background: active ? '#dcfce7' : '#f3f4f6',
      color:      active ? '#166534' : '#6b7280',
      border: `1px solid ${active ? '#86efac' : '#d1d5db'}`,
      fontSize: 12,
      fontWeight: 700,
    }}>
      {active ? '✓ ' : '○ '}{children}
    </span>
  )
}

function CreditRow({ label, value, onAdd, loading }: { label: string; value: number; onAdd: (n: number) => void; loading: boolean }) {
  const hasCredits = value > 0
  return (
    <>
      <div style={{ fontSize: 14, color: '#111', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 13 }}>
        <span style={{
          display: 'inline-block',
          minWidth: 36, textAlign: 'center',
          padding: '2px 8px',
          borderRadius: 6,
          background: hasCredits ? '#dcfce7' : '#f3f4f6',
          color:      hasCredits ? '#166534' : '#6b7280',
          fontWeight: 700,
        }}>{value}</span>
        <span style={{ color: '#6b7280', marginInlineStart: 8 }}>credit(s) remaining</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button style={btnSmall} disabled={loading} onClick={() => onAdd(1)}>+1</button>
        <button style={btnSmall} disabled={loading} onClick={() => onAdd(5)}>+5</button>
        <button style={btnSmallDanger} disabled={loading || !hasCredits} onClick={() => onAdd(-value)}>reset</button>
      </div>
    </>
  )
}

function UnlockGrid({ items, kind, hasUnlock, loading, onGrant }: {
  items: string[]
  kind: 'template' | 'german_level'
  hasUnlock: (k: 'template' | 'german_level', key: string) => boolean
  loading: boolean
  onGrant: (action: string, payload?: Record<string, any>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(k => {
        const on = hasUnlock(kind, k)
        return (
          <div key={k} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 8,
            border: `1px solid ${on ? '#86efac' : '#d1d5db'}`,
            background: on ? '#dcfce7' : '#f9fafb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, color: on ? '#166534' : '#9ca3af' }}>{on ? '✓' : '○'}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{k}</span>
              <span style={{ fontSize: 12, color: on ? '#166534' : '#6b7280' }}>
                {on ? 'unlocked' : 'locked'}
              </span>
            </div>
            {on
              ? <button style={btnDanger} disabled={loading}
                  onClick={() => onGrant('revokeUnlock', { kind, key: k })}>✕ Revoke</button>
              : <button style={btn} disabled={loading}
                  onClick={() => onGrant('grantUnlock', { kind, key: k })}>+ Unlock</button>
            }
          </div>
        )
      })}
    </div>
  )
}

const btn: React.CSSProperties = {
  padding: '6px 12px', border: '1px solid #888', borderRadius: 6,
  background: '#fff', color: '#111', cursor: 'pointer', fontSize: 13, fontWeight: 600,
}
const btnDanger: React.CSSProperties = {
  ...btn, borderColor: '#ef4444', color: '#b91c1c', background: '#fff',
}
const btnSmall: React.CSSProperties = { ...btn, padding: '4px 10px', fontSize: 12 }
const btnSmallDanger: React.CSSProperties = { ...btnSmall, borderColor: '#ef4444', color: '#b91c1c' }
const btnPrimary: React.CSSProperties = {
  padding: '10px 16px', background: '#0ea5a0', color: '#fff',
  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
}
function badge(color: string): React.CSSProperties {
  return { marginInlineStart: 8, padding: '2px 8px', borderRadius: 999, background: color, color: '#fff', fontSize: 11, fontWeight: 600 }
}
