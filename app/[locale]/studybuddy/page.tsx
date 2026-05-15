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
 *
 * Metadata is fully overridden here (title + description + openGraph
 * + twitter) so link previews on WhatsApp / Slack / Discord show the
 * tracker's own identity, not gogermany.ma's tagline. The layout's
 * defaults would otherwise leak through openGraph.description and
 * the OG image.
 */
export const metadata: Metadata = {
  title: 'StudyBuddy Sprint Tracker',
  description: 'Gemeinsame Sprint-Übersicht für unser StudyBuddy-Projektteam.',
  robots: { index: false, follow: false },
  // Explicit icon override. Next.js auto-discovers `app/icon.svg`
  // (gogermany's logo) for every route — including this one, because
  // file-based icons inside a dynamic [locale] segment are not picked
  // up reliably. Pointing at a stable URL under /public sidesteps the
  // entire dynamic-segment resolution and gives the tracker its own
  // favicon. Setting both `icon` and `shortcut` so older browsers /
  // bookmarks (which look for shortcut icon) also pick it up.
  icons: {
    icon: '/studybuddy-icon.svg',
    shortcut: '/studybuddy-icon.svg',
    apple: '/studybuddy-icon.svg',
  },
  openGraph: {
    title: 'StudyBuddy Sprint Tracker',
    description: 'Gemeinsame Sprint-Übersicht für unser StudyBuddy-Projektteam.',
    type: 'website',
    siteName: 'StudyBuddy Sprint Tracker',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'StudyBuddy Sprint Tracker',
    description: 'Gemeinsame Sprint-Übersicht für unser StudyBuddy-Projektteam.',
    images: [],
  },
}

export default function StudybuddyPage() {
  return <StudybuddyTracker />
}
