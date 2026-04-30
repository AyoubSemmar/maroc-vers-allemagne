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

export const ARTICLE_LIST_FIELDS =
  'id, title, summary, category, date, image_url, featured, ' +
  'fr_title:translations->fr->>title, fr_summary:translations->fr->>summary, ' +
  'en_title:translations->en->>title, en_summary:translations->en->>summary, ' +
  'de_title:translations->de->>title, de_summary:translations->de->>summary'

/**
 * Same as ARTICLE_LIST_FIELDS but also includes `read_time` for pages
 * that surface reading time on cards (homepage, /studium, /ausbildung).
 */
export const ARTICLE_LIST_FIELDS_WITH_READ_TIME =
  ARTICLE_LIST_FIELDS + ', read_time'

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
 */
export function rehydrateTranslations(row: FlatRow): TranslatableRow {
  const translations: Record<string, { title?: string; summary?: string }> = {}
  for (const lang of ['fr', 'en', 'de'] as const) {
    const t = row[`${lang}_title`]
    const s = row[`${lang}_summary`]
    if (t || s) {
      translations[lang] = {
        ...(t ? { title: String(t) } : {}),
        ...(s ? { summary: String(s) } : {}),
      }
    }
  }
  // Strip the flat columns — caller only needs `title`, `summary`,
  // and a (now-minimal) `translations` for the localizer.
  const {
    fr_title, fr_summary, en_title, en_summary, de_title, de_summary,
    ...rest
  } = row
  void fr_title; void fr_summary; void en_title; void en_summary; void de_title; void de_summary
  return {
    ...rest,
    translations: Object.keys(translations).length ? translations : null,
  } as TranslatableRow
}

export function rehydrateTranslationsList<T extends FlatRow>(rows: T[] | null | undefined): TranslatableRow[] {
  if (!rows) return []
  return rows.map(rehydrateTranslations)
}
