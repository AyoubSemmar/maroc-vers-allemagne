'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

// Responsive page size: 10 on phones (≤640px), 20 on desktop. Components
// pass this through to slice() the visible rows. We start at 20 (desktop)
// to match the SSR HTML and switch to 10 after mount on small screens —
// avoids a hydration flash on desktop while still gating mobile.
export function usePageSize(desktop = 20, mobile = 10): number {
  const [size, setSize] = useState(desktop)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const apply = () => setSize(mq.matches ? mobile : desktop)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [desktop, mobile])
  return size
}

// Build the visible page-number list with ellipses around the current page.
// e.g. 1 … 4 5 6 … 12   (always shows first + last + ±1 around current)
function pageList(current: number, total: number): Array<number | '…'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set<number>([1, total, current, current - 1, current + 1])
  const sorted = [...set].filter(n => n >= 1 && n <= total).sort((a, b) => a - b)
  const out: Array<number | '…'> = []
  for (let i = 0; i < sorted.length; i++) {
    out.push(sorted[i])
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) out.push('…')
  }
  return out
}

export default function Pager({
  page,
  total,
  onChange,
  scrollToId,
}: {
  page: number
  total: number
  onChange: (next: number) => void
  // If set, scroll the matching element into view on page change — useful
  // so phones don't get stuck mid-list after tapping next.
  scrollToId?: string
}) {
  const t = useTranslations('common.pager')
  if (total <= 1) return null

  const go = (n: number) => {
    const next = Math.max(1, Math.min(total, n))
    if (next === page) return
    onChange(next)
    if (scrollToId && typeof window !== 'undefined') {
      const el = document.getElementById(scrollToId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="pager" aria-label={t('label')}>
      <button
        type="button"
        className="pager-btn"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label={t('prev')}
      >
        ‹ {t('prev')}
      </button>
      <ul className="pager-pages" role="list">
        {pageList(page, total).map((p, i) =>
          p === '…' ? (
            <li key={`e${i}`} className="pager-ellipsis" aria-hidden>…</li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={`pager-num${p === page ? ' is-current' : ''}`}
                onClick={() => go(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={t('page', { n: p })}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        className="pager-btn"
        onClick={() => go(page + 1)}
        disabled={page >= total}
        aria-label={t('next')}
      >
        {t('next')} ›
      </button>
    </nav>
  )
}
