'use client'

import { useTranslations } from 'next-intl'
import StaticPage, { Section, SectionText } from '@/components/StaticPage'

export default function AboutPage() {
  const t = useTranslations('static.about')
  return (
    <StaticPage title={t('title')} subtitle={t('subtitle')}>
      <Section heading={t('s1_h')}>
        <SectionText>{t('s1_b')}</SectionText>
      </Section>
      <Section heading={t('s2_h')}>
        <SectionText>{t('s2_b')}</SectionText>
      </Section>
      <Section heading={t('s3_h')}>
        <SectionText>{t('s3_b')}</SectionText>
      </Section>
      <Section heading={t('s4_h')}>
        <div id="mission">
          <SectionText>{t('s4_b')}</SectionText>
        </div>
      </Section>
      <Section heading={t('s5_h')}>
        <SectionText>{t('s5_b')}</SectionText>
      </Section>
    </StaticPage>
  )
}
