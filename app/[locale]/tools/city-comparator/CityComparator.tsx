'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import ToolHero from '@/components/tools/ToolHero'
import { pick3, type L3 } from '@/lib/toolStrings'
import { calculate, type AccommodationKey, type CityKey, type LifestyleKey } from '@/lib/livingCostData'

const CITY_LABEL: Record<CityKey, string> = {
  munich: 'Munich · München', frankfurt: 'Frankfurt', hamburg: 'Hamburg', stuttgart: 'Stuttgart',
  dusseldorf: 'Düsseldorf', cologne: 'Cologne · Köln', berlin: 'Berlin', hannover: 'Hannover',
  bremen: 'Bremen', nuremberg: 'Nuremberg · Nürnberg', dortmund: 'Dortmund', leipzig: 'Leipzig',
  dresden: 'Dresden', bochum: 'Bochum', chemnitz: 'Chemnitz',
}
const CITY_KEYS = Object.keys(CITY_LABEL) as CityKey[]

const S = {
  eyebrow: { en: 'City comparison', fr: 'Comparateur de villes', ar: 'مقارنة المدن' } as L3,
  title: { en: 'German City Comparator', fr: 'Comparateur de villes allemandes', ar: 'مقارنة المدن الألمانية' } as L3,
  sub: {
    en: 'Berlin or Leipzig? Munich or Dortmund? Compare two cities’ real monthly costs side by side and see what you’d save per year.',
    fr: 'Berlin ou Leipzig ? Munich ou Dortmund ? Comparez les coûts mensuels réels de deux villes et voyez l’économie annuelle.',
    ar: 'برلين أم لايبزيغ؟ ميونخ أم دورتموند؟ قارن التكاليف الشهرية الحقيقية لمدينتين وشاهد ما ستوفره سنوياً.',
  } as L3,
  cityA: { en: 'City A', fr: 'Ville A', ar: 'المدينة أ' } as L3,
  cityB: { en: 'City B', fr: 'Ville B', ar: 'المدينة ب' } as L3,
  housing: { en: 'Your housing', fr: 'Votre logement', ar: 'سكنك' } as L3,
  hOpts: {
    en: { dormitory: '🏠 Dorm', shared: '👥 Shared flat (WG)', studio: '🛏️ Studio', apartment: '🏢 Apartment' },
    fr: { dormitory: '🏠 Résidence', shared: '👥 Colocation (WG)', studio: '🛏️ Studio', apartment: '🏢 Appartement' },
    ar: { dormitory: '🏠 سكن جامعي', shared: '👥 سكن مشترك (WG)', studio: '🛏️ استوديو', apartment: '🏢 شقة' },
  } as L3<Record<AccommodationKey, string>>,
  lifestyle: { en: 'Lifestyle', fr: 'Style de vie', ar: 'نمط الحياة' } as L3,
  lOpts: {
    en: { budget: '💰 Budget', moderate: '⚖️ Moderate', comfortable: '✨ Comfortable' },
    fr: { budget: '💰 Économe', moderate: '⚖️ Modéré', comfortable: '✨ Confortable' },
    ar: { budget: '💰 اقتصادي', moderate: '⚖️ متوسط', comfortable: '✨ مريح' },
  } as L3<Record<LifestyleKey, string>>,
  rent: { en: 'Rent', fr: 'Loyer', ar: 'الكراء' } as L3,
  food: { en: 'Food', fr: 'Nourriture', ar: 'الطعام' } as L3,
  transport: { en: 'Transport', fr: 'Transport', ar: 'النقل' } as L3,
  utilities: { en: 'Utilities & internet', fr: 'Charges & internet', ar: 'الفواتير والإنترنت' } as L3,
  insurance: { en: 'Health insurance', fr: 'Assurance santé', ar: 'التأمين الصحي' } as L3,
  fun: { en: 'Leisure', fr: 'Loisirs', ar: 'الترفيه' } as L3,
  total: { en: 'Total / month', fr: 'Total / mois', ar: 'المجموع / شهر' } as L3,
  verdict: (city: string, monthly: string, yearly: string): L3 => ({
    en: `${city} is cheaper: you save ~${monthly} €/month — that’s ~${yearly} € per year.`,
    fr: `${city} est moins chère : ~${monthly} €/mois d’économie — soit ~${yearly} € par an.`,
    ar: `${city} أرخص: توفر نحو ${monthly} € شهرياً — أي نحو ${yearly} € سنوياً.`,
  }),
  same: { en: 'Both cities cost about the same for this profile.', fr: 'Les deux villes coûtent à peu près pareil pour ce profil.', ar: 'تكلفة المدينتين متقاربة لهذا النمط.' } as L3,
  ctaLcc: { en: 'Full living-cost calculator →', fr: 'Calculateur complet du coût de la vie →', ar: 'الحاسبة الكاملة لتكلفة المعيشة ←' } as L3,
  ctaNet: { en: 'What salary do you need? Brutto→Netto →', fr: 'Quel salaire vous faut-il ? Brut→Net →', ar: 'ما الراتب الذي تحتاجه؟ إجمالي←صافي ←' } as L3,
  disclaimer: { en: '2026 estimates for a single person (mid-range rents). Your numbers will vary by neighborhood and habits.', fr: 'Estimations 2026 pour une personne seule (loyers médians). Vos chiffres varieront selon le quartier et les habitudes.', ar: 'تقديرات 2026 لشخص واحد (كراء متوسط). قد تختلف أرقامك حسب الحي والعادات.' } as L3,
}

export default function CityComparator({ locale }: { locale: AppLocale }) {
  const t = <T,>(v: L3<T>) => pick3(locale, v)
  const dir = dirFor(locale)
  const fmt = useMemo(() => new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 0 }), [locale])

  const [a, setA] = useState<CityKey>('munich')
  const [b, setB] = useState<CityKey>('leipzig')
  const [acc, setAcc] = useState<AccommodationKey>('shared')
  const [life, setLife] = useState<LifestyleKey>('moderate')

  const [ra, rb] = useMemo(() => {
    const input = { accommodation: acc, lifestyle: life, stipendMonthlyEur: 0, withPartner: false }
    return [calculate({ ...input, city: a }), calculate({ ...input, city: b })]
  }, [a, b, acc, life])

  const rows: { label: L3; ka: number; kb: number }[] = [
    { label: S.rent, ka: ra.rent, kb: rb.rent },
    { label: S.food, ka: ra.food, kb: rb.food },
    { label: S.transport, ka: ra.transport, kb: rb.transport },
    { label: S.utilities, ka: ra.utilities, kb: rb.utilities },
    { label: S.insurance, ka: ra.insurance, kb: rb.insurance },
    { label: S.fun, ka: ra.entertainment, kb: rb.entertainment },
  ]
  const diff = ra.total - rb.total
  const cheaper = diff > 0 ? CITY_LABEL[b] : CITY_LABEL[a]

  const citySelect = (value: CityKey, set: (v: CityKey) => void, label: string) => (
    <label className="flex-1 min-w-0">
      <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value as CityKey)}
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 bg-white focus:outline-none focus:border-green-500">
        {CITY_KEYS.map((k) => <option key={k} value={k}>{CITY_LABEL[k]}</option>)}
      </select>
    </label>
  )

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <ToolHero eyebrow={t(S.eyebrow)} title={t(S.title)} subtitle={t(S.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex gap-3 mt-8">
          {citySelect(a, setA, t(S.cityA))}
          <span className="self-end pb-2 text-gray-300 font-black">VS</span>
          {citySelect(b, setB, t(S.cityB))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <label>
            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{t(S.housing)}</span>
            <select value={acc} onChange={(e) => setAcc(e.target.value as AccommodationKey)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-green-500">
              {(Object.keys(t(S.hOpts)) as AccommodationKey[]).map((k) => <option key={k} value={k}>{t(S.hOpts)[k]}</option>)}
            </select>
          </label>
          <label>
            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">{t(S.lifestyle)}</span>
            <select value={life} onChange={(e) => setLife(e.target.value as LifestyleKey)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-green-500">
              {(Object.keys(t(S.lOpts)) as LifestyleKey[]).map((k) => <option key={k} value={k}>{t(S.lOpts)[k]}</option>)}
            </select>
          </label>
        </div>

        {/* Comparison table */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] text-sm">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100" />
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-800 text-end">{CITY_LABEL[a].split(' ·')[0]}</div>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-800 text-end">{CITY_LABEL[b].split(' ·')[0]}</div>
            {rows.map((row, i) => {
              const aWins = row.ka < row.kb, bWins = row.kb < row.ka
              return [
                <div key={`l${i}`} className="px-4 py-2.5 border-b border-gray-50 text-gray-600">{t(row.label)}</div>,
                <div key={`a${i}`} className={`px-4 py-2.5 border-b border-gray-50 text-end font-semibold ${aWins ? 'text-green-700' : 'text-gray-800'}`} dir="ltr">{fmt.format(Math.round(row.ka))} €</div>,
                <div key={`b${i}`} className={`px-4 py-2.5 border-b border-gray-50 text-end font-semibold ${bWins ? 'text-green-700' : 'text-gray-800'}`} dir="ltr">{fmt.format(Math.round(row.kb))} €</div>,
              ]
            })}
            <div className="px-4 py-3 font-bold text-gray-900 bg-gray-50">{t(S.total)}</div>
            <div className={`px-4 py-3 text-end font-black bg-gray-50 ${ra.total <= rb.total ? 'text-green-700' : 'text-gray-900'}`} dir="ltr">{fmt.format(Math.round(ra.total))} €</div>
            <div className={`px-4 py-3 text-end font-black bg-gray-50 ${rb.total <= ra.total ? 'text-green-700' : 'text-gray-900'}`} dir="ltr">{fmt.format(Math.round(rb.total))} €</div>
          </div>
        </div>

        {/* Verdict */}
        <div className="mt-4 rounded-2xl border-2 border-green-300 bg-green-50 p-5 text-sm font-semibold text-green-900">
          {Math.abs(diff) < 30
            ? t(S.same)
            : '💡 ' + t(S.verdict(cheaper.split(' ·')[0], fmt.format(Math.round(Math.abs(diff))), fmt.format(Math.round(Math.abs(diff) * 12))))}
        </div>

        <div className="flex gap-2 flex-wrap mt-6">
          <Link href="/tools/living-cost-calculator" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaLcc)}</Link>
          <Link href="/tools/brutto-netto-rechner" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaNet)}</Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">{t(S.disclaimer)}</p>
      </div>
    </div>
  )
}
