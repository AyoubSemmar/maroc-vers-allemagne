'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, SPERRKONTO_PROVIDERS, type L3 } from '@/lib/toolStrings'

// 2026 monthly requirement (BAFin/BAMF): students 992 €/mo; Chancenkarte /
// job seekers ~1,027 €/mo. Kept as named constants so the yearly bump is a
// one-line change.
const MONTHLY = { student: 992, chancenkarte: 1027, language: 992 } as const

const S = {
  title: { en: 'Sperrkonto (Blocked Account) Calculator', fr: 'Calculateur de compte bloqué (Sperrkonto)', ar: 'حاسبة الحساب المجمّد (Sperrkonto)' } as L3,
  sub: {
    en: 'How much money do you really need for your German visa? Blocked account + one-time costs, computed for 2026.',
    fr: 'De combien avez-vous réellement besoin pour votre visa allemand ? Compte bloqué + frais uniques, calculés pour 2026.',
    ar: 'كم تحتاج فعلاً من المال لتأشيرتك الألمانية؟ الحساب المجمّد + التكاليف لمرة واحدة، محسوبة لسنة 2026.',
  } as L3,
  purpose: { en: 'Visa type', fr: 'Type de visa', ar: 'نوع التأشيرة' } as L3,
  student: { en: '🎓 Student / Studienkolleg', fr: '🎓 Étudiant / Studienkolleg', ar: '🎓 طالب / Studienkolleg' } as L3,
  ck: { en: '🃏 Chancenkarte (job seeker)', fr: '🃏 Chancenkarte (recherche d’emploi)', ar: '🃏 بطاقة الفرص (باحث عن عمل)' } as L3,
  language: { en: '🗣️ Language course', fr: '🗣️ Cours de langue', ar: '🗣️ دورة لغة' } as L3,
  months: { en: 'Months to cover', fr: 'Mois à couvrir', ar: 'عدد الأشهر' } as L3,
  extras: { en: 'One-time costs (before departure)', fr: 'Frais uniques (avant le départ)', ar: 'تكاليف لمرة واحدة (قبل السفر)' } as L3,
  visaFee: { en: 'Visa fee (national D-visa)', fr: 'Frais de visa (visa national D)', ar: 'رسوم التأشيرة (فئة D)' } as L3,
  insurance: { en: 'Health insurance until enrolment (~2 months incoming)', fr: 'Assurance santé avant l’inscription (~2 mois)', ar: 'تأمين صحي حتى التسجيل (~شهران)' } as L3,
  flight: { en: 'Flight estimate', fr: 'Estimation du vol', ar: 'تقدير ثمن الطائرة' } as L3,
  translations: { en: 'Certified translations & apostilles', fr: 'Traductions assermentées & apostilles', ar: 'ترجمات محلفة وتصديقات' } as L3,
  uniAssist: { en: 'uni-assist / application fees', fr: 'Frais uni-assist / candidatures', ar: 'رسوم uni-assist / الترشيحات' } as L3,
  firstMonth: { en: 'First weeks in Germany (deposit, transport…)', fr: 'Premières semaines en Allemagne (caution, transport…)', ar: 'الأسابيع الأولى في ألمانيا (ضمان السكن، النقل…)' } as L3,
  blocked: { en: 'Blocked account amount', fr: 'Montant du compte bloqué', ar: 'مبلغ الحساب المجمّد' } as L3,
  monthlyRate: { en: '€/month × ', fr: '€/mois × ', ar: '€/شهر × ' } as L3,
  oneTime: { en: 'One-time costs', fr: 'Frais uniques', ar: 'التكاليف لمرة واحدة' } as L3,
  total: { en: 'Total you should budget', fr: 'Budget total à prévoir', ar: 'الميزانية الإجمالية المطلوبة' } as L3,
  monthlyBack: { en: 'Once in Germany, the bank releases your money monthly:', fr: 'Une fois en Allemagne, la banque libère votre argent chaque mois :', ar: 'بعد وصولك إلى ألمانيا، يُفرج البنك عن أموالك شهرياً:' } as L3,
  providersTitle: { en: 'Open your blocked account (embassy-recognised)', fr: 'Ouvrez votre compte bloqué (reconnu par les ambassades)', ar: 'افتح حسابك المجمّد (معترف به لدى السفارات)' } as L3,
  open: { en: 'Open account →', fr: 'Ouvrir un compte →', ar: 'فتح حساب ←' } as L3,
  disclaimer: {
    en: 'Amounts per BAMF/embassy guidance for 2026 (992 €/month for students). Requirements vary by embassy — always confirm with your local German mission.',
    fr: 'Montants selon les directives BAMF/ambassades pour 2026 (992 €/mois pour étudiants). Les exigences varient — confirmez toujours auprès de votre ambassade.',
    ar: 'المبالغ وفق توجيهات BAMF/السفارات لسنة 2026 (992 €/شهر للطلبة). قد تختلف المتطلبات — تحقق دائماً لدى سفارتك.',
  } as L3,
  ctaChecklist: { en: 'Full document checklist →', fr: 'Checklist complète des documents →', ar: 'قائمة الوثائق الكاملة ←' } as L3,
}

type Purpose = keyof typeof MONTHLY

export default function SperrkontoCalculator({ locale }: { locale: AppLocale }) {
  const t = <T,>(v: L3<T>) => pick3(locale, v)
  const dir = dirFor(locale)
  const fmt = useMemo(() => new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 0 }), [locale])

  const [purpose, setPurpose] = useState<Purpose>('student')
  const [months, setMonths] = useState(12)
  const [flight, setFlight] = useState(450)
  const [extras, setExtras] = useState({ visa: true, insurance: true, translations: true, uniAssist: true, firstMonth: true })

  const monthly = MONTHLY[purpose]
  const blocked = monthly * months
  const ONE_TIME: { key: keyof typeof extras; label: L3; amount: number }[] = [
    { key: 'visa', label: S.visaFee, amount: 75 },
    { key: 'insurance', label: S.insurance, amount: 80 },
    { key: 'translations', label: S.translations, amount: 150 },
    { key: 'uniAssist', label: S.uniAssist, amount: purpose === 'student' ? 100 : 0 },
    { key: 'firstMonth', label: S.firstMonth, amount: 600 },
  ]
  const oneTime = ONE_TIME.reduce((s, r) => s + (extras[r.key] ? r.amount : 0), 0) + flight
  const total = blocked + oneTime

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">💶 {t(S.title)}</h1>
        <p className="mt-2 text-gray-600">{t(S.sub)}</p>

        {/* Purpose */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.purpose)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {([['student', S.student], ['chancenkarte', S.ck], ['language', S.language]] as [Purpose, L3][]).map(([key, label]) => (
            <button key={key} onClick={() => setPurpose(key)}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors text-start ${purpose === key ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}>
              {t(label)}
              <span className="block text-xs text-gray-400 mt-0.5">{MONTHLY[key]} €/mo</span>
            </button>
          ))}
        </div>

        {/* Months */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.months)}: <span className="text-green-700">{months}</span></h2>
        <input type="range" min={3} max={24} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-green-600" />

        {/* One-time costs */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.extras)}</h2>
        <div className="flex flex-col gap-2">
          {ONE_TIME.filter(r => r.amount > 0).map((r) => (
            <label key={r.key} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 cursor-pointer text-sm ${extras[r.key] ? 'border-green-400 bg-white' : 'border-gray-200 bg-white opacity-60'}`}>
              <input type="checkbox" checked={extras[r.key]} onChange={(e) => setExtras({ ...extras, [r.key]: e.target.checked })} className="accent-green-600" />
              <span className="flex-1 text-gray-800">{t(r.label)}</span>
              <span className="font-semibold text-gray-600">~{r.amount} €</span>
            </label>
          ))}
          <label className="flex items-center gap-3 rounded-xl border-2 border-green-400 bg-white px-4 py-2.5 text-sm">
            <span className="flex-1 text-gray-800">✈️ {t(S.flight)}</span>
            <input type="number" min={0} max={3000} value={flight} onChange={(e) => setFlight(Math.max(0, Number(e.target.value) || 0))}
              className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-end" /> €
          </label>
        </div>

        {/* Result */}
        <div className="mt-8 rounded-2xl border-2 border-green-300 bg-white p-6">
          <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
            <span className="text-gray-600">🔒 {t(S.blocked)} <span className="text-gray-400">({monthly} {t(S.monthlyRate)}{months})</span></span>
            <strong className="text-gray-900">{fmt.format(blocked)} €</strong>
          </div>
          <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
            <span className="text-gray-600">🧾 {t(S.oneTime)}</span>
            <strong className="text-gray-900">{fmt.format(oneTime)} €</strong>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-bold text-gray-900">{t(S.total)}</span>
            <span className="text-3xl font-black text-green-700">{fmt.format(total)} €</span>
          </div>
          <p className="text-xs text-gray-500">{t(S.monthlyBack)} <strong>{fmt.format(monthly)} €</strong>/mo</p>
        </div>

        {/* Providers */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-10 mb-3">{t(S.providersTitle)}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {SPERRKONTO_PROVIDERS.map((p) => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener sponsored"
              className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-green-400 hover:shadow-md transition-all block">
              <p className="font-bold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{pick3(locale, p.blurb)}</p>
              <span className="inline-block mt-3 text-xs font-bold text-green-700">{t(S.open)}</span>
            </a>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mt-6">
          <Link href="/tools/document-checklist" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaChecklist)}</Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">{t(S.disclaimer)}</p>
      </div>
    </div>
  )
}
