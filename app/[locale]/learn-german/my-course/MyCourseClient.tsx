'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase-browser'
import { getLevel } from '@/lib/german-data'
import { collectLevelVocab } from '@/lib/learn-german/vocab'
import { SKILL_LABELS } from '@/lib/learn-german/assignmentAI'
import { callWindowState, type ClassWindow } from '@/lib/classSchedule'
import { accessDaysLeft, formatAccessDate } from '@/lib/courseAccess'
import { courseWeek, weekLessonRange } from '@/lib/coursePacing'
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

function Bar({ label, value, sub, emoji }: { label: string; value: number | null; sub?: string; emoji: string }) {
  const v = value == null ? 0 : Math.round(value)
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-600">{emoji} {label}{sub ? <span className="text-gray-300"> · {sub}</span> : null}</span>
        <span className="font-semibold text-gray-700">{value == null ? '—' : `${v}%`}</span>
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
  accessUntil,
  groupStartDate,
}: {
  locale: string
  levelId: string
  groupId: string | null
  groupLabel: string | null
  displayName: string
  isTeacher: boolean
  callUrl: string | null
  classWindow: ClassWindow | null
  accessUntil: string | null
  groupStartDate: string | null
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
  const allDone = lessons.length > 0 && completed.size === lessons.length

  // Cohort pacing (soft): the group's start_date anchors "Semaine N" and this
  // week's lesson window. Future lessons are dimmed, never locked.
  const week = courseWeek(groupStartDate)
  const paced = week != null && week >= 1
  const [weekLo, weekHi] = paced ? weekLessonRange(week!) : [0, Number.POSITIVE_INFINITY]

  // ── Note (quality) ── graded ONLY on work the student has actually done:
  // attempted lessons (best score) + submitted devoirs. Syllabus coverage is
  // tracked separately as "progression" below, so a student early in the course
  // isn't scored as if they'd failed everything they simply haven't reached yet.
  const attemptedLessons = lessons.filter(l => scores[l.id]?.best != null)
  const lessonQuality = attemptedLessons.length
    ? attemptedLessons.reduce((sum, l) => sum + (scores[l.id]?.best ?? 0), 0) / attemptedLessons.length
    : null
  const doneDevoirs = assignments.filter(a => subScores[a.id] != null)
  const devoirQuality = doneDevoirs.length
    ? doneDevoirs.reduce((sum, a) => sum + (subScores[a.id] ?? 0), 0) / doneDevoirs.length
    : null

  // Blend whichever quality components have data (lessons 60 / devoirs 40 when both).
  const qualityParts = [
    lessonQuality != null ? { value: lessonQuality, weight: 60 } : null,
    devoirQuality != null ? { value: devoirQuality, weight: 40 } : null,
  ].filter((p): p is { value: number; weight: number } => p != null)
  const grade = qualityParts.length
    ? Math.round(
        qualityParts.reduce((s, p) => s + p.value * p.weight, 0) /
        qualityParts.reduce((s, p) => s + p.weight, 0),
      )
    : null

  // ── Progression (coverage) ── how far through the level, shown apart from the
  // Note. Averages the tracks that exist: lessons completed, vocab learned, and
  // devoirs submitted (devoirs only count once the teacher has posted any).
  const coverageParts = [
    lessons.length ? completed.size / lessons.length : null,
    vocabTotal ? vocab.learnedCount / vocabTotal : null,
    assignments.length ? Object.keys(subScores).length / assignments.length : null,
  ].filter((p): p is number => p != null)
  const progression = coverageParts.length
    ? Math.round((coverageParts.reduce((s, p) => s + p, 0) / coverageParts.length) * 100)
    : 0

  const info = gradeInfo(grade ?? 0)

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
          {week != null && (
            <p className="text-xs text-gray-500 mt-0.5">
              📅 {week === 0 ? `Début le ${formatAccessDate(groupStartDate!)}` : `Semaine ${week}`}
            </p>
          )}
          {accessUntil && !isTeacher && (() => {
            const d = accessDaysLeft(accessUntil)
            const soon = d != null && d <= 7
            return (
              <p className={`text-xs mt-1 ${soon ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                🗓️ Accès jusqu&rsquo;au {formatAccessDate(accessUntil)}{soon && d != null ? ` · ${d} j restants` : ''}
              </p>
            )
          })()}
        </div>
        {callUrl && (
          callOpen ? (
            <a
              href={callUrl}
              target="_blank"
              rel="noreferrer"
              // Fire-and-forget attendance log — must never delay joining.
              onClick={() => { try { fetch('/api/classes/attend', { method: 'POST' }).catch(() => {}) } catch {} }}
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

      {/* Continue card — one obvious next action keeps the weekly loop going:
          the first unpassed lesson, plus how many devoirs are waiting. */}
      {(() => {
        const nextUp = lessons.find(l => !completed.has(l.id))
        const devoirsTodo = assignments.filter(a => subScores[a.id] == null).length
        if (!nextUp && devoirsTodo === 0 && !allDone) return null
        return (
          <div className="bg-green-700 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="text-white min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-green-200 font-semibold">Reprendre</p>
              {nextUp ? (
                <p className="font-bold truncate">Leçon {nextUp.order} · {nextUp.title}</p>
              ) : (
                <p className="font-bold">Toutes les leçons sont validées 🎉</p>
              )}
              {devoirsTodo > 0 && (
                <a href="#devoirs" className="text-xs text-green-100 underline underline-offset-2">
                  📝 {devoirsTodo} devoir{devoirsTodo > 1 ? 's' : ''} à faire
                </a>
              )}
            </div>
            {nextUp ? (
              <Link
                href={`/learn-german/${level.id.toLowerCase()}/${nextUp.id}`}
                className="shrink-0 rounded-lg bg-white text-green-800 hover:bg-green-50 text-sm font-bold px-5 py-2.5"
              >
                Continuer →
              </Link>
            ) : allDone ? (
              <Link
                href="/learn-german/my-course/certificate"
                className="shrink-0 rounded-lg bg-white text-green-800 hover:bg-green-50 text-sm font-bold px-5 py-2.5"
              >
                🎓 Mon certificat
              </Link>
            ) : null}
          </div>
        )
      })()}

      {/* Report card — Note (quality on work rendered) + separate progression */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Overall Note */}
          <div className="flex items-center gap-4 md:w-56 md:flex-col md:text-center md:justify-center md:border-r md:border-gray-100 md:pr-6">
            <div className="relative shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="3"
                  className={info.color} strokeDasharray={`${grade ?? 0} ${100 - (grade ?? 0)}`} strokeLinecap="round" />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-2xl font-black ${info.color}`}>{grade == null ? '—' : grade}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Note</p>
              <p className={`font-bold ${info.color}`}>{info.text}</p>
              {grade != null && <p className="text-[11px] text-gray-400">Note allemande : {info.note}</p>}
            </div>
          </div>

          {/* Quality breakdown + progression */}
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Qualité · sur le travail rendu</p>
            <Bar emoji="📚" label="Leçons" value={lessonQuality} sub={`${attemptedLessons.length}/${lessons.length} faites`} />
            {assignments.length > 0 && (
              <Bar emoji="📝" label="Devoirs" value={devoirQuality} sub={`${doneDevoirs.length}/${assignments.length} rendus`} />
            )}
            {grade == null && (
              <p className="text-xs text-gray-400">Termine une leçon pour débloquer ta note.</p>
            )}

            <div className="pt-3 mt-1 border-t border-gray-100">
              <Bar emoji="📈" label="Progression" value={progression} sub="parcours du niveau" />
              <div className="flex gap-4 text-xs text-gray-400 pt-2 flex-wrap">
                <span>✓ {completed.size}/{lessons.length} leçons</span>
                <span>🧠 {vocab.loaded ? vocab.learnedCount : '…'}/{vocabTotal} mots</span>
                {assignments.length > 0 && <span>📝 {Object.keys(subScores).length}/{assignments.length} devoirs</span>}
              </div>
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
        <div className="mb-8" id="devoirs">
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
                      {paced && g.order >= weekLo && g.order <= weekHi && (
                        <span className="ml-2 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">📅 Cette semaine</span>
                      )}
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
          const thisWeek = paced && lesson.order >= weekLo && lesson.order <= weekHi
          const future = paced && lesson.order > weekHi
          return (
            <Link
              key={lesson.id}
              href={`/learn-german/${level.id.toLowerCase()}/${lesson.id}`}
              className={`flex items-center gap-3 bg-white rounded-xl border px-4 py-3 hover:border-green-300 transition-colors
                ${thisWeek ? 'border-green-300 ring-1 ring-green-100' : 'border-gray-200'} ${future ? 'opacity-60' : ''}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {done ? '✓' : lesson.order}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800 truncate">{lesson.title}</span>
              {thisWeek && (
                <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 shrink-0">
                  📅 Cette semaine
                </span>
              )}
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
