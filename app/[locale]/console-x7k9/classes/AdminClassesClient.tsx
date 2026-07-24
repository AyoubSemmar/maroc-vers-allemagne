'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatAccessDate } from '@/lib/courseAccess'

export type AdminGroup = {
  id: string
  label: string
  schedule: string
  level: string
  price_mad: number
  capacity: number
  booked_count: number
  seed_reserved: number
  lessons_done: number
  lessons_total: number
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

  const inp: React.CSSProperties = { width: 44, fontSize: 12, border: '1px solid var(--adm-line-strong)', borderRadius: 6, padding: '2px 4px', color: '#1a1a1a', background: '#fff', textAlign: 'center' }
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

/** Per-group lesson tracker — the teacher bumps +1 each time the live class
 *  finishes a lesson, capped at the level's total lesson count. */
function LessonTracker({ groupId, done, total }: { groupId: string; done: number; total: number }) {
  const router = useRouter()
  const [val, setVal] = useState(done)
  const [saving, setSaving] = useState(false)

  async function set(n: number) {
    const clamped = Math.max(0, Math.min(total, n))
    if (clamped === val) return
    setVal(clamped)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/classes/group-lessons', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ groupId, lessonsDone: clamped }),
      })
      if (!res.ok) { const { error } = await res.json().catch(() => ({ error: 'Failed' })); alert(error || 'Échec'); setVal(done); return }
      router.refresh()
    } finally { setSaving(false) }
  }

  const pct = total ? Math.round((val / total) * 100) : 0
  const btn: React.CSSProperties = { width: 24, height: 24, borderRadius: 6, border: '1px solid var(--adm-line-strong)', background: 'var(--adm-bg-elev)', color: 'var(--adm-ink)', cursor: 'pointer', fontWeight: 800, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--adm-ink-soft)' }} title="Leçons terminées en classe — +1 par leçon, jusqu'à la fin du niveau">
      📚
      <button onClick={() => set(val - 1)} disabled={saving || val <= 0} style={{ ...btn, opacity: val <= 0 ? 0.4 : 1 }}>−</button>
      <span style={{ fontWeight: 800, color: val >= total && total > 0 ? 'var(--adm-green)' : 'var(--adm-ink)', minWidth: 46, textAlign: 'center' }}>{val}/{total}</span>
      <button onClick={() => set(val + 1)} disabled={saving || val >= total} style={{ ...btn, opacity: val >= total ? 0.4 : 1 }}>+</button>
      <span style={{ color: 'var(--adm-ink-mute)', minWidth: 32 }}>{pct}%</span>
    </span>
  )
}

function waLink(num: string, label: string): string {
  const digits = (num || '').replace(/\D/g, '')
  const msg = encodeURIComponent(`Bonjour, voici les instructions de paiement pour votre place (${label}) au cours d'allemand GoGermany — 450 DH/mois.`)
  return `https://wa.me/${digits}?text=${msg}`
}

export type ReservationRequest = {
  id: string
  fullName: string
  whatsapp: string
  email: string
  groupId: string | null
  groupLabel: string
  requestedAt: string
}

/** Pending seat requests from the public form. Confirm provisions the student
 *  (account + seat + 1 month access); the starter password is shown once so it
 *  can be relayed on WhatsApp. */
function PendingRequests({ requests }: { requests: ReservationRequest[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [creds, setCreds] = useState<Record<string, string>>({})

  async function resolve(id: string, action: 'confirm' | 'reject', name: string) {
    if (action === 'reject' && !confirm(`Rejeter la demande de ${name} ?`)) return
    setBusy(id)
    try {
      const res = await fetch('/api/admin/classes/resolve-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ requestId: id, action }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { alert(data.error || 'Échec'); return }
      if (action === 'confirm') {
        setCreds((c) => ({
          ...c,
          [id]: data.existingAccount
            ? `Compte déjà existant — l'élève se connecte avec son mot de passe habituel (${data.email}).`
            : `✅ ${data.email} · mot de passe : ${data.password} (à changer à la 1ʳᵉ connexion)`,
        }))
        // Keep the confirmation note visible; refresh the rest after a beat.
        setTimeout(() => router.refresh(), 2500)
      } else {
        router.refresh()
      }
    } finally {
      setBusy(null)
    }
  }

  if (requests.length === 0) return null

  return (
    <div className="adm-card" style={{ padding: 16, marginBottom: 16, borderInlineStart: '4px solid var(--adm-gold)' }}>
      <strong style={{ display: 'block', marginBottom: 10 }}>
        📝 Demandes de réservation — {requests.length} en attente
      </strong>
      <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} style={{ borderTop: '1px solid var(--adm-line)' }}>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                <div style={{ fontWeight: 700, color: 'var(--adm-ink)' }}>{r.fullName}</div>
                <div style={{ color: 'var(--adm-ink-soft)', fontSize: 12 }}>{r.email}</div>
                {creds[r.id] && (
                  <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: 'var(--adm-green)' }}>{creds[r.id]}</div>
                )}
              </td>
              <td style={{ padding: '8px 4px', width: 160, verticalAlign: 'top' }}>
                <a href={waLink(r.whatsapp, r.groupLabel)} target="_blank" rel="noreferrer"
                  style={{ color: 'var(--adm-green)', fontWeight: 600, textDecoration: 'none' }}>
                  💬 {r.whatsapp}
                </a>
                <div style={{ color: 'var(--adm-ink-mute)', fontSize: 12, marginTop: 2 }}>{r.groupLabel}</div>
              </td>
              <td style={{ padding: '8px 4px', color: 'var(--adm-ink-mute)', width: 82, verticalAlign: 'top' }}>{r.requestedAt}</td>
              <td style={{ padding: '8px 4px', width: 180, verticalAlign: 'top', textAlign: 'right' }}>
                {!creds[r.id] && (
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => resolve(r.id, 'confirm', r.fullName)}
                      disabled={busy === r.id}
                      style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '4px 12px', color: 'white', background: '#16a34a', border: '1px solid #16a34a', opacity: busy === r.id ? 0.5 : 1 }}
                    >
                      ✓ Confirmer
                    </button>
                    <button
                      onClick={() => resolve(r.id, 'reject', r.fullName)}
                      disabled={busy === r.id}
                      style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '4px 10px', color: 'var(--adm-ink-mute)', background: 'none', border: '1px solid var(--adm-line-strong)', opacity: busy === r.id ? 0.5 : 1 }}
                    >
                      Rejeter
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const LEVEL_OPTS = ['a1', 'a2', 'b1', 'b2', 'c1']

/** Edit a group's label / schedule / level / price, or delete it. */
function GroupEditor({ group, onDone }: { group: AdminGroup; onDone: () => void }) {
  const router = useRouter()
  const [label, setLabel] = useState(group.label)
  const [schedule, setSchedule] = useState(group.schedule)
  const [level, setLevel] = useState(group.level)
  const [price, setPrice] = useState(String(group.price_mad))
  const [saving, setSaving] = useState(false)
  const dirty =
    label !== group.label || schedule !== group.schedule ||
    level !== group.level || price !== String(group.price_mad)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/classes/group-update', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ groupId: group.id, label, schedule, level, priceMad: Number(price) }),
      })
      if (!res.ok) { const { error } = await res.json().catch(() => ({ error: 'Failed' })); alert(error || 'Échec'); return }
      onDone(); router.refresh()
    } finally { setSaving(false) }
  }

  async function del() {
    const n = group.students.length
    const msg = n > 0
      ? `Supprimer « ${group.label} » ? ${n} élève(s) inscrit(s) — leur place et leur accès seront supprimés. Cette action est irréversible.`
      : `Supprimer le groupe « ${group.label} » ?`
    if (!confirm(msg)) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/classes/group-delete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ groupId: group.id, force: n > 0 }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { alert(data.error === 'has_students' ? `Ce groupe a ${data.students} élève(s). Réessayez.` : (data.error || 'Échec')); return }
      onDone(); router.refresh()
    } finally { setSaving(false) }
  }

  const field: React.CSSProperties = { fontSize: 13, border: '1px solid var(--adm-line-strong)', borderRadius: 6, padding: '6px 8px', color: '#1a1a1a', background: '#fff', width: '100%' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'var(--adm-ink-mute)', display: 'block', marginBottom: 3 }

  return (
    <div style={{ marginTop: 12, padding: 14, borderRadius: 10, background: 'var(--adm-bg-elev)', border: '1px solid var(--adm-line)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        <div><span style={lbl}>Nom du groupe</span><input value={label} onChange={(e) => setLabel(e.target.value)} style={field} /></div>
        <div><span style={lbl}>Horaire</span><input value={schedule} onChange={(e) => setSchedule(e.target.value)} style={field} /></div>
        <div>
          <span style={lbl}>Niveau</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} style={field}>
            {LEVEL_OPTS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>
        <div><span style={lbl}>Prix (MAD/mois)</span><input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={field} /></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
        <button
          onClick={del}
          disabled={saving}
          style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '6px 14px', color: '#d9534f', background: 'none', border: '1px solid #f0c2c2', opacity: saving ? 0.5 : 1 }}
        >
          🗑 Supprimer le groupe
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onDone}
            disabled={saving}
            style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '6px 14px', color: 'var(--adm-ink-soft)', background: 'none', border: '1px solid var(--adm-line-strong)' }}
          >
            Annuler
          </button>
          <button
            onClick={save}
            disabled={saving || !dirty}
            style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '6px 16px', color: 'white', background: '#16a34a', border: '1px solid #16a34a', opacity: saving || !dirty ? 0.5 : 1 }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

/** Create a new class group (id + video room are generated server-side). */
function AddGroupForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [schedule, setSchedule] = useState('')
  const [level, setLevel] = useState('a1')
  const [price, setPrice] = useState('450')
  const [capacity, setCapacity] = useState('15')
  const [saving, setSaving] = useState(false)

  async function create() {
    if (label.trim().length < 1) { alert('Nom du groupe requis'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/classes/group-create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ label, schedule, level, priceMad: Number(price), capacity: Number(capacity) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { alert(data.error || 'Échec'); return }
      setOpen(false); setLabel(''); setSchedule(''); setLevel('a1'); setPrice('450'); setCapacity('15')
      router.refresh()
    } finally { setSaving(false) }
  }

  const field: React.CSSProperties = { fontSize: 13, border: '1px solid var(--adm-line-strong)', borderRadius: 6, padding: '6px 8px', color: '#1a1a1a', background: '#fff', width: '100%' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'var(--adm-ink-mute)', display: 'block', marginBottom: 3 }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="adm-btn" style={{ alignSelf: 'flex-start' }}>
        ＋ Ajouter un groupe
      </button>
    )
  }
  return (
    <div className="adm-card" style={{ padding: 16, borderInlineStart: '4px solid var(--adm-green)' }}>
      <strong style={{ display: 'block', marginBottom: 12 }}>Nouveau groupe</strong>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
        <div><span style={lbl}>Nom du groupe</span><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="A1 — 18h-19h" style={field} /></div>
        <div><span style={lbl}>Horaire</span><input value={schedule} onChange={(e) => setSchedule(e.target.value)} placeholder="Lun-Ven 18:00-19:00" style={field} /></div>
        <div>
          <span style={lbl}>Niveau</span>
          <select value={level} onChange={(e) => setLevel(e.target.value)} style={field}>
            {LEVEL_OPTS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>
        <div><span style={lbl}>Prix (MAD/mois)</span><input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} style={field} /></div>
        <div><span style={lbl}>Capacité</span><input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} style={field} /></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
        <button onClick={() => setOpen(false)} disabled={saving} style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '6px 14px', color: 'var(--adm-ink-soft)', background: 'none', border: '1px solid var(--adm-line-strong)' }}>Annuler</button>
        <button onClick={create} disabled={saving} style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '6px 16px', color: 'white', background: '#16a34a', border: '1px solid #16a34a', opacity: saving ? 0.5 : 1 }}>Créer le groupe</button>
      </div>
    </div>
  )
}

/** One group: a collapsible header (click to reveal the student list) plus the
 *  group's controls (seats, lesson tracker, edit/delete, join room). */
function GroupCard({ group: g, locale, allGroups }: { group: AdminGroup; locale: string; allGroups: { id: string; label: string; level: string }[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)

  async function move(bookingId: string, targetGroupId: string, email: string) {
    const target = allGroups.find((x) => x.id === targetGroupId)
    if (!target) return
    if (!confirm(`Déplacer ${email} vers « ${target.label} » (${target.level.toUpperCase()}) ?`)) return
    setBusy(bookingId)
    try {
      const res = await fetch('/api/admin/classes/move-student', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ bookingId, targetGroupId }),
      })
      if (!res.ok) { const { error } = await res.json().catch(() => ({ error: 'Failed' })); alert(error || 'Failed') }
      else router.refresh()
    } finally { setBusy(null) }
  }

  async function setAccess(bookingId: string, action: 'grant' | 'revoke') {
    setBusy(bookingId)
    try {
      const res = await fetch('/api/admin/classes/grant', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ bookingId, action }),
      })
      if (!res.ok) { const { error } = await res.json().catch(() => ({ error: 'Failed' })); alert(error || 'Failed') }
      else router.refresh()
    } finally { setBusy(null) }
  }

  async function remove(bookingId: string, email: string) {
    if (!confirm(`Retirer ${email} et libérer sa place ?`)) return
    setBusy(bookingId)
    try {
      const res = await fetch('/api/admin/classes/remove', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })
      if (!res.ok) { const { error } = await res.json().catch(() => ({ error: 'Failed' })); alert(error || 'Failed') }
      else router.refresh()
    } finally { setBusy(null) }
  }

  const reserved = g.booked_count + g.seed_reserved
  const n = g.students.length

  return (
    <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setOpen((o) => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flexWrap: 'wrap', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left', color: 'var(--adm-ink)', font: 'inherit', flex: 1 }}
          >
            <span style={{ color: 'var(--adm-ink-mute)', transition: 'transform .15s', transform: open ? 'rotate(90deg)' : 'none', flex: 'none' }}>▸</span>
            <strong>{g.label}</strong>
            <span style={{ fontSize: 13, color: reserved >= g.capacity ? '#e25f5f' : 'var(--adm-ink-mute)' }}>
              {reserved}/{g.capacity} · {g.price_mad} MAD · {g.schedule}
            </span>
            <span style={{ fontSize: 12, color: 'var(--adm-ink-soft)' }}>· {n} élève{n !== 1 ? 's' : ''}</span>
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setEditing((v) => !v)}
              title="Modifier / supprimer le groupe"
              style={{ fontSize: 12, fontWeight: 700, background: editing ? 'var(--adm-bg-elev)' : 'none', color: 'var(--adm-ink-soft)', border: '1px solid var(--adm-line-strong)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              ⚙ Modifier
            </button>
            <a
              href={`/${locale}/learn-german/classes/${g.id}/room`}
              target="_blank" rel="noreferrer"
              style={{ fontSize: 12, fontWeight: 700, background: '#16a34a', color: 'white', borderRadius: 8, padding: '5px 12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              🎥 Join room
            </a>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          <GroupSeats groupId={g.id} capacity={g.capacity} seedReserved={g.seed_reserved} bookedCount={g.booked_count} />
          <LessonTracker groupId={g.id} done={g.lessons_done} total={g.lessons_total} />
        </div>

        {editing && <GroupEditor group={g} onDone={() => setEditing(false)} />}
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--adm-line)', padding: '8px 16px 14px' }}>
          {n === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--adm-ink-mute)', margin: '6px 0 0' }}>Aucun élève inscrit.</p>
          ) : (
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <tbody>
                {g.students.map((s) => (
                  <tr key={s.bookingId} style={{ borderTop: '1px solid var(--adm-line)' }}>
                    <td style={{ padding: '8px 4px', color: 'var(--adm-ink)' }}>
                      {s.email}
                      {s.accessActive ? (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#16a34a', background: '#dcfce7', borderRadius: 6, padding: '1px 6px' }}>✓ jusqu&rsquo;au {formatAccessDate(s.accessUntil!)}</span>
                      ) : s.accessUntil ? (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#b91c1c', background: '#fee2e2', borderRadius: 6, padding: '1px 6px' }}>⚠ expiré {formatAccessDate(s.accessUntil)}</span>
                      ) : (
                        <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: '#4b5563', background: '#e5e7eb', borderRadius: 6, padding: '1px 6px' }}>non payé</span>
                      )}
                    </td>
                    <td style={{ padding: '8px 4px', width: 170 }}>
                      {s.whatsapp ? (
                        <a href={waLink(s.whatsapp, g.label)} target="_blank" rel="noreferrer" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>💬 {s.whatsapp}</a>
                      ) : <span style={{ color: 'var(--adm-ink-mute)' }}>no WhatsApp</span>}
                    </td>
                    <td style={{ padding: '8px 4px', color: 'var(--adm-ink-mute)', width: 80 }}>{s.bookedAt}</td>
                    <td style={{ padding: '8px 4px', width: 78, whiteSpace: 'nowrap' }} title="Présences aux appels vidéo sur 30 jours">
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.attendance30 === 0 ? 'var(--adm-ink-mute)' : s.attendance30 >= 12 ? '#16a34a' : '#b45309' }}>🎥 {s.attendance30}/30j</span>
                    </td>
                    <td style={{ padding: '8px 4px', width: 150 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setAccess(s.bookingId, 'grant')}
                          disabled={busy === s.bookingId}
                          title="Prolonger l'accès d'un mois"
                          style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '3px 10px', color: 'white', background: '#16a34a', border: '1px solid #16a34a', opacity: busy === s.bookingId ? 0.5 : 1 }}
                        >
                          {s.accessUntil ? '↻ +1 mois' : '✓ Donner accès'}
                        </button>
                        {s.accessUntil && (
                          <button
                            onClick={() => setAccess(s.bookingId, 'revoke')}
                            disabled={busy === s.bookingId}
                            style={{ fontSize: 12, fontWeight: 700, cursor: 'pointer', borderRadius: 6, padding: '3px 10px', color: 'var(--adm-ink-soft)', background: 'none', border: '1px solid var(--adm-line-strong)', opacity: busy === s.bookingId ? 0.5 : 1 }}
                          >
                            Révoquer
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '8px 4px', width: 150 }}>
                      <select
                        value=""
                        disabled={busy === s.bookingId}
                        onChange={(e) => { if (e.target.value) move(s.bookingId, e.target.value, s.email) }}
                        title="Déplacer vers un autre groupe (tous niveaux)"
                        style={{ fontSize: 12, border: '1px solid var(--adm-line-strong)', borderRadius: 6, padding: '3px 6px', color: '#1a1a1a', background: '#fff', maxWidth: 140, opacity: busy === s.bookingId ? 0.5 : 1 }}
                      >
                        <option value="">⇄ Déplacer…</option>
                        {allGroups.filter((g2) => g2.id !== g.id).map((g2) => (
                          <option key={g2.id} value={g2.id}>{g2.level.toUpperCase()} · {g2.label}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '8px 4px', width: 80, textAlign: 'right' }}>
                      <button
                        onClick={() => remove(s.bookingId, s.email)}
                        disabled={busy === s.bookingId}
                        style={{ fontSize: 12, color: '#d9534f', background: 'none', border: '1px solid #f0c2c2', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', opacity: busy === s.bookingId ? 0.5 : 1 }}
                      >
                        Retirer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminClassesClient({ groups, requests, locale }: { groups: AdminGroup[]; requests: ReservationRequest[]; locale: string }) {
  const allGroups = groups.map((g) => ({ id: g.id, label: g.label, level: g.level }))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PendingRequests requests={requests} />
      <AddGroupForm />
      {groups.map((g) => <GroupCard key={g.id} group={g} locale={locale} allGroups={allGroups} />)}
    </div>
  )
}
