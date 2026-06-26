'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export type AdminGroup = {
  id: string
  label: string
  schedule: string
  capacity: number
  booked_count: number
  students: { bookingId: string; email: string; whatsapp: string; bookedAt: string }[]
}

function waLink(num: string, label: string): string {
  const digits = (num || '').replace(/\D/g, '')
  const msg = encodeURIComponent(`Bonjour, voici les instructions de paiement pour votre place (${label}) au cours d'allemand GoGermany — 300 DH/mois.`)
  return `https://wa.me/${digits}?text=${msg}`
}

export default function AdminClassesClient({ groups, locale }: { groups: AdminGroup[]; locale: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
              <strong>{g.label}</strong>
              <span style={{ fontSize: 13, color: g.booked_count >= g.capacity ? '#d9534f' : '#7d8398' }}>
                {g.booked_count}/{g.capacity} · {g.schedule}
              </span>
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
                    <td style={{ padding: '6px 4px' }}>{s.email}</td>
                    <td style={{ padding: '6px 4px', width: 170 }}>
                      {s.whatsapp ? (
                        <a href={waLink(s.whatsapp, g.label)} target="_blank" rel="noreferrer"
                          style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                          💬 {s.whatsapp}
                        </a>
                      ) : <span style={{ color: '#c0c4ce' }}>no WhatsApp</span>}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#9aa0b0', width: 90 }}>{s.bookedAt}</td>
                    <td style={{ padding: '6px 4px', width: 90, textAlign: 'right' }}>
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
