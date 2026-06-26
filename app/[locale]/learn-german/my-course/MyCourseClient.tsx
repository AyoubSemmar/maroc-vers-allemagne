'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getLevel } from '@/lib/german-data'
import { collectLevelVocab } from '@/lib/learn-german/vocab'
import { SKILL_LABELS } from '@/lib/learn-german/assignmentAI'
import { useProgress } from '@/lib/useProgress'
import { useVocabProgress } from '@/lib/useVocabProgress'
import VocabQuiz from '@/components/learn-german/VocabQuiz'
import AssignmentRunner, { type ClientAssignment } from '@/components/learn-german/AssignmentRunner'

const SKILL_EMOJI: Record<string, string> = { grammar: '🧩', lesen: '📖', schreiben: '✍️', hoeren: '🎧' }

export default function MyCourseClient({
  locale,
  levelId,
  groupId,
  groupLabel,
  displayName,
  isTeacher,
}: {
  locale: string
  levelId: string
  groupId: string | null
  groupLabel: string | null
  displayName: string
  isTeacher: boolean
}) {
  const level = getLevel(levelId)
  const { scores, progress } = useProgress((level?.id ?? 'A1') as any)
  const vocab = useVocabProgress((level?.id ?? 'A1') as any)

  const vocabTotal = useMemo(() => (level ? collectLevelVocab(level).length : 0), [level])

  // ── Assignments + this student's grades on them ──
  const [assignments, setAssignments] = useState<ClientAssignment[]>([])
  const [subScores, setSubScores] = useState<Record<string, number>>({})
  const [openAssignment, setOpenAssignment] = useState<ClientAssignment | null>(null)

  useEffect(() => {
    if (!level) return
    const supabase = createClient()
    let active = true
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      // answer_key is column-revoked for students — select explicit columns.
      const { data: rows } = await supabase
        .from('assignments')
        .select('id, skill, level_id, group_id, title, instructions, content, due_at')
        .eq('is_published', true)
        .eq('level_id', level!.id)
        .order('created_at', { ascending: false })
      // Whole-level assignments (no group) show to everyone at the level; a
      // group-scoped one shows to students booked in that group. Teachers
      // preview everything at the level regardless of group.
      const visible = (rows ?? []).filter(r => isTeacher || !r.group_id || r.group_id === groupId) as ClientAssignment[]
      if (!active) return
      setAssignments(visible)

      if (user && visible.length) {
        const { data: subs } = await supabase
          .from('assignment_submissions')
          .select('assignment_id, auto_score, ai_score, teacher_score')
          .eq('user_id', user.id)
          .in('assignment_id', visible.map(a => a.id))
        const map: Record<string, number> = {}
        for (const s of subs ?? []) {
          map[s.assignment_id] = s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0
        }
        if (active) setSubScores(map)
      }
    }
    load()
    return () => { active = false }
  }, [level?.id, groupId, isTeacher])

  if (!level) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-gray-500">Niveau introuvable.</div>
  }

  const lessons = [...level.lessons].sort((a, b) => a.order - b.order)
  const completed = new Set(progress.completedLessons)

  // ── Running grade ── lessons (best score, unattempted = 0) + vocab mastery %
  // + assignments (final score, not-done = 0). Assignments only weigh in once
  // the teacher has posted some — otherwise lessons/vocab carry the grade.
  const lessonComponent = lessons.length
    ? lessons.reduce((sum, l) => sum + (scores[l.id]?.best ?? 0), 0) / lessons.length
    : 0
  const vocabComponent = vocabTotal ? (vocab.learnedCount / vocabTotal) * 100 : 0
  const assignmentComponent = assignments.length
    ? assignments.reduce((sum, a) => sum + (subScores[a.id] ?? 0), 0) / assignments.length
    : 0
  const grade = assignments.length
    ? Math.round(0.4 * lessonComponent + 0.3 * vocabComponent + 0.3 * assignmentComponent)
    : Math.round(0.6 * lessonComponent + 0.4 * vocabComponent)

  const gradeColor = grade >= 70 ? 'text-green-700' : grade >= 50 ? 'text-amber-600' : 'text-gray-400'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
        <div>
          <p className="text-xs text-gray-400">Mon cours</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {displayName} · <span className="text-green-700">{level.id}</span>
          </h1>
          {groupLabel && <p className="text-sm text-gray-500 mt-0.5">{groupLabel}</p>}
        </div>
        {groupId && (
          <Link
            href={`/learn-german/classes/${groupId}/room`}
            className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2"
          >
            🎥 Salle de classe
          </Link>
        )}
      </div>

      {/* Grade + vocab summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-xs text-gray-400">Note globale</p>
          <p className={`text-4xl font-black ${gradeColor}`}>{grade}<span className="text-lg text-gray-300">/100</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-xs text-gray-400">Leçons terminées</p>
          <p className="text-4xl font-black text-gray-800">{completed.size}<span className="text-lg text-gray-300">/{lessons.length}</span></p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-xs text-gray-400">Mots mémorisés</p>
          <p className="text-4xl font-black text-gray-800">{vocab.loaded ? vocab.learnedCount : '…'}<span className="text-lg text-gray-300">/{vocabTotal}</span></p>
        </div>
      </div>

      {/* Vocabulary trainer */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Vocabulaire</h2>
        <VocabQuiz level={level} vocab={vocab} />
      </div>

      {/* Assignments / Devoirs */}
      {assignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Devoirs</h2>
          <div className="flex flex-col gap-2">
            {assignments.map(a => {
              const score = subScores[a.id]
              const done = score != null
              const overdue = a.due_at && !done && new Date(a.due_at) < new Date()
              return (
                <button
                  key={a.id}
                  onClick={() => setOpenAssignment(a)}
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors text-left"
                >
                  <span className="text-xl shrink-0">{SKILL_EMOJI[a.skill]}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 truncate" dir="ltr">{a.title}</span>
                    <span className="block text-xs text-gray-400">
                      {SKILL_LABELS[a.skill]}
                      {a.due_at && ` · échéance ${new Date(a.due_at).toLocaleDateString('fr-FR')}`}
                    </span>
                  </span>
                  {done ? (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${score >= 70 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{score}%</span>
                  ) : (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md shrink-0 ${overdue ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {overdue ? 'En retard' : 'À faire'}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Syllabus */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Programme · {level.id}</h2>
      <div className="flex flex-col gap-2">
        {lessons.map(lesson => {
          const sc = scores[lesson.id]
          const done = completed.has(lesson.id)
          return (
            <Link
              key={lesson.id}
              href={`/learn-german/${level.id.toLowerCase()}/${lesson.id}`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors"
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {done ? '✓' : lesson.order}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{lesson.title}</span>
              {sc ? (
                <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0
                  ${sc.best >= 70 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {sc.best}%
                </span>
              ) : (
                <span className="text-xs text-gray-300 shrink-0">—</span>
              )}
            </Link>
          )
        })}
      </div>

      {isTeacher && (
        <Link href="/console-x7k9/classes" className="block text-xs text-green-700 hover:underline mt-8 text-center">
          👋 Vue enseignant — ouvrir le carnet de notes →
        </Link>
      )}

      {openAssignment && (
        <AssignmentRunner
          assignment={openAssignment}
          locale={locale}
          onClose={() => setOpenAssignment(null)}
          onGraded={(id, score) => setSubScores(prev => ({ ...prev, [id]: score }))}
        />
      )}
    </div>
  )
}
