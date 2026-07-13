'use client'

import { useState } from 'react'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'
import ToolHero from '@/components/tools/ToolHero'
import {
  HOUSING_CITIES,
  HOUSING_PLATFORMS,
  housingUrl,
  type HousingPlatformKey,
} from '@/lib/housingPlatforms'

const T = {
  eyebrow: { en: 'Housing', fr: 'Logement', ar: 'السكن' } as L3,
  title: { en: 'Furnished Housing in Germany', fr: 'Logement meublé en Allemagne', ar: 'سكن مفروش في ألمانيا' } as L3,
  sub: {
    en: 'Book your first home from abroad — before you have an Anmeldung or Schufa. Pick your city and jump straight into live, furnished, move-in-ready listings across the platforms trusted by newcomers.',
    fr: 'Réservez votre premier logement depuis l’étranger — avant même d’avoir une Anmeldung ou une Schufa. Choisissez votre ville et accédez directement aux annonces meublées, prêtes à emménager, sur les plateformes de confiance des nouveaux arrivants.',
    ar: 'احجز أول سكن لك من الخارج — قبل أن يكون لديك تسجيل عنوان (Anmeldung) أو سجل ائتماني (Schufa). اختر مدينتك وانتقل مباشرة إلى إعلانات مفروشة جاهزة للسكن عبر المنصّات التي يثق بها القادمون الجدد.',
  } as L3,
  cityLabel: { en: 'Which city are you moving to?', fr: 'Dans quelle ville déménagez-vous ?', ar: 'إلى أي مدينة ستنتقل؟' } as L3,
  browseIn: { en: 'Browse furnished rentals in', fr: 'Voir les locations meublées à', ar: 'تصفّح الإيجارات المفروشة في' } as L3,
  openTab: { en: 'Opens the live search on', fr: 'Ouvre la recherche en direct sur', ar: 'يفتح البحث المباشر على' } as L3,
  // Why furnished-first
  whyTitle: { en: 'Why start with a furnished, mid-term rental?', fr: 'Pourquoi commencer par une location meublée à moyen terme ?', ar: 'لماذا تبدأ بسكن مفروش متوسط المدة؟' } as L3,
  why1: {
    en: 'Book from your phone, before you fly. No in-person viewing, no German bank account, no Schufa credit record required — the exact things you cannot have yet from Morocco.',
    fr: 'Réservez depuis votre téléphone, avant de partir. Sans visite sur place, sans compte bancaire allemand, sans Schufa — précisément ce que vous ne pouvez pas encore avoir depuis le Maroc.',
    ar: 'احجز من هاتفك قبل السفر. دون معاينة شخصية، دون حساب بنكي ألماني، دون سجل Schufa — وهي بالضبط الأمور التي لا يمكنك امتلاكها بعد من المغرب.',
  } as L3,
  why2: {
    en: 'Get an address for your Anmeldung. Most furnished landlords here register your stay, which unlocks your Anmeldung → tax ID → bank account → SIM card chain in your first weeks.',
    fr: 'Obtenez une adresse pour votre Anmeldung. La plupart des propriétaires meublés déclarent votre séjour, ce qui débloque la chaîne Anmeldung → numéro fiscal → compte bancaire → carte SIM dès les premières semaines.',
    ar: 'احصل على عنوان لتسجيل الإقامة (Anmeldung). معظم مؤجّري السكن المفروش هنا يسجّلون إقامتك، ما يفتح سلسلة: تسجيل العنوان ← الرقم الضريبي ← الحساب البنكي ← شريحة الهاتف في أسابيعك الأولى.',
  } as L3,
  why3: {
    en: 'Rent for 1–12 months, then move. Use the furnished place as a safe base while you search calmly for a long-term unfurnished Wohnung once you are on the ground with income and a bank account.',
    fr: 'Louez pour 1 à 12 mois, puis déménagez. Servez-vous du meublé comme base sûre pendant que vous cherchez tranquillement un logement non meublé à long terme, une fois sur place avec revenus et compte bancaire.',
    ar: 'استأجر من شهر إلى 12 شهراً ثم انتقل. استخدم السكن المفروش كقاعدة آمنة بينما تبحث بهدوء عن شقة غير مفروشة طويلة الأمد بعد أن تستقر ولديك دخل وحساب بنكي.',
  } as L3,
  disclaimer: {
    en: 'GoGermany is independent and not affiliated with these platforms. We link to their public search results so you can compare in one place; always verify the landlord and never pay a deposit outside the platform’s protected checkout.',
    fr: 'GoGermany est indépendant et non affilié à ces plateformes. Nous renvoyons vers leurs résultats publics pour vous permettre de comparer au même endroit ; vérifiez toujours le propriétaire et ne payez jamais de caution en dehors du paiement sécurisé de la plateforme.',
    ar: 'GoGermany مستقلّ وغير تابع لهذه المنصّات. نوفّر روابط لنتائج بحثها العامة لتقارن في مكان واحد؛ تحقّق دائماً من المالك ولا تدفع أي عربون خارج نظام الدفع المحمي الخاص بالمنصّة.',
  } as L3,
}

// Per-platform pitch + chips (URL/city logic lives in lib/housingPlatforms).
const PLATFORM_COPY: Record<HousingPlatformKey, { tagline: L3; chips: L3[] }> = {
  housinganywhere: {
    tagline: {
      en: 'The largest mid-term marketplace for internationals — rooms, studios and flats, with tenant protection on every booking.',
      fr: 'La plus grande place de marché à moyen terme pour internationaux — chambres, studios et appartements, avec protection locataire à chaque réservation.',
      ar: 'أكبر سوق للإيجار متوسط المدة للأجانب — غرف واستوديوهات وشقق، مع حماية للمستأجر في كل حجز.',
    },
    chips: [
      { en: 'Rooms & studios', fr: 'Chambres & studios', ar: 'غرف واستوديوهات' } as L3,
      { en: 'Booking protection', fr: 'Protection de réservation', ar: 'حماية الحجز' } as L3,
    ],
  },
  wunderflats: {
    tagline: {
      en: 'German platform specialising in fully furnished apartments, mostly with Anmeldung possible — great for families and longer mid-term stays.',
      fr: 'Plateforme allemande spécialisée dans les appartements entièrement meublés, souvent avec Anmeldung possible — idéale pour familles et séjours plus longs.',
      ar: 'منصّة ألمانية متخصّصة في الشقق المفروشة بالكامل، غالباً مع إمكانية تسجيل العنوان — مثالية للعائلات والإقامات الأطول.',
    },
    chips: [
      { en: 'Whole apartments', fr: 'Appartements entiers', ar: 'شقق كاملة' } as L3,
      { en: 'Anmeldung often possible', fr: 'Anmeldung souvent possible', ar: 'تسجيل عنوان ممكن غالباً' } as L3,
    ],
  },
  spotahome: {
    tagline: {
      en: 'Every home is video-checked by the platform before it goes live, so you can rent unseen from abroad with more confidence.',
      fr: 'Chaque logement est vérifié en vidéo par la plateforme avant publication : louez à distance en toute confiance.',
      ar: 'يتم التحقّق من كل سكن عبر فيديو من قبل المنصّة قبل نشره، لتستأجر من الخارج دون معاينة وبثقة أكبر.',
    },
    chips: [
      { en: 'Video-verified homes', fr: 'Logements vérifiés en vidéo', ar: 'مساكن موثّقة بالفيديو' } as L3,
      { en: 'Rent unseen', fr: 'Location à distance', ar: 'إيجار دون معاينة' } as L3,
    ],
  },
  nestpick: {
    tagline: {
      en: 'An aggregator that pulls furnished listings from many sites at once — the fastest way to compare what is available before you commit.',
      fr: 'Un agrégateur qui rassemble les annonces meublées de nombreux sites — le moyen le plus rapide de comparer avant de vous engager.',
      ar: 'مجمّع يجمع الإعلانات المفروشة من عدة مواقع دفعة واحدة — أسرع وسيلة لمقارنة المتاح قبل أن تقرّر.',
    },
    chips: [
      { en: 'Compares many sites', fr: 'Compare plusieurs sites', ar: 'يقارن عدة مواقع' } as L3,
      { en: 'Widest choice', fr: 'Choix le plus large', ar: 'أوسع خيار' } as L3,
    ],
  },
}

export default function FurnishedHousing({ locale }: { locale: AppLocale }) {
  const t = <V,>(v: L3<V>) => pick3(locale, v)
  const [slug, setSlug] = useState(HOUSING_CITIES[0].slug)
  const city = HOUSING_CITIES.find((c) => c.slug === slug) ?? HOUSING_CITIES[0]
  const cityName = locale === 'de' ? city.de : city.en

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir={dirFor(locale)}>
      <ToolHero eyebrow={t(T.eyebrow)} title={t(T.title)} subtitle={t(T.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* City picker */}
        <label className="block bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.cityLabel)}</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3 text-base bg-white font-semibold"
          >
            {HOUSING_CITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {locale === 'de' ? c.de : c.en}{c.en !== c.de ? ` · ${c.de}` : ''}
              </option>
            ))}
          </select>
        </label>

        {/* Platform cards */}
        <div className="grid gap-4 mt-4">
          {HOUSING_PLATFORMS.map((p) => {
            const copy = PLATFORM_COPY[p.key]
            const href = housingUrl(p, city)
            return (
              <a
                key={p.key}
                href={href}
                target="_blank"
                rel="noopener sponsored"
                className="group block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all p-5"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-none w-12 h-12 rounded-xl grid place-items-center text-white text-xl font-black"
                    style={{ background: p.accent }}
                    aria-hidden
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900">{p.name}</h3>
                      <span className="text-green-700 font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {cityName} →
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{t(copy.tagline)}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {copy.chips.map((chip, i) => (
                        <span key={i} className="text-xs font-semibold bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                          {t(chip)}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm font-bold text-green-700 mt-4">
                      {t(T.browseIn)} {cityName} →
                    </p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* Why furnished-first */}
        <div className="bg-[var(--bg-warm)] rounded-2xl border border-[var(--line)] p-6 mt-6">
          <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>{t(T.whyTitle)}</h2>
          <ul className="mt-3 grid gap-3">
            {[T.why1, T.why2, T.why3].map((w, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                <span className="flex-none text-green-700 font-black">✓</span>
                <span>{t(w)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">{t(T.disclaimer)}</p>
      </div>
    </div>
  )
}
