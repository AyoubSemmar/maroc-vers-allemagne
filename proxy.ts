import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

// Paths (without locale prefix) that require an authenticated user.
// /learn-german is intentionally NOT here — the level listing and the
// first lesson of every level are public. The auth gate for lesson 2+
// happens in the LessonsList client component.
// /ausbildung-jobs is also public — anyone can browse offers without an
// account.
const PROTECTED_PATHS = [
  '/cv-builder',
  '/anschreiben-generator',
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
