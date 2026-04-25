import { useTranslations } from 'next-intl'

/**
 * Hook returning a translator that maps the Arabic source category
 * (stored in the DB) to the active locale via the `articles.cat.*`
 * messages. Falls back to the raw string when no translation exists,
 * so unknown / new categories still render rather than crashing.
 */
export function useCatLabel(): (cat: string) => string {
  const t = useTranslations('articles')
  return (cat: string) => {
    if (!cat) return ''
    try {
      // next-intl's t returns the key when missing in non-strict mode
      const v = t(`cat.${cat}` as any)
      return v && v !== `cat.${cat}` ? v : cat
    } catch {
      return cat
    }
  }
}
