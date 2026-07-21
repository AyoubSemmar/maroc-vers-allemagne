'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
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

/**
 * Self-contained Jitsi call widget — join button + connecting/live/error/
 * closed states, no page navigation involved. Shared by the classroom split
 * view (embedded inline) and the my-course join overlay (embedded in a
 * modal). Disposes the Jitsi instance automatically on unmount, so a parent
 * that conditionally renders this (e.g. closing a modal) cleans up for free.
 */
export default function VideoCallPanel({
  groupId,
  videoConfigured,
  autoJoin = false,
}: {
  groupId: string | null
  videoConfigured: boolean
  autoJoin?: boolean
}) {
  const t = useTranslations('learnGerman.classroom')
  const jitsiRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)

  const endCall = useCallback(() => {
    try { apiRef.current?.dispose() } catch {}
    apiRef.current = null
  }, [])

  useEffect(() => () => endCall(), [endCall])

  const joinCall = useCallback(async () => {
    // Guard against overlapping calls: the token fetch + Jitsi script load can
    // take a few seconds, and an impatient extra click while one is already
    // in flight used to race two API instances into the same container,
    // stacking video panels that never got disposed.
    if (phase === 'connecting' || phase === 'live') return
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, groupId, endCall])

  // Auto-join once on mount for contexts where the user already clicked an
  // explicit "join" action before this panel ever appeared (the my-course
  // overlay) — no point making them click twice.
  useEffect(() => {
    if (autoJoin) joinCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative w-full h-full min-h-[280px]">
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
  )
}
