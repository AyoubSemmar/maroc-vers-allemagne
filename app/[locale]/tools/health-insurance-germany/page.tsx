import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import InsuranceChooser from './InsuranceChooser'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Health Insurance in Germany — Chooser & Cost Calculator | GoGermany', d: 'Student, Ausbildung, employee, visa applicant or freelancer: see which German health insurance you need (GKV, PKV or incoming) and the real monthly cost.' },
  fr: { t: 'Assurance santé en Allemagne — choix & coût | GoGermany', d: 'Étudiant, Ausbildung, salarié, visa ou freelance : voyez quelle assurance santé allemande il vous faut (GKV, PKV ou incoming) et son coût mensuel réel.' },
  ar: { t: 'التأمين الصحي في ألمانيا — الاختيار والتكلفة | GoGermany', d: 'طالب أو متدرب أو موظف أو طالب تأشيرة أو مستقل: اعرف أي تأمين صحي ألماني تحتاج (GKV أو PKV أو Incoming) وتكلفته الشهرية الحقيقية.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/health-insurance-germany',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export const SEO = {
  heading: {
    en: 'How health insurance works in Germany (GKV vs PKV vs incoming)',
    fr: 'Comment fonctionne l’assurance santé en Allemagne (GKV, PKV, incoming)',
    ar: 'كيف يعمل التأمين الصحي في ألمانيا (GKV وPKV وIncoming)؟',
  } as L3,
  paragraphs: [
    {
      en: 'Health insurance is legally mandatory in Germany — no visa, university enrolment or job without proof of it. About 90% of residents use public insurance (GKV): students under 30 pay a fixed ~€130–145 monthly rate, apprentices and employees pay roughly 8–9% of gross salary with the employer covering the other half, and family members without income are co-insured free. Private insurance (PKV) is reserved for high earners, freelancers and civil servants — cheaper when young and healthy, but hard to leave later.',
      fr: 'L’assurance santé est légalement obligatoire en Allemagne — pas de visa, d’inscription universitaire ni d’emploi sans attestation. Environ 90 % des résidents utilisent la caisse publique (GKV) : les étudiants de moins de 30 ans paient un tarif fixe (~130–145 €/mois), apprentis et salariés versent environ 8–9 % du brut (l’employeur paie l’autre moitié), et les membres de la famille sans revenus sont co-assurés gratuitement. La privée (PKV) est réservée aux hauts revenus, indépendants et fonctionnaires — moins chère jeune, mais difficile à quitter ensuite.',
      ar: 'التأمين الصحي إجباري قانوناً في ألمانيا — لا تأشيرة ولا تسجيل جامعي ولا عمل دون إثباته. نحو 90% من المقيمين في التأمين العمومي (GKV): يدفع الطلبة دون الثلاثين تعريفة ثابتة (~130–145 € شهرياً)، ويدفع المتدربون والموظفون نحو 8–9% من الراتب الإجمالي ويتحمل المشغّل النصف الآخر، ويُؤمَّن أفراد العائلة بلا دخل مجاناً. أما الخاص (PKV) فمخصص لأصحاب الدخول العالية والمستقلين — أرخص في الشباب لكن يصعب الخروج منه لاحقاً.',
    } as L3,
    {
      en: 'The trap most newcomers miss: the gap between landing and starting university or work. GKV only begins with enrolment or employment, but the visa requires coverage from day one — that is what incoming insurance is for (~€30–80/month for up to a few months). Choose your Krankenkasse once and well: all cover the same core services, but English-speaking support and app quality differ. This chooser gives you the realistic number for your exact situation before you sign anything.',
      fr: 'Le piège classique des nouveaux arrivants : la période entre l’arrivée et le début des études ou du travail. La GKV ne commence qu’avec l’inscription ou l’emploi, mais le visa exige une couverture dès le premier jour — c’est le rôle de l’assurance incoming (~30–80 €/mois pour quelques mois). Choisissez bien votre caisse : toutes couvrent le même socle, mais le support anglophone et la qualité de l’appli diffèrent. Cet outil vous donne le chiffre réaliste pour votre situation exacte avant de signer.',
      ar: 'الفخ الذي يغفل عنه معظم القادمين: الفترة بين الوصول وبدء الدراسة أو العمل. لا يبدأ GKV إلا مع التسجيل أو التوظيف، بينما تشترط التأشيرة تغطية من اليوم الأول — وهنا يأتي تأمين Incoming (نحو 30–80 € شهرياً لأشهر قليلة). اختر صندوقك مرة واحدة وبعناية: الكل يغطي الأساس نفسه، لكن الدعم بالإنجليزية وجودة التطبيق يختلفان. تعطيك هذه الأداة الرقم الواقعي لوضعك بالضبط قبل أي توقيع.',
    } as L3,
  ],
}

export default async function HealthInsurancePage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <InsuranceChooser locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="healthInsurance" />
    </>
  )
}
