'use client'

import { CVData } from './types'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

export default function StepSkills({ data, update }: Props) {
  const t = useTranslations('cvBuilder.skills')
  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">{t('title')}</h3>
      <p className="rihla-cvb-step-hint">{t('hint')}</p>

      <TagGroup
        label={t('technical')}
        de="Fachkenntnisse"
        placeholder={t('technicalPh')}
        inputHint={t('inputHint')}
        tags={data.skills.technical}
        onChange={technical => update({ skills: { ...data.skills, technical } })}
      />

      <TagGroup
        label={t('soft')}
        de="Soft Skills"
        placeholder={t('softPh')}
        inputHint={t('inputHint')}
        tags={data.skills.soft}
        onChange={soft => update({ skills: { ...data.skills, soft } })}
      />
    </div>
  )
}

function TagGroup({
  label, de, placeholder, inputHint, tags, onChange,
}: {
  label: string; de: string; placeholder: string; inputHint: string; tags: string[]; onChange: (t: string[]) => void
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
      <p className="rihla-cvb-hint-small">{inputHint}</p>
    </div>
  )
}
