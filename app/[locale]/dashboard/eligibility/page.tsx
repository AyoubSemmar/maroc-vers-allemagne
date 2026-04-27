// Renders the Eligibility Checker tool inside the dashboard shell.
// Re-uses the same client component as /tools/eligibility-checker.
import type { AppLocale } from '@/i18n/routing'
import EligibilityChecker from '../../tools/eligibility-checker/EligibilityChecker'

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardEligibilityPage({ params }: Props) {
  const { locale } = await params
  return <EligibilityChecker locale={locale} />
}
