'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'
import ToolHero from '@/components/tools/ToolHero'

// Gross monthly training pay (2026 tariff averages, rounded) per Lehrjahr +
// typical gross starting salary after graduation. Sources: BIBB tariff data
// and public collective agreements — estimates, actual pay varies by
// employer, region and tariff.
type Prof = { de: string; years: number[]; start: number }
const PROFESSIONS: Prof[] = [
  { de: 'Pflegefachmann/-frau', years: [1340, 1400, 1500], start: 3800 },
  { de: 'KFZ-Mechatroniker/in', years: [1050, 1100, 1200, 1250], start: 3100 },
  { de: 'Elektroniker/in', years: [1100, 1150, 1250, 1300], start: 3300 },
  { de: 'Fachinformatiker/in', years: [1150, 1250, 1350], start: 3600 },
  { de: 'Anlagenmechaniker/in SHK', years: [1000, 1100, 1200, 1300], start: 3300 },
  { de: 'Mechatroniker/in', years: [1150, 1200, 1300, 1350], start: 3500 },
  { de: 'Zerspanungsmechaniker/in', years: [1150, 1200, 1300, 1350], start: 3400 },
  { de: 'Industriekaufmann/-frau', years: [1150, 1250, 1350], start: 3400 },
  { de: 'Bankkaufmann/-frau', years: [1250, 1300, 1400], start: 3600 },
  { de: 'Kaufmann/-frau Büromanagement', years: [1100, 1200, 1300], start: 3000 },
  { de: 'Kaufmann/-frau im Einzelhandel', years: [1150, 1250, 1350], start: 2900 },
  { de: 'Verkäufer/in', years: [1150, 1250], start: 2700 },
  { de: 'Hotelfachmann/-frau', years: [1100, 1200, 1300], start: 2800 },
  { de: 'Koch/Köchin', years: [1100, 1200, 1300], start: 2900 },
  { de: 'Bäcker/in', years: [950, 1050, 1200], start: 2800 },
  { de: 'Medizinische/r Fachangestellte/r (MFA)', years: [1000, 1100, 1150], start: 2700 },
  { de: 'Zahnmedizinische/r Fachangestellte/r', years: [1000, 1050, 1150], start: 2600 },
  { de: 'Fachkraft für Lagerlogistik', years: [1100, 1200, 1300], start: 3000 },
  { de: 'Berufskraftfahrer/in (LKW/Bus)', years: [1100, 1200, 1300], start: 3200 },
  { de: 'Maurer/in', years: [1180, 1370, 1580], start: 3600 },
  { de: 'Dachdecker/in', years: [950, 1150, 1400], start: 3400 },
  { de: 'Maler/in & Lackierer/in', years: [900, 1000, 1150], start: 2900 },
  { de: 'Gärtner/in (GaLaBau)', years: [1100, 1200, 1300], start: 2900 },
  { de: 'Friseur/in', years: [750, 850, 1000], start: 2300 },
]

// Training pay sits below the income-tax threshold in almost all cases, so
// net ≈ gross minus employee social contributions (~20.4%).
const SOCIAL = 0.204

const T = {
  eyebrow: { en: 'Ausbildung salary', fr: 'Salaire Ausbildung', ar: 'راتب الأوسبيلدونغ' } as L3,
  title: { en: 'Ausbildung Salary Explorer', fr: 'Salaires en Ausbildung', ar: 'رواتب الأوسبيلدونغ' } as L3,
  sub: {
    en: 'What each apprenticeship really pays — per training year, net estimate, and the starting salary after you qualify.',
    fr: 'Ce que chaque formation paie vraiment — par année, estimation du net, et le salaire de départ une fois diplômé.',
    ar: 'ما تدفعه كل مهنة فعلياً — حسب سنة التكوين، مع تقدير الصافي وراتب البداية بعد التخرج.',
  } as L3,
  search: { en: 'Search a profession…', fr: 'Cherchez un métier…', ar: 'ابحث عن مهنة…' } as L3,
  year: { en: 'Year', fr: 'Année', ar: 'السنة' } as L3,
  gross: { en: 'gross/month', fr: 'brut/mois', ar: 'إجمالي/شهر' } as L3,
  netY1: { en: '≈ net in year 1', fr: '≈ net en 1ʳᵉ année', ar: '≈ الصافي في السنة الأولى' } as L3,
  start: { en: 'Typical starting salary after the Ausbildung', fr: 'Salaire de départ typique après l’Ausbildung', ar: 'راتب البداية المعتاد بعد الأوسبيلدونغ' } as L3,
  startNote: { en: 'gross/month, rises with experience', fr: 'brut/mois, augmente avec l’expérience', ar: 'إجمالي شهرياً، يرتفع مع الخبرة' } as L3,
  jobsCta: { en: 'See live offers for this profession', fr: 'Voir les offres en direct pour ce métier', ar: 'شاهد العروض الحية لهذه المهنة' } as L3,
  netCta: { en: 'Compute the exact net with our Brutto-Netto calculator', fr: 'Calculez le net exact avec notre calculateur brut-net', ar: 'احسب الصافي بدقة عبر حاسبة الراتب الصافي' } as L3,
  disclaimer: {
    en: 'Tariff averages (2026), rounded. Actual pay varies by employer, region and collective agreement. The legal minimum training wage is ~€680/month in year 1.',
    fr: 'Moyennes tarifaires (2026), arrondies. La rémunération réelle varie selon l’employeur, la région et la convention. Le minimum légal est d’environ 680 €/mois en 1ʳᵉ année.',
    ar: 'متوسطات اتفاقيات 2026 مقرّبة. يختلف الأجر الفعلي حسب المشغّل والمنطقة والاتفاقية. الحد الأدنى القانوني نحو 680 € شهرياً في السنة الأولى.',
  } as L3,
}

export default function SalaryExplorer({ locale }: { locale: AppLocale }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Prof>(PROFESSIONS[0])
  const t = <V,>(v: L3<V>) => pick3(locale, v)
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })

  const filtered = useMemo(
    () => PROFESSIONS.filter((p) => p.de.toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  const maxPay = Math.max(...selected.years)

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir={dirFor(locale)}>
      <ToolHero eyebrow={t(T.eyebrow)} title={t(T.title)} subtitle={t(T.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(T.search)}
          className="w-full mt-6 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {filtered.map((p) => (
            <button
              key={p.de}
              type="button"
              onClick={() => setSelected(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selected.de === p.de
                  ? 'bg-green-700 border-green-700 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-green-500'
              }`}
              lang="de"
            >
              {p.de}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900" lang="de">{selected.de}</h2>

          <div className="mt-4 flex flex-col gap-2">
            {selected.years.map((pay, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 shrink-0">{t(T.year)} {i + 1}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-end px-2"
                    style={{ width: `${Math.max(30, (pay / maxPay) * 100)}%` }}
                  >
                    <span className="text-[11px] font-bold text-white whitespace-nowrap">{nf.format(pay)} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-2">{t(T.gross)}</p>

          <div className="grid sm:grid-cols-2 gap-3 mt-5">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">{t(T.netY1)}</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {nf.format(Math.round(selected.years[0] * (1 - SOCIAL)))} €
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-green-800">{t(T.start)}</p>
              <p className="text-2xl font-black text-green-800 mt-1">{nf.format(selected.start)} €</p>
              <p className="text-[11px] text-green-700">{t(T.startNote)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-5">
            <Link
              href="/ausbildung-jobs"
              className="block text-center bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl px-5 py-3 text-sm transition-colors"
            >
              {t(T.jobsCta)} →
            </Link>
            <Link
              href="/tools/brutto-netto-rechner"
              className="block text-center bg-white border border-gray-300 hover:border-green-500 text-gray-700 font-semibold rounded-xl px-5 py-3 text-sm transition-colors"
            >
              {t(T.netCta)}
            </Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">{t(T.disclaimer)}</p>
      </div>
    </div>
  )
}
