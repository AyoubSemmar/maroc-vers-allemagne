// Renders the TaxRefund tool inside the dashboard shell.
// Re-uses the same client component as /tools/tax-refund-calculator.
import type { AppLocale } from "@/i18n/routing"
import Tool3Seo from '@/components/seo/Tool3Seo'
import TaxRefund from "../../tools/tax-refund-calculator/TaxRefund"
import { SEO } from "../../tools/tax-refund-calculator/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardTaxRefundPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <TaxRefund locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
