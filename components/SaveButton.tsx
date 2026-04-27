'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { createBrowserClient } from '@supabase/ssr'

type Props = {
  itemType: 'university' | 'ausbildung_job'
  itemId: string
  /** Optional className passthrough so callers can position the button. */
  className?: string
  /** Visual size. */
  size?: 'normal' | 'compact'
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SaveButton({ itemType, itemId, className = '', size = 'normal' }: Props) {
  const t = useTranslations('saves')
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [saved, setSaved] = useState<boolean>(false)
  const [busy, setBusy] = useState(false)

  // On mount: check auth + current saved state.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) { setAuthed(false); return }
      setAuthed(true)
      const { data } = await supabase
        .from('user_saves')
        .select('user_id', { head: true, count: 'exact' })
        .eq('item_type', itemType)
        .eq('item_id', itemId)
      // We don't actually use data; rely on no-error to confirm row exists.
      // Simpler: query for the row directly:
      const { data: row } = await supabase
        .from('user_saves')
        .select('user_id')
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId)
        .maybeSingle()
      if (!cancelled) setSaved(!!row)
    })()
    return () => { cancelled = true }
  }, [itemType, itemId])

  async function toggle() {
    if (busy) return
    if (authed === false) {
      // Not logged in — bounce to login with a return path.
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setBusy(true)
    const next = !saved
    setSaved(next) // optimistic
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('not authed')
      if (next) {
        const { error } = await supabase
          .from('user_saves')
          .insert({ user_id: user.id, item_type: itemType, item_id: itemId })
        if (error && error.code !== '23505') throw error // 23505 = already exists, treat as ok
      } else {
        const { error } = await supabase
          .from('user_saves')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_id', itemId)
        if (error) throw error
      }
    } catch {
      setSaved(!next) // rollback
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={authed === null}
      className={`save-btn ${size === 'compact' ? 'save-btn--compact' : ''} ${saved ? 'is-saved' : ''} ${className}`}
      aria-pressed={saved}
      aria-label={saved ? t('unsave') : t('save')}
      title={saved ? t('unsave') : t('save')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span className="save-btn-text">{saved ? t('saved') : t('save')}</span>
    </button>
  )
}
