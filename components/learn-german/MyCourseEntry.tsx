'use client'

import { Link } from '@/i18n/navigation'
import Icon from '@/components/ui/Icon'
import { useCourseAccess } from '@/lib/useCourseAccess'

/**
 * Prominent entry to the personal course dashboard. Renders only once the
 * admin has granted the student paid access. Kept client-side so the
 * learn-german landing page stays static.
 */
export default function MyCourseEntry() {
  const { hasAccess } = useCourseAccess()

  if (!hasAccess) return null

  return (
    <Link
      href="/learn-german/my-course"
      className="flex items-center gap-4 rounded-2xl border border-green-300 bg-gradient-to-l from-green-50 to-white p-4 hover:shadow-md transition-shadow mb-2"
    >
      <span className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-green-100 text-green-700"><Icon name="bar-chart" size={22} /></span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-green-900">Mon cours</span>
        <span className="block text-sm text-green-700">Ta note, ton programme, tes devoirs et ton vocabulaire — au même endroit.</span>
      </span>
      <span className="shrink-0 rounded-lg bg-green-600 text-white text-sm font-semibold px-4 py-2">Ouvrir →</span>
    </Link>
  )
}
