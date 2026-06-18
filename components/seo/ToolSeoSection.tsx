import { getTranslations } from 'next-intl/server'
import JsonLd from '@/components/seo/JsonLd'
import type { AppLocale } from '@/i18n/routing'

/**
 * Long-form SEO copy block shown at the bottom of every tool page.
 *
 * Tool pages are JS-driven and short on indexable text. Without this
 * section, Google has very little crawlable content to rank against
 * the queries visitors actually type ("calendrier visa allemagne",
 * "checklist documents ausbildung", etc). Each tool's namespace
 * declares:
 *   seoSection.title          page-section heading
 *   seoSection.intro          one or more <p> separated by \n\n
 *   seoSection.faqTitle       heading above the FAQ list
 *   seoSection.faqs           array of { q, a } pairs
 *
 * The FAQ list also emits FAQPage JSON-LD so the tool page is eligible
 * for Google's expandable FAQ rich result.
 */
export default async function ToolSeoSection({
  locale,
  namespace,
}: {
  locale: AppLocale
  namespace: string
}) {
  const t = await getTranslations({ locale, namespace })

  // We can't statically know if a namespace declares seoSection — wrap
  // every read in a try so an as-yet untranslated tool just renders
  // nothing instead of crashing the page.
  let title = ''
  let intro = ''
  let faqTitle = ''
  let faqs: { q: string; a: string }[] = []
  try {
    title = t('seoSection.title')
    intro = t('seoSection.intro')
    faqTitle = t('seoSection.faqTitle')
    faqs = (t.raw('seoSection.faqs') as { q: string; a: string }[]) ?? []
  } catch {
    return null
  }
  if (!intro) return null

  const paragraphs = intro.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)

  return (
    <section className="tool-seo-section">
      <div className="wrap">
        {title && <h2 className="tool-seo-title">{title}</h2>}
        <div className="tool-seo-intro">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {faqs.length > 0 && (
          <div className="tool-seo-faq">
            {faqTitle && <h3 className="tool-seo-faq-title">{faqTitle}</h3>}
            <div className="tool-seo-faq-list">
              {faqs.map((f, i) => (
                <details key={i} className="tool-seo-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <JsonLd
              data={{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
