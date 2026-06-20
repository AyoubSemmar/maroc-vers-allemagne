/**
 * Lightweight Supabase select for article list pages.
 *
 * Background: every list page (homepage, /articles, /ausbildung, /studium,
 * etc.) used to do `.select('..., translations')`, which pulls the entire
 * translations JSONB blob — title + summary + full content (long markdown)
 * + faqs, ×3 locales — for every article. That's roughly 5-10 KB per row
 * of payload that the page never displays.
 *
 * On a Supabase free tier (5 GB egress/month), this single oversight ate
 * the whole quota inside the first weeks of launch. The fix below pulls
 * only the JSON paths the list actually renders (title + summary per
 * locale) using PostgREST's `alias:column->key->>field` syntax, then
 * rebuilds the minimal translations shape the localizer expects.
 */
import type { TranslatableRow } from './i18n-content'

/**
 * Locales that carry EVERY article (Morocco-specific + global). The Arabic
 * source lives in the row's own columns; fr/en/de are always present. Other
 * locales only hold `global` articles (see memory article-locale-policy), so
 * a list query for them must filter to rows that actually have that locale.
 */
export const BASE_LOCALES = ['ar', 'fr', 'en', 'de'] as const

const BASE_JSON_LOCALES = ['fr', 'en', 'de'] as const

/** JSON title/summary projection for one locale. */
function localeFields(loc: string): string {
  return `${loc}_title:translations->${loc}->>title, ${loc}_summary:translations->${loc}->>summary`
}

/**
 * Build the lightweight list projection for a given locale. Always pulls
 * fr/en/de (cheap fallbacks) plus the requested locale. Pulling only the
 * needed JSON paths keeps Supabase egress tiny — see the egress note below.
 */
export function articleListFields(locale?: string): string {
  const locs = new Set<string>(BASE_JSON_LOCALES as readonly string[])
  if (locale && locale !== 'ar') locs.add(locale)
  return (
    'id, title, summary, category, date, image_url, featured, ' +
    [...locs].map(localeFields).join(', ')
  )
}

export function articleListFieldsWithReadTime(locale?: string): string {
  return articleListFields(locale) + ', read_time'
}

/** Back-compat constants (fr/en/de only) for callers that are locale-agnostic. */
export const ARTICLE_LIST_FIELDS = articleListFields()
export const ARTICLE_LIST_FIELDS_WITH_READ_TIME = ARTICLE_LIST_FIELDS + ', read_time'

/**
 * Restrict a list query to articles available in `locale`. For base locales
 * (ar/fr/en/de) every article qualifies, so no filter is added. For any other
 * locale, only rows whose `translations.<locale>` exists are returned — which,
 * per policy, are exactly the `global` articles.
 *
 * Usage: applyLocaleAvailability(supabase.from('articles').select(...), locale)
 */
export function applyLocaleAvailability<Q extends { not: (col: string, op: string, val: unknown) => Q }>(
  query: Q,
  locale: string,
): Q {
  if ((BASE_LOCALES as readonly string[]).includes(locale)) return query
  return query.not(`translations->${locale}`, 'is', null)
}

type FlatRow = {
  id: number
  title: string | null
  summary: string | null
  fr_title?: string | null
  fr_summary?: string | null
  en_title?: string | null
  en_summary?: string | null
  de_title?: string | null
  de_summary?: string | null
  [k: string]: any
}

/**
 * Rebuild the `translations` shape that `localizeRow()` expects from
 * the flat `xx_title` / `xx_summary` columns we selected. Only includes
 * locales that actually have a non-empty title to keep the payload tiny.
 * Pass `locale` so the current locale's flat columns are rehydrated too.
 */
export function rehydrateTranslations(row: FlatRow, locale?: string): TranslatableRow {
  const langs = new Set<string>(['fr', 'en', 'de'])
  if (locale && locale !== 'ar') langs.add(locale)

  const translations: Record<string, { title?: string; summary?: string }> = {}
  const rest: Record<string, any> = {}
  for (const [k, v] of Object.entries(row)) {
    const m = k.match(/^([a-z]{2})_(title|summary)$/)
    if (m) continue // drop flat locale columns
    rest[k] = v
  }
  for (const lang of langs) {
    const t = row[`${lang}_title`]
    const s = row[`${lang}_summary`]
    if (t || s) {
      translations[lang] = {
        ...(t ? { title: String(t) } : {}),
        ...(s ? { summary: String(s) } : {}),
      }
    }
  }
  return {
    ...rest,
    translations: Object.keys(translations).length ? translations : null,
  } as TranslatableRow
}

export function rehydrateTranslationsList<T extends FlatRow>(
  rows: T[] | null | undefined,
  locale?: string,
): TranslatableRow[] {
  if (!rows) return []
  return rows.map((r) => rehydrateTranslations(r, locale))
}
