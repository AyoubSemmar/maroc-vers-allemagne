'use client'

import { TemplateMeta } from './types'

type Props = {
  open: boolean
  template: TemplateMeta | null
  onClose: () => void
  onUnlock: () => void
}

export default function UpgradeModal({ open, template, onClose, onUnlock }: Props) {
  if (!open || !template) return null
  return (
    <div className="rihla-cvb-modal-overlay" onClick={onClose}>
      <div className="rihla-cvb-modal" onClick={e => e.stopPropagation()}>
        <button className="rihla-cvb-modal-close" onClick={onClose} aria-label="إغلاق">×</button>
        <div className="rihla-cvb-modal-icon">🔒</div>
        <h3>قالب مميّز</h3>
        <p>
          قالب <strong>{template.nameAr}</strong> متاح فقط مع الترقية.
          يمكنك معاينته الآن، لكن التحميل كـ PDF يتطلب اشتراكاً.
        </p>
        <ul className="rihla-cvb-features">
          <li>✓ وصول لكل القوالب الخمسة</li>
          <li>✓ تحميل PDF بجودة عالية بلا حد</li>
          <li>✓ تحديثات مستقبلية وقوالب جديدة</li>
          <li>✓ دعم أولوية</li>
        </ul>
        <div className="rihla-cvb-modal-actions">
          <button className="rihla-cvb-btn-primary" onClick={onUnlock}>
            ترقية الآن — 4.99€
          </button>
          <button className="rihla-cvb-btn-ghost" onClick={onClose}>
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  )
}
