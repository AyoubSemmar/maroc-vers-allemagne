'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'

/**
 * Prominent entry to the personal course dashboard. Renders only for
 * signed-in users (students who have an account / a class seat). Kept
 * client-side so the learn-german landing page stays static.
 */
export default function MyCourseEntry() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setShow(!!data.user))
  }, [])

  if (!show) return null

  return (
    <Link
      href="/learn-german/my-course"
      className="flex items-center gap-4 rounded-2xl border border-green-300 bg-gradient-to-l from-green-50 to-white p-4 hover:shadow-md transition-shadow mb-2"
    >
      <span className="text-3xl shrink-0">📋</span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-green-900">Mon cours</span>
        <span className="block text-sm text-green-700">Ta note, ton programme, tes devoirs et ton vocabulaire — au même endroit.</span>
      </span>
      <span className="shrink-0 rounded-lg bg-green-600 text-white text-sm font-semibold px-4 py-2">Ouvrir →</span>
    </Link>
  )
}
