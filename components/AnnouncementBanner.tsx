'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const DISMISS_KEY = 'rihla_banner_dismissed_v1'
const ROTATE_MS = 5000

export default function AnnouncementBanner() {
  const t = useTranslations('landing.banner')
  // messages is an array of strings — use raw to get the array
  const raw = useTranslations('landing.banner')
  const messages = (raw.raw('messages') as string[]) ?? []

  const [visible, setVisible] = useState(false)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) !== '1') setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible || messages.length < 2) return
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % messages.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [visible, messages.length])

  if (!visible || messages.length === 0) return null

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {}
    setVisible(false)
  }

  return (
    <div className="announce-banner" role="region" aria-label="Announcements">
      <div className="announce-inner">
        <span className="announce-msg" key={idx}>
          {messages[idx]}
        </span>
        <div className="announce-dots" aria-hidden>
          {messages.map((_, i) => (
            <span
              key={i}
              className={`announce-dot ${i === idx ? 'on' : ''}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="announce-close"
          aria-label={t('dismiss')}
          title={t('dismiss')}
        >
          ×
        </button>
      </div>
    </div>
  )
}
