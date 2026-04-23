'use client'

import { useEffect, useMemo, useState } from 'react'
import { CVData, EMPTY_CV, STEPS } from '@/components/cv-builder/types'
import { calculateCompletion, loadFromStorage, saveToStorage } from '@/components/cv-builder/utils'

import StepPersonalInfo from '@/components/cv-builder/StepPersonalInfo'
import StepEducation    from '@/components/cv-builder/StepEducation'
import StepExperience   from '@/components/cv-builder/StepExperience'
import StepSkills       from '@/components/cv-builder/StepSkills'
import StepLanguages    from '@/components/cv-builder/StepLanguages'
import StepDocuments    from '@/components/cv-builder/StepDocuments'
import StepPreview      from '@/components/cv-builder/StepPreview'

export default function CVBuilderClient() {
  const [data, setData] = useState<CVData>(EMPTY_CV)
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadFromStorage())
    setMounted(true)
  }, [])

  // Persist on change (skip initial mount so we don't wipe storage)
  useEffect(() => {
    if (!mounted) return
    saveToStorage(data)
  }, [data, mounted])

  const update = (patch: Partial<CVData>) => setData(prev => ({ ...prev, ...patch }))
  const completion = useMemo(() => calculateCompletion(data), [data])

  const canGoNext = step < STEPS.length
  const canGoPrev = step > 1

  function validateStep(): string | null {
    if (step === 1) {
      const p = data.personalInfo
      if (!p.firstName.trim()) return 'الاسم الأول مطلوب'
      if (!p.lastName.trim())  return 'اسم العائلة مطلوب'
      if (!p.email.trim())     return 'البريد الإلكتروني مطلوب'
      if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return 'صيغة البريد غير صحيحة'
    }
    return null
  }

  function onNext() {
    const err = validateStep()
    if (err) { alert('⚠ ' + err); return }
    if (canGoNext) setStep(s => s + 1)
  }

  return (
    <div className="rihla-cvb-root" dir="rtl">
      <header className="rihla-cvb-header">
        <div className="wrap">
          <p className="rihla-cvb-eyebrow">📄 منشئ السيرة الذاتية</p>
          <h1>Lebenslauf Builder</h1>
          <p className="rihla-cvb-subtitle">
            أنشئ سيرتك الذاتية الألمانية خطوة بخطوة — معاينة فورية وتحميل PDF مجاني.
          </p>
          <div className="rihla-cvb-progress-wrap">
            <div className="rihla-cvb-progress-bar">
              <div className="rihla-cvb-progress-fill" style={{ width: `${completion}%` }} />
            </div>
            <span className="rihla-cvb-progress-text">{completion}% مكتمل</span>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="rihla-cvb-stepper">
        <div className="rihla-cvb-stepper-inner">
          {STEPS.map(s => (
            <button
              key={s.id}
              className={`rihla-cvb-step-pill${step === s.id ? ' active' : ''}${step > s.id ? ' done' : ''}`}
              onClick={() => setStep(s.id)}
              type="button"
            >
              <span className="rihla-cvb-step-num">{step > s.id ? '✓' : s.id}</span>
              <span className="rihla-cvb-step-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rihla-cvb-body wrap">
        <div className="rihla-cvb-layout">
          <div className="rihla-cvb-form-col">
            {step === 1 && <StepPersonalInfo data={data} update={update} />}
            {step === 2 && <StepEducation    data={data} update={update} />}
            {step === 3 && <StepExperience   data={data} update={update} />}
            {step === 4 && <StepSkills       data={data} update={update} />}
            {step === 5 && <StepLanguages    data={data} update={update} />}
            {step === 6 && <StepDocuments    data={data} update={update} />}
            {step === 7 && <StepPreview      data={data} update={update} />}

            {step < 7 && (
              <div className="rihla-cvb-nav">
                <button
                  type="button"
                  className="rihla-cvb-btn-ghost"
                  onClick={() => canGoPrev && setStep(s => s - 1)}
                  disabled={!canGoPrev}
                >
                  ← السابق
                </button>
                <button type="button" className="rihla-cvb-btn-primary" onClick={onNext}>
                  التالي ←
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
