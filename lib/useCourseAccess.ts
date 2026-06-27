'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

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
      const { data: b } = await sb
        .from('class_bookings')
        .select('access_granted')
        .eq('user_id', data.user.id)
        .eq('status', 'reserved')
        .maybeSingle()
      if (active) setState({ loading: false, hasBooking: !!b, hasAccess: b?.access_granted === true })
    })
    return () => { active = false }
  }, [])

  return state
}
