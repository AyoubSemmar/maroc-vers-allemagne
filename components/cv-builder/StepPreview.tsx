'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { type AppLocale } from '@/i18n/routing'
import { CVData, TEMPLATES, TemplateId, TemplateMeta } from './types'
import CVTemplate from '../cv-templates'
import TemplateSelector from './TemplateSelector'
import UpgradeModal from './UpgradeModal'
import { exportCvToPdf } from './exportPdf'
import { clearStorage, urlToDataUrl } from './utils'
import { saveCvDocument } from '@/lib/documents'
import { createClient } from '@/lib/supabase-browser'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepPreview({ data, update }: Props) {
  const t = useTranslations('cvBuilder.preview')
  const tTpl = useTranslations('cvBuilder.templates')
  const locale = useLocale() as AppLocale
  const previewRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [modalTpl, setModalTpl] = useState<TemplateMeta | null>(null)
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  // CV-AI quota: 2 free improvements per day for free users (matches photo
  // enhance). Hits /api/cv-ai GET on mount + after every successful POST.
  const [aiRemaining, setAiRemaining] = useState<number | null>(null)
  const [aiLimit, setAiLimit] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/cv-ai').then(r => r.ok ? r.json() : null).then(data => {
      if (cancelled || !data) return
      if (typeof data.remaining === 'number') setAiRemaining(data.remaining)
      if (typeof data.limit === 'number')     setAiLimit(data.limit)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  // Responsive preview scaling. On mobile, scale the 794px-wide CV template
  // to fit the viewport and set the wrapper height to match the scaled content.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    function updateScale() {
      const wrapper = wrapperRef.current
      const inner = previewRef.current
      if (!wrapper || !inner) return

      const containerWidth = wrapper.clientWidth - 16 // account for 8px padding each side
      const templateWidth = 794
      const scale = Math.min(1, containerWidth / templateWidth)

      // Measure the real rendered height of the CV template at natural (1×) size
      // by temporarily removing the scale, reading scrollHeight, then restoring.
      const innerHeight = inner.scrollHeight

      wrapper.style.setProperty('--cv-scale', String(scale))
      wrapper.style.setProperty('--cv-scaled-height', `${innerHeight * scale + 16}px`)
    }

    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    if (previewRef.current) ro.observe(previewRef.current)
    window.addEventListener('resize', updateScale)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [data, data.selectedTemplate])

  const selectedMeta = TEMPLATES.find(t => t.id === data.selectedTemplate) ?? TEMPLATES[0]
  const canDownload = !selectedMeta.isPremium || isPremiumUnlocked

  function selectTemplate(id: TemplateId) {
    update({ selectedTemplate: id })
  }

  // Ensure every document has a base64 dataUrl before sending to the AI.
  // After a page reload, docs rehydrated from Supabase have an empty dataUrl —
  // we fetch the bytes from storage on demand here.
  async function prepareDocs(list: CVData['documents']['certificates']) {
    const out: { name: string; type: string; dataUrl: string }[] = []
    for (const d of list) {
      let dataUrl = d.dataUrl
      if (!dataUrl && d.storageUrl) {
        try { dataUrl = await urlToDataUrl(d.storageUrl) }
        catch (e) { console.error('[cv-builder] fetch doc failed:', d.name, e); continue }
      }
      if (!dataUrl) continue
      // Infer a concrete media type from the fetched dataUrl when we rehydrated.
      const inferred = /^data:([^;]+);base64,/i.exec(dataUrl)?.[1] || d.type || 'application/octet-stream'
      out.push({ name: d.name, type: inferred, dataUrl })
    }
    return out
  }

  async function onTranslate() {
    if (translating) return
    if (!confirm(t('aiConfirm'))) return
    setTranslating(true)
    try {
      const payload = {
        personalInfo: {
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          jobTitle: data.personalInfo.jobTitle,
          careerGoal: data.personalInfo.careerGoal,
          nationality: data.personalInfo.nationality,
          placeOfBirth: data.personalInfo.placeOfBirth,
          address: data.personalInfo.address,
          city: data.personalInfo.city,
        },
        education: data.education.map(e => ({
          institution: e.institution, degree: e.degree,
          fieldOfStudy: e.fieldOfStudy, description: e.description,
          startDate: e.startDate, endDate: e.endDate,
        })),
        experience: data.experience.map(x => ({
          jobTitle: x.jobTitle, company: x.company,
          location: x.location, description: x.description,
          startDate: x.startDate, endDate: x.endDate,
        })),
        skills: data.skills,
        languages: data.languages,
        documents: {
          certificates:         await prepareDocs(data.documents.certificates),
          diploma:              await prepareDocs(data.documents.diploma),
          languageCertificates: await prepareDocs(data.documents.languageCertificates),
          optionalCoverLetter:  await prepareDocs(data.documents.optionalCoverLetter),
        },
      }
      const res = await fetch('/api/cv-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const json = await res.json()
      const g = json.data
      // Refresh the quota counter from the same response so the user sees
      // their remaining count update without a separate GET.
      if (typeof json.remaining === 'number') setAiRemaining(json.remaining)
      if (typeof json.limit === 'number')     setAiLimit(json.limit)

      // AI arrays may be LONGER than the user's input when docs let it add
      // new education/experience/language entries. Pad with empty originals.
      const mergedEducation = (g.education ?? []).map((ai: any, i: number) => {
        const orig = data.education[i] ?? { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' }
        return {
          ...orig,
          institution:  ai?.institution  ?? orig.institution,
          degree:       ai?.degree       ?? orig.degree,
          fieldOfStudy: ai?.fieldOfStudy ?? orig.fieldOfStudy,
          description:  ai?.description  ?? orig.description,
          startDate:    ai?.startDate    ?? orig.startDate,
          endDate:      ai?.endDate      ?? orig.endDate,
        }
      })

      const mergedExperience = (g.experience ?? []).map((ai: any, i: number) => {
        const orig = data.experience[i] ?? { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }
        return {
          ...orig,
          jobTitle:    ai?.jobTitle    ?? orig.jobTitle,
          company:     ai?.company     ?? orig.company,
          location:    ai?.location    ?? orig.location,
          description: ai?.description ?? orig.description,
          startDate:   ai?.startDate   ?? orig.startDate,
          endDate:     ai?.endDate     ?? orig.endDate,
        }
      })

      const mergedLanguages = (g.languages ?? []).map((ai: any, i: number) => {
        const orig = data.languages[i] ?? { language: '', level: 'B1' as const }
        return {
          ...orig,
          language: ai?.language ?? orig.language,
          level:    ai?.level    ?? orig.level,
        }
      })

      update({
        personalInfo: {
          ...data.personalInfo,
          jobTitle: g.personalInfo?.jobTitle ?? data.personalInfo.jobTitle,
          careerGoal: g.personalInfo?.careerGoal ?? data.personalInfo.careerGoal,
          nationality: g.personalInfo?.nationality ?? data.personalInfo.nationality,
          placeOfBirth: g.personalInfo?.placeOfBirth ?? data.personalInfo.placeOfBirth,
          address: g.personalInfo?.address ?? data.personalInfo.address,
          city: g.personalInfo?.city ?? data.personalInfo.city,
        },
        education: mergedEducation.length ? mergedEducation : data.education,
        experience: mergedExperience.length ? mergedExperience : data.experience,
        skills: {
          technical: g.skills?.technical ?? data.skills.technical,
          soft: g.skills?.soft ?? data.skills.soft,
        },
        languages: mergedLanguages.length ? mergedLanguages : data.languages,
      })
      alert(t('aiSuccess'))
    } catch (e: any) {
      console.error(e)
      alert(t('aiFail', { msg: e?.message || t('unknownErr') }))
    } finally {
      setTranslating(false)
    }
  }

  async function onSave() {
    if (saving) return
    setSaving(true)
    setSaveMsg('')
    try {
      const supabase = createClient()
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        if (confirm(t('loginPrompt'))) {
          window.location.href = `/${locale}/login`
        }
        return
      }
      const name = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(' ') || t('defaultName')
      const pos = data.personalInfo.jobTitle || ''
      const title = pos ? `${name} — ${pos}` : name
      await saveCvDocument(title, data as unknown as Record<string, unknown>)
      setSaveMsg(t('saveOk'))
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (e: any) {
      console.error(e)
      setSaveMsg(t('saveErr', { msg: e?.message || t('saveErrDefault') }))
      setTimeout(() => setSaveMsg(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  async function onDownload() {
    if (!previewRef.current) return
    if (!canDownload) { setModalTpl(selectedMeta); return }
    setBusy(true)
    try {
      // 1. Auto-save to the user's account (required — middleware guarantees auth)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(' ') || t('defaultName')
        const pos = data.personalInfo.jobTitle || ''
        const title = pos ? `${name} — ${pos}` : name
        try {
          await saveCvDocument(title, data as unknown as Record<string, unknown>)
        } catch (saveErr) {
          console.error('[cv-builder] auto-save on download failed:', saveErr)
          // continue with download anyway
        }
      }

      // 2. Generate and download the PDF
      await exportCvToPdf(previewRef.current, data)

      // 3. Wipe local draft and send the user to the landing page
      clearStorage()
      window.location.href = `/${locale}`
    } catch (e) {
      console.error(e)
      alert(t('downloadErr'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">{t('title')}</h3>
      <p className="rihla-cvb-step-hint">{t('hint')}</p>

      <div className="rihla-cvb-tpl-section">
        <h4 className="rihla-cvb-subheader">{t('chooseTemplate')}</h4>
        <TemplateSelector
          selected={data.selectedTemplate}
          onSelect={selectTemplate}
          onPremiumClick={(tpl) => { selectTemplate(tpl.id); setModalTpl(tpl) }}
          isPremiumUnlocked={isPremiumUnlocked}
        />
      </div>

      <div className="rihla-cvb-ai-bar">
        <div>
          <strong>{t('aiTitle')}</strong>
          <p className="rihla-cvb-hint-small" style={{ margin: '4px 0 0' }}>
            {t('aiHint')}
            {aiRemaining !== null && aiLimit !== null && (
              <>
                {' · '}
                <span style={{ color: aiRemaining === 0 ? '#dc2626' : 'var(--ink-mute)', fontWeight: 600 }}>
                  {aiRemaining}/{aiLimit} {t('aiRemaining')}
                </span>
              </>
            )}
          </p>
        </div>
        <button
          className="rihla-cvb-btn-primary"
          onClick={onTranslate}
          disabled={translating || aiRemaining === 0}
          type="button"
        >
          {translating ? t('aiProcessing') : t('aiCta')}
        </button>
      </div>

      <div className="rihla-cvb-actions-bar">
        <div className="rihla-cvb-actions-left">
          <strong>{t('currentTemplate')}</strong> {tTpl(`${selectedMeta.id}.name`)}
          {selectedMeta.isPremium && !isPremiumUnlocked && <span className="rihla-cvb-premium-badge">{t('premiumBadge')}</span>}
        </div>
        <div className="rihla-cvb-actions-right">
          <button className="rihla-cvb-btn-ghost" onClick={() => {
            if (confirm(t('confirmClear'))) {
              clearStorage()
              location.reload()
            }
          }}>
            {t('clear')}
          </button>
          <button className="rihla-cvb-btn-ghost" onClick={onSave} disabled={saving} type="button">
            {saving ? t('saveBusy') : saveMsg || t('save')}
          </button>
          <button className="rihla-cvb-btn-primary" onClick={onDownload} disabled={busy}>
            {busy ? t('downloadBusy') : canDownload ? t('download') : t('downloadLocked')}
          </button>
        </div>
      </div>

      <div className="rihla-cvb-final-preview" ref={wrapperRef}>
        <div className="rihla-cvb-final-preview-inner" ref={previewRef}>
          <CVTemplate data={data} template={data.selectedTemplate} />
        </div>
      </div>

      <UpgradeModal
        open={!!modalTpl}
        template={modalTpl}
        onClose={() => setModalTpl(null)}
        onUnlock={() => {
          // Demo: unlock without real payment. In production, integrate Stripe/Paddle here.
          setIsPremiumUnlocked(true)
          setModalTpl(null)
          alert(t('upgradeDone'))
        }}
      />
    </div>
  )
}
