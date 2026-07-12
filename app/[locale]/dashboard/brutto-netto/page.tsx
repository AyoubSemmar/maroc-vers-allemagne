// Renders the BruttoNetto tool inside the dashboard shell.
// Re-uses the same client component as /tools/brutto-netto-rechner.
import type { AppLocale } from "@/i18n/routing"
import BruttoNetto from "../../tools/brutto-netto-rechner/BruttoNetto"

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardBruttoNettoPage({ params }: Props) {
  const { locale } = await params
  return <BruttoNetto locale={locale} />
}
