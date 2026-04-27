import type { AppLocale } from '@/i18n/routing'
import InterviewPrep from './InterviewPrep'

export default async function InterviewPrepPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>
}) {
  const { locale } = await params
  return <InterviewPrep locale={locale} />
}
