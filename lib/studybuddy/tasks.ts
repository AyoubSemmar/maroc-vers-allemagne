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
// OpenAI-compatible base URL (confirmed from the OpenAPI spec — note
// the /api prefix). Set this as OPENAI_BASE_URL; auth is a plain
// `Authorization: Bearer <key>`. Endpoints: /v1/chat/completions,
// /v1/models, /v1/embeddings, /v1/responses.
export const KICONNECT_BASE_URL = 'https://chat.kiconnect.nrw/api/v1'
// GET this with `Authorization: Bearer <key>` to list the models our
// keys can use — the Dozent asked us to confirm which model we run.
export const KICONNECT_MODELS_ENDPOINT = 'https://chat.kiconnect.nrw/api/v1/models'
// Models actually exposed to our keys (confirmed via GET /api/v1/models,
// owned_by w-hs.de). The id strings are inconsistent (spaces / under-
// scores / hyphens) and MUST be passed verbatim as the `model` param.
export const KICONNECT_CHAT_MODELS = [
  'OpenAI GPT-5.3 Chat',
  'OpenAI_GPT-5.2',
  'OpenAI-GPT-5-Mini',
  'OpenAI GPT-5.3-Codex',
  'OpenAI GPT OSS 120B',
  'Mistral Small 4 119B',
] as const
export const KICONNECT_EMBEDDING_MODELS = [
  'Qwen 3 Embedding 8B',
  'E5 Mistral 7B Instruct Inferenz.nrw',
] as const
// Our choices for the StudyBuddy app:
//  • default chat → GPT-5.3 Chat (newest general model, best for
//    PDF-Q&A, topic extraction and the learning dialogue)
//  • fallback    → GPT-5 Mini (cheap/fast, for high-volume calls like
//    quiz grading)
//  • embeddings  → Qwen 3 Embedding 8B (for semantic search over PDF
//    chunks in the later RAG sprints)
export const KICONNECT_DEFAULT_MODEL = 'OpenAI GPT-5.3 Chat'
export const KICONNECT_FALLBACK_MODEL = 'OpenAI-GPT-5-Mini'
export const KICONNECT_EMBEDDING_MODEL = 'Qwen 3 Embedding 8B'
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
    month: 'September 2026 · Rest bis 31.10.',
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
    title: 'Finalisierung, Abgabe & Abschlusspräsentation',
    subtitle: 'Doku, Feinschliff, Abgabe beim Dozenten & Live-Demo',
    dod: 'README & Doku vollständig · Benutzerhandbuch als PDF · Produktiv-URL geprüft · Abgabe beim Dozenten · Präsentation gehalten',
  },
}

// Restructure of 10.10.2026: the project ends in December instead of
// January, so there are 8 sprints instead of 9. Sprint 9 is dissolved —
// its essential tasks move into Sprint 8, the rest (standby slots, a
// second kickoff, per-person lessons-learned, duplicates of Sprint 8)
// are dropped. Sprint 8 in turn loses the tasks the moved ones replace.
//
// Moved tasks keep their original id so statuses already stored in
// Supabase stay attached. They get fresh taskNums (38+) because
// prereqs are resolved by taskNum within a sprint, and their prereqs
// are rewired to the matching Sprint 8 tasks.
const DROPPED_TASK_IDS = new Set<string>([
  's8-11', // Probedurchlauf 1 — two rehearsals (s8-16, s8-31) remain
  's8-26', // Sprint-8-Review + Demo-Skript — replaced by the final presentation
  's8-28', // Letzte visuelle QA mit Sara — duplicate of s8-23 / s8-34
  's8-33', // Sprint-8-Review + Retro — replaced by the project retro
  's8-35', // Production-Hardening-Check — already done in s7-24
])

const MOVED_INTO_SPRINT_8: Record<string, { taskNum: string; welle: number; prereqs: string[] }> = {
  's9-03': { taskNum: '38', welle: 2, prereqs: [] },           // KI-Connect-Key-Limit
  's9-10': { taskNum: '39', welle: 6, prereqs: [] },           // Finaler DSGVO-Sign-off
  's9-05': { taskNum: '40', welle: 7, prereqs: ['24'] },       // Regression gegen Production, nach Code-Freeze
  's9-07': { taskNum: '41', welle: 7, prereqs: ['24'] },       // Smoke-Test der AI-Flows
  's9-15': { taskNum: '42', welle: 7, prereqs: ['23'] },       // Cross-Browser-Check, nach UI-Freeze
  's9-18': { taskNum: '43', welle: 7, prereqs: ['27'] },       // Vollständigkeit gegen Anforderungen
  's9-13': { taskNum: '44', welle: 8, prereqs: ['29', '32'] }, // Abgabe an Dozent
  's9-24': { taskNum: '45', welle: 8, prereqs: ['31'] },       // Finale Präsentation
  's9-29': { taskNum: '46', welle: 8, prereqs: ['45'] },       // Projekt-Retrospektive
  's9-34': { taskNum: '47', welle: 8, prereqs: ['24'] },       // Archivierung auf GitLab
}

// Prereqs inside Sprint 8 that pointed at a dropped task.
const PREREQ_REWIRES: Record<string, string[]> = {
  's8-16': ['06'], // was "11" (Probedurchlauf 1, dropped)
}

const TEXT_FIXES: Array<[RegExp, string]> = [
  [/9 Monate/g, 'Projektlaufzeit (Mai–Dezember 2026)'],
  [/\(9 Sprints\)/g, '(8 Sprints)'],
]

function fixText(text: string): string {
  return TEXT_FIXES.reduce((acc, [re, to]) => acc.replace(re, to), text)
}

function restructure(t: Task): Task | null {
  if (DROPPED_TASK_IDS.has(t.id)) return null
  const moved = MOVED_INTO_SPRINT_8[t.id]
  if (t.sprintNum === '09' && !moved) return null
  const base: Task = {
    ...t,
    title: fixText(t.title),
    prompt: fixText(t.prompt),
    prereqs: PREREQ_REWIRES[t.id] ?? t.prereqs,
  }
  return moved ? { ...base, sprintNum: '08', ...moved } : base
}

const TASKS: Task[] = (RAW as unknown as Task[])
  .map(restructure)
  .filter((t): t is Task => t !== null)

// Build the public SPRINTS array from the parsed PDF data + the
// per-sprint metadata above. Tasks are pre-sorted by Welle then by
// taskNum so we render them in dependency order out of the box.
export const SPRINTS: Sprint[] = Object.entries(SPRINT_META).map(([num, meta]) => {
  const tasks = TASKS
    .filter(t => t.sprintNum === num)
    .slice()
    .sort((a, b) => a.welle - b.welle || a.taskNum.localeCompare(b.taskNum))
  return { num, ...meta, tasks }
})
