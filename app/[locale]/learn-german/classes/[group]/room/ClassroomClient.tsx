'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

/**
 * Live classroom: embedded Jitsi call on one side, the Learn German lessons on
 * the other (so the teacher teaches from them and students do the Lesen /
 * Schreiben challenges in the same screen).
 *
 * MVP uses the public meet.jit.si room keyed by the group's slug; access is
 * gated server-side (only booked students + teachers reach this page). A later
 * pass can move to 8x8 JaaS with JWT for branding + cryptographic room auth.
 */
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

  // Jitsi config via URL hash: skip the prejoin screen and prefill the name.
  const jitsiUrl =
    `https://meet.jit.si/${encodeURIComponent(roomSlug)}` +
    `#userInfo.displayName=${encodeURIComponent(`"${displayName}"`)}` +
    `&config.prejoinPageEnabled=false`

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
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
              Teacher
            </span>
          )}
        </div>
        {/* Mobile tab switcher (desktop shows both panes) */}
        <div className="flex gap-1 lg:hidden">
          <button
            onClick={() => setTab('video')}
            className={`text-xs px-3 py-1 rounded ${tab === 'video' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Live
          </button>
          <button
            onClick={() => setTab('lessons')}
            className={`text-xs px-3 py-1 rounded ${tab === 'lessons' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Lessons
          </button>
        </div>
      </div>

      {/* Panes: side-by-side on lg, tabbed on mobile */}
      <div className="flex-1 min-h-0 lg:grid lg:grid-cols-[1fr_minmax(360px,42%)]">
        <div className={`h-full ${tab === 'video' ? 'block' : 'hidden'} lg:block`}>
          <iframe
            title="Live class"
            src={jitsiUrl}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          />
        </div>
        <div className={`h-full bg-white ${tab === 'lessons' ? 'block' : 'hidden'} lg:block lg:border-l lg:border-gray-700`}>
          <iframe
            title="Lessons"
            src={lessonsUrl}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}
