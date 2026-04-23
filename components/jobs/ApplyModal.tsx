'use client'

import { useEffect, useState } from 'react'
import { Job } from './JobCard'

type Props = {
  job: Job
  onClose: () => void
}

export default function ApplyModal({ job, onClose }: Props) {
  const [toast, setToast] = useState('')

  // ── Lock body scroll while open ─────────────────────────
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  async function copyEmail() {
    if (!job.contact_email) return
    try {
      await navigator.clipboard.writeText(job.contact_email)
      showToast('✅ تم نسخ الإيميل')
    } catch {
      showToast('❌ تعذر النسخ')
    }
  }

  const hasEmail = !!job.contact_email
  const hasUrl = !!job.apply_url
  const hasAny = hasEmail || hasUrl

  return (
    <div
      className="aj-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="aj-modal">
        {/* Header */}
        <div className="aj-modal-header">
          <div className="aj-modal-title-block">
            <h2 className="aj-modal-title">{job.title}</h2>
            <p className="aj-modal-subtitle">
              🏢 {job.company}
              {job.location && job.location !== '—' ? ` · 📍 ${job.location}` : ''}
              {job.anstellungsart ? ` · ⏱ ${job.anstellungsart}` : ''}
            </p>
          </div>
          <button type="button" className="aj-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="aj-modal-body">
          <div className="aj-section">
            <h3 className="aj-section-title">📬 طريقة التقديم</h3>

            {!hasAny && (
              <div className="aj-attach-empty">
                لم يُوفّر صاحب العمل إيميل أو رابط تقديم. يمكنك البحث عن الشركة مباشرة.
              </div>
            )}

            {hasEmail && (
              <div className="aj-contact-block">
                <div className="aj-contact-label">📧 Email للتقديم</div>
                <div className="aj-contact-row">
                  <a href={`mailto:${job.contact_email}`} className="aj-contact-value" dir="ltr">
                    {job.contact_email}
                  </a>
                  <button type="button" className="aj-btn-ghost aj-btn-sm" onClick={copyEmail}>
                    📋 نسخ
                  </button>
                </div>
              </div>
            )}

            {hasUrl && (
              <div className="aj-contact-block">
                <div className="aj-contact-label">🌐 رابط التقديم</div>
                <a
                  href={job.apply_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aj-offer-link"
                >
                  <span className="aj-offer-link-icon">🔗</span>
                  <span className="aj-offer-link-text">
                    <span className="aj-offer-link-title">فتح صفحة التقديم</span>
                    <span className="aj-offer-link-sub">{job.apply_url}</span>
                  </span>
                </a>
              </div>
            )}
          </div>

          <p className="aj-email-hint" style={{ marginTop: 12 }}>
            💡 نصيحة: جهّز سيرتك الذاتية ورسالة الدوافع بالألمانية قبل التواصل مع صاحب العمل.
            يمكنك استخدام <a href="/cv-builder" style={{ color: 'var(--brand)', textDecoration: 'underline' }}>باني السيرة الذاتية</a> المجاني.
          </p>
        </div>

        {toast && <div className="aj-toast">{toast}</div>}
      </div>
    </div>
  )
}
