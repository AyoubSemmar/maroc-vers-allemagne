'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'

export type FormState = {
  fullName: string
  ausbildungPosition: string
  gender: 'male' | 'female'
  background: string
  cvFile: File | null
}

type Props = {
  state: FormState
  onChange: (patch: Partial<FormState>) => void
  onSubmit: () => void
  loading: boolean
  canGenerate?: boolean
}

const MAX_BG = 1200

export default function AnschreibenForm({ state, onChange, onSubmit, loading, canGenerate = true }: Props) {
  const t = useTranslations('anschreiben.form')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form className="ansch-form-card" onSubmit={handleSubmit} noValidate>
      <h2 className="ansch-section-title">{t('section')}</h2>

      <div className="ansch-field">
        <label className="ansch-label">
          {t('fullName')} <span className="ansch-label-de">(Vollständiger Name)</span>
          <span className="ansch-required">*</span>
        </label>
        <input
          className="ansch-input"
          type="text"
          value={state.fullName}
          onChange={e => onChange({ fullName: e.target.value })}
          placeholder={t('fullNamePh')}
          required
        />
      </div>

      <div className="ansch-field">
        <label className="ansch-label">
          {t('gender')} <span className="ansch-label-de">(Geschlecht)</span>
          <span className="ansch-required">*</span>
        </label>
        <div className="ansch-gender-row">
          {(['male', 'female'] as const).map(g => (
            <button
              key={g}
              type="button"
              className={`ansch-gender-btn${state.gender === g ? ' active' : ''}`}
              onClick={() => onChange({ gender: g })}
            >
              {g === 'male' ? t('male') : t('female')}
            </button>
          ))}
        </div>
      </div>

      <div className="ansch-field">
        <label className="ansch-label">
          {t('position')} <span className="ansch-label-de">(Ausbildung Position)</span>
          <span className="ansch-required">*</span>
        </label>
        <input
          className="ansch-input"
          type="text"
          value={state.ausbildungPosition}
          onChange={e => onChange({ ausbildungPosition: e.target.value })}
          placeholder={t('positionPh')}
          required
        />
      </div>

      <div className="ansch-field">
        <label className="ansch-label">
          {t('background')}
          <span className="ansch-label-de"> (Hintergrund)</span>
          <span className="ansch-required">*</span>
        </label>
        <textarea
          className="ansch-input ansch-textarea"
          value={state.background}
          onChange={e => onChange({ background: e.target.value.slice(0, MAX_BG) })}
          rows={6}
          placeholder={t('backgroundPh')}
          required
        />
        <div className="ansch-char-count">
          <span className={state.background.length > MAX_BG * 0.9 ? 'ansch-char-warn' : ''}>
            {state.background.length}
          </span>
          /{MAX_BG}
        </div>
      </div>

      <div className="ansch-field">
        <label className="ansch-label">
          {t('cvLabel')} <span className="ansch-label-de">(Lebenslauf — optional)</span>
        </label>
        <div
          className={`ansch-upload-zone${state.cvFile ? ' has-file' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault()
            const f = e.dataTransfer.files[0]
            if (f?.type === 'application/pdf') onChange({ cvFile: f })
          }}
        >
          {state.cvFile ? (
            <div className="ansch-upload-done">
              <span>📄 {state.cvFile.name}</span>
              <button
                type="button"
                className="ansch-upload-remove"
                onClick={ev => { ev.stopPropagation(); onChange({ cvFile: null }); if (fileRef.current) fileRef.current.value = '' }}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="ansch-upload-icon">📎</div>
              <p>{t('cvDrop')} <span className="ansch-upload-link">{t('cvClick')}</span></p>
              <p className="ansch-hint-small">{t('cvHint')}</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0]
            if (!f) return
            if (f.type !== 'application/pdf') { alert(t('pdfOnly')); return }
            if (f.size > 5_000_000) { alert(t('tooLarge')); return }
            onChange({ cvFile: f })
          }}
        />
      </div>

      <button
        type="submit"
        className="ansch-btn-submit"
        disabled={loading || !canGenerate || !state.fullName.trim() || !state.ausbildungPosition.trim() || !state.background.trim()}
      >
        {loading ? (
          <><span className="ansch-spinner" /> {t('generating')}</>
        ) : !canGenerate ? (
          t('needCredit')
        ) : (
          t('generate')
        )}
      </button>
    </form>
  )
}
