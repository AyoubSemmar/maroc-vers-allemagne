'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Meta (Facebook) Pixel. Loaded ONLY after the visitor accepts all cookies
// (localStorage 'cookie-consent' === 'all'), matching the site's Google
// Consent Mode posture — the pixel sets advertising cookies, so it must not
// fire before consent. The cookie banner dispatches 'gg-consent-updated' when
// the choice changes, so accepting later loads the pixel without a reload.
const PIXEL_ID = '3154079218316304'

function loadPixel() {
  const w = window as any
  if (w.fbq) return
  const n: any = (w.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  })
  if (!w._fbq) w._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  const t = document.createElement('script')
  t.async = true
  t.src = 'https://connect.facebook.net/en_US/fbevents.js'
  const s = document.getElementsByTagName('script')[0]
  s.parentNode?.insertBefore(t, s)
  w.fbq('init', PIXEL_ID)
  w.fbq('track', 'PageView')
}

function hasConsent(): boolean {
  try { return localStorage.getItem('cookie-consent') === 'all' } catch { return false }
}

export default function MetaPixel() {
  const pathname = usePathname()
  const loadedRef = useRef(false)

  // Load once consent is (or becomes) granted.
  useEffect(() => {
    function maybeLoad() {
      if (loadedRef.current) return
      if (hasConsent()) { loadedRef.current = true; loadPixel() }
    }
    maybeLoad()
    // The banner fires this on accept; the storage event covers other tabs.
    window.addEventListener('gg-consent-updated', maybeLoad)
    window.addEventListener('storage', maybeLoad)
    return () => {
      window.removeEventListener('gg-consent-updated', maybeLoad)
      window.removeEventListener('storage', maybeLoad)
    }
  }, [])

  // SPA route changes → a fresh PageView. loadPixel() already sent the first
  // one, so skip the initial render to avoid a double count.
  const firstNav = useRef(true)
  useEffect(() => {
    if (firstNav.current) { firstNav.current = false; return }
    const w = window as any
    if (loadedRef.current && typeof w.fbq === 'function') w.fbq('track', 'PageView')
  }, [pathname])

  return null
}
