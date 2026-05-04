/**
 * Server component that renders a JSON-LD <script> for structured data.
 *
 * Usage:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', ... }} />
 *
 * Multiple JsonLd nodes can be placed on the same page (Organization at
 * the layout level, plus FAQPage / Course / Article at the page level).
 *
 * Why server-rendered: Google reliably picks up structured data from
 * server-rendered HTML; client-side hydration sometimes runs after the
 * crawler snapshot.
 */
type Json = Record<string, unknown>

export default function JsonLd({ data }: { data: Json | Json[] }) {
  return (
    <script
      type="application/ld+json"
      // The JSON.stringify is run on the server; React would otherwise
      // wrap the JSON in escaped quotes when rendering as text content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
