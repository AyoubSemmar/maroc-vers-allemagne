'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Icon from '@/components/ui/Icon'
import { jaasScriptUrl } from '@/lib/jaas'

type Phase = 'idle' | 'connecting' | 'live' | 'closed' | 'error' | 'not_configured'

// Load 8x8's external_api.js once (per AppID) and resolve when the global
// constructor is available.
let scriptPromise: Promise<void> | null = null
function loadJitsiScript(appId: string): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).JitsiMeetExternalAPI) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = jaasScriptUrl(appId)
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => { scriptPromise = null; reject(new Error('script load failed')) }
    document.body.appendChild(s)
  })
  return scriptPromise
}

const LESSON_TABS = [
  { key: 'level', labelKey: 'tabLesson', icon: 'book' as const },
  { key: 'all', labelKey: 'tabAll', icon: 'list' as const },
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
  const jitsiRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  const [videoOpen, setVideoOpen] = useState(true)

  // Which lesson surface the left iframe shows.
  const lessonSrc = (key: string) => {
    const base = `/${locale}/learn-german`
    if (key === 'all') return base
    if (key === 'results') return `${base}/results`
    return `${base}/${level.toLowerCase()}`
  }
  const [lessonTab, setLessonTab] = useState('level')

  const endCall = useCallback(() => {
    try { apiRef.current?.dispose() } catch {}
    apiRef.current = null
  }, [])

  useEffect(() => () => endCall(), [endCall])

  async function joinCall() {
    if (!groupId) { setError(t('errNoGroup')); setPhase('error'); return }
    setPhase('connecting'); setError(null)
    try {
      const res = await fetch('/api/classes/jaas-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'not_configured') { setPhase('not_configured'); return }
        setError(data.error || t('errStart')); setPhase('error'); return
      }

      await loadJitsiScript(data.appId)
      const JitsiMeetExternalAPI = (window as any).JitsiMeetExternalAPI
      if (!JitsiMeetExternalAPI || !jitsiRef.current) { setError(t('errVideoLoad')); setPhase('error'); return }

      endCall()
      jitsiRef.current.innerHTML = ''
      const api = new JitsiMeetExternalAPI('8x8.vc', {
        roomName: data.roomName,
        jwt: data.jwt,
        parentNode: jitsiRef.current,
        width: '100%',
        height: '100%',
        userInfo: { displayName: data.displayName },
        configOverwrite: {
          prejoinPageEnabled: false,
          prejoinConfig: { enabled: false },
          startWithAudioMuted: !data.moderator,
          startWithVideoMuted: !data.moderator,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: { MOBILE_APP_PROMO: false },
      })
      apiRef.current = api
      api.addEventListener('videoConferenceJoined', () => setPhase('live'))
      api.addEventListener('readyToClose', () => { endCall(); setPhase('closed') })
      api.addEventListener('videoConferenceLeft', () => { endCall(); setPhase('closed') })
    } catch (e: any) {
      setError(t('errNetwork')); setPhase('error')
    }
  }

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
                onClick={() => setLessonTab(tab.key)}
                className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap transition-colors ${
                  lessonTab === tab.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon name={tab.icon} size={14} /> {t(tab.labelKey as any)}
              </button>
            ))}
          </div>
          <iframe
            key={lessonTab}
            src={lessonSrc(lessonTab)}
            title={t('lessonsIframeTitle')}
            className="flex-1 w-full border-0"
          />
        </section>

        {/* Video panel */}
        {videoOpen && (
          <section className="order-1 md:order-2 shrink-0 md:w-[380px] lg:w-[440px] h-[38dvh] md:h-auto bg-gray-900 border-b md:border-b-0 md:border-l border-gray-800 flex flex-col">
            <div className="relative flex-1 min-h-0">
              {/* The Jitsi iframe mounts here when live */}
              <div ref={jitsiRef} className={`absolute inset-0 ${phase === 'live' || phase === 'connecting' ? '' : 'hidden'}`} />

              {phase !== 'live' && phase !== 'connecting' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 text-gray-300">
                  {!videoConfigured || phase === 'not_configured' ? (
                    <>
                      <Icon name="play" size={34} className="text-gray-500 mb-3" />
                      <p className="text-sm font-semibold text-white">{t('videoSoonTitle')}</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-[15rem]">{t('videoSoonBody')}</p>
                    </>
                  ) : phase === 'closed' ? (
                    <>
                      <Icon name="check" size={34} className="text-green-500 mb-3" />
                      <p className="text-sm font-semibold text-white">{t('callEnded')}</p>
                      <button onClick={joinCall} className="mt-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5">{t('rejoin')}</button>
                    </>
                  ) : phase === 'error' ? (
                    <>
                      <Icon name="x" size={34} className="text-red-400 mb-3" />
                      <p className="text-sm font-semibold text-white">{error}</p>
                      <button onClick={joinCall} className="mt-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-2.5">{t('retry')}</button>
                    </>
                  ) : (
                    // idle
                    <>
                      <Icon name="play" size={34} className="text-gray-500 mb-3" />
                      <p className="text-sm font-semibold text-white">{t('liveClass')}</p>
                      <button onClick={joinCall} className="mt-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5">
                        {t('joinCallBtn')}
                      </button>
                    </>
                  )}
                </div>
              )}

              {phase === 'connecting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 text-gray-200 text-sm">{t('connecting')}</div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
