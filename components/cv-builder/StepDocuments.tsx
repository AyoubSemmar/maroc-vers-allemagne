'use client'

import { CVData, DocumentFile } from './types'
import { fileToBase64 } from './utils'

type Props = {
  data: CVData
  update: (patch: Partial<CVData>) => void
}

const CATEGORIES: { key: keyof CVData['documents']; label: string; de: string }[] = [
  { key: 'certificates',         label: 'الشهادات العامة',   de: 'Zeugnisse' },
  { key: 'diploma',              label: 'الدبلومات',         de: 'Diplome' },
  { key: 'languageCertificates', label: 'شهادات اللغة',       de: 'Sprachzertifikate' },
  { key: 'optionalCoverLetter',  label: 'خطاب التقديم (اختياري)', de: 'Anschreiben' },
]

export default function StepDocuments({ data, update }: Props) {
  async function onAdd(key: keyof CVData['documents'], files: FileList | null) {
    if (!files) return
    const added: DocumentFile[] = []
    for (const f of Array.from(files)) {
      if (f.size > 4_000_000) { alert(`⚠ ${f.name} أكبر من 4MB — تم تخطيه`); continue }
      const dataUrl = await fileToBase64(f)
      added.push({ name: f.name, size: f.size, type: f.type, dataUrl })
    }
    update({ documents: { ...data.documents, [key]: [...data.documents[key], ...added] } })
  }

  function remove(key: keyof CVData['documents'], i: number) {
    update({ documents: { ...data.documents, [key]: data.documents[key].filter((_, idx) => idx !== i) } })
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">الوثائق المرفقة</h3>
      <p className="rihla-cvb-step-hint">
        ارفع نسخاً ممسوحة ضوئياً من شهاداتك — ستُستخدم كمراجع شخصية ولن تُضمّن تلقائياً في ملف PDF النهائي.
      </p>

      {CATEGORIES.map(({ key, label, de }) => (
        <div key={key} className="rihla-cvb-doc-group">
          <div className="rihla-cvb-doc-head">
            <strong>{label}</strong>
            <span className="rihla-cvb-label-de">({de})</span>
          </div>

          <label className="rihla-cvb-upload-zone">
            <input type="file" multiple accept="image/*,application/pdf"
              onChange={e => onAdd(key, e.target.files)}
              style={{ display: 'none' }}
            />
            <span>📎 اختر ملفات (PDF / صور)</span>
            <small>حد أقصى 4MB لكل ملف</small>
          </label>

          {data.documents[key].length > 0 && (
            <ul className="rihla-cvb-doc-list">
              {data.documents[key].map((f, i) => (
                <li key={i}>
                  <span>📄 {f.name}</span>
                  <small>{(f.size / 1024).toFixed(0)} KB</small>
                  <button type="button" onClick={() => remove(key, i)}>حذف</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
