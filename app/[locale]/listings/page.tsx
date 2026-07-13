import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import ListingsFilters from './ListingsFilters'
import FurnishedHousing from '../tools/furnished-housing/FurnishedHousing'
import { CITIES_AR, cityLabel } from '@/lib/germanCities'
import type { Metadata } from 'next'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'listings' })
  return buildLocaleMetadata({
    locale,
    path: '/listings',
    title: `${t('pageTitle')} — GoGermany`,
    description: t('pageTitle'),
  })
}

const cities = CITIES_AR

const LOCALE_TO_INTL: Record<AppLocale, string> = {
  ar: 'ar-MA', fr: 'fr-FR', en: 'en-GB', de: 'de-DE', es: 'es-ES',
  tr: 'tr-TR', fa: 'fa-IR', pt: 'pt-BR', ru: 'ru-RU',
  hi: 'hi-IN', ur: 'ur-PK', zh: 'zh-CN',
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

export default async function ListingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>
  searchParams: Promise<{ city?: string; type?: string }>
}) {
  const { locale } = await params
  const { city, type } = await searchParams
  const t = await getTranslations({ locale, namespace: 'listings' })

  const now = new Date().toISOString()
  // Only the grid card fields — detail page fetches the full row separately.
  let query = supabase
    .from('listings')
    .select('id, title, description, image_url, type, city, price, with_anmeldung, gender_target, expires_at, created_at')
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
      {/* Primary: live furnished rentals from the international platforms */}
      <FurnishedHousing locale={locale} />

      {/* Secondary: community-posted rooms & flats */}
      <section className="border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{t('communityHeading')}</h2>
          <Link href="/listings/new" className="flex-none bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800">
            {t('addListing')}
          </Link>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>{t('communityIntro')}</p>

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
                <img src={listing.image_url} alt={listing.title} loading="lazy" decoding="async" width={400} height={192} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">🏠</div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{typeLabel(listing.type)}</span>
                  <span className="text-xs text-gray-400">{cityLabel(listing.city, locale)}</span>
                  {listing.price && (
                    <span className="text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded-full">{listing.price} {t('priceSuffix')}</span>
                  )}
                  {listing.with_anmeldung === true && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ {t('withAnmeldung')}</span>
                  )}
                  {listing.with_anmeldung === false && (
                    <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">❌ {t('withoutAnmeldung')}</span>
                  )}
                  {listing.gender_target === 'male' && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">👨 {t('genderMaleBadge')}</span>
                  )}
                  {listing.gender_target === 'female' && (
                    <span className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-full">👩 {t('genderFemaleBadge')}</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description}</p>
                {listing.expires_at && (
                  <p className="text-xs text-orange-500 mt-2">{t('expires', { date: formatExpiry(listing.expires_at, locale) })}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      </section>
    </div>
  )
}
