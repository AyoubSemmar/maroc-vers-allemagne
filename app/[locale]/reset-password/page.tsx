'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import PasswordInput from '@/components/PasswordInput'

export default function ResetPasswordPage() {
  const t = useTranslations('auth.reset')
  const locale = useLocale() as AppLocale
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setErrorMsg(t('mismatch'))
      setStatus('error')
      return
    }
    if (password.length < 6) {
      setErrorMsg(t('tooShort'))
      setStatus('error')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setErrorMsg(t('updateError'))
      setStatus('error')
    } else {
      setStatus('success')
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
      <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
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
                {errorMsg}
              </div>
            )}
            <PasswordInput
              placeholder={t('newPassword')}
              value={password}
              onChange={setPassword}
            />
            <PasswordInput
              placeholder={t('confirm')}
              value={confirm}
              onChange={setConfirm}
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
