'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatAccessDate } from '@/lib/courseAccess'

export type AdminGroup = {
  id: string
  label: string
  schedule: string
  capacity: number
  booked_count: number
  seed_reserved: number
  start_date: string | null
  students: { bookingId: string; email: string; whatsapp: string; bookedAt: string; accessUntil: string | null; accessActive: boolean; attendance30: number }[]
}

/** Editable capacity + "seed" reserved seats (real offline/WhatsApp
 *  reservations shown as occupied to visitors). Seed counts toward capacity
 *  everywhere, so keep it honest — it should reflect people who actually
 *  reserved, not invented numbers. */
function GroupSeats({ groupId, capacity, seedReserved, bookedCount }: { groupId: string; capacity: number; seedReserved: number; bookedCount: number }) {
  const router = useRouter()
  const [cap, setCap] = useState(String(capacity))
  const [seed, setSeed] = useState(String(seedReserved))
  const [saving, setSaving] = useState(false)
  const dirty = cap !== String(capacity) || seed !== String(seedReserved)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/classes/group-seats', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ groupId, capacity: Number(cap), seedReserved: Number(seed) }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        alert(error || 'Failed to save seats')
      } else {
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const inp: React.CSSProperties = { width: 44, fontSize: 12, border: '1px solid #e2e5ea', borderRadius: 6, padding: '2px 4px', color: '#444', textAlign: 'center' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7d8398' }} title="Places réservées affichées (vraies réservations hors-ligne) et capacité. Le nombre réservé compte comme des sièges occupés.">
      🎟️
      <input type="number" min={0} value={seed} onChange={(e) => setSeed(e.target.value)} style={inp} title="Réservées (hors-ligne) affichées aux visiteurs" />
      <span style={{ color: '#c0c4ce' }}>+{bookedCount} = résa / cap</span>
      <input type="number" min={1} value={cap} onChange={(e) => setCap(e.target.value)} style={inp} title="Capacité (places totales)" />
      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          style={{ fontSize: 11, fontWeight: 700, background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}
        >
          OK
        </button>
      )}
    </span>
  )
}

/** Cohort start-date picker — anchors the weekly pacing on the student
 *  dashboard ("Semaine N" + this-week highlights). */
function GroupStartDate({ groupId, value }: { groupId: string; value: string | null }) {
  const router = useRouter()
  const [date, setDate] = useState(value ?? '')
  const [saving, setSaving] = useState(false)
  const dirty = date !== (value ?? '')

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/classes/group-start', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ groupId, startDate: date || null }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        alert(error || 'Failed to save start date')
      } else {
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7d8398' }} title="Date de début de la cohorte — pilote le rythme hebdomadaire côté étudiant">
      📅
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ fontSize: 12, border: '1px solid #e2e5ea', borderRadius: 6, padding: '2px 6px', color: '#444' }}
      />
      {dirty && (
        <button
          onClick={save}
          disabled={saving}
          style={{ fontSize: 11, fontWeight: 700, background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}
        >
          OK
        </button>
      )}
    </span>
  )
}

function waLink(num: string, label: string): string {
  const digits = (num || '').replace(/\D/g, '')
  const msg = encodeURIComponent(`Bonjour, voici les instructions de paiement pour votre place (${label}) au cours d'allemand GoGermany — 450 DH/mois.`)
  return `https://wa.me/${digits}?text=${msg}`
}

export default function AdminClassesClient({ groups, locale }: { groups: AdminGroup[]; locale: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  async function setAccess(bookingId: string, action: 'grant' | 'revoke') {
    setBusy(bookingId)
    try {
      const res = await fetch('/api/admin/classes/grant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ bookingId, action }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        alert(error || 'Failed to update access')
      } else {
        router.refresh()
      }
    } finally {
      setBusy(null)
    }
  }

  async function remove(bookingId: string, email: string) {
    if (!confirm(`Remove ${email} and free their seat?`)) return
    setBusy(bookingId)
    try {
      const res = await fetch('/api/admin/classes/remove', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        alert(error || 'Failed to remove')
      } else {
        router.refresh()
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {groups.map((g) => (
        <div key={g.id} className="adm-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0, flexWrap: 'wrap' }}>
              <strong>{g.label}</strong>
              <span style={{ fontSize: 13, color: g.booked_count + g.seed_reserved >= g.capacity ? '#d9534f' : '#7d8398' }}>
                {g.booked_count + g.seed_reserved}/{g.capacity} · {g.schedule}
              </span>
              <GroupSeats groupId={g.id} capacity={g.capacity} seedReserved={g.seed_reserved} bookedCount={g.booked_count} />
              <GroupStartDate groupId={g.id} value={g.start_date} />
            </div>
            <a
              href={`/${locale}/learn-german/classes/${g.id}/room`}
              target="_blank" rel="noreferrer"
              style={{ fontSize: 12, fontWeight: 700, background: '#16a34a', color: 'white', borderRadius: 8, padding: '5px 12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              🎥 Join room
            </a>
          </div>
          {g.students.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9aa0b0', margin: 0 }}>No bookings yet.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                {g.students.map((s) => (
                  <tr key={s.bookingId} style={{ borderTop: '1px solid #eef0f4' }}>
                    <td style={{ padding: '6px 4px' }}>
                      {s.email}
                      {s.accessActive ? (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '1px 6px' }}>✓ jusqu&rsquo;au {formatAccessDate(s.accessUntil!)}</span>
                      ) : s.accessUntil ? (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#b91c1c', background: '#fee2e2', borderRadius: 6, padding: '1px 6px' }}>⚠ expiré {formatAccessDate(s.accessUntil)}</span>
                      ) : (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#9aa0b0', background: '#f1f2f5', borderRadius: 6, padding: '1px 6px' }}>non payé</span>
                      )}
                    </td>
                    <td style={{ padding: '6px 4px', width: 170 }}>
                      {s.whatsapp ? (
                        <a href={waLink(s.whatsapp, g.label)} target="_blank" rel="noreferrer"
                          style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                          💬 {s.whatsapp}
                        </a>
                      ) : <span style={{ color: '#c0c4ce' }}>no WhatsApp</span>}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#9aa0b0', width: 80 }}>{s.bookedAt}</td>
                    <td style={{ padding: '6px 4px', width: 78, whiteSpace: 'nowrap' }} title="Présences aux appels vidéo sur 30 jours">
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.attendance30 === 0 ? '#c0c4ce' : s.attendance30 >= 12 ? '#16a34a' : '#b45309' }}>
                        🎥 {s.attendance30}/30j
                      </span>
                    </td>
                    <td style={{ padding: '6px 4px', width: 150 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setAccess(s.bookingId, 'grant')}
                          disabled={busy === s.bookingId}
                          title="Prolonger l'accès d'un mois"
                          style={{
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '3px 10px',
                            color: 'white', background: '#16a34a', border: '1px solid #16a34a',
                            opacity: busy === s.bookingId ? 0.5 : 1,
                          }}
                        >
                          {s.accessUntil ? '↻ +1 mois' : '✓ Donner accès'}
                        </button>
                        {s.accessUntil && (
                          <button
                            onClick={() => setAccess(s.bookingId, 'revoke')}
                            disabled={busy === s.bookingId}
                            style={{
                              fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '3px 10px',
                              color: '#7d8398', background: 'none', border: '1px solid #e2e5ea',
                              opacity: busy === s.bookingId ? 0.5 : 1,
                            }}
                          >
                            Révoquer
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '6px 4px', width: 80, textAlign: 'right' }}>
                      <button
                        onClick={() => remove(s.bookingId, s.email)}
                        disabled={busy === s.bookingId}
                        style={{
                          fontSize: 12, color: '#d9534f', background: 'none',
                          border: '1px solid #f0c2c2', borderRadius: 6, padding: '3px 8px',
                          cursor: 'pointer', opacity: busy === s.bookingId ? 0.5 : 1,
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  )
}
