// Renders the Furnished Housing finder inside the dashboard shell.
// Re-uses the same client component as /tools/furnished-housing.
import type { AppLocale } from "@/i18n/routing"
import Tool3Seo from '@/components/seo/Tool3Seo'
import FurnishedHousing from "../../tools/furnished-housing/FurnishedHousing"
import { SEO } from "../../tools/furnished-housing/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardFurnishedHousingPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <FurnishedHousing locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
