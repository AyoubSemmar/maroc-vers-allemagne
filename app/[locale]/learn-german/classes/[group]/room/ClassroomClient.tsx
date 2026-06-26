'use client'

import { Link } from '@/i18n/navigation'

/**
 * Live classroom: the Learn German lessons on the page, and a button that opens
 * the Jitsi call in a NEW TAB. Opening meet.jit.si as a full page (not an
 * iframe) avoids the 5-minute demo cap that applies only to embedding — so the
 * call is free and unlimited. A JaaS/self-hosted upgrade can re-embed it later.
 *
 * Access is gated server-side (only booked students + teachers reach this page).
 */
const JITSI_DOMAIN = 'meet.jit.si'

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
  const callUrl =
    `https://${JITSI_DOMAIN}/${encodeURIComponent(roomSlug)}` +
    `#userInfo.displayName=${encodeURIComponent(`"${displayName}"`)}` +
    `&config.prejoinPageEnabled=false` +
    (isTeacher ? '' : '&config.startWithAudioMuted=true&config.startWithVideoMuted=true')

  const lessonsUrl = `/${locale}/learn-german/${level}`

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-100 shrink-0 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/learn-german/classes" className="text-sm text-gray-400 hover:text-white shrink-0">
            ← {groupLabel}
          </Link>
          {isTeacher && (
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Teacher</span>
          )}
          <Link href="/learn-german/my-course" className="text-sm text-gray-400 hover:text-white shrink-0">
            📋 Mon cours
          </Link>
        </div>
        <a
          href={callUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 shrink-0"
        >
          🎥 Rejoindre l’appel vidéo ↗
        </a>
      </div>

      {/* First-time hint */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 shrink-0">
        💡 Cliquez sur <strong>« Rejoindre l’appel vidéo »</strong> pour ouvrir la classe en direct dans un nouvel onglet. Gardez cet onglet pour les leçons à côté.
      </div>

      {/* Lessons — full width on the page */}
      <div className="flex-1 min-h-0 bg-white">
        <iframe title="Lessons" src={lessonsUrl} className="w-full h-full border-0" />
      </div>
    </div>
  )
}
