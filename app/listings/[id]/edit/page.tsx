'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useParams } from 'next/navigation'

const cities = [
  'برلين', 'ميونخ', 'هامبورغ', 'فرانكفورت', 'كولونيا', 'شتوتغارت', 'دوسلدورف',
  'لايبزيغ', 'دورتموند', 'إيسن', 'بريمن', 'درسدن', 'هانوفر', 'نورنبرغ', 'دويسبورغ',
  'بوخوم', 'فوبرتال', 'بيليفيلد', 'بون', 'مونستر', 'مانهايم', 'كارلسروه',
  'أوغسبورغ', 'فيسبادن', 'غلزنكيرشن', 'آخن', 'براونشفايغ', 'كيل', 'كيمنيتس',
  'ماغدبورغ', 'فرايبورغ', 'روستوك', 'هاله', 'إيرفورت', 'ماينز', 'لوبيك',
  'زاربروكن', 'هايدلبرغ', 'بوتسدام', 'أخرى'
]

export default function EditListingPage() {
  const params = useParams()
  const id = params?.id as string
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')
  const [available, setAvailable] = useState(true)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) { router.push('/login'); return }

      const { data: listing } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (!listing) { router.push('/listings'); return }
      if (listing.user_id !== auth.user.id) {
        setError('ليس لديك صلاحية لتعديل هذا الإعلان')
        setLoading(false)
        return
      }

      setUser(auth.user)
      setTitle(listing.title ?? '')
      setDescription(listing.description ?? '')
      setCity(listing.city ?? '')
      setType(listing.type ?? '')
      setPrice(listing.price != null ? String(listing.price) : '')
      setAvailable(listing.available ?? true)
      const imgs = listing.images?.length ? listing.images : listing.image_url ? [listing.image_url] : []
      setExistingImages(imgs)
      setLoading(false)
    }
    load()
  }, [id])

  function handleNewImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const totalAllowed = 5 - existingImages.length
    const files = Array.from(e.target.files || []).slice(0, totalAllowed)
    setNewImageFiles(files)
    setNewPreviews(files.map(f => URL.createObjectURL(f)))
  }

  function removeExistingImage(index: number) {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  function removeNewImage(index: number) {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index))
    setNewPreviews(newPreviews.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError('')

    const uploadedUrls: string[] = []
    for (const file of newImageFiles) {
      const filename = `${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filename, file, { contentType: file.type })
      if (!uploadError && data) {
        const { data: urlData } = supabase.storage.from('article-images').getPublicUrl(data.path)
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    const finalImages = [...existingImages, ...uploadedUrls]

    const { error: updateError } = await supabase
      .from('listings')
      .update({
        title,
        description,
        city,
        type,
        price: price ? Number(price) : null,
        available,
        image_url: finalImages[0] || '',
        images: finalImages,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    setSaving(false)
    if (updateError) {
      setError('حدث خطأ أثناء الحفظ: ' + updateError.message)
      return
    }
    router.push(`/listings/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md bg-white rounded-xl p-6 border border-red-200">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/listings" className="text-green-700 hover:underline">→ العودة للإعلانات</a>
        </div>
      </div>
    )
  }

  const totalImages = existingImages.length + newImageFiles.length

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-lg mx-auto px-4 py-12">
        <a href={`/listings/${id}`} className="text-sm text-green-700 hover:underline mb-6 block">→ العودة للإعلان</a>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">تعديل إعلان السكن</h1>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              placeholder="عنوان الإعلان"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
            />
            <textarea
              placeholder="وصف المكان (الحجم، الأثاث، الإيجار...)"
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
              <option value="">اختر المدينة</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="relative">
              <input
                type="number"
                placeholder="السعر الشهري (€)"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
                dir="ltr"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900 pr-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setType('غرفة')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${type === 'غرفة' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700'}`}>غرفة</button>
              <button type="button" onClick={() => setType('شقة')} className={`flex-1 py-2 rounded-lg border text-sm font-medium ${type === 'شقة' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-700'}`}>شقة</button>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={available}
                onChange={e => setAvailable(e.target.checked)}
                className="w-4 h-4 accent-green-700"
              />
              الإعلان متاح
            </label>

            {/* Images */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-500">الصور (من 1 إلى 5 صور)</label>

              {existingImages.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">الصور الحالية:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((src, i) => (
                      <div key={`e-${i}`} className="relative">
                        <img src={src} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newPreviews.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">الصور الجديدة:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {newPreviews.map((src, i) => (
                      <div key={`n-${i}`} className="relative">
                        <img src={src} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {totalImages < 5 && (
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImagesChange}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              )}
              <p className="text-xs text-gray-400">{totalImages}/5 صور</p>
            </div>

            <button
              type="submit"
              disabled={saving || !type}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
