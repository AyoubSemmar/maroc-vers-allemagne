'use client'

import { CVData } from './types'
import { useState } from 'react'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepSkills({ data, update }: Props) {
  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">المهارات</h3>
      <p className="rihla-cvb-step-hint">أضف المهارات التقنية والشخصية — اضغط Enter أو فاصلة لإضافة كل مهارة.</p>

      <TagGroup
        label="المهارات التقنية"
        de="Fachkenntnisse"
        placeholder="JavaScript, Python, SAP, Excel..."
        tags={data.skills.technical}
        onChange={technical => update({ skills: { ...data.skills, technical } })}
      />

      <TagGroup
        label="المهارات الشخصية"
        de="Soft Skills"
        placeholder="Teamarbeit, Zuverlässigkeit, Kommunikation..."
        tags={data.skills.soft}
        onChange={soft => update({ skills: { ...data.skills, soft } })}
      />
    </div>
  )
}

function TagGroup({
  label, de, placeholder, tags, onChange,
}: {
  label: string; de: string; placeholder: string; tags: string[]; onChange: (t: string[]) => void
}) {
  const [input, setInput] = useState('')

  function addTag(raw: string) {
    const t = raw.trim().replace(/,$/, '').trim()
    if (!t) return
    if (tags.includes(t)) return
    onChange([...tags, t])
    setInput('')
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="rihla-cvb-taggroup">
      <span className="rihla-cvb-label">
        {label} <span className="rihla-cvb-label-de">({de})</span>
      </span>
      <div className="rihla-cvb-tag-input-wrap">
        {tags.map((t, i) => (
          <span key={i} className="rihla-cvb-tag">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((_, idx) => idx !== i))}>×</button>
          </span>
        ))}
        <input
          className="rihla-cvb-tag-input"
          placeholder={tags.length === 0 ? placeholder : ''}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => addTag(input)}
        />
      </div>
      <p className="rihla-cvb-hint-small">اضغط Enter أو , لإضافة مهارة · اضغط Backspace لحذف آخر مهارة</p>
    </div>
  )
}
