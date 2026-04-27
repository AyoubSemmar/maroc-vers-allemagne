'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import UniLogo from './UniLogo'
import SaveButton from '@/components/SaveButton'
import type { UniversityRow } from './UniversitiesClient'

const TYPE_LABEL_KEYS: Record<string, string> = {
  university: 'typeUniversity',
  applied_sciences: 'typeAppliedSciences',
  technical: 'typeTechnical',
  art: 'typeArt',
  music: 'typeMusic',
  medical: 'typeMedical',
  pedagogical: 'typePedagogical',
  theological: 'typeTheological',
  dual: 'typeDual',
}

type Props = {
  uni: UniversityRow
  locale: string
  onClose: () => void
}

export default function UniModal({ uni, locale, onClose }: Props) {
  const t = useTranslations('universities')
  const td = useTranslations('universities.detail')

  // Body scroll lock + Esc-to-close.
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = orig
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="uni-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="uni-modal" role="dialog" aria-modal="true" aria-label={uni.name}>
        <button type="button" className="uni-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="uni-modal-head">
          <div className="uni-modal-logo" aria-hidden>
            <UniLogo src={uni.logoUrl} fallback={uni.name.charAt(0)} fallbackClassName="uni-modal-logo-fallback" />
          </div>
          <div className="uni-modal-headline">
            <h2 className="uni-modal-title">{uni.name}</h2>
            <div className="uni-modal-meta">
              {uni.city && <span>📍 {uni.city}{uni.state ? `, ${uni.state}` : ''}</span>}
              {uni.type && (
                <span className="uni-modal-type">
                  {t(TYPE_LABEL_KEYS[uni.type] ?? 'typeUniversity')}
                </span>
              )}
              {uni.founded && <span>{td('founded')}: {uni.founded}</span>}
              {uni.studentCount && <span>{t('students', { n: uni.studentCount.toLocaleString(locale) })}</span>}
            </div>
          </div>
        </div>

        {uni.website && (
          <a
            href={uni.website}
            target="_blank"
            rel="noopener noreferrer"
            className="uni-website-cta"
          >
            <div className="uni-website-cta-text">
              <span className="uni-website-cta-label">{td('officialWebsite')}</span>
              <span className="uni-website-cta-url">
                {uni.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            </div>
            <span className="uni-website-cta-arrow" aria-hidden>↗</span>
          </a>
        )}

        <div className="uni-modal-actions">
          <SaveButton itemType="university" itemId={uni.id} />
        </div>
      </div>
    </div>
  )
}
