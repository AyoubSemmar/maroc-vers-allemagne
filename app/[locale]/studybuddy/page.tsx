import type { Metadata } from 'next'
import StudybuddyTracker from './StudybuddyTracker'
import './studybuddy.css'

/**
 * StudyBuddy sprint tracker — internal team-only page.
 *
 * Not part of the public gogermany.ma navigation. Deliberately
 * marked noindex,nofollow so it doesn't surface in search results
 * even if someone shares the URL. The SQL migration in
 * db/migrations/2026-05-08_studybuddy_task_status.sql must be
 * applied to Supabase before this page can persist anything.
 */
export const metadata: Metadata = {
  title: 'StudyBuddy Sprint Tracker',
  robots: { index: false, follow: false },
}

export default function StudybuddyPage() {
  return <StudybuddyTracker />
}
