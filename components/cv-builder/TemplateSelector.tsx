'use client'

import { TEMPLATES, TemplateId, TemplateMeta } from './types'

type Props = {
  selected: TemplateId
  onSelect: (id: TemplateId) => void
  onPremiumClick: (tpl: TemplateMeta) => void
  isPremiumUnlocked: boolean
}

export default function TemplateSelector({ selected, onSelect, onPremiumClick, isPremiumUnlocked }: Props) {
  return (
    <div className="rihla-cvb-tpl-grid">
      {TEMPLATES.map(t => {
        const locked = t.isPremium && !isPremiumUnlocked
        const active = selected === t.id
        return (
          <button
            type="button"
            key={t.id}
            className={`rihla-cvb-tpl-card${active ? ' active' : ''}${locked ? ' locked' : ''}`}
            onClick={() => {
              if (locked) onPremiumClick(t)
              else onSelect(t.id)
            }}
          >
            <div className="rihla-cvb-tpl-thumb" style={{ background: t.accentColor }}>
              <TemplateThumbPreview id={t.id} />
              {locked && <span className="rihla-cvb-lock">🔒</span>}
              {active && <span className="rihla-cvb-active-badge">✓</span>}
            </div>
            <div className="rihla-cvb-tpl-meta">
              <strong>{t.nameAr}</strong>
              <small>{t.name}</small>
              <p>{t.description}</p>
              {t.isPremium && <span className="rihla-cvb-premium-badge">Premium</span>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/** Simple schematic thumbnail — no real rendering for performance. */
function TemplateThumbPreview({ id }: { id: TemplateId }) {
  const common: React.CSSProperties = {
    background: '#fff',
    width: '80%',
    height: '85%',
    borderRadius: 3,
    padding: 6,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  }
  const line = (w: string, h = 3, c = '#999') => (
    <div style={{ width: w, height: h, background: c, borderRadius: 1 }} />
  )

  switch (id) {
    case 'modern':
      return (
        <div style={{ ...common, flexDirection: 'row', padding: 0 }}>
          <div style={{ width: '35%', background: '#2563eb', padding: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.4)', margin: '4px auto' }} />
            {line('80%', 2, 'rgba(255,255,255,0.6)')}
            {line('60%', 2, 'rgba(255,255,255,0.4)')}
            {line('70%', 2, 'rgba(255,255,255,0.4)')}
          </div>
          <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {line('80%', 4, '#2563eb')}
            {line('40%', 2)}
            <div style={{ height: 2 }} />
            {line('30%', 2, '#2563eb')}
            {line('85%', 2)}
            {line('75%', 2)}
          </div>
        </div>
      )
    case 'dark':
      return (
        <div style={{ ...common, background: '#18181b', gap: 2 }}>
          {line('70%', 4, '#fff')}
          {line('40%', 2, '#f59e0b')}
          <div style={{ height: 2 }} />
          {line('30%', 2, '#f59e0b')}
          {line('90%', 2, '#71717a')}
          {line('85%', 2, '#71717a')}
          {line('70%', 2, '#71717a')}
        </div>
      )
    case 'minimal':
      return (
        <div style={{ ...common, gap: 3, padding: 10 }}>
          {line('55%', 4)}
          {line('35%', 2, '#94a3b8')}
          <div style={{ height: 4 }} />
          {line('20%', 2)}
          {line('90%', 2, '#cbd5e1')}
          {line('80%', 2, '#cbd5e1')}
          {line('85%', 2, '#cbd5e1')}
        </div>
      )
    case 'compact':
      return (
        <div style={{ ...common, gap: 2 }}>
          {line('60%', 4, '#dc2626')}
          {line('40%', 2)}
          <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {line('100%', 2, '#dc2626')}
              {line('95%', 2)}
              {line('90%', 2)}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {line('100%', 2, '#dc2626')}
              {line('80%', 2)}
              {line('70%', 2)}
            </div>
          </div>
        </div>
      )
    case 'classic':
    default:
      return (
        <div style={{ ...common, gap: 3 }}>
          {line('55%', 4)}
          <div style={{ width: '100%', height: 1, background: '#111' }} />
          {line('25%', 2)}
          {line('90%', 2)}
          {line('80%', 2)}
          <div style={{ height: 2 }} />
          {line('25%', 2)}
          {line('88%', 2)}
          {line('82%', 2)}
        </div>
      )
  }
}
