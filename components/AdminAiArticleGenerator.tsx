'use client'

/**
 * Admin AI article generator — full review-then-publish flow.
 *
 * Click "Generate" → Claude writes a 4-language article + Replicate
 * makes a hero image, all returned as a draft (NOT saved). The admin
 * can switch between AR/FR/EN/DE tabs to proofread each translation,
 * then "Approve & publish" (writes to DB) or "Reject" (discards).
 *
 * This is the only entry point for non-manual articles, so we surface
 * any error inline rather than throwing — the admin always gets a clear
 * message they can act on.
 */

import { useState } from 'react'

type Lang = 'ar' | 'fr' | 'en' | 'de'
type Faq = { q: string; a: string }
type Translation = { title: string; summary: string; content: string; faqs: Faq[] }

type Draft = {
  category: string
  date: string
  title: string
  summary: string
  content: string
  faqs: Faq[]
  translations: Record<'fr' | 'en' | 'de', Translation>
  image_url: string
  image_prompt_used: string
}

const LANG_LABEL: Record<Lang, string> = {
  ar: '🌍 العربية',
  fr: '🇫🇷 Français',
  en: '🇬🇧 English',
  de: '🇩🇪 Deutsch',
}

export default function AdminAiArticleGenerator() {
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState<'' | 'text' | 'translate' | 'image'>('')
  const [translateWarning, setTranslateWarning] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [titleClash, setTitleClash] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageWarning, setImageWarning] = useState<string | null>(null)
  const [activeLang, setActiveLang] = useState<Lang>('ar')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<{ id: string; directUrl?: string } | null>(null)

  // Helper: parse the response defensively. On platform-level timeouts
  // Vercel returns an HTML error page — JSON.parse on that gives the
  // useless "Unexpected token 'A'…" we used to surface to the admin.
  async function safeParse(resp: Response) {
    const raw = await resp.text()
    let data: any = null
    try { data = raw ? JSON.parse(raw) : null } catch { /* HTML page */ }
    return data
  }

  async function generate() {
    setLoading(true)
    setLoadingStage('text')
    setError(null)
    setDraft(null)
    setSaved(null)
    setTitleClash(false)
    setImageWarning(null)
    setTranslateWarning(null)
    try {
      // ── Step 1: Arabic article ──────────────────────────────────
      const resp = await fetch('/api/admin/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await safeParse(resp)
      if (!resp.ok || !data) {
        const msg =
          data?.error ||
          (resp.status === 504
            ? 'The text generator timed out. Try again — the second run is usually faster.'
            : `Generation failed (HTTP ${resp.status}). The server returned a non-JSON response.`)
        setError(msg)
        return
      }
      const initialDraft: Draft = data.draft
      setDraft(initialDraft)
      setTitleClash(!!data.titleClash)
      setActiveLang('ar')

      // Kick off translations and image in parallel — they don't depend
      // on each other and overlapping them halves the wall-clock wait.
      setLoadingStage('translate')
      const tPromise = (async () => {
        try {
          const tr = await fetch('/api/admin/translate-article', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: initialDraft.title,
              summary: initialDraft.summary,
              content: initialDraft.content,
              faqs: initialDraft.faqs,
            }),
          })
          const tdata = await safeParse(tr)
          if (tr.ok && tdata?.translations) {
            setDraft(d => d ? { ...d, translations: tdata.translations } : d)
          } else {
            setTranslateWarning(tdata?.error || `Translation failed (HTTP ${tr.status}). You can still publish the Arabic version.`)
          }
        } catch (e: any) {
          setTranslateWarning(`Translation step failed: ${e?.message || 'network error'}`)
        }
      })()

      const iPromise = (async () => {
        try {
          const ir = await fetch('/api/admin/generate-article-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: initialDraft.image_prompt_used }),
          })
          const idata = await safeParse(ir)
          if (ir.ok && idata?.image_url) {
            setDraft(d => d ? { ...d, image_url: idata.image_url, image_prompt_used: idata.prompt_used || d.image_prompt_used } : d)
          } else {
            setImageWarning(idata?.error || `Image generation failed (HTTP ${ir.status}). You can approve without it or regenerate.`)
          }
        } catch (e: any) {
          setImageWarning(`Image step failed: ${e?.message || 'network error'}`)
        }
      })()

      // Wait for translations first so the loading label transitions
      // sensibly (translate → image), even though both are running.
      await tPromise
      setLoadingStage('image')
      await iPromise
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  async function approve() {
    if (!draft) return
    setSaving(true)
    setError(null)
    try {
      const resp = await fetch('/api/admin/save-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        setError(data?.error || `Save failed (${resp.status})`)
        return
      }
      setSaved({ id: data.id, directUrl: data.direct_url_ar })
      setDraft(null)
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setSaving(false)
    }
  }

  function reject() {
    setDraft(null)
    setError(null)
    setTitleClash(false)
  }

  // Pull the right language slice for the preview pane.
  const view: Translation | null = (() => {
    if (!draft) return null
    if (activeLang === 'ar') {
      return { title: draft.title, summary: draft.summary, content: draft.content, faqs: draft.faqs }
    }
    return draft.translations[activeLang]
  })()
  // Translations load after the AR article. While the call is in flight,
  // each non-AR view will have empty title/content — surface that as a
  // placeholder so the admin doesn't think the tab is broken.
  const translationPending =
    activeLang !== 'ar' && (!view || !view.title || !view.content)

  const isRtl = activeLang === 'ar'

  return (
    <section className="adm-card" style={{ marginBottom: 18, borderColor: '#fcd34d', background: '#fffbeb' }}>
      <div className="adm-card-head">
        <h3 className="adm-card-title">🤖 AI article generator</h3>
        <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>
          Random category · 4 languages · auto-image · review before publish
        </span>
      </div>

      {!draft && !saved && (
        <div style={{ padding: '8px 0' }}>
          <button
            type="button"
            className="adm-btn"
            onClick={generate}
            disabled={loading}
          >
            {loading
              ? loadingStage === 'image'
                ? 'Almost done — making image…'
                : loadingStage === 'translate'
                  ? 'Article ready — translating to FR/EN/DE…'
                  : 'Writing article in Arabic…'
              : '✨ Generate a new article draft'}
          </button>
          <p style={{ fontSize: 12, color: 'var(--adm-ink-mute)', marginTop: 8 }}>
            Picks a random category from your existing list, avoids titles that already exist,
            and writes the article + FAQs in Arabic / French / English / German with a matching hero image.
          </p>
        </div>
      )}

      {saved && (
        <div style={{
          background: '#dcfce7', border: '1px solid #86efac', color: '#14532d',
          borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12,
        }}>
          <strong>✓ Article published.</strong> Saved with ID <code>{saved.id}</code>.
          {saved.directUrl && (
            <div style={{ marginTop: 6, fontSize: 13 }}>
              👉 <a href={saved.directUrl} target="_blank" rel="noreferrer" style={{ color: '#15803d', textDecoration: 'underline' }}>
                Open the article directly
              </a>
              {' '}or it should appear at the top of the list (you may need to hard-refresh /articles).
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <button type="button" className="adm-btn" onClick={generate} disabled={loading}>
              {loading ? 'Generating…' : '✨ Generate another'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', color: '#7f1d1d',
          borderRadius: 10, padding: 12, fontSize: 13, marginBottom: 12,
          fontFamily: 'monospace',
        }}>
          <strong>⚠ {error}</strong>
        </div>
      )}

      {translateWarning && (
        <div style={{
          background: '#fef3c7', border: '1px solid #fde68a', color: '#78350f',
          borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span>🌐 {translateWarning}</span>
          <button
            type="button"
            onClick={async () => {
              if (!draft) return
              setTranslateWarning(null)
              setLoadingStage('translate')
              setLoading(true)
              try {
                const tr = await fetch('/api/admin/translate-article', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: draft.title,
                    summary: draft.summary,
                    content: draft.content,
                    faqs: draft.faqs,
                  }),
                })
                const tdata = await safeParse(tr)
                if (tr.ok && tdata?.translations) {
                  setDraft(d => d ? { ...d, translations: tdata.translations } : d)
                } else {
                  setTranslateWarning(tdata?.error || `Translation failed (HTTP ${tr.status}).`)
                }
              } finally {
                setLoading(false)
                setLoadingStage('')
              }
            }}
            disabled={loading}
            style={{
              fontSize: 12, padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid #b45309', background: '#fbbf24', color: '#451a03', fontWeight: 600,
            }}
          >
            🔄 Retry translations
          </button>
        </div>
      )}

      {imageWarning && (
        <div style={{
          background: '#fef3c7', border: '1px solid #fde68a', color: '#78350f',
          borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <span>🖼 {imageWarning}</span>
          <button
            type="button"
            onClick={async () => {
              if (!draft) return
              setImageWarning(null)
              setLoadingStage('image')
              setLoading(true)
              try {
                const ir = await fetch('/api/admin/generate-article-image', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: draft.image_prompt_used }),
                })
                const idata = await safeParse(ir)
                if (ir.ok && idata?.image_url) {
                  setDraft(d => d ? { ...d, image_url: idata.image_url } : d)
                } else {
                  setImageWarning(idata?.error || `Image generation failed (HTTP ${ir.status}).`)
                }
              } finally {
                setLoading(false)
                setLoadingStage('')
              }
            }}
            disabled={loading}
            style={{
              fontSize: 12, padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              border: '1px solid #b45309', background: '#fbbf24', color: '#451a03', fontWeight: 600,
            }}
          >
            🔄 Retry image
          </button>
        </div>
      )}

      {draft && view && (
        <>
          {titleClash && (
            <div style={{
              background: '#fef3c7', border: '1px solid #fde68a', color: '#78350f',
              borderRadius: 10, padding: 10, fontSize: 13, marginBottom: 12,
            }}>
              ⚠ This title already exists in the database. Consider rejecting and regenerating.
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 12 }}>
            {draft.image_url ? (
              <img
                src={draft.image_url}
                alt=""
                style={{ width: 220, height: 124, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
            ) : loadingStage === 'image' ? (
              <div style={{
                width: 220, height: 124, borderRadius: 8, border: '1px dashed #fde68a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#78350f', fontSize: 13, background: '#fffbeb',
              }}>
                🖼 Generating image…
              </div>
            ) : (
              <div style={{
                width: 220, height: 124, borderRadius: 8, border: '1px dashed #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af', fontSize: 13,
              }}>
                no image yet
              </div>
            )}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>Category (editable before publishing)</div>
              <select
                value={draft.category}
                onChange={(e) => setDraft(d => d ? { ...d, category: e.target.value } : d)}
                style={{
                  fontSize: 14, fontWeight: 600, padding: '6px 10px', borderRadius: 8,
                  border: '1px solid #d4d4d8', background: 'white', minWidth: 220,
                }}
              >
                {/* Pull from the canonical 7 + always include the current
                    value (in case the API returned something off-list) so
                    the admin sees what was generated and can correct it. */}
                {Array.from(new Set([
                  draft.category,
                  'البنوك', 'شرائح الاتصال', 'السكن',
                  'الجامعات', 'العمل', 'Ausbildung', 'التأشيرة والأوراق',
                ])).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div style={{ fontSize: 12, color: 'var(--adm-ink-mute)', marginTop: 8 }}>Date</div>
              <div style={{ fontSize: 14 }}>{draft.date}</div>
              <div style={{ fontSize: 12, color: 'var(--adm-ink-mute)', marginTop: 6 }}>Image prompt</div>
              <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#374151' }}>{draft.image_prompt_used}</div>
            </div>
          </div>

          {/* Language tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {(['ar', 'fr', 'en', 'de'] as Lang[]).map(l => (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLang(l)}
                style={{
                  padding: '6px 12px', fontSize: 13, borderRadius: 8, cursor: 'pointer',
                  border: '1px solid ' + (activeLang === l ? '#0f172a' : '#e5e7eb'),
                  background: activeLang === l ? '#0f172a' : 'white',
                  color: activeLang === l ? 'white' : '#0f172a',
                  fontWeight: activeLang === l ? 600 : 400,
                }}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>

          <div dir={isRtl ? 'rtl' : 'ltr'} style={{
            background: 'white', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14,
            maxHeight: 480, overflowY: 'auto',
          }}>
            {translationPending ? (
              <div style={{ padding: 24, color: '#78350f', background: '#fffbeb', border: '1px dashed #fde68a', borderRadius: 8, fontSize: 14, textAlign: 'center' }}>
                {loadingStage === 'translate'
                  ? '🌐 Translating to ' + LANG_LABEL[activeLang] + '… (~25s)'
                  : '🌐 Translation not ready. Switch back to العربية or wait / retry.'}
              </div>
            ) : <>
            <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{view.title}</h4>
            <p style={{ margin: '6px 0 12px', fontSize: 14, color: '#475569', fontStyle: 'italic' }}>
              {view.summary}
            </p>
            <div style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap', color: '#1f2937' }}>
              {view.content}
            </div>

            {Array.isArray(view.faqs) && view.faqs.length > 0 && (
              <>
                <h5 style={{ marginTop: 18, marginBottom: 8, fontSize: 15, fontWeight: 700 }}>FAQ</h5>
                {view.faqs.map((f, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Q: {f.q}</div>
                    <div style={{ fontSize: 14, color: '#374151' }}>A: {f.a}</div>
                  </div>
                ))}
              </>
            )}
            </>}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="adm-btn"
              onClick={approve}
              disabled={saving}
              style={{ background: '#16a34a' }}
            >
              {saving ? 'Publishing…' : '✓ Approve & publish'}
            </button>
            <button
              type="button"
              className="adm-btn"
              onClick={reject}
              disabled={saving}
              style={{ background: '#dc2626' }}
            >
              ✕ Reject
            </button>
            <button
              type="button"
              className="adm-btn"
              onClick={generate}
              disabled={saving || loading}
              style={{ background: '#0f172a' }}
            >
              🎲 Reject & regenerate
            </button>
          </div>
        </>
      )}
    </section>
  )
}
