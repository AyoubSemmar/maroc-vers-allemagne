'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase-browser'

const supabase = createClient()

type Row = {
  id: string
  article_id: number
  user_id: string
  parent_id: string | null
  body: string
  author_name: string | null
  like_count: number
  dislike_count: number
  created_at: string
}
type ReactMap = Record<string, 1 | -1>

function displayName(user: any): string {
  const m = user?.user_metadata || {}
  return m.full_name || m.name || (user?.email ? String(user.email).split('@')[0] : 'User')
}
function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30); if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(mo / 12)}y ago`
}
const score = (r: Row) => r.like_count - r.dislike_count

export default function ArticleComments({ articleId }: { articleId: number }) {
  const tt = useTranslations('comments')
  const t = (k: string, fb: string) => { try { const v = tt(k as any); return v && !v.includes(k) ? v : fb } catch { return fb } }
  const locale = useLocale() as AppLocale
  const dir = dirFor(locale)

  const [user, setUser] = useState<any>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [reactions, setReactions] = useState<ReactMap>({})
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    const { data } = await supabase
      .from('article_comments').select('*').eq('article_id', articleId)
    const list = (data || []) as Row[]
    setRows(list)
    if (user && list.length) {
      const { data: rs } = await supabase
        .from('comment_reactions').select('comment_id,type')
        .eq('user_id', user.id).in('comment_id', list.map(r => r.id))
      const map: ReactMap = {}
      ;(rs || []).forEach((r: any) => { map[r.comment_id] = r.type })
      setReactions(map)
    } else setReactions({})
    setLoading(false)
  }, [articleId])

  useEffect(() => { load() }, [load])

  async function post(text: string, parentId: string | null) {
    if (!user || !text.trim() || busy) return
    setBusy(true)
    const { error } = await supabase.from('article_comments').insert({
      article_id: articleId, user_id: user.id, parent_id: parentId,
      body: text.trim(), author_name: displayName(user),
    })
    setBusy(false)
    if (!error) { setBody(''); setReplyBody(''); setReplyTo(null); load() }
  }

  async function react(commentId: string, type: 1 | -1) {
    if (!user) return
    const current = reactions[commentId]
    // optimistic
    setReactions(prev => {
      const n = { ...prev }
      if (current === type) delete n[commentId]; else n[commentId] = type
      return n
    })
    setRows(prev => prev.map(r => {
      if (r.id !== commentId) return r
      let like = r.like_count, dis = r.dislike_count
      if (current === 1) like--; if (current === -1) dis--
      if (current !== type) { if (type === 1) like++; else dis++ }
      return { ...r, like_count: Math.max(0, like), dislike_count: Math.max(0, dis) }
    }))
    if (current === type) {
      await supabase.from('comment_reactions').delete().eq('comment_id', commentId).eq('user_id', user.id)
    } else {
      await supabase.from('comment_reactions').upsert({ comment_id: commentId, user_id: user.id, type }, { onConflict: 'comment_id,user_id' })
    }
  }

  async function remove(commentId: string) {
    if (!user || !confirm(t('deleteConfirm', 'Delete this comment?'))) return
    await supabase.from('article_comments').delete().eq('id', commentId).eq('user_id', user.id)
    load()
  }

  const topLevel = rows.filter(r => !r.parent_id).sort((a, b) => score(b) - score(a) || +new Date(b.created_at) - +new Date(a.created_at))
  const repliesOf = (id: string) => rows.filter(r => r.parent_id === id).sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))
  const total = rows.length

  function Comment({ r, isReply }: { r: Row; isReply?: boolean }) {
    const mine = user && r.user_id === user.id
    const my = reactions[r.id]
    return (
      <div className={`${isReply ? 'mt-3' : 'border border-gray-200 rounded-xl p-4 bg-white'}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-7 h-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-xs font-bold shrink-0">
            {(r.author_name || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-gray-900">{r.author_name || 'User'}</span>
          <span className="text-xs text-gray-400">· {timeAgo(r.created_at)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{r.body}</p>
        <div className="flex items-center gap-4 mt-2">
          <button onClick={() => react(r.id, 1)} disabled={!user}
            className={`flex items-center gap-1 text-xs ${my === 1 ? 'text-green-700 font-semibold' : 'text-gray-500'} hover:text-green-700 disabled:opacity-50`}>
            ▲ {r.like_count > 0 ? r.like_count : ''} <span className="sr-only">{t('like', 'Like')}</span>
          </button>
          <button onClick={() => react(r.id, -1)} disabled={!user}
            className={`flex items-center gap-1 text-xs ${my === -1 ? 'text-red-600 font-semibold' : 'text-gray-500'} hover:text-red-600 disabled:opacity-50`}>
            ▼ {r.dislike_count > 0 ? r.dislike_count : ''} <span className="sr-only">{t('dislike', 'Dislike')}</span>
          </button>
          {!isReply && user && (
            <button onClick={() => { setReplyTo(replyTo === r.id ? null : r.id); setReplyBody('') }}
              className="text-xs text-gray-500 hover:text-green-700">{t('reply', 'Reply')}</button>
          )}
          {mine && (
            <button onClick={() => remove(r.id)} className="text-xs text-gray-400 hover:text-red-600">{t('delete', 'Delete')}</button>
          )}
        </div>

        {replyTo === r.id && (
          <div className="mt-3">
            <textarea value={replyBody} onChange={e => setReplyBody(e.target.value)} rows={2}
              placeholder={t('replyPlaceholder', 'Write a reply…')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400" />
            <div className="flex gap-2 mt-1.5">
              <button onClick={() => post(replyBody, r.id)} disabled={busy || !replyBody.trim()}
                className="bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40">{t('post', 'Post')}</button>
              <button onClick={() => setReplyTo(null)} className="text-xs text-gray-500 px-2">{t('cancel', 'Cancel')}</button>
            </div>
          </div>
        )}

        {!isReply && repliesOf(r.id).length > 0 && (
          <div className="mt-3 ltr:pl-5 rtl:pr-5 ltr:border-l rtl:border-r border-gray-100">
            {repliesOf(r.id).map(rep => <Comment key={rep.id} r={rep} isReply />)}
          </div>
        )}
      </div>
    )
  }

  return (
    <section dir={dir} className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{t('title', 'Comments')}{total > 0 ? ` (${total})` : ''}</h2>
      <p className="text-xs text-gray-400 mb-5">{t('sortNote', 'Most liked comments appear first.')}</p>

      {user ? (
        <div className="mb-6">
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
            placeholder={t('placeholder', 'Share your thoughts or ask a question…')}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400" />
          <button onClick={() => post(body, null)} disabled={busy || !body.trim()}
            className="mt-2 bg-green-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-green-800 disabled:opacity-40">
            {t('post', 'Post comment')}
          </button>
        </div>
      ) : (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600">
          <Link href="/login" className="text-green-700 font-semibold hover:underline">{t('login', 'Log in')}</Link>{' '}
          {t('loginToComment', 'to join the discussion.')}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">…</p>
      ) : total === 0 ? (
        <p className="text-sm text-gray-400">{t('empty', 'No comments yet. Be the first to comment.')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {topLevel.map(r => <Comment key={r.id} r={r} />)}
        </div>
      )}
    </section>
  )
}
