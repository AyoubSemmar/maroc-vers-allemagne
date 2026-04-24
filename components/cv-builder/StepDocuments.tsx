'use client'

import { CVData, DocumentFile } from './types'
import { fileToBase64 } from './utils'
import { uploadDocument, deleteDocument, type DocumentType, type UserDocument } from '@/lib/documents'
import { useTranslations } from 'next-intl'

type Props = {
  data: CVData
  update: (patch: Partial<CVData> | ((prev: CVData) => Partial<CVData>)) => void
}

type CategoryKey = keyof CVData['documents']

const CATEGORIES: { key: CategoryKey; de: string; docType: DocumentType }[] = [
  { key: 'certificates',         de: 'Zeugnisse',         docType: 'arbeitsbescheinigung' },
  { key: 'diploma',              de: 'Diplome',           docType: 'akademisches_zertifikat' },
  { key: 'languageCertificates', de: 'Sprachzertifikate', docType: 'sprachzertifikat' },
  { key: 'optionalCoverLetter',  de: 'Anschreiben',       docType: 'motivationsschreiben' },
]

// Stable client-side id per newly added file so we can patch the right row
// regardless of array reordering or concurrent uploads.
type LocalDoc = DocumentFile & { _tmpId?: string }

function newTmpId() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function StepDocuments({ data, update }: Props) {
  const t = useTranslations('cvBuilder.documents')

  function patchDocByTmpId(key: CategoryKey, tmpId: string, patch: Partial<DocumentFile>) {
    update(prev => ({
      documents: {
        ...prev.documents,
        [key]: prev.documents[key].map((d) =>
          (d as LocalDoc)._tmpId === tmpId ? { ...d, ...patch } : d
        ),
      },
    }))
  }

  async function onAdd(key: CategoryKey, files: FileList | null) {
    if (!files) return
    const category = CATEGORIES.find(c => c.key === key)
    if (!category) return

    const prepared: { file: File; entry: LocalDoc }[] = []
    for (const f of Array.from(files)) {
      if (f.size > 4_000_000) { alert(t('tooLarge', { name: f.name })); continue }
      const dataUrl = await fileToBase64(f)
      prepared.push({
        file: f,
        entry: {
          _tmpId: newTmpId(),
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl,
          uploading: true,
        },
      })
    }
    if (prepared.length === 0) return

    update(prev => ({
      documents: {
        ...prev.documents,
        [key]: [...prev.documents[key], ...prepared.map(p => p.entry)],
      },
    }))

    prepared.forEach(async ({ file, entry }) => {
      try {
        const saved = await uploadDocument(file, file.name, category.docType)
        patchDocByTmpId(key, entry._tmpId!, {
          uploading: false,
          savedId: saved.id,
          storagePath: saved.file_path ?? undefined,
          storageUrl: saved.file_url ?? undefined,
        })
      } catch (e: any) {
        console.error('[cv-builder] doc upload failed:', e)
        patchDocByTmpId(key, entry._tmpId!, {
          uploading: false,
          uploadError: e?.message || t('saveError'),
        })
      }
    })
  }

  async function remove(key: CategoryKey, i: number) {
    const target = data.documents[key][i]
    if (!target) return
    if (!confirm(t('confirmDelete', { name: target.name }))) return

    update(prev => ({
      documents: {
        ...prev.documents,
        [key]: prev.documents[key].filter((_, idx) => idx !== i),
      },
    }))

    if (target.savedId) {
      try {
        await deleteDocument({
          id: target.savedId,
          user_id: '',
          doc_type: CATEGORIES.find(c => c.key === key)!.docType,
          source: 'upload',
          title: target.name,
          file_path: target.storagePath ?? null,
          file_url: target.storageUrl ?? null,
          created_at: '',
        } as UserDocument)
      } catch (e) {
        console.error('[cv-builder] delete document failed:', e)
      }
    }
  }

  return (
    <div className="rihla-cvb-step">
      <h3 className="rihla-cvb-step-title">{t('title')}</h3>
      <p className="rihla-cvb-step-hint">
        {t('hint')}
      </p>

      {CATEGORIES.map(({ key, de }) => (
        <div key={key} className="rihla-cvb-doc-group">
          <div className="rihla-cvb-doc-head">
            <strong>{t(`cat.${key}`)}</strong>
            <span className="rihla-cvb-label-de">({de})</span>
          </div>

          <label className="rihla-cvb-upload-zone">
            <input type="file" multiple accept="image/*,application/pdf"
              onChange={e => { onAdd(key, e.target.files); e.target.value = '' }}
              style={{ display: 'none' }}
            />
            <span>{t('choose')}</span>
            <small>{t('limit')}</small>
          </label>

          {data.documents[key].length > 0 && (
            <ul className="rihla-cvb-doc-list">
              {data.documents[key].map((f, i) => (
                <li key={(f as LocalDoc)._tmpId ?? f.savedId ?? i}>
                  <span>📄 {f.name}</span>
                  {f.size > 0 && <small>{(f.size / 1024).toFixed(0)} KB</small>}
                  {f.uploading && (
                    <small style={{ color: 'var(--ink-mute)' }}>{t('saving')}</small>
                  )}
                  {!f.uploading && f.savedId && (
                    <small style={{ color: '#059669' }}>{t('saved')}</small>
                  )}
                  {!f.uploading && f.uploadError && (
                    <small style={{ color: '#dc2626' }} title={f.uploadError}>{t('saveFailed')}</small>
                  )}
                  <button type="button" onClick={() => remove(key, i)}>{t('remove')}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
