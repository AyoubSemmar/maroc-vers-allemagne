'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import ToolHero from '@/components/tools/ToolHero'
import { pick3, type L3 } from '@/lib/toolStrings'

const S = {
  eyebrow: { en: 'Recognition', fr: 'Reconnaissance', ar: 'الاعتراف بالشهادات' } as L3,
  title: { en: 'Anerkennung Wizard — Get Your Qualification Recognised', fr: 'Assistant Anerkennung — Faites reconnaître votre diplôme', ar: 'مساعد الاعتراف بالشهادات في ألمانيا' } as L3,
  sub: {
    en: 'Answer two questions and get your exact recognition path: the authority, the procedure, realistic costs and timelines.',
    fr: 'Répondez à deux questions et obtenez votre parcours exact de reconnaissance : autorité compétente, procédure, coûts et délais réalistes.',
    ar: 'أجب عن سؤالين واحصل على مسار الاعتراف الدقيق: الجهة المختصة، الإجراء، التكاليف والمدة.',
  } as L3,
  q1: { en: 'What is your profession?', fr: 'Quelle est votre profession ?', ar: 'ما هي مهنتك؟' } as L3,
  q2: { en: 'Where did you get your qualification?', fr: 'Où avez-vous obtenu votre diplôme ?', ar: 'أين حصلت على شهادتك؟' } as L3,
  eu: { en: '🇪🇺 EU / EEA / Switzerland', fr: '🇪🇺 UE / EEE / Suisse', ar: '🇪🇺 الاتحاد الأوروبي' } as L3,
  nonEu: { en: '🌍 Outside the EU', fr: '🌍 Hors UE', ar: '🌍 خارج الاتحاد الأوروبي' } as L3,
  regulated: { en: 'Regulated profession — recognition is MANDATORY before you can work', fr: 'Profession réglementée — la reconnaissance est OBLIGATOIRE pour exercer', ar: 'مهنة منظمة — الاعتراف إلزامي قبل مزاولة العمل' } as L3,
  notRegulated: { en: 'Non-regulated — you can work without recognition, but it strongly helps for visas & salary', fr: 'Non réglementée — vous pouvez travailler sans reconnaissance, mais elle aide beaucoup (visa, salaire)', ar: 'غير منظمة — يمكنك العمل دون اعتراف، لكنه مفيد جداً للتأشيرة والراتب' } as L3,
  authority: { en: 'Competent authority', fr: 'Autorité compétente', ar: 'الجهة المختصة' } as L3,
  procedure: { en: 'Procedure', fr: 'Procédure', ar: 'الإجراء' } as L3,
  cost: { en: 'Typical cost', fr: 'Coût typique', ar: 'التكلفة المعتادة' } as L3,
  duration: { en: 'Typical duration', fr: 'Délai typique', ar: 'المدة المعتادة' } as L3,
  docs: { en: 'Core documents: diploma + transcript (certified translations), CV, passport, proof of work experience. Non-EU documents usually need an apostille or legalisation.', fr: 'Documents clés : diplôme + relevés (traductions assermentées), CV, passeport, attestations d’expérience. Hors UE : apostille ou légalisation en général requise.', ar: 'الوثائق الأساسية: الشهادة + كشف النقاط (ترجمة محلفة)، سيرة ذاتية، جواز سفر، إثبات الخبرة. خارج الاتحاد الأوروبي: عادةً أبوستيل أو تصديق.' } as L3,
  links: { en: 'Official starting points', fr: 'Points de départ officiels', ar: 'روابط رسمية للبدء' } as L3,
  ctaChecklist: { en: 'Document checklist for your country →', fr: 'Checklist documents pour votre pays →', ar: 'قائمة الوثائق لبلدك ←' } as L3,
  ctaCk: { en: 'Partial recognition = +4 Chancenkarte points →', fr: 'Reconnaissance partielle = +4 points Chancenkarte →', ar: 'الاعتراف الجزئي = +4 نقاط لبطاقة الفرص ←' } as L3,
  disclaimer: { en: 'General guidance, not legal advice. The competent authority depends on the Bundesland where you will work.', fr: 'Orientation générale, pas un conseil juridique. L’autorité dépend du Land où vous travaillerez.', ar: 'إرشادات عامة وليست استشارة قانونية. تعتمد الجهة المختصة على الولاية التي ستعمل فيها.' } as L3,
}

type Prof = {
  key: string
  icon: string
  label: L3
  regulated: boolean
  authority: L3
  procedure: L3
  cost: string
  duration: L3<string>
}

const M = (en: string, fr: string, ar: string): L3 => ({ en, fr, ar })

const PROFESSIONS: Prof[] = [
  { key: 'nurse', icon: '🩺', label: M('Nurse / caregiver', 'Infirmier·ère / aide-soignant·e', 'ممرض/ممرضة'), regulated: true,
    authority: M('State health authority (e.g. Regierung von Oberbayern, LAGeSo Berlin)', 'Autorité de santé du Land (ex. Regierung von Oberbayern, LAGeSo Berlin)', 'هيئة الصحة في الولاية (مثل LAGeSo برلين)'),
    procedure: M('Anerkennung as Pflegefachkraft; gaps closed via Kenntnisprüfung or Anpassungslehrgang; B2 German required', 'Anerkennung comme Pflegefachkraft ; écarts comblés par Kenntnisprüfung ou Anpassungslehrgang ; allemand B2 exigé', 'الاعتراف كممرض مؤهل؛ تُسد الفجوات عبر Kenntnisprüfung أو Anpassungslehrgang؛ يُشترط B2 بالألمانية'),
    cost: '100 – 600 €', duration: M('3 – 12 months', '3 – 12 mois', '3 – 12 شهراً') },
  { key: 'doctor', icon: '⚕️', label: M('Doctor / dentist / pharmacist', 'Médecin / dentiste / pharmacien·ne', 'طبيب / طبيب أسنان / صيدلي'), regulated: true,
    authority: M('State approbation authority (Approbationsbehörde) of your Bundesland', 'Autorité d’Approbation du Land', 'هيئة الترخيص (Approbation) في الولاية'),
    procedure: M('Approbation; equivalence check, usually Kenntnisprüfung + Fachsprachprüfung C1 (medical German)', 'Approbation ; vérification d’équivalence, en général Kenntnisprüfung + Fachsprachprüfung C1', 'ترخيص Approbation؛ فحص التكافؤ، وغالباً Kenntnisprüfung + امتحان اللغة الطبية C1'),
    cost: '400 – 1,100 €', duration: M('6 – 18 months', '6 – 18 mois', '6 – 18 شهراً') },
  { key: 'engineer', icon: '⚙️', label: M('Engineer', 'Ingénieur·e', 'مهندس'), regulated: false,
    authority: M('ZAB statement of comparability; the "Ingenieur" TITLE via the state engineers’ chamber', 'ZAB (attestation de comparabilité) ; le TITRE "Ingenieur" via la chambre des ingénieurs du Land', 'تقييم ZAB؛ ولقب "مهندس" عبر غرفة المهندسين في الولاية'),
    procedure: M('Zeugnisbewertung (statement of comparability) — enough for visas and most jobs', 'Zeugnisbewertung — suffisante pour le visa et la plupart des emplois', 'تقييم الشهادة (Zeugnisbewertung) — يكفي للتأشيرة ومعظم الوظائف'),
    cost: '≈ 208 €', duration: M('~3 months (ZAB)', '~3 mois (ZAB)', '~3 أشهر (ZAB)') },
  { key: 'it', icon: '💻', label: M('IT / software / data', 'IT / développement / data', 'معلوميات / برمجة / بيانات'), regulated: false,
    authority: M('None required — ZAB statement optional but helps visas', 'Aucune obligation — l’attestation ZAB est optionnelle mais aide pour le visa', 'لا إلزام — تقييم ZAB اختياري لكنه مفيد للتأشيرة'),
    procedure: M('Work directly; Blue Card possible via salary alone; §6 experience route exists without a degree', 'Travail direct ; Blue Card possible par le seul salaire ; voie « expérience » sans diplôme (§6)', 'يمكنك العمل مباشرة؛ البطاقة الزرقاء عبر الراتب؛ ومسار الخبرة بدون شهادة'),
    cost: '0 – 208 €', duration: M('0 – 3 months', '0 – 3 mois', '0 – 3 أشهر') },
  { key: 'teacher', icon: '🏫', label: M('Teacher', 'Enseignant·e', 'أستاذ / معلم'), regulated: true,
    authority: M('Education ministry (Kultusministerium) of the Bundesland', 'Ministère de l’éducation du Land (Kultusministerium)', 'وزارة التعليم في الولاية (Kultusministerium)'),
    procedure: M('Recognition per Land; often Anpassungslehrgang; usually TWO teaching subjects + C1/C2 German required', 'Reconnaissance par Land ; souvent Anpassungslehrgang ; deux matières + allemand C1/C2 en général', 'اعتراف حسب الولاية؛ غالباً Anpassungslehrgang؛ عادةً مادتان + ألمانية C1/C2'),
    cost: '100 – 400 €', duration: M('4 – 12 months', '4 – 12 mois', '4 – 12 شهراً') },
  { key: 'erzieher', icon: '🧒', label: M('Kindergarten educator / social worker', 'Éducateur·rice / travailleur·se social·e', 'مربّي أطفال / أخصائي اجتماعي'), regulated: true,
    authority: M('State recognition office for social professions (varies by Land)', 'Office de reconnaissance des professions sociales du Land', 'مكتب الاعتراف بالمهن الاجتماعية في الولاية'),
    procedure: M('Staatliche Anerkennung; language B2/C1; deficits via adaptation courses', 'Staatliche Anerkennung ; langue B2/C1 ; écarts via cours d’adaptation', 'اعتراف رسمي؛ لغة B2/C1؛ تُسد الفجوات بدورات تكييف'),
    cost: '100 – 400 €', duration: M('3 – 9 months', '3 – 9 mois', '3 – 9 أشهر') },
  { key: 'craft', icon: '🔧', label: M('Skilled trade (electrician, plumber, mechanic…)', 'Métier manuel (électricien, plombier, mécanicien…)', 'حِرفة (كهربائي، سبّاك، ميكانيكي…)'), regulated: false,
    authority: M('Chamber of crafts — HWK (via the central office "ZAQ"/local HWK)', 'Chambre des métiers — HWK', 'غرفة الحرف — HWK'),
    procedure: M('Gleichwertigkeitsprüfung; partial recognition + Anpassungsqualifizierung is common and enough for the visa', 'Gleichwertigkeitsprüfung ; reconnaissance partielle + qualification d’adaptation, suffisant pour le visa', 'فحص التكافؤ؛ الاعتراف الجزئي + تأهيل تكييفي شائع ويكفي للتأشيرة'),
    cost: '100 – 600 €', duration: M('3 – 6 months', '3 – 6 mois', '3 – 6 أشهر') },
  { key: 'business', icon: '📊', label: M('Office / commercial vocational training', 'Formation commerciale / administrative', 'تكوين تجاري / إداري'), regulated: false,
    authority: M('IHK FOSA (Nuremberg) — central office of the chambers of commerce', 'IHK FOSA (Nuremberg) — office central des CCI', 'IHK FOSA (نورمبرغ) — المكتب المركزي لغرف التجارة'),
    procedure: M('Gleichwertigkeitsfeststellung against the German reference occupation', 'Gleichwertigkeitsfeststellung par rapport au métier de référence allemand', 'إثبات التكافؤ مع المهنة المرجعية الألمانية'),
    cost: '100 – 600 €', duration: M('3 – 4 months', '3 – 4 mois', '3 – 4 أشهر') },
  { key: 'uni', icon: '🎓', label: M('Other university degree', 'Autre diplôme universitaire', 'شهادة جامعية أخرى'), regulated: false,
    authority: M('ZAB (Central Office for Foreign Education), Bonn', 'ZAB (Office central pour l’éducation étrangère), Bonn', 'ZAB (المكتب المركزي للتعليم الأجنبي)، بون'),
    procedure: M('Zeugnisbewertung — statement of comparability; check anabin first (your uni may be listed H+)', 'Zeugnisbewertung — attestation de comparabilité ; vérifiez d’abord anabin (statut H+)', 'تقييم الشهادة؛ تحقق أولاً من anabin (تصنيف H+)'),
    cost: '≈ 208 €', duration: M('~3 months', '~3 mois', '~3 أشهر') },
]

export default function AnerkennungWizard({ locale }: { locale: AppLocale }) {
  const t = <T,>(v: L3<T>) => pick3(locale, v)
  const dir = dirFor(locale)
  const [prof, setProf] = useState<Prof | null>(null)
  const [origin, setOrigin] = useState<'eu' | 'noneu' | null>(null)

  return (
    <div className="min-h-screen bg-[var(--bg)]" dir={dir}>
      <ToolHero eyebrow={t(S.eyebrow)} title={t(S.title)} subtitle={t(S.sub)} />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">1 · {t(S.q1)}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PROFESSIONS.map((p) => (
            <button key={p.key} onClick={() => setProf(p)}
              className={`rounded-xl border-2 px-4 py-3 text-sm text-start transition-colors ${prof?.key === p.key ? 'border-green-500 bg-green-50 text-green-800 font-semibold' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}>
              <span className="me-2">{p.icon}</span>{t(p.label)}
            </button>
          ))}
        </div>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mt-8 mb-3">2 · {t(S.q2)}</h2>
        <div className="grid grid-cols-2 gap-2">
          {([['eu', S.eu], ['noneu', S.nonEu]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setOrigin(key)}
              className={`rounded-xl border-2 px-4 py-3 text-sm transition-colors ${origin === key ? 'border-green-500 bg-green-50 text-green-800 font-semibold' : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'}`}>
              {t(label)}
            </button>
          ))}
        </div>

        {prof && origin && (
          <div className="mt-8 rounded-2xl border-2 border-green-300 bg-white p-6">
            <p className={`text-sm font-bold rounded-lg px-3 py-2 ${prof.regulated ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {prof.regulated ? '🔒 ' + t(S.regulated) : '🔓 ' + t(S.notRegulated)}
            </p>

            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-xs font-bold text-gray-400 uppercase">{t(S.authority)}</dt>
                <dd className="text-gray-800 mt-0.5">{t(prof.authority)}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-gray-400 uppercase">{t(S.procedure)}</dt>
                <dd className="text-gray-800 mt-0.5">{t(prof.procedure)}</dd>
              </div>
              <div className="flex gap-8">
                <div>
                  <dt className="text-xs font-bold text-gray-400 uppercase">{t(S.cost)}</dt>
                  <dd className="text-gray-800 font-semibold mt-0.5" dir="ltr">{prof.cost}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-gray-400 uppercase">{t(S.duration)}</dt>
                  <dd className="text-gray-800 font-semibold mt-0.5">{t(prof.duration)}</dd>
                </div>
              </div>
            </dl>

            <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">📎 {t(S.docs)}{origin === 'eu' && ' (EU: usually no apostille needed / UE : apostille en général non requise)'}</p>

            <p className="text-xs font-bold text-gray-400 uppercase mt-4">{t(S.links)}</p>
            <div className="flex gap-2 flex-wrap mt-2 text-xs">
              <a href="https://www.anerkennung-in-deutschland.de" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 font-medium">anerkennung-in-deutschland.de ↗</a>
              <a href="https://anabin.kmk.org" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 font-medium">anabin ↗</a>
              {prof.key === 'business' && <a href="https://www.ihk-fosa.de" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 font-medium">IHK FOSA ↗</a>}
            </div>

            <div className="flex gap-2 flex-wrap mt-5">
              <Link href="/tools/document-checklist" className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2">{t(S.ctaChecklist)}</Link>
              <Link href="/tools/chancenkarte-calculator" className="rounded-lg border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold px-4 py-2 bg-white">{t(S.ctaCk)}</Link>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">{t(S.disclaimer)}</p>
      </div>
    </div>
  )
}
