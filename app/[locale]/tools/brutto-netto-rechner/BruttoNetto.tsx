'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'

// ── German payroll estimation engine ────────────────────────────────
// Income tax: official §32a EStG progression formula (2025 parameters —
// clearly labelled an estimate; 2026 differs by ~1-2% after the inflation
// adjustment). Social contributions: 2025/26 rates and ceilings.
const GFB = 12096 // Grundfreibetrag

/** Annual income tax per §32a EStG (2025). */
function incomeTax(zvE: number): number {
  const x = Math.floor(zvE)
  if (x <= GFB) return 0
  if (x <= 17443) { const y = (x - GFB) / 10000; return Math.floor((932.3 * y + 1400) * y) }
  if (x <= 68480) { const z = (x - 17443) / 10000; return Math.floor((176.64 * z + 2397) * z + 1015.13) }
  if (x <= 277825) return Math.floor(0.42 * x - 10911.92)
  return Math.floor(0.45 * x - 19246.67)
}

/** Wage tax by class. III = splitting; V/VI = §39b difference method. */
function wageTax(zvE: number, cls: 1 | 2 | 3 | 4 | 5): number {
  if (cls === 3) return 2 * incomeTax(zvE / 2)
  if (cls === 2) return incomeTax(Math.max(0, zvE - 4260)) // Entlastungsbetrag single parents
  if (cls === 5) return Math.max(2 * (incomeTax(zvE * 1.25) - incomeTax(zvE * 0.75)), incomeTax(zvE))
  return incomeTax(zvE)
}

// Social insurance (employee shares, 2025/26): pension 9.3%, unemployment
// 1.3%, health 7.3% + half the average Zusatzbeitrag (2.5%/2), long-term
// care 1.8% base (+0.6% surcharge if childless and 23+).
const BBG_RV_MONTH = 8050    // pension/unemployment ceiling €/month
const BBG_KV_MONTH = 5512.5  // health/care ceiling €/month

function socialContributions(grossMonth: number, childless: boolean) {
  const rvBase = Math.min(grossMonth, BBG_RV_MONTH)
  const kvBase = Math.min(grossMonth, BBG_KV_MONTH)
  return {
    pension: rvBase * 0.093,
    unemployment: rvBase * 0.013,
    health: kvBase * (0.073 + 0.0125),
    care: kvBase * (0.018 + (childless ? 0.006 : 0)),
  }
}

const S = {
  title: { en: 'Brutto → Netto Calculator (Germany)', fr: 'Calculateur Brut → Net (Allemagne)', ar: 'حاسبة الراتب الإجمالي ← الصافي (ألمانيا)' } as L3,
  sub: {
    en: 'What is really left of your German salary after taxes and social insurance? Estimate your net pay in seconds.',
    fr: 'Que reste-t-il vraiment de votre salaire allemand après impôts et cotisations ? Estimez votre net en quelques secondes.',
    ar: 'كم يتبقى فعلاً من راتبك الألماني بعد الضرائب والتأمينات؟ قدّر صافي راتبك في ثوانٍ.',
  } as L3,
  gross: { en: 'Gross salary', fr: 'Salaire brut', ar: 'الراتب الإجمالي' } as L3,
  perMonth: { en: '€ / month', fr: '€ / mois', ar: '€ / شهر' } as L3,
  perYear: { en: '€ / year', fr: '€ / an', ar: '€ / سنة' } as L3,
  taxClass: { en: 'Tax class (Steuerklasse)', fr: 'Classe d’impôt (Steuerklasse)', ar: 'فئة الضريبة (Steuerklasse)' } as L3,
  cls1: { en: 'I — single', fr: 'I — célibataire', ar: 'I — أعزب' } as L3,
  cls2: { en: 'II — single parent', fr: 'II — parent isolé', ar: 'II — والد وحيد' } as L3,
  cls3: { en: 'III — married (higher earner)', fr: 'III — marié·e (revenu principal)', ar: 'III — متزوج (الدخل الأعلى)' } as L3,
  cls4: { en: 'IV — married (similar incomes)', fr: 'IV — marié·e (revenus proches)', ar: 'IV — متزوج (دخلان متقاربان)' } as L3,
  cls5: { en: 'V — married (lower earner)', fr: 'V — marié·e (revenu secondaire)', ar: 'V — متزوج (الدخل الأدنى)' } as L3,
  church: { en: 'Church tax (member of a church)', fr: 'Impôt d’église (membre d’une église)', ar: 'ضريبة الكنيسة (عضو في كنيسة)' } as L3,
  children: { en: 'I have children', fr: 'J’ai des enfants', ar: 'لديّ أطفال' } as L3,
  net: { en: 'Net salary', fr: 'Salaire net', ar: 'الراتب الصافي' } as L3,
  month: { en: 'per month', fr: 'par mois', ar: 'شهرياً' } as L3,
  year: { en: 'per year', fr: 'par an', ar: 'سنوياً' } as L3,
  breakdown: { en: 'Where your money goes (monthly)', fr: 'Où va votre argent (mensuel)', ar: 'أين تذهب أموالك (شهرياً)' } as L3,
  lTax: { en: 'Income tax (Lohnsteuer)', fr: 'Impôt sur le revenu (Lohnsteuer)', ar: 'ضريبة الدخل (Lohnsteuer)' } as L3,
  lChurch: { en: 'Church tax', fr: 'Impôt d’église', ar: 'ضريبة الكنيسة' } as L3,
  lPension: { en: 'Pension (Rentenversicherung)', fr: 'Retraite (Rentenversicherung)', ar: 'التقاعد (Rentenversicherung)' } as L3,
  lHealth: { en: 'Health insurance (GKV)', fr: 'Assurance maladie (GKV)', ar: 'التأمين الصحي (GKV)' } as L3,
  lCare: { en: 'Long-term care (Pflege)', fr: 'Dépendance (Pflege)', ar: 'تأمين الرعاية (Pflege)' } as L3,
  lUnemp: { en: 'Unemployment (AV)', fr: 'Chômage (AV)', ar: 'البطالة (AV)' } as L3,
  effective: { en: 'Total deductions', fr: 'Prélèvements totaux', ar: 'إجمالي الاقتطاعات' } as L3,
  disclaimer: {
    en: 'Estimate using the 2025 §32a tax formula and 2025/26 contribution rates — real payroll varies (Zusatzbeitrag of your Krankenkasse, allowances, Soli on very high incomes). Not tax advice.',
    fr: 'Estimation basée sur la formule fiscale §32a 2025 et les taux 2025/26 — la paie réelle varie (Zusatzbeitrag de votre caisse, abattements, Soli sur très hauts revenus). Pas un conseil fiscal.',
    ar: 'تقدير وفق معادلة الضريبة §32a لسنة 2025 ومعدلات 2025/26 — قد يختلف الراتب الفعلي. ليست استشارة ضريبية.',
  } as L3,
  ctaCompare: { en: 'Compare cities’ living costs →', fr: 'Comparez le coût de la vie des villes →', ar: 'قارن تكلفة المعيشة بين المدن ←' } as L3,
}

const CLASSES: { v: 1 | 2 | 3 | 4 | 5; label: L3 }[] = [
  { v: 1, label: S.cls1 }, { v: 2, label: S.cls2 }, { v: 3, label: S.cls3 }, { v: 4, label: S.cls4 }, { v: 5, label: S.cls5 },
]

export default function BruttoNetto({ locale }: { locale: AppLocale }) {
  const t = <T,>(v: L3<T>) => pick3(locale, v)
  const dir = dirFor(locale)
  const fmt = useMemo(() => new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 0 }), [locale])

  const [grossMonth, setGrossMonth] = useState(3200)
  const [period, setPeriod] = useState<'month' | 'year'>('month')
  const [cls, setCls] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [church, setChurch] = useState(false)
  const [children, setChildren] = useState(false)

  const r = useMemo(() => {
    const gm = Math.max(0, grossMonth)
    const social = socialContributions(gm, !children)
    const socialSum = social.pension + social.unemployment + social.health + social.care
    // Taxable income: gross minus deductible social insurance (simplified
    // Vorsorgepauschale), employee lump sum (1,230) and special expenses (36).
    const zvE = Math.max(0, gm * 12 - socialSum * 12 - 1230 - 36)
    const taxYear = wageTax(zvE, cls)
    const churchYear = church ? taxYear * 0.09 : 0
    const taxMonth = taxYear / 12
    const churchMonth = churchYear / 12
    const net = gm - socialSum - taxMonth - churchMonth
    return { social, socialSum, taxMonth, churchMonth, net, deductions: gm - net, gm }
  }, [grossMonth, cls, church, children])

  const rows = [
    { label: S.lTax, v: r.taxMonth, color: 'bg-red-400' },
    ...(church ? [{ label: S.lChurch, v: r.churchMonth, color: 'bg-red-300' }] : []),
    { label: S.lPension, v: r.social.pension, color: 'bg-blue-400' },
    { label: S.lHealth, v: r.social.health, color: 'bg-teal-400' },
    { label: S.lCare, v: r.social.care, color: 'bg-teal-300' },
    { label: S.lUnemp, v: r.social.unemployment, color: 'bg-blue-300' },
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">🧮 {t(S.title)}</h1>
        <p className="mt-2 text-gray-600">{t(S.sub)}</p>

        {/* Gross input */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.gross)}</h2>
        <div className="flex gap-2">
          <input
            type="number" min={0} step={50}
            value={period === 'month' ? grossMonth : grossMonth * 12}
            onChange={(e) => { const v = Math.max(0, Number(e.target.value) || 0); setGrossMonth(period === 'month' ? v : v / 12) }}
            className="flex-1 min-w-0 border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:border-green-500"
            dir="ltr"
          />
          <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden shrink-0">
            {(['month', 'year'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 text-xs font-semibold ${period === p ? 'bg-green-600 text-white' : 'bg-white text-gray-500'}`}>
                {p === 'month' ? t(S.perMonth) : t(S.perYear)}
              </button>
            ))}
          </div>
        </div>

        {/* Tax class */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.taxClass)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CLASSES.map(({ v, label }) => (
            <button key={v} onClick={() => setCls(v)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm text-start transition-colors ${cls === v ? 'border-green-500 bg-green-50 text-green-800 font-semibold' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}>
              {t(label)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 cursor-pointer text-sm ${church ? 'border-green-400' : 'border-gray-200'} bg-white`}>
            <input type="checkbox" checked={church} onChange={(e) => setChurch(e.target.checked)} className="accent-green-600" />
            <span className="text-gray-800">⛪ {t(S.church)} (9 %)</span>
          </label>
          <label className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 cursor-pointer text-sm ${children ? 'border-green-400' : 'border-gray-200'} bg-white`}>
            <input type="checkbox" checked={children} onChange={(e) => setChildren(e.target.checked)} className="accent-green-600" />
            <span className="text-gray-800">👶 {t(S.children)}</span>
          </label>
        </div>

        {/* Result */}
        <div className="mt-8 rounded-2xl border-2 border-green-300 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">{t(S.net)}</p>
          <p className="text-4xl font-black text-green-700 mt-1" dir="ltr">{fmt.format(Math.round(r.net))} €</p>
          <p className="text-xs text-gray-400">{t(S.month)} · <span dir="ltr">{fmt.format(Math.round(r.net * 12))} €</span> {t(S.year)}</p>
          {/* gross→net bar */}
          <div className="w-full bg-red-100 rounded-full h-3 mt-4 overflow-hidden" dir="ltr">
            <div className="bg-green-500 h-3" style={{ width: `${r.gm > 0 ? (r.net / r.gm) * 100 : 0}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{t(S.effective)}: {fmt.format(Math.round(r.deductions))} € ({r.gm > 0 ? Math.round((r.deductions / r.gm) * 100) : 0} %)</p>
        </div>

        {/* Breakdown */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.breakdown)}</h2>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-3">
          {rows.map((row, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">{t(row.label)}</span>
                <span className="font-semibold text-gray-800" dir="ltr">−{fmt.format(Math.round(row.v))} €</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2" dir="ltr">
                <div className={`${row.color} h-2 rounded-full`} style={{ width: `${r.gm > 0 ? Math.min(100, (row.v / r.gm) * 100 * 3) : 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mt-6">
          <Link href="/tools/city-comparator" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaCompare)}</Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">{t(S.disclaimer)}</p>
      </div>
    </div>
  )
}
