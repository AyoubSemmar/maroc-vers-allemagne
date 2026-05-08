'use client'

import { Suspense, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import PasswordInput from '@/components/PasswordInput'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { trackLogin } from '@/lib/analytics'
import { safeRedirect } from '@/lib/safe-redirect'

function LoginForm() {
  const t = useTranslations('auth.login')
  const tShared = useTranslations('auth.shared')
  const locale = useLocale() as AppLocale
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(t('invalidCredentials'))
    } else {
      trackLogin('email')
      // The `next` query param coming from proxy.ts already includes the
      // locale prefix (e.g. /ar/cv-builder). next-intl's `router.push`
      // prepends the current locale on top of that, producing the
      // /ar/ar/cv-builder 404 we kept seeing. Use a hard navigation
      // through window.location so the path is honoured verbatim — this
      // also fully refreshes auth state, which we want post-login.
      const next = safeRedirect(searchParams.get('next'), `/${locale}`)
      window.location.assign(next)
      return
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{t('title')}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      <GoogleSignInButton next={safeRedirect(searchParams.get('next'), '/dashboard')} />

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 uppercase tracking-wider">{tShared('or')}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          dir="ltr"
          placeholder={tShared('emailPlaceholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
        />
        <PasswordInput
          placeholder={tShared('passwordPlaceholder')}
          value={password}
          onChange={setPassword}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? t('submitting') : t('submit')}
        </button>
        <Link href="/forgot-password" className="text-sm text-center text-gray-400 hover:text-green-700 hover:underline block">
          {t('forgot')}
        </Link>
        <p className="text-sm text-center text-gray-500">
          {t('noAccount')}{' '}
          <Link href="/signup" className="text-green-700 hover:underline">{t('signupLink')}</Link>
        </p>
      </form>
    </div>
  )
}

export default function LoginPage() {
  const locale = useLocale() as AppLocale
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
      <Suspense fallback={<div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
