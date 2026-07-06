'use client'

import { useEffect, useRef } from 'react'
import { type AdFormat, ADSTERRA_KEY, ADSTERRA_SIZE, ADSTERRA_NATIVE, ADSENSE_SLOT } from './config'
import AdsterraNative from './AdsterraNative'

// Two providers share one slot component so placements never change when the
// ad network does — only which units are configured (see ./config). Adsterra
// wins per format when its key is set; AdSense drives the slot otherwise.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-4265650830157827'

type Props = {
  /** AdSense ad-unit id. Falls back to the env var for this format. */
  slot?: string
  format?: AdFormat
  className?: string
}

/**
 * Adsterra banner sandboxed in its own iframe. Their invoke.js relies on a
 * global `atOptions` and writes an iframe at the script's location — both of
 * which fight React's SPA DOM (blank ads, cross-unit collisions). Isolating
 * each unit in a `srcDoc` iframe makes it reliable and safe to mount several.
 */
function AdsterraUnit({ adKey, w, h, className }: { adKey: string; w: number; h: number; className: string }) {
  const html =
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>' +
    `<script type="text/javascript">atOptions={'key':'${adKey}','format':'iframe','height':${h},'width':${w},'params':{}};</script>` +
    `<script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"></script>` +
    '</body></html>'
  return (
    <iframe
      title="Sponsored"
      srcDoc={html}
      width={w}
      height={h}
      scrolling="no"
      loading="lazy"
      className={className}
      style={{ border: 0, display: 'block', margin: '0 auto', maxWidth: '100%' }}
    />
  )
}

export default function AdSlot({ slot, format = 'in-article', className = '' }: Props) {
  const adsterraKey = ADSTERRA_KEY[format]
  const slotId = slot || ADSENSE_SLOT[format]
  // Adsterra wins when its key is set; AdSense only drives this slot otherwise.
  const adsenseConfigured = Boolean(CLIENT && slotId) && !adsterraKey
  const configured = Boolean(adsterraKey) || adsenseConfigured
  const pushed = useRef(false)

  useEffect(() => {
    if (!adsenseConfigured || pushed.current) return
    try {
      // The loader script (in the locale layout) defines window.adsbygoogle.
      ;((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({})
      pushed.current = true
    } catch {
      /* AdSense not loaded (blocked / offline) — fail silently. */
    }
  }, [adsenseConfigured])

  // In-content prefers the Native Banner — injected into the page DOM so it
  // inherits the article's fonts and reads as part of the content.
  if (format === 'in-article' && ADSTERRA_NATIVE.src) {
    return <AdsterraNative className={className} />
  }

  // Fixed Adsterra banner — the iframe self-loads its own invoke.js.
  if (adsterraKey) {
    const { w, h } = ADSTERRA_SIZE[format]
    return <AdsterraUnit adKey={adsterraKey} w={w} h={h} className={className} />
  }

  // Not configured yet (no publisher id or slot): show a labelled placeholder
  // while developing so the slot is visible, but render nothing in production
  // so the live site never shows empty ad boxes before approval.
  if (!configured) {
    if (process.env.NODE_ENV === 'production') return null
    return (
      <div
        aria-hidden
        className={`flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-[11px] uppercase tracking-wide text-gray-400 ${
          format === 'vertical' ? 'min-h-[600px] w-full' : 'min-h-[250px] w-full'
        } ${className}`}
      >
        Ad&nbsp;·&nbsp;{format === 'vertical' ? '300×600' : 'responsive'}
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={CLIENT}
      data-ad-slot={slotId}
      data-ad-format={format === 'vertical' ? 'vertical' : 'auto'}
      data-full-width-responsive="true"
    />
  )
}
