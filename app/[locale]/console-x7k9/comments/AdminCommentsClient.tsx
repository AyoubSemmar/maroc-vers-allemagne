'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export type AdminComment = {
  id: string
  articleId: number
  articleTitle: string
  body: string
  author: string
  isReply: boolean
  score: number
  createdAt: string
}

export default function AdminCommentsClient({ comments, locale }: { comments: AdminComment[]; locale: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)

  async function remove(id: string) {
    if (!confirm('Delete this comment and its replies?')) return
    setBusy(id)
    try {
      const res = await fetch('/api/admin/comments/remove', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }))
        alert(error || 'Failed to delete')
      } else {
        router.refresh()
      }
    } finally {
      setBusy(null)
    }
  }

  if (comments.length === 0) {
    return <p style={{ color: 'var(--adm-ink-mute)', fontSize: 13 }}>No comments yet.</p>
  }

  return (
    <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
        <tbody>
          {comments.map((c) => (
            <tr key={c.id} style={{ borderTop: '1px solid #eef0f4' }}>
              <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 2 }}>
                  <strong>{c.author}</strong>
                  {c.isReply && <span className="adm-pill" style={{ fontSize: 10 }}>reply</span>}
                  <span style={{ color: '#9aa0b0', fontSize: 11 }}>· {c.createdAt} · score {c.score}</span>
                </div>
                <div style={{ color: 'var(--adm-ink-soft)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{c.body}</div>
                <a href={`/${locale}/articles/${c.articleId}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#F08A2E' }}>
                  on “{c.articleTitle}” →
                </a>
              </td>
              <td style={{ padding: '10px 12px', width: 90, textAlign: 'right', verticalAlign: 'top' }}>
                <button
                  onClick={() => remove(c.id)}
                  disabled={busy === c.id}
                  style={{
                    fontSize: 12, color: '#d9534f', background: 'none',
                    border: '1px solid #f0c2c2', borderRadius: 6, padding: '3px 8px',
                    cursor: 'pointer', opacity: busy === c.id ? 0.5 : 1,
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
