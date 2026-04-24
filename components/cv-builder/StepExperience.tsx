'use client'

import { CVData, ExperienceEntry } from './types'
import { useTranslations } from 'next-intl'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

const EMPTY: ExperienceEntry = {
  jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '',
}

export default function StepExperience({ data, update }: Props) {
  const t = useTranslations('cvBuilder.experience')
  const list = data.experience

  function add() { update({ experience: [...list, { ...EMPTY }] }) }
  function remove(i: number) { update({ experience: list.filter((_, idx) => idx !== i) }) }
  function change(i: number, patch: Partial<ExperienceEntry>) {
    update({ experience: list.map((e, idx) => idx === i ? { ...e, ...patch } : e) })
  }

  function onDescChange(i: number, raw: string) {
    change(i, { description: raw })
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
              <span className="rihla-cvb-label">{t('jobTitle')} <span className="rihla-cvb-label-de">(Position)</span></span>
              <input className="rihla-cvb-input" value={e.jobTitle} onChange={ev => change(i, { jobTitle: ev.target.value })} placeholder="Softwareentwickler" />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('company')} <span className="rihla-cvb-label-de">(Unternehmen)</span></span>
              <input className="rihla-cvb-input" value={e.company} onChange={ev => change(i, { company: ev.target.value })} placeholder="Siemens AG" />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">{t('location')} <span className="rihla-cvb-label-de">(Ort)</span></span>
              <input className="rihla-cvb-input" value={e.location} onChange={ev => change(i, { location: ev.target.value })} placeholder="München" />
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
              <span className="rihla-cvb-label">
                {t('tasks')} <span className="rihla-cvb-label-de">(Aufgaben / Erfolge)</span>
                <span className="rihla-cvb-hint-inline"> — {t('tasksHint')}</span>
              </span>
              <textarea
                className="rihla-cvb-input"
                rows={4}
                value={e.description}
                onChange={ev => onDescChange(i, ev.target.value)}
                placeholder={t('tasksPh')}
              />
              {e.description && (
                <div className="rihla-cvb-preview-bullets">
                  <span className="rihla-cvb-hint-small">{t('preview')}</span>
                  <ul>
                    {e.description
                      .split('\n')
                      .map(l => l.replace(/^[•\-\*\s]+/, '').trim())
                      .filter(Boolean)
                      .map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              )}
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
