'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'
import ToolHero from '@/components/tools/ToolHero'

// Conversion rules follow §31 FeV: EU/EEA licences stay valid; Anlage 11
// countries get a full or partial exchange; everyone else may drive 6 months
// after registering residence, then needs the full German exams. Always
// verify with the local Führerscheinstelle — the annex changes.
type Group = 'eu' | 'full' | 'partial' | 'exam'
type Country = { name: L3; group: Group; note?: L3 }

const EU = ['Austria','Belgium','Bulgaria','Croatia','Cyprus','Czechia','Denmark','Estonia','Finland','France','Greece','Hungary','Iceland','Ireland','Italy','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Netherlands','Norway','Poland','Portugal','Romania','Slovakia','Slovenia','Spain','Sweden']

const COUNTRIES: Country[] = [
  { name: { en: 'Morocco', fr: 'Maroc', ar: 'المغرب' }, group: 'exam' },
  { name: { en: 'Algeria', fr: 'Algérie', ar: 'الجزائر' }, group: 'exam' },
  { name: { en: 'Tunisia', fr: 'Tunisie', ar: 'تونس' }, group: 'exam' },
  { name: { en: 'Egypt', fr: 'Égypte', ar: 'مصر' }, group: 'exam' },
  { name: { en: 'Turkey', fr: 'Turquie', ar: 'تركيا' }, group: 'exam' },
  { name: { en: 'India', fr: 'Inde', ar: 'الهند' }, group: 'exam' },
  { name: { en: 'Pakistan', fr: 'Pakistan', ar: 'باكستان' }, group: 'exam' },
  { name: { en: 'Iran', fr: 'Iran', ar: 'إيران' }, group: 'exam' },
  { name: { en: 'Philippines', fr: 'Philippines', ar: 'الفلبين' }, group: 'exam' },
  { name: { en: 'Nigeria', fr: 'Nigéria', ar: 'نيجيريا' }, group: 'exam' },
  { name: { en: 'Senegal', fr: 'Sénégal', ar: 'السنغال' }, group: 'exam' },
  { name: { en: 'Cameroon', fr: 'Cameroun', ar: 'الكاميرون' }, group: 'exam' },
  { name: { en: 'Côte d’Ivoire', fr: 'Côte d’Ivoire', ar: 'ساحل العاج' }, group: 'exam' },
  { name: { en: 'Brazil', fr: 'Brésil', ar: 'البرازيل' }, group: 'exam' },
  { name: { en: 'Mexico', fr: 'Mexique', ar: 'المكسيك' }, group: 'exam' },
  { name: { en: 'Colombia', fr: 'Colombie', ar: 'كولومبيا' }, group: 'exam' },
  { name: { en: 'Russia', fr: 'Russie', ar: 'روسيا' }, group: 'exam' },
  { name: { en: 'China', fr: 'Chine', ar: 'الصين' }, group: 'exam' },
  { name: { en: 'Vietnam', fr: 'Vietnam', ar: 'فيتنام' }, group: 'exam' },
  { name: { en: 'Indonesia', fr: 'Indonésie', ar: 'إندونيسيا' }, group: 'exam' },
  { name: { en: 'Bangladesh', fr: 'Bangladesh', ar: 'بنغلاديش' }, group: 'exam' },
  { name: { en: 'Jordan', fr: 'Jordanie', ar: 'الأردن' }, group: 'exam' },
  { name: { en: 'Saudi Arabia', fr: 'Arabie saoudite', ar: 'السعودية' }, group: 'exam' },
  { name: { en: 'UAE', fr: 'Émirats arabes unis', ar: 'الإمارات' }, group: 'exam' },
  { name: { en: 'Ukraine', fr: 'Ukraine', ar: 'أوكرانيا' }, group: 'exam', note: { en: 'Special temporary rules have applied for refugees — check current status.', fr: 'Des règles temporaires spéciales existent pour les réfugiés — vérifiez le statut actuel.', ar: 'طُبقت قواعد مؤقتة خاصة للاجئين — تحقق من الوضع الحالي.' } },
  { name: { en: 'United Kingdom', fr: 'Royaume-Uni', ar: 'المملكة المتحدة' }, group: 'full' },
  { name: { en: 'Switzerland', fr: 'Suisse', ar: 'سويسرا' }, group: 'full' },
  { name: { en: 'Japan', fr: 'Japon', ar: 'اليابان' }, group: 'full' },
  { name: { en: 'South Korea', fr: 'Corée du Sud', ar: 'كوريا الجنوبية' }, group: 'full' },
  { name: { en: 'Israel', fr: 'Israël', ar: 'إسرائيل' }, group: 'full' },
  { name: { en: 'Singapore', fr: 'Singapour', ar: 'سنغافورة' }, group: 'full' },
  { name: { en: 'South Africa', fr: 'Afrique du Sud', ar: 'جنوب أفريقيا' }, group: 'full' },
  { name: { en: 'Australia', fr: 'Australie', ar: 'أستراليا' }, group: 'full' },
  { name: { en: 'New Zealand', fr: 'Nouvelle-Zélande', ar: 'نيوزيلندا' }, group: 'full' },
  { name: { en: 'Serbia', fr: 'Serbie', ar: 'صربيا' }, group: 'full' },
  { name: { en: 'Bosnia & Herzegovina', fr: 'Bosnie-Herzégovine', ar: 'البوسنة والهرسك' }, group: 'full' },
  { name: { en: 'Kosovo', fr: 'Kosovo', ar: 'كوسوفو' }, group: 'full' },
  { name: { en: 'North Macedonia', fr: 'Macédoine du Nord', ar: 'مقدونيا الشمالية' }, group: 'full' },
  { name: { en: 'Moldova', fr: 'Moldavie', ar: 'مولدوفا' }, group: 'full' },
  { name: { en: 'Monaco', fr: 'Monaco', ar: 'موناكو' }, group: 'full' },
  { name: { en: 'San Marino', fr: 'Saint-Marin', ar: 'سان مارينو' }, group: 'full' },
  { name: { en: 'Andorra', fr: 'Andorre', ar: 'أندورا' }, group: 'full' },
  { name: { en: 'United States', fr: 'États-Unis', ar: 'الولايات المتحدة' }, group: 'partial', note: { en: 'Depends on the state: many states exchange without exams, some require the theory test, a few require both.', fr: 'Selon l’État : beaucoup échangent sans examen, certains exigent la théorie, quelques-uns les deux.', ar: 'حسب الولاية: كثير منها يبدّل دون امتحان، وبعضها يشترط النظري، وقليل يشترط الاثنين.' } },
  { name: { en: 'Canada', fr: 'Canada', ar: 'كندا' }, group: 'partial', note: { en: 'Most provinces exchange without exams — a few have conditions. Check your province.', fr: 'La plupart des provinces échangent sans examen — quelques-unes ont des conditions.', ar: 'معظم المقاطعات تبدّل دون امتحان — لبعضها شروط. تحقق من مقاطعتك.' } },
  { name: { en: 'Taiwan', fr: 'Taïwan', ar: 'تايوان' }, group: 'partial', note: { en: 'Theory test required, no practical test.', fr: 'Examen théorique requis, pas de pratique.', ar: 'يشترط الامتحان النظري فقط دون التطبيقي.' } },
]

const RESULT: Record<Group, { badge: L3; validity: L3; steps: L3<string[]>; cost: L3 }> = {
  eu: {
    badge: { en: '✅ Valid as-is', fr: '✅ Valable tel quel', ar: '✅ صالحة كما هي' },
    validity: { en: 'EU/EEA licences remain fully valid in Germany — no exchange, no exams, no deadline.', fr: 'Les permis UE/EEE restent entièrement valables en Allemagne — sans échange, sans examen, sans limite.', ar: 'رخص الاتحاد الأوروبي/المنطقة الاقتصادية تبقى صالحة تماماً في ألمانيا — دون تبديل أو امتحان أو مهلة.' },
    steps: { en: ['Keep driving with your current licence', 'Exchange is optional (e.g. if it expires)'], fr: ['Continuez à conduire avec votre permis actuel', 'L’échange est facultatif (p. ex. à expiration)'], ar: ['واصل القيادة برخصتك الحالية', 'التبديل اختياري (مثلاً عند انتهاء الصلاحية)'] },
    cost: { en: 'Cost: €0', fr: 'Coût : 0 €', ar: 'التكلفة: 0 €' },
  },
  full: {
    badge: { en: '🔁 Simple exchange — no exams', fr: '🔁 Échange simple — sans examen', ar: '🔁 تبديل بسيط — دون امتحان' },
    validity: { en: 'You may drive for 6 months after registering residence. Your licence is on the privileged list (Anlage 11): it converts by simple exchange, no theory or practical test.', fr: 'Vous pouvez conduire 6 mois après votre Anmeldung. Votre permis figure sur la liste privilégiée (Anlage 11) : échange simple, sans examen théorique ni pratique.', ar: 'يمكنك القيادة 6 أشهر بعد تسجيل الإقامة. رخصتك ضمن القائمة المميزة (Anlage 11): تُبدَّل مباشرة دون امتحان نظري أو تطبيقي.' },
    steps: { en: ['Book an appointment at the Führerscheinstelle', 'Bring licence + certified translation if requested, passport, biometric photo, eye test', 'Hand in your foreign licence, receive the German one (~3–6 weeks)'], fr: ['Prenez rendez-vous à la Führerscheinstelle', 'Apportez permis + traduction certifiée si demandée, passeport, photo biométrique, test de vue', 'Remettez votre permis étranger, recevez l’allemand (~3–6 semaines)'], ar: ['احجز موعداً في مكتب الرخص (Führerscheinstelle)', 'أحضر الرخصة + ترجمة معتمدة إن طُلبت، وجواز السفر، وصورة بيومترية، وفحص نظر', 'تسلّم رخصتك الأجنبية وتستلم الألمانية (3–6 أسابيع تقريباً)'] },
    cost: { en: 'Cost: ~€40–80 (fees + photo + eye test)', fr: 'Coût : ~40–80 € (frais + photo + test de vue)', ar: 'التكلفة: نحو 40–80 € (رسوم + صورة + فحص نظر)' },
  },
  partial: {
    badge: { en: '🟡 Exchange with conditions', fr: '🟡 Échange sous conditions', ar: '🟡 تبديل بشروط' },
    validity: { en: 'You may drive for 6 months after registering residence. Conversion rules depend on the issuing state/province — from simple exchange to a theory test.', fr: 'Vous pouvez conduire 6 mois après votre Anmeldung. Les règles dépendent de l’État/la province d’émission — de l’échange simple à l’examen théorique.', ar: 'يمكنك القيادة 6 أشهر بعد تسجيل الإقامة. تعتمد القواعد على الولاية/المقاطعة المُصدِرة — من التبديل البسيط إلى الامتحان النظري.' },
    steps: { en: ['Check your state/province on the official Anlage 11 list', 'Book the Führerscheinstelle appointment', 'Pass the required test(s) if any, then exchange'], fr: ['Vérifiez votre État/province sur la liste officielle Anlage 11', 'Prenez rendez-vous à la Führerscheinstelle', 'Passez le ou les tests requis, puis échangez'], ar: ['تحقق من ولايتك/مقاطعتك في قائمة Anlage 11 الرسمية', 'احجز موعد مكتب الرخص', 'اجتز الامتحان المطلوب إن وُجد ثم بدّل الرخصة'] },
    cost: { en: 'Cost: ~€40–350 depending on required tests', fr: 'Coût : ~40–350 € selon les tests requis', ar: 'التكلفة: نحو 40–350 € حسب الامتحانات المطلوبة' },
  },
  exam: {
    badge: { en: '📝 German exams required', fr: '📝 Examens allemands requis', ar: '📝 مطلوب اجتياز الامتحانات الألمانية' },
    validity: { en: 'You may drive with your licence (plus translation) for 6 months after registering residence. After that you need a German licence: theory + practical exam. The good news — no minimum driving lessons are legally required, so with experience you can keep costs down.', fr: 'Vous pouvez conduire avec votre permis (plus traduction) pendant 6 mois après l’Anmeldung. Ensuite il faut le permis allemand : examens théorique + pratique. Bonne nouvelle — aucun nombre minimum de leçons n’est exigé par la loi, un conducteur expérimenté peut limiter les coûts.', ar: 'يمكنك القيادة برخصتك (مع ترجمة) لمدة 6 أشهر بعد تسجيل الإقامة. بعدها تحتاج رخصة ألمانية: امتحان نظري + تطبيقي. الخبر الجيد — لا يفرض القانون حداً أدنى من دروس السياقة، فذوو الخبرة يمكنهم خفض التكاليف.' },
    steps: { en: ['Register at a Fahrschule (required to book the exams)', 'Prepare the theory test — available in English, Arabic, French, Turkish and more', 'Take the lessons you actually need, then the practical exam', 'Apply for conversion at the Führerscheinstelle before or during'], fr: ['Inscrivez-vous dans une Fahrschule (nécessaire pour les examens)', 'Préparez la théorie — disponible en anglais, arabe, français, turc…', 'Prenez seulement les leçons nécessaires, puis l’examen pratique', 'Déposez la demande à la Führerscheinstelle en parallèle'], ar: ['سجّل في مدرسة سياقة (ضروري لحجز الامتحانات)', 'حضّر النظري — متوفر بالعربية والإنجليزية والفرنسية والتركية وغيرها', 'خذ الدروس التي تحتاجها فقط ثم الامتحان التطبيقي', 'قدّم طلب التبديل لدى مكتب الرخص بالتوازي'] },
    cost: { en: 'Cost: typically €600–1,500 with driving experience (fresh learners pay €2,000–3,500)', fr: 'Coût : typiquement 600–1 500 € avec de l’expérience (débutants : 2 000–3 500 €)', ar: 'التكلفة: عادة 600–1500 € لذوي الخبرة (المبتدئون: 2000–3500 €)' },
  },
}

const T = {
  eyebrow: { en: 'Driving licence', fr: 'Permis de conduire', ar: 'رخصة السياقة' } as L3,
  title: { en: 'Driving Licence in Germany — Conversion Checker', fr: 'Permis de conduire en Allemagne — vérificateur d’échange', ar: 'رخصة السياقة في ألمانيا — فاحص التبديل' } as L3,
  sub: { en: 'Select where your licence was issued and see exactly what Germany requires: nothing, a simple exchange, or which exams.', fr: 'Choisissez le pays d’émission de votre permis et voyez ce que l’Allemagne exige : rien, un simple échange, ou quels examens.', ar: 'اختر بلد إصدار رخصتك لترى ما تطلبه ألمانيا بالضبط: لا شيء، أو تبديل بسيط، أو أي امتحانات.' } as L3,
  select: { en: 'Country that issued your licence', fr: 'Pays d’émission du permis', ar: 'البلد الذي أصدر رخصتك' } as L3,
  euGroup: { en: 'EU / EEA (any member state)', fr: 'UE / EEE (tout État membre)', ar: 'الاتحاد الأوروبي / المنطقة الاقتصادية (أي دولة عضو)' } as L3,
  steps: { en: 'Your steps', fr: 'Vos étapes', ar: 'خطواتك' } as L3,
  fahrerCta: { en: 'Driving as a career? See truck & bus interview questions', fr: 'La conduite comme métier ? Questions d’entretien poids lourd & bus', ar: 'السياقة كمهنة؟ أسئلة مقابلة سائقي الشاحنات والحافلات' } as L3,
  disclaimer: { en: 'Rules follow §31 FeV and Anlage 11 and change over time — always confirm with your local Führerscheinstelle before relying on them.', fr: 'Règles selon §31 FeV et Anlage 11, susceptibles d’évoluer — confirmez toujours auprès de votre Führerscheinstelle.', ar: 'القواعد وفق §31 FeV وAnlage 11 وقد تتغير — تأكد دائماً لدى مكتب الرخص المحلي قبل الاعتماد عليها.' } as L3,
}

export default function LicenseChecker({ locale }: { locale: AppLocale }) {
  const t = <V,>(v: L3<V>) => pick3(locale, v)
  const [choice, setChoice] = useState<string>('Morocco')

  const isEu = choice === '__eu__'
  const country = COUNTRIES.find((c) => c.name.en === choice)
  const group: Group = isEu ? 'eu' : country?.group ?? 'exam'
  const r = RESULT[group]

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir={dirFor(locale)}>
      <ToolHero eyebrow={t(T.eyebrow)} title={t(T.title)} subtitle={t(T.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">{t(T.select)}</label>
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="__eu__">{t(T.euGroup)}</option>
          {[...COUNTRIES].sort((a, b) => t(a.name).localeCompare(t(b.name), locale)).map((c) => (
            <option key={c.name.en} value={c.name.en}>{t(c.name)}</option>
          ))}
        </select>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
          <span className={`inline-block text-sm font-black rounded-full px-4 py-1.5 ${
            group === 'eu' ? 'bg-green-100 text-green-800'
            : group === 'full' ? 'bg-emerald-100 text-emerald-800'
            : group === 'partial' ? 'bg-yellow-100 text-yellow-800'
            : 'bg-orange-100 text-orange-800'
          }`}>
            {t(r.badge)}
          </span>
          <p className="text-sm text-gray-700 leading-relaxed mt-4">{t(r.validity)}</p>
          {country?.note && (
            <p className="text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">ℹ️ {t(country.note)}</p>
          )}

          <h2 className="text-sm font-bold text-gray-900 mt-5">{t(T.steps)}</h2>
          <ol className="mt-2 space-y-1.5">
            {t(r.steps).map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="shrink-0 w-5 h-5 bg-green-100 text-green-800 rounded-full text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="text-sm font-semibold text-gray-800 mt-4">{t(r.cost)}</p>
        </div>

        <Link
          href="/interview-prep"
          className="block text-center bg-white border border-gray-300 hover:border-green-500 text-gray-700 font-semibold rounded-xl px-5 py-3 text-sm transition-colors mt-4"
        >
          🚛 {t(T.fahrerCta)}
        </Link>

        <p className="text-xs text-gray-400 mt-4 leading-relaxed">{t(T.disclaimer)}</p>
      </div>
    </div>
  )
}
