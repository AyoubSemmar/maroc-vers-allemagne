'use client'

import { CVData, LANGUAGE_LEVELS, LanguageEntry } from './types'
import { useTranslations } from 'next-intl'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepLanguages({ data, update }: Props) {
  const t = useTranslations('cvBuilder.languages')
  const list = data.languages

  function add() { update({ languages: [...list, { language: '', level: 'B1' }] }) }
  function remove(i: number) { update({ languages: list.filter((_, idx) => idx !== i) }) }
  function change(i: number, patch: Partial<LanguageEntry>) {
    update({ languages: list.map((e, idx) => idx === i ? { ...e, ...patch } : e) })
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">{t('title')}</h3>
      <p className="rihla-cvb-step-hint">{t('hint')}</p>

      {list.length === 0 && (
        <div className="rihla-cvb-empty"><p>{t('empty')}</p></div>
      )}

      {list.map((l, i) => (
        <div key={i} className="rihla-cvb-lang-row">
          <input
            className="rihla-cvb-input"
            placeholder={t('placeholder')}
            value={l.language}
            onChange={e => change(i, { language: e.target.value })}
          />
          <select
            className="rihla-cvb-input rihla-cvb-select"
            value={l.level}
            onChange={e => change(i, { level: e.target.value as LanguageEntry['level'] })}
          >
            {LANGUAGE_LEVELS.map(lv => (
              <option key={lv} value={lv}>
                {lv} — {t(`level.${lv}`)}
              </option>
            ))}
          </select>
          <button type="button" className="rihla-cvb-btn-danger" onClick={() => remove(i)}>×</button>
        </div>
      ))}

      <button type="button" className="rihla-cvb-btn-add" onClick={add}>
        {t('add')}
      </button>
    </div>
  )
}
