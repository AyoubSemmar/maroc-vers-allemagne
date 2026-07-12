// Renders the InsuranceChooser tool inside the dashboard shell.
// Re-uses the same client component as /tools/health-insurance-germany.
import type { AppLocale } from "@/i18n/routing"
import InsuranceChooser from "../../tools/health-insurance-germany/InsuranceChooser"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardInsuranceChooserPage({ params }: Props) {
  const { locale } = await params
  return <InsuranceChooser locale={locale} />
}
