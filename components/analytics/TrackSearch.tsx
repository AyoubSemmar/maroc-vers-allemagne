'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

// Records a search term once per query (mounted on the search results page).
export default function TrackSearch({ term }: { term: string }) {
  const locale = useLocale()
  useEffect(() => {
    if (!term || term.trim().length < 2) return
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'search', term, locale }),
        keepalive: true,
      }).catch(() => {})
    } catch {}
  }, [term, locale])
  return null
}
