'use client'

/**
 * Unified profile page — renders at both /dashboard/profile and /profile.
 * Combines the polished hero (completion %) with the actual functional
 * settings form (avatar, names, whatsapp, status, docs, listings, danger zone).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase-browser'
import {
  UserDocument, DocumentType,
  DOC_TYPE_LABELS, UPLOAD_TYPES,
  fetchDocuments, uploadDocument, deleteDocument,
} from '@/lib/documents'
import { STORAGE_KEY } from '@/components/cv-builder/utils'
import { useCourseAccess } from '@/lib/useCourseAccess'
import { CLASSES_ENABLED } from '@/lib/classes-flags'
import { useShell } from './DashShell'

const DATE_MARKER = '>>DATE>>'
const STATUS_IN_DE = 'في ألمانيا'
const STATUS_COMING = 'أحاول القدوم'

const LOCALE_TO_INTL: Record<AppLocale, string> = {
  ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE', es: 'es-ES',
  tr: 'tr-TR', fa: 'fa-IR', pt: 'pt-BR', ru: 'ru-RU', hi: 'hi-IN', ur: 'ur-PK', zh: 'zh-CN',
  uk: 'uk-UA', sq: 'sq-AL', id: 'id-ID',
}
function formatDate(iso: string, locale: AppLocale) {
  return new Date(iso).toLocaleDateString(LOCALE_TO_INTL[locale], {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function DashProfile() {
  const ctx = useShell()
  const locale = useLocale() as AppLocale
  const t = useTranslations('dashboard.profilePage')
  const tProf = useTranslations('profile')
  const router = useRouter()
  const supabase = createClient()
  const { hasAccess: hasCourseAccess } = useCourseAccess()


  // ── Editable state, seeded from shell context ─────────────────
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  // Single international phone field (E.164-ish): the user types their
  // full number incl. country code. Was a Morocco/Germany-only dropdown.
  const [phone, setPhone] = useState('')
  const [status, setStatus]       = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [phoneError, setPhoneError] = useState('')
  const [saveError, setSaveError]   = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  // Seed editable text fields from shell the first time data arrives.
  const seeded = useRef(false)
  useEffect(() => {
    if (seeded.current) return
    if (!ctx.user) return
    seeded.current = true
    const meta = ctx.user.user_metadata ?? {}
    setFirstName(meta.first_name || '')
    setLastName(meta.last_name || '')
    const prof = ctx.profile
    setStatus(prof?.status || '')
    if (prof?.whatsapp) {
      setPhone(prof.whatsapp)
    }
  }, [ctx.user, ctx.profile])

  // Keep avatarUrl synced with the profile from the shell so the preview reflects
  // what's actually persisted (after upload + ctx.refresh, or on hard reload).
  useEffect(() => {
    setAvatarUrl(ctx.profile?.avatar_url || '')
  }, [ctx.profile?.avatar_url])

  // ── Documents ─────────────────────────────────────────────────
  const [docs, setDocs] = useState<UserDocument[]>([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadType, setUploadType] = useState<DocumentType>('lebenslauf')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedLetter, setSelectedLetter] = useState<UserDocument | null>(null)
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setDocs(ctx.docs)
    setDocsLoading(false)
  }, [ctx.docs])

  // ── Delete account ────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  // ── Avatar upload ─────────────────────────────────────────────
  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !ctx.user) return
    if (file.size > 5_000_000) {
      setSaveError('Image too large (max 5MB)')
      return
    }
    setSaveError('')
    setUploadingAvatar(true)
    try {
      // Keep file extension so storage serves the right content-type.
      const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '')
      const filename = `${ctx.user.id}-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filename, file, { contentType: file.type, upsert: true, cacheControl: '3600' })
      if (error || !data) {
        setSaveError(`Avatar upload failed: ${error?.message || 'unknown error'}`)
        return
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path)
      const publicUrl = urlData.publicUrl
      setAvatarUrl(publicUrl)

      // Persist to profiles immediately so the sidebar % and avatar update on refresh.
      const { data: row, error: dbErr } = await supabase
        .from('profiles')
        .upsert({ user_id: ctx.user.id, avatar_url: publicUrl }, { onConflict: 'user_id' })
        .select('avatar_url')
        .single()
      if (dbErr) {
        setSaveError(`Avatar saved to storage but not linked: ${dbErr.message}`)
        return
      }
      if (!row || row.avatar_url !== publicUrl) {
        setSaveError('Avatar URL did not persist to the profiles table. Check that the avatar_url column exists and that RLS allows updates for the current user.')
        return
      }
      ctx.refresh()
      showToast(tProf('avatar.change'))
    } finally {
      setUploadingAvatar(false)
    }
  }

  // ── Phone validation ──────────────────────────────────────────
  function validatePhone(): boolean {
    if (!phone) return true
    // E.164: optional leading +, 7–15 digits. Works for any country.
    const digits = phone.replace(/\D/g, '')
    return digits.length >= 7 && digits.length <= 15
  }

  // ── Save ──────────────────────────────────────────────────────
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!ctx.user) return
    if (phone && !validatePhone()) {
      setPhoneError(tProf('whatsapp.errInvalid'))
      return
    }
    setPhoneError('')
    setSaveError('')
    setSaving(true)

    // Normalise to "+<digits>" so stored numbers are consistent E.164.
    const digits = phone.replace(/\D/g, '')
    const fullWhatsapp = digits ? `+${digits}` : ''
    const { data: saved, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: ctx.user.id,
        whatsapp: fullWhatsapp,
        status,
        avatar_url: avatarUrl,
      }, { onConflict: 'user_id' })
      .select('whatsapp, status, avatar_url')
      .single()
    if (error) { setSaveError(error.message); setSaving(false); return }
    if (!saved) {
      setSaveError('Save returned no row (likely a row-level security policy blocked it). Check the profiles RLS policies.')
      setSaving(false); return
    }
    // Sanity check: the columns we asked Postgres to write should equal what came back.
    const mismatch =
      (saved.whatsapp ?? '') !== fullWhatsapp ||
      (saved.status ?? '') !== status ||
      (saved.avatar_url ?? '') !== avatarUrl
    if (mismatch) {
      setSaveError('Profile row written but some columns did not persist (likely missing columns on the profiles table). Verify whatsapp / status / avatar_url columns exist.')
      setSaving(false); return
    }

    const first = firstName.trim()
    const last = lastName.trim()
    const { error: metaErr } = await supabase.auth.updateUser({
      data: {
        first_name: first,
        last_name:  last,
        full_name:  `${first} ${last}`.trim(),
      },
    })
    if (metaErr) { setSaveError(metaErr.message); setSaving(false); return }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    ctx.refresh()
  }

  // ── Documents handlers ────────────────────────────────────────
  async function handleDocUpload() {
    if (!uploadFile) { setUploadError(tProf('docs.pickFirst')); return }
    setUploading(true); setUploadError('')
    try {
      const label = DOC_TYPE_LABELS[uploadType]
      const title = `${label.ar} — ${uploadFile.name.replace(/\.[^.]+$/, '')}`
      const doc = await uploadDocument(uploadFile, title, uploadType)
      setDocs(prev => [doc, ...prev])
      setShowUpload(false)
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      showToast(tProf('docs.uploadSuccess'))
      ctx.refresh()
    } catch (e: any) {
      setUploadError(e?.message || tProf('docs.uploadErr'))
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteDoc(doc: UserDocument) {
    if (!confirm(tProf('docs.confirmDelete', { title: doc.title }))) return
    try {
      await deleteDocument(doc)
      setDocs(prev => prev.filter(d => d.id !== doc.id))
      showToast(tProf('docs.deleted'))
      ctx.refresh()
    } catch (e: any) {
      showToast('❌ ' + (e?.message || tProf('docs.deleteErr')))
    }
  }

  function handleOpenCv(doc: UserDocument) {
    if (!doc.cv_data) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(doc.cv_data))
      router.push('/dashboard/cv-builder')
    } catch {
      showToast(tProf('docs.openCvErr'))
    }
  }

  // ── Delete account ────────────────────────────────────────────
  async function handleDeleteAccount() {
    if (deleting) return
    setDeleting(true); setDeleteError('')
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: '' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      window.location.href = `/${locale}`
    } catch (e: any) {
      setDeleteError(e?.message || tProf('deleteAccount.genericErr'))
      setDeleting(false)
    }
  }

  // ── Derived display ───────────────────────────────────────────
  const userInitial = useMemo(() => {
    if (firstName.trim()) return firstName.trim().charAt(0).toUpperCase()
    if (ctx.user?.email) return ctx.user.email.charAt(0).toUpperCase()
    return '?'
  }, [firstName, ctx.user])

  return (
    <div className="dashpage" dir={dirFor(locale)}>
      {saveError && (
        <div className="dashprof-alert dashprof-alert-err">
          {tProf('errorPrefix')}{saveError}
        </div>
      )}

      {/* Live-class students: quick link to their graded course. Hidden while
          the live classes are unlisted (CLASSES_ENABLED=false). */}
      {CLASSES_ENABLED && hasCourseAccess && (
        <Link
          href="/learn-german/my-course"
          style={{
            display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
            border: '1px solid #bbf7d0', background: 'linear-gradient(90deg,#f0fdf4,#fff)',
            borderRadius: 16, padding: 16, marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 28 }}>📋</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: 'block', color: '#14532d' }}>{tProf('myCourseTitle')}</strong>
            <span style={{ fontSize: 13, color: '#16a34a' }}>{tProf('myCourseSubtitle')}</span>
          </span>
          <span style={{ background: '#16a34a', color: 'white', fontSize: 13, fontWeight: 600, borderRadius: 8, padding: '6px 14px' }}>{tProf('myCourseOpen')}</span>
        </Link>
      )}

      {/* SETTINGS FORM */}
      <form onSubmit={handleSave} className="dashprof-form">
        {/* Personal info */}
        <section className="dashprof-card">
          <header className="dashprof-card-head">
            <h2>{tProf('name.heading')}</h2>
          </header>

          <div className="dashprof-avatar-row">
            <div className="dashprof-avatar">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="dashprof-avatar-actions">
              <label className="dashprof-btn dashprof-btn-ghost">
                {uploadingAvatar ? tProf('avatar.uploading') : tProf('avatar.change')}
                <input type="file" accept="image/*" onChange={handleAvatar} className="sr-only" />
              </label>
              <p className="dashprof-mute">PNG / JPG · max 5MB</p>
            </div>
          </div>

          <div className="dashprof-grid2">
            <label className="dashprof-field">
              <span>{tProf('name.firstLabel')}</span>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder={tProf('name.firstPlaceholder')}
                maxLength={60}
              />
            </label>
            <label className="dashprof-field">
              <span>{tProf('name.lastLabel')}</span>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder={tProf('name.lastPlaceholder')}
                maxLength={60}
              />
            </label>
          </div>

          <div className="dashprof-field dashprof-field-readonly">
            <span>{tProf('email')}</span>
            <div className="dashprof-readonly">{ctx.user?.email}</div>
          </div>
        </section>

        {/* Contact & status */}
        <section className="dashprof-card">
          <header className="dashprof-card-head">
            <h2>{t('sections.contact')}</h2>
          </header>

          <label className="dashprof-field">
            <span>{tProf('whatsapp.label')}</span>
            <div className="dashprof-phone">
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setPhoneError('') }}
                className={phoneError ? 'has-error' : ''}
                inputMode="tel"
                maxLength={20}
                placeholder="+49 1512 345678"
              />
            </div>
            {phoneError && <p className="dashprof-err">{phoneError}</p>}
          </label>

          <div className="dashprof-field">
            <span>{tProf('status.label')}</span>
            <div className="dashprof-pills">
              <button
                type="button"
                onClick={() => setStatus(STATUS_IN_DE)}
                className={`dashprof-pill ${status === STATUS_IN_DE ? 'is-active' : ''}`}
                data-c="teal"
              >
                Germany {tProf('status.inDe')}
              </button>
              <button
                type="button"
                onClick={() => setStatus(STATUS_COMING)}
                className={`dashprof-pill ${status === STATUS_COMING ? 'is-active' : ''}`}
                data-c="brand"
              >
                you {tProf('status.coming')}
              </button>
            </div>
          </div>
        </section>

        <div className="dashprof-save-row">
          <button type="submit" className="dashprof-btn dashprof-btn-primary" disabled={saving}>
            {saving ? tProf('save.saving') : saved ? tProf('save.saved') : tProf('save.submit')}
          </button>
        </div>
      </form>

      {/* DOCUMENTS */}
      <section className="dashprof-card">
        <header className="dashprof-card-head">
          <h2>{tProf('docs.heading')}</h2>
          <button
            type="button"
            className="dashprof-btn dashprof-btn-ghost"
            onClick={() => { setShowUpload(v => !v); setUploadError('') }}
          >
            {showUpload ? tProf('docs.uploadClose') : tProf('docs.uploadOpen')}
          </button>
        </header>

        {showUpload && (
          <div className="dashprof-upload">
            <p className="dashprof-upload-title">{tProf('docs.formTitle')}</p>

            <label className="dashprof-field">
              <span>{tProf('docs.type')}</span>
              <select value={uploadType} onChange={e => setUploadType(e.target.value as DocumentType)}>
                {UPLOAD_TYPES.map(ty => (
                  <option key={ty} value={ty}>
                    {DOC_TYPE_LABELS[ty].icon} {DOC_TYPE_LABELS[ty].de} — {DOC_TYPE_LABELS[ty].ar}
                  </option>
                ))}
              </select>
            </label>

            <label className="dashprof-field">
              <span>{tProf('docs.fileLabel')}</span>
              <div
                className="dashprof-drop"
                onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setUploadFile(f) }}
              >
                {uploadFile ? (
                  <span className="dashprof-drop-file">📄 {uploadFile.name}</span>
                ) : (
                  <span>{tProf('docs.dropHint')} <span className="dashprof-drop-link">{tProf('docs.clickSelect')}</span></span>
                )}
              </div>
              <input
                ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="sr-only"
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  if (f.size > 8_000_000) { setUploadError(tProf('docs.sizeErr')); return }
                  setUploadFile(f); setUploadError('')
                }}
              />
            </label>

            {uploadError && <p className="dashprof-err">{uploadError}</p>}

            <button
              type="button"
              className="dashprof-btn dashprof-btn-primary"
              onClick={handleDocUpload}
              disabled={uploading || !uploadFile}
            >
              {uploading ? tProf('docs.uploading') : tProf('docs.uploadBtn')}
            </button>
          </div>
        )}

        {docsLoading ? (
          <p className="dashprof-mute dashprof-center">{tProf('docs.loading')}</p>
        ) : docs.length === 0 ? (
          <div className="dashprof-empty">
            <div className="dashprof-empty-icon">📭</div>
            <p className="dashprof-mute">{tProf('docs.emptyTitle')}</p>
            <p className="dashprof-empty-hint">
              {tProf('docs.emptyHint')}{' '}
              <Link href="/dashboard/cv-builder" className="dashprof-link">{tProf('docs.emptyCv')}</Link>{' '}
              {tProf('docs.emptyOr')}{' '}
              <Link href="/dashboard/cover-letter" className="dashprof-link">{tProf('docs.emptyLetter')}</Link>{' '}
              {tProf('docs.emptyOrUpload')}
            </p>
          </div>
        ) : (
          <ul className="dashprof-doc-list">
            {docs.map(doc => {
              const label = DOC_TYPE_LABELS[doc.doc_type] ?? { de: doc.doc_type, ar: '', icon: '📄' }
              return (
                <li key={doc.id} className="dashprof-doc">
                  <span className="dashprof-doc-icon" aria-hidden>{label.icon}</span>
                  <div className="dashprof-doc-body">
                    <p className="dashprof-doc-title">{doc.title}</p>
                    <div className="dashprof-doc-meta">
                      <span className={`dashprof-doc-tag type-${doc.doc_type}`}>{label.de}</span>
                      {doc.source === 'generated' && (
                        <span className="dashprof-doc-tag is-ai">{tProf('docs.aiBadge')}</span>
                      )}
                      <span className="dashprof-doc-date">{formatDate(doc.created_at, locale)}</span>
                    </div>
                    <div className="dashprof-doc-actions">
                      {doc.doc_type === 'lebenslauf' && doc.source === 'generated' && (
                        <button type="button" onClick={() => handleOpenCv(doc)} className="dashprof-chip">
                          {tProf('docs.openInBuilder')}
                        </button>
                      )}
                      {doc.doc_type === 'motivationsschreiben' && doc.source === 'generated' && (
                        <button type="button" onClick={() => setSelectedLetter(doc)} className="dashprof-chip">
                          {tProf('docs.viewLetter')}
                        </button>
                      )}
                      {doc.source === 'upload' && doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="dashprof-chip">
                          {tProf('docs.openFile')}
                        </a>
                      )}
                      <button type="button" onClick={() => handleDeleteDoc(doc)} className="dashprof-chip dashprof-chip-danger">
                        {tProf('docs.delete')}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* DANGER ZONE */}
      <section className="dashprof-danger">
        <div>
          <h3>{tProf('deleteAccount.title')}</h3>
          <p>{tProf('deleteAccount.body')}</p>
        </div>
        <button
          type="button"
          className="dashprof-btn dashprof-btn-danger"
          onClick={() => { setShowDeleteConfirm(true); setDeleteError('') }}
        >
          {tProf('deleteAccount.button')}
        </button>
      </section>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div
          className="dashprof-modal-bg"
          onClick={e => { if (e.target === e.currentTarget && !deleting) setShowDeleteConfirm(false) }}
        >
          <div className="dashprof-modal" dir={dirFor(locale)}>
            <h3>{tProf('deleteAccount.title')}</h3>
            <p>{tProf('deleteAccount.body')}</p>
            {deleteError && <p className="dashprof-err">{deleteError}</p>}
            <div className="dashprof-modal-actions">
              <button type="button" className="dashprof-btn dashprof-btn-ghost" disabled={deleting}
                onClick={() => setShowDeleteConfirm(false)}>
                {tProf('deleteAccount.cancel')}
              </button>
              <button type="button" className="dashprof-btn dashprof-btn-danger" disabled={deleting}
                onClick={handleDeleteAccount}>
                {deleting ? tProf('deleteAccount.deleting') : tProf('deleteAccount.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Letter preview modal */}
      {selectedLetter && (
        <div
          className="dashprof-modal-bg"
          onClick={e => { if (e.target === e.currentTarget) setSelectedLetter(null) }}
        >
          <div className="dashprof-modal dashprof-modal-wide">
            <div className="dashprof-modal-head">
              <h3>{selectedLetter.title}</h3>
              <button type="button" className="dashprof-btn dashprof-btn-ghost" onClick={() => setSelectedLetter(null)}>
                {tProf('docs.close')}
              </button>
            </div>
            <div className="dashprof-letter" dir="ltr" lang="de">
              {(selectedLetter.letter_text || '').split('\n').map((rawLine, i) => {
                const isDate = rawLine.startsWith(DATE_MARKER)
                const text = isDate ? rawLine.slice(DATE_MARKER.length).trim() : rawLine
                if (text.trim() === '') return <div key={i} style={{ height: 10 }} />
                if (isDate) return <p key={i} className="dashprof-letter-date">{text}</p>
                return <p key={i}>{text}</p>
              })}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="dashprof-toast">{toast}</div>}
    </div>
  )
}
