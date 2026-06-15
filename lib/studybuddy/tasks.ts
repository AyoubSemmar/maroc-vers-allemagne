/**
 * StudyBuddy sprint tracker — task definitions (Welle-Reihenfolge).
 *
 * Sourced from `StudyBuddy_AlleSprints_Welle_fuer_Welle.pdf` and parsed
 * by `scripts/parse-studybuddy-pdf.cjs` → `tasks.generated.ts`. Every
 * task has its full Claude Code "Tutor-Prompt" inline so the team can
 * copy it from the tracker UI without opening the PDF.
 *
 * Task ordering: tasks within a sprint are ordered by Welle (1–8),
 * which encodes the real dependency graph. Two tasks in the same
 * Welle can run in parallel; a higher Welle is blocked until all its
 * prerequisites are done.
 *
 * Only per-task STATUS lives in Supabase (table:
 * studybuddy_task_status, keyed by `id`). Everything else here is
 * static.
 */

import { RAW } from './tasks.generated'

export type Role = 'PM' | 'KI' | 'FE' | 'QA' | 'BE'
export type Person = 'Leon' | 'Taycir' | 'Ayoub' | 'Sara' | 'Abder'
export type Status = 'todo' | 'wip' | 'help' | 'done'

export type Task = {
  /** Stable primary key, e.g. "s1-04". Used as the row id in Supabase. */
  id: string
  /** Two-digit sprint number, e.g. "01". */
  sprintNum: string
  /** Two-digit task number within the sprint, e.g. "04" — referenced by other tasks' prereqs. */
  taskNum: string
  /** Dependency wave 1–8 inside the sprint. */
  welle: number
  who: Person
  role: Role
  title: string
  /** True if the PDF marks this task as a hard blocker for the rest of the sprint. */
  blocker: boolean
  /** Short German info line above the title ("Blockiert das gesamte Team" / "Nein — parallel möglich"). */
  priorityInfo: string
  /** Array of taskNum prerequisites, e.g. ["01", "04"]. Empty if none. */
  prereqs: string[]
  /** Bullets under "Was du brauchst". */
  bullets: string[]
  /** Plain-text success criterion ("Erfolgskriterium"). */
  erfolg: string
  /** The full multi-line Claude Code prompt to copy. */
  prompt: string
}

export type Sprint = {
  num: string
  month: string
  title: string
  subtitle: string
  /** Definition of Done — sprint-level acceptance criteria. */
  dod: string
  tasks: Task[]
}

export const PERSONS: Person[] = ['Leon', 'Taycir', 'Ayoub', 'Sara', 'Abder']

// KI Connect (HS NRW) — replaces the planned Anthropic-Workspace.
// The Dozent provided one personal API key per team member; they're
// distributed alphabetically so everyone knows which one is theirs
// without having to ask each time. Actual key values stay out of the
// repo and live in the team password manager.
export const KICONNECT_ENDPOINT = 'https://chat.kiconnect.nrw/app/api-docs/'
// GET this with `Authorization: Bearer <key>` to list the models our
// keys can use — the Dozent asked us to confirm which model we run.
export const KICONNECT_MODELS_ENDPOINT = 'https://chat.kiconnect.nrw/v1/models'
// Our chosen default. KI Connect offers GPT-5.2 / GPT-5 / GPT-4.1 /
// GPT-4.1 Mini / DeepSeek R1 / Llama 3.1 8B / Qwen 3 32B / Codestral
// 22B / Qwen QwQ 32B. GPT-4.1 is the best balance for PDF-Q&A, topic
// extraction and dialogue (strong reasoning, large context); GPT-4.1
// Mini is the cheap/fast fallback for high-volume calls (quiz grading).
// Confirm the exact id string via GET /v1/models before wiring calls.
export const KICONNECT_DEFAULT_MODEL = 'GPT-4.1'
export const KICONNECT_FALLBACK_MODEL = 'GPT-4.1 Mini'
export const KICONNECT_KEY_BY_PERSON: Record<Person, number> = {
  Abder:  1,
  Ayoub:  2,
  Leon:   3,
  Sara:   4,
  Taycir: 5,
}

export const ROLE_COLOR: Record<Role, string> = {
  PM: '#3b6fb5',
  KI: '#e07a3f',
  FE: '#2f8f6e',
  QA: '#b8533a',
  BE: '#5f4a8a',
}

export const STATUSES: Array<{ key: Status; emoji: string; label: string; color: string }> = [
  { key: 'todo', emoji: '⚪', label: 'Noch nicht',    color: '#6f6a5e' },
  { key: 'wip',  emoji: '🟡', label: 'In Arbeit',     color: '#d6a635' },
  { key: 'help', emoji: '🔴', label: 'Brauche Hilfe', color: '#b8533a' },
  { key: 'done', emoji: '🟢', label: 'Erledigt',      color: '#2f8f6e' },
]

// Sprint-level metadata (month, title, subtitle, Definition of Done).
// Mirrors the PDF's cover sheet for each sprint.
const SPRINT_META: Record<string, Omit<Sprint, 'num' | 'tasks'>> = {
  '01': {
    month: 'Mai 2026',
    title: 'Projektinitialisierung & Technische Grundlagen',
    subtitle: 'Repository, Frameworks, erstes Deployment & UI-Prototyp',
    dod: 'Repo eingerichtet · CI läuft · „Hello StudyBuddy" live auf Vercel · Supabase-DB erreichbar · Team nutzt Claude Code',
  },
  '02': {
    month: 'Juni 2026',
    title: 'KI-Konzept & Dokumentenverarbeitung',
    subtitle: 'PDF rein, strukturierter Text raus, erste KI-Antworten',
    dod: 'PDF-Upload funktioniert · Text wird extrahiert & gespeichert · Claude beantwortet erste Testfrage',
  },
  '03': {
    month: 'Juli 2026',
    title: 'Themenextraktion & Fragegenerierung',
    subtitle: 'Aus Skripten werden lernbare Einheiten – das Herzstück',
    dod: 'Mind. 10 sinnvolle Fragen pro Hauptthema generiert · manuelle Qualitätsbewertung dokumentiert',
  },
  '04': {
    month: 'August 2026',
    title: 'Interaktive Lernlogik & Dialogsystem',
    subtitle: 'Echter Lerndialog – Referenz: Dijkstra-Algorithmus',
    dod: 'Komplette Lernsession Frage → Antwort → Bewertung → Rückfrage → Abschluss · Fortschritt gespeichert',
  },
  '05': {
    month: 'September 2026',
    title: 'Nutzerkonten & Personalisierung',
    subtitle: 'Persönliche Plattform mit Lernverlauf & Mobile',
    dod: 'Registrierung & Login funktionieren · Lernverlauf bleibt nach Logout erhalten · UI vollständig Mobile-tauglich',
  },
  '06': {
    month: 'Oktober 2026',
    title: 'UI/UX & Erweiterte Features',
    subtitle: 'Redesign, Dark Mode, Quiz-Modus & erstes User-Testing',
    dod: 'Designsystem dokumentiert · Dark Mode toggelbar · Quiz-Modus nutzbar · Testbericht aus User-Testing liegt vor',
  },
  '07': {
    month: 'November 2026',
    title: 'Qualitätssicherung & Sicherheit',
    subtitle: 'Tests, Performance, Security & DSGVO-Konformität',
    dod: 'Testabdeckung > 60 % · 0 kritische Bugs · DSGVO-Checkliste vollständig · Lighthouse > 90',
  },
  '08': {
    month: 'Dezember 2026',
    title: 'Finalisierung & Dokumentation',
    subtitle: 'Feinschliff, Benutzerhandbuch, Abschluss-Präsentation',
    dod: 'README & Doku vollständig · Benutzerhandbuch als PDF · Präsentationsfolien fertig',
  },
  '09': {
    month: 'Januar 2027',
    title: 'Deployment & Abschlusspräsentation',
    subtitle: 'Go-Live, Abgabe & Live-Demo',
    dod: 'Produktiv-URL live · Repo eingefroren · Präsentation gehalten · Note steht',
  },
}

// Build the public SPRINTS array from the parsed PDF data + the
// per-sprint metadata above. Tasks are pre-sorted by Welle then by
// taskNum so we render them in dependency order out of the box.
export const SPRINTS: Sprint[] = Object.entries(SPRINT_META).map(([num, meta]) => {
  const tasks = (RAW as unknown as Task[])
    .filter(t => t.sprintNum === num)
    .slice()
    .sort((a, b) => a.welle - b.welle || a.taskNum.localeCompare(b.taskNum))
  return { num, ...meta, tasks }
})
