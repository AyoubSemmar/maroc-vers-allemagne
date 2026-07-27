'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Icon from '@/components/ui/Icon'
import { jaasScriptUrl } from '@/lib/jaas'

type Phase = 'idle' | 'connecting' | 'live' | 'closed' | 'error' | 'not_configured'

// Module-level singleton: only one live/connecting call across the whole
// app at a time, even if more than one VideoCallPanel ends up mounted (the
// classroom page and the my-course overlay both present, or a stray
// instance left over from something like a hot-reload). A second instance's
// join attempt is simply ignored instead of racing a second Jitsi API
// connection into existence.
let activeCallOwner: symbol | null = null

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
  const ownerId = useRef(Symbol('videoCallOwner')).current
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)

  // Plain teardown once Jitsi has already confirmed the conference was left
  // (via the videoConferenceLeft/readyToClose event) — no hangup needed here,
  // it already happened. Also force-removes the iframe node directly instead
  // of trusting api.dispose() alone: dispose() can fail silently (swallowed
  // by the try/catch) and leave the iframe — with its camera/mic still
  // live — sitting in the DOM, merely hidden by CSS (display:none does NOT
  // stop an iframe's active media). Clearing innerHTML is a hard browser
  // guarantee that any media inside is torn down immediately.
  const disposeApi = useCallback(() => {
    try { apiRef.current?.dispose() } catch {}
    if (jitsiRef.current) jitsiRef.current.innerHTML = ''
    apiRef.current = null
    if (activeCallOwner === ownerId) activeCallOwner = null
  }, [ownerId])

  // Fire-and-forget teardown for cases where we can't wait around for a
  // confirmation (component unmounting, or superseding a stale instance
  // before joining a fresh call) — best-effort hangup, then force the iframe
  // out of the DOM right away since there's no lifetime left to wait in.
  const forceEndCall = useCallback(() => {
    const api = apiRef.current
    if (api) {
      try { api.executeCommand('hangup') } catch {}
      try { api.dispose() } catch {}
    }
    if (jitsiRef.current) jitsiRef.current.innerHTML = ''
    apiRef.current = null
    if (activeCallOwner === ownerId) activeCallOwner = null
  }, [ownerId])

  useEffect(() => () => forceEndCall(), [forceEndCall])

  // Fires once Jitsi actually confirms the conference was left — either from
  // clicking our close button or from Jitsi's own in-call hangup control.
  // Both land on the same "call ended, rejoin?" card; this component never
  // asks its parent to unmount/hide it (see closePanel below for why).
  const handleLeft = useCallback(() => {
    disposeApi()
    setPhase('closed')
  }, [disposeApi])

  const joinCall = useCallback(async () => {
    // Guard against overlapping calls: the token fetch + Jitsi script load can
    // take a few seconds, and an impatient extra click while one is already
    // in flight used to race two API instances into the same container,
    // stacking video panels that never got disposed.
    if (phase === 'connecting' || phase === 'live') return
    // Another VideoCallPanel instance already owns the live call — refuse
    // rather than opening a second one.
    if (activeCallOwner && activeCallOwner !== ownerId) return
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

      forceEndCall()
      activeCallOwner = ownerId
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
      api.addEventListener('readyToClose', handleLeft)
      api.addEventListener('videoConferenceLeft', handleLeft)
    } catch (e: any) {
      setError(t('errNetwork')); setPhase('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, groupId, forceEndCall, handleLeft, ownerId])

  // Auto-join once on mount for contexts where the user already clicked an
  // explicit "join" action before this panel ever appeared (the my-course
  // overlay) — no point making them click twice.
  useEffect(() => {
    if (autoJoin) joinCall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Actually leave whatever call is active — not just hide it. Fires hangup
  // as a best-effort courtesy to the room, then immediately and
  // unconditionally force-removes the iframe via forceEndCall() (see its
  // comment: removing an iframe from the DOM is a hard browser guarantee
  // that kills any media inside it, independent of whether Jitsi's own
  // dispose()/event confirmation ever arrives). Does NOT ask the parent to
  // unmount this component — it stays mounted, showing the "closed,
  // rejoin?" card in place, so starting a new call is just clicking
  // "Rejoindre" on the same instance instead of round-tripping through a
  // parent unmount/remount cycle (the classroom page's own top-bar toggle
  // already covers "hide the video area entirely" — this button doesn't
  // need to duplicate that).
  function closePanel() {
    if (apiRef.current) {
      try { apiRef.current.executeCommand('hangup') } catch {}
    }
    forceEndCall()
    setPhase('closed')
  }

  return (
    <div className="relative w-full h-full min-h-[200px]">
      {/* The Jitsi iframe mounts here when live */}
      <div ref={jitsiRef} className={`absolute inset-0 ${phase === 'live' || phase === 'connecting' ? '' : 'hidden'}`} />

      {/* Always-available close affordance, in every phase — not just while
          live/connecting — so there's one obvious, permanent way to dismiss
          the panel regardless of state. */}
      <button
        onClick={closePanel}
        aria-label={t('leaveCall')}
        title={t('leaveCall')}
        className="absolute top-2 end-2 z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-black/50 hover:bg-black/70 active:bg-black/80 text-white"
      >
        <Icon name="x" size={18} />
      </button>

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
