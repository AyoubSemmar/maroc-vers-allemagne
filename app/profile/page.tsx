'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [whatsapp, setWhatsapp] = useState('')
  const [countryCode, setCountryCode] = useState('+212')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [status, setStatus] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [myListings, setMyListings] = useState<any[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single()
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
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      setMyListings(listings || [])
    })
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
      setPhoneError(countryCode === '+49' ? 'الرقم الألماني يجب أن يحتوي على 10 أو 11 رقماً' : 'الرقم المغربي يجب أن يحتوي على 9 أرقام')
      return
    }
    setPhoneError('')
    const fullNumber = phoneNumber ? `${countryCode}${phoneNumber}` : ''
    setWhatsapp(fullNumber)
    setSaving(true)
    const updates = { user_id: user.id, whatsapp: phoneNumber ? `${countryCode}${phoneNumber}` : '', status, avatar_url: avatarUrl }
    const { error } = await supabase.from('profiles').upsert(updates, { onConflict: 'user_id' })
    if (error) { setSaveError(error.message); setSaving(false); return }
    setProfile(updates)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
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

            {/* Email (read only) */}
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
                <button
                  type="button"
                  onClick={() => setStatus('في ألمانيا')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    status === 'في ألمانيا'
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🇩🇪 في ألمانيا
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('أحاول القدوم')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    status === 'أحاول القدوم'
                      ? 'bg-green-700 text-white border-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  🇲🇦 أحاول القدوم
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
            </button>
          </form>
        </div>
      </div>

      {/* My Listings */}
      <div className="max-w-lg mx-auto px-4 pb-12">
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
              <a
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
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
    </div>
  )
}
