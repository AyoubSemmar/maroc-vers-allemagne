'use client'

import { Suspense, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { useSearchParams } from 'next/navigation'
import { Link, useRouter } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import PasswordInput from '@/components/PasswordInput'

function LoginForm() {
  const t = useTranslations('auth.login')
  const tShared = useTranslations('auth.shared')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
      const next = searchParams.get('next') || '/'
      router.push(next)
      router.refresh()
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
