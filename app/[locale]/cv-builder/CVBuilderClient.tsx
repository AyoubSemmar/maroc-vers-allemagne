'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { CVData, EMPTY_CV } from '@/components/cv-builder/types'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'
import StepPreview from '@/components/cv-builder/StepPreview'

// Simplified flow: paste your CV in any language (or upload a PDF/image) →
// the AI produces a German Lebenslauf → land on the same editable, styled,
// downloadable preview that the old 7-step wizard ended on.

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

function mergeIntoCV(partial: any): CVData {
  const p = partial?.personalInfo ?? {}
  return {
    ...EMPTY_CV,
    personalInfo: { ...EMPTY_CV.personalInfo, ...p, profileImage: '' },
    education: Array.isArray(partial?.education) ? partial.education : [],
    experience: Array.isArray(partial?.experience) ? partial.experience : [],
    skills: {
      technical: Array.isArray(partial?.skills?.technical) ? partial.skills.technical : [],
      soft: Array.isArray(partial?.skills?.soft) ? partial.skills.soft : [],
    },
    languages: Array.isArray(partial?.languages) ? partial.languages : [],
    documents: EMPTY_CV.documents,
    selectedTemplate: 'classic',
  }
}

export default function CVBuilderClient() {
  const t = useTranslations('cvBuilder')
  const locale = useLocale() as AppLocale
  const dir = dirFor(locale)

  const [authed, setAuthed] = useState<boolean | null>(null)
  const [ent, setEnt] = useState<EntitlementStatus | null>(null)
  const [rawText, setRawText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<CVData | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function refreshEntitlements() {
    try {
      const res = await fetch('/api/cv-ai', { method: 'GET' })
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
    if (!rawText.trim() && !file) { setError(t('simple.needInput')); return }
    setLoading(true)
    try {
      let filePayload: { dataUrl: string; name: string } | undefined
      if (file) filePayload = { dataUrl: await readFileAsDataUrl(file), name: file.name }
      const res = await fetch('/api/cv-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawText.trim() || undefined, file: filePayload }),
      })
      const json = await res.json()
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`)
      setData(mergeIntoCV(json.data))
      refreshEntitlements()
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
    } catch (e: any) {
      setError(e?.message || t('simple.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const update = (patch: Partial<CVData> | ((prev: CVData) => Partial<CVData>)) =>
    setData(prev => prev ? { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) } : prev)

  // Result view — reuse the existing styled, editable, downloadable preview.
  if (data) {
    return (
      <div className="rihla-cvb-root" dir={dir}>
        <div className="rihla-cvb-body wrap" style={{ paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <p className="rihla-cvb-subtitle" style={{ margin: 0, maxWidth: 620 }}>{t('simple.resultHint')}</p>
            <button type="button" className="rihla-cvb-btn-ghost" onClick={() => { setData(null); setError('') }}>
              ← {t('simple.startOver')}
            </button>
          </div>
          <div className="rihla-cvb-layout">
            <div className="rihla-cvb-form-col">
              <StepPreview data={data} update={update} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Input view
  return (
    <div className="rihla-cvb-root" dir={dir}>
      <header className="rihla-cvb-header">
        <div className="wrap">
          <p className="rihla-cvb-eyebrow">{t('eyebrow')}</p>
          <h1>{t('simple.title')}</h1>
          <p className="rihla-cvb-subtitle">{t('simple.subtitle')}</p>
          <div className="rihla-cvb-badges">
            <span className="rihla-cvb-badge">🌍 {t('simple.pasteLabel')}</span>
            <span className="rihla-cvb-badge">🇩🇪 Lebenslauf</span>
            <span className="rihla-cvb-badge">📄 PDF</span>
          </div>
        </div>
      </header>

      <div className="rihla-cvb-body wrap">
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
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={t('simple.pastePlaceholder')}
              rows={10}
              className="rihla-cvb-textarea"
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
              <button type="button" className="rihla-cvb-btn-ghost" onClick={() => fileInputRef.current?.click()}>
                📎 {t('simple.uploadCta')}
              </button>
              {file && <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>{t('simple.fileReady', { name: file.name })}</span>}
            </div>
          </div>

          {error && <div className="ansch-error" style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: 10, padding: '10px 14px', fontSize: 14 }}>❌ {error}</div>}

          <button
            type="button"
            className="rihla-cvb-btn-primary"
            onClick={handleGenerate}
            disabled={loading || authed === false || !canGenerate(ent)}
            style={{ opacity: (loading || authed === false || !canGenerate(ent)) ? 0.6 : 1 }}
          >
            {loading ? `⚙️ ${t('simple.generating')}` : `✨ ${t('simple.generate')}`}
          </button>
        </div>
      </div>
    </div>
  )
}
