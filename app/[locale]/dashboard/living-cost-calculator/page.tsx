// Renders the Living Cost Calculator inside the dashboard shell.
import type { AppLocale } from '@/i18n/routing'
import LivingCostCalculator from '../../tools/living-cost-calculator/LivingCostCalculator'

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardLivingCostPage({ params }: Props) {
  const { locale } = await params
  return <LivingCostCalculator locale={locale} />
}
