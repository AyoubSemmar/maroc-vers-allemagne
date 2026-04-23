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

export default function AnschreibenClient() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [letter, setLetter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(loadSaved())
    setMounted(true)
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
        <div className={`ansch-layout${letter ? ' has-result' : ''}`}>
          {/* Form */}
          <div className="ansch-form-col">
            <AnschreibenForm
              state={form}
              onChange={update}
              onSubmit={handleSubmit}
              loading={loading}
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
