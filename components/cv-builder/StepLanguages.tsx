'use client'

import { CVData, LANGUAGE_LEVELS, LanguageEntry } from './types'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepLanguages({ data, update }: Props) {
  const list = data.languages

  function add() { update({ languages: [...list, { language: '', level: 'B1' }] }) }
  function remove(i: number) { update({ languages: list.filter((_, idx) => idx !== i) }) }
  function change(i: number, patch: Partial<LanguageEntry>) {
    update({ languages: list.map((e, idx) => idx === i ? { ...e, ...patch } : e) })
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">اللغات</h3>
      <p className="rihla-cvb-step-hint">المستوى وفق الإطار الأوروبي المشترك (CEFR): A1 مبتدئ — C2 إتقان كامل.</p>

      {list.length === 0 && (
        <div className="rihla-cvb-empty"><p>لم تُضف أي لغة بعد.</p></div>
      )}

      {list.map((l, i) => (
        <div key={i} className="rihla-cvb-lang-row">
          <input
            className="rihla-cvb-input"
            placeholder="Deutsch / English / العربية..."
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
                {lv} {lv === 'A1' ? '— مبتدئ' : lv === 'A2' ? '— أساسي' : lv === 'B1' ? '— متوسط' : lv === 'B2' ? '— جيد' : lv === 'C1' ? '— متقدم' : lv === 'C2' ? '— إتقان' : '— لغة أم'}
              </option>
            ))}
          </select>
          <button type="button" className="rihla-cvb-btn-danger" onClick={() => remove(i)}>×</button>
        </div>
      ))}

      <button type="button" className="rihla-cvb-btn-add" onClick={add}>
        + إضافة لغة
      </button>
    </div>
  )
}
