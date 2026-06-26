import type { AppLocale } from '@/i18n/routing'
import ProvideNamespaces from '@/components/i18n/ProvideNamespaces'
import InterviewPrep from './InterviewPrep'

export default async function InterviewPrepPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  return (
    <ProvideNamespaces only={['interviewPrep']}>
      <InterviewPrep locale={locale} />
    </ProvideNamespaces>
  )
}
