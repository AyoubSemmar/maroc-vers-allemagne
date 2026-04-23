'use client'

import { CVData, EducationEntry } from './types'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

const EMPTY: EducationEntry = {
  institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', description: '',
}

export default function StepEducation({ data, update }: Props) {
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
      <h3 className="rihla-cvb-step-title">التعليم والتكوين</h3>
      <p className="rihla-cvb-step-hint">أضف جميع شهاداتك الأكاديمية — من الأحدث إلى الأقدم.</p>

      {list.length === 0 && (
        <div className="rihla-cvb-empty">
          <p>لم تُضف أي شهادة بعد.</p>
        </div>
      )}

      {list.map((e, i) => (
        <div key={i} className="rihla-cvb-card">
          <div className="rihla-cvb-card-head">
            <strong>شهادة #{i + 1}</strong>
            <button type="button" className="rihla-cvb-btn-danger" onClick={() => remove(i)}>حذف</button>
          </div>
          <div className="rihla-cvb-grid-2">
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">المؤسسة <span className="rihla-cvb-label-de">(Institution)</span></span>
              <input className="rihla-cvb-input" value={e.institution} onChange={ev => change(i, { institution: ev.target.value })} placeholder="TU Berlin" />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">الدرجة العلمية <span className="rihla-cvb-label-de">(Abschluss)</span></span>
              <input className="rihla-cvb-input" value={e.degree} onChange={ev => change(i, { degree: ev.target.value })} placeholder="Bachelor / Master / Abitur" />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">التخصص <span className="rihla-cvb-label-de">(Fachrichtung)</span></span>
              <input className="rihla-cvb-input" value={e.fieldOfStudy} onChange={ev => change(i, { fieldOfStudy: ev.target.value })} placeholder="Informatik" />
            </label>
            <div />
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">تاريخ البدء <span className="rihla-cvb-label-de">(von)</span></span>
              <input type="month" className="rihla-cvb-input" value={e.startDate} onChange={ev => change(i, { startDate: ev.target.value })} />
            </label>
            <label className="rihla-cvb-field">
              <span className="rihla-cvb-label">تاريخ الانتهاء <span className="rihla-cvb-label-de">(bis — اتركه فارغاً لـ &quot;حتى الآن&quot;)</span></span>
              <input type="month" className="rihla-cvb-input" value={e.endDate} onChange={ev => change(i, { endDate: ev.target.value })} />
            </label>
            <label className="rihla-cvb-field rihla-cvb-field-full">
              <span className="rihla-cvb-label">تفاصيل إضافية <span className="rihla-cvb-label-de">(Beschreibung)</span></span>
              <textarea className="rihla-cvb-input" rows={3} value={e.description} onChange={ev => change(i, { description: ev.target.value })}
                placeholder="معدل التخرج، مواضيع البحث، المشاريع..." />
            </label>
          </div>
        </div>
      ))}

      <button type="button" className="rihla-cvb-btn-add" onClick={add}>
        + إضافة شهادة جديدة
      </button>
    </div>
  )
}
