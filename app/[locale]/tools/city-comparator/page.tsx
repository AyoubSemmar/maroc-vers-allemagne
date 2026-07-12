import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import CityComparator from './CityComparator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'German City Comparator — Cost of Living Side by Side | GoGermany', d: 'Berlin vs Munich vs Leipzig: compare rent, food, transport and total monthly costs of 15 German cities side by side.' },
  fr: { t: 'Comparateur de villes allemandes — Coût de la vie côte à côte | GoGermany', d: 'Berlin vs Munich vs Leipzig : comparez loyer, nourriture, transport et coût mensuel total de 15 villes allemandes.' },
  ar: { t: 'مقارنة المدن الألمانية — تكلفة المعيشة جنباً إلى جنب | GoGermany', d: 'برلين أم ميونخ أم لايبزيغ؟ قارن الكراء والطعام والنقل والتكلفة الشهرية في 15 مدينة ألمانية.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/city-comparator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'Compare the cost of living between German cities',
    fr: 'Comparer le coût de la vie entre villes allemandes',
    ar: 'قارن تكلفة المعيشة بين المدن الألمانية',
  } as L3,
  paragraphs: [
    {
      en: 'The same life costs wildly different amounts across Germany: a shared room runs 650 € in Munich and 380 € in Leipzig, and a full single-person budget can differ by 500–700 € per month. This city comparator puts two of fifteen major German cities side by side — rent by housing type, food, transport, health insurance and leisure — and shows the winner per category plus your total yearly savings.',
      fr: 'La même vie coûte des montants très différents selon la ville : une chambre en colocation vaut 650 € à Munich et 380 € à Leipzig, et un budget complet de célibataire peut varier de 500 à 700 € par mois. Ce comparateur met deux des quinze grandes villes allemandes côte à côte — loyer par type de logement, nourriture, transport, assurance santé, loisirs — avec le gagnant par catégorie et votre économie annuelle totale.',
      ar: 'الحياة نفسها تكلف مبالغ مختلفة جداً عبر ألمانيا: الغرفة المشتركة بـ650 € في ميونخ و380 € في لايبزيغ، وقد تختلف الميزانية الكاملة للفرد بـ500–700 € شهرياً. تضع هذه الأداة مدينتين من خمس عشرة مدينة ألمانية كبرى جنباً إلى جنب — الكراء حسب نوع السكن والطعام والنقل والتأمين الصحي والترفيه — وتُظهر الأفضل في كل بند مع توفيرك السنوي الإجمالي.',
    } as L3,
    {
      en: 'Choosing the right city is the biggest single lever in your German budget — often worth more than any scholarship. Students on the 992 € blocked-account rate live comfortably in Leipzig, Dresden or Bochum, while the same budget is tight in Munich or Frankfurt. Compare first, then match the result against your net salary with the Brutto-Netto calculator.',
      fr: 'Bien choisir sa ville est le plus grand levier de votre budget allemand — souvent plus qu’une bourse. Avec le taux de compte bloqué de 992 €, on vit confortablement à Leipzig, Dresde ou Bochum, alors que le même budget est serré à Munich ou Francfort. Comparez d’abord, puis confrontez le résultat à votre salaire net avec le calculateur brut-net.',
      ar: 'اختيار المدينة الصحيحة أكبر رافعة في ميزانيتك الألمانية — وغالباً أهم من أي منحة. فبمعدل الحساب المجمّد 992 € يعيش الطالب مرتاحاً في لايبزيغ أو درسدن أو بوخوم، بينما الميزانية نفسها ضيقة في ميونخ وفرانكفورت. قارن أولاً، ثم قابل النتيجة براتبك الصافي عبر حاسبة الإجمالي←الصافي.',
    } as L3,
  ],
}

export default async function CityComparatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <CityComparator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="cityComparator" />
    </>
  )
}
