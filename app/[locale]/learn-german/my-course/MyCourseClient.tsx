'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getLevel } from '@/lib/german-data'
import { collectLevelVocab } from '@/lib/learn-german/vocab'
import { SKILL_LABELS } from '@/lib/learn-german/assignmentAI'
import { callWindowState, type ClassWindow } from '@/lib/classSchedule'
import { useProgress } from '@/lib/useProgress'
import { useVocabProgress } from '@/lib/useVocabProgress'
import VocabQuiz from '@/components/learn-german/VocabQuiz'
import AssignmentRunner, { type ClientAssignment } from '@/components/learn-german/AssignmentRunner'

const SKILL_EMOJI: Record<string, string> = { grammar: '🧩', lesen: '📖', schreiben: '✍️', hoeren: '🎧' }
const SKILLS_ORDER = ['grammar', 'lesen', 'schreiben', 'hoeren'] as const

// Qualitative label + German school note (1 best … 6) for a 0-100 grade.
function gradeInfo(g: number): { note: string; text: string; color: string; bar: string } {
  if (g >= 90) return { note: '1', text: 'Ausgezeichnet', color: 'text-green-700', bar: 'bg-green-500' }
  if (g >= 80) return { note: '2', text: 'Sehr gut', color: 'text-green-700', bar: 'bg-green-500' }
  if (g >= 70) return { note: '3', text: 'Gut', color: 'text-green-600', bar: 'bg-green-500' }
  if (g >= 60) return { note: '3', text: 'Befriedigend', color: 'text-amber-600', bar: 'bg-amber-500' }
  if (g >= 50) return { note: '4', text: 'Ausreichend', color: 'text-amber-600', bar: 'bg-amber-500' }
  if (g > 0)   return { note: '5', text: 'À améliorer', color: 'text-red-500', bar: 'bg-red-400' }
  return { note: '—', text: 'Pas encore commencé', color: 'text-gray-400', bar: 'bg-gray-300' }
}

function Bar({ label, value, weight, emoji }: { label: string; value: number; weight: number; emoji: string }) {
  const v = Math.round(value)
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">{emoji} {label} <span className="text-gray-300">· {weight}%</span></span>
        <span className="font-semibold text-gray-700">{v}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}

export default function MyCourseClient({
  locale,
  levelId,
  groupId,
  groupLabel,
  displayName,
  isTeacher,
  callUrl,
  classWindow,
}: {
  locale: string
  levelId: string
  groupId: string | null
  groupLabel: string | null
  displayName: string
  isTeacher: boolean
  callUrl: string | null
  classWindow: ClassWindow | null
}) {
  const level = getLevel(levelId)
  const { scores, progress } = useProgress((level?.id ?? 'A1') as any)
  const vocab = useVocabProgress((level?.id ?? 'A1') as any)

  const vocabTotal = useMemo(() => (level ? collectLevelVocab(level).length : 0), [level])

  // ── Assignments + this student's grades on them ──
  const [assignments, setAssignments] = useState<ClientAssignment[]>([])
  const [subScores, setSubScores] = useState<Record<string, number>>({})
  const [openAssignment, setOpenAssignment] = useState<ClientAssignment | null>(null)

  // Live join-window state (15 min before → 30 min after start, Morocco time).
  // Re-checked every 30s so the button flips on/off without a refresh.
  const [callOpen, setCallOpen] = useState(false)
  const [windowLabel, setWindowLabel] = useState<{ opensAtLabel: string; closesAtLabel: string } | null>(null)
  useEffect(() => {
    if (!classWindow) return
    const tick = () => {
      const s = callWindowState(classWindow)
      setCallOpen(s.open)
      setWindowLabel({ opensAtLabel: s.opensAtLabel, closesAtLabel: s.closesAtLabel })
    }
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [classWindow])

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

  const info = gradeInfo(grade)
  const weights = assignments.length
    ? { lesson: 40, vocab: 30, assign: 30 }
    : { lesson: 60, vocab: 40, assign: 0 }

  // Per-skill devoir averages (done items only).
  const skillAvgs = SKILLS_ORDER.map(sk => {
    const items = assignments.filter(a => a.skill === sk)
    const graded = items.filter(a => subScores[a.id] != null)
    const avg = graded.length ? Math.round(graded.reduce((s, a) => s + subScores[a.id], 0) / graded.length) : null
    return { skill: sk, avg, assigned: items.length, done: graded.length }
  }).filter(s => s.assigned > 0)

  // Group pre-generated devoirs by lesson (Lesen + Hören + Schreiben = 1 devoir).
  // Ad-hoc teacher assignments (no lessonOrder) fall into a flat "loose" list.
  const SKILL_RANK: Record<string, number> = { lesen: 0, hoeren: 1, schreiben: 2, grammar: 3 }
  const { devoirGroups, looseDevoirs } = (() => {
    const map = new Map<number, { order: number; title: string; tasks: ClientAssignment[] }>()
    const loose: ClientAssignment[] = []
    for (const a of assignments) {
      const lo = a.content?.lessonOrder
      if (typeof lo === 'number') {
        if (!map.has(lo)) map.set(lo, { order: lo, title: a.content?.lessonTitle || '', tasks: [] })
        map.get(lo)!.tasks.push(a)
      } else loose.push(a)
    }
    const groups = [...map.values()].sort((x, y) => x.order - y.order)
    for (const g of groups) g.tasks.sort((x, y) => (SKILL_RANK[x.skill] ?? 9) - (SKILL_RANK[y.skill] ?? 9))
    return { devoirGroups: groups, looseDevoirs: loose }
  })()

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
        {callUrl && (
          callOpen ? (
            <a
              href={callUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2"
            >
              🎥 Rejoindre l’appel vidéo ↗
            </a>
          ) : (
            <span
              className="rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold px-4 py-2 cursor-not-allowed select-none"
              title={windowLabel ? `Ouvert de ${windowLabel.opensAtLabel} à ${windowLabel.closesAtLabel}` : undefined}
            >
              🎥 Appel vidéo{windowLabel ? ` — dès ${windowLabel.opensAtLabel}` : ''}
            </span>
          )
        )}
      </div>

      {/* Report card — overall grade + transparent breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Overall */}
          <div className="flex items-center gap-4 md:w-56 md:flex-col md:text-center md:justify-center md:border-r md:border-gray-100 md:pr-6">
            <div className="relative shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                  className={info.color} strokeDasharray={`${grade} ${100 - grade}`} strokeLinecap="round" />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-2xl font-black ${info.color}`}>{grade}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Note globale</p>
              <p className={`font-bold ${info.color}`}>{info.text}</p>
              <p className="text-[11px] text-gray-400">Note allemande : {info.note}</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <Bar emoji="📚" label="Leçons" value={lessonComponent} weight={weights.lesson} />
            <Bar emoji="🧠" label="Vocabulaire" value={vocabComponent} weight={weights.vocab} />
            {assignments.length > 0 && (
              <Bar emoji="📝" label="Devoirs" value={assignmentComponent} weight={weights.assign} />
            )}
            <div className="flex gap-4 text-xs text-gray-400 pt-1 flex-wrap">
              <span>✓ {completed.size}/{lessons.length} leçons</span>
              <span>🧠 {vocab.loaded ? vocab.learnedCount : '…'}/{vocabTotal} mots</span>
              {assignments.length > 0 && <span>📝 {Object.keys(subScores).length}/{assignments.length} devoirs</span>}
            </div>
          </div>
        </div>

        {/* Per-skill devoir averages */}
        {skillAvgs.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-gray-100">
            {skillAvgs.map(s => (
              <span key={s.skill} className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
                {SKILL_EMOJI[s.skill]} {SKILL_LABELS[s.skill]} : <strong className={s.avg == null ? 'text-gray-400' : s.avg >= 70 ? 'text-green-700' : 'text-amber-700'}>{s.avg == null ? '—' : `${s.avg}%`}</strong>
                <span className="text-gray-300"> ({s.done}/{s.assigned})</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Vocabulary trainer */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Vocabulaire</h2>
        <VocabQuiz level={level} vocab={vocab} />
      </div>

      {/* Devoirs — grouped per lesson (Lesen + Hören + Schreiben) */}
      {assignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Devoirs</h2>

          <div className="flex flex-col gap-3">
            {devoirGroups.map(g => {
              const doneCount = g.tasks.filter(t => subScores[t.id] != null).length
              const scored = g.tasks.map(t => subScores[t.id]).filter((s): s is number => s != null)
              const avg = scored.length ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length) : null
              return (
                <div key={g.order} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-800 truncate">
                      Devoir {g.order}{g.title ? <span className="font-normal text-gray-400"> · {g.title}</span> : null}
                    </span>
                    <span className="text-xs shrink-0">
                      {avg != null
                        ? <span className={`font-bold px-2 py-0.5 rounded ${avg >= 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{avg}%</span>
                        : <span className="text-gray-400">{doneCount}/{g.tasks.length} fait</span>}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {g.tasks.map(a => {
                      const score = subScores[a.id]
                      const done = score != null
                      return (
                        <button
                          key={a.id}
                          onClick={() => setOpenAssignment(a)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50/40 transition-colors text-left"
                        >
                          <span className="text-lg shrink-0">{SKILL_EMOJI[a.skill]}</span>
                          <span className="flex-1 text-sm text-gray-700">{SKILL_LABELS[a.skill]}</span>
                          {done ? (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${score >= 70 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{score}%</span>
                          ) : (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded shrink-0 bg-blue-50 text-blue-600">À faire</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Ad-hoc teacher assignments without a lesson group */}
          {looseDevoirs.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {looseDevoirs.map(a => {
                const score = subScores[a.id]
                const done = score != null
                return (
                  <button
                    key={a.id}
                    onClick={() => setOpenAssignment(a)}
                    className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-green-300 transition-colors text-left"
                  >
                    <span className="text-xl shrink-0">{SKILL_EMOJI[a.skill]}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-gray-800 truncate" dir="ltr">{a.title}</span>
                      <span className="block text-xs text-gray-400">{SKILL_LABELS[a.skill]}</span>
                    </span>
                    {done
                      ? <span className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 ${score >= 70 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{score}%</span>
                      : <span className="text-xs font-semibold px-2 py-1 rounded-md shrink-0 bg-blue-50 text-blue-600">À faire</span>}
                  </button>
                )
              })}
            </div>
          )}
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
