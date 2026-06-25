'use client'

/**
 * Admin AI article generator — title-driven, dedup-checked flow:
 *   1. Admin enters a title + audience (locale policy) + category.
 *   2. "Check for similar" surfaces existing articles that look related;
 *      the admin decides whether to proceed.
 *   3. "Generate" writes the Arabic source (5 FAQs), translates into the
 *      audience's policy locales, and makes a hero image — all as a draft.
 *   4. Admin reviews each locale tab, then Approves (saves with _meta) or
 *      Rejects.
 */
import { useState } from 'react'
import { AUDIENCES, localesFor, LANG_LABEL } from '@/lib/article-audience'

type Faq = { q: string; a: string }
type Translation = { title: string; summary: string; content: string; faqs: Faq[] }
type Match = { id: number; title: string; category: string; score: number }
type Draft = {
  category: string
  audience: string
  locales: string[]
  date: string
  title: string
  summary: string
  content: string
  faqs: Faq[]
  translations: Record<string, Translation>
  image_url: string
  image_prompt_used: string
}

const CATEGORIES = ['البنوك', 'شرائح الاتصال', 'السكن', 'الجامعات', 'العمل', 'Ausbildung', 'التأشيرة والأوراق']

async function safeParse(resp: Response) {
  const raw = await resp.text()
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

export default function AdminAiArticleGenerator() {
  const [title, setTitle] = useState('')
  const [audience, setAudience] = useState<string>('global')
  const [category, setCategory] = useState<string>(CATEGORIES[0])

  const [checking, setChecking] = useState(false)
  const [matches, setMatches] = useState<Match[] | null>(null)

  const [stage, setStage] = useState<'' | 'text' | 'translate' | 'image'>('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const [activeLang, setActiveLang] = useState<string>('ar')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<{ id: string; directUrl?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [warn, setWarn] = useState<string | null>(null)

  const loading = stage !== ''

  async function checkSimilar() {
    if (title.trim().length < 4) { setError('Enter a title first.'); return }
    setChecking(true); setError(null); setMatches(null)
    try {
      const r = await fetch('/api/admin/articles/similar', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      const d = await safeParse(r)
      if (!r.ok) { setError(d?.error || `Check failed (${r.status})`); return }
      setMatches(d?.matches ?? [])
    } catch (e: any) { setError(e?.message || 'Network error') }
    finally { setChecking(false) }
  }

  async function generate() {
    setStage('text'); setError(null); setWarn(null); setDraft(null); setSaved(null)
    try {
      const r = await fetch('/api/admin/generate-article', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, audience, category }),
      })
      const d = await safeParse(r)
      if (!r.ok || !d?.draft) { setError(d?.error || `Generation failed (${r.status})`); setStage(''); return }
      const base: Draft = { ...d.draft, translations: {} }
      setDraft(base); setActiveLang('ar')

      // Translate into the policy locales (minus ar) + image, in parallel.
      setStage('translate')
      const targets = localesFor(audience).filter((l) => l !== 'ar')
      const tP = (async () => {
        const tr = await fetch('/api/admin/translate-article', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: base.title, summary: base.summary, content: base.content, faqs: base.faqs, locales: targets }),
        })
        const td = await safeParse(tr)
        if (tr.ok && td?.translations) {
          setDraft((x) => x ? { ...x, translations: td.translations } : x)
          if (td.failed?.length) setWarn(`Some translations failed: ${td.failed.join(', ')}. You can still publish.`)
        } else setWarn(td?.error || 'Translation failed — you can still publish the Arabic version.')
      })()
      const iP = (async () => {
        const ir = await fetch('/api/admin/generate-article-image', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: base.image_prompt_used }),
        })
        const id = await safeParse(ir)
        if (ir.ok && id?.image_url) setDraft((x) => x ? { ...x, image_url: id.image_url } : x)
      })()
      await tP; setStage('image'); await iP
    } catch (e: any) { setError(e?.message || 'Network error') }
    finally { setStage('') }
  }

  async function approve() {
    if (!draft) return
    setSaving(true); setError(null)
    try {
      const r = await fetch('/api/admin/save-article', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft }),
      })
      const d = await safeParse(r)
      if (!r.ok) { setError(d?.error || `Save failed (${r.status})`); return }
      setSaved({ id: d.id, directUrl: d.direct_url_ar }); setDraft(null); setMatches(null); setTitle('')
    } catch (e: any) { setError(e?.message || 'Network error') }
    finally { setSaving(false) }
  }

  function reset() { setDraft(null); setMatches(null); setError(null); setWarn(null) }

  const tabs = draft ? ['ar', ...draft.locales.filter((l) => l !== 'ar')] : []
  const view: Translation | null = !draft ? null
    : activeLang === 'ar'
      ? { title: draft.title, summary: draft.summary, content: draft.content, faqs: draft.faqs }
      : draft.translations[activeLang] ?? null
  const pending = activeLang !== 'ar' && (!view || !view.title)

  return (
    <section className="adm-card" style={{ marginBottom: 18, borderColor: '#fcd34d', background: '#fffbeb' }}>
      <div className="adm-card-head">
        <h3 className="adm-card-title">🤖 AI article generator</h3>
        <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>Title-driven · dedup-checked · locale policy · review before publish</span>
      </div>

      {error && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#7f1d1d', borderRadius: 10, padding: 12, fontSize: 13, marginBottom: 12 }}><strong>⚠ {error}</strong></div>}
      {warn && <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#78350f', borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 12 }}>🌐 {warn}</div>}

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#14532d', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 }}>
          <strong>✓ Article published.</strong> ID <code>{saved.id}</code>.
          {saved.directUrl && <> · <a href={saved.directUrl} target="_blank" rel="noreferrer" style={{ color: '#15803d', textDecoration: 'underline' }}>Open</a></>}
        </div>
      )}

      {/* ── Input + similarity check (hidden while a draft is in review) ── */}
      {!draft && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setMatches(null) }}
            placeholder="Article title (e.g. “Blocked account (Sperrkonto): how it works in 2026”)"
            className="adm-input"
            style={{ fontSize: 14 }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="adm-select" style={{ flex: 1, minWidth: 220 }}>
              {AUDIENCES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="adm-select" style={{ minWidth: 160 }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {!matches && (
            <button type="button" className="adm-btn" onClick={checkSimilar} disabled={checking || loading}>
              {checking ? 'Checking for similar articles…' : '🔍 Check for similar articles'}
            </button>
          )}

          {matches && (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12, background: 'white' }}>
              {matches.length === 0 ? (
                <p style={{ margin: 0, fontSize: 14, color: '#15803d' }}>✓ No similar articles found — safe to generate.</p>
              ) : (
                <>
                  <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#92400e' }}>
                    ⚠ {matches.length} possibly-related article{matches.length > 1 ? 's' : ''} already exist:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {matches.map((m) => (
                      <a key={m.id} href={`/ar/articles/${m.id}`} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13, color: '#1f2937', textDecoration: 'none', padding: '4px 0', borderTop: '1px solid #f3f4f6' }}>
                        <span>{m.title}</span>
                        <span style={{ color: '#9ca3af', whiteSpace: 'nowrap' }}>{Math.round(m.score * 100)}% · {m.category} ↗</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button type="button" className="adm-btn" onClick={generate} disabled={loading}
                  style={{ background: matches.length === 0 ? '#16a34a' : '#0f172a' }}>
                  {loading
                    ? (stage === 'image' ? 'Making image…' : stage === 'translate' ? 'Translating…' : 'Writing article…')
                    : matches.length === 0 ? '✨ Generate this article' : '✨ Generate anyway'}
                </button>
                <button type="button" className="adm-btn adm-btn--ghost" onClick={() => setMatches(null)} disabled={loading}>← Edit title</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Review pane ── */}
      {draft && view && (
        <>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', margin: '6px 0 12px' }}>
            {draft.image_url
              ? <img src={draft.image_url} alt="" style={{ width: 220, height: 124, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              : <div style={{ width: 220, height: 124, borderRadius: 8, border: '1px dashed #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78350f', fontSize: 13, background: '#fffbeb' }}>{stage === 'image' ? '🖼 Generating image…' : 'no image'}</div>}
            <div style={{ flex: 1, minWidth: 220, fontSize: 13 }}>
              <div style={{ color: 'var(--adm-ink-mute)' }}>Audience</div>
              <div style={{ fontWeight: 600 }}>{AUDIENCES.find((a) => a.id === draft.audience)?.label || draft.audience}</div>
              <div style={{ color: 'var(--adm-ink-mute)', marginTop: 6 }}>Category · {draft.category} · {draft.date}</div>
              <div style={{ color: 'var(--adm-ink-mute)', marginTop: 6 }}>Locales</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12 }}>{draft.locales.join(', ')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {tabs.map((l) => {
              const ready = l === 'ar' || !!draft.translations[l]
              return (
                <button key={l} type="button" onClick={() => setActiveLang(l)}
                  style={{ padding: '5px 10px', fontSize: 12, borderRadius: 8, cursor: 'pointer',
                    border: '1px solid ' + (activeLang === l ? '#0f172a' : '#e5e7eb'),
                    background: activeLang === l ? '#0f172a' : 'white',
                    color: activeLang === l ? 'white' : ready ? '#0f172a' : '#9ca3af',
                    fontWeight: activeLang === l ? 600 : 400 }}>
                  {LANG_LABEL[l] || l}{!ready && ' …'}
                </button>
              )
            })}
          </div>

          <div dir={activeLang === 'ar' || activeLang === 'fa' || activeLang === 'ur' ? 'rtl' : 'ltr'}
            style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, maxHeight: 460, overflowY: 'auto' }}>
            {pending ? (
              <div style={{ padding: 24, color: '#78350f', textAlign: 'center', fontSize: 14 }}>🌐 {stage === 'translate' ? 'Translating…' : 'Not translated.'}</div>
            ) : (
              <>
                <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{view.title}</h4>
                <p style={{ margin: '6px 0 12px', fontSize: 14, color: '#475569', fontStyle: 'italic' }}>{view.summary}</p>
                <div style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap', color: '#1f2937' }}>{view.content}</div>
                {Array.isArray(view.faqs) && view.faqs.length > 0 && (
                  <>
                    <h5 style={{ marginTop: 18, marginBottom: 8, fontSize: 15, fontWeight: 700 }}>FAQ ({view.faqs.length})</h5>
                    {view.faqs.map((f, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Q: {f.q}</div>
                        <div style={{ fontSize: 14, color: '#374151' }}>A: {f.a}</div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button type="button" className="adm-btn" onClick={approve} disabled={saving || loading} style={{ background: '#16a34a' }}>
              {saving ? 'Publishing…' : '✓ Approve & publish'}
            </button>
            <button type="button" className="adm-btn" onClick={reset} disabled={saving} style={{ background: '#dc2626' }}>✕ Reject</button>
          </div>
        </>
      )}
    </section>
  )
}
