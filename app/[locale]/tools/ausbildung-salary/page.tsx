import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import SalaryExplorer from './SalaryExplorer'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Ausbildung Salary 2026 — What Every Apprenticeship Pays | GoGermany', d: 'Training pay for 24 professions per Lehrjahr — nursing, KFZ, electronics, IT, driving, construction and more — plus net estimate and starting salary after graduation.' },
  fr: { t: 'Salaire Ausbildung 2026 — combien paie chaque formation | GoGermany', d: 'Rémunération de 24 métiers par année de formation — soins, KFZ, électricité, informatique, conduite, bâtiment… — avec estimation du net et salaire de départ.' },
  ar: { t: 'راتب الأوسبيلدونغ 2026 — كم تدفع كل مهنة | GoGermany', d: 'أجور التكوين في 24 مهنة حسب سنة التكوين — التمريض والسيارات والكهرباء والمعلوميات والسياقة والبناء — مع تقدير الصافي وراتب البداية.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/ausbildung-salary',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'How much does an Ausbildung pay in Germany?',
    fr: 'Combien gagne-t-on pendant une Ausbildung en Allemagne ?',
    ar: 'كم يبلغ راتب الأوسبيلدونغ في ألمانيا؟',
  } as L3,
  paragraphs: [
    {
      en: 'Unlike students, apprentices in Germany earn a salary from day one — the Ausbildungsvergütung. It rises every training year and differs a lot by profession: care, construction and banking pay €1,200–1,600 gross per month, while hairdressing or bakery start lower. The legal minimum training wage protects everyone (~€680/month in the first year in 2026). Because training pay usually sits below the income-tax threshold, your net is roughly gross minus ~20% social contributions — this explorer shows both, for 24 of the most in-demand professions.',
      fr: 'Contrairement aux étudiants, les apprentis en Allemagne touchent un salaire dès le premier jour — l’Ausbildungsvergütung. Il augmente chaque année et varie fortement selon le métier : soins, bâtiment et banque paient 1 200 à 1 600 € brut par mois, la coiffure ou la boulangerie démarrent plus bas. Le salaire minimum légal de formation protège tout le monde (~680 €/mois la première année en 2026). Comme la rémunération reste sous le seuil d’imposition, le net correspond environ au brut moins ~20 % de cotisations — cet outil montre les deux, pour 24 métiers recherchés.',
      ar: 'على عكس الطلبة، يتقاضى المتدربون في ألمانيا راتباً من اليوم الأول — يسمى Ausbildungsvergütung. يرتفع كل سنة تكوين ويختلف كثيراً حسب المهنة: التمريض والبناء والبنوك تدفع 1200–1600 € إجمالياً شهرياً، بينما تبدأ الحلاقة أو المخبزة أدنى. ويحمي الجميعَ حدٌّ أدنى قانوني (~680 € شهرياً في السنة الأولى في 2026). ولأن أجر التكوين يبقى تحت عتبة الضريبة غالباً، فالصافي يعادل تقريباً الإجمالي ناقص ~20% اشتراكات اجتماعية — تعرض هذه الأداة الرقمين لـ24 مهنة مطلوبة.',
    } as L3,
    {
      en: 'The bigger number is what comes after: a qualified Fachkraft earns €2,600–3,800 gross to start, with fast growth through further training (Meister, Techniker). When comparing professions, look at the starting salary and the shortage level, not just the training pay — a care or electronics Ausbildung with slightly lower training pay leads to far stronger lifetime earnings. Check live openings on our Ausbildung job board and compute your exact net with the Brutto-Netto calculator.',
      fr: 'Le chiffre le plus important vient après : un Fachkraft diplômé démarre entre 2 600 et 3 800 € brut, avec une progression rapide via la formation continue (Meister, Techniker). Pour comparer les métiers, regardez le salaire de départ et la pénurie de main-d’œuvre, pas seulement la rémunération de formation — une Ausbildung en soins ou en électricité, même un peu moins payée pendant la formation, mène à des revenus bien supérieurs. Consultez les offres en direct sur notre job board et calculez votre net exact avec le calculateur brut-net.',
      ar: 'الرقم الأهم يأتي لاحقاً: العامل المؤهل يبدأ بـ2600–3800 € إجمالياً، مع نمو سريع عبر التكوين المستمر (مايستر، تقني). عند مقارنة المهن انظر إلى راتب البداية ومستوى النقص في العمالة، لا إلى أجر التكوين فقط — فأوسبيلدونغ التمريض أو الكهرباء، حتى بأجر تكوين أقل قليلاً، يقود إلى دخل أعلى بكثير. تصفح العروض الحية في لوحة وظائف الأوسبيلدونغ واحسب صافيك بدقة عبر حاسبة الراتب.',
    } as L3,
  ],
}

export default async function AusbildungSalaryPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <SalaryExplorer locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="ausbSalary" />
    </>
  )
}
