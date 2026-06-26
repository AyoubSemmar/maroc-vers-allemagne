import type { AbstractIntlMessages } from 'next-intl'

/**
 * Big, page-specific message namespaces. These are excluded from the GLOBAL
 * client bundle (app/[locale]/layout.tsx) and re-provided locally on their
 * own route via a nested NextIntlClientProvider. Shipping the full message
 * file to every page was ~305 KB of JSON per page (fr); these namespaces are
 * the bulk of it and are each used on a single route.
 *
 * To add one: confirm with grep that `useTranslations('<ns>')` only appears in
 * client components under one route, then list it here and wrap that route's
 * client subtree with <NextIntlClientProvider messages={pickNamespaces(...)}>.
 */
export const HEAVY_NAMESPACES = [
  'static',            // disclaimer / privacy / terms (legal pages)
  'documentChecklist', // tools/document-checklist
  'visaGuide',         // visa/* guides
  'eligibilityChecker',// tools/eligibility-checker
  'livingCost',        // tools/living-cost-calculator
  'cvBuilder',         // cv-builder
  'interviewPrep',     // dashboard/interview-prep
  // 'writingExercise' is intentionally NOT here: it's rendered by LessonsList,
  // which is also pulled in by the client ReadingExercise — too entangled to
  // isolate for only ~19 KB.
] as const

export function omitNamespaces(messages: AbstractIntlMessages, keys: readonly string[]): AbstractIntlMessages {
  const out: Record<string, unknown> = { ...(messages as Record<string, unknown>) }
  for (const k of keys) delete out[k]
  return out as AbstractIntlMessages
}

export function pickNamespaces(messages: AbstractIntlMessages, keys: readonly string[]): AbstractIntlMessages {
  const src = messages as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const k of keys) if (k in src) out[k] = src[k]
  return out as AbstractIntlMessages
}
