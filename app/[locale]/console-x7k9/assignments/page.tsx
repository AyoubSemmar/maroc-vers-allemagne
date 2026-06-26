// Admin: author AI exercises (Grammatik/Lesen/Schreiben/Hören), publish them
// to a level or a specific cohort, and read the gradebook — each student's
// running grade + words learned (the "pressure" view). All reads use the
// service role (bypass RLS + the answer_key column lock).
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'
import { getLevel } from '@/lib/german-data'
import { collectLevelVocab, VOCAB_LEARNED_THRESHOLD } from '@/lib/learn-german/vocab'
import AdminAssignmentsClient, {
  type AdminAssignment,
  type RosterRow,
  type GroupOpt,
  type SubmissionDetail,
  type Kpis,
} from './AdminAssignmentsClient'

export const dynamic = 'force-dynamic'

const sbAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

function levelTotals(levelId: string) {
  const lvl = getLevel(levelId)
  return {
    lessons: lvl ? lvl.lessons.length : 0,
    vocab: lvl ? collectLevelVocab(lvl).length : 0,
  }
}

export default async function AdminAssignmentsPage({ params }: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const [{ data: groups }, { data: assignments }, { data: submissions }, { data: bookings }, usersRes, { data: lessonScores }, { data: vocab }] =
    await Promise.all([
      sbAdmin.from('class_groups').select('id,label,level').order('sort_order'),
      sbAdmin.from('assignments').select('id,skill,level_id,group_id,title,is_published,due_at,created_at').order('created_at', { ascending: false }),
      sbAdmin.from('assignment_submissions').select('assignment_id,user_id,auto_score,ai_score,teacher_score,answers,ai_feedback,submitted_at'),
      sbAdmin.from('class_bookings').select('user_id,group_id').eq('status', 'reserved'),
      sbAdmin.auth.admin.listUsers({ perPage: 1000 }),
      sbAdmin.from('lesson_scores').select('user_id,level_id,best_score'),
      sbAdmin.from('vocab_progress').select('user_id,level_id,mastery'),
    ])

  const emailById = new Map<string, string>()
  for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? '—')
  const groupById = new Map((groups ?? []).map(g => [g.id, g]))

  // Final score per (assignment,user).
  const finalByAU = new Map<string, number>()
  for (const s of submissions ?? []) {
    finalByAU.set(`${s.assignment_id}|${s.user_id}`, s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0)
  }

  // Detailed submissions per assignment (for the teacher drill-down).
  const skillByAssignment = new Map((assignments ?? []).map(a => [a.id, a.skill]))
  const submissionsByAssignment: Record<string, SubmissionDetail[]> = {}
  for (const s of submissions ?? []) {
    ;(submissionsByAssignment[s.assignment_id] ||= []).push({
      userId: s.user_id,
      email: emailById.get(s.user_id) ?? s.user_id,
      skill: skillByAssignment.get(s.assignment_id) ?? 'grammar',
      autoScore: s.auto_score ?? null,
      aiScore: s.ai_score ?? null,
      teacherScore: s.teacher_score ?? null,
      finalScore: s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0,
      answers: s.answers ?? null,
      aiFeedback: s.ai_feedback ?? null,
      submittedAt: (s.submitted_at as string)?.slice(0, 16).replace('T', ' ') ?? null,
    })
  }

  // Assignment list with avg + count.
  const adminAssignments: AdminAssignment[] = (assignments ?? []).map(a => {
    const subs = (submissions ?? []).filter(s => s.assignment_id === a.id)
    const avg = subs.length
      ? Math.round(subs.reduce((sum, s) => sum + (s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0), 0) / subs.length)
      : null
    return {
      id: a.id,
      skill: a.skill,
      level_id: a.level_id,
      group_id: a.group_id,
      groupLabel: a.group_id ? (groupById.get(a.group_id)?.label ?? a.group_id) : null,
      title: a.title,
      is_published: a.is_published,
      due_at: a.due_at,
      submissionCount: subs.length,
      avgScore: avg,
    }
  })

  // ── Roster: one row per reserved student ──
  const lessonBest = new Map<string, number[]>()        // userId|level -> best scores
  for (const ls of lessonScores ?? []) {
    const k = `${ls.user_id}|${(ls.level_id || '').toUpperCase()}`
    if (!lessonBest.has(k)) lessonBest.set(k, [])
    lessonBest.get(k)!.push(ls.best_score ?? 0)
  }
  const learnedCount = new Map<string, number>()        // userId|level -> #mastered
  for (const v of vocab ?? []) {
    if ((v.mastery ?? 0) >= VOCAB_LEARNED_THRESHOLD) {
      const k = `${v.user_id}|${(v.level_id || '').toUpperCase()}`
      learnedCount.set(k, (learnedCount.get(k) ?? 0) + 1)
    }
  }

  const roster: RosterRow[] = (bookings ?? []).map(b => {
    const g = groupById.get(b.group_id)
    const level = (g?.level || 'a1').toUpperCase()
    const totals = levelTotals(level)
    const k = `${b.user_id}|${level}`

    const bests = lessonBest.get(k) ?? []
    const lessonComponent = totals.lessons ? bests.reduce((s, n) => s + n, 0) / totals.lessons : 0
    const words = learnedCount.get(k) ?? 0
    const vocabComponent = totals.vocab ? (words / totals.vocab) * 100 : 0

    // Assignments in this student's scope (level + their group or whole-level).
    const scoped = (assignments ?? []).filter(a =>
      a.is_published && (a.level_id || '').toUpperCase() === level && (!a.group_id || a.group_id === b.group_id))
    const assignmentComponent = scoped.length
      ? scoped.reduce((s, a) => s + (finalByAU.get(`${a.id}|${b.user_id}`) ?? 0), 0) / scoped.length
      : 0
    const assignmentsDone = scoped.filter(a => finalByAU.has(`${a.id}|${b.user_id}`)).length

    const grade = scoped.length
      ? Math.round(0.4 * lessonComponent + 0.3 * vocabComponent + 0.3 * assignmentComponent)
      : Math.round(0.6 * lessonComponent + 0.4 * vocabComponent)

    return {
      email: emailById.get(b.user_id) ?? b.user_id,
      groupLabel: g?.label ?? b.group_id,
      level,
      lessonsAttempted: bests.length,
      lessonsTotal: totals.lessons,
      wordsLearned: words,
      wordsTotal: totals.vocab,
      assignmentsDone,
      assignmentsTotal: scoped.length,
      grade,
    }
  }).sort((a, b) => a.grade - b.grade)  // weakest first — who needs pressure

  const groupOpts: GroupOpt[] = (groups ?? []).map(g => ({
    id: g.id, label: g.label, level: (g.level || 'a1').toUpperCase(),
  }))

  const publishedCount = (assignments ?? []).filter(a => a.is_published).length
  const kpis: Kpis = {
    students: roster.length,
    avgGrade: roster.length ? Math.round(roster.reduce((s, r) => s + r.grade, 0) / roster.length) : 0,
    atRisk: roster.filter(r => r.grade < 50).length,
    published: publishedCount,
    submissions: (submissions ?? []).length,
  }

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Devoirs &amp; notes</h1>
          <p className="adm-page-sub">Crée des exercices corrigés par l&rsquo;IA (Grammatik, Lesen, Schreiben, Hören), publie-les à un niveau ou à un groupe, et suis la note de chaque élève.</p>
        </div>
      </header>
      <AdminAssignmentsClient
        assignments={adminAssignments}
        roster={roster}
        groups={groupOpts}
        kpis={kpis}
        submissionsByAssignment={submissionsByAssignment}
      />
    </>
  )
}
