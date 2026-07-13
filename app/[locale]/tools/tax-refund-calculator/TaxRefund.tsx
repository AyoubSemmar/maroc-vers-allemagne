'use client'

import { useState } from 'react'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'
import ToolHero from '@/components/tools/ToolHero'

// Partner links — env-swappable once affiliate accounts are approved.
const APPS = [
  { name: 'Taxfix', url: process.env.NEXT_PUBLIC_AFF_TAXFIX_URL || 'https://taxfix.de/' },
  { name: 'Wundertax', url: process.env.NEXT_PUBLIC_AFF_WUNDERTAX_URL || 'https://wundertax.de/' },
]

// §32a EStG income tax 2025 (zvE = taxable income, annual).
function incomeTax(zvE: number): number {
  const x = Math.floor(zvE)
  if (x <= 12096) return 0
  if (x <= 17443) { const y = (x - 12096) / 10000; return Math.floor((932.3 * y + 1400) * y) }
  if (x <= 68480) { const z = (x - 17443) / 10000; return Math.floor((176.64 * z + 2397) * z + 1015.13) }
  if (x <= 277825) return Math.floor(0.42 * x - 10911.92)
  return Math.floor(0.45 * x - 19246.67)
}

function taxByClass(zvE: number, cls: '1' | '2' | '3' | '4'): number {
  if (cls === '3') return 2 * incomeTax(zvE / 2) // splitting
  if (cls === '2') return incomeTax(Math.max(0, zvE - 4260)) // single-parent relief
  return incomeTax(zvE)
}

const PAUSCHALE = 1230 // Werbungskosten flat allowance

const T = {
  eyebrow: { en: 'Tax refund', fr: 'Remboursement d’impôts', ar: 'استرجاع الضرائب' } as L3,
  title: { en: 'German Tax Refund Estimator', fr: 'Estimateur de remboursement d’impôts allemand', ar: 'حاسبة استرجاع الضرائب في ألمانيا' } as L3,
  sub: { en: 'The average German tax return brings back ~€1,100. Enter your numbers and see what a Steuererklärung would likely return to you.', fr: 'La déclaration d’impôts allemande rapporte en moyenne ~1 100 €. Entrez vos chiffres et estimez ce qu’une Steuererklärung vous rendrait.', ar: 'يعيد التصريح الضريبي الألماني في المتوسط نحو 1100 €. أدخل أرقامك وقدّر ما قد تسترجعه من Steuererklärung.' } as L3,
  gross: { en: 'Gross annual salary (€)', fr: 'Salaire brut annuel (€)', ar: 'الراتب الإجمالي السنوي (€)' } as L3,
  cls: { en: 'Tax class', fr: 'Classe d’impôt', ar: 'الفئة الضريبية' } as L3,
  commute: { en: 'Commute one-way (km)', fr: 'Trajet domicile-travail aller (km)', ar: 'مسافة الذهاب للعمل (كلم)' } as L3,
  days: { en: 'Office days / year', fr: 'Jours au bureau / an', ar: 'أيام العمل الحضوري سنوياً' } as L3,
  homeoffice: { en: 'Home-office days / year', fr: 'Jours de télétravail / an', ar: 'أيام العمل من المنزل سنوياً' } as L3,
  equipment: { en: 'Work equipment bought (€) — laptop, desk, phone…', fr: 'Matériel de travail acheté (€) — ordinateur, bureau, téléphone…', ar: 'معدات عمل اشتريتها (€) — حاسوب، مكتب، هاتف…' } as L3,
  education: { en: 'Job-related courses / German classes (€)', fr: 'Formations / cours d’allemand liés au travail (€)', ar: 'دورات مهنية / دروس ألمانية (€)' } as L3,
  moved: { en: 'I moved to Germany (or moved cities) for this job', fr: 'J’ai déménagé en Allemagne (ou changé de ville) pour ce travail', ar: 'انتقلت إلى ألمانيا (أو غيّرت المدينة) من أجل هذا العمل' } as L3,
  result: { en: 'Estimated refund', fr: 'Remboursement estimé', ar: 'الاسترجاع المقدَّر' } as L3,
  deductions: { en: 'Your deductible job costs', fr: 'Vos frais professionnels déductibles', ar: 'مصاريفك المهنية القابلة للخصم' } as L3,
  aboveFlat: { en: 'above the €1,230 flat allowance', fr: 'au-dessus du forfait de 1 230 €', ar: 'فوق المبلغ الجزافي 1230 €' } as L3,
  flatNote: { en: 'Your costs stay under the €1,230 flat allowance every employee gets automatically — a refund is still common through over-withheld wage tax, church tax or insurance items.', fr: 'Vos frais restent sous le forfait de 1 230 € accordé automatiquement — un remboursement reste fréquent via l’impôt retenu en trop, la taxe d’église ou les assurances.', ar: 'مصاريفك تبقى تحت المبلغ الجزافي 1230 € الممنوح تلقائياً — ومع ذلك يشيع الاسترجاع عبر الضريبة المقتطعة الزائدة أو ضريبة الكنيسة أو التأمينات.' } as L3,
  cta: { en: 'File in ~30 minutes with an English-friendly tax app', fr: 'Déclarez en ~30 minutes avec une appli fiscale', ar: 'قدّم تصريحك في نحو 30 دقيقة عبر تطبيق ضريبي' } as L3,
  disclaimer: { en: 'Simplified estimate (2025 tax formula, employee deductions only) — not tax advice. The actual refund depends on your full situation; four years back can still be filed voluntarily.', fr: 'Estimation simplifiée (formule 2025, frais salariés uniquement) — pas un conseil fiscal. Le montant réel dépend de votre situation complète ; une déclaration volontaire reste possible 4 ans en arrière.', ar: 'تقدير مبسّط (معادلة 2025، خصومات الموظفين فقط) — ليس نصيحة ضريبية. يعتمد المبلغ الفعلي على وضعك الكامل؛ ويمكن التقديم طوعاً عن أربع سنوات سابقة.' } as L3,
}

export default function TaxRefund({ locale }: { locale: AppLocale }) {
  const t = <V,>(v: L3<V>) => pick3(locale, v)
  const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })

  const [gross, setGross] = useState(42000)
  const [cls, setCls] = useState<'1' | '2' | '3' | '4'>('1')
  const [km, setKm] = useState(15)
  const [days, setDays] = useState(200)
  const [ho, setHo] = useState(0)
  const [equipment, setEquipment] = useState(300)
  const [education, setEducation] = useState(0)
  const [moved, setMoved] = useState(false)

  // Werbungskosten: commute €0.30/km (€0.38 from km 21), home office €6/day
  // (max €1,260), equipment, education, moving flat rate €964.
  const commuteCost = Math.min(km, 20) * 0.3 * days + Math.max(0, km - 20) * 0.38 * days
  const hoCost = Math.min(ho * 6, 1260)
  const totalCosts = Math.round(commuteCost + hoCost + equipment + education + (moved ? 964 : 0))
  const extra = Math.max(0, totalCosts - PAUSCHALE)

  // zvE approximation: gross minus flat allowance minus ~12% social security
  // deduction (Vorsorgepauschale, simplified).
  const zvE = Math.max(0, gross - PAUSCHALE - gross * 0.12)
  const refund = Math.max(0, taxByClass(zvE, cls) - taxByClass(Math.max(0, zvE - extra), cls))

  const num = (v: number, set: (n: number) => void, min = 0) => (
    (e: React.ChangeEvent<HTMLInputElement>) => set(Math.max(min, Number(e.target.value) || 0))
  )

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <ToolHero eyebrow={t(T.eyebrow)} title={t(T.title)} subtitle={t(T.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6 grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.gross)}</span>
            <input type="number" value={gross} onChange={num(gross, setGross)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.cls)}</span>
            <select value={cls} onChange={(e) => setCls(e.target.value as any)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white">
              <option value="1">I</option><option value="2">II</option><option value="3">III</option><option value="4">IV</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.commute)}</span>
            <input type="number" value={km} onChange={num(km, setKm)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.days)}</span>
            <input type="number" value={days} onChange={num(days, setDays)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.homeoffice)}</span>
            <input type="number" value={ho} onChange={num(ho, setHo)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.equipment)}</span>
            <input type="number" value={equipment} onChange={num(equipment, setEquipment)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.education)}</span>
            <input type="number" value={education} onChange={num(education, setEducation)} className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer sm:col-span-2">
            <input type="checkbox" checked={moved} onChange={(e) => setMoved(e.target.checked)} className="w-4 h-4 accent-green-700" />
            {t(T.moved)}
          </label>
        </div>

        <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-6 mt-4 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-green-200">{t(T.result)}</p>
          <p className="text-4xl font-black mt-1">≈ {nf.format(refund)} €</p>
          <p className="text-sm text-green-100 mt-2">
            {t(T.deductions)}: {nf.format(totalCosts)} € {extra > 0 ? `(+${nf.format(extra)} € ${t(T.aboveFlat)})` : ''}
          </p>
          {extra === 0 && <p className="text-xs text-green-100 mt-2 leading-relaxed">{t(T.flatNote)}</p>}
          <p className="text-xs font-bold text-green-200 mt-4">{t(T.cta)}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {APPS.map((a) => (
              <a key={a.name} href={a.url} target="_blank" rel="noopener sponsored"
                className="bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-full px-4 py-2 transition-colors">
                {a.name} ↗
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">{t(T.disclaimer)}</p>
      </div>
    </div>
  )
}
