'use client'

import { useMemo, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useShell } from './DashShell'
import { DOC_TYPE_LABELS } from '@/lib/documents'

type PathKey = 'ausbildung' | 'studium'

type JourneyStatus = 'todo' | 'doing' | 'done' | 'soon'
type JourneyStep = {
  key: 'learnGerman' | 'find' | 'visa'
  icon: string
  href: string
  status: JourneyStatus
}

export default function Dashboard() {
  const ctx = useShell()
  const t = useTranslations('dashboard')
  const [path, setPath] = useState<PathKey>('ausbildung')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rihla_dash_path') as PathKey | null
      if (saved === 'ausbildung' || saved === 'studium') setPath(saved)
    } catch {}
  }, [])

  function selectPath(p: PathKey) {
    setPath(p)
    try { localStorage.setItem('rihla_dash_path', p) } catch {}
  }

  const journey = useMemo<JourneyStep[]>(() => {
    const isAus = path === 'ausbildung'
    return [
      { key: 'learnGerman', icon: '📚', href: '/dashboard/learn-german', status: 'doing' },
      { key: 'find', icon: isAus ? '🔍' : '🎓', href: isAus ? '/dashboard/browse' : '/universities', status: isAus ? 'todo' : 'soon' },
      { key: 'visa', icon: '🛂', href: isAus ? '/visa/ausbildung' : '/visa/studium', status: 'todo' },
    ]
  }, [path])

  const displayName = useMemo(() => {
    const meta = ctx.user?.user_metadata ?? {}
    if (meta.first_name) return meta.first_name
    if (meta.full_name) return String(meta.full_name).split(' ')[0]
    if (meta.name) return String(meta.name).split(' ')[0]
    if (ctx.user?.email) return ctx.user.email.split('@')[0]
    return ''
  }, [ctx.user])

  const recentDocs = ctx.docs.slice(0, 3)
  const pct = ctx.completionPct

  return (
    <div className="dashpage">
      {/* Welcome strip */}
      <div className="dash-welcome">
        <div>
          <span className="eyebrow"><span className="eyebrow-dot" />{t('welcomeBack')}</span>
          <h1 className="dash-welcome-title">{t('greeting', { name: displayName })}</h1>
          <p className="dash-welcome-sub">{t('subtitle')}</p>
        </div>
        <div className="dash-path-switch" role="tablist" aria-label={t('path.label')}>
          <button type="button" role="tab" aria-selected={path === 'ausbildung'}
            onClick={() => selectPath('ausbildung')}
            className={`dash-path-pill ${path === 'ausbildung' ? 'is-active' : ''}`} data-c="brand">
            🔧 {t('path.ausbildung')}
          </button>
          <button type="button" role="tab" aria-selected={path === 'studium'}
            onClick={() => selectPath('studium')}
            className={`dash-path-pill ${path === 'studium' ? 'is-active' : ''}`} data-c="teal">
            🎓 {t('path.studium')}
          </button>
        </div>
      </div>

      <div className="dash-grid">
        {/* Profile completion (percentage only) */}
        <article className={`dash-card dash-card-profile ${pct >= 100 ? 'is-complete' : ''}`}>
          <div className="dash-card-head">
            <h2>{t('profile.title')}</h2>
            <Link href="/dashboard/profile" className="dash-card-link">
              {t('cta.profile')} →
            </Link>
          </div>
          <div className="dash-progress-ring" style={{ ['--pct' as any]: pct }}>
            <div className="dash-progress-inner">
              <span className="dash-progress-num">{pct}<small>%</small></span>
            </div>
          </div>
          {pct === 100 && <p className="dash-complete">{t('profile.complete')}</p>}
        </article>

        {/* Journey */}
        <article className="dash-card dash-card-journey">
          <div className="dash-card-head">
            <h2>{t('journey.title')}</h2>
          </div>
          <div className="dash-journey">
            {journey.map((step, i) => (
              <JourneyStepCard key={step.key} step={step}
                num={String(i + 1).padStart(2, '0')}
                path={path}
                statusLabel={t(`journey.status.${step.status}`)}
              />
            ))}
          </div>
        </article>

        {/* Docs */}
        <article className="dash-card dash-card-docs">
          <div className="dash-card-head">
            <h2>{t('docs.title')}</h2>
            <Link href="/profile" className="dash-card-link">{t('docs.viewAll')} →</Link>
          </div>
          {recentDocs.length === 0 ? (
            <div className="dash-docs-empty">
              <div className="dash-docs-empty-icon">📭</div>
              <p>{t('docs.empty')}</p>
            </div>
          ) : (
            <>
              <p className="dash-docs-count">{t('docs.count', { n: ctx.docs.length })}</p>
              <ul className="dash-docs-list">
                {recentDocs.map(d => {
                  const label = DOC_TYPE_LABELS[d.doc_type] ?? { icon: '📄', de: d.doc_type, ar: '' }
                  return (
                    <li key={d.id}>
                      <span className="dash-doc-icon">{label.icon}</span>
                      <span className="dash-doc-title">{d.title}</span>
                      <span className="dash-doc-type">{label.de}</span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </article>

        {/* Tools */}
        <article className="dash-card dash-card-tools">
          <div className="dash-card-head">
            <h2>{t('tools.title')}</h2>
          </div>
          <div className="dash-tools">
            <Link href="/dashboard/cv-builder" className="dash-tool" data-c="brand">
              <div className="dash-tool-icon">📄</div>
              <div>
                <h3>{t('tools.cv')}</h3>
                <p>{t('tools.cvDesc')}</p>
              </div>
              <span className="dash-tool-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/dashboard/cover-letter" className="dash-tool" data-c="teal">
              <div className="dash-tool-icon">✍️</div>
              <div>
                <h3>{t('tools.letter')}</h3>
                <p>{t('tools.letterDesc')}</p>
              </div>
              <span className="dash-tool-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}

function JourneyStepCard({
  step, num, path, statusLabel,
}: {
  step: JourneyStep
  num: string
  path: PathKey
  statusLabel: string
}) {
  const t = useTranslations(`landing.pathHub.${path}.pillars.${step.key}`)
  return (
    <Link href={step.href as any}
      className={`dash-step status-${step.status}`}
      data-c={path === 'ausbildung' ? 'brand' : 'teal'}>
      <span className="dash-step-num">{num}</span>
      <div className="dash-step-icon">{step.icon}</div>
      <div className="dash-step-body">
        <h3>{t('title')}</h3>
        <p>{t('desc')}</p>
        <span className={`dash-step-status status-${step.status}`}>{statusLabel}</span>
      </div>
      <span className="dash-step-arrow" aria-hidden>→</span>
    </Link>
  )
}
