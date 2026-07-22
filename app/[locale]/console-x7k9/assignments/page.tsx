// Admin: student progress by group. Pick a group → see its students, each with
// a quick count of lessons done / vocab learned / exercises done + an overall
// grade. Open a student to read the note they got on every exercise they did.
// All reads use the service role (bypass RLS + the answer_key column lock).
import { createClient } from '@supabase/supabase-js'
import type { AppLocale } from '@/i18n/routing'
import { getLevel } from '@/lib/german-data'
import { collectLevelVocab, VOCAB_LEARNED_THRESHOLD } from '@/lib/learn-german/vocab'
import { SKILL_LABELS, type Skill } from '@/lib/learn-german/assignmentAI'
import AdminAssignmentsClient, {
  type GroupBlock,
  type StudentRow,
  type ExerciseResult,
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
      sbAdmin.from('assignments').select('id,skill,level_id,group_id,title,is_published').order('created_at', { ascending: false }),
      sbAdmin.from('assignment_submissions').select('assignment_id,user_id,auto_score,ai_score,teacher_score,submitted_at'),
      sbAdmin.from('class_bookings').select('user_id,group_id,created_at').eq('status', 'reserved'),
      sbAdmin.auth.admin.listUsers({ perPage: 1000 }),
      sbAdmin.from('lesson_scores').select('user_id,level_id,best_score'),
      sbAdmin.from('vocab_progress').select('user_id,level_id,mastery'),
    ])

  const emailById = new Map<string, string>()
  for (const u of usersRes.data?.users ?? []) emailById.set(u.id, u.email ?? '—')

  // Final score + submission time per (assignment,user).
  const subByAU = new Map<string, { score: number; at: string | null }>()
  for (const s of submissions ?? []) {
    subByAU.set(`${s.assignment_id}|${s.user_id}`, {
      score: s.teacher_score ?? s.ai_score ?? s.auto_score ?? 0,
      at: (s.submitted_at as string)?.slice(0, 16).replace('T', ' ') ?? null,
    })
  }

  // Lessons completed (a saved best score = the lesson was attempted) and vocab
  // mastered, both keyed by userId|LEVEL.
  const lessonBest = new Map<string, number[]>()
  for (const ls of lessonScores ?? []) {
    const k = `${ls.user_id}|${(ls.level_id || '').toUpperCase()}`
    ;(lessonBest.get(k) ?? lessonBest.set(k, []).get(k)!).push(ls.best_score ?? 0)
  }
  const learnedCount = new Map<string, number>()
  for (const v of vocab ?? []) {
    if ((v.mastery ?? 0) >= VOCAB_LEARNED_THRESHOLD) {
      const k = `${v.user_id}|${(v.level_id || '').toUpperCase()}`
      learnedCount.set(k, (learnedCount.get(k) ?? 0) + 1)
    }
  }

  function buildStudent(userId: string, groupId: string, level: string, bookedAt: string | null): StudentRow {
    const totals = levelTotals(level)
    const k = `${userId}|${level}`
    const bests = lessonBest.get(k) ?? []
    const words = learnedCount.get(k) ?? 0

    // Assignments in this student's scope: same level, and either whole-level
    // (no group) or pinned to their group.
    const scoped = (assignments ?? []).filter(a =>
      a.is_published && (a.level_id || '').toUpperCase() === level && (!a.group_id || a.group_id === groupId))

    const exercises: ExerciseResult[] = scoped
      .map(a => {
        const sub = subByAU.get(`${a.id}|${userId}`)
        return {
          assignmentId: a.id,
          title: a.title,
          skill: (SKILL_LABELS[a.skill as Skill] ?? a.skill) as string,
          done: !!sub,
          score: sub ? sub.score : null,
          submittedAt: sub?.at ?? null,
        }
      })
      // Done first (most recent on top), then the not-yet-done ones.
      .sort((x, y) => {
        if (x.done !== y.done) return x.done ? -1 : 1
        return (y.submittedAt ?? '').localeCompare(x.submittedAt ?? '')
      })

    const exercisesDone = exercises.filter(e => e.done).length

    // Overall grade: lessons (avg best score over all level lessons), vocab
    // (% mastered), exercises (avg note). Same weighting as the student's own
    // report card so the two views agree.
    const lessonComponent = totals.lessons ? bests.reduce((s, n) => s + n, 0) / totals.lessons : 0
    const vocabComponent = totals.vocab ? (words / totals.vocab) * 100 : 0
    const exerciseComponent = scoped.length
      ? scoped.reduce((s, a) => s + (subByAU.get(`${a.id}|${userId}`)?.score ?? 0), 0) / scoped.length
      : 0
    const grade = scoped.length
      ? Math.round(0.4 * lessonComponent + 0.3 * vocabComponent + 0.3 * exerciseComponent)
      : Math.round(0.6 * lessonComponent + 0.4 * vocabComponent)

    return {
      userId,
      email: emailById.get(userId) ?? userId,
      bookedAt: bookedAt?.slice(0, 10) ?? null,
      lessonsDone: bests.length,
      lessonsTotal: totals.lessons,
      wordsLearned: words,
      wordsTotal: totals.vocab,
      exercisesDone,
      exercisesTotal: scoped.length,
      grade,
      exercises,
    }
  }

  const blocks: GroupBlock[] = (groups ?? []).map(g => {
    const level = (g.level || 'a1').toUpperCase()
    const students = (bookings ?? [])
      .filter(b => b.group_id === g.id)
      .map(b => buildStudent(b.user_id, g.id, level, (b.created_at as string) ?? null))
      .sort((a, b) => a.grade - b.grade)  // weakest first — who needs a nudge
    return { id: g.id, label: g.label, level, students }
  })

  const totalStudents = blocks.reduce((s, b) => s + b.students.length, 0)

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Devoirs &amp; notes</h1>
          <p className="adm-page-sub">
            Choisis un groupe pour voir ses élèves — leçons, vocabulaire et exercices faits, plus la note globale.
            Ouvre un élève pour lire la note obtenue à chaque exercice.
          </p>
        </div>
      </header>
      <AdminAssignmentsClient groups={blocks} totalStudents={totalStudents} />
    </>
  )
}
