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
      { label: 'Pro templates',     value: premiumActive ? 'All (premium)'         : unlocksForKind(u, 'template').join(', ') || 'None unlocked', active: premiumActive || unlocksForKind(u, 'template').length > 0 },
      { label: 'German levels',     value: premiumActive ? 'All (premium)'         : ('A1 (free) ' + (unlocksForKind(u, 'german_level').length ? '+ ' + unlocksForKind(u, 'german_level').join(', ') : '')), active: true },
    ]
  }

  return (
    <section className="adm-card" style={{ padding: 0, background: 'transparent', border: 0 }}>
      {/* Lookup row */}
      <div className="adm-card" style={{ marginBottom: 16 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">🔍 Lookup user</h3></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="adm-input"
            style={{ flex: 1 }}
          />
          <button className="adm-btn" onClick={() => call('lookup')} disabled={!email || loading}>
            {loading ? '…' : 'Lookup'}
          </button>
        </div>
        {msg && (
          <div className={`adm-banner ${msg.startsWith('✅') ? 'adm-banner--good' : ''}`} style={{ marginTop: 12, marginBottom: 0 }}>
            {msg}
          </div>
        )}
      </div>

      {user && (
        <>
          {/* Header */}
          <div className="adm-card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{user.email}</div>
                <div style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 4, fontFamily: 'monospace' }}>{user.id}</div>
              </div>
              {user.is_admin && <span className="adm-pill adm-pill--brand">★ admin</span>}
            </div>
          </div>

          {/* Access summary */}
          <div className="adm-card" style={{ marginBottom: 16 }}>
            <div className="adm-card-head"><h3 className="adm-card-title">📋 Currently has access to</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '8px 18px', fontSize: 13 }}>
              {accessSummary(user).map(row => (
                <div key={row.label} style={{ display: 'contents' }}>
                  <div style={{ color: 'var(--adm-ink-soft)', fontWeight: 700 }}>{row.label}</div>
                  <div style={{ color: row.active ? 'var(--adm-ink)' : 'var(--adm-ink-mute)' }}>
                    {row.active ? '✓' : '○'} {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <Section title="💎 Premium">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span className={`adm-pill ${user.is_premium ? 'adm-pill--good' : ''}`}>
                {user.is_premium
                  ? (user.premium_until ? `Active until ${user.premium_until.slice(0, 10)}` : 'Active (no expiry)')
                  : '○ Inactive'}
              </span>
              {!user.is_premium && (
                <>
                  <button className="adm-btn adm-btn--ghost" disabled={loading}
                    onClick={() => call('setPremium', { isPremium: true, until: new Date(Date.now() + 30 * 864e5).toISOString() })}>
                    + Grant 30 days
                  </button>
                  <button className="adm-btn adm-btn--ghost" disabled={loading}
                    onClick={() => call('setPremium', { isPremium: true })}>
                    + Grant forever
                  </button>
                </>
              )}
              {user.is_premium && (
                <>
                  <button className="adm-btn adm-btn--ghost" disabled={loading}
                    onClick={() => call('setPremium', { isPremium: true, until: new Date(Date.now() + 30 * 864e5).toISOString() })}>
                    Extend +30 days
                  </button>
                  <button className="adm-btn adm-btn--danger" disabled={loading}
                    onClick={() => call('setPremium', { isPremium: false })}>
                    ✕ Revoke premium
                  </button>
                </>
              )}
            </div>
          </Section>

          {/* Credits */}
          <Section title="💳 Pay-per-use credits">
            <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr auto', gap: '12px 18px', alignItems: 'center' }}>
              <CreditRow label="Photo AI"          value={user.credits.photo}      onAdd={n => call('addCredits', { feature: 'photo',      amount: n })} loading={loading} />
              <CreditRow label="CV enhance"        value={user.credits.cv}         onAdd={n => call('addCredits', { feature: 'cv',         amount: n })} loading={loading} />
              <CreditRow label="Motivation letter" value={user.credits.motivation} onAdd={n => call('addCredits', { feature: 'motivation', amount: n })} loading={loading} />
            </div>
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: 'var(--adm-bg-elev)', border: '1px solid var(--adm-line)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: 13, color: 'var(--adm-ink-soft)' }}>
                <strong style={{ color: 'var(--adm-ink)' }}>Motivation letter — free lifetime try:</strong>{' '}
                <span style={{ color: user.motivation_free_used ? 'var(--adm-red)' : 'var(--adm-green)', fontWeight: 700 }}>
                  {user.motivation_free_used ? '✕ Used' : '✓ Available'}
                </span>
              </div>
              {user.motivation_free_used && (
                <button className="adm-btn adm-btn--ghost" disabled={loading}
                  onClick={() => call('resetMotivationFreeTry')}>
                  ↻ Restore free try
                </button>
              )}
            </div>
          </Section>

          {/* Templates */}
          <Section title="🎨 Pro CV templates (one-time unlocks)">
            <UnlockGrid items={TEMPLATE_KEYS} kind="template" hasUnlock={hasUnlock} loading={loading} onGrant={call} />
          </Section>

          {/* German levels */}
          <Section title="🇩🇪 German levels (A1 is free for everyone)">
            <UnlockGrid items={GERMAN_LEVELS} kind="german_level" hasUnlock={hasUnlock} loading={loading} onGrant={call} />
          </Section>
        </>
      )}
    </section>
  )
}

function unlocksForKind(u: UserSnapshot, kind: 'template' | 'german_level'): string[] {
  return u.unlocks.filter(x => x.kind === kind).map(x => x.key)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="adm-card" style={{ marginBottom: 16 }}>
      <div className="adm-card-head"><h3 className="adm-card-title">{title}</h3></div>
      <div>{children}</div>
    </div>
  )
}

function CreditRow({ label, value, onAdd, loading }: { label: string; value: number; onAdd: (n: number) => void; loading: boolean }) {
  const hasCredits = value > 0
  return (
    <>
      <div style={{ fontSize: 14, color: 'var(--adm-ink)', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13 }}>
        <span style={{
          display: 'inline-block',
          minWidth: 36, textAlign: 'center',
          padding: '3px 10px',
          borderRadius: 6,
          background: hasCredits ? 'color-mix(in srgb, var(--adm-green) 14%, transparent)' : 'var(--adm-bg-elev)',
          color:      hasCredits ? 'var(--adm-green)' : 'var(--adm-ink-mute)',
          fontWeight: 800,
          border: '1px solid ' + (hasCredits ? 'color-mix(in srgb, var(--adm-green) 35%, transparent)' : 'var(--adm-line)'),
        }}>{value}</span>
        <span style={{ color: 'var(--adm-ink-mute)', marginInlineStart: 8 }}>credit(s) remaining</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading} onClick={() => onAdd(1)}>+1</button>
        <button className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading} onClick={() => onAdd(5)}>+5</button>
        <button className="adm-btn adm-btn--danger"  style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading || !hasCredits} onClick={() => onAdd(-value)}>reset</button>
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
            padding: '10px 14px',
            borderRadius: 8,
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
                  onClick={() => onGrant('revokeUnlock', { kind, key: k })}>✕ Revoke</button>
              : <button className="adm-btn adm-btn--ghost" style={{ padding: '6px 12px', fontSize: 12 }} disabled={loading}
                  onClick={() => onGrant('grantUnlock', { kind, key: k })}>+ Unlock</button>
            }
          </div>
        )
      })}
    </div>
  )
}
