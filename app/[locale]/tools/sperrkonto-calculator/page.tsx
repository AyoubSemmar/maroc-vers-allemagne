import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import SperrkontoCalculator from './SperrkontoCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Sperrkonto Calculator 2026 — Blocked Account Amount for Germany | GoGermany', d: 'How much money do you need for your German visa? 2026 blocked-account calculator: 992 €/month for students, plus visa, insurance and one-time costs.' },
  fr: { t: 'Calculateur Sperrkonto 2026 — Montant du compte bloqué Allemagne | GoGermany', d: 'De combien avez-vous besoin pour votre visa allemand ? Calculateur 2026 du compte bloqué : 992 €/mois pour étudiants + frais uniques.' },
  ar: { t: 'حاسبة الحساب المجمّد 2026 — المبلغ المطلوب لتأشيرة ألمانيا | GoGermany', d: 'كم تحتاج من المال لتأشيرة ألمانيا؟ حاسبة الحساب المجمّد 2026: 992 € شهرياً للطلبة + التكاليف لمرة واحدة.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/sperrkonto-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export const SEO = {
  heading: {
    en: 'Why you need a blocked account (Sperrkonto) for your German visa',
    fr: 'Pourquoi un compte bloqué (Sperrkonto) pour votre visa allemand',
    ar: 'لماذا تحتاج حساباً مجمّداً (Sperrkonto) لتأشيرتك الألمانية؟',
  } as L3,
  paragraphs: [
    {
      en: 'German embassies require proof of financing for student, language-course and job-seeker visas — and for most applicants that means a Sperrkonto (blocked account). In 2026 the reference amount is 992 € per month for students (11,904 € for 12 months) and about 1,027 € per month for the Chancenkarte. This Sperrkonto calculator computes your exact blocked amount for any duration and visa type.',
      fr: 'Les ambassades allemandes exigent une preuve de financement pour les visas d’études, de cours de langue et de recherche d’emploi — c’est le rôle du Sperrkonto (compte bloqué). En 2026, le montant de référence est de 992 € par mois pour les étudiants (11 904 € pour 12 mois) et d’environ 1 027 € par mois pour la Chancenkarte. Ce calculateur détermine votre montant bloqué exact selon la durée et le type de visa.',
      ar: 'تشترط السفارات الألمانية إثبات التمويل لتأشيرات الدراسة ودورات اللغة والبحث عن عمل — وهذا هو دور الحساب المجمّد (Sperrkonto). في 2026 يبلغ المبلغ المرجعي 992 € شهرياً للطلبة (11,904 € لاثني عشر شهراً) ونحو 1,027 € شهرياً لبطاقة الفرص. تحسب هذه الأداة مبلغك المجمّد الدقيق حسب المدة ونوع التأشيرة.',
    } as L3,
    {
      en: 'Beyond the blocked amount, the tool adds the real one-time costs applicants forget: the 75 € D-visa fee, health insurance until enrolment, certified translations, flights and your first weeks in Germany — giving you the total budget to plan before you transfer a single euro to an embassy-recognised provider like Fintiba or Expatrio.',
      fr: 'Au-delà du montant bloqué, l’outil ajoute les frais uniques souvent oubliés : les 75 € du visa D, l’assurance santé jusqu’à l’inscription, les traductions assermentées, les vols et les premières semaines en Allemagne — pour un budget total à planifier avant de virer le moindre euro vers un prestataire reconnu comme Fintiba ou Expatrio.',
      ar: 'إضافةً إلى مبلغ التجميد، تجمع الأداة التكاليف لمرة واحدة التي ينساها المتقدمون: رسوم تأشيرة D البالغة 75 €، التأمين الصحي حتى التسجيل، الترجمات المحلفة، الطيران والأسابيع الأولى في ألمانيا — لتحصل على الميزانية الإجمالية قبل تحويل أي يورو إلى مزوّد معترف به مثل Fintiba أو Expatrio.',
    } as L3,
  ],
}

export default async function SperrkontoPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <SperrkontoCalculator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="sperrkonto" />
    </>
  )
}
