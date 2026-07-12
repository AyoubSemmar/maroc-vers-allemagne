// Renders the CityComparator tool inside the dashboard shell.
// Re-uses the same client component as /tools/city-comparator.
import type { AppLocale } from "@/i18n/routing"
import CityComparator from "../../tools/city-comparator/CityComparator"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardCityComparatorPage({ params }: Props) {
  const { locale } = await params
  return <CityComparator locale={locale} />
}
