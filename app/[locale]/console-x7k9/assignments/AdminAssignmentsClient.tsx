'use client'

import { useState } from 'react'

export type ExerciseResult = {
  assignmentId: string
  title: string
  skill: string
  done: boolean
  score: number | null
  submittedAt: string | null
}

export type StudentRow = {
  userId: string
  email: string
  bookedAt: string | null
  lessonsDone: number
  lessonsTotal: number
  wordsLearned: number
  wordsTotal: number
  exercisesDone: number
  exercisesTotal: number
  grade: number
  exercises: ExerciseResult[]
}

export type GroupBlock = {
  id: string
  label: string
  level: string
  students: StudentRow[]
}

function gradeColor(g: number) {
  return g >= 70 ? 'var(--adm-green)' : g >= 50 ? 'var(--adm-gold)' : 'var(--adm-red)'
}

/** A small "done/total" progress chip. */
function Count({ done, total, label }: { done: number; total: number; label: string }) {
  const complete = total > 0 && done >= total
  return (
    <span
      title={`${label}: ${done}/${total}`}
      style={{
        display: 'inline-flex', alignItems: 'baseline', gap: 4,
        fontSize: 12.5, color: 'var(--adm-ink-soft)', whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontWeight: 800, color: complete ? 'var(--adm-green)' : 'var(--adm-ink)' }}>{done}</span>
      <span style={{ color: 'var(--adm-ink-mute)' }}>/{total}</span>
      <span style={{ color: 'var(--adm-ink-mute)' }}>{label}</span>
    </span>
  )
}

function ExerciseList({ exercises }: { exercises: ExerciseResult[] }) {
  if (exercises.length === 0) {
    return <p style={{ fontSize: 13, color: 'var(--adm-ink-mute)', margin: '4px 0 0' }}>Aucun exercice publié pour ce niveau.</p>
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
      {exercises.map(e => (
        <div
          key={e.assignmentId}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '8px 12px', borderRadius: 8,
            background: 'var(--adm-bg-elev)',
            border: '1px solid var(--adm-line)',
            opacity: e.done ? 1 : 0.55,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--adm-ink)' }}>
              <span style={{ color: 'var(--adm-brand)', marginInlineEnd: 6 }}>{e.skill}</span>
              <span style={{ color: 'var(--adm-ink-soft)', fontWeight: 500 }}>{e.title}</span>
            </div>
            {e.submittedAt && (
              <div style={{ fontSize: 11, color: 'var(--adm-ink-mute)', marginTop: 2 }}>rendu {e.submittedAt}</div>
            )}
          </div>
          {e.done ? (
            <span
              style={{
                flex: 'none', fontSize: 13, fontWeight: 900, minWidth: 58, textAlign: 'center',
                padding: '3px 10px', borderRadius: 999,
                color: gradeColor(e.score ?? 0),
                background: `color-mix(in srgb, ${gradeColor(e.score ?? 0)} 15%, transparent)`,
                border: `1px solid color-mix(in srgb, ${gradeColor(e.score ?? 0)} 35%, transparent)`,
              }}
            >
              {e.score}/100
            </span>
          ) : (
            <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 700, color: 'var(--adm-ink-mute)' }}>à faire</span>
          )}
        </div>
      ))}
    </div>
  )
}

function StudentRowView({ student }: { student: StudentRow }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: '1px solid var(--adm-line)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          padding: '12px 14px', background: 'none', border: 0, cursor: 'pointer',
          textAlign: 'left', color: 'var(--adm-ink)', font: 'inherit',
        }}
      >
        <span style={{ color: 'var(--adm-ink-mute)', transition: 'transform .15s', transform: open ? 'rotate(90deg)' : 'none', flex: 'none' }}>▸</span>
        <span style={{ fontSize: 14, fontWeight: 700, flex: 1, minWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.email}</span>
        <span style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <Count done={student.lessonsDone} total={student.lessonsTotal} label="leçons" />
          <Count done={student.wordsLearned} total={student.wordsTotal} label="mots" />
          <Count done={student.exercisesDone} total={student.exercisesTotal} label="exos" />
        </span>
        <span
          title="Note globale"
          style={{
            flex: 'none', fontSize: 13, fontWeight: 900, minWidth: 52, textAlign: 'center',
            padding: '3px 10px', borderRadius: 999,
            color: gradeColor(student.grade),
            background: `color-mix(in srgb, ${gradeColor(student.grade)} 15%, transparent)`,
            border: `1px solid color-mix(in srgb, ${gradeColor(student.grade)} 35%, transparent)`,
          }}
        >
          {student.grade}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px 34px' }}>
          <ExerciseList exercises={student.exercises} />
        </div>
      )}
    </div>
  )
}

function GroupBlockView({ group }: { group: GroupBlock }) {
  const [open, setOpen] = useState(false)
  const graded = group.students.filter(s => s.exercisesDone > 0 || s.lessonsDone > 0)
  const avg = graded.length ? Math.round(graded.reduce((s, r) => s + r.grade, 0) / graded.length) : null

  return (
    <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          padding: '16px 18px', background: 'none', border: 0, cursor: 'pointer',
          textAlign: 'left', color: 'var(--adm-ink)', font: 'inherit',
        }}
      >
        <span style={{ color: 'var(--adm-ink-mute)', transition: 'transform .15s', transform: open ? 'rotate(90deg)' : 'none', flex: 'none' }}>▸</span>
        <strong style={{ fontSize: 15.5, flex: 1, minWidth: 140 }}>{group.label}</strong>
        <span className="adm-pill adm-pill--brand">{group.level}</span>
        <span style={{ fontSize: 13, color: 'var(--adm-ink-soft)' }}>
          {group.students.length} élève{group.students.length !== 1 ? 's' : ''}
        </span>
        {avg != null && (
          <span style={{ fontSize: 12.5, color: 'var(--adm-ink-mute)' }}>
            moy. <strong style={{ color: gradeColor(avg) }}>{avg}</strong>
          </span>
        )}
      </button>
      {open && (
        group.students.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--adm-ink-mute)', margin: 0, padding: '0 18px 16px 44px' }}>
            Aucun élève inscrit dans ce groupe.
          </p>
        ) : (
          <div>{group.students.map(s => <StudentRowView key={s.userId} student={s} />)}</div>
        )
      )}
    </div>
  )
}

export default function AdminAssignmentsClient({ groups, totalStudents }: { groups: GroupBlock[]; totalStudents: number }) {
  const withStudents = groups.filter(g => g.students.length > 0)
  const empty = groups.filter(g => g.students.length === 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 13, color: 'var(--adm-ink-mute)', margin: '0 0 4px' }}>
        {totalStudents} élève{totalStudents !== 1 ? 's' : ''} inscrit{totalStudents !== 1 ? 's' : ''} · {withStudents.length} groupe{withStudents.length !== 1 ? 's' : ''} actif{withStudents.length !== 1 ? 's' : ''}
      </p>
      {withStudents.map(g => <GroupBlockView key={g.id} group={g} />)}
      {empty.length > 0 && (
        <details style={{ marginTop: 4 }}>
          <summary style={{ fontSize: 12.5, color: 'var(--adm-ink-mute)', cursor: 'pointer' }}>
            {empty.length} groupe{empty.length !== 1 ? 's' : ''} sans élève
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
            {empty.map(g => <GroupBlockView key={g.id} group={g} />)}
          </div>
        </details>
      )}
    </div>
  )
}
