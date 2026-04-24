'use client'

import { CVData } from './types'
import { fileToBase64 } from './utils'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import PhotoEnhancer from './PhotoEnhancer'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepPersonalInfo({ data, update }: Props) {
  const t = useTranslations('cvBuilder.personal')
  const p = data.personalInfo
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof CVData['personalInfo']>(key: K, value: CVData['personalInfo'][K]) {
    update({ personalInfo: { ...p, [key]: value } })
  }

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2_000_000) { alert(t('photoTooLarge')); return }
    const b64 = await fileToBase64(f)
    set('profileImage', b64)
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">{t('title')}</h3>
      <p className="rihla-cvb-step-hint">{t('hint')}</p>

      <div className="rihla-cvb-avatar-row">
        <div className="rihla-cvb-avatar-preview">
          {p.profileImage
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={p.profileImage} alt="" />
            : <div className="rihla-cvb-avatar-placeholder">📷</div>
          }
        </div>
        <div>
          <button type="button" className="rihla-cvb-btn-secondary" onClick={() => fileRef.current?.click()}>
            {p.profileImage ? t('changePhoto') : t('uploadPhoto')}
          </button>
          {p.profileImage && (
            <button type="button" className="rihla-cvb-btn-ghost" onClick={() => set('profileImage', '')}>
              {t('delete')}
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={onImageChange} style={{ display: 'none' }} />
          <p className="rihla-cvb-hint-small">{t('photoHint')}</p>
        </div>
      </div>

      <PhotoEnhancer
        currentImage={p.profileImage}
        onAccept={(newImage) => set('profileImage', newImage)}
      />


      <div className="rihla-cvb-grid-2">
        <Field label={t('firstName')} de="Vorname">
          <input className="rihla-cvb-input" value={p.firstName} onChange={e => set('firstName', e.target.value)} />
        </Field>
        <Field label={t('lastName')} de="Nachname">
          <input className="rihla-cvb-input" value={p.lastName} onChange={e => set('lastName', e.target.value)} />
        </Field>
        <Field label={t('jobTitle')} de="Berufsbezeichnung">
          <input className="rihla-cvb-input" value={p.jobTitle} onChange={e => set('jobTitle', e.target.value)}
            placeholder={t('jobTitlePh')} />
        </Field>
        <Field label={t('nationality')} de="Nationalität">
          <input className="rihla-cvb-input" value={p.nationality} onChange={e => set('nationality', e.target.value)}
            placeholder="Marokkanisch" />
        </Field>
        <Field label={t('dob')} de="Geburtsdatum">
          <input type="date" className="rihla-cvb-input" value={p.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
        </Field>
        <Field label={t('pob')} de="Geburtsort">
          <input className="rihla-cvb-input" value={p.placeOfBirth} onChange={e => set('placeOfBirth', e.target.value)} />
        </Field>
        <Field label={t('email')} de="E-Mail">
          <input type="email" className="rihla-cvb-input" value={p.email} onChange={e => set('email', e.target.value)} />
        </Field>
        <Field label={t('phone')} de="Telefon">
          <input className="rihla-cvb-input" value={p.phone} onChange={e => set('phone', e.target.value)}
            placeholder="+49 ..." />
        </Field>
        <Field label={t('address')} de="Straße / Hausnummer">
          <input className="rihla-cvb-input" value={p.address} onChange={e => set('address', e.target.value)} />
        </Field>
        <Field label={t('postal')} de="PLZ">
          <input className="rihla-cvb-input" value={p.postalCode} onChange={e => set('postalCode', e.target.value)} />
        </Field>
        <Field label={t('city')} de="Ort">
          <input className="rihla-cvb-input" value={p.city} onChange={e => set('city', e.target.value)} />
        </Field>
      </div>

      <div className="rihla-cvb-field" style={{ marginTop: 16 }}>
        <span className="rihla-cvb-label">
          {t('careerGoal')} <span className="rihla-cvb-label-de">(Berufsziel)</span>
        </span>
        <textarea
          className="rihla-cvb-input"
          value={p.careerGoal}
          onChange={e => set('careerGoal', e.target.value)}
          rows={3}
          placeholder={t('careerGoalPh')}
        />
        <p className="rihla-cvb-hint-small">
          {t('careerGoalHint')}
        </p>
      </div>
    </div>
  )
}

function Field({ label, de, children }: { label: string; de: string; children: React.ReactNode }) {
  return (
    <label className="rihla-cvb-field">
      <span className="rihla-cvb-label">
        {label} <span className="rihla-cvb-label-de">({de})</span>
      </span>
      {children}
    </label>
  )
}
