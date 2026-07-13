import JsonLd from './JsonLd'

const SITE = 'https://www.gogermany.ma'

export type Crumb = {
  /** Visible label for this level. */
  name: string
  /** Locale-prefixed path, e.g. `/fr/articles/123`. */
  path: string
}

/**
 * Emits a BreadcrumbList JSON-LD node so Google can render a breadcrumb
 * trail in the search result and understand the page's place in the site
 * hierarchy. Server-rendered (crawlers read it from the SSR HTML).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  }
  return <JsonLd data={data} />
}
