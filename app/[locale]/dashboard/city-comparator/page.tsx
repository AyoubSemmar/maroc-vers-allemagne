// Renders the CityComparator tool inside the dashboard shell.
// Re-uses the same client component as /tools/city-comparator.
import type { AppLocale } from "@/i18n/routing"
import CityComparator from "../../tools/city-comparator/CityComparator"
import Tool3Seo from "@/components/seo/Tool3Seo"
import { SEO } from "../../tools/city-comparator/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardCityComparatorPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <CityComparator locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
