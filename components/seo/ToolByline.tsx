import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

/**
 * Small authorship line for tool pages (E-E-A-T). Links to /about, which
 * describes who builds and maintains GoGermany's tools — a trust signal for
 * the YMYL topics these tools cover (visa, tax, money).
 */
export default async function ToolByline({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: 'common' })
  return (
    <p className="text-xs mt-4" style={{ color: 'var(--ink-soft)' }}>
      <span aria-hidden>✎ </span>
      <Link href="/about" className="hover:underline">{t('builtByTeam')}</Link>
    </p>
  )
}
