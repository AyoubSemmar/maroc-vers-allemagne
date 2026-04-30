'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import PasswordInput from '@/components/PasswordInput'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { trackSignup } from '@/lib/analytics'

type Msg = { kind: 'error' | 'success'; text: string } | null

export default function SignupPage() {
  const t = useTranslations('auth.signup')
  const tShared = useTranslations('auth.shared')
  const locale = useLocale() as AppLocale
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<Msg>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (error) {
      setMessage({ kind: 'error', text: t('error', { message: error.message }) })
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessage({ kind: 'error', text: t('emailExists') })
    } else {
      // Real account created (or pending email confirmation). Fire the
      // GA4 conversion BEFORE setting the success message so the event
      // lands even if the user closes the tab right after seeing 'check
      // your inbox'. method:'email' distinguishes this from Google OAuth
      // sign-ups, which fire their own event from the OAuth callback.
      trackSignup('email')
      setMessage({ kind: 'success', text: t('checkInbox') })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
        <Link href="/" className="text-green-700 text-sm hover:underline block mb-6">{tShared('backHome')}</Link>
        <h1 className="text-xl font-bold text-gray-900 mb-6">{t('title')}</h1>

        {message ? (
          <div className={`rounded-lg p-4 text-sm ${message.kind === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-800'}`}>
            {message.text}
            {message.kind === 'error' && (
              <Link href="/login" className="block mt-2 font-medium underline">{t('loginLink')}</Link>
            )}
          </div>
        ) : (
          <>
          <GoogleSignInButton next="/dashboard" />
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">{tShared('or')}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
              placeholder={t('passwordPlaceholder')}
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
            <p className="text-sm text-center text-gray-500">
              {t('haveAccount')}{' '}
              <Link href="/login" className="text-green-700 hover:underline">{t('loginLink')}</Link>
            </p>
          </form>
          </>
        )}
      </div>
    </div>
  )
}
