// Renders the LicenseChecker tool inside the dashboard shell.
// Re-uses the same client component as /tools/driving-license-germany.
import type { AppLocale } from "@/i18n/routing"
import LicenseChecker from "../../tools/driving-license-germany/LicenseChecker"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardLicenseCheckerPage({ params }: Props) {
  const { locale } = await params
  return <LicenseChecker locale={locale} />
}
