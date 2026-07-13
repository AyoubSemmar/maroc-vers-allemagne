// Renders the SperrkontoCalculator tool inside the dashboard shell.
// Re-uses the same client component as /tools/sperrkonto-calculator.
import type { AppLocale } from "@/i18n/routing"
import SperrkontoCalculator from "../../tools/sperrkonto-calculator/SperrkontoCalculator"
import Tool3Seo from "@/components/seo/Tool3Seo"
import { SEO } from "../../tools/sperrkonto-calculator/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardSperrkontoCalculatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <SperrkontoCalculator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
