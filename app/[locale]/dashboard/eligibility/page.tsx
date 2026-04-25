'use client'
import { useTranslations } from 'next-intl'
import LockedStub from '@/components/dashboard/LockedStub'

export default function EligibilityPage() {
  const t = useTranslations('dashboard.sidebar')
  return <LockedStub feature={t('eligibility')} />
}
