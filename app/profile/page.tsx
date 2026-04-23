'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import {
  UserDocument, DocumentType,
  DOC_TYPE_LABELS, UPLOAD_TYPES,
  fetchDocuments, uploadDocument, deleteDocument,
} from '@/lib/documents'
import { STORAGE_KEY } from '@/components/cv-builder/utils'

const DATE_MARKER = '>>DATE>>'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-MA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()

  // ── Profile state ─────────────────────────────────────────
  const [user, setUser]             = useState<any>(null)
  const [profile, setProfile]       = useState<any>(null)
  const [whatsapp, setWhatsapp]     = useState('')
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

  // ── Documents state ───────────────────────────────────────
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

  // ── Delete-account state ──────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteReason, setDeleteReason]           = useState('')
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

      // Load documents
      setDocsLoading(true)
      fetchDocuments()
        .then(d => setDocs(d))
        .catch(() => {})
        .finally(() => setDocsLoading(false))
    })
  }, [])

  // ── Profile handlers ──────────────────────────────────────
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
      setPhoneError(countryCode === '+49'
        ? 'الرقم الألماني يجب أن يحتوي على 10 أو 11 رقماً'
        : 'الرقم المغربي يجب أن يحتوي على 9 أرقام')
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

  // ── Document handlers ─────────────────────────────────────
  function showToast(msg: string) {
    setDocToast(msg)
    setTimeout(() => setDocToast(''), 3000)
  }

  async function handleDocUpload() {
    if (!uploadFile) { setUploadError('اختر ملفاً أولاً'); return }
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
      showToast('✅ تم رفع الوثيقة بنجاح')
    } catch (e: any) {
      setUploadError(e?.message || 'خطأ في الرفع')
    } finally {
      setUploading2(false)
    }
  }

  async function handleDeleteDoc(doc: UserDocument) {
    if (!confirm(`هل تريد حذف "${doc.title}"؟`)) return
    try {
      await deleteDocument(doc)
      setDocs(prev => prev.filter(d => d.id !== doc.id))
      showToast('✅ تم الحذف')
    } catch (e: any) {
      showToast('❌ ' + (e?.message || 'خطأ في الحذف'))
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
      // Redirect out — session is already cleared server-side.
      window.location.href = '/'
    } catch (e: any) {
      setDeleteError(e?.message || 'حدث خطأ أثناء حذف الحساب')
      setDeleting(false)
    }
  }

  function handleOpenCv(doc: UserDocument) {
    if (!doc.cv_data) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(doc.cv_data))
      router.push('/cv-builder')
    } catch {
      showToast('❌ تعذر فتح السيرة الذاتية')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">ملفي الشخصي</h1>

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-4">
            خطأ: {saveError}
          </div>
        )}

        {/* ── Profile form ──────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-green-200" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-4xl">👤</div>
              )}
              <label className="cursor-pointer text-sm text-green-700 hover:underline">
                {uploading ? 'جاري الرفع...' : 'تغيير الصورة'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">البريد الإلكتروني</label>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-500">رقم واتساب (اختياري)</label>
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

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">وضعك الحالي (اختياري)</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStatus('في ألمانيا')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${status === 'في ألمانيا' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  🇩🇪 في ألمانيا
                </button>
                <button type="button" onClick={() => setStatus('أحاول القدوم')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${status === 'أحاول القدوم' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  🇲🇦 أحاول القدوم
                </button>
              </div>
            </div>

            <button type="submit" disabled={saving}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50">
              {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>

        {/* ── My Documents ─────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">🗂 وثائقي</h2>
            <button
              type="button"
              onClick={() => { setShowUpload(v => !v); setUploadError('') }}
              className="bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800"
            >
              {showUpload ? '✕ إلغاء' : '+ رفع وثيقة'}
            </button>
          </div>

          {/* Upload form */}
          {showUpload && (
            <div className="bg-white rounded-xl border border-blue-200 p-5 mb-4 flex flex-col gap-4">
              <p className="text-sm font-semibold text-gray-700">رفع وثيقة جديدة</p>

              {/* Type selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">نوع الوثيقة</label>
                <select
                  value={uploadType}
                  onChange={e => setUploadType(e.target.value as DocumentType)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white text-sm"
                >
                  {UPLOAD_TYPES.map(t => (
                    <option key={t} value={t}>
                      {DOC_TYPE_LABELS[t].icon} {DOC_TYPE_LABELS[t].de} — {DOC_TYPE_LABELS[t].ar}
                    </option>
                  ))}
                </select>
              </div>

              {/* File picker */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">الملف (PDF أو Word · حد أقصى 8MB)</label>
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
                    <span>اسحب الملف هنا أو <span className="text-blue-600 underline">انقر للاختيار</span></span>
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
                    if (f.size > 8_000_000) { setUploadError('الحجم الأقصى 8MB'); return }
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
                {uploading2 ? '⏳ جاري الرفع...' : '📤 رفع الوثيقة'}
              </button>
            </div>
          )}

          {/* Documents list */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {docsLoading ? (
              <p className="text-center text-gray-400 text-sm py-6">جاري التحميل...</p>
            ) : docs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📭</p>
                <p className="text-gray-400 text-sm">لا توجد وثائق محفوظة بعد.</p>
                <p className="text-gray-400 text-xs mt-1">
                  قم بإنشاء <a href="/cv-builder" className="text-blue-600 underline">سيرة ذاتية</a> أو{' '}
                  <a href="/anschreiben-generator" className="text-blue-600 underline">خطاب تحفيز</a> أو ارفع ملفاً.
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
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">مولّد بالذكاء الاصطناعي</span>
                          )}
                          <span className="text-xs text-gray-400">{formatDate(doc.created_at)}</span>
                        </div>
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {doc.doc_type === 'lebenslauf' && doc.source === 'generated' && (
                            <button
                              type="button"
                              onClick={() => handleOpenCv(doc)}
                              className="text-xs border border-blue-300 text-blue-700 rounded px-2 py-1 hover:bg-blue-50"
                            >
                              ✏️ فتح في البناء
                            </button>
                          )}
                          {doc.doc_type === 'motivationsschreiben' && doc.source === 'generated' && (
                            <button
                              type="button"
                              onClick={() => setSelectedLetter(doc)}
                              className="text-xs border border-green-300 text-green-700 rounded px-2 py-1 hover:bg-green-50"
                            >
                              👁 عرض الخطاب
                            </button>
                          )}
                          {doc.source === 'upload' && doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs border border-gray-300 text-gray-700 rounded px-2 py-1 hover:bg-gray-50"
                            >
                              🔗 فتح الملف
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(doc)}
                            className="text-xs border border-red-200 text-red-600 rounded px-2 py-1 hover:bg-red-50"
                          >
                            🗑 حذف
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

        {/* ── My Listings ───────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">إعلاناتي</h2>
            <a href="/listings/new" className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800">
              + إضافة إعلان
            </a>
          </div>

          {myListings.length === 0 && (
            <p className="text-gray-400 text-sm">لم تضف أي إعلان بعد.</p>
          )}

          <div className="flex flex-col gap-3">
            {myListings.map(listing => {
              const expired = listing.expires_at && new Date(listing.expires_at) < new Date()
              return (
                <a key={listing.id} href={`/listings/${listing.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  {listing.image_url ? (
                    <img src={listing.image_url} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏠</div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{listing.title}</p>
                    <p className="text-xs text-gray-400">{listing.city} · {listing.type}</p>
                    {expired ? (
                      <span className="text-xs text-red-500">منتهي الصلاحية</span>
                    ) : listing.expires_at ? (
                      <span className="text-xs text-orange-500">
                        ينتهي {new Date(listing.expires_at).getDate()}/{new Date(listing.expires_at).getMonth() + 1}/{new Date(listing.expires_at).getFullYear()}
                      </span>
                    ) : null}
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        {/* ── Delete account button ──────────────────────── */}
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
            حذف حسابي
          </button>
        </div>
      </div>

      {/* ── Delete account confirmation modal ──────────── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget && !deleting) setShowDeleteConfirm(false) }}
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6" dir="rtl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">هل أنت متأكد؟</h3>
            <p className="text-sm text-gray-600 mb-4">
              سيتم حذف حسابك نهائياً ولن تتمكن من تسجيل الدخول مجدداً. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            {deleteError && <p className="text-red-600 text-xs mb-3">{deleteError}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? '⏳ جاري الحذف...' : 'نعم، احذف الحساب'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Letter preview modal ──────────────────────── */}
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
                ✕ إغلاق
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

      {/* ── Toast ─────────────────────────────────────── */}
      {docToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 pointer-events-none">
          {docToast}
        </div>
      )}
    </div>
  )
}
