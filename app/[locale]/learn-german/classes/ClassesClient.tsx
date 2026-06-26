'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { classesStrings } from '@/components/classes/strings'

export type ClassGroup = {
  id: string
  label: string
  schedule: string
  level: string
  price_mad: number
  capacity: number
  booked_count: number
}

const LEVELS = ['a1', 'a2', 'b1'] as const
const LEVEL_LABEL: Record<string, string> = { a1: 'A1', a2: 'A2', b1: 'B1' }
// Business WhatsApp for arranging the offline payment (digits only, with country
// code). Set NEXT_PUBLIC_CLASSES_WHATSAPP in Vercel to enable the "pay" button.
const WHATSAPP = (process.env.NEXT_PUBLIC_CLASSES_WHATSAPP || '').replace(/\D/g, '')

export default function ClassesClient({
  locale,
  groups,
  myGroupId,
  isAuthed,
}: {
  locale: string
  groups: ClassGroup[]
  myGroupId: string | null
  isAuthed: boolean
}) {
  const t = classesStrings(locale)
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const myGroupLabel = groups.find((g) => g.id === myGroupId)?.label ?? ''
  const payMsg = `Bonjour, j'ai réservé une place (${myGroupLabel}) pour les cours d'allemand en ligne. Je souhaite régler les 300 DH/mois.`
  const [msg, setMsg] = useState<string | null>(null)

  async function book(groupId: string) {
    setBusy(groupId)
    setMsg(null)
    try {
      const res = await fetch('/api/classes/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ groupId }),
      })
      const { status } = await res.json()
      if (status === 'ok') { router.refresh(); return }
      if (status === 'already') setMsg(t.alreadyMsg)
      else if (status === 'full') { setMsg(t.fullMsg); router.refresh() }
      else if (status === 'auth') { router.push(`/${locale}/login?next=${encodeURIComponent(`/${locale}/learn-german/classes`)}`); return }
      else setMsg(t.errMsg)
    } catch {
      setMsg(t.errMsg)
    } finally {
      setBusy(null)
    }
  }

  async function cancel() {
    setBusy('cancel')
    setMsg(null)
    try {
      await fetch('/api/classes/cancel', { method: 'POST' })
      router.refresh()
    } catch {
      setMsg(t.errMsg)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {msg && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
          {msg}
        </div>
      )}

      {/* You have a reserved seat → payment instructions come via WhatsApp. */}
      {myGroupId && (
        <div className="rounded-xl bg-green-600 border border-green-500 shadow-sm px-4 py-3 text-sm text-white flex items-center justify-between gap-3 flex-wrap">
          <span className="font-medium">✅ {t.enrolledNote}</span>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/learn-german/my-course"
              className="rounded-lg bg-white text-green-800 hover:bg-green-50 text-xs font-bold px-4 py-2"
            >
              📋 Mon cours
            </Link>
            {WHATSAPP && (
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(payMsg)}`}
                target="_blank" rel="noreferrer"
                className="rounded-lg bg-green-800 hover:bg-green-900 text-white text-xs font-semibold px-4 py-2"
              >
                💬 {t.payWhatsapp}
              </a>
            )}
          </div>
        </div>
      )}


      {LEVELS.map((level) => {
        const lvlGroups = groups.filter((g) => (g.level || 'a1') === level)
        if (lvlGroups.length === 0) return null
        return (
        <div key={level} className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-gray-900 mt-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 text-white text-xs">{LEVEL_LABEL[level]}</span>
            <span>{t.level.replace(/A1/g, LEVEL_LABEL[level])}</span>
          </h2>
          {lvlGroups.map((g) => {
        const isMine = myGroupId === g.id
        const isFull = g.booked_count >= g.capacity
        const bookedElsewhere = !!myGroupId && !isMine
        const left = Math.max(0, g.capacity - g.booked_count)

        return (
          <div
            key={g.id}
            className={`rounded-xl border bg-white p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${
              isMine ? 'border-green-400 ring-1 ring-green-200' : 'border-gray-200'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{g.label}</h3>
                <span className="text-[11px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                  {(g.level || 'a1').toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{g.schedule}</p>
              <p className="text-sm font-medium text-gray-700 mt-1">
                {g.price_mad} {t.perMonth}
              </p>
            </div>

            {/* Capacity */}
            <div className="text-center sm:w-28">
              <div className={`text-lg font-bold ${isFull ? 'text-gray-400' : 'text-gray-900'}`}>
                {g.booked_count}/{g.capacity}
              </div>
              <div className="text-[11px] text-gray-400">
                {isFull ? t.full : `${left} ${t.seatsLeft}`}
              </div>
            </div>

            {/* Action */}
            <div className="sm:w-44 flex flex-col gap-2">
              {isMine ? (
                <>
                  <Link
                    href="/learn-german/my-course"
                    className="text-center rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2"
                  >
                    📋 Mon cours
                  </Link>
                  <button
                    onClick={cancel}
                    disabled={busy === 'cancel'}
                    className="text-xs text-gray-400 hover:text-red-600 disabled:opacity-50"
                  >
                    {t.cancel}
                  </button>
                </>
              ) : isFull ? (
                <button
                  disabled
                  className="rounded-lg bg-gray-100 text-gray-400 text-sm font-medium px-4 py-2 cursor-not-allowed"
                >
                  {t.full}
                </button>
              ) : !isAuthed ? (
                <Link
                  href={`/login?next=${encodeURIComponent(`/${locale}/learn-german/classes`)}`}
                  className="text-center rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-sm font-medium px-4 py-2"
                >
                  {t.loginToBook}
                </Link>
              ) : (
                <button
                  onClick={() => book(g.id)}
                  disabled={busy === g.id || bookedElsewhere}
                  title={bookedElsewhere ? t.alreadyMsg : undefined}
                  className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy === g.id ? t.booking : t.book}
                </button>
              )}
            </div>
          </div>
        )
          })}
        </div>
        )
      })}
    </div>
  )
}
