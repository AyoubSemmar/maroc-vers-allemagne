// Renders the SalaryExplorer tool inside the dashboard shell.
// Re-uses the same client component as /tools/ausbildung-salary.
import type { AppLocale } from "@/i18n/routing"
import SalaryExplorer from "../../tools/ausbildung-salary/SalaryExplorer"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardSalaryExplorerPage({ params }: Props) {
  const { locale } = await params
  return <SalaryExplorer locale={locale} />
}
