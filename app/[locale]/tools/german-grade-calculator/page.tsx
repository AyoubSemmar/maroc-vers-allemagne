import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import GradeCalculator from './GradeCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'German Grade Calculator — Convert Your Grades (Bavarian Formula) | GoGermany', d: 'Convert grades from Morocco, India, USA, UK, Turkey and more into the German 1.0–4.0 scale with the Modified Bavarian Formula that uni-assist uses.' },
  fr: { t: 'Convertisseur de notes allemandes — Formule bavaroise | GoGermany', d: 'Convertissez vos notes (Maroc 0–20, GPA, pourcentage…) vers l’échelle allemande 1,0–4,0 avec la formule bavaroise modifiée utilisée par uni-assist.' },
  ar: { t: 'حاسبة المعدل الألماني — حوّل معدلك (المعادلة البافارية) | GoGermany', d: 'حوّل معدلك من المغرب (0–20) أو أي نظام عالمي إلى السلم الألماني 1.0–4.0 بالمعادلة البافارية المعدلة التي تعتمدها uni-assist.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/german-grade-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'How German grade conversion works (Modified Bavarian Formula)',
    fr: 'Comment fonctionne la conversion de notes allemandes (formule bavaroise)',
    ar: 'كيف يعمل تحويل المعدل إلى النظام الألماني (المعادلة البافارية)؟',
  } as L3,
  paragraphs: [
    {
      en: 'German universities grade from 1.0 (best) to 4.0 (minimum pass) — the reverse of most systems. To compare foreign grades, uni-assist and admissions offices apply the Modified Bavarian Formula: 1 + 3 × (best grade − your grade) / (best grade − pass grade). This calculator implements exactly that formula with presets for Morocco and France (0–20), India (percentage and CGPA), the US GPA, the UK system, Turkey, China, Russia and more.',
      fr: 'Les universités allemandes notent de 1,0 (meilleure note) à 4,0 (minimum) — l’inverse de la plupart des systèmes. Pour comparer les notes étrangères, uni-assist et les services d’admission appliquent la formule bavaroise modifiée : 1 + 3 × (note max − votre note) / (note max − seuil de réussite). Ce convertisseur implémente exactement cette formule avec des préréglages pour le Maroc et la France (0–20), l’Inde, le GPA américain, le système britannique, la Turquie, la Chine, la Russie et plus.',
      ar: 'تمنح الجامعات الألمانية علامات من 1.0 (الأفضل) إلى 4.0 (حد النجاح) — عكس معظم الأنظمة. ولمقارنة المعدلات الأجنبية تطبق uni-assist ومكاتب القبول المعادلة البافارية المعدلة: 1 + 3 × (أعلى علامة − علامتك) / (أعلى علامة − حد النجاح). تنفذ هذه الحاسبة المعادلة نفسها مع إعدادات جاهزة للمغرب وفرنسا (0–20) والهند وGPA الأمريكي والنظام البريطاني وتركيا والصين وروسيا وغيرها.',
    } as L3,
    {
      en: 'Your converted grade decides real outcomes: NC-restricted programs, DAAD and Deutschlandstipendium scholarships, and Fachkraft recognition all read the German scale. A 1.x is excellent, up to 2.5 competitive, and anything at or below 4.0 passes. The official number for applications remains uni-assist’s VPD — use this tool to know where you stand before you pay for it.',
      fr: 'Votre note convertie décide de résultats concrets : cursus à NC, bourses DAAD et Deutschlandstipendium, reconnaissance de Fachkraft — tout se lit sur l’échelle allemande. Un 1,x est excellent, jusqu’à 2,5 compétitif, et tout ce qui est ≤ 4,0 est validé. Le chiffre officiel reste le VPD d’uni-assist — utilisez cet outil pour savoir où vous en êtes avant de le payer.',
      ar: 'معدلك المحوَّل يحسم نتائج حقيقية: التخصصات محدودة القبول (NC)، ومنح DAAD وDeutschlandstipendium، والاعتراف كعامل مؤهل — كلها تُقرأ بالسلم الألماني. فدرجة 1.x ممتازة، وحتى 2.5 تنافسية، وكل ما هو 4.0 فأقل ناجح. يبقى الرقم الرسمي للطلبات هو VPD من uni-assist — استخدم هذه الأداة لتعرف موقعك قبل دفع رسومه.',
    } as L3,
  ],
}

export default async function GradeCalculatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <GradeCalculator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="gradeConverter" />
    </>
  )
}
