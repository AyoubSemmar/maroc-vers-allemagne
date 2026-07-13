// Renders the Living Cost Calculator inside the dashboard shell.
import type { AppLocale } from '@/i18n/routing'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import LivingCostCalculator from '../../tools/living-cost-calculator/LivingCostCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

// livingCost is trimmed from the default client message bundle, so it must be
// provided explicitly (as the public tool page does) or useTranslations()
// renders raw keys ("livingCost.title", etc.).
export default async function DashboardLivingCostPage({ params }: Props) {
  const { locale } = await params
  return (
    <ProvideNamespaces only={['livingCost']}>
      <LivingCostCalculator locale={locale} />
    </ProvideNamespaces>
  )
}
