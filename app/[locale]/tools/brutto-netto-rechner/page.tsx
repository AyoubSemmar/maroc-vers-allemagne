import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import BruttoNetto from './BruttoNetto'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Brutto Netto Calculator Germany 2026 — Net Salary Estimator | GoGermany', d: 'What is left of your German gross salary? Free brutto→netto calculator with tax classes, church tax and all social contributions.' },
  fr: { t: 'Calculateur Brut Net Allemagne 2026 — Salaire net estimé | GoGermany', d: 'Que reste-t-il de votre salaire brut allemand ? Calculateur brut→net gratuit : classes d’impôt, impôt d’église et cotisations sociales.' },
  ar: { t: 'حاسبة الراتب الصافي في ألمانيا 2026 | GoGermany', d: 'كم يتبقى من راتبك الإجمالي في ألمانيا؟ حاسبة مجانية: فئات الضريبة، ضريبة الكنيسة وجميع الاشتراكات الاجتماعية.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/brutto-netto-rechner',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'Understanding Brutto vs Netto: German salary deductions explained',
    fr: 'Comprendre Brut vs Net : les prélèvements sur salaire en Allemagne',
    ar: 'فهم الراتب الإجمالي والصافي: اقتطاعات الرواتب في ألمانيا',
  } as L3,
  paragraphs: [
    {
      en: 'A German gross salary (Brutto) loses roughly 30–40 % before it reaches your account: progressive income tax (Lohnsteuer) depending on your tax class, plus your share of social insurance — pension (9.3 %), health (~8.5 %), long-term care and unemployment insurance. This Brutto-Netto calculator applies the official §32a tax formula and current contribution rates to estimate your real take-home pay.',
      fr: 'Un salaire brut allemand perd environ 30 à 40 % avant d’arriver sur votre compte : impôt sur le revenu progressif (Lohnsteuer) selon votre classe d’impôt, plus votre part de cotisations sociales — retraite (9,3 %), maladie (~8,5 %), dépendance et chômage. Ce calculateur brut-net applique la formule fiscale officielle du §32a et les taux de cotisation actuels pour estimer votre salaire net réel.',
      ar: 'يفقد الراتب الإجمالي الألماني نحو 30–40% قبل وصوله إلى حسابك: ضريبة دخل تصاعدية حسب فئتك الضريبية، إضافة إلى حصتك من التأمينات الاجتماعية — التقاعد (9.3%) والصحة (~8.5%) والرعاية والبطالة. تطبق هذه الحاسبة معادلة الضريبة الرسمية §32a ومعدلات الاشتراك الحالية لتقدير راتبك الصافي الحقيقي.',
    } as L3,
    {
      en: 'Compare tax classes I–V (married couples often save with the III/V combination), toggle church tax, and see exactly where every euro goes. Whether you are weighing a job offer, an Ausbildung salary or a Blue Card threshold, always negotiate in Brutto and judge in Netto — against the living costs of your target city.',
      fr: 'Comparez les classes d’impôt I à V (les couples mariés gagnent souvent avec la combinaison III/V), activez l’impôt d’église et voyez où part chaque euro. Offre d’emploi, salaire d’Ausbildung ou seuil de Carte bleue : négociez toujours en brut et jugez en net — face au coût de la vie de votre ville cible.',
      ar: 'قارن بين الفئات الضريبية I–V (غالباً ما يوفر المتزوجون بتركيبة III/V)، وفعّل ضريبة الكنيسة، وشاهد أين يذهب كل يورو. سواء كنت تقيّم عرض عمل أو راتب أوسبيلدونغ أو عتبة البطاقة الزرقاء: فاوض دائماً بالإجمالي واحكم بالصافي — مقارنةً بتكاليف مدينتك المستهدفة.',
    } as L3,
  ],
}

export default async function BruttoNettoPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <BruttoNetto locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="bruttoNetto" />
    </>
  )
}
