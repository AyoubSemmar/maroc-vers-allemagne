// Renders the InsuranceChooser tool inside the dashboard shell.
// Re-uses the same client component as /tools/health-insurance-germany.
import type { AppLocale } from "@/i18n/routing"
import Tool3Seo from '@/components/seo/Tool3Seo'
import InsuranceChooser from "../../tools/health-insurance-germany/InsuranceChooser"
import { SEO } from "../../tools/health-insurance-germany/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardInsuranceChooserPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <InsuranceChooser locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
