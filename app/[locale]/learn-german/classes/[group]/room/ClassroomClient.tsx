'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'

/**
 * Live classroom: embedded Jitsi call (via the External API for proper control
 * — no prejoin screen, students muted on join, named participants, room subject)
 * beside the Learn German lessons so the teacher teaches from them and students
 * do the Lesen / Schreiben challenges in the same screen.
 *
 * Access is gated server-side (only booked students + teachers reach this page).
 * Uses public meet.jit.si for now; a JaaS/self-hosted JWT upgrade can lock the
 * room cryptographically later without touching this UI.
 */
const JITSI_DOMAIN = 'meet.jit.si'

declare global {
  interface Window { JitsiMeetExternalAPI?: any }
}

function loadJitsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject()
    if (window.JitsiMeetExternalAPI) return resolve()
    const existing = document.getElementById('jitsi-external-api')
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const s = document.createElement('script')
    s.id = 'jitsi-external-api'
    s.src = `https://${JITSI_DOMAIN}/external_api.js`
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject()
    document.body.appendChild(s)
  })
}

export default function ClassroomClient({
  locale,
  roomSlug,
  groupLabel,
  level,
  displayName,
  isTeacher,
}: {
  locale: string
  roomSlug: string
  groupLabel: string
  level: string
  displayName: string
  isTeacher: boolean
}) {
  const [tab, setTab] = useState<'video' | 'lessons'>('video')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const apiRef = useRef<any>(null)

  useEffect(() => {
    let disposed = false
    loadJitsiScript().then(() => {
      if (disposed || !containerRef.current || !window.JitsiMeetExternalAPI) return
      apiRef.current = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName: roomSlug,
        parentNode: containerRef.current,
        userInfo: { displayName },
        configOverwrite: {
          prejoinPageEnabled: false,
          // Teacher joins live; students arrive muted to avoid a noisy room.
          startWithAudioMuted: !isTeacher,
          startWithVideoMuted: !isTeacher,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          subject: groupLabel,
        },
        interfaceConfigOverwrite: {
          MOBILE_APP_PROMO: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_CHROME_EXTENSION_BANNER: false,
          DISABLE_DEEP_LINKING: true,
        },
      })
    }).catch(() => {})

    return () => {
      disposed = true
      try { apiRef.current?.dispose() } catch {}
      apiRef.current = null
    }
  }, [roomSlug, displayName, isTeacher, groupLabel])

  const lessonsUrl = `/${locale}/learn-german/${level}`

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-100 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/learn-german/classes" className="text-sm text-gray-400 hover:text-white shrink-0">
            ← {groupLabel}
          </Link>
          {isTeacher && (
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Teacher</span>
          )}
        </div>
        <div className="flex gap-1 lg:hidden">
          <button onClick={() => setTab('video')} className={`text-xs px-3 py-1 rounded ${tab === 'video' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Live</button>
          <button onClick={() => setTab('lessons')} className={`text-xs px-3 py-1 rounded ${tab === 'lessons' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Lessons</button>
        </div>
      </div>

      {/* Panes: side-by-side on lg, tabbed on mobile */}
      <div className="flex-1 min-h-0 lg:grid lg:grid-cols-[1fr_minmax(360px,42%)]">
        <div className={`h-full bg-black ${tab === 'video' ? 'block' : 'hidden'} lg:block`}>
          <div ref={containerRef} className="w-full h-full" />
        </div>
        <div className={`h-full bg-white ${tab === 'lessons' ? 'block' : 'hidden'} lg:block lg:border-l lg:border-gray-700`}>
          <iframe title="Lessons" src={lessonsUrl} className="w-full h-full border-0" />
        </div>
      </div>
    </div>
  )
}
