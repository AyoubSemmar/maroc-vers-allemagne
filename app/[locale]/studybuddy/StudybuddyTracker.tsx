'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  SPRINTS,
  PERSONS,
  ROLE_COLOR,
  STATUSES,
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
  // Hold the Supabase client across renders. Created lazily so SSR
  // doesn't run the browser-only setup.
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

  // Hydrate persisted UI prefs from localStorage on mount.
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

  // Initial fetch + realtime subscription.
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

  // Persistence helpers.
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

  // Status mutation with optimistic UI + rollback on error.
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

  // Filter the current sprint's tasks by the filter pill.
  const visibleTasks = useMemo(() => {
    if (filter === 'all') return sprint.tasks
    return sprint.tasks.filter(t => t.who === filter)
  }, [sprint, filter])

  // Tasks grouped by week.
  const byWeek = useMemo(() => {
    const out: Record<Task['w'], Task[]> = { W1: [], W2: [], W3: [], W4: [] }
    for (const t of visibleTasks) out[t.w].push(t)
    return out
  }, [visibleTasks])

  // Sprint-level counts for the summary bar.
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
    // Avoid a flash of "Alle Sprints" before localStorage rehydrates.
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

      {/* ============ WEEKS ============ */}
      <main className="sb-weeks">
        {(['W1','W2','W3','W4'] as const).map(w => {
          const tasks = byWeek[w]
          if (tasks.length === 0) return null
          const done = tasks.filter(t => (statuses.get(t.id)?.status ?? 'todo') === 'done').length
          return (
            <section key={w} className="sb-week">
              <header className="sb-week-head">
                <h2 className="sb-week-title">Woche {w.slice(1)}</h2>
                <span className="sb-week-count">{done} / {tasks.length} erledigt</span>
              </header>
              <div className="sb-cards">
                {tasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    row={statuses.get(t.id) ?? null}
                    onChange={status => setStatusFor(t, status)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
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
  onChange,
}: {
  task: Task
  row: StatusRow | null
  onChange: (s: Status) => void
}) {
  const status: Status = row?.status ?? 'todo'
  return (
    <article className="sb-card" data-status={status}>
      <header className="sb-card-head">
        <div className="sb-card-who">
          <span className="sb-card-name">{task.who}</span>
          <span
            className="sb-card-role"
            style={{ background: ROLE_COLOR[task.role] }}
          >
            {task.role}
          </span>
        </div>
        {row?.updated_by && row?.updated_at && (
          <small className="sb-card-meta">
            zuletzt geändert von {row.updated_by} · {formatRelative(row.updated_at)}
          </small>
        )}
      </header>
      <p className="sb-card-text">{task.text}</p>
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
