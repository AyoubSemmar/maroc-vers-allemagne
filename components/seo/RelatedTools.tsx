import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'

/**
 * "You might also need…" cross-link block at the bottom of every tool
 * page. Tool pages were near-orphan in the internal link graph — Google
 * uses internal links to allocate crawl budget, and pages with no
 * inbound links are deprioritised. This block fixes that and also
 * keeps the user moving when they finish one tool.
 *
 * Each tool curates 3 sibling tools that make sense as the next step.
 * The original tools take their labels from the message files; the
 * 2026-07 additions carry inline en/fr/ar labels (see lib/toolStrings).
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

// Inline labels for the tools that don't live in the message files.
const NEW_LABELS: Partial<Record<ToolKey, { name: L3; desc: L3 }>> = {
  chancenkarte: {
    name: { en: 'Chancenkarte Calculator', fr: 'Calculateur Chancenkarte', ar: 'حاسبة بطاقة الفرص' },
    desc: { en: 'Check if you reach the 6 points for the Opportunity Card.', fr: 'Vérifiez si vous atteignez les 6 points de la carte d’opportunité.', ar: 'تحقق هل تصل إلى 6 نقاط لبطاقة الفرص.' },
  },
  sperrkonto: {
    name: { en: 'Sperrkonto Calculator', fr: 'Calculateur compte bloqué', ar: 'حاسبة الحساب المجمّد' },
    desc: { en: 'The exact blocked-account amount and total visa budget.', fr: 'Le montant exact du compte bloqué et le budget visa total.', ar: 'المبلغ الدقيق للحساب المجمّد وميزانية التأشيرة.' },
  },
  bruttoNetto: {
    name: { en: 'Brutto → Netto Calculator', fr: 'Calculateur Brut → Net', ar: 'حاسبة الراتب الصافي' },
    desc: { en: 'What is really left of a German salary after taxes.', fr: 'Ce qui reste vraiment d’un salaire allemand après impôts.', ar: 'كم يتبقى فعلاً من الراتب الألماني بعد الضرائب.' },
  },
  anerkennung: {
    name: { en: 'Anerkennung Wizard', fr: 'Assistant Anerkennung', ar: 'مساعد الاعتراف بالشهادات' },
    desc: { en: 'Which authority recognises your qualification, and how.', fr: 'Quelle autorité reconnaît votre diplôme, et comment.', ar: 'أي جهة تعترف بشهادتك وكيف.' },
  },
  cityComparator: {
    name: { en: 'City Comparator', fr: 'Comparateur de villes', ar: 'مقارنة المدن' },
    desc: { en: 'Compare two German cities’ living costs side by side.', fr: 'Comparez le coût de la vie de deux villes allemandes.', ar: 'قارن تكلفة المعيشة بين مدينتين ألمانيتين.' },
  },
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

  const label = (key: ToolKey): { name: string; desc: string } => {
    const inline = NEW_LABELS[key]
    if (inline) return { name: pick3(locale, inline.name), desc: pick3(locale, inline.desc) }
    return { name: t(`${key}.name`), desc: t(`${key}.desc`) }
  }

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
