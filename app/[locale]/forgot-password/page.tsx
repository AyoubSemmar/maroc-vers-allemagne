'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgot')
  const tShared = useTranslations('auth.shared')
  const locale = useLocale() as AppLocale
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })
    setLoading(false)
    setStatus(error ? 'error' : 'success')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
        <Link href="/login" className="text-green-700 text-sm hover:underline block mb-6">{tShared('backLogin')}</Link>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-sm text-gray-500 mb-6">{t('sub')}</p>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
            {t('success')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {t('error')}
              </div>
            )}
            <input
              type="email"
              dir="ltr"
              placeholder={tShared('emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-right text-gray-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
