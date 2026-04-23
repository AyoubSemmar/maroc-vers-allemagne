import { supabase } from '@/lib/supabase'
import ListingsFilters from './ListingsFilters'

const cities = [
  'كل المدن', 'برلين', 'ميونخ', 'هامبورغ', 'فرانكفورت', 'كولونيا', 'شتوتغارت', 'دوسلدورف',
  'لايبزيغ', 'دورتموند', 'إيسن', 'بريمن', 'درسدن', 'هانوفر', 'نورنبرغ', 'دويسبورغ',
  'بوخوم', 'فوبرتال', 'بيليفيلد', 'بون', 'مونستر', 'مانهايم', 'كارلسروه',
  'أوغسبورغ', 'فيسبادن', 'غلزنكيرشن', 'آخن', 'براونشفايغ', 'كيل', 'كيمنيتس',
  'ماغدبورغ', 'فرايبورغ', 'روستوك', 'هاله', 'إيرفورت', 'ماينز', 'لوبيك',
  'زاربروكن', 'هايدلبرغ', 'بوتسدام', 'أخرى'
]

function formatExpiry(dateStr: string) {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<{ city?: string, type?: string }> }) {
  const { city, type } = await searchParams

  const now = new Date().toISOString()
  let query = supabase.from('listings').select('*').or(`expires_at.gt.${now},expires_at.is.null`).order('created_at', { ascending: false })
  if (city && city !== 'كل المدن') query = query.eq('city', city)
  if (type) query = query.eq('type', type)

  const { data: listings } = await query

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">السكن في ألمانيا</h1>
          <a href="/listings/new" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800">
            + إضافة إعلان
          </a>
        </div>

        <ListingsFilters cities={cities} currentCity={city} currentType={type} />

        {listings && listings.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">🏠</p>
            <p>لا توجد إعلانات بعد</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings && listings.map(listing => (
            <a
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden block"
            >
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">🏠</div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{listing.type}</span>
                  <span className="text-xs text-gray-400">{listing.city}</span>
                  {listing.price && (
                    <span className="text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">{listing.price} €/شهر</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description}</p>
                {listing.expires_at && (
                  <p className="text-xs text-orange-500 mt-2">ينتهي {formatExpiry(listing.expires_at)}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
