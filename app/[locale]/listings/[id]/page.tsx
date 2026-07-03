import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import { createClient as createServerClient } from '@/lib/supabase-server'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import DeleteListingButton from './DeleteListingButton'
import ImageGallery from './ImageGallery'
import ShareButtons from '@/components/ShareButtons'
import WhatsappLink from '@/components/WhatsappLink'
import { cityLabel } from '@/lib/germanCities'
import type { Metadata } from 'next'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'

// Listings are user-generated Arabic-first ads shown identically in all
// 12 locale URLs — the locale only changes the chrome. Canonicalise every
// locale variant to the Arabic URL so Google indexes one copy instead of
// clustering 12 duplicates with no canonical.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: AppLocale }>
}): Promise<Metadata> {
  const { id, locale } = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('title, description, city')
    .eq('id', id)
    .single()
  if (!listing) return { title: 'GoGermany' }

  const title = `${listing.title} — GoGermany`
  const description = (listing.description ?? listing.title ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 158)
  const base = buildLocaleMetadata({ locale, path: `/listings/${id}`, title, description })
  return {
    ...base,
    alternates: { canonical: `https://www.gogermany.ma/ar/listings/${id}` },
  }
}

export default async function ListingPage({ params }: { params: Promise<{ id: string; locale: AppLocale }> }) {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: 'listings' })

  const { data: listing } = await supabase.from('listings').select('*').eq('id', id).single()

  if (!listing) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
      <p className="text-gray-500">{t('notFound')}</p>
    </div>
  )

  const serverSupabase = await createServerClient()
  const { data: { user } } = await serverSupabase.auth.getUser()
  const isOwner = user?.id === listing.user_id

  const images = listing.images?.length ? listing.images : listing.image_url ? [listing.image_url] : []

  function typeLabel(dbType: string): string {
    if (dbType === 'غرفة') return t('types.room')
    if (dbType === 'شقة') return t('types.apartment')
    return dbType
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/listings" className="text-sm text-green-700 hover:underline mb-6 block">{t('backToListings')}</Link>

        {images.length > 0 ? (
          <ImageGallery images={images} />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center text-6xl mb-6">🏠</div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{typeLabel(listing.type)}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{cityLabel(listing.city, locale)}</span>
                {listing.with_anmeldung === true && (
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ {t('withAnmeldung')}</span>
                )}
                {listing.with_anmeldung === false && (
                  <span className="text-xs font-medium bg-red-50 text-red-700 px-2 py-1 rounded-full">❌ {t('withoutAnmeldung')}</span>
                )}
                {listing.gender_target === 'male' && (
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">👨 {t('genderMaleBadge')}</span>
                )}
                {listing.gender_target === 'female' && (
                  <span className="text-xs font-medium bg-pink-50 text-pink-700 px-2 py-1 rounded-full">👩 {t('genderFemaleBadge')}</span>
                )}
                {listing.price && (
                  <span className="text-sm font-bold text-white bg-green-600 px-3 py-1 rounded-full">{listing.price} {t('priceSuffix')}</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            </div>
            {isOwner && (
              <div className="flex gap-3 items-center">
                <Link href={`/listings/${listing.id}/edit`} className="text-sm text-green-700 hover:underline">
                  {t('detail.edit')}
                </Link>
                <DeleteListingButton id={listing.id} />
              </div>
            )}
          </div>

          <p className="text-gray-600 leading-8 mb-6">{listing.description}</p>

          <ShareButtons title={listing.title} />

          {user ? (
            <WhatsappLink
              href={`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`}
              source="listing_detail"
              className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-xl py-3 px-6 hover:bg-green-700 font-medium"
            >
              {t('detail.whatsappCta')}
            </WhatsappLink>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-sm mb-3">{t('detail.loginPromptBody')}</p>
              <div className="flex gap-3 justify-center">
                <Link
                  href={`/login?next=${encodeURIComponent(`/${locale}/listings/${listing.id}`)}` as any}
                  className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800"
                >
                  {t('detail.login')}
                </Link>
                <Link
                  href={`/signup?next=${encodeURIComponent(`/${locale}/listings/${listing.id}`)}` as any}
                  className="border border-green-700 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50"
                >
                  {t('detail.signup')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
