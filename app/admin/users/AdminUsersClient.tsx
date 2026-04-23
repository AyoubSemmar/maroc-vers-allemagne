'use client'

import { useState } from 'react'

type UserSnapshot = {
  id: string
  email: string
  is_admin: boolean
  is_premium: boolean
  premium_until: string | null
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

  return (
    <div style={{ maxWidth: 860, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Admin — Entitlements</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Grant premium, credits, or unlocks to a user by email.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8 }}
        />
        <button
          onClick={() => call('lookup')}
          disabled={!email || loading}
          style={btnPrimary}
        >
          {loading ? '...' : 'Lookup'}
        </button>
      </div>

      {msg && <div style={{ marginBottom: 16, fontSize: 13, color: msg.startsWith('✅') ? '#087' : '#c33' }}>{msg}</div>}

      {user && (
        <div style={{ border: '1px solid #ddd', borderRadius: 10, padding: 20, background: '#fafafa' }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{user.email}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {user.id}
              {user.is_admin && <span style={badge('#0ea5a0')}>admin</span>}
              {user.is_premium && (
                <span style={badge('#d97706')}>
                  premium{user.premium_until ? ` until ${user.premium_until.slice(0, 10)}` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Premium */}
          <Section title="Premium">
            <button style={btn} disabled={loading}
              onClick={() => call('setPremium', { isPremium: !user.is_premium })}>
              {user.is_premium ? 'Revoke premium' : 'Grant premium (forever)'}
            </button>
            <button style={btn} disabled={loading}
              onClick={() => {
                const until = new Date(Date.now() + 30 * 864e5).toISOString()
                call('setPremium', { isPremium: true, until })
              }}>
              Grant premium (30 days)
            </button>
          </Section>

          {/* Credits */}
          <Section title="Credits">
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center' }}>
              <CreditRow label="Photo"      value={user.credits.photo}      onAdd={n => call('addCredits', { feature: 'photo',      amount: n })} loading={loading} />
              <CreditRow label="CV enhance" value={user.credits.cv}         onAdd={n => call('addCredits', { feature: 'cv',         amount: n })} loading={loading} />
              <CreditRow label="Motivation" value={user.credits.motivation} onAdd={n => call('addCredits', { feature: 'motivation', amount: n })} loading={loading} />
            </div>
          </Section>

          {/* Templates */}
          <Section title="Pro templates (one-time unlocks)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TEMPLATE_KEYS.map(k => {
                const on = hasUnlock('template', k)
                return (
                  <button key={k} style={on ? btnOn : btn} disabled={loading}
                    onClick={() => call(on ? 'revokeUnlock' : 'grantUnlock', { kind: 'template', key: k })}>
                    {on ? '✓ ' : ''}{k}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* German levels */}
          <Section title="German levels (A1 free for all)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GERMAN_LEVELS.map(k => {
                const on = hasUnlock('german_level', k)
                return (
                  <button key={k} style={on ? btnOn : btn} disabled={loading}
                    onClick={() => call(on ? 'revokeUnlock' : 'grantUnlock', { kind: 'german_level', key: k })}>
                    {on ? '✓ ' : ''}{k}
                  </button>
                )
              })}
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #eee' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{children}</div>
    </div>
  )
}

function CreditRow({ label, value, onAdd, loading }: { label: string; value: number; onAdd: (n: number) => void; loading: boolean }) {
  return (
    <>
      <div style={{ fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#666' }}>balance: <strong>{value}</strong></div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button style={btnSmall} disabled={loading} onClick={() => onAdd(1)}>+1</button>
        <button style={btnSmall} disabled={loading} onClick={() => onAdd(5)}>+5</button>
        <button style={btnSmall} disabled={loading || value <= 0} onClick={() => onAdd(-value)}>reset</button>
      </div>
    </>
  )
}

const btn: React.CSSProperties = {
  padding: '6px 12px', border: '1px solid #ccc', borderRadius: 6,
  background: '#fff', cursor: 'pointer', fontSize: 13,
}
const btnOn: React.CSSProperties = { ...btn, background: '#0ea5a0', color: '#fff', borderColor: '#0ea5a0' }
const btnSmall: React.CSSProperties = { ...btn, padding: '4px 10px', fontSize: 12 }
const btnPrimary: React.CSSProperties = {
  padding: '10px 16px', background: '#0ea5a0', color: '#fff',
  border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
}
function badge(color: string): React.CSSProperties {
  return { marginInlineStart: 8, padding: '2px 8px', borderRadius: 999, background: color, color: '#fff', fontSize: 11, fontWeight: 600 }
}
