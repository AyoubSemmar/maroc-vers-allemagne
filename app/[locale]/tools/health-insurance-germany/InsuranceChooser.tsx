'use client'

import { useState } from 'react'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'
import ToolHero from '@/components/tools/ToolHero'

// Env-swappable partner links (same pattern as SPERRKONTO_PROVIDERS):
// set NEXT_PUBLIC_AFF_*_URL once affiliate accounts are approved.
const PROVIDERS = {
  feather: { name: 'Feather', url: process.env.NEXT_PUBLIC_AFF_FEATHER_URL || 'https://feather-insurance.com/' },
  tk: { name: 'Techniker Krankenkasse (TK)', url: process.env.NEXT_PUBLIC_AFF_TK_URL || 'https://www.tk.de/' },
  expatrio: { name: 'Expatrio', url: process.env.NEXT_PUBLIC_AFF_EXPATRIO_URL || 'https://www.expatrio.com/' },
}

type Situation = 'student' | 'student30' | 'ausbildung' | 'employee' | 'visa' | 'freelancer'

// 2026 GKV numbers: 14.6% general rate + ~2.5% avg Zusatzbeitrag (halved
// with employer), PV 3.6% (+0.6 childless) also halved for employees.
function employeeMonthly(gross: number, childless: boolean): number {
  const capped = Math.min(gross, 5812) // KV/PV contribution ceiling 2026 (approx)
  const kv = capped * (0.146 + 0.025) / 2
  const pv = capped * (0.036 / 2 + (childless ? 0.006 : 0))
  return Math.round(kv + pv)
}

const T = {
  eyebrow: { en: 'Health insurance', fr: 'Assurance santé', ar: 'التأمين الصحي' } as L3,
  title: { en: 'Health Insurance in Germany — Which One & What It Costs', fr: 'Assurance santé en Allemagne — laquelle et à quel prix', ar: 'التأمين الصحي في ألمانيا — أيّه وبكم' } as L3,
  sub: { en: 'Health insurance is mandatory in Germany. Answer two questions and see what you need and the realistic monthly cost.', fr: 'L’assurance santé est obligatoire en Allemagne. Répondez à deux questions et voyez ce qu’il vous faut et le coût mensuel réaliste.', ar: 'التأمين الصحي إجباري في ألمانيا. أجب عن سؤالين لترى ما تحتاجه والتكلفة الشهرية الواقعية.' } as L3,
  q1: { en: 'Your situation in Germany', fr: 'Votre situation en Allemagne', ar: 'وضعك في ألمانيا' } as L3,
  situations: {
    en: { student: 'University student (under 30)', student30: 'Student 30+ / PhD', ausbildung: 'Ausbildung (apprentice)', employee: 'Employee', visa: 'Visa applicant / language course', freelancer: 'Freelancer / self-employed' },
    fr: { student: 'Étudiant (moins de 30 ans)', student30: 'Étudiant 30+ / doctorant', ausbildung: 'Ausbildung (apprenti)', employee: 'Salarié', visa: 'Demandeur de visa / cours de langue', freelancer: 'Freelance / indépendant' },
    ar: { student: 'طالب جامعي (أقل من 30)', student30: 'طالب 30+ / دكتوراه', ausbildung: 'أوسبيلدونغ (متدرب)', employee: 'موظف', visa: 'طالب تأشيرة / دورة لغة', freelancer: 'مستقل / عمل حر' },
  } as L3<Record<Situation, string>>,
  gross: { en: 'Gross salary €/month', fr: 'Salaire brut €/mois', ar: 'الراتب الإجمالي €/شهر' } as L3,
  childless: { en: 'I am 23+ and have no children', fr: 'J’ai 23 ans ou plus et pas d’enfants', ar: 'عمري 23+ وليس لدي أطفال' } as L3,
  recommended: { en: 'What you need', fr: 'Ce qu’il vous faut', ar: 'ما تحتاجه' } as L3,
  monthly: { en: 'your share / month', fr: 'votre part / mois', ar: 'حصتك شهرياً' } as L3,
  providers: { en: 'Where to get it', fr: 'Où la souscrire', ar: 'أين تحصل عليه' } as L3,
  disclaimer: { en: '2026 rates, rounded. GKV contributions vary slightly by insurer (Zusatzbeitrag). Not insurance advice — confirm rates with the provider.', fr: 'Taux 2026, arrondis. Les cotisations GKV varient légèrement selon la caisse (Zusatzbeitrag). Pas un conseil en assurance — confirmez auprès du prestataire.', ar: 'أسعار 2026 مقرّبة. تختلف اشتراكات GKV قليلاً حسب الصندوق. ليست نصيحة تأمينية — تأكد من الأسعار لدى المزوّد.' } as L3,
}

const REC: Record<Situation, { what: L3; cost: (gross: number, childless: boolean) => string; detail: L3; providers: (keyof typeof PROVIDERS)[] }> = {
  student: {
    what: { en: 'Public insurance (GKV) at the fixed student rate', fr: 'Assurance publique (GKV) au tarif étudiant fixe', ar: 'التأمين العمومي (GKV) بتعريفة الطالب الثابتة' },
    cost: () => '≈ 130–145 €',
    detail: { en: 'Every public insurer must offer the student tariff — full coverage, no health questions. TK is the most popular with internationals. Enrolment proof is required for university registration.', fr: 'Toute caisse publique doit offrir le tarif étudiant — couverture complète, sans questionnaire médical. TK est la plus populaire chez les internationaux. L’attestation est exigée pour l’inscription à l’université.', ar: 'كل صندوق عمومي ملزم بتعريفة الطالب — تغطية كاملة دون أسئلة صحية. TK الأكثر شعبية بين الدوليين. تُطلب شهادة التأمين للتسجيل الجامعي.' },
    providers: ['tk', 'feather', 'expatrio'],
  },
  student30: {
    what: { en: 'Voluntary GKV or private student plans', fr: 'GKV volontaire ou plans privés étudiants', ar: 'GKV اختياري أو خطط خاصة للطلبة' },
    cost: () => '≈ 220–280 €',
    detail: { en: 'After 30, the student rate ends: voluntary GKV costs more, so many older students and PhD candidates compare private expat plans. Watch the conditions before choosing private — switching back to GKV can be hard.', fr: 'Après 30 ans, le tarif étudiant s’arrête : la GKV volontaire coûte plus cher, donc beaucoup comparent les plans privés expat. Attention aux conditions — revenir en GKV peut être difficile.', ar: 'بعد الثلاثين تنتهي تعريفة الطالب: يصبح GKV الاختياري أغلى، فيقارن كثيرون الخطط الخاصة. انتبه للشروط قبل اختيار الخاص — فالعودة إلى GKV قد تكون صعبة.' },
    providers: ['feather', 'tk'],
  },
  ausbildung: {
    what: { en: 'Public insurance (GKV) — automatic as an apprentice', fr: 'Assurance publique (GKV) — automatique comme apprenti', ar: 'التأمين العمومي (GKV) — تلقائي كمتدرب' },
    cost: (g, c) => `≈ ${employeeMonthly(g || 1100, c)} €`,
    detail: { en: 'An Ausbildung is employment: you are insured in GKV from day one, the employer pays half, your share is deducted from the salary automatically. You only choose which Krankenkasse — they all cover the same essentials.', fr: 'L’Ausbildung est un emploi : vous êtes assuré en GKV dès le premier jour, l’employeur paie la moitié, votre part est prélevée automatiquement. Vous choisissez seulement la caisse — l’essentiel est identique partout.', ar: 'الأوسبيلدونغ عملٌ وظيفي: أنت مؤمَّن في GKV من اليوم الأول، يدفع المشغّل النصف وتُخصم حصتك تلقائياً من الراتب. تختار فقط الصندوق — والتغطية الأساسية واحدة.' },
    providers: ['tk', 'feather'],
  },
  employee: {
    what: { en: 'Public insurance (GKV) — automatic; private optional above ~€6,150/month', fr: 'GKV automatique ; privée possible au-dessus de ~6 150 €/mois', ar: 'GKV تلقائي؛ والخاص ممكن فوق ~6150 €/شهر' },
    cost: (g, c) => `≈ ${employeeMonthly(g || 3000, c)} €`,
    detail: { en: 'Employees are auto-enrolled in GKV; the employer pays half. Private (PKV) becomes an option only above the income threshold — cheaper when young, riskier long-term. For most newcomers GKV is the right default.', fr: 'Les salariés sont inscrits d’office en GKV ; l’employeur paie la moitié. La privée (PKV) n’est possible qu’au-dessus du seuil de revenu — moins chère jeune, plus risquée à long terme. Pour la plupart des nouveaux arrivants, la GKV est le bon choix.', ar: 'الموظفون مسجلون تلقائياً في GKV ويدفع المشغّل النصف. الخاص (PKV) خيار فقط فوق عتبة الدخل — أرخص في الشباب وأخطر على المدى البعيد. للقادمين الجدد GKV هو الخيار الصائب غالباً.' },
    providers: ['tk', 'feather'],
  },
  visa: {
    what: { en: 'Incoming / travel health insurance for the visa period', fr: 'Assurance santé « incoming » pour la période du visa', ar: 'تأمين صحي مؤقت (Incoming) لفترة التأشيرة' },
    cost: () => '≈ 30–80 €',
    detail: { en: 'Embassies require proof of coverage before GKV starts. Incoming plans cover the gap — from arrival until your studies or job begin. Expatrio bundles it with the blocked account; Feather sells it standalone.', fr: 'Les ambassades exigent une couverture avant le début de la GKV. Les plans incoming couvrent l’intervalle — de l’arrivée au début des études ou du travail. Expatrio l’intègre au compte bloqué ; Feather le vend seul.', ar: 'تشترط السفارات إثبات تغطية قبل بدء GKV. تغطي خطط Incoming الفترةَ من الوصول حتى بدء الدراسة أو العمل. تدمجها Expatrio مع الحساب المجمّد، وتبيعها Feather منفردة.' },
    providers: ['expatrio', 'feather'],
  },
  freelancer: {
    what: { en: 'Voluntary GKV (~15–19% of income) or private (PKV)', fr: 'GKV volontaire (~15–19 % du revenu) ou privée (PKV)', ar: 'GKV اختياري (~15–19% من الدخل) أو خاص (PKV)' },
    cost: () => '≈ 250–900 €',
    detail: { en: 'Freelancers pay both halves themselves: voluntary GKV runs ~15–19% of income (minimum ~€250/month), private depends on age and health. Young, healthy freelancers often start private — but GKV is safer if family or fluctuating income is in the picture.', fr: 'Les indépendants paient les deux moitiés : la GKV volontaire coûte ~15–19 % du revenu (minimum ~250 €/mois), la privée dépend de l’âge et de la santé. Jeune et en bonne santé, la privée tente — mais la GKV est plus sûre avec une famille ou un revenu variable.', ar: 'يدفع المستقلون النصفين معاً: GKV الاختياري نحو 15–19% من الدخل (بحد أدنى ~250 €/شهر)، والخاص حسب السن والصحة. يبدأ الشباب الأصحاء غالباً بالخاص — لكن GKV أأمن مع عائلة أو دخل متقلب.' },
    providers: ['feather', 'tk'],
  },
}

export default function InsuranceChooser({ locale }: { locale: AppLocale }) {
  const t = <V,>(v: L3<V>) => pick3(locale, v)
  const [situation, setSituation] = useState<Situation>('student')
  const [gross, setGross] = useState(1100)
  const [childless, setChildless] = useState(true)

  const rec = REC[situation]
  const needsIncome = situation === 'ausbildung' || situation === 'employee'
  const sits = t(T.situations)

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir={dirFor(locale)}>
      <ToolHero eyebrow={t(T.eyebrow)} title={t(T.title)} subtitle={t(T.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">{t(T.q1)}</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sits) as Situation[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setSituation(s); if (s === 'ausbildung') setGross(1100); if (s === 'employee') setGross(3000) }}
              className={`px-3 py-2 rounded-full text-xs font-medium border transition-colors ${
                situation === s ? 'bg-green-700 border-green-700 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-green-500'
              }`}
            >
              {sits[s]}
            </button>
          ))}
        </div>

        {needsIncome && (
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.gross)}</span>
              <input
                type="number"
                value={gross}
                min={400}
                onChange={(e) => setGross(Number(e.target.value) || 0)}
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </label>
            <label className="flex items-end gap-2 pb-3 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={childless} onChange={(e) => setChildless(e.target.checked)} className="w-4 h-4 accent-green-700" />
              {t(T.childless)}
            </label>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{t(T.recommended)}</p>
          <h2 className="text-lg font-bold text-gray-900 mt-1">{t(rec.what)}</h2>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black text-green-700">{rec.cost(gross, childless)}</span>
            <span className="text-xs text-gray-500">{t(T.monthly)}</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-3">{t(rec.detail)}</p>

          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-5 mb-2">{t(T.providers)}</p>
          <div className="flex flex-col gap-2">
            {rec.providers.map((p) => (
              <a
                key={p}
                href={PROVIDERS[p].url}
                target="_blank"
                rel="noopener sponsored"
                className="flex items-center justify-between bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-400 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition-colors"
              >
                {PROVIDERS[p].name}
                <span className="text-green-700">↗</span>
              </a>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">{t(T.disclaimer)}</p>
      </div>
    </div>
  )
}
