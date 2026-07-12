// Renders the ChancenkarteCalculator tool inside the dashboard shell.
// Re-uses the same client component as /tools/chancenkarte-calculator.
import type { AppLocale } from "@/i18n/routing"
import ChancenkarteCalculator from "../../tools/chancenkarte-calculator/ChancenkarteCalculator"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardChancenkarteCalculatorPage({ params }: Props) {
  const { locale } = await params
  return <ChancenkarteCalculator locale={locale} />
}
