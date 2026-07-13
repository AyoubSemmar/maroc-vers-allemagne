import { useTranslations } from 'next-intl'

/**
 * Robust category label resolver. Maps a stored article category to the
 * active locale via the `articles.cat.*` messages. If the key is missing,
 * next-intl returns the full key path (e.g. "articles.cat.visa") rather
 * than throwing — so we detect that and prettify the raw slug instead of
 * leaking the key. Works with both the client `useTranslations('articles')`
 * translator and the server `getTranslations({ namespace: 'articles' })` one.
 */
export function catLabelFrom(t: (key: any) => string, cat: string): string {
  if (!cat) return ''
  try {
    const v = t(`cat.${cat}`)
    // A missing key comes back as "...cat.<cat>" — treat that as "no translation".
    if (v && !String(v).endsWith(`cat.${cat}`)) return String(v)
  } catch {
    /* strict-mode throw on missing key — fall through to prettified slug */
  }
  return cat.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Hook variant for client components. */
export function useCatLabel(): (cat: string) => string {
  const t = useTranslations('articles')
  return (cat: string) => catLabelFrom(t as any, cat)
}
