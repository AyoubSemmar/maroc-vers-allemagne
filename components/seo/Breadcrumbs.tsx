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
 * trail in the search result. Pass `visible` to also render a matching
 * on-page breadcrumb nav (Google prefers the visible trail and the schema
 * to agree). Server-rendered — crawlers read it from the SSR HTML.
 */
export default function Breadcrumbs({ items, visible = false }: { items: Crumb[]; visible?: boolean }) {
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

  return (
    <>
      <JsonLd data={data} />
      {visible && (
        <nav aria-label="Breadcrumb" className="text-sm" style={{ color: 'var(--ink-soft)' }}>
          <ol className="flex flex-wrap items-center gap-1.5">
            {items.map((it, i) => {
              const isLast = i === items.length - 1
              return (
                <li key={i} className="flex items-center gap-1.5 min-w-0">
                  {isLast ? (
                    <span aria-current="page" className="font-semibold truncate" style={{ color: 'var(--ink)' }}>
                      {it.name}
                    </span>
                  ) : (
                    <>
                      <a href={it.path} className="hover:underline whitespace-nowrap">{it.name}</a>
                      <span aria-hidden style={{ opacity: 0.5 }}>/</span>
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}
    </>
  )
}
