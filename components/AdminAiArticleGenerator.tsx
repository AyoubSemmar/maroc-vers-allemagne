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
  ar: '🇲🇦 العربية',
  fr: '🇫🇷 Français',
  en: '🇬🇧 English',
  de: '🇩🇪 Deutsch',
}

export default function AdminAiArticleGenerator() {
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [titleClash, setTitleClash] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeLang, setActiveLang] = useState<Lang>('ar')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<{ id: string } | null>(null)

  async function generate() {
    setLoading(true)
    setError(null)
    setDraft(null)
    setSaved(null)
    setTitleClash(false)
    try {
      const resp = await fetch('/api/admin/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await resp.json()
      if (!resp.ok) {
        setError(data?.error || `Generation failed (${resp.status})`)
        return
      }
      setDraft(data.draft)
      setTitleClash(!!data.titleClash)
      setActiveLang('ar')
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
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
      setSaved({ id: data.id })
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
            {loading ? 'Generating… (this takes 30–60s)' : '✨ Generate a new article draft'}
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
          <strong>✓ Article published.</strong> Saved with ID <code>{saved.id}</code>. Generate another?
          <div style={{ marginTop: 8 }}>
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
            ) : (
              <div style={{
                width: 220, height: 124, borderRadius: 8, border: '1px dashed #e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af', fontSize: 13,
              }}>
                no image generated
              </div>
            )}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>Category</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{draft.category}</div>
              <div style={{ fontSize: 12, color: 'var(--adm-ink-mute)', marginTop: 6 }}>Date</div>
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
