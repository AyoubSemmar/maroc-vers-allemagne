// Renders the SalaryExplorer tool inside the dashboard shell.
// Re-uses the same client component as /tools/ausbildung-salary.
import type { AppLocale } from "@/i18n/routing"
import Tool3Seo from '@/components/seo/Tool3Seo'
import SalaryExplorer from "../../tools/ausbildung-salary/SalaryExplorer"
import { SEO } from "../../tools/ausbildung-salary/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardSalaryExplorerPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <SalaryExplorer locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
