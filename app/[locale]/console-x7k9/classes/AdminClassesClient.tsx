'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export type AdminGroup = {
  id: string
  label: string
  schedule: string
  capacity: number
  booked_count: number
  students: { bookingId: string; email: string; bookedAt: string }[]
}

export default function AdminClassesClient({ groups }: { groups: AdminGroup[] }) {
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <strong>{g.label}</strong>
            <span style={{ fontSize: 13, color: g.booked_count >= g.capacity ? '#d9534f' : '#7d8398' }}>
              {g.booked_count}/{g.capacity} · {g.schedule}
            </span>
          </div>
          {g.students.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9aa0b0', margin: 0 }}>No bookings yet.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                {g.students.map((s) => (
                  <tr key={s.bookingId} style={{ borderTop: '1px solid #eef0f4' }}>
                    <td style={{ padding: '6px 4px' }}>{s.email}</td>
                    <td style={{ padding: '6px 4px', color: '#9aa0b0', width: 100 }}>{s.bookedAt}</td>
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
