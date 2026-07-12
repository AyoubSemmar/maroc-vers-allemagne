import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import ChancenkarteCalculator from './ChancenkarteCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Chancenkarte Points Calculator 2026 — Check Your Score | GoGermany', d: 'Free Opportunity Card calculator: check in 1 minute if you reach the 6 points for Germany’s Chancenkarte — qualification, language, age, experience.' },
  fr: { t: 'Calculateur de points Chancenkarte 2026 — Testez votre score | GoGermany', d: 'Calculateur gratuit de la carte d’opportunité : vérifiez en 1 minute si vous atteignez les 6 points de la Chancenkarte allemande.' },
  ar: { t: 'حاسبة نقاط بطاقة الفرص الألمانية 2026 | GoGermany', d: 'حاسبة مجانية لبطاقة الفرص: تحقق في دقيقة واحدة هل تصل إلى 6 نقاط — الشهادة، اللغة، العمر، الخبرة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/chancenkarte-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'How the Chancenkarte points calculator works',
    fr: 'Comment fonctionne le calculateur de points Chancenkarte',
    ar: 'كيف تعمل حاسبة نقاط بطاقة الفرص؟',
  } as L3,
  paragraphs: [
    {
      en: 'The Chancenkarte (Opportunity Card) is Germany’s points-based job-seeker visa introduced in June 2024: with 6 points you can move to Germany for 12 months to find work — no job offer required. This free Chancenkarte calculator applies the official §20a AufenthG criteria: qualification and partial recognition, shortage occupation, professional experience, German (A2–B2) and English levels, age, previous stays in Germany and an accompanying spouse.',
      fr: 'La Chancenkarte (carte d’opportunité) est le visa allemand à points lancé en juin 2024 : avec 6 points, vous pouvez vous installer 12 mois en Allemagne pour chercher un emploi — sans offre préalable. Ce calculateur gratuit applique les critères officiels du §20a AufenthG : diplôme et reconnaissance partielle, métier en pénurie, expérience professionnelle, niveaux d’allemand (A2–B2) et d’anglais, âge, séjours antérieurs en Allemagne et conjoint accompagnant.',
      ar: 'بطاقة الفرص (Chancenkarte) هي تأشيرة البحث عن عمل الألمانية بنظام النقاط منذ يونيو 2024: بست نقاط يمكنك الانتقال إلى ألمانيا لمدة 12 شهراً للبحث عن عمل — دون عرض مسبق. تطبق هذه الحاسبة المجانية المعايير الرسمية للمادة §20a: المؤهل والاعتراف الجزئي، مهن النقص، الخبرة المهنية، مستوى الألمانية (A2–B2) والإنجليزية، العمر، الإقامات السابقة في ألمانيا والزوج المرافق.',
    } as L3,
    {
      en: 'Enter your profile and see your score instantly, with concrete tips to close the gap — reaching German A2 adds a point, partial recognition of your qualification adds four. The calculator also shows the money requirement (about 1,027 € per month, usually via a blocked account) so you know the full picture before applying at the German embassy.',
      fr: 'Renseignez votre profil et voyez votre score instantanément, avec des conseils concrets pour combler l’écart — l’allemand A2 ajoute un point, la reconnaissance partielle du diplôme en ajoute quatre. Le calculateur affiche aussi l’exigence financière (environ 1 027 € par mois, en général via un compte bloqué) pour une vision complète avant le dépôt à l’ambassade.',
      ar: 'أدخل بياناتك وشاهد نقاطك فوراً مع نصائح عملية لسد الفجوة — فالوصول إلى A2 بالألمانية يضيف نقطة، والاعتراف الجزئي بالمؤهل يضيف أربع نقاط. كما تعرض الحاسبة الشرط المالي (نحو 1,027 € شهرياً عبر حساب مجمّد عادةً) لتعرف الصورة الكاملة قبل التقديم لدى السفارة الألمانية.',
    } as L3,
  ],
}

export default async function ChancenkartePage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <ChancenkarteCalculator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="chancenkarte" />
    </>
  )
}
