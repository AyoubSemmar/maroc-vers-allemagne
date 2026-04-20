import { supabase } from '@/lib/supabase'
import { createClient as createServerClient } from '@/lib/supabase-server'
import DeleteListingButton from './DeleteListingButton'
import ImageGallery from './ImageGallery'

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: listing } = await supabase.from('listings').select('*').eq('id', id).single()

  if (!listing) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <p className="text-gray-500">الإعلان غير موجود</p>
    </div>
  )

  const serverSupabase = await createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  const isOwner = user?.id === listing.user_id

  const images = listing.images?.length ? listing.images : listing.image_url ? [listing.image_url] : []

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <a href="/listings" className="text-sm text-green-700 hover:underline mb-6 block">→ العودة للإعلانات</a>

        {images.length > 0 ? (
          <ImageGallery images={images} />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-6xl mb-6">🏠</div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{listing.type}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{listing.city}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            </div>
            {isOwner && <DeleteListingButton id={listing.id} />}
          </div>

          <p className="text-gray-600 leading-8 mb-6">{listing.description}</p>

          {user ? (
            <a
              href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 font-medium"
            >
              💬 تواصل عبر واتساب
            </a>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-sm mb-3">سجل دخولك لرؤية رقم واتساب صاحب الإعلان</p>
              <div className="flex gap-3 justify-center">
                <a href="/login" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800">دخول</a>
                <a href="/signup" className="border border-green-700 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50">إنشاء حساب</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
