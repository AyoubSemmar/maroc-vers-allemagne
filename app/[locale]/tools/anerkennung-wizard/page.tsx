import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import AnerkennungWizard from './AnerkennungWizard'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Anerkennung Wizard — Degree Recognition in Germany | GoGermany', d: 'Which authority recognises your qualification in Germany? Free wizard: nurse, engineer, IT, teacher, trades — procedure, costs, timelines.' },
  fr: { t: 'Assistant Anerkennung — Reconnaissance de diplôme en Allemagne | GoGermany', d: 'Quelle autorité reconnaît votre diplôme en Allemagne ? Assistant gratuit : infirmier, ingénieur, IT, enseignant — procédure, coûts, délais.' },
  ar: { t: 'مساعد الاعتراف بالشهادات في ألمانيا | GoGermany', d: 'أي جهة تعترف بشهادتك في ألمانيا؟ مساعد مجاني: تمريض، هندسة، معلوميات، تعليم — الإجراء والتكاليف والمدة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/anerkennung-wizard',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export const SEO = {
  heading: {
    en: 'Recognition of foreign qualifications in Germany, simplified',
    fr: 'La reconnaissance des diplômes étrangers en Allemagne, simplifiée',
    ar: 'الاعتراف بالمؤهلات الأجنبية في ألمانيا ببساطة',
  } as L3,
  paragraphs: [
    {
      en: 'Anerkennung — the official recognition of foreign qualifications — is mandatory for regulated professions in Germany (nurses, doctors, teachers, engineers using the title) and a powerful upgrade for everyone else: it makes you a skilled worker (Fachkraft), improves visa options like the EU Blue Card and adds four points to the Chancenkarte. The hard part is knowing which of Germany’s many authorities is responsible for you.',
      fr: 'L’Anerkennung — la reconnaissance officielle des qualifications étrangères — est obligatoire pour les professions réglementées en Allemagne (infirmiers, médecins, enseignants, ingénieurs) et un atout puissant pour tous les autres : elle fait de vous une Fachkraft, améliore les options de visa comme la Carte bleue européenne et ajoute quatre points à la Chancenkarte. Le plus dur est de savoir laquelle des nombreuses autorités allemandes est compétente pour vous.',
      ar: 'الاعتراف (Anerkennung) بالمؤهلات الأجنبية إلزامي للمهن المنظمة في ألمانيا (الممرضون، الأطباء، المعلمون، المهندسون) ومكسب قوي للجميع: يجعلك عاملاً مؤهلاً (Fachkraft)، ويحسّن خيارات التأشيرة كالبطاقة الزرقاء، ويضيف أربع نقاط لبطاقة الفرص. والجزء الصعب هو معرفة أي جهة من الجهات الألمانية الكثيرة مسؤولة عنك.',
    } as L3,
    {
      en: 'This wizard answers that in two questions: pick your profession group and where you trained, and get the competent authority (ZAB, IHK FOSA, state health authority, chamber of crafts…), the exact procedure, realistic costs and timelines, plus the official portals — anabin and anerkennung-in-deutschland.de — to start from.',
      fr: 'Cet assistant répond en deux questions : choisissez votre groupe professionnel et le lieu de formation, et obtenez l’autorité compétente (ZAB, IHK FOSA, autorité de santé du Land, chambre des métiers…), la procédure exacte, des coûts et délais réalistes, plus les portails officiels — anabin et anerkennung-in-deutschland.de — pour démarrer.',
      ar: 'يجيب هذا المساعد بسؤالين فقط: اختر مجموعة مهنتك ومكان تكوينك، لتحصل على الجهة المختصة (ZAB أو IHK FOSA أو هيئة الصحة أو غرفة الحرف…) والإجراء الدقيق وتكاليف ومدداً واقعية، مع البوابات الرسمية — anabin وanerkennung-in-deutschland.de — للانطلاق منها.',
    } as L3,
  ],
}

export default async function AnerkennungPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <AnerkennungWizard locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="anerkennung" />
    </>
  )
}
