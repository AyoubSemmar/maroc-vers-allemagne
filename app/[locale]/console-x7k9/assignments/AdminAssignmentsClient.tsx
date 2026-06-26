'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { LEVEL_SPECS, SKILLS, SKILL_LABELS, normalizeLevel, type Skill } from '@/lib/learn-german/assignmentAI'

export type AdminAssignment = {
  id: string
  skill: Skill
  level_id: string
  group_id: string | null
  groupLabel: string | null
  title: string
  is_published: boolean
  due_at: string | null
  submissionCount: number
  avgScore: number | null
}
export type RosterRow = {
  email: string
  groupLabel: string
  level: string
  lessonsAttempted: number
  lessonsTotal: number
  wordsLearned: number
  wordsTotal: number
  assignmentsDone: number
  assignmentsTotal: number
  grade: number
}
export type GroupOpt = { id: string; label: string; level: string }
export type SubmissionDetail = {
  userId: string
  email: string
  skill: Skill
  autoScore: number | null
  aiScore: number | null
  teacherScore: number | null
  finalScore: number
  answers: any
  aiFeedback: any
  submittedAt: string | null
}
export type Kpis = { students: number; avgGrade: number; atRisk: number; published: number; submissions: number }

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

// One student's submission, with the actual work + a teacher override.
function SubmissionCard({ s, onOverride }: { s: SubmissionDetail; onOverride: (v: number) => void }) {
  const [val, setVal] = useState<string>(s.teacherScore != null ? String(s.teacherScore) : '')
  const fb = s.aiFeedback
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <span className="font-medium text-gray-800 text-sm" dir="ltr">{s.email}</span>
          {s.submittedAt && <span className="text-xs text-gray-400 ml-2">{s.submittedAt}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {s.autoScore != null && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600">Auto {s.autoScore}%</span>}
          {s.aiScore != null && <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600">IA {s.aiScore}%</span>}
          {s.teacherScore != null && <span className="px-2 py-0.5 rounded bg-green-50 text-green-700">Prof {s.teacherScore}%</span>}
          <span className={`font-bold px-2 py-0.5 rounded ${s.finalScore >= 70 ? 'bg-green-100 text-green-700' : s.finalScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
            {s.finalScore}%
          </span>
        </div>
      </div>

      {/* Schreiben: show what they wrote + the AI correction */}
      {s.skill === 'schreiben' && s.answers?.text && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-[11px] text-gray-400 mb-1">Texte de l’élève</p>
            <p className="text-gray-700" dir="ltr">{s.answers.text}</p>
          </div>
          {fb?.corrected && (
            <div className="bg-green-50 rounded-lg p-2">
              <p className="text-[11px] text-green-600 mb-1">Correction IA{fb.mistakes?.length ? ` · ${fb.mistakes.length} erreurs` : ''}</p>
              <p className="text-green-900" dir="ltr">{fb.corrected}</p>
              {fb.tip && <p className="text-xs text-amber-700 mt-1">💡 {fb.tip}</p>}
            </div>
          )}
        </div>
      )}

      {/* Override */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-400">Note du prof :</span>
        <input
          type="number" min={0} max={100} value={val}
          onChange={e => setVal(e.target.value)}
          className="w-20 border border-gray-300 rounded-lg px-2 py-1 text-sm"
          placeholder="—"
        />
        <button
          onClick={() => val !== '' && onOverride(Number(val))}
          className="text-xs bg-gray-900 text-white rounded-lg px-3 py-1.5 font-semibold"
        >
          Enregistrer
        </button>
        <span className="text-[11px] text-gray-400">remplace la note IA/auto</span>
      </div>
    </div>
  )
}

export default function AdminAssignmentsClient({
  assignments,
  roster,
  groups,
  kpis,
  submissionsByAssignment,
}: {
  assignments: AdminAssignment[]
  roster: RosterRow[]
  groups: GroupOpt[]
  kpis: Kpis
  submissionsByAssignment: Record<string, SubmissionDetail[]>
}) {
  const router = useRouter()
  const supabase = createClient()
  const [expanded, setExpanded] = useState<string | null>(null)

  async function overrideScore(s: SubmissionDetail, assignmentId: string, value: number) {
    const v = Math.max(0, Math.min(100, Math.round(value)))
    await supabase.from('assignment_submissions')
      .update({ teacher_score: v, graded_at: new Date().toISOString() })
      .eq('assignment_id', assignmentId).eq('user_id', s.userId)
    router.refresh()
  }

  const [skill, setSkill] = useState<Skill>('grammar')
  const [level, setLevel] = useState('A1')
  const [groupId, setGroupId] = useState('')         // '' = whole level
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [instructions, setInstructions] = useState('')
  const [due, setDue] = useState('')

  const [preview, setPreview] = useState<any>(null)   // generated {title,instructions,content,answer_key}
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const isMcq = skill !== 'schreiben'
  const groupChoices = useMemo(() => groups.filter(g => g.level === level), [groups, level])

  async function generate() {
    setBusy(true); setMsg(null); setPreview(null)
    try {
      const res = await fetch('/api/admin/assignments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill, level, topic: topic || undefined, locale: 'fr' }),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Échec de la génération.'); return }
      setPreview(data)
      setTitle(data.title || '')
      setInstructions(data.instructions || '')
    } catch { setMsg('Erreur réseau.') }
    finally { setBusy(false) }
  }

  async function publish() {
    setBusy(true); setMsg(null)
    try {
      const spec = LEVEL_SPECS[normalizeLevel(level)]
      const row: any = {
        skill,
        level_id: level,
        group_id: groupId || null,
        title: title || (isMcq ? preview?.title : 'Schreiben'),
        instructions: instructions || null,
        due_at: due ? new Date(due).toISOString() : null,
        is_published: true,
      }
      if (isMcq) {
        if (!preview) { setMsg('Génère d’abord l’exercice.'); setBusy(false); return }
        row.content = preview.content
        row.answer_key = preview.answer_key
      } else {
        row.content = { minWords: spec.minWords, maxWords: spec.maxWords }
      }
      const { error } = await supabase.from('assignments').insert(row)
      if (error) { setMsg(error.message); return }
      // Reset + refresh.
      setPreview(null); setTopic(''); setTitle(''); setInstructions(''); setDue('')
      router.refresh()
    } catch (e: any) { setMsg(e?.message || 'Erreur.') }
    finally { setBusy(false) }
  }

  async function togglePublish(a: AdminAssignment) {
    await supabase.from('assignments').update({ is_published: !a.is_published }).eq('id', a.id)
    router.refresh()
  }
  async function remove(a: AdminAssignment) {
    if (!confirm(`Supprimer « ${a.title} » et toutes ses soumissions ?`)) return
    await supabase.from('assignments').delete().eq('id', a.id)
    router.refresh()
  }

  const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm'

  const kpiCards = [
    { label: 'Élèves', value: kpis.students, sub: 'inscrits' },
    { label: 'Note moyenne', value: kpis.avgGrade, sub: '/100 sur la classe' },
    { label: 'À risque', value: kpis.atRisk, sub: 'note < 50', danger: kpis.atRisk > 0 },
    { label: 'Devoirs publiés', value: kpis.published, sub: `${kpis.submissions} soumissions` },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className={`text-3xl font-black ${k.danger ? 'text-red-600' : 'text-gray-900'}`}>{k.value}</p>
            <p className="text-xs text-gray-400">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Create ── */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-4">➕ Nouvel exercice</h2>

        <div className="flex flex-wrap gap-3 mb-3">
          <select value={skill} onChange={e => { setSkill(e.target.value as Skill); setPreview(null) }} className={inputCls}>
            {SKILLS.map(s => <option key={s} value={s}>{SKILL_LABELS[s]}</option>)}
          </select>
          <select value={level} onChange={e => { setLevel(e.target.value); setGroupId(''); setPreview(null) }} className={inputCls}>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={groupId} onChange={e => setGroupId(e.target.value)} className={inputCls}>
            <option value="">Tout le niveau {level}</option>
            {groupChoices.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          <input type="date" value={due} onChange={e => setDue(e.target.value)} className={inputCls} title="Échéance (optionnel)" />
        </div>

        {isMcq ? (
          <div className="flex flex-col gap-3">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder={skill === 'grammar' ? 'Sujet grammatical (ex. Akkusativ, Perfekt) — optionnel' : 'Thème (ex. les vacances) — optionnel'}
              className={`${inputCls} w-full`}
            />
            <button onClick={generate} disabled={busy} className="bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 w-fit">
              {busy ? 'Génération…' : '✨ Générer l’exercice'}
            </button>

            {preview && (
              <div className="border border-green-200 bg-green-50/50 rounded-xl p-4 mt-1">
                <input value={title} onChange={e => setTitle(e.target.value)} className={`${inputCls} w-full mb-2 font-semibold`} dir="ltr" />
                {preview.content?.text && (
                  <p className="text-xs text-gray-600 bg-white rounded-lg p-2 mb-2 max-h-32 overflow-y-auto" dir="ltr">{preview.content.text}</p>
                )}
                <p className="text-xs text-gray-500 mb-3">{preview.content?.questions?.length ?? 0} questions générées · les réponses sont masquées aux élèves.</p>
                <button onClick={publish} disabled={busy} className="bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40">
                  Publier
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre (ex. Mein Wochenende)" className={`${inputCls} w-full`} dir="ltr" />
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={3}
              placeholder="Consigne en allemand (ex. Schreiben Sie über Ihr letztes Wochenende…)"
              className={`${inputCls} w-full`}
              dir="ltr"
            />
            <p className="text-xs text-gray-500">Objectif : {LEVEL_SPECS[normalizeLevel(level)].minWords}–{LEVEL_SPECS[normalizeLevel(level)].maxWords} mots · corrigé par l’IA.</p>
            <button onClick={publish} disabled={busy || !instructions} className="bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 w-fit">
              Publier
            </button>
          </div>
        )}

        {msg && <p className="text-sm text-red-600 mt-3">{msg}</p>}
      </section>

      {/* ── Assignments list ── */}
      <section>
        <h2 className="font-bold text-gray-900 mb-3">Exercices ({assignments.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-400 border-b border-gray-200">
              <tr>
                <th className="py-2 pr-3">Titre</th>
                <th className="py-2 px-3">Skill</th>
                <th className="py-2 px-3">Niveau</th>
                <th className="py-2 px-3">Groupe</th>
                <th className="py-2 px-3">Soumis</th>
                <th className="py-2 px-3">Moy.</th>
                <th className="py-2 px-3">État</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => {
                const subs = submissionsByAssignment[a.id] ?? []
                const isOpen = expanded === a.id
                return (
                  <React.Fragment key={a.id}>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-3">
                        <button onClick={() => setExpanded(isOpen ? null : a.id)} className="font-medium text-gray-800 hover:text-green-700 text-left" dir="ltr">
                          <span className="text-gray-400 mr-1">{isOpen ? '▾' : '▸'}</span>{a.title}
                        </button>
                      </td>
                      <td className="py-2 px-3">{SKILL_LABELS[a.skill]}</td>
                      <td className="py-2 px-3">{a.level_id}</td>
                      <td className="py-2 px-3 text-gray-500">{a.groupLabel ?? '—'}</td>
                      <td className="py-2 px-3">{a.submissionCount}</td>
                      <td className="py-2 px-3 font-semibold">{a.avgScore != null ? `${a.avgScore}%` : '—'}</td>
                      <td className="py-2 px-3">
                        <button onClick={() => togglePublish(a)} className={`text-xs px-2 py-1 rounded-md ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {a.is_published ? 'Publié' : 'Brouillon'}
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <button onClick={() => remove(a)} className="text-xs text-red-500 hover:underline">Suppr.</button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <td colSpan={8} className="px-4 py-3">
                          {subs.length === 0 ? (
                            <p className="text-sm text-gray-400">Aucune soumission pour l’instant.</p>
                          ) : (
                            <div className="flex flex-col gap-3">
                              {subs.map(s => (
                                <SubmissionCard key={s.userId} s={s} onOverride={(v) => overrideScore(s, a.id, v)} />
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
              {assignments.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-gray-400">Aucun exercice.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Roster / gradebook ── */}
      <section>
        <h2 className="font-bold text-gray-900 mb-3">Carnet de notes ({roster.length} élèves) · les plus faibles en premier</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-400 border-b border-gray-200">
              <tr>
                <th className="py-2 pr-3">Élève</th>
                <th className="py-2 px-3">Groupe</th>
                <th className="py-2 px-3">Leçons</th>
                <th className="py-2 px-3">Mots</th>
                <th className="py-2 px-3">Devoirs</th>
                <th className="py-2 px-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-3 text-gray-800" dir="ltr">{r.email}</td>
                  <td className="py-2 px-3 text-gray-500">{r.groupLabel}</td>
                  <td className="py-2 px-3">{r.lessonsAttempted}/{r.lessonsTotal}</td>
                  <td className="py-2 px-3">{r.wordsLearned}/{r.wordsTotal}</td>
                  <td className="py-2 px-3">{r.assignmentsDone}/{r.assignmentsTotal}</td>
                  <td className="py-2 px-3">
                    <span className={`font-bold px-2 py-0.5 rounded-md ${r.grade >= 70 ? 'bg-green-100 text-green-700' : r.grade >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                      {r.grade}
                    </span>
                  </td>
                </tr>
              ))}
              {roster.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-gray-400">Aucun élève inscrit.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
