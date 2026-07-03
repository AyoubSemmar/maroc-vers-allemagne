import type { AppLocale } from '@/i18n/routing'

/**
 * Row shape for any Supabase record that stores per-locale translations
 * in a `translations` JSONB column of shape:
 *   { fr?: { title?, summary?, content?, faqs? }, en?: {...}, de?: {...} }
 * Arabic is the source language and lives in the top-level columns.
 */
export type TranslatableRow = {
  title?: string | null
  summary?: string | null
  content?: string | null
  faqs?: unknown
  translations?: Record<string, {
    title?: string
    summary?: string
    content?: string
    faqs?: unknown
  } | null> | null
  [k: string]: any
}

/**
 * Returns a shallow copy of the row with `title`, `summary`, `content`, `faqs`
 * overridden by the per-locale translation when available.
 *
 * Fallback chain: requested locale → English → Arabic source. English is
 * preferred over the Arabic base for missing locales because it's far more
 * widely readable (and LTR), which matters for e.g. a Morocco-only article
 * opened via a direct link under a global locale like hi/ur/zh.
 */
export function localizeRow<T extends TranslatableRow>(row: T, locale: AppLocale): T {
  if (!row) return row
  if (locale === 'ar') return row
  const tr = row.translations?.[locale] ?? (locale !== 'en' ? row.translations?.en : null) ?? null
  if (!tr) return row
  return {
    ...row,
    title: tr.title ?? row.title,
    summary: tr.summary ?? row.summary,
    content: tr.content ?? row.content,
    faqs: tr.faqs ?? row.faqs,
  }
}

export function localizeRows<T extends TranslatableRow>(rows: T[] | null | undefined, locale: AppLocale): T[] {
  if (!rows) return []
  if (locale === 'ar') return rows
  return rows.map((r) => localizeRow(r, locale))
}
