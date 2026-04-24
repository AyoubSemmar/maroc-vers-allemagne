'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { CVData, DocumentFile, EMPTY_CV, STEPS } from '@/components/cv-builder/types'
import { calculateCompletion, loadFromStorage, saveToStorage, clearStorage } from '@/components/cv-builder/utils'
import { createClient as createBrowserClient } from '@/lib/supabase-browser'
import { fetchDocuments, type DocumentType } from '@/lib/documents'

type CategoryKey = keyof CVData['documents']
const DOC_TYPE_TO_CATEGORY: Partial<Record<DocumentType, CategoryKey>> = {
  arbeitsbescheinigung:    'certificates',
  akademisches_zertifikat: 'diploma',
  sprachzertifikat:        'languageCertificates',
  motivationsschreiben:    'optionalCoverLetter',
}

import StepPersonalInfo from '@/components/cv-builder/StepPersonalInfo'
import StepEducation    from '@/components/cv-builder/StepEducation'
import StepExperience   from '@/components/cv-builder/StepExperience'
import StepSkills       from '@/components/cv-builder/StepSkills'
import StepLanguages    from '@/components/cv-builder/StepLanguages'
import StepDocuments    from '@/components/cv-builder/StepDocuments'
import StepPreview      from '@/components/cv-builder/StepPreview'

export default function CVBuilderClient() {
  const t = useTranslations('cvBuilder')
  const locale = useLocale() as AppLocale
  const [data, setData] = useState<CVData>(EMPTY_CV)
  const [step, setStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const lastUserIdRef = useRef<string | null | undefined>(undefined)

  // Load from localStorage on mount; also detect if the stored draft belonged
  // to a *different* user and wipe it if so (handles account switches where
  // the old user's cookies were replaced before we got the chance to listen).
  useEffect(() => {
    const supabase = createBrowserClient()
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const currentId = user?.id ?? null
      lastUserIdRef.current = currentId

      // Load any saved draft. The draft belongs to whoever was last logged in
      // on this device; if that was a different user, don't show it.
      const saved = loadFromStorage()
      const savedOwner = (saved as CVData & { __owner?: string }).__owner
      let base: CVData
      if (savedOwner && savedOwner !== currentId) {
        clearStorage()
        base = EMPTY_CV
      } else {
        base = saved
      }

      // Rehydrate uploaded documents from Supabase so the Documents step still
      // shows the files after a page reload (base64 dataUrls aren't persisted
      // locally because they blow the localStorage quota).
      if (currentId) {
        try {
          const remote = await fetchDocuments()
          const merged = { ...base.documents }
          for (const key of Object.keys(merged) as CategoryKey[]) {
            const existingIds = new Set(merged[key].map(d => d.savedId).filter(Boolean))
            const additions: DocumentFile[] = []
            for (const doc of remote) {
              if (doc.source !== 'upload') continue
              const cat = DOC_TYPE_TO_CATEGORY[doc.doc_type]
              if (cat !== key) continue
              if (existingIds.has(doc.id)) continue
              additions.push({
                name: doc.title,
                size: 0,
                type: doc.file_path?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/*',
                dataUrl: '', // fetched on demand when needed (e.g. sending to AI)
                savedId: doc.id,
                storagePath: doc.file_path ?? undefined,
                storageUrl: doc.file_url ?? undefined,
              })
            }
            if (additions.length) merged[key] = [...merged[key], ...additions]
          }
          base = { ...base, documents: merged }
        } catch (e) {
          console.error('[cv-builder] rehydrate documents failed:', e)
        }
      }

      setData(base)
      setMounted(true)
    })()
  }, [])

  // Supabase auth listener: wipe CV state on logout OR account switch
  useEffect(() => {
    const supabase = createBrowserClient()
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const newId = session?.user?.id ?? null
      const prevId = lastUserIdRef.current

      if (event === 'SIGNED_OUT' || (prevId !== undefined && newId !== prevId)) {
        clearStorage()
        setData(EMPTY_CV)
        setStep(1)
      }
      lastUserIdRef.current = newId
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Clear everything when the user leaves the CV builder page entirely
  // (navigation away, tab close). Refresh will also trigger this — data loss
  // on refresh is an accepted trade-off for shared-device privacy.
  useEffect(() => {
    return () => {
      clearStorage()
    }
  }, [])

  // Persist on change (skip initial mount so we don't wipe storage).
  // We tag the saved draft with the current user id so we can detect
  // if the device has been used by another account since.
  useEffect(() => {
    if (!mounted) return
    const tagged = { ...data, __owner: lastUserIdRef.current ?? null }
    saveToStorage(tagged as unknown as CVData)
  }, [data, mounted])

  const update = (patch: Partial<CVData> | ((prev: CVData) => Partial<CVData>)) =>
    setData(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  const completion = useMemo(() => calculateCompletion(data), [data])

  const canGoNext = step < STEPS.length
  const canGoPrev = step > 1

  function validateStep(): string | null {
    if (step === 1) {
      const p = data.personalInfo
      if (!p.firstName.trim()) return t('validation.firstName')
      if (!p.lastName.trim())  return t('validation.lastName')
      if (!p.email.trim())     return t('validation.emailReq')
      if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return t('validation.emailInvalid')
    }
    return null
  }

  function onNext() {
    const err = validateStep()
    if (err) { alert(t('warn', { msg: err })); return }
    if (canGoNext) setStep(s => s + 1)
  }

  return (
    <div className="rihla-cvb-root" dir={dirFor(locale)}>
      <header className="rihla-cvb-header">
        <div className="wrap">
          <p className="rihla-cvb-eyebrow">{t('eyebrow')}</p>
          <h1>Lebenslauf Builder</h1>
          <p className="rihla-cvb-subtitle">
            {t('subtitle')}
          </p>
          <div className="rihla-cvb-progress-wrap">
            <div className="rihla-cvb-progress-bar">
              <div className="rihla-cvb-progress-fill" style={{ width: `${completion}%` }} />
            </div>
            <span className="rihla-cvb-progress-text">{t('completion', { n: completion })}</span>
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
              <span className="rihla-cvb-step-label">{t(`stepLabel.${s.labelKey}`)}</span>
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
                  {t('prev')}
                </button>
                <button type="button" className="rihla-cvb-btn-primary" onClick={onNext}>
                  {t('next')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
