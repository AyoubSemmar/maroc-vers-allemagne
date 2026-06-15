'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  SPRINTS,
  PERSONS,
  ROLE_COLOR,
  STATUSES,
  KICONNECT_ENDPOINT,
  KICONNECT_MODELS_ENDPOINT,
  KICONNECT_DEFAULT_MODEL,
  KICONNECT_FALLBACK_MODEL,
  KICONNECT_KEY_BY_PERSON,
  type Person,
  type Status,
  type Task,
} from '@/lib/studybuddy/tasks'

type StatusRow = {
  task_id: string
  status: Status
  updated_by: string | null
  updated_at: string
}

const TABLE = 'studybuddy_task_status'
const LS_ME      = 'studybuddy.me'
const LS_FILTER  = 'studybuddy.filter'
const LS_SPRINT  = 'studybuddy.sprint'

type FilterKey = 'all' | Person

function formatRelative(iso: string): string {
  const then = new Date(iso)
  const now  = new Date()
  const sameDay =
    then.getFullYear() === now.getFullYear() &&
    then.getMonth() === now.getMonth() &&
    then.getDate() === now.getDate()
  const hh = then.getHours().toString().padStart(2, '0')
  const mm = then.getMinutes().toString().padStart(2, '0')
  if (sameDay) return `heute ${hh}:${mm}`
  const diffMs = now.getTime() - then.getTime()
  const dayMs = 1000 * 60 * 60 * 24
  if (diffMs < 2 * dayMs && diffMs > 0) return `gestern ${hh}:${mm}`
  const dd = then.getDate().toString().padStart(2, '0')
  const mo = (then.getMonth() + 1).toString().padStart(2, '0')
  return `${dd}.${mo} ${hh}:${mm}`
}

export default function StudybuddyTracker() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (supabaseRef.current === null && typeof window !== 'undefined') {
    supabaseRef.current = createClient()
  }

  const [statuses, setStatuses] = useState<Map<string, StatusRow>>(new Map())
  const [me, setMe] = useState<string>('')
  const [sprintIndex, setSprintIndex] = useState<number>(0)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [live, setLive] = useState<boolean>(false)
  const [hydrated, setHydrated] = useState<boolean>(false)
  const [promptTask, setPromptTask] = useState<Task | null>(null)

  useEffect(() => {
    try {
      const savedMe = localStorage.getItem(LS_ME) ?? ''
      const savedFilter = (localStorage.getItem(LS_FILTER) as FilterKey | null) ?? 'all'
      const savedSprint = Number(localStorage.getItem(LS_SPRINT) || '1')
      setMe(savedMe)
      setFilter(savedFilter)
      const idx = Math.max(0, Math.min(SPRINTS.length - 1, savedSprint - 1))
      setSprintIndex(idx)
    } catch {/* private mode or quota — ignore */}
    setHydrated(true)
  }, [])

  useEffect(() => {
    const sb = supabaseRef.current
    if (!sb) return
    let cancelled = false

    sb.from(TABLE).select('*').then(({ data }) => {
      if (cancelled || !data) return
      const next = new Map<string, StatusRow>()
      for (const row of data as StatusRow[]) next.set(row.task_id, row)
      setStatuses(next)
    })

    const channel = sb
      .channel('studybuddy-status')
      .on(
        // @ts-expect-error supabase-js type for postgres_changes event is too narrow
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE },
        (payload: { new: StatusRow | null; old: StatusRow | null; eventType: string }) => {
          setStatuses(prev => {
            const next = new Map(prev)
            if (payload.eventType === 'DELETE' && payload.old?.task_id) {
              next.delete(payload.old.task_id)
            } else if (payload.new?.task_id) {
              next.set(payload.new.task_id, payload.new)
            }
            return next
          })
        },
      )
      .subscribe(status => {
        setLive(status === 'SUBSCRIBED')
      })

    return () => {
      cancelled = true
      sb.removeChannel(channel)
    }
  }, [])

  // Close prompt modal with Escape.
  useEffect(() => {
    if (!promptTask) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setPromptTask(null) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [promptTask])

  function selectMe(name: string) {
    setMe(name)
    try { localStorage.setItem(LS_ME, name) } catch {}
  }
  function selectFilter(f: FilterKey) {
    setFilter(f)
    try { localStorage.setItem(LS_FILTER, f) } catch {}
  }
  function selectSprintIndex(idx: number) {
    setSprintIndex(idx)
    try { localStorage.setItem(LS_SPRINT, String(idx + 1)) } catch {}
  }

  const sprint = SPRINTS[sprintIndex]

  const setStatusFor = useCallback(async (task: Task, next: Status) => {
    if (!me) {
      alert('Bitte zuerst deinen Namen oben auswählen.')
      return
    }
    const sb = supabaseRef.current
    if (!sb) return

    const prev = statuses.get(task.id)
    const optimistic: StatusRow = {
      task_id: task.id,
      status: next,
      updated_by: me,
      updated_at: new Date().toISOString(),
    }
    setStatuses(m => new Map(m).set(task.id, optimistic))

    const { error } = await sb
      .from(TABLE)
      .upsert(
        { task_id: task.id, status: next, updated_by: me, updated_at: optimistic.updated_at },
        { onConflict: 'task_id' },
      )
    if (error) {
      console.error('[studybuddy] upsert failed', error)
      alert('Konnte den Status nicht speichern. Bitte erneut versuchen.')
      setStatuses(m => {
        const rolled = new Map(m)
        if (prev) rolled.set(task.id, prev)
        else rolled.delete(task.id)
        return rolled
      })
    }
  }, [me, statuses])

  const visibleTasks = useMemo(() => {
    if (filter === 'all') return sprint.tasks
    return sprint.tasks.filter(t => t.who === filter)
  }, [sprint, filter])

  // Tasks grouped by Welle (1..8). Each Welle is a parallel work-front;
  // tasks within a Welle can be done concurrently, the next Welle is
  // unlocked once all blockers in earlier Wellen are done.
  const byWelle = useMemo(() => {
    const groups = new Map<number, Task[]>()
    for (const t of visibleTasks) {
      const arr = groups.get(t.welle) ?? []
      arr.push(t)
      groups.set(t.welle, arr)
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a - b)
  }, [visibleTasks])

  // For each task: are all its prereqs done? Used to dim/unlock cards.
  // Computed against the full sprint (not just visibleTasks) so the
  // filter doesn't fake-unlock tasks whose prereqs are filtered out.
  const isUnlocked = useCallback((task: Task) => {
    if (!task.prereqs.length) return true
    return task.prereqs.every(num => {
      const dep = sprint.tasks.find(t => t.taskNum === num)
      if (!dep) return true
      return (statuses.get(dep.id)?.status ?? 'todo') === 'done'
    })
  }, [sprint, statuses])

  const counts = useMemo(() => {
    const c = { todo: 0, wip: 0, help: 0, done: 0, total: visibleTasks.length }
    for (const t of visibleTasks) {
      const s = statuses.get(t.id)?.status ?? 'todo'
      c[s] += 1
    }
    return c
  }, [visibleTasks, statuses])

  const pct = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0

  if (!hydrated) {
    return <div className="sb-root sb-loading">…</div>
  }

  return (
    <div className="sb-root">
      {/* ============ HEADER ============ */}
      <header className="sb-header">
        <div className="sb-header-inner">
          <div className="sb-brand">
            Study<i>Buddy</i>
            <span className="sb-brand-sub">Sprint Tracker</span>
          </div>
          <div className="sb-header-controls">
            <label className="sb-me">
              <span>Ich bin:</span>
              <select value={me} onChange={e => selectMe(e.target.value)} aria-label="Ich bin">
                <option value="">— wählen —</option>
                {PERSONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <span className={`sb-live ${live ? 'sb-live--on' : 'sb-live--off'}`} aria-live="polite">
              <span className="sb-live-dot" /> {live ? 'live' : 'offline'}
            </span>
          </div>
        </div>
        <nav className="sb-sprint-tabs" aria-label="Sprint">
          {SPRINTS.map((s, i) => (
            <button
              key={s.num}
              type="button"
              className={`sb-sprint-tab ${i === sprintIndex ? 'is-active' : ''}`}
              onClick={() => selectSprintIndex(i)}
            >
              <span className="sb-sprint-num">Sprint {s.num}</span>
              <span className="sb-sprint-month">{s.month}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* ============ KI CONNECT BANNER ============ */}
      <KiConnectBanner me={me} />

      {/* ============ SUMMARY BAR ============ */}
      <div className="sb-summary">
        <div className="sb-summary-inner">
          <div className="sb-summary-cells">
            <SummaryCell label="Noch nicht"    count={counts.todo} color="#6f6a5e" />
            <SummaryCell label="In Arbeit"     count={counts.wip}  color="#d6a635" />
            <SummaryCell label="Brauche Hilfe" count={counts.help} color="#b8533a" />
            <SummaryCell label="Erledigt"      count={counts.done} color="#2f8f6e" />
          </div>
          <div className="sb-progress">
            <div className="sb-progress-bar">
              <div className="sb-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="sb-progress-num">{pct}% · {counts.done}/{counts.total}</div>
          </div>
        </div>
      </div>

      {/* ============ FILTER PILLS ============ */}
      <div className="sb-filter">
        <div className="sb-filter-inner">
          <FilterPill active={filter === 'all'} onClick={() => selectFilter('all')}>Alle</FilterPill>
          {PERSONS.map(p => (
            <FilterPill key={p} active={filter === p} onClick={() => selectFilter(p)}>{p}</FilterPill>
          ))}
        </div>
      </div>

      {/* ============ SPRINT HEADER ============ */}
      <section className="sb-sprint-head">
        <div className="sb-sprint-head-inner">
          <div className="sb-sprint-meta">
            <span className="sb-sprint-tag">Sprint {sprint.num} · {sprint.month}</span>
            <h1 className="sb-sprint-title">{sprint.title}</h1>
            <p className="sb-sprint-subtitle">{sprint.subtitle}</p>
          </div>
          <div className="sb-dod">
            <span className="sb-dod-label">Definition of Done</span>
            <p>{sprint.dod}</p>
          </div>
        </div>
      </section>

      {/* ============ WELLEN ============ */}
      <main className="sb-weeks">
        {byWelle.map(([welle, tasks]) => {
          const done = tasks.filter(t => (statuses.get(t.id)?.status ?? 'todo') === 'done').length
          return (
            <section key={welle} className="sb-week">
              <header className="sb-week-head">
                <h2 className="sb-week-title">Welle {welle}</h2>
                <span className="sb-week-count">{done} / {tasks.length} erledigt</span>
              </header>
              <div className="sb-cards">
                {tasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    row={statuses.get(t.id) ?? null}
                    unlocked={isUnlocked(t)}
                    onChange={status => setStatusFor(t, status)}
                    onShowPrompt={() => setPromptTask(t)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>

      {/* ============ PROMPT MODAL ============ */}
      {promptTask && (
        <PromptModal task={promptTask} onClose={() => setPromptTask(null)} />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
function KiConnectBanner({ me }: { me: string }) {
  const myKey = me && (me in KICONNECT_KEY_BY_PERSON)
    ? KICONNECT_KEY_BY_PERSON[me as Person]
    : null
  return (
    <aside className="sb-ki-banner" aria-label="KI Connect Zugang">
      <div className="sb-ki-banner-inner">
        <div className="sb-ki-banner-text">
          <strong>KI Connect (HS NRW)</strong>{' '}
          ersetzt unsere Anthropic-Pläne. Endpoint:{' '}
          <a href={KICONNECT_ENDPOINT} target="_blank" rel="noopener noreferrer">{KICONNECT_ENDPOINT}</a>
        </div>
        <div className="sb-ki-banner-model">
          Modell: <b>{KICONNECT_DEFAULT_MODEL}</b> (Standard) · <b>{KICONNECT_FALLBACK_MODEL}</b> (Massen-Aufrufe).
          {' '}Bestätigen via{' '}
          <a href={KICONNECT_MODELS_ENDPOINT} target="_blank" rel="noopener noreferrer">GET /v1/models</a>.
        </div>
        <div className="sb-ki-banner-keys">
          {PERSONS.map(p => {
            const n = KICONNECT_KEY_BY_PERSON[p]
            const mine = p === me
            return (
              <span key={p} className={`sb-ki-key ${mine ? 'is-mine' : ''}`}>
                <b>{p}</b> → Key {n}
              </span>
            )
          })}
        </div>
        {myKey !== null && (
          <div className="sb-ki-banner-mine">Du benutzt Key {myKey}. Hol ihn aus dem Bitwarden-Tresor und setze ihn als <code>OPENAI_API_KEY</code>.</div>
        )}
      </div>
    </aside>
  )
}

function SummaryCell({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="sb-summary-cell">
      <span className="sb-summary-dot" style={{ background: color }} />
      <span className="sb-summary-label">{label}</span>
      <span className="sb-summary-count">{count}</span>
    </div>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sb-pill ${active ? 'is-active' : ''}`}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

function TaskCard({
  task,
  row,
  unlocked,
  onChange,
  onShowPrompt,
}: {
  task: Task
  row: StatusRow | null
  unlocked: boolean
  onChange: (s: Status) => void
  onShowPrompt: () => void
}) {
  const status: Status = row?.status ?? 'todo'
  return (
    <article className={`sb-card ${unlocked ? '' : 'is-locked'}`} data-status={status}>
      <header className="sb-card-head">
        <div className="sb-card-who">
          <span className="sb-card-id">#{task.taskNum}</span>
          <span className="sb-card-name">{task.who}</span>
          <span
            className="sb-card-role"
            style={{ background: ROLE_COLOR[task.role] }}
          >
            {task.role}
          </span>
          {task.blocker && <span className="sb-card-blocker" title={task.priorityInfo}>BLOCKER</span>}
        </div>
        {row?.updated_by && row?.updated_at && (
          <small className="sb-card-meta">
            zuletzt geändert von {row.updated_by} · {formatRelative(row.updated_at)}
          </small>
        )}
      </header>

      <p className="sb-card-text">{task.title}</p>

      {task.prereqs.length > 0 && (
        <div className="sb-card-prereqs" title={unlocked ? 'Alle Voraussetzungen erfüllt' : 'Wartet auf Voraussetzungen'}>
          <span className="sb-card-prereqs-label">Voraussetzung:</span>
          {task.prereqs.map(n => (
            <span key={n} className="sb-card-prereq">#{n}</span>
          ))}
          {!unlocked && <span className="sb-card-locked-tag">🔒 noch blockiert</span>}
        </div>
      )}

      {task.erfolg && (
        <div className="sb-card-success">
          <span className="sb-card-success-label">Erfolg:</span> {task.erfolg}
        </div>
      )}

      <button type="button" onClick={onShowPrompt} className="sb-card-prompt-btn">
        📋 Prompt anzeigen
      </button>

      <div className="sb-card-actions" role="group" aria-label="Status setzen">
        {STATUSES.map(s => (
          <button
            key={s.key}
            type="button"
            onClick={() => onChange(s.key)}
            className={`sb-status-btn ${status === s.key ? 'is-active' : ''}`}
            data-status={s.key}
            aria-pressed={status === s.key}
            title={s.label}
          >
            <span className="sb-status-emoji" aria-hidden>{s.emoji}</span>
            <span className="sb-status-label">{s.label}</span>
          </button>
        ))}
      </div>
    </article>
  )
}

function PromptModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(task.prompt).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1500) },
      () => { alert('Kopieren fehlgeschlagen — bitte manuell markieren und kopieren.') },
    )
  }

  return (
    <div className="sb-modal-backdrop" onClick={onClose}>
      <div className="sb-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="sb-modal-head">
          <div>
            <div className="sb-modal-meta">
              <span>S{task.sprintNum}·#{task.taskNum}</span>
              <span>Welle {task.welle}</span>
              <span>{task.who}</span>
              <span className="sb-card-role" style={{ background: ROLE_COLOR[task.role] }}>{task.role}</span>
            </div>
            <h3>{task.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Schließen" className="sb-modal-close">✕</button>
        </header>
        <div className="sb-modal-body">
          {task.bullets.length > 0 && (
            <section>
              <h4>Was du brauchst</h4>
              <ul>
                {task.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </section>
          )}
          {task.erfolg && (
            <section>
              <h4>Erfolgskriterium</h4>
              <p>{task.erfolg}</p>
            </section>
          )}
          <section>
            <div className="sb-modal-prompt-head">
              <h4>Prompt für Claude Code</h4>
              <button type="button" onClick={copy} className="sb-modal-copy">
                {copied ? '✓ Kopiert' : '📋 Kopieren'}
              </button>
            </div>
            <pre className="sb-modal-prompt">{task.prompt}</pre>
          </section>
        </div>
      </div>
    </div>
  )
}
