// Renders the Migration Timeline tool inside the dashboard shell.
// Re-uses the same client component as /tools/migration-timeline.
import type { AppLocale } from '@/i18n/routing'
import MigrationTimeline from '../../tools/migration-timeline/MigrationTimeline'

type Props = { params: Promise<{ locale: AppLocale }> }

export default async function DashboardTimelinePage({ params }: Props) {
  const { locale } = await params
  return <MigrationTimeline locale={locale} />
}
