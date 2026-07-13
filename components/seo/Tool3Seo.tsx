import type { AppLocale } from '@/i18n/routing'
import { dirFor } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'
import ToolByline from '@/components/seo/ToolByline'

/**
 * SEO description section for the 2026-07 tools. The original tools render
 * ToolSeoSection from message namespaces; these carry their copy inline in
 * en/fr/ar (matching their indexLocales) with English fallback elsewhere.
 * Server component — the text is in the SSR HTML for crawlers.
 */
export default function Tool3Seo({
  locale,
  heading,
  paragraphs,
}: {
  locale: AppLocale
  heading: L3
  paragraphs: L3[]
}) {
  return (
    <section className="border-t" style={{ borderColor: 'var(--line)' }} dir={dirFor(locale)}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold" style={{ color: 'var(--ink)' }}>{pick3(locale, heading)}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed mt-3" style={{ color: 'var(--ink-soft)' }}>
            {pick3(locale, p)}
          </p>
        ))}
        <ToolByline locale={locale} />
      </div>
    </section>
  )
}
