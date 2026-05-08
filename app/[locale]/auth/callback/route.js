import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { safeRedirect } from '@/lib/safe-redirect'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Validate `next` against an allowlist of relative paths. The pre-fix
  // check accepted any string starting with `/`, which permitted
  // `//evil.com` (protocol-relative) and `/\\evil.com` (some browsers
  // normalise the backslash). safeRedirect rejects all of those.
  const target = safeRedirect(searchParams.get('next'), '/dashboard')
  return NextResponse.redirect(`${origin}${target}`)
}
