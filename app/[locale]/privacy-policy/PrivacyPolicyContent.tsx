'use client'

import { useTranslations } from 'next-intl'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function PrivacyPolicyContent() {
  const t = useTranslations('static.privacy')
  const sections = (t.raw('sections') as { h: string; b: string }[]) ?? []
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      {sections.map((s, i) => (
        <Section key={i} heading={s.h}>
          <SectionText>{s.b}</SectionText>
        </Section>
      ))}
    </StaticPage>
  )
}
