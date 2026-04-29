'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { CITIES_AR, cityLabel } from '@/lib/germanCities'

const cities = CITIES_AR

export default function NewListingPage() {
  const t = useTranslations('listings')
  const locale = useLocale() as AppLocale
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  // Anmeldung — tri-state. The poster declares whether the address
  // allows tenants to register their residence there. Important
  // signal for the platform's audience (visa-bound migrants).
  const [anmeldung, setAnmeldung] = useState<'true' | 'false' | ''>('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', data.user.id).single()
      setProfile(prof)
    })
  }, [])

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5)
    setImageFiles(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  function removeImage(index: number) {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImageFiles(newFiles)
    setPreviews(newPreviews)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!profile?.whatsapp) {
      setError(t('form.whatsappMissing'))
      return
    }
    setUploading(true)

    const imageUrls: string[] = []
    for (const file of imageFiles) {
      const filename = `${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filename, file, { contentType: file.type })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(data.path)
        imageUrls.push(urlData.publicUrl)
      }
    }

    await supabase.from('listings').insert([{
      user_id: user.id,
      title,
      description,
      city,
      type,
      price: price ? Number(price) : null,
      whatsapp: profile.whatsapp,
      with_anmeldung: anmeldung === 'true' ? true : anmeldung === 'false' ? false : null,
      image_url: imageUrls[0] || '',
      images: imageUrls,
      available: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }])

    setUploading(false)
    router.push('/listings')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-lg mx-auto px-4 py-12">
        <Link href="/listings" className="text-sm text-green-700 hover:underline mb-6 block">{t('backToListings')}</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('form.title')}</h1>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>}

        {!profile?.whatsapp && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm mb-6">
            {t('form.whatsappBanner')}{' '}
            <Link href="/profile" className="underline font-medium">{t('form.whatsappBannerLink')}</Link>{' '}
            {t('form.whatsappBannerAfter')}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder={t('form.titlePh')}
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
            />
            <textarea
              placeholder={t('form.descPh')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={4}
              className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
            />
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
            >
              <option value="">{t('form.selectCity')}</option>
              {cities.map(c => <option key={c} value={c}>{cityLabel(c, locale)}</option>)}
            </select>

            <div className="relative">
              <input
                type="number"
                placeholder={t('form.pricePh')}
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
                dir="ltr"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900 pr-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setType('غرفة')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${type === 'غرفة' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700'}`}>{t('form.typeRoom')}</button>
              <button type="button" onClick={() => setType('شقة')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${type === 'شقة' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700'}`}>{t('form.typeApt')}</button>
            </div>

            {/* Anmeldung tri-state — important for visa-bound tenants */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">{t('form.anmeldungLabel')}</label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setAnmeldung('true')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium ${anmeldung === 'true' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700'}`}>
                  ✅ {t('form.anmeldungYes')}
                </button>
                <button type="button" onClick={() => setAnmeldung('false')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium ${anmeldung === 'false' ? 'bg-red-600 text-white border-red-600' : 'border-gray-300 text-gray-700'}`}>
                  ❌ {t('form.anmeldungNo')}
                </button>
                <button type="button" onClick={() => setAnmeldung('')}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium ${anmeldung === '' ? 'bg-gray-600 text-white border-gray-600' : 'border-gray-300 text-gray-700'}`}>
                  ❔ {t('form.anmeldungSkip')}
                </button>
              </div>
              <p className="text-xs text-gray-400">{t('form.anmeldungHint')}</p>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">{t('form.imagesLabel')}</label>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              {imageFiles.length < 5 && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              )}
              <p className="text-xs text-gray-400">{t('form.imagesCount', { n: imageFiles.length })}</p>
            </div>

            <button
              type="submit"
              disabled={uploading || !profile?.whatsapp || !type}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
            >
              {uploading ? t('form.publishing') : t('form.publish')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
