// Renders the Eligibility Checker tool inside the dashboard shell.
// Re-uses the same client component as /tools/eligibility-checker.
import type { AppLocale } from '@/i18n/routing'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import EligibilityChecker from '../../tools/eligibility-checker/EligibilityChecker'

type Props = { params: Promise<{ locale: AppLocale }> }

// eligibilityChecker is trimmed from the default client bundle — provide it
// explicitly or useTranslations() renders raw keys.
export default async function DashboardEligibilityPage({ params }: Props) {
  const { locale } = await params
  return (
    <ProvideNamespaces only={['eligibilityChecker']}>
      <EligibilityChecker locale={locale} />
    </ProvideNamespaces>
  )
}
