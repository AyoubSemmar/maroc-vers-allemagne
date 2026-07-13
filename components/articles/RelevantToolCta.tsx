import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

// Article category → the single most relevant free tool. This turns the
// article corpus into topic clusters that link *into* the interactive tools
// (internal-link equity + conversions). Categories with no natural tool are
// omitted → no CTA renders. `key` maps to landing.tools.<key>.{name,desc}.
const CAT_TOOL: Record<string, { href: string; key: string; icon: string }> = {
  visa:                { href: '/tools/eligibility-checker',     key: 'eligibilityChecker', icon: '✅' },
  jobs:                { href: '/tools/ausbildung-salary',       key: 'ausbSalary',         icon: '💶' },
  work:                { href: '/tools/brutto-netto-rechner',    key: 'bruttoNetto',        icon: '🧮' },
  ausbildung:          { href: '/tools/ausbildung-salary',       key: 'ausbSalary',         icon: '💶' },
  studium:             { href: '/tools/sperrkonto-calculator',   key: 'sperrkonto',         icon: '🔒' },
  universities:        { href: '/tools/german-grade-calculator', key: 'gradeConverter',     icon: '🎓' },
  housing:             { href: '/tools/furnished-housing',       key: 'furnishedHousing',   icon: '🏠' },
  banking:             { href: '/tools/sperrkonto-calculator',   key: 'sperrkonto',         icon: '🔒' },
  money:               { href: '/tools/brutto-netto-rechner',    key: 'bruttoNetto',        icon: '🧮' },
  taxes:               { href: '/tools/tax-refund-calculator',   key: 'taxRefund',          icon: '💰' },
  healthcare:          { href: '/tools/health-insurance-germany', key: 'healthInsurance',   icon: '🏥' },
  bureaucracy:         { href: '/tools/document-checklist',      key: 'documentChecklist',  icon: '📋' },
  'driving-transport': { href: '/tools/driving-license-germany', key: 'license',            icon: '🚗' },
  'career-growth':     { href: '/tools/anerkennung-wizard',      key: 'anerkennung',        icon: '📜' },
  'daily-life':        { href: '/tools/living-cost-calculator',  key: 'livingCost',         icon: '💶' },
  family:              { href: '/tools/living-cost-calculator',  key: 'livingCost',         icon: '💶' },
  integration:         { href: '/tools/migration-timeline',      key: 'migrationTimeline',  icon: '🗺️' },
}

export default async function RelevantToolCta({
  locale,
  category,
}: {
  locale: AppLocale
  category: string
}) {
  const tool = CAT_TOOL[category]
  if (!tool) return null

  const tA = await getTranslations({ locale, namespace: 'articles' })
  const tT = await getTranslations({ locale, namespace: 'landing.tools' })

  return (
    <Link
      href={tool.href as any}
      className="not-prose flex items-center gap-4 my-8 p-5 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors no-underline"
    >
      <div className="flex-none w-12 h-12 rounded-xl bg-white grid place-items-center text-2xl" aria-hidden>
        {tool.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-green-700">
          {tA('tryTool')}
        </p>
        <p className="font-bold text-gray-900">{tT(`${tool.key}.name`)}</p>
        <p className="text-sm text-gray-600 line-clamp-1">{tT(`${tool.key}.desc`)}</p>
      </div>
      <span className="flex-none text-green-700 font-bold text-lg" aria-hidden>→</span>
    </Link>
  )
}
