'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { isAccessActive } from '@/lib/courseAccess'

export type CourseAccess = {
  loading: boolean
  hasBooking: boolean   // reserved a seat (may be unpaid)
  hasAccess: boolean    // admin granted access after payment
}

/**
 * Whether the signed-in user has paid course access. Used to decide if the
 * "Mon cours" entry shows (nav, profile, landing) and to distinguish a
 * reserved-but-unpaid student from a paid one. One lightweight indexed query.
 */
export function useCourseAccess(): CourseAccess {
  const [state, setState] = useState<CourseAccess>({ loading: true, hasBooking: false, hasAccess: false })

  useEffect(() => {
    let active = true
    const sb = createClient()
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) { if (active) setState({ loading: false, hasBooking: false, hasAccess: false }); return }
      // Admins (the owner/teacher) always have access. The bookings select is
      // separate so a missing-column error doesn't sink the admin check.
      const [{ data: b }, { data: prof }] = await Promise.all([
        sb.from('class_bookings').select('access_until')
          .eq('user_id', data.user.id).eq('status', 'reserved').maybeSingle(),
        sb.from('profiles').select('is_admin').eq('user_id', data.user.id).maybeSingle(),
      ])
      const isAdmin = prof?.is_admin === true
      if (active) setState({ loading: false, hasBooking: !!b, hasAccess: isAdmin || isAccessActive(b?.access_until as string | null) })
    })
    return () => { active = false }
  }, [])

  return state
}
