import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import ContentHub, { type HubData, type HubItem } from '@/components/ContentHub'
import { dirFor, type AppLocale } from '@/i18n/routing'

type Props = { params: Promise<{ locale: AppLocale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.ausbildung' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default async function AusbildungPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'static.ausbildung' })
  const data: HubData = {
    eyebrow: t('eyebrow'),
    title: t('title'),
    subtitle: t('subtitle'),
    intro: t('intro'),
    items: t.raw('items') as HubItem[],
  }
  const ctaHref = t('cta.href')
  return (
    <>
      <div
        dir={dirFor(locale)}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
          color: '#fff',
          padding: '20px 16px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700 }}>{t('cta.title')}</span>
          <a
            href={ctaHref}
            style={{
              background: '#fbbf24',
              color: '#0f172a',
              padding: '8px 18px',
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {t('cta.buttonLabel')}
          </a>
        </div>
      </div>

      <ContentHub data={data} locale={locale} />
    </>
  )
}
