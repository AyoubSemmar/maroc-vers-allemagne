'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import {
  UserDocument, DocumentType,
  DOC_TYPE_LABELS, UPLOAD_TYPES,
  fetchDocuments, uploadDocument, deleteDocument,
} from '@/lib/documents'
import { STORAGE_KEY } from '@/components/cv-builder/utils'

const DATE_MARKER = '>>DATE>>'

// Canonical status values stored in DB (do not translate — preserves existing data).
const STATUS_IN_DE = 'في ألمانيا'
const STATUS_COMING = 'أحاول القدوم'

const LOCALE_TO_INTL: Record<AppLocale, string> = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-GB',
  de: 'de-DE',
}

function formatDate(iso: string, locale: AppLocale) {
  return new Date(iso).toLocaleDateString(LOCALE_TO_INTL[locale], {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ProfilePage() {
  const t = useTranslations('profile')
  const locale = useLocale() as AppLocale
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser]             = useState<any>(null)
  const [, setProfile]              = useState<any>(null)
  const [, setWhatsapp]             = useState('')
  const [countryCode, setCountryCode] = useState('+212')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus]         = useState('')
  const [avatarUrl, setAvatarUrl]   = useState('')
  const [uploading, setUploading]   = useState(false)
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [saveError, setSaveError]   = useState('')
  const [myListings, setMyListings] = useState<any[]>([])

  const [docs, setDocs]                 = useState<UserDocument[]>([])
  const [docsLoading, setDocsLoading]   = useState(true)
  const [showUpload, setShowUpload]     = useState(false)
  const [uploadType, setUploadType]     = useState<DocumentType>('lebenslauf')
  const [uploadFile, setUploadFile]     = useState<File | null>(null)
  const [uploading2, setUploading2]     = useState(false)
  const [uploadError, setUploadError]   = useState('')
  const [selectedLetter, setSelectedLetter] = useState<UserDocument | null>(null)
  const [docToast, setDocToast]         = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteReason] = useState('')
  const [deleting, setDeleting]                   = useState(false)
  const [deleteError, setDeleteError]             = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)

      const [{ data: prof }, { data: listings }] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', data.user.id).single(),
        supabase.from('listings').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }),
      ])

      if (prof) {
        setProfile(prof)
        setStatus(prof.status || '')
        setAvatarUrl(prof.avatar_url || '')
        if (prof.whatsapp) {
          const code = prof.whatsapp.startsWith('+49') ? '+49' : '+212'
          setCountryCode(code)
          setPhoneNumber(prof.whatsapp.replace(code, ''))
          setWhatsapp(prof.whatsapp)
        }
      }
      setMyListings(listings || [])

      setDocsLoading(true)
      fetchDocuments()
        .then(d => setDocs(d))
        .catch(() => {})
        .finally(() => setDocsLoading(false))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const filename = `${user.id}-${Date.now()}`
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filename, file, { contentType: file.type, upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path)
      setAvatarUrl(urlData.publicUrl)
    }
    setUploading(false)
  }

  function validatePhone() {
    if (!phoneNumber) return true
    const digits = phoneNumber.replace(/\D/g, '')
    if (countryCode === '+49') return digits.length === 10 || digits.length === 11
    if (countryCode === '+212') return digits.length === 9
    return false
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (phoneNumber && !validatePhone()) {
      setPhoneError(countryCode === '+49' ? t('whatsapp.errDe') : t('whatsapp.errMa'))
      return
    }
    setPhoneError('')
    const fullNumber = phoneNumber ? `${countryCode}${phoneNumber}` : ''
    setWhatsapp(fullNumber)
    setSaving(true)
    const updates = {
      user_id: user.id,
      whatsapp: phoneNumber ? `${countryCode}${phoneNumber}` : '',
      status,
      avatar_url: avatarUrl,
    }
    const { error } = await supabase.from('profiles').upsert(updates, { onConflict: 'user_id' })
    if (error) { setSaveError(error.message); setSaving(false); return }
    setProfile(updates)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function showToast(msg: string) {
    setDocToast(msg)
    setTimeout(() => setDocToast(''), 3000)
  }

  async function handleDocUpload() {
    if (!uploadFile) { setUploadError(t('docs.pickFirst')); return }
    setUploading2(true)
    setUploadError('')
    try {
      const label = DOC_TYPE_LABELS[uploadType]
      const title = `${label.ar} — ${uploadFile.name.replace(/\.[^.]+$/, '')}`
      const doc = await uploadDocument(uploadFile, title, uploadType)
      setDocs(prev => [doc, ...prev])
      setShowUpload(false)
      setUploadFile(null)
      if (fileRef.current) fileRef.current.value = ''
      showToast(t('docs.uploadSuccess'))
    } catch (e: any) {
      setUploadError(e?.message || t('docs.uploadErr'))
    } finally {
      setUploading2(false)
    }
  }

  async function handleDeleteDoc(doc: UserDocument) {
    if (!confirm(t('docs.confirmDelete', { title: doc.title }))) return
    try {
      await deleteDocument(doc)
      setDocs(prev => prev.filter(d => d.id !== doc.id))
      showToast(t('docs.deleted'))
    } catch (e: any) {
      showToast('❌ ' + (e?.message || t('docs.deleteErr')))
    }
  }

  async function handleDeleteAccount() {
    if (deleting) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deleteReason }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      window.location.href = `/${locale}`
    } catch (e: any) {
      setDeleteError(e?.message || t('deleteAccount.genericErr'))
      setDeleting(false)
    }
  }

  function handleOpenCv(doc: UserDocument) {
    if (!doc.cv_data) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(doc.cv_data))
      router.push('/cv-builder')
    } catch {
      showToast(t('docs.openCvErr'))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('title')}</h1>

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
            {t('errorPrefix')}{saveError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-green-200" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-4xl">👤</div>
              )}
              <label className="cursor-pointer text-sm text-green-700 hover:underline">
                {uploading ? t('avatar.uploading') : t('avatar.change')}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">{t('email')}</label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">{t('whatsapp.label')}</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => { setPhoneNumber(e.target.value.replace(/\D/g, '')); setPhoneError('') }}
                  className={`border rounded-lg px-4 py-2 text-gray-900 flex-1 ${phoneError ? 'border-red-400' : 'border-gray-300'}`}
                  maxLength={countryCode === '+49' ? 11 : 9}
                />
                <select
                  value={countryCode}
                  onChange={e => { setCountryCode(e.target.value); setPhoneNumber(''); setPhoneError('') }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white"
                >
                  <option value="+212">🇲🇦 +212</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
              </div>
              {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">{t('status.label')}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStatus(STATUS_IN_DE)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${status === STATUS_IN_DE ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  🇩🇪 {t('status.inDe')}
                </button>
                <button type="button" onClick={() => setStatus(STATUS_COMING)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${status === STATUS_COMING ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  🇲🇦 {t('status.coming')}
                </button>
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50">
              {saving ? t('save.saving') : saved ? t('save.saved') : t('save.submit')}
            </button>
          </form>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('docs.heading')}</h2>
            <button
              type="button"
              onClick={() => { setShowUpload(v => !v); setUploadError('') }}
              className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              {showUpload ? t('docs.uploadClose') : t('docs.uploadOpen')}
            </button>
          </div>

          {showUpload && (
            <div className="bg-white rounded-xl border border-blue-200 p-5 mb-4 flex flex-col gap-4">
              <p className="text-sm font-semibold text-gray-700">{t('docs.formTitle')}</p>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{t('docs.type')}</label>
                <select
                  value={uploadType}
                  onChange={e => setUploadType(e.target.value as DocumentType)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white text-sm"
                >
                  {UPLOAD_TYPES.map(ty => (
                    <option key={ty} value={ty}>
                      {DOC_TYPE_LABELS[ty].icon} {DOC_TYPE_LABELS[ty].de} — {DOC_TYPE_LABELS[ty].ar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{t('docs.fileLabel')}</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-500"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    const f = e.dataTransfer.files[0]
                    if (f) setUploadFile(f)
                  }}
                >
                  {uploadFile ? (
                    <span className="text-green-700 font-medium">📄 {uploadFile.name}</span>
                  ) : (
                    <span>{t('docs.dropHint')} <span className="text-blue-600 underline">{t('docs.clickSelect')}</span></span>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    if (f.size > 8_000_000) { setUploadError(t('docs.sizeErr')); return }
                    setUploadFile(f)
                    setUploadError('')
                  }}
                />
              </div>

              {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}

              <button
                type="button"
                onClick={handleDocUpload}
                disabled={uploading2 || !uploadFile}
                className="bg-blue-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
              >
                {uploading2 ? t('docs.uploading') : t('docs.uploadBtn')}
              </button>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {docsLoading ? (
              <p className="text-center text-gray-400 text-sm py-6">{t('docs.loading')}</p>
            ) : docs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-gray-400 text-sm">{t('docs.emptyTitle')}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {t('docs.emptyHint')}{' '}
                  <Link href="/cv-builder" className="text-blue-600 underline">{t('docs.emptyCv')}</Link>{' '}
                  {t('docs.emptyOr')}{' '}
                  <Link href="/anschreiben-generator" className="text-blue-600 underline">{t('docs.emptyLetter')}</Link>{' '}
                  {t('docs.emptyOrUpload')}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {docs.map(doc => {
                  const label = DOC_TYPE_LABELS[doc.doc_type] ?? { de: doc.doc_type, ar: '', icon: '📄' }
                  return (
                    <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors">
                      <span className="text-2xl mt-0.5 flex-shrink-0">{label.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{doc.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            doc.doc_type === 'lebenslauf'             ? 'bg-blue-100 text-blue-700' :
                            doc.doc_type === 'motivationsschreiben'   ? 'bg-green-100 text-green-700' :
                            doc.doc_type === 'sprachzertifikat'       ? 'bg-purple-100 text-purple-700' :
                            doc.doc_type === 'akademisches_zertifikat'? 'bg-yellow-100 text-yellow-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {label.de}
                          </span>
                          {doc.source === 'generated' && (
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{t('docs.aiBadge')}</span>
                          )}
                          <span className="text-xs text-gray-400">{formatDate(doc.created_at, locale)}</span>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {doc.doc_type === 'lebenslauf' && doc.source === 'generated' && (
                            <button
                              type="button"
                              onClick={() => handleOpenCv(doc)}
                              className="text-xs border border-blue-300 text-blue-700 rounded px-2 py-1 hover:bg-blue-50"
                            >
                              {t('docs.openInBuilder')}
                            </button>
                          )}
                          {doc.doc_type === 'motivationsschreiben' && doc.source === 'generated' && (
                            <button
                              type="button"
                              onClick={() => setSelectedLetter(doc)}
                              className="text-xs border border-green-300 text-green-700 rounded px-2 py-1 hover:bg-green-50"
                            >
                              {t('docs.viewLetter')}
                            </button>
                          )}
                          {doc.source === 'upload' && doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs border border-gray-300 text-gray-700 rounded px-2 py-1 hover:bg-gray-50"
                            >
                              {t('docs.openFile')}
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc)}
                            className="text-xs border border-red-200 text-red-600 rounded px-2 py-1 hover:bg-red-50"
                          >
                            {t('docs.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('listings.heading')}</h2>
            <Link href="/listings/new" className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800">
              {t('listings.add')}
            </Link>
          </div>

          {myListings.length === 0 && (
            <p className="text-gray-400 text-sm">{t('listings.empty')}</p>
          )}

          <div className="flex flex-col gap-3">
            {myListings.map(listing => {
              const expired = listing.expires_at && new Date(listing.expires_at) < new Date()
              const expiresDate = listing.expires_at
                ? `${new Date(listing.expires_at).getDate()}/${new Date(listing.expires_at).getMonth() + 1}/${new Date(listing.expires_at).getFullYear()}`
                : ''
              return (
                <Link key={listing.id} href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  {listing.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={listing.image_url} alt={listing.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏠</div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{listing.title}</p>
                    <p className="text-xs text-gray-400">{listing.city} · {listing.type}</p>
                    {expired ? (
                      <span className="text-xs text-red-500">{t('listings.expired')}</span>
                    ) : listing.expires_at ? (
                      <span className="text-xs text-orange-500">
                        {t('listings.expiresOn', { date: expiresDate })}
                      </span>
                    ) : null}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => { setShowDeleteConfirm(true); setDeleteError('') }}
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            {t('deleteAccount.button')}
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget && !deleting) setShowDeleteConfirm(false) }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6" dir={dirFor(locale)}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('deleteAccount.title')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('deleteAccount.body')}
            </p>
            {deleteError && <p className="text-red-600 text-xs mb-3">{deleteError}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
              >
                {t('deleteAccount.cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? t('deleteAccount.deleting') : t('deleteAccount.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedLetter && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setSelectedLetter(null) }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-base">{selectedLetter.title}</h3>
              <button type="button" onClick={() => setSelectedLetter(null)}
                className="text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1 text-sm">
                {t('docs.close')}
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-serif text-sm leading-relaxed text-gray-800" dir="ltr" lang="de">
              {(selectedLetter.letter_text || '').split('\n').map((rawLine, i) => {
                const isDate = rawLine.startsWith(DATE_MARKER)
                const text = isDate ? rawLine.slice(DATE_MARKER.length).trim() : rawLine
                if (text.trim() === '') return <div key={i} style={{ height: 10 }} />
                if (isDate) return <p key={i} className="text-right text-gray-500 mb-3 text-xs">{text}</p>
                return <p key={i} className="mb-0">{text}</p>
              })}
            </div>
          </div>
        </div>
      )}

      {docToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 pointer-events-none">
          {docToast}
        </div>
      )}
    </div>
  )
}
