'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'
import AnschreibenPreview from '@/components/anschreiben/AnschreibenPreview'

// Simplified flow: paste your existing motivation letter in any language (or
// upload it) → get a corrected, professional German Anschreiben in the same
// copy/save/PDF preview as before.

type EntitlementStatus =
  | { tier: 'premium'; limit: number | null; used: number; remaining: number | null }
  | { tier: 'free'; credits: number; used: number; dailyLimit: number; dailyRemaining: number }

function canGenerate(ent: EntitlementStatus | null): boolean {
  if (!ent) return true
  if (ent.tier === 'premium') return ent.remaining === null || ent.remaining > 0
  return ent.dailyRemaining > 0 || ent.credits > 0
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export default function AnschreibenClient() {
  const t = useTranslations('anschreiben')
  const locale = useLocale() as AppLocale
  const dir = dirFor(locale)

  const [authed, setAuthed] = useState<boolean | null>(null)
  const [ent, setEnt] = useState<EntitlementStatus | null>(null)
  const [letterText, setLetterText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function refreshEntitlements() {
    try {
      const res = await fetch('/api/generate-anschreiben', { method: 'GET' })
      if (res.status === 401) { setAuthed(false); return }
      setAuthed(true)
      if (res.ok) setEnt(await res.json())
    } catch {}
  }

  useEffect(() => {
    const supabase = createBrowserClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthed(!!user)
      if (user) refreshEntitlements()
    })
  }, [])

  async function handleGenerate() {
    setError('')
    if (!letterText.trim() && !file) { setError(t('simple.needInput')); return }
    setLoading(true)
    setResult('')
    try {
      let filePayload: { dataUrl: string; name: string } | undefined
      if (file) filePayload = { dataUrl: await readFileAsDataUrl(file), name: file.name }
      const res = await fetch('/api/generate-anschreiben', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letterText: letterText.trim() || undefined, file: filePayload }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`)
      setResult(json.letter)
      refreshEntitlements()
      setTimeout(() => document.getElementById('ansch-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } catch (e: any) {
      setError(e?.message || t('simple.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ansch-root" dir={dir}>
      <header className="ansch-header">
        <div className="wrap">
          <p className="ansch-eyebrow">{t('eyebrow')}</p>
          <h1>{t('simple.title')}</h1>
          <p className="ansch-subtitle">{t('simple.subtitle')}</p>
          <div className="ansch-badges">
            <span className="ansch-badge">🌍 {t('simple.pasteLabel')}</span>
            <span className="ansch-badge">🇩🇪 German</span>
            <span className="ansch-badge">📄 PDF</span>
          </div>
        </div>
      </header>

      <div className="ansch-body wrap">
        {authed === false && (
          <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#78350f', borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 14 }}>
            {t('simple.loginRequired')}{' '}
            <a href={`/${locale}/login`} style={{ fontWeight: 700, textDecoration: 'underline' }}>→</a>
          </div>
        )}

        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'block' }}>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#111827' }}>{t('simple.pasteLabel')}</span>
            <textarea
              value={letterText}
              onChange={(e) => setLetterText(e.target.value)}
              placeholder={t('simple.pastePlaceholder')}
              rows={10}
              style={{ width: '100%', border: '1.5px solid #d1d5db', borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.6, resize: 'vertical' }}
            />
          </label>

          <div>
            <span style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#111827' }}>{t('simple.uploadLabel')}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="ansch-btn-ghost" onClick={() => fileInputRef.current?.click()}>
                📎 {t('simple.uploadCta')}
              </button>
              {file && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>{t('simple.fileReady', { name: file.name })}</span>}
            </div>
          </div>

          {error && <div className="ansch-error">❌ {error}</div>}

          <button
            type="button"
            className="ansch-btn-brand"
            onClick={handleGenerate}
            disabled={loading || authed === false || !canGenerate(ent)}
            style={{ opacity: (loading || authed === false || !canGenerate(ent)) ? 0.6 : 1 }}
          >
            {loading ? `⚙️ ${t('simple.generating')}` : `✨ ${t('simple.generate')}`}
          </button>
        </div>

        {loading && (
          <div className="ansch-loading-state">
            <div className="ansch-loading-icon">⚙️</div>
            <p>{t('loadingTitle')}</p>
            <p className="ansch-hint-small">{t('loadingHint')}</p>
            <div className="ansch-skeleton-lines">
              {[100, 90, 95, 80, 100, 70, 85, 60].map((w, i) => (
                <div key={i} className="ansch-skeleton-line" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="ansch-preview-col" id="ansch-result" style={{ marginTop: 20 }}>
            <AnschreibenPreview letter={result} fullName="" position="" />
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <button type="button" className="ansch-btn-ghost" onClick={() => { setResult(''); setLetterText(''); setFile(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                ← {t('simple.startOver')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
