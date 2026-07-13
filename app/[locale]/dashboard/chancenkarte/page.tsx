// Renders the ChancenkarteCalculator tool inside the dashboard shell.
// Re-uses the same client component as /tools/chancenkarte-calculator.
import type { AppLocale } from "@/i18n/routing"
import ChancenkarteCalculator from "../../tools/chancenkarte-calculator/ChancenkarteCalculator"
import Tool3Seo from "@/components/seo/Tool3Seo"
import { SEO } from "../../tools/chancenkarte-calculator/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardChancenkarteCalculatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <ChancenkarteCalculator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
