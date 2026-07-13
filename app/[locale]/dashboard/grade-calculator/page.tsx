// Renders the GradeCalculator tool inside the dashboard shell.
// Re-uses the same client component as /tools/german-grade-calculator.
import type { AppLocale } from "@/i18n/routing"
import GradeCalculator from "../../tools/german-grade-calculator/GradeCalculator"
import Tool3Seo from "@/components/seo/Tool3Seo"
import { SEO } from "../../tools/german-grade-calculator/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardGradeCalculatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <GradeCalculator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
