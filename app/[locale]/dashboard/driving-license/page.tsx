// Renders the LicenseChecker tool inside the dashboard shell.
// Re-uses the same client component as /tools/driving-license-germany.
import type { AppLocale } from "@/i18n/routing"
import Tool3Seo from '@/components/seo/Tool3Seo'
import LicenseChecker from "../../tools/driving-license-germany/LicenseChecker"
import { SEO } from "../../tools/driving-license-germany/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardLicenseCheckerPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <LicenseChecker locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
