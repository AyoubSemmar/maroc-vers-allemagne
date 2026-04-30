'use client'

/**
 * Live-refresh helper for /console-x7k9/ai-ops.
 *
 * The page is a server component with `dynamic = 'force-dynamic'`, so
 * each navigation re-queries Supabase. But the admin watching the
 * dashboard while running test requests still wants new numbers
 * without F5'ing — this hooks into `router.refresh()` to re-fetch the
 * server segment and re-render in place. Auto-poll every 30s plus a
 * manual button so the admin can pull immediately.
 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAiOpsRefresh() {
  const router = useRouter()
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  function manualRefresh() {
    setIsRefreshing(true)
    router.refresh()
    // router.refresh resolves silently; clear the spinner shortly after
    // so the admin sees feedback even on a fast network.
    setTimeout(() => {
      setLastRefreshed(new Date())
      setIsRefreshing(false)
    }, 800)
  }

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(() => {
      router.refresh()
      setLastRefreshed(new Date())
    }, 30_000)
    return () => clearInterval(id)
  }, [autoRefresh, router])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      fontSize: 13, color: 'var(--adm-ink-mute)',
    }}>
      <button
        type="button"
        onClick={manualRefresh}
        disabled={isRefreshing}
        className="adm-btn adm-btn--ghost"
        style={{ fontSize: 13, padding: '6px 14px' }}
      >
        {isRefreshing ? '⏳ Refreshing…' : '🔄 Refresh now'}
      </button>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
        />
        <span>Auto-refresh every 30s</span>
      </label>
      <span>
        Last update:{' '}
        <strong>{lastRefreshed.toLocaleTimeString('en-GB', { hour12: false })}</strong>
      </span>
    </div>
  )
}
