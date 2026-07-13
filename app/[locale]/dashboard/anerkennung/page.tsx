// Renders the AnerkennungWizard tool inside the dashboard shell.
// Re-uses the same client component as /tools/anerkennung-wizard.
import type { AppLocale } from "@/i18n/routing"
import AnerkennungWizard from "../../tools/anerkennung-wizard/AnerkennungWizard"
import Tool3Seo from "@/components/seo/Tool3Seo"
import { SEO } from "../../tools/anerkennung-wizard/page"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardAnerkennungWizardPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <AnerkennungWizard locale={locale} />
      <Tool3Seo locale={locale} heading={SEO.heading} paragraphs={SEO.paragraphs} />
    </>
  )
}
