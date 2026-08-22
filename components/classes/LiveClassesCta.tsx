'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { classesStrings } from '@/components/classes/strings'
import { useCourseAccess } from '@/lib/useCourseAccess'
import { CLASSES_LAUNCHED, CLASSES_ENABLED } from '@/lib/classes-flags'

// The live classes are Morocco-only. This renders the CTA only after confirming
// (client-side, via /api/geo) the visitor is in MA — so the Learn German page
// stays statically cached and non-Moroccan visitors never see it (it starts
// hidden, so there's no flash of wrong content).
//
// Pre-launch the course is hidden from the public, but admins (the owner) still
// see the CTA — an "aperçu admin" preview — so they can reach the booking
// portal while we finish building it.
export default function LiveClassesCta({ locale }: { locale: string }) {
  const [geoAllow, setGeoAllow] = useState(false)
  const { hasAccess } = useCourseAccess()

  useEffect(() => {
    let alive = true
    fetch('/api/geo')
      .then((r) => r.json())
      .then((d) => { if (alive && d?.allow) setGeoAllow(true) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  // Live classes are removed/unlisted — hide the hub CTA for everyone.
  if (!CLASSES_ENABLED) return null

  const adminPreview = hasAccess && !CLASSES_LAUNCHED
  const show = hasAccess || (CLASSES_LAUNCHED && geoAllow)
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
      <span style={{ fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        🎥 {ct.title}
        {adminPreview && (
          <span style={{ fontSize: 11, fontWeight: 800, background: '#1a1a1a', color: '#F4C842', padding: '3px 9px', borderRadius: 999, letterSpacing: '.03em' }}>
            {ct.adminPreviewBadge}
          </span>
        )}
      </span>
      <span style={{ fontWeight: 700, fontSize: 14, background: 'rgba(255,255,255,.55)', padding: '8px 16px', borderRadius: 999 }}>
        {ct.book} →
      </span>
    </Link>
  )
}
