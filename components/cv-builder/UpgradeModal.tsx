'use client'

import { useTranslations } from 'next-intl'
import { TemplateMeta } from './types'

type Props = {
  open: boolean
  template: TemplateMeta | null
  onClose: () => void
  onUnlock: () => void
}

export default function UpgradeModal({ open, template, onClose, onUnlock }: Props) {
  const t = useTranslations('cvBuilder.upgrade')
  const tTpl = useTranslations('cvBuilder.templates')
  if (!open || !template) return null
  const name = tTpl(`${template.id}.name`)
  // Split body around <strong>{name}</strong> marker
  const bodyRaw = t('body', { name: '___NAME___' })
  const parts = bodyRaw.split('<strong>___NAME___</strong>')
  return (
    <div className="rihla-cvb-modal-overlay" onClick={onClose}>
      <div className="rihla-cvb-modal" onClick={e => e.stopPropagation()}>
        <button className="rihla-cvb-modal-close" onClick={onClose} aria-label={t('closeAria')}>×</button>
        <div className="rihla-cvb-modal-icon">🔒</div>
        <h3>{t('title')}</h3>
        <p>
          {parts[0]}
          <strong>{name}</strong>
          {parts[1] ?? ''}
        </p>
        <ul className="rihla-cvb-features">
          <li>{t('f1')}</li>
          <li>{t('f2')}</li>
          <li>{t('f3')}</li>
          <li>{t('f4')}</li>
        </ul>
        <div className="rihla-cvb-modal-actions">
          <button className="rihla-cvb-btn-primary" onClick={onUnlock}>
            {t('cta')}
          </button>
          <button className="rihla-cvb-btn-ghost" onClick={onClose}>
            {t('later')}
          </button>
        </div>
      </div>
    </div>
  )
}
