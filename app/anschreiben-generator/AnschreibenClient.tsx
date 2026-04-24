'use client'

import { useEffect, useState } from 'react'
import AnschreibenForm, { FormState } from '@/components/anschreiben/AnschreibenForm'
import AnschreibenPreview from '@/components/anschreiben/AnschreibenPreview'

const STORAGE_KEY = 'rihla_anschreiben_form_v1'

const EMPTY: FormState = {
  fullName: '',
  ausbildungPosition: '',
  gender: 'male',
  background: '',
  cvFile: null,
}

function loadSaved(): FormState {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const p = JSON.parse(raw)
    return { ...EMPTY, fullName: p.fullName || '', ausbildungPosition: p.ausbildungPosition || '', gender: p.gender || 'male', background: p.background || '' }
  } catch { return EMPTY }
}

type EntitlementStatus =
  | { tier: 'premium'; limit: number | null; used: number; remaining: number | null }
  | { tier: 'free'; credits: number; used: number; freeLifetimeAvailable?: boolean }

function canGenerate(ent: EntitlementStatus | null): boolean {
  // If we haven't loaded entitlements yet, let the user click; the API will
  // enforce and return a 402 if they really can't.
  if (!ent) return true
  if (ent.tier === 'premium') return ent.remaining === null || ent.remaining > 0
  return !!ent.freeLifetimeAvailable || ent.credits > 0
}

export default function AnschreibenClient() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')
  const [error, setError] = useState('')
  const [ent, setEnt] = useState<EntitlementStatus | null>(null)

  async function refreshEntitlements() {
    try {
      const res = await fetch('/api/generate-anschreiben', { method: 'GET' })
      if (!res.ok) return
      setEnt(await res.json())
    } catch {}
  }

  useEffect(() => {
    setForm(loadSaved())
    setMounted(true)
    refreshEntitlements()
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fullName: form.fullName,
        ausbildungPosition: form.ausbildungPosition,
        gender: form.gender,
        background: form.background,
      }))
    } catch {}
  }, [form, mounted])

  function update(patch: Partial<FormState>) {
    setForm(prev => ({ ...prev, ...patch }))
  }

  async function handleSubmit() {
    setError('')
    setLoading(true)
    setLetter('')

    try {
      const fd = new FormData()
      fd.append('full_name', form.fullName.trim())
      fd.append('ausbildung_position', form.ausbildungPosition.trim())
      fd.append('gender', form.gender)
      fd.append('user_background_text', form.background.trim())
      if (form.cvFile) fd.append('cv_file', form.cvFile)

      const res = await fetch('/api/generate-anschreiben', { method: 'POST', body: fd })
      const json = await res.json()

      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`)
      setLetter(json.letter)
      refreshEntitlements()

      // Scroll to result
      setTimeout(() => {
        document.getElementById('ansch-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (e: any) {
      setError(e?.message || 'حدث خطأ غير معروف. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ansch-root" dir="rtl">
      {/* Header */}
      <header className="ansch-header">
        <div className="wrap">
          <p className="ansch-eyebrow">✍️ مولّد خطاب التحفيز</p>
          <h1>Anschreiben Generator</h1>
          <p className="ansch-subtitle">
            أدخل بياناتك باللغة التي تريد — الذكاء الاصطناعي يكتب لك خطاباً احترافياً بالألمانية خصصاً لطلب Ausbildung.
          </p>
        </div>
      </header>

      <div className="ansch-body wrap">
        {/* Entitlement banner */}
        {ent && <EntitlementBanner ent={ent} />}

        <div className={`ansch-layout${letter ? ' has-result' : ''}`}>
          {/* Form */}
          <div className="ansch-form-col">
            <AnschreibenForm
              state={form}
              onChange={update}
              onSubmit={handleSubmit}
              loading={loading}
              canGenerate={canGenerate(ent)}
            />
            {error && (
              <div className="ansch-error">
                ❌ {error}
              </div>
            )}
          </div>

          {/* Preview */}
          {letter && (
            <div className="ansch-preview-col" id="ansch-result">
              <AnschreibenPreview
                letter={letter}
                fullName={form.fullName}
                position={form.ausbildungPosition}
              />
            </div>
          )}
        </div>

        {/* Empty state hint */}
        {!letter && !loading && (
          <div className="ansch-empty-hint">
            <div className="ansch-empty-icon">📨</div>
            <p>خطابك سيظهر هنا بعد الضغط على زر التوليد</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="ansch-loading-state">
            <div className="ansch-loading-icon">⚙️</div>
            <p>الذكاء الاصطناعي يكتب خطابك...</p>
            <p className="ansch-hint-small">يستغرق عادةً 5–15 ثانية</p>
            <div className="ansch-skeleton-lines">
              {[100, 90, 95, 80, 100, 70, 85, 60].map((w, i) => (
                <div key={i} className="ansch-skeleton-line" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EntitlementBanner({ ent }: { ent: EntitlementStatus }) {
  // Premium users
  if (ent.tier === 'premium') {
    const r = ent.remaining
    const label = r === null
      ? '✨ باقة مميزة — توليد غير محدود'
      : `✨ باقة مميزة — متبقي اليوم: ${r}/${ent.limit}`
    return (
      <div style={bannerStyle('premium')}>
        <strong>{label}</strong>
      </div>
    )
  }

  // Free users with a lifetime free try still available
  if (ent.freeLifetimeAvailable) {
    return (
      <div style={bannerStyle('free')}>
        <strong>🎁 لديك محاولة مجانية واحدة!</strong>
        <span style={{ fontSize: 13, color: '#166534' }}>
          &nbsp;جرّب مولّد خطاب التحفيز مجاناً مرة واحدة — بعدها تحتاج رصيداً.
        </span>
      </div>
    )
  }

  // Free users with paid credits
  if (ent.credits > 0) {
    return (
      <div style={bannerStyle('credits')}>
        <strong>رصيدك: {ent.credits} {ent.credits === 1 ? 'رسالة' : 'رسائل'}</strong>
        <span style={{ fontSize: 13, color: '#78350f' }}>
          &nbsp;سيُخصم رصيد واحد عند كل توليد ناجح.
        </span>
      </div>
    )
  }

  // Free users with nothing
  return (
    <div style={bannerStyle('empty')}>
      <strong>❌ لا تملك رصيداً</strong>
      <span style={{ fontSize: 13, color: '#7f1d1d' }}>
        &nbsp;لقد استخدمت محاولتك المجانية. اشترِ رصيداً أو ترقَّ إلى الباقة المميزة للمتابعة.
      </span>
      <div style={{ marginTop: 8 }}>
        <button type="button" disabled
          style={{
            padding: '8px 14px', borderRadius: 8, border: '1px solid #d1d5db',
            background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed', fontWeight: 600, fontSize: 13,
          }}>
          💳 شراء رصيد (قريباً)
        </button>
      </div>
    </div>
  )
}

function bannerStyle(kind: 'premium' | 'free' | 'credits' | 'empty'): React.CSSProperties {
  const colors = {
    premium: { bg: '#ede9fe', border: '#c4b5fd', text: '#5b21b6' },
    free:    { bg: '#dcfce7', border: '#86efac', text: '#166534' },
    credits: { bg: '#fef3c7', border: '#fcd34d', text: '#78350f' },
    empty:   { bg: '#fee2e2', border: '#fca5a5', text: '#7f1d1d' },
  }[kind]
  return {
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    borderRadius: 12,
    padding: '10px 14px',
    marginBottom: 16,
    fontSize: 14,
  }
}
