import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

/**
 * "You might also need…" cross-link block at the bottom of every tool
 * page. Tool pages were near-orphan in the internal link graph — Google
 * uses internal links to allocate crawl budget, and pages with no
 * inbound links are deprioritised. This block fixes that and also
 * keeps the user moving when they finish one tool.
 *
 * Each tool curates 3 sibling tools that make sense as the next step.
 * All labels come from the landing.tools.* message keys
 * (the 2026-07 tools were injected into all 12 files).
 */
type ToolKey =
  | 'cv'
  | 'anschreiben'
  | 'eligibilityChecker'
  | 'documentChecklist'
  | 'migrationTimeline'
  | 'livingCost'
  | 'chancenkarte'
  | 'sperrkonto'
  | 'bruttoNetto'
  | 'anerkennung'
  | 'cityComparator'

const HREF: Record<ToolKey, string> = {
  cv: '/cv-builder',
  anschreiben: '/anschreiben-generator',
  eligibilityChecker: '/tools/eligibility-checker',
  documentChecklist: '/tools/document-checklist',
  migrationTimeline: '/tools/migration-timeline',
  livingCost: '/tools/living-cost-calculator',
  chancenkarte: '/tools/chancenkarte-calculator',
  sperrkonto: '/tools/sperrkonto-calculator',
  bruttoNetto: '/tools/brutto-netto-rechner',
  anerkennung: '/tools/anerkennung-wizard',
  cityComparator: '/tools/city-comparator',
}

const ICON: Record<ToolKey, string> = {
  cv: '📄',
  anschreiben: '✍️',
  eligibilityChecker: '✅',
  documentChecklist: '📋',
  migrationTimeline: '🗺️',
  livingCost: '💶',
  chancenkarte: '🃏',
  sperrkonto: '🔒',
  bruttoNetto: '🧮',
  anerkennung: '📜',
  cityComparator: '⚖️',
}

// Each tool's three most logical follow-up tools.
const RELATIONS: Record<ToolKey, [ToolKey, ToolKey, ToolKey]> = {
  cv:                 ['anschreiben', 'eligibilityChecker', 'bruttoNetto'],
  anschreiben:        ['cv', 'eligibilityChecker', 'documentChecklist'],
  eligibilityChecker: ['chancenkarte', 'documentChecklist', 'migrationTimeline'],
  documentChecklist:  ['sperrkonto', 'eligibilityChecker', 'migrationTimeline'],
  migrationTimeline:  ['eligibilityChecker', 'documentChecklist', 'sperrkonto'],
  livingCost:         ['cityComparator', 'bruttoNetto', 'migrationTimeline'],
  chancenkarte:       ['sperrkonto', 'anerkennung', 'bruttoNetto'],
  sperrkonto:         ['documentChecklist', 'chancenkarte', 'livingCost'],
  bruttoNetto:        ['cityComparator', 'livingCost', 'chancenkarte'],
  anerkennung:        ['chancenkarte', 'documentChecklist', 'cv'],
  cityComparator:     ['livingCost', 'bruttoNetto', 'migrationTimeline'],
}

export default async function RelatedTools({
  locale,
  current,
}: {
  locale: AppLocale
  current: ToolKey
}) {
  const t = await getTranslations({ locale, namespace: 'landing.tools' })
  const headT = await getTranslations({ locale, namespace: 'relatedTools' })
  const others = RELATIONS[current]

  const label = (key: ToolKey): { name: string; desc: string } => ({ name: t(`${key}.name`), desc: t(`${key}.desc`) })

  return (
    <section className="related-tools">
      <div className="wrap">
        <h2 className="related-tools-title">{headT('title')}</h2>
        <p className="related-tools-sub">{headT('subtitle')}</p>
        <div className="related-tools-grid">
          {others.map((key) => {
            const { name, desc } = label(key)
            return (
              <Link key={key} href={HREF[key]} className="related-tools-card">
                <div className="related-tools-icon" aria-hidden>{ICON[key]}</div>
                <div className="related-tools-text">
                  <h3>{name}</h3>
                  <p>{desc}</p>
                </div>
                <span className="related-tools-arrow" aria-hidden>→</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
