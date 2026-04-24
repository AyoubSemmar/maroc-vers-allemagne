import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export default async function DocumentsPage({ params }: Props) {
  const { locale } = await params
  const typedLocale = (routing.locales as readonly string[]).includes(locale)
    ? (locale as typeof routing.locales[number])
    : routing.defaultLocale
  redirect({ href: '/profile', locale: typedLocale })
}
