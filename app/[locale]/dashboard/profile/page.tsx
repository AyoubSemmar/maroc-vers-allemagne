import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/i18n/routing'
import DashProfile from '@/components/dashboard/DashProfile'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard.sidebar' })
  return { title: t('myProfile') }
}

export default function DashboardProfilePage() {
  return <DashProfile />
}
