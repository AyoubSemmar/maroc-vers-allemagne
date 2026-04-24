import { getTranslations } from 'next-intl/server'
import { getLevel } from '@/lib/german-data'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import LessonsList from '@/components/learn-german/LessonsList'

export default async function LevelPage({ params }: { params: Promise<{ level: string; locale: AppLocale }> }) {
  const { level: levelParam, locale } = await params
  const level = getLevel(levelParam)
  const t = await getTranslations({ locale, namespace: 'learnGerman.level' })
  const tData = await getTranslations({ locale, namespace: 'learnGerman.data' })

  if (!level || level.lessons.length === 0) notFound()

  const localizedTitle = (() => { try { return tData(`levels.${level.id}.title` as any) } catch { return level.title } })()
  const localizedDesc  = (() => { try { return tData(`levels.${level.id}.description` as any) } catch { return level.description } })()

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link href="/learn-german" className="text-sm text-green-700 hover:underline mb-4 block">
            {t('backToLevels')}
          </Link>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${level.color} flex items-center justify-center text-white font-bold text-xl`}>
              {level.id}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{localizedTitle} — {level.id}</h1>
              <p className="text-gray-500 text-sm mt-1">{localizedDesc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">{t('lessonsHeading')}</h2>
        <LessonsList level={level} />
      </div>
    </div>
  )
}
