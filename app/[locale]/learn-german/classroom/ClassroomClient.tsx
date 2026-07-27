'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Icon from '@/components/ui/Icon'
import VideoCallPanel from '@/components/learn-german/VideoCallPanel'

const LESSON_TABS = [
  { key: 'mycourse', labelKey: 'tabMyCourse', icon: 'graduation' as const },
  { key: 'level', labelKey: 'tabLesson', icon: 'book' as const },
  { key: 'results', labelKey: 'tabResults', icon: 'bar-chart' as const },
]

export default function ClassroomClient({
  locale,
  level,
  groupId,
  groupLabel,
  videoConfigured,
}: {
  locale: string
  level: string
  groupId: string | null
  groupLabel: string | null
  videoConfigured: boolean
}) {
  const t = useTranslations('learnGerman.classroom')
  const [videoOpen, setVideoOpen] = useState(true)
  // Minimize the live call to a small floating corner thumbnail (and back)
  // without ending it — the lesson then gets the whole screen while the class
  // keeps running in the corner.
  const [videoMin, setVideoMin] = useState(false)

  // Which lesson surface the left iframe shows. Defaults to "Mon cours" (the
  // personal dashboard: progress, vocab quiz, and devoirs/exercises) rather
  // than the public level page, so a student joining the call can actually
  // do exercises alongside it, not just read a bare lesson list.
  const lessonSrc = (key: string) => {
    const base = `/${locale}/learn-german`
    if (key === 'level') return `${base}/${level.toLowerCase()}`
    if (key === 'results') return `${base}/results`
    return `${base}/my-course`
  }
  const [lessonTab, setLessonTab] = useState('mycourse')
  // Bumped on every tab click so the iframe reloads to that tab's page even if
  // it's already the "active" tab — the iframe can navigate internally (open a
  // lesson, follow its breadcrumb), and without this a student who drilled into
  // a lesson from "Mon cours" had no way back: clicking the still-highlighted
  // "Mon cours" tab did nothing because the tab state hadn't changed.
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-900">
      {/* Slim top bar */}
      <header className="flex items-center justify-between gap-3 px-3 sm:px-4 h-12 bg-gray-950 text-white shrink-0">
        <Link href="/learn-german/my-course" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white">
          <Icon name="arrow-left" size={16} /> <span className="hidden sm:inline">{t('myCourseLink')}</span>
        </Link>
        <span className="text-sm font-semibold truncate">
          {t('liveClass')}{groupLabel ? ` · ${groupLabel}` : ''}
        </span>
        <button
          onClick={() => setVideoOpen(v => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5"
        >
          <Icon name={videoOpen ? 'x' : 'play'} size={14} />
          {videoOpen ? t('hideVideo') : t('showVideo')}
        </button>
      </header>

      {/* Split body: lessons + video. Row on desktop, stacked on mobile. */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Lessons / exercises */}
        <section className="flex-1 min-h-0 flex flex-col bg-white order-2 md:order-1">
          <div className="flex items-center gap-1 px-2 h-11 border-b border-gray-200 bg-gray-50 shrink-0 overflow-x-auto">
            {LESSON_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setLessonTab(tab.key); setReloadKey(k => k + 1) }}
                className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors ${
                  lessonTab === tab.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon name={tab.icon} size={14} /> {t(tab.labelKey as any)}
              </button>
            ))}
          </div>
          <iframe
            key={`${lessonTab}-${reloadKey}`}
            src={lessonSrc(lessonTab)}
            title={t('lessonsIframeTitle')}
            className="flex-1 w-full border-0"
          />
        </section>

        {/* Video panel — normally in the stacked/side layout; when minimized it
            docks to a small fixed corner thumbnail (kept mounted so the call
            never drops), freeing the whole screen for the lesson. */}
        {videoOpen && (
          <section className={
            videoMin
              ? 'fixed z-40 bottom-3 end-3 w-40 h-28 sm:w-56 sm:h-36 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/20 border border-gray-700 bg-gray-900 flex flex-col'
              : 'order-1 md:order-2 shrink-0 md:w-[380px] lg:w-[440px] h-[33dvh] md:h-auto bg-gray-900 border-b md:border-b-0 md:border-l border-gray-800 flex flex-col'
          }>
            <div className="relative flex-1 min-h-0">
              <VideoCallPanel groupId={groupId} videoConfigured={videoConfigured} />
              {/* Minimize to corner / expand back. Top-start so it never
                  overlaps the panel's own close (✕) at top-end. */}
              <button
                onClick={() => setVideoMin(m => !m)}
                aria-label={videoMin ? t('expandVideo') : t('minimizeVideo')}
                title={videoMin ? t('expandVideo') : t('minimizeVideo')}
                className="absolute top-2 start-2 z-20 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-black/50 hover:bg-black/70 active:bg-black/80 text-white"
              >
                {videoMin ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
