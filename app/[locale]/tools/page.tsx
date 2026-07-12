import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import { pick3, TOOL_INDEX_LOCALES, type L3 } from '@/lib/toolStrings'

type Props = { params: Promise<{ locale: AppLocale }> }

// The hub for all interactive tools. Fixes two things at once: the nav
// dropdown got too long to show everything, and the tools had no single
// crawlable index page. Labels come from landing.tools.* (all 12 locales).
const TOOLS: { key: string; href: string; icon: string }[] = [
  { key: 'chancenkarte', href: '/tools/chancenkarte-calculator', icon: '🃏' },
  { key: 'sperrkonto', href: '/tools/sperrkonto-calculator', icon: '🔒' },
  { key: 'bruttoNetto', href: '/tools/brutto-netto-rechner', icon: '🧮' },
  { key: 'gradeConverter', href: '/tools/german-grade-calculator', icon: '🎓' },
  { key: 'anerkennung', href: '/tools/anerkennung-wizard', icon: '📜' },
  { key: 'cityComparator', href: '/tools/city-comparator', icon: '⚖️' },
  { key: 'livingCost', href: '/tools/living-cost-calculator', icon: '💶' },
  { key: 'eligibilityChecker', href: '/tools/eligibility-checker', icon: '✅' },
  { key: 'documentChecklist', href: '/tools/document-checklist', icon: '📋' },
  { key: 'migrationTimeline', href: '/tools/migration-timeline', icon: '🗺️' },
  { key: 'cv', href: '/cv-builder', icon: '📄' },
  { key: 'anschreiben', href: '/anschreiben-generator', icon: '✍️' },
]

const META: L3<{ t: string; d: string }> = {
  en: { t: 'Free Tools for Moving to Germany — Calculators & Checklists | GoGermany', d: '12 free interactive tools: Chancenkarte points, Sperrkonto amount, Brutto-Netto salary, grade conversion, degree recognition, city comparison and more.' },
  fr: { t: 'Outils gratuits pour partir en Allemagne — Calculateurs & checklists | GoGermany', d: '12 outils interactifs gratuits : points Chancenkarte, montant Sperrkonto, salaire brut-net, conversion de notes, reconnaissance de diplôme, comparaison de villes.' },
  ar: { t: 'أدوات مجانية للانتقال إلى ألمانيا — حاسبات وقوائم | GoGermany', d: '12 أداة تفاعلية مجانية: نقاط بطاقة الفرص، مبلغ الحساب المجمّد، الراتب الصافي، تحويل المعدل، الاعتراف بالشهادات ومقارنة المدن.' },
}

const HEAD: L3<{ h1: string; sub: string }> = {
  en: { h1: 'Free tools for your move to Germany', sub: 'Calculators, checklists and wizards — every number and decision on your Germany journey, computed in seconds. No sign-up needed.' },
  fr: { h1: 'Outils gratuits pour votre départ en Allemagne', sub: 'Calculateurs, checklists et assistants — chaque chiffre et chaque décision de votre parcours vers l’Allemagne, en quelques secondes. Sans inscription.' },
  ar: { h1: 'أدوات مجانية لرحلتك إلى ألمانيا', sub: 'حاسبات وقوائم ومساعدون أذكياء — كل رقم وقرار في مسارك نحو ألمانيا محسوب في ثوانٍ، دون تسجيل.' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = pick3(locale, META)
  return buildLocaleMetadata({
    locale,
    path: '/tools',
    title: m.t,
    description: m.d,
    indexLocales: [...TOOL_INDEX_LOCALES] as AppLocale[],
  })
}

export default async function ToolsHubPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'landing.tools' })
  const h = pick3(locale, HEAD)

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">🧰 {h.h1}</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">{h.sub}</p>

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {TOOLS.map((tool) => (
            <Link key={tool.key} href={tool.href}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-400 hover:shadow-md transition-all flex gap-4 items-start">
              <span className="text-2xl shrink-0" aria-hidden>{tool.icon}</span>
              <span className="min-w-0">
                <span className="block font-bold text-gray-900">{t(`${tool.key}.name`)}</span>
                <span className="block text-sm text-gray-500 mt-0.5 leading-relaxed">{t(`${tool.key}.desc`)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
