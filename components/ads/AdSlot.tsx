'use client'

import { useEffect, useRef } from 'react'

// Publisher + per-placement slot IDs come from public env vars so ads can be
// switched on with zero code changes once AdSense approves the site:
//   NEXT_PUBLIC_ADSENSE_CLIENT          = ca-pub-XXXXXXXXXXXXXXXX
//   NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR    = <ad unit id for the desktop rail>
//   NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE  = <ad unit id for the in-content unit>
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
const SLOT_BY_FORMAT: Record<AdFormat, string | undefined> = {
  vertical: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  'in-article': process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE,
}

type AdFormat = 'vertical' | 'in-article'

type Props = {
  /** AdSense ad-unit id. Falls back to the env var for this format. */
  slot?: string
  format?: AdFormat
  className?: string
}

export default function AdSlot({ slot, format = 'in-article', className = '' }: Props) {
  const slotId = slot || SLOT_BY_FORMAT[format]
  const configured = Boolean(CLIENT && slotId)
  const pushed = useRef(false)

  useEffect(() => {
    if (!configured || pushed.current) return
    try {
      // The loader script (in the locale layout) defines window.adsbygoogle.
      ;((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({})
      pushed.current = true
    } catch {
      /* AdSense not loaded (blocked / offline) — fail silently. */
    }
  }, [configured])

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
