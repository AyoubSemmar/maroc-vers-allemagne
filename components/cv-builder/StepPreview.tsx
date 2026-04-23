'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { CVData, TEMPLATES, TemplateId, TemplateMeta } from './types'
import CVTemplate from '../cv-templates'
import TemplateSelector from './TemplateSelector'
import UpgradeModal from './UpgradeModal'
import { exportCvToPdf } from './exportPdf'
import { clearStorage } from './utils'
import { saveCvDocument } from '@/lib/documents'
import { createClient } from '@/lib/supabase-browser'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepPreview({ data, update }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [modalTpl, setModalTpl] = useState<TemplateMeta | null>(null)
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

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

  async function onTranslate() {
    if (translating) return
    if (!confirm('سيتم إرسال بياناتك إلى خدمة الذكاء الاصطناعي لتصحيحها وترجمتها إلى الألمانية. المتابعة؟')) return
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
        })),
        experience: data.experience.map(x => ({
          jobTitle: x.jobTitle, company: x.company,
          location: x.location, description: x.description,
        })),
        skills: data.skills,
        languages: data.languages,
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
      const { data: g } = await res.json()

      update({
        personalInfo: {
          ...data.personalInfo,
          jobTitle: g.personalInfo.jobTitle ?? data.personalInfo.jobTitle,
          careerGoal: g.personalInfo.careerGoal ?? data.personalInfo.careerGoal,
          nationality: g.personalInfo.nationality ?? data.personalInfo.nationality,
          placeOfBirth: g.personalInfo.placeOfBirth ?? data.personalInfo.placeOfBirth,
          address: g.personalInfo.address ?? data.personalInfo.address,
          city: g.personalInfo.city ?? data.personalInfo.city,
        },
        education: data.education.map((orig, i) => ({
          ...orig,
          institution: g.education?.[i]?.institution ?? orig.institution,
          degree: g.education?.[i]?.degree ?? orig.degree,
          fieldOfStudy: g.education?.[i]?.fieldOfStudy ?? orig.fieldOfStudy,
          description: g.education?.[i]?.description ?? orig.description,
        })),
        experience: data.experience.map((orig, i) => ({
          ...orig,
          jobTitle: g.experience?.[i]?.jobTitle ?? orig.jobTitle,
          company: g.experience?.[i]?.company ?? orig.company,
          location: g.experience?.[i]?.location ?? orig.location,
          description: g.experience?.[i]?.description ?? orig.description,
        })),
        skills: {
          technical: g.skills?.technical ?? data.skills.technical,
          soft: g.skills?.soft ?? data.skills.soft,
        },
        languages: data.languages.map((orig, i) => ({
          ...orig,
          language: g.languages?.[i]?.language ?? orig.language,
        })),
      })
      alert('✅ تم التصحيح والترجمة إلى الألمانية بنجاح.')
    } catch (e: any) {
      console.error(e)
      alert('❌ تعذر إتمام الترجمة: ' + (e?.message || 'خطأ غير معروف'))
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
        if (confirm('يجب تسجيل الدخول لحفظ الوثيقة. هل تريد الانتقال لصفحة تسجيل الدخول؟')) {
          window.location.href = '/login'
        }
        return
      }
      const name = [data.personalInfo.firstName, data.personalInfo.lastName].filter(Boolean).join(' ') || 'سيرة ذاتية'
      const pos = data.personalInfo.jobTitle || ''
      const title = pos ? `${name} — ${pos}` : name
      await saveCvDocument(title, data as unknown as Record<string, unknown>)
      setSaveMsg('✅ تم الحفظ في حسابك')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (e: any) {
      console.error(e)
      setSaveMsg('❌ ' + (e?.message || 'خطأ في الحفظ'))
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
      await exportCvToPdf(previewRef.current, data)
    } catch (e) {
      console.error(e)
      alert('حدث خطأ أثناء توليد الملف. حاول مرة أخرى.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">المعاينة والتحميل</h3>
      <p className="rihla-cvb-step-hint">اختر القالب الذي يناسبك، ثم حمّل السيرة الذاتية كملف PDF.</p>

      <div className="rihla-cvb-tpl-section">
        <h4 className="rihla-cvb-subheader">اختر قالباً</h4>
        <TemplateSelector
          selected={data.selectedTemplate}
          onSelect={selectTemplate}
          onPremiumClick={(tpl) => { selectTemplate(tpl.id); setModalTpl(tpl) }}
          isPremiumUnlocked={isPremiumUnlocked}
        />
      </div>

      <div className="rihla-cvb-ai-bar">
        <div>
          <strong>✨ تصحيح وترجمة وتحسين إلى الألمانية</strong>
          <p className="rihla-cvb-hint-small" style={{ margin: '4px 0 0' }}>
            اكتب بأي لغة (عربية، فرنسية، إنجليزية، ألمانية). الذكاء الاصطناعي يصحح الأخطاء، يترجم إلى ألمانية احترافية، يولّد هدفاً مهنياً، ويُثري الوصف والمهارات الناعمة بشكل واقعي دون مبالغة.
          </p>
        </div>
        <button
          className="rihla-cvb-btn-primary"
          onClick={onTranslate}
          disabled={translating}
          type="button"
        >
          {translating ? '⏳ جاري المعالجة...' : '✨ تصحيح وتحسين'}
        </button>
      </div>

      <div className="rihla-cvb-actions-bar">
        <div className="rihla-cvb-actions-left">
          <strong>القالب الحالي:</strong> {selectedMeta.nameAr}
          {selectedMeta.isPremium && !isPremiumUnlocked && <span className="rihla-cvb-premium-badge">🔒 Premium</span>}
        </div>
        <div className="rihla-cvb-actions-right">
          <button className="rihla-cvb-btn-ghost" onClick={() => {
            if (confirm('هل تريد فعلاً إفراغ كل البيانات؟')) {
              clearStorage()
              location.reload()
            }
          }}>
            إفراغ البيانات
          </button>
          <button className="rihla-cvb-btn-ghost" onClick={onSave} disabled={saving} type="button">
            {saving ? '⏳...' : saveMsg || '💾 حفظ في حسابي'}
          </button>
          <button className="rihla-cvb-btn-primary" onClick={onDownload} disabled={busy}>
            {busy ? '⏳ جاري التوليد...' : canDownload ? '📥 تحميل PDF' : '🔒 ترقية للتحميل'}
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
          alert('✅ تم فتح القوالب المميزة (وضع تجريبي). في الإنتاج يربط مع بوابة الدفع.')
        }}
      />
    </div>
  )
}
