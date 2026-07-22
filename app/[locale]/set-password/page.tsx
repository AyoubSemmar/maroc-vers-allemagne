'use client'

import { Suspense, useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { dirFor, type AppLocale } from '@/i18n/routing'
import PasswordInput from '@/components/PasswordInput'
import { safeRedirect } from '@/lib/safe-redirect'
import { trackMeta } from '@/lib/metaPixel'

// Small inline strings — this page is only reached by admin-provisioned live-
// class students (a Morocco-targeted feature), so ar/fr/en/de mirror the
// components/classes/strings.ts convention instead of touching all 12 bundles.
const STR: Record<string, {
  title: string; intro: string; pw: string; confirm: string
  submit: string; saving: string; mismatch: string; short: string; error: string
}> = {
  fr: {
    title: 'Choisissez votre mot de passe',
    intro: 'Pour votre sécurité, définissez un nouveau mot de passe pour terminer la connexion.',
    pw: 'Nouveau mot de passe', confirm: 'Confirmer le mot de passe',
    submit: 'Enregistrer et continuer', saving: 'Enregistrement…',
    mismatch: 'Les mots de passe ne correspondent pas.',
    short: 'Utilisez au moins 8 caractères.',
    error: 'Une erreur est survenue. Réessayez.',
  },
  ar: {
    title: 'اختر كلمة المرور الخاصة بك',
    intro: 'من أجل أمانك، عيّن كلمة مرور جديدة لإكمال تسجيل الدخول.',
    pw: 'كلمة مرور جديدة', confirm: 'تأكيد كلمة المرور',
    submit: 'حفظ ومتابعة', saving: 'جارٍ الحفظ…',
    mismatch: 'كلمتا المرور غير متطابقتين.',
    short: 'استخدم 8 أحرف على الأقل.',
    error: 'حدث خطأ ما. حاول مرة أخرى.',
  },
  de: {
    title: 'Wähle dein Passwort',
    intro: 'Lege zu deiner Sicherheit ein neues Passwort fest, um die Anmeldung abzuschließen.',
    pw: 'Neues Passwort', confirm: 'Passwort bestätigen',
    submit: 'Speichern und fortfahren', saving: 'Wird gespeichert…',
    mismatch: 'Die Passwörter stimmen nicht überein.',
    short: 'Verwende mindestens 8 Zeichen.',
    error: 'Etwas ist schiefgelaufen. Versuche es erneut.',
  },
  en: {
    title: 'Choose your password',
    intro: 'For your security, set a new password to finish signing in.',
    pw: 'New password', confirm: 'Confirm password',
    submit: 'Save & continue', saving: 'Saving…',
    mismatch: 'Passwords don’t match.',
    short: 'Use at least 8 characters.',
    error: 'Something went wrong. Try again.',
  },
}

function SetPasswordForm() {
  const locale = useLocale() as AppLocale
  const t = STR[locale] ?? STR.en
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Guard: this page needs an active session (you reach it right after login).
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.assign(`/${locale}/login`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw.length < 8) { setError(t.short); return }
    if (pw !== confirm) { setError(t.mismatch); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({
      password: pw,
      data: { must_change_password: false },
    })
    if (error) {
      setError(t.error)
      setLoading(false)
      return
    }
    // Meta conversion: student finished onboarding (set their own password).
    trackMeta('CompleteRegistration', { content_name: 'student_onboarding' })
    const next = safeRedirect(searchParams.get('next'), `/${locale}`)
    window.location.assign(next)
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
      <h1 className="text-xl font-bold text-gray-900 mb-2">{t.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{t.intro}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <PasswordInput placeholder={t.pw} value={pw} onChange={setPw} />
        <PasswordInput placeholder={t.confirm} value={confirm} onChange={setConfirm} />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white rounded-lg px-4 py-2 hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? t.saving : t.submit}
        </button>
      </form>
    </div>
  )
}

export default function SetPasswordPage() {
  const locale = useLocale() as AppLocale
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={dirFor(locale)}>
      <Suspense fallback={<div className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm" />}>
        <SetPasswordForm />
      </Suspense>
    </div>
  )
}
