import { getTranslations } from 'next-intl/server'
import { getLevel } from '@/lib/german-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { buildLocaleMetadata } from '@/lib/seo/buildLocaleMetadata'
import LessonsList from '@/components/learn-german/LessonsList'
import ExamPrepCTA from '@/components/learn-german/ExamPrepCTA'
import LiveClassesCta from '@/components/classes/LiveClassesCta'
import Icon from '@/components/ui/Icon'
import '../learn-german.css'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; locale: AppLocale }>
}): Promise<Metadata> {
  const { level: levelParam, locale } = await params
  const level = getLevel(levelParam)
  if (!level || level.lessons.length === 0) return {}

  const tData = await getTranslations({ locale, namespace: 'learnGerman.data' })
  let title = level.title
  let description = level.description
  try { title = tData(`levels.${level.id}.title` as any) } catch {}
  try { description = tData(`levels.${level.id}.description` as any) } catch {}

  return buildLocaleMetadata({
    locale,
    path: `/learn-german/${level.id.toLowerCase()}`,
    title: `${title} · ${level.id} — GoGermany`,
    description,
  })
}

export default async function LevelPage({ params }: { params: Promise<{ level: string; locale: AppLocale }> }) {
  const { level: levelParam, locale } = await params
  const level = getLevel(levelParam)
  const t = await getTranslations({ locale, namespace: 'learnGerman.level' })
  const tData = await getTranslations({ locale, namespace: 'learnGerman.data' })

  if (!level || level.lessons.length === 0) notFound()

  const localizedTitle = (() => { try { return tData(`levels.${level.id}.title` as any) } catch { return level.title } })()
  const localizedDesc  = (() => { try { return tData(`levels.${level.id}.description` as any) } catch { return level.description } })()

  return (
    <div className="lg-root" dir={dirFor(locale)}>
      <header className="lg-level-hero">
        <div className="wrap">
          <Link href="/learn-german" className="lg-back">← {t('backToLevels')}</Link>
          <div className="lg-level-hero-row">
            <div className={`lg-level-badge lg-level--${level.id.toLowerCase()}`}>
              <span className="lg-level-badge-id">{level.id}</span>
              <span className="lg-level-badge-emoji" aria-hidden>
                {level.iconName ? <Icon name={level.iconName} size={26} /> : level.emoji}
              </span>
            </div>
            <div>
              <h1 className="lg-level-title-h1">{localizedTitle}</h1>
              <p className="lg-level-hero-desc">{localizedDesc}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="lg-body wrap">
        {/* Live-classes CTA — level pages are high-traffic entry points.
            Self-gates: Morocco + launched only (admins preview anywhere). */}
        <LiveClassesCta locale={locale} />
        <ExamPrepCTA compact />
        <h2 className="lg-section-title">{t('lessonsHeading')}</h2>
        <LessonsList level={level} />
      </div>
    </div>
  )
}
