'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ADSTERRA_NATIVE } from './config'

/**
 * Adsterra Native Banner. Injected straight into the page DOM (not sandboxed in
 * an iframe) so the "Inherit" fonts/colours actually pick up the site's styles
 * and the ad reads as part of the article.
 *
 * Its invoke.js only fills `container-<key>` elements present when it runs, so
 * on client-side navigation we rebuild the container + re-append the loader on
 * every path change — otherwise the slot renders once and then goes blank.
 */
export default function AdsterraNative({ className = '' }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = holder.current
    if (!el) return
    el.innerHTML = `<div id="${ADSTERRA_NATIVE.containerId}"></div>`
    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = ADSTERRA_NATIVE.src
    el.appendChild(script)
    return () => { el.innerHTML = '' }
  }, [pathname])

  return <div ref={holder} className={className} />
}
