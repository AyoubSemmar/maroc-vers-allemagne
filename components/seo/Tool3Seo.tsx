import type { AppLocale } from '@/i18n/routing'
import { dirFor } from '@/i18n/routing'
import { pick3, type L3 } from '@/lib/toolStrings'

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
    <section className="bg-white border-t border-gray-100" dir={dirFor(locale)}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900">{pick3(locale, heading)}</h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-gray-600 leading-relaxed mt-3">
            {pick3(locale, p)}
          </p>
        ))}
      </div>
    </section>
  )
}
