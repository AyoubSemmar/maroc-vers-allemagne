'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Icon from '@/components/ui/Icon'

// Client-side brain of the installable "Learn German" app:
//  - registers the service worker (production only — a SW in dev fights HMR)
//  - detects standalone (installed) mode and stamps <html class="pwa-standalone">
//    so global chrome can step aside and the app bottom-nav can appear
//  - shows a lightweight, dismissible install prompt: the native
//    beforeinstallprompt flow on Android/desktop Chrome, and manual
//    "Add to Home Screen" instructions on iOS Safari (which has no prompt API)
// Mounted once from the learn-german layout, so it only runs on the course.

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

const DISMISS_KEY = 'pwa-install-dismissed-v1'

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  )
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const webkit = /WebKit/.test(ua)
  const notChrome = !/CriOS|FxiOS|EdgiOS/.test(ua)
  return iOS && webkit && notChrome
}

export default function PwaController() {
  const t = useTranslations('pwa')
  const [deferred, setDeferred] = useState<BIPEvent | null>(null)
  const [standalone, setStandalone] = useState(false)
  const [showIos, setShowIos] = useState(false)
  const [dismissed, setDismissed] = useState(true) // assume dismissed until we check storage

  // Register the service worker (prod only).
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    const onLoad = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // Standalone detection + keep <html> in sync for CSS/chrome.
  useEffect(() => {
    const apply = () => {
      const s = detectStandalone()
      setStandalone(s)
      document.documentElement.classList.toggle('pwa-standalone', s)
    }
    apply()
    const mq = window.matchMedia('(display-mode: standalone)')
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // Install prompt wiring.
  useEffect(() => {
    try { setDismissed(localStorage.getItem(DISMISS_KEY) === '1') } catch { /* ignore */ }
    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIPEvent)
    }
    const onInstalled = () => {
      setDeferred(null)
      setShowIos(false)
      try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
    }
    window.addEventListener('beforeinstallprompt', onBIP)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    setDeferred(null)
    setShowIos(false)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch { /* ignore */ }
  }, [])

  const install = useCallback(async () => {
    if (deferred) {
      await deferred.prompt()
      await deferred.userChoice.catch(() => {})
      setDeferred(null)
    } else if (isIosSafari()) {
      setShowIos(true)
    }
  }, [deferred])

  // Nothing to show if already installed, or previously dismissed and no live prompt.
  if (standalone) return null
  const canPromptNative = !!deferred
  const canPromptIos = isIosSafari() && !showIos
  if (dismissed && !canPromptNative) return null
  if (!canPromptNative && !canPromptIos && !showIos) return null

  return (
    <div
      role="dialog"
      aria-label={t('installTitle')}
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      style={{ pointerEvents: 'none' }}
    >
      <div
        className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-neutral-900"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#FF8B6B] to-[#E85F2C] text-lg font-black text-white">
          G
        </div>

        {showIos ? (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">{t('iosTitle')}</p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{t('iosBody')}</p>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">{t('installTitle')}</p>
            <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">{t('installBody')}</p>
          </div>
        )}

        {showIos ? (
          <button
            onClick={dismiss}
            className="shrink-0 rounded-full bg-[#E85F2C] px-4 py-2 text-sm font-semibold text-white active:translate-y-px"
          >
            {t('iosGotIt')}
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={dismiss}
              aria-label={t('later')}
              className="rounded-full p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <Icon name="x" size={18} />
            </button>
            <button
              onClick={install}
              className="rounded-full bg-[#E85F2C] px-4 py-2 text-sm font-semibold text-white active:translate-y-px"
            >
              {t('install')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
