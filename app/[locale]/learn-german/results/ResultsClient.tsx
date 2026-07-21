'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { dirFor, type AppLocale } from '@/i18n/routing'
import { createClient } from '@/lib/supabase-browser'
import { SKILL_LABELS, type Skill } from '@/lib/learn-german/assignmentAI'
import { VOCAB_LEARNED_THRESHOLD } from '@/lib/learn-german/vocab'
import Icon from '@/components/ui/Icon'
import SkillIcon from '@/components/learn-german/SkillIcon'

export type LevelSummary = {
  id: string
  color: string
  total: number
  orders: Record<string, number>
}

type ScoreRow = { level_id: string; lesson_id: string; best_score: number | null; last_score: number | null; updated_at: string | null }
type ProgressRow = { level_id: string; completed_lessons: string[] | null }
type SubRow = {
  assignment_id: string
  auto_score: number | null
  ai_score: number | null
  teacher_score: number | null
  submitted_at: string | null
  assignments: { skill: Skill; level_id: string; title: string; content: { lessonOrder?: number; lessonTitle?: string } | null } | null
}

const SKILLS_ORDER: Skill[] = ['lesen', 'hoeren', 'schreiben', 'grammar']

// Same thresholds as the paid course dashboard: German school notes.
// `key` maps into learnGerman.myCourse.gradeLevels for the displayed text —
// same wording as the my-course dashboard, and it was hardcoded German prose
// here regardless of site locale before.
function gradeNote(g: number): { note: string; key: string; color: string } {
  if (g >= 90) return { note: '1', key: 'excellent', color: 'text-green-700' }
  if (g >= 80) return { note: '2', key: 'veryGood', color: 'text-green-700' }
  if (g >= 70) return { note: '3', key: 'good', color: 'text-green-600' }
  if (g >= 60) return { note: '3', key: 'satisfactory', color: 'text-amber-600' }
  if (g >= 50) return { note: '4', key: 'sufficient', color: 'text-amber-600' }
  return { note: '5', key: 'toImprove', color: 'text-red-500' }
}

function effScore(s: SubRow): number {
  return s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0
}

function Donut({ value, size = 96 }: { value: number | null; size?: number }) {
  const v = value ?? 0
  const color = v >= 70 ? '#16a34a' : v >= 50 ? '#f59e0b' : v > 0 ? '#ef4444' : '#e5e7eb'
  return (
    <svg viewBox="0 0 36 36" style={{ width: size, height: size }} className="-rotate-90">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.4" />
      <circle
        cx="18" cy="18" r="15.9" fill="none"
        stroke={color} strokeWidth="3.4"
        strokeDasharray={`${v} ${100 - v}`} strokeLinecap="round"
      />
    </svg>
  )
}

function SkillBar({ icon, label, value, count, countLabel }: {
  icon: React.ReactNode; label: string; value: number | null; count: number; countLabel: string
}) {
  const v = value == null ? 0 : Math.round(value)
  const bar = v >= 70 ? 'bg-green-500' : v >= 50 ? 'bg-amber-500' : v > 0 ? 'bg-red-400' : 'bg-gray-200'
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-semibold text-gray-800 inline-flex items-center gap-2">
          <span className="text-gray-400">{icon}</span> {label}
        </span>
        <span className="text-gray-500">
          {value == null ? '—' : `${v}/100`} <span className="text-gray-300">·</span> <span className="text-xs">{countLabel.replace('{n}', String(count))}</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`${bar} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}

export default function ResultsClient({ levels }: { levels: LevelSummary[] }) {
  const t = useTranslations('learnGerman.results')
  const tGrade = useTranslations('learnGerman.myCourse.gradeLevels')
  const locale = useLocale() as AppLocale
  const pathname = usePathname()

  const [loaded, setLoaded] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([])
  const [scoreRows, setScoreRows] = useState<ScoreRow[]>([])
  const [subRows, setSubRows] = useState<SubRow[]>([])
  const [vocabLearned, setVocabLearned] = useState(0)

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      if (!user) { setIsAuthed(false); setLoaded(true); return }
      setIsAuthed(true)

      const [progRes, scoreRes, vocabRes, subRes] = await Promise.all([
        supabase.from('user_progress').select('level_id, completed_lessons').eq('user_id', user.id),
        supabase.from('lesson_scores').select('level_id, lesson_id, best_score, last_score, updated_at').eq('user_id', user.id),
        supabase.from('vocab_progress').select('mastery').eq('user_id', user.id).gte('mastery', VOCAB_LEARNED_THRESHOLD),
        supabase.from('assignment_submissions')
          .select('assignment_id, auto_score, ai_score, teacher_score, submitted_at, assignments(skill, level_id, title, content)')
          .eq('user_id', user.id),
      ])
      if (!active) return
      setProgressRows((progRes.data ?? []) as ProgressRow[])
      setScoreRows((scoreRes.data ?? []) as ScoreRow[])
      setVocabLearned(vocabRes.data?.length ?? 0)
      setSubRows((subRes.data ?? []) as unknown as SubRow[])
      setLoaded(true)
    }
    load()
    return () => { active = false }
  }, [])

  const stats = useMemo(() => {
    const totalLessons = levels.reduce((s, l) => s + l.total, 0)
    const completedByLevel: Record<string, number> = {}
    let lessonsDone = 0
    for (const p of progressRows) {
      const n = p.completed_lessons?.length ?? 0
      completedByLevel[p.level_id] = n
      lessonsDone += n
    }

    const attempted = scoreRows.filter(r => r.best_score != null)
    const lessonQuality = attempted.length
      ? attempted.reduce((s, r) => s + (r.best_score ?? 0), 0) / attempted.length
      : null
    const avgByLevel: Record<string, number> = {}
    for (const lvl of levels) {
      const rows = attempted.filter(r => r.level_id === lvl.id)
      if (rows.length) avgByLevel[lvl.id] = Math.round(rows.reduce((s, r) => s + (r.best_score ?? 0), 0) / rows.length)
    }

    const devoirQuality = subRows.length
      ? subRows.reduce((s, r) => s + effScore(r), 0) / subRows.length
      : null

    // Overall grade over work actually attempted — lessons 60 / devoirs 40,
    // renormalized when only one track exists (same fairness rule as the
    // paid-course dashboard).
    const parts: { v: number; w: number }[] = []
    if (lessonQuality != null) parts.push({ v: lessonQuality, w: 60 })
    if (devoirQuality != null) parts.push({ v: devoirQuality, w: 40 })
    const grade = parts.length
      ? Math.round(parts.reduce((s, p) => s + p.v * p.w, 0) / parts.reduce((s, p) => s + p.w, 0))
      : null

    const skills = SKILLS_ORDER.map(sk => {
      const items = subRows.filter(r => r.assignments?.skill === sk)
      const avg = items.length ? Math.round(items.reduce((s, r) => s + effScore(r), 0) / items.length) : null
      return { skill: sk, avg, count: items.length }
    })
    const rankedSkills = skills.filter(s => s.avg != null && s.count >= 2)
    const weakest = rankedSkills.length >= 2
      ? rankedSkills.reduce((min, s) => (s.avg! < min.avg! ? s : min))
      : null

    const recent = [
      ...attempted.filter(r => r.updated_at).map(r => ({
        when: r.updated_at as string,
        icon: <Icon name="check-square" size={16} />,
        label: t('lessonLabel', { level: r.level_id, n: levels.find(l => l.id === r.level_id)?.orders[r.lesson_id] ?? '?' }),
        score: r.best_score ?? 0,
      })),
      ...subRows.filter(r => r.submitted_at && r.assignments).map(r => ({
        when: r.submitted_at as string,
        icon: <SkillIcon skill={r.assignments!.skill} size={16} />,
        // Lesson devoirs: reference the lesson by number — the stored
        // lessonTitle is the base (Arabic) theme and shouldn't leak into
        // other locales. Custom teacher assignments keep their title.
        label: `${SKILL_LABELS[r.assignments!.skill]} · ${
          r.assignments!.content?.lessonOrder != null
            ? t('lessonLabel', { level: r.assignments!.level_id, n: r.assignments!.content.lessonOrder })
            : r.assignments!.title
        }`,
        score: effScore(r),
      })),
    ].sort((a, b) => b.when.localeCompare(a.when)).slice(0, 8)

    return {
      totalLessons, lessonsDone, completedByLevel, avgByLevel,
      lessonQuality, devoirQuality, grade, skills, weakest, recent,
      devoirsDone: subRows.length, attemptedCount: attempted.length,
    }
  }, [levels, progressRows, scoreRows, subRows, t])

  const hasAnything = stats.attemptedCount > 0 || stats.devoirsDone > 0 || stats.lessonsDone > 0

  return (
    <div className="min-h-screen bg-gray-50" dir={dirFor(locale)}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="mb-8">
          <Link href="/learn-german" className="text-sm text-gray-500 hover:text-green-700">← {t('backToCourse')}</Link>
          <h1 className="text-2xl font-black text-gray-900 mt-2">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>

        {!loaded && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">…</div>
        )}

        {/* Signed out: results live behind a free account. */}
        {loaded && !isAuthed && (
          <div className="bg-white rounded-2xl border-2 border-green-200 p-8 text-center">
            <div className="mb-4 flex justify-center text-green-700"><Icon name="lock" size={36} /></div>
            <h2 className="text-lg font-bold text-gray-900">{t('signinTitle')}</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">{t('signinBody')}</p>
            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              className="inline-block mt-5 bg-green-700 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-green-800"
            >
              {t('signinCta')}
            </Link>
          </div>
        )}

        {loaded && isAuthed && !hasAnything && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="mb-4 flex justify-center text-green-700"><Icon name="sprout" size={36} /></div>
            <h2 className="text-lg font-bold text-gray-900">{t('emptyTitle')}</h2>
            <p className="text-sm text-gray-500 mt-2">{t('emptyBody')}</p>
            <Link
              href="/learn-german/a1"
              className="inline-block mt-5 bg-green-700 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-green-800"
            >
              {t('emptyCta')}
            </Link>
          </div>
        )}

        {loaded && isAuthed && hasAnything && (
          <div className="flex flex-col gap-6">

            {/* Report card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <Donut value={stats.grade} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900">{stats.grade ?? '—'}</span>
                    <span className="text-[10px] text-gray-400">/100</span>
                  </div>
                </div>
                <div className="text-center sm:text-left rtl:sm:text-right">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('gradeHeading')}</p>
                  {stats.grade != null ? (
                    <>
                      <p className={`text-xl font-black ${gradeNote(stats.grade).color}`}>
                        {t('noteLabel', { n: gradeNote(stats.grade).note, text: tGrade(gradeNote(stats.grade).key as any) })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{t('gradeSub')}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">{t('noGrade')}</p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 sm:ms-auto text-center">
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xl font-black text-gray-900">{stats.lessonsDone}<span className="text-xs text-gray-400">/{stats.totalLessons}</span></p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{t('lessonsDone')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xl font-black text-gray-900">{stats.devoirsDone}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{t('devoirsDone')}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-xl font-black text-gray-900">{vocabLearned}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{t('wordsLearned')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">{t('skillsHeading')}</h2>
              <div className="flex flex-col gap-4">
                <SkillBar
                  icon={<Icon name="check-square" size={16} />} label={t('skillLessons')}
                  value={stats.lessonQuality == null ? null : Math.round(stats.lessonQuality)}
                  count={stats.attemptedCount} countLabel={t('countItems')}
                />
                {stats.skills.map(s => (
                  <SkillBar
                    key={s.skill}
                    icon={<SkillIcon skill={s.skill} size={16} />} label={SKILL_LABELS[s.skill]}
                    value={s.avg} count={s.count} countLabel={t('countItems')}
                  />
                ))}
              </div>
              {stats.weakest && (
                <p className="mt-4 text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-900 flex items-start gap-2">
                  <Icon name="lightbulb" size={16} className="shrink-0 mt-0.5" />
                  <span>{t('weakTip', { skill: SKILL_LABELS[stats.weakest.skill] })}</span>
                </p>
              )}
            </div>

            {/* Levels */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">{t('levelsHeading')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {levels.map(lvl => {
                  const done = stats.completedByLevel[lvl.id] ?? 0
                  const avg = stats.avgByLevel[lvl.id]
                  const pct = lvl.total ? Math.round((done / lvl.total) * 100) : 0
                  return (
                    <Link
                      key={lvl.id}
                      href={`/learn-german/${lvl.id.toLowerCase()}`}
                      className="border-2 border-gray-200 hover:border-green-400 rounded-2xl p-4 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-black text-gray-900">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-black ${lvl.color}`}>
                            {lvl.id}
                          </span>
                          {lvl.id}
                        </span>
                        {avg != null && (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${avg >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                            {t('levelAvg', { n: avg })}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-gray-500">{t('levelProgress', { done, total: lvl.total })}</span>
                        <span className="text-green-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{t('continue')} →</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Recent activity */}
            {stats.recent.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-bold text-gray-900 mb-4">{t('recentHeading')}</h2>
                <ul className="flex flex-col divide-y divide-gray-100">
                  {stats.recent.map((r, i) => (
                    <li key={i} className="flex items-center gap-3 py-2.5">
                      <span className="text-gray-400 shrink-0">{r.icon}</span>
                      <span className="text-sm text-gray-700 flex-1 min-w-0 truncate" dir="auto">{r.label}</span>
                      <span className="text-xs text-gray-400 shrink-0">{new Date(r.when).toLocaleDateString(locale)}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${r.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                        {r.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
