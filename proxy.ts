import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

// Paths (without locale prefix) that require an authenticated user.
//
// /learn-german is intentionally NOT here — the level listing and the
// first lesson of every level are public. The auth gate for lesson 2+
// happens in the LessonsList client component.
// /ausbildung-jobs is also public — anyone can browse offers without an
// account.
// /dashboard itself is open to guests (DashShell renders a sign-in
// banner) — but the pages below that actually call paid AI endpoints
// (Anthropic + Replicate) MUST require auth, otherwise a guest can
// burn through API credits before even hitting the API-level 401.
const PROTECTED_PATHS = [
  '/cv-builder',
  '/anschreiben-generator',
  '/dashboard/cv-builder',
  '/dashboard/cover-letter',
  '/dashboard/video-studio',
  '/dashboard/apply-for-me',
]

function stripLocale(pathname: string): { locale: string | null; rest: string } {
  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  if (first && (routing.locales as readonly string[]).includes(first)) {
    return { locale: first, rest: '/' + segments.slice(1).join('/') }
  }
  return { locale: null, rest: pathname }
}

function isProtected(pathname: string): boolean {
  const { rest } = stripLocale(pathname)
  return PROTECTED_PATHS.some(
    (p) => rest === p || rest.startsWith(p + '/')
  )
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Run the intl proxy first — it handles locale detection / redirects.
  const intlResponse = intlMiddleware(request)

  // If the intl middleware is redirecting (e.g. adding a locale prefix),
  // respect that redirect immediately.
  if (intlResponse.headers.get('location')) {
    return intlResponse
  }

  // ── Admin gate ──────────────────────────────────────────────────
  // Stop unauthenticated requests at the edge so /console-x7k9/* sub-pages
  // never run their server-side data fetching. Without this guard,
  // hitting /console-x7k9/settings (or /console-x7k9/users) would still trigger
  // every Supabase query in the page component before the layout
  // chose to render the login screen — leaking timing + query
  // counts and giving the URL itself a fingerprint.
  //
  // /console-x7k9 (the login screen) stays public; everything below it
  // bounces back to /console-x7k9 until the admin_auth cookie is present.
  const { locale: pathLocale, rest } = stripLocale(pathname)
  if (rest.startsWith('/console-x7k9')) {
    const cookie = request.cookies.get('admin_auth')?.value
    if (cookie !== 'true' && rest !== '/console-x7k9' && rest !== '/console-x7k9/') {
      const effLocale = pathLocale ?? routing.defaultLocale
      return NextResponse.redirect(new URL(`/${effLocale}/console-x7k9`, request.url))
    }
  }

  // If this isn't a protected path, just return the intl response as-is.
  if (!isProtected(pathname)) {
    return intlResponse
  }

  // Protected path: verify the user. Use the intl response as the base so
  // its cookies (NEXT_LOCALE etc.) are preserved.
  const response = intlResponse

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const { locale } = stripLocale(pathname)
    const effectiveLocale = locale ?? routing.defaultLocale
    const loginUrl = new URL(`/${effectiveLocale}/login`, request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Match everything except Next internals, API routes, and static assets.
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
