'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { classesStrings } from '@/components/classes/strings'

// The live classes are Morocco-only. This renders the CTA only after confirming
// (client-side, via /api/geo) the visitor is in MA — so the Learn German page
// stays statically cached and non-Moroccan visitors never see it (it starts
// hidden, so there's no flash of wrong content).
export default function LiveClassesCta({ locale }: { locale: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/geo')
      .then((r) => r.json())
      .then((d) => { if (alive && d?.country === 'MA') setShow(true) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  if (!show) return null
  const ct = classesStrings(locale)

  return (
    <Link
      href="/learn-german/classes"
      className="lg-live-cta"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
        background: 'linear-gradient(135deg,#F08A2E 0%,#F4C842 100%)',
        color: '#1a1a1a', borderRadius: 16, padding: '18px 22px', marginBottom: 28,
        textDecoration: 'none', boxShadow: '0 10px 28px -12px rgba(232,124,55,.5)',
      }}
    >
      <span style={{ fontWeight: 800, fontSize: 17 }}>🎥 {ct.title}</span>
      <span style={{ fontWeight: 700, fontSize: 14, background: 'rgba(255,255,255,.55)', padding: '8px 16px', borderRadius: 999 }}>
        {ct.book} →
      </span>
    </Link>
  )
}
