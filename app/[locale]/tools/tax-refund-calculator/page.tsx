import type { Metadata } from 'next'
import type { AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'
import RelatedTools from '@/components/seo/RelatedTools'
import Tool3Seo from '@/components/seo/Tool3Seo'
import TaxRefund from './TaxRefund'

type Props = { params: Promise<{ locale: AppLocale }> }

const META: L3<{ t: string; d: string }> = {
  en: { t: 'German Tax Refund Calculator — Estimate Your Steuererklärung | GoGermany', d: 'The average German tax return brings back ~€1,100. Estimate your refund from commute, home office, work equipment, German courses and relocation costs.' },
  fr: { t: 'Calculateur de remboursement d’impôts allemand — Steuererklärung | GoGermany', d: 'La déclaration d’impôts allemande rapporte en moyenne ~1 100 €. Estimez votre remboursement : trajets, télétravail, matériel, cours d’allemand, déménagement.' },
  ar: { t: 'حاسبة استرجاع الضرائب في ألمانيا — Steuererklärung | GoGermany', d: 'يعيد التصريح الضريبي الألماني في المتوسط نحو 1100 €. قدّر استرجاعك من مصاريف التنقل والعمل من المنزل والمعدات ودروس الألمانية والانتقال.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools/tax-refund-calculator',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

const SEO = {
  heading: {
    en: 'Why most employees in Germany get money back from taxes',
    fr: 'Pourquoi la plupart des salariés en Allemagne récupèrent de l’impôt',
    ar: 'لماذا يسترجع معظم الموظفين في ألمانيا جزءاً من ضرائبهم؟',
  } as L3,
  paragraphs: [
    {
      en: 'Your employer withholds wage tax every month based on standard assumptions — it ignores your commute, home-office days, the laptop you bought, your German courses and the cost of moving to Germany for the job. Filing a Steuererklärung corrects that: every euro of job costs (Werbungskosten) above the automatic €1,230 allowance comes back at your marginal tax rate, typically 25–40%. That is why the average refund is around €1,100 — and newcomers who paid for relocation, double households or language courses often get much more.',
      fr: 'Votre employeur retient l’impôt chaque mois selon des hypothèses standard — sans connaître vos trajets, vos jours de télétravail, l’ordinateur acheté, vos cours d’allemand ni le coût de votre installation en Allemagne. La Steuererklärung corrige cela : chaque euro de frais professionnels (Werbungskosten) au-dessus du forfait automatique de 1 230 € revient à votre taux marginal, typiquement 25–40 %. D’où un remboursement moyen d’environ 1 100 € — souvent bien plus pour les nouveaux arrivants ayant payé déménagement ou cours de langue.',
      ar: 'يقتطع مشغّلك ضريبة الأجر شهرياً وفق افتراضات معيارية — دون أن يعرف مصاريف تنقلك وأيام عملك من المنزل والحاسوب الذي اشتريته ودروس الألمانية وتكلفة انتقالك إلى ألمانيا. يصحّح التصريح الضريبي (Steuererklärung) ذلك: فكل يورو من المصاريف المهنية فوق المبلغ الجزافي التلقائي 1230 € يعود إليك بنسبة الضريبة الحدية، عادة 25–40%. لهذا يبلغ متوسط الاسترجاع نحو 1100 € — ويحصل القادمون الجدد الذين دفعوا تكاليف انتقال أو دروس لغة على أكثر بكثير غالباً.',
    } as L3,
    {
      en: 'Filing is voluntary for most employees, has no deadline pressure (you can file up to four years back), and takes about 30 minutes with English-speaking apps. If you moved to Germany mid-year, your refund is usually the biggest of your life: the tax tables assumed a full year of income, but you only earned part of it. Estimate your number above, then file — the Finanzamt will never send you this money on its own.',
      fr: 'La déclaration est facultative pour la plupart des salariés, sans pression de délai (jusqu’à quatre ans en arrière) et prend ~30 minutes avec les applis adaptées. Si vous êtes arrivé en Allemagne en cours d’année, votre remboursement est souvent le plus gros de votre vie : le barème a supposé une année complète de revenus alors que vous n’en avez gagné qu’une partie. Estimez votre montant ci-dessus, puis déclarez — le Finanzamt ne vous enverra jamais cet argent de lui-même.',
      ar: 'التصريح اختياري لمعظم الموظفين، ودون ضغط مواعيد (يمكن التقديم عن أربع سنوات سابقة)، ويستغرق نحو 30 دقيقة عبر تطبيقات سهلة. وإن وصلت إلى ألمانيا في منتصف السنة فاسترجاعك غالباً الأكبر في حياتك: فجداول الضريبة افترضت دخل سنة كاملة بينما لم تكسب إلا جزءاً منها. قدّر مبلغك أعلاه ثم قدّم تصريحك — فمصلحة الضرائب لن ترسل لك هذا المال من تلقاء نفسها أبداً.',
    } as L3,
  ],
}

export default async function TaxRefundPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <TaxRefund locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
      <RelatedTools locale={locale} current="taxRefund" />
    </>
  )
}
