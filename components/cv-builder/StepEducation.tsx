'use client'

import { CVData, EducationEntry } from './types'
import { useTranslations } from 'next-intl'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

const EMPTY: EducationEntry = {
  institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '',
}

export default function StepEducation({ data, update }: Props) {
  const t = useTranslations('cvBuilder.education')
  const list = data.education

  function add() {
    update({ education: [...list, { ...EMPTY }] })
  }
  function remove(i: number) {
    update({ education: list.filter((_, idx) => idx !== i) })
  }
  function change(i: number, patch: Partial<EducationEntry>) {
    update({ education: list.map((e, idx) => idx === i ? { ...e, ...patch } : e) })
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">{t('title')}</h3>
      <p className="rihla-cvb-step-hint">{t('hint')}</p>

      {list.length === 0 && (
        <div className="rihla-cvb-empty">
          <p>{t('empty')}</p>
        </div>
      )}

      {list.map((e, i) => (
        <div key={i} className="rihla-cvb-card">
          <div className="rihla-cvb-card-head">
            <strong>{t('entry', { n: i + 1 })}</strong>
            <button type="button" className="rihla-cvb-btn-danger" onClick={() => remove(i)}>{t('remove')}</button>
          </div>
          <div className="rihla-cvb-grid-2">
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('institution')} <span className="rihla-cvb-label-de">(Institution)</span></span>
              <input className="rihla-cvb-input" value={e.institution} onChange={ev => change(i, { institution: ev.target.value })} placeholder="TU Berlin" />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('degree')} <span className="rihla-cvb-label-de">(Abschluss)</span></span>
              <input className="rihla-cvb-input" value={e.degree} onChange={ev => change(i, { degree: ev.target.value })} placeholder="Bachelor / Master / Abitur" />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('field')} <span className="rihla-cvb-label-de">(Fachrichtung)</span></span>
              <input className="rihla-cvb-input" value={e.fieldOfStudy} onChange={ev => change(i, { fieldOfStudy: ev.target.value })} placeholder="Informatik" />
            </label>
            <div />
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('start')} <span className="rihla-cvb-label-de">(von)</span></span>
              <input type="month" className="rihla-cvb-input" value={e.startDate} onChange={ev => change(i, { startDate: ev.target.value })} />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('endLabel')} <span className="rihla-cvb-label-de">(bis — {t('endHint')})</span></span>
              <input type="month" className="rihla-cvb-input" value={e.endDate} onChange={ev => change(i, { endDate: ev.target.value })} />
            </label>
            <label className="rihla-cvb-field rihla-cvb-field-full">
              <span className="rihla-cvb-label">{t('desc')} <span className="rihla-cvb-label-de">(Beschreibung)</span></span>
              <textarea className="rihla-cvb-input" rows={3} value={e.description} onChange={ev => change(i, { description: ev.target.value })}
                placeholder={t('descPh')} />
            </label>
          </div>
        </div>
      ))}

      <button type="button" className="rihla-cvb-btn-add" onClick={add}>
        {t('add')}
      </button>
    </div>
  )
}
