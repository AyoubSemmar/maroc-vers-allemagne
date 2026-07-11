'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'

const S = {
  title: { en: 'Chancenkarte Points Calculator', fr: 'Calculateur de points Chancenkarte', ar: 'حاسبة نقاط بطاقة الفرص (Chancenkarte)' } as L3,
  sub: {
    en: 'Germany’s Opportunity Card lets you move to Germany to look for a job — if you score 6 points. Check your score in one minute.',
    fr: 'La carte d’opportunité (Chancenkarte) permet de venir en Allemagne chercher un emploi — si vous atteignez 6 points. Vérifiez votre score en une minute.',
    ar: 'تتيح لك بطاقة الفرص الانتقال إلى ألمانيا للبحث عن عمل — إذا جمعت 6 نقاط. تحقق من نقاطك في دقيقة واحدة.',
  } as L3,
  baseTitle: { en: 'Step 1 — Basic requirements (mandatory)', fr: 'Étape 1 — Conditions de base (obligatoires)', ar: 'الخطوة 1 — الشروط الأساسية (إلزامية)' } as L3,
  qualif: { en: 'I have a university degree OR completed vocational training of at least 2 years', fr: 'J’ai un diplôme universitaire OU une formation professionnelle d’au moins 2 ans', ar: 'لديّ شهادة جامعية أو تكوين مهني لا يقل عن سنتين' } as L3,
  baseLang: { en: 'I have German A1 or English B2 (certificate)', fr: 'J’ai l’allemand A1 ou l’anglais B2 (certificat)', ar: 'لديّ شهادة ألمانية A1 أو إنجليزية B2' } as L3,
  fullRec: { en: 'My qualification is FULLY recognised in Germany (or is a German degree)', fr: 'Mon diplôme est PLEINEMENT reconnu en Allemagne (ou est un diplôme allemand)', ar: 'شهادتي معترف بها بالكامل في ألمانيا (أو شهادة ألمانية)' } as L3,
  ptsTitle: { en: 'Step 2 — Your points', fr: 'Étape 2 — Vos points', ar: 'الخطوة 2 — نقاطك' } as L3,
  partialRec: { en: 'Partial recognition of my qualification (deficit notice) or permit to practise a regulated profession', fr: 'Reconnaissance partielle de mon diplôme (avis de déficit) ou autorisation d’exercer une profession réglementée', ar: 'اعتراف جزئي بشهادتي أو ترخيص لمزاولة مهنة منظمة' } as L3,
  shortage: { en: 'My profession is a shortage occupation (nursing, crafts, IT, engineering…)', fr: 'Ma profession est en pénurie (soins, artisanat, IT, ingénierie…)', ar: 'مهنتي ضمن المهن التي تشهد نقصاً (تمريض، حِرف، معلوميات، هندسة…)' } as L3,
  exp: { en: 'Professional experience in your field', fr: 'Expérience professionnelle dans votre domaine', ar: 'الخبرة المهنية في مجالك' } as L3,
  expNone: { en: 'Less than 2 years', fr: 'Moins de 2 ans', ar: 'أقل من سنتين' } as L3,
  exp2: { en: '2+ years (within last 5)', fr: '2 ans et plus (sur les 5 dernières années)', ar: 'سنتان أو أكثر (خلال آخر 5 سنوات)' } as L3,
  exp5: { en: '5+ years (within last 7)', fr: '5 ans et plus (sur les 7 dernières années)', ar: '5 سنوات أو أكثر (خلال آخر 7 سنوات)' } as L3,
  german: { en: 'German level', fr: 'Niveau d’allemand', ar: 'مستوى الألمانية' } as L3,
  gNone: { en: 'Below A2', fr: 'Moins de A2', ar: 'أقل من A2' } as L3,
  english: { en: 'English C1 or native', fr: 'Anglais C1 ou langue maternelle', ar: 'إنجليزية C1 أو لغة أم' } as L3,
  age: { en: 'Your age', fr: 'Votre âge', ar: 'عمرك' } as L3,
  ageU35: { en: 'Under 35', fr: 'Moins de 35 ans', ar: 'أقل من 35 سنة' } as L3,
  age35: { en: '35 – 39', fr: '35 – 39 ans', ar: '35 – 39 سنة' } as L3,
  age40: { en: '40 or older', fr: '40 ans ou plus', ar: '40 سنة أو أكثر' } as L3,
  stay: { en: 'I legally stayed in Germany ≥ 6 months in the last 5 years (not tourism)', fr: 'J’ai séjourné légalement en Allemagne ≥ 6 mois durant les 5 dernières années (hors tourisme)', ar: 'أقمت في ألمانيا بشكل قانوني 6 أشهر أو أكثر خلال آخر 5 سنوات (ليس سياحة)' } as L3,
  spouse: { en: 'My spouse/partner also meets the Chancenkarte requirements and applies with me', fr: 'Mon conjoint remplit aussi les conditions et dépose avec moi', ar: 'زوجي/زوجتي يستوفي الشروط أيضاً ويقدّم معي' } as L3,
  score: { en: 'Your score', fr: 'Votre score', ar: 'نقاطك' } as L3,
  eligible: { en: '🎉 You likely qualify for the Chancenkarte!', fr: '🎉 Vous êtes probablement éligible à la Chancenkarte !', ar: '🎉 من المرجّح أنك مؤهل لبطاقة الفرص!' } as L3,
  fachkraft: { en: '🚀 Even better: with full recognition you qualify as a skilled worker (Fachkraft) — no points needed. You can apply directly for a work-search visa or a job-based visa.', fr: '🚀 Encore mieux : avec la reconnaissance complète, vous êtes qualifié·e comme Fachkraft — sans système de points. Visa de recherche d’emploi ou visa de travail direct possible.', ar: '🚀 أفضل من ذلك: مع الاعتراف الكامل تُعتبر عاملاً مؤهلاً (Fachkraft) — بدون نظام النقاط. يمكنك التقدّم مباشرة لتأشيرة البحث عن عمل أو تأشيرة عمل.' } as L3,
  notEligibleBase: { en: '⚠️ The basic requirements are not met yet — points don’t count until both boxes in Step 1 are true.', fr: '⚠️ Les conditions de base ne sont pas remplies — les points ne comptent que si les deux cases de l’étape 1 sont cochées.', ar: '⚠️ الشروط الأساسية غير مستوفاة بعد — لا تُحتسب النقاط إلا إذا تحقق الشرطان في الخطوة 1.' } as L3,
  notEligible: { en: 'points — you need 6. Here’s how to close the gap:', fr: 'points — il en faut 6. Voici comment combler l’écart :', ar: 'نقطة — تحتاج إلى 6. إليك كيفية سدّ الفارق:' } as L3,
  eligiblePts: { en: 'points — 6 needed. You’re over the line!', fr: 'points — 6 requis. Vous dépassez le seuil !', ar: 'نقطة — المطلوب 6. لقد تجاوزت العتبة!' } as L3,
  tipA2: { en: 'Reach German A2 → +1 point (B1 → +2, B2 → +3). Our free A1–C1 lessons get you there.', fr: 'Atteignez l’allemand A2 → +1 point (B1 → +2, B2 → +3). Nos leçons gratuites A1–C1 vous y amènent.', ar: 'الوصول إلى A2 بالألمانية → +1 نقطة (B1 → +2، B2 → +3). دروسنا المجانية توصلك إلى ذلك.' } as L3,
  tipRec: { en: 'Start partial recognition of your qualification → +4 points. See our Anerkennung wizard.', fr: 'Lancez la reconnaissance partielle de votre diplôme → +4 points. Voir notre assistant Anerkennung.', ar: 'ابدأ الاعتراف الجزئي بشهادتك → +4 نقاط. جرّب مساعد الاعتراف لدينا.' } as L3,
  tipEng: { en: 'Certify English C1 (IELTS 7+) → +1 point.', fr: 'Certifiez l’anglais C1 (IELTS 7+) → +1 point.', ar: 'أثبت مستوى C1 في الإنجليزية (IELTS 7+) → +1 نقطة.' } as L3,
  money: {
    en: 'Money requirement: you must prove ~1,027 €/month — usually a blocked account of ≈ 12,324 € for 12 months, OR a part-time job offer (up to 20 h/week) in Germany.',
    fr: 'Condition financière : prouver ~1 027 €/mois — en général un compte bloqué d’≈ 12 324 € pour 12 mois, OU une promesse de job à temps partiel (max 20 h/semaine).',
    ar: 'الشرط المالي: إثبات نحو 1,027 €/شهر — عادةً حساب مجمّد بقيمة ≈ 12,324 € لمدة 12 شهراً، أو عرض عمل بدوام جزئي (حتى 20 ساعة أسبوعياً).',
  } as L3,
  ctaSperr: { en: 'Calculate your blocked account →', fr: 'Calculez votre compte bloqué →', ar: 'احسب حسابك المجمّد ←' } as L3,
  ctaLearn: { en: 'Learn German free (A1–C1) →', fr: 'Apprendre l’allemand gratuitement (A1–C1) →', ar: 'تعلّم الألمانية مجاناً (A1–C1) ←' } as L3,
  ctaAnerkennung: { en: 'Anerkennung wizard →', fr: 'Assistant Anerkennung →', ar: 'مساعد الاعتراف بالشهادات ←' } as L3,
  disclaimer: {
    en: 'Estimate based on §20a AufenthG (2026 rules). The embassy decides individual cases — always verify with official sources.',
    fr: 'Estimation selon le §20a AufenthG (règles 2026). L’ambassade décide au cas par cas — vérifiez toujours les sources officielles.',
    ar: 'تقدير وفق §20a من قانون الإقامة (قواعد 2026). القرار النهائي للسفارة — تحقق دائماً من المصادر الرسمية.',
  } as L3,
  pt: { en: 'pt', fr: 'pt', ar: 'نقطة' } as L3,
}

const GERMAN_LEVELS = [
  { key: 'none', pts: 0 }, { key: 'a2', pts: 1 }, { key: 'b1', pts: 2 }, { key: 'b2', pts: 3 },
] as const

export default function ChancenkarteCalculator({ locale }: { locale: AppLocale }) {
  const t = <T,>(v: L3<T>) => pick3(locale, v)
  const dir = dirFor(locale)

  const [qualif, setQualif] = useState(false)
  const [baseLang, setBaseLang] = useState(false)
  const [fullRec, setFullRec] = useState(false)
  const [partialRec, setPartialRec] = useState(false)
  const [shortage, setShortage] = useState(false)
  const [exp, setExp] = useState<'none' | 'y2' | 'y5'>('none')
  const [german, setGerman] = useState<'none' | 'a2' | 'b1' | 'b2'>('none')
  const [english, setEnglish] = useState(false)
  const [age, setAge] = useState<'u35' | 'a35' | 'a40'>('u35')
  const [stay, setStay] = useState(false)
  const [spouse, setSpouse] = useState(false)

  const rows = useMemo(() => ([
    { on: partialRec, pts: 4 },
    { on: shortage, pts: 1 },
    { on: exp === 'y5', pts: 3 }, { on: exp === 'y2', pts: 2 },
    { on: german === 'a2', pts: 1 }, { on: german === 'b1', pts: 2 }, { on: german === 'b2', pts: 3 },
    { on: english, pts: 1 },
    { on: age === 'u35', pts: 2 }, { on: age === 'a35', pts: 1 },
    { on: stay, pts: 1 },
    { on: spouse, pts: 1 },
  ]), [partialRec, shortage, exp, german, english, age, stay, spouse])

  const points = rows.reduce((s, r) => s + (r.on ? r.pts : 0), 0)
  const baseOk = qualif && baseLang
  const eligible = baseOk && (fullRec || points >= 6)

  const check = (on: boolean, set: (v: boolean) => void, label: string, pts?: number) => (
    <label className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-colors ${on ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300'}`}>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="mt-1 accent-green-600" />
      <span className="flex-1 text-sm text-gray-800">{label}</span>
      {pts != null && <span className={`shrink-0 text-xs font-bold rounded-full px-2 py-0.5 ${on ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>+{pts} {t(S.pt)}</span>}
    </label>
  )

  const radio = <V extends string>(value: V, current: V, set: (v: V) => void, label: string, pts: number) => (
    <label key={value} className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 cursor-pointer transition-colors ${current === value ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300'}`}>
      <input type="radio" checked={current === value} onChange={() => set(value)} className="accent-green-600" />
      <span className="flex-1 text-sm text-gray-800">{label}</span>
      <span className={`shrink-0 text-xs font-bold rounded-full px-2 py-0.5 ${current === value && pts > 0 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>+{pts} {t(S.pt)}</span>
    </label>
  )

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">🃏 {t(S.title)}</h1>
        <p className="mt-2 text-gray-600">{t(S.sub)}</p>

        {/* Sticky score */}
        <div className="sticky top-2 z-10 mt-6 rounded-2xl border-2 border-green-600 bg-white shadow-lg px-5 py-3 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-gray-600">{t(S.score)}</span>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-100 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all ${eligible ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, (points / 6) * 100)}%` }} />
            </div>
            <span className={`text-2xl font-black ${eligible ? 'text-green-700' : 'text-gray-800'}`}>{points}<span className="text-sm text-gray-400">/6</span></span>
          </div>
        </div>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.baseTitle)}</h2>
        <div className="flex flex-col gap-2">
          {check(qualif, setQualif, t(S.qualif))}
          {check(baseLang, setBaseLang, t(S.baseLang))}
          {check(fullRec, setFullRec, t(S.fullRec))}
        </div>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">{t(S.ptsTitle)}</h2>
        <div className="flex flex-col gap-2">
          {check(partialRec, setPartialRec, t(S.partialRec), 4)}
          {check(shortage, setShortage, t(S.shortage), 1)}

          <p className="text-xs font-semibold text-gray-500 mt-3">{t(S.exp)}</p>
          {radio('none', exp, setExp, t(S.expNone), 0)}
          {radio('y2', exp, setExp, t(S.exp2), 2)}
          {radio('y5', exp, setExp, t(S.exp5), 3)}

          <p className="text-xs font-semibold text-gray-500 mt-3">{t(S.german)}</p>
          <div className="grid grid-cols-2 gap-2">
            {radio('none', german, setGerman, t(S.gNone), 0)}
            {radio('a2', german, setGerman, 'A2', 1)}
            {radio('b1', german, setGerman, 'B1', 2)}
            {radio('b2', german, setGerman, 'B2+', 3)}
          </div>
          {check(english, setEnglish, t(S.english), 1)}

          <p className="text-xs font-semibold text-gray-500 mt-3">{t(S.age)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {radio('u35', age, setAge, t(S.ageU35), 2)}
            {radio('a35', age, setAge, t(S.age35), 1)}
            {radio('a40', age, setAge, t(S.age40), 0)}
          </div>

          {check(stay, setStay, t(S.stay), 1)}
          {check(spouse, setSpouse, t(S.spouse), 1)}
        </div>

        {/* Verdict */}
        <div className={`mt-8 rounded-2xl border-2 p-6 ${eligible ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
          {!baseOk ? (
            <p className="font-semibold text-amber-800">{t(S.notEligibleBase)}</p>
          ) : fullRec ? (
            <p className="font-semibold text-green-800">{t(S.fachkraft)}</p>
          ) : eligible ? (
            <>
              <p className="text-xl font-black text-green-800">{t(S.eligible)}</p>
              <p className="text-sm text-green-700 mt-1"><strong>{points}</strong> {t(S.eligiblePts)}</p>
            </>
          ) : (
            <>
              <p className="text-xl font-black text-amber-800">{points} {t(S.notEligible)}</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-amber-900 list-disc ps-5">
                {german === 'none' && <li>{t(S.tipA2)}</li>}
                {!partialRec && <li>{t(S.tipRec)}</li>}
                {!english && <li>{t(S.tipEng)}</li>}
              </ul>
            </>
          )}
          {baseOk && (
            <p className="text-sm text-gray-700 mt-4 pt-4 border-t border-gray-200/70">💶 {t(S.money)}</p>
          )}
          <div className="flex gap-2 flex-wrap mt-4">
            <Link href="/tools/sperrkonto-calculator" className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2">{t(S.ctaSperr)}</Link>
            <Link href="/learn-german" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaLearn)}</Link>
            <Link href="/tools/anerkennung-wizard" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaAnerkennung)}</Link>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6">{t(S.disclaimer)}</p>
      </div>
    </div>
  )
}
