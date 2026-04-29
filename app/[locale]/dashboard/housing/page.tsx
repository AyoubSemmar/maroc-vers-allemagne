// Renders the housing listings inside the dashboard shell — same data
// + same UI as /listings, but wrapped in the dashboard chrome so users
// stay in their workspace when they click "Housing" in the sidebar.
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import ListingsFilters from '../../listings/ListingsFilters'

const cities = [
  'برلين', 'ميونخ', 'هامبورغ', 'فرانكفورت', 'كولونيا', 'شتوتغارت', 'دوسلدورف',
  'لايبزيغ', 'دورتموند', 'إيسن', 'بريمن', 'درسدن', 'هانوفر', 'نورنبرغ', 'دويسبورغ',
  'بوخوم', 'فوبرتال', 'بيليفيلد', 'بون', 'مونستر', 'مانهايم', 'كارلسروه',
  'أوغسبورغ', 'فيسبادن', 'غلزنكيرشن', 'آخن', 'براونشفايغ', 'كيل', 'كيمنيتس',
  'ماغدبورغ', 'فرايبورغ', 'روستوك', 'هاله', 'إيرفورت', 'ماينز', 'لوبيك',
  'زاربروكن', 'هايدلبرغ', 'بوتسدام', 'أخرى',
]

const LOCALE_TO_INTL: Record<AppLocale, string> = {
  ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE',
}

function formatExpiry(dateStr: string, locale: AppLocale) {
  try {
    return new Date(dateStr).toLocaleDateString(LOCALE_TO_INTL[locale], {
      year: 'numeric', month: 'numeric', day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

type Props = {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ city?: string; type?: string }>
}

export default async function DashboardHousingPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { city, type } = await searchParams
  const t = await getTranslations({ locale, namespace: 'listings' })

  const now = new Date().toISOString()
  let query = supabase
    .from('listings')
    .select('id, title, description, image_url, type, city, price, expires_at, created_at')
    .or(`expires_at.gt.${now},expires_at.is.null`)
    .order('created_at', { ascending: false })
  if (city && city !== '__ALL__') query = query.eq('city', city)
  if (type) query = query.eq('type', type)

  const { data: listings } = await query

  function typeLabel(dbType: string): string {
    if (dbType === 'غرفة') return t('types.room')
    if (dbType === 'شقة') return t('types.apartment')
    return dbType
  }

  return (
    <div dir={dirFor(locale)}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('pageTitle')}</h1>
        <Link
          href="/listings/new"
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800"
        >
          {t('addListing')}
        </Link>
      </div>

      <ListingsFilters cities={cities} currentCity={city} currentType={type} />

      {listings && listings.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🏠</p>
          <p>{t('emptyState')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {listings && listings.map(listing => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden block"
          >
            {listing.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.image_url}
                alt={listing.title}
                loading="lazy"
                decoding="async"
                width={400}
                height={192}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">🏠</div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{typeLabel(listing.type)}</span>
                <span className="text-xs text-gray-400">{listing.city}</span>
                {listing.price && (
                  <span className="text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">
                    {listing.price} {t('priceSuffix')}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900">{listing.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description}</p>
              {listing.expires_at && (
                <p className="text-xs text-orange-500 mt-2">
                  {t('expires', { date: formatExpiry(listing.expires_at, locale) })}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
