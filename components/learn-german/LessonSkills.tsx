'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'
import AssignmentRunner, { type ClientAssignment } from '@/components/learn-german/AssignmentRunner'
import { SKILL_LABELS, type Skill } from '@/lib/learn-german/assignmentAI'

const SKILL_EMOJI: Record<Skill, string> = {
  grammar: '🧩', lesen: '📖', schreiben: '✍️', hoeren: '🎧',
}
const SKILL_RANK: Record<string, number> = { lesen: 0, hoeren: 1, schreiben: 2, grammar: 3 }

/**
 * Loads the published exam-style devoirs (Lesen/Hören/Schreiben, originally
 * built for the paid live course) attached to one free lesson, plus the
 * signed-in user's saved scores for them. Anonymous visitors get the
 * exercises too — their MCQ attempts are graded but not persisted.
 */
export function useLessonDevoirs(levelId: string, lessonId: string) {
  const [devoirs, setDevoirs] = useState<ClientAssignment[]>([])
  const [subScores, setSubScores] = useState<Record<string, number>>({})
  const [isAuthed, setIsAuthed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function load() {
      // Whole-level devoirs only (group_id null): cohort-specific teacher
      // assignments stay inside the paid course dashboard.
      const { data: rows } = await supabase
        .from('assignments')
        .select('id, skill, level_id, title, instructions, content, due_at')
        .eq('level_id', levelId)
        .eq('is_published', true)
        .is('group_id', null)
        .eq('content->>lessonId', lessonId)
      if (!active) return
      const sorted = ((rows ?? []) as ClientAssignment[])
        .sort((a, b) => (SKILL_RANK[a.skill] ?? 9) - (SKILL_RANK[b.skill] ?? 9))
      setDevoirs(sorted)

      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      setIsAuthed(!!user)
      if (user && sorted.length) {
        const { data: subs } = await supabase
          .from('assignment_submissions')
          .select('assignment_id, auto_score, ai_score, teacher_score')
          .eq('user_id', user.id)
          .in('assignment_id', sorted.map(a => a.id))
        if (!active) return
        const map: Record<string, number> = {}
        for (const s of subs ?? []) {
          map[s.assignment_id] = s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0
        }
        setSubScores(map)
      }
      setLoaded(true)
    }
    load()
    return () => { active = false }
  }, [levelId, lessonId])

  function setScore(assignmentId: string, score: number) {
    setSubScores(prev => ({ ...prev, [assignmentId]: score }))
  }

  return { devoirs, subScores, setScore, isAuthed, loaded }
}

export default function LessonSkills({
  devoirs,
  subScores,
  onGraded,
  isAuthed,
  locale,
}: {
  devoirs: ClientAssignment[]
  subScores: Record<string, number>
  onGraded: (assignmentId: string, score: number) => void
  isAuthed: boolean
  locale: string
}) {
  const t = useTranslations('learnGerman.devoirs')
  const pathname = usePathname()
  const [open, setOpen] = useState<ClientAssignment | null>(null)

  if (devoirs.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{t('heading')}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{t('sub')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {devoirs.map(d => {
          const score = subScores[d.id]
          const hasScore = score != null
          return (
            <button
              key={d.id}
              onClick={() => setOpen(d)}
              className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 p-4 text-left transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl">{SKILL_EMOJI[d.skill]}</span>
                {hasScore ? (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${score >= 70 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                    {score}/100
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                    {t('start')}
                  </span>
                )}
              </div>
              <p className="font-bold text-gray-900 text-sm mt-2">{SKILL_LABELS[d.skill]}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2" dir="ltr">{d.title}</p>
              {hasScore && (
                <p className="text-xs text-green-700 font-semibold mt-2">↻ {t('redo')}</p>
              )}
            </button>
          )
        })}
      </div>

      {!isAuthed && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          {t('notSaved')}{' '}
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="font-semibold underline text-green-800">
            {t('loginCta')}
          </Link>
        </p>
      )}

      {open && (
        <AssignmentRunner
          assignment={open}
          locale={locale}
          onClose={() => setOpen(null)}
          onGraded={onGraded}
        />
      )}
    </div>
  )
}
