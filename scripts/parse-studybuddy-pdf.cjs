/**
 * One-off parser. Reads StudyBuddy_AlleSprints_Welle_fuer_Welle.pdf
 * and emits a TypeScript file with all 324 tasks structured.
 *
 * Layout per task block (extracted from the PDF):
 *   SXX·#NN Welle N PersonName [ROLE] BLOCKER|PRIORITÄT
 *   <header line about priority>
 *   <Title>
 *   VORAUSSETZUNG
 *   <#01 | #01, #04 | keine | -->
 *   WAS DU BRAUCHST
 *   <bullets>
 *   ERFOLGSKRITERIUM
 *   <success criteria>
 *   PROMPT FÜR CLAUDE CODE <instructions>
 *   <prompt body until next "-- N of 352 --">
 */

const fs = require('fs')
const path = require('path')
const { PDFParse } = require('pdf-parse')

const PDF_PATH = 'C:/Users/ayoub/Downloads/StudyBuddy_AlleSprints_Welle_fuer_Welle.pdf'
const OUT_PATH = path.join(__dirname, '..', 'lib', 'studybuddy', 'tasks.generated.ts')

// ── Post-parse corrections ───────────────────────────────────────────
// The source PDF was written before Sprints 1–2 were actually built, so a
// few tasks describe a plan that diverged from reality (AI provider, auth
// bridge, deployment). These overrides re-apply our corrections AFTER the
// raw parse, keyed by task id, so re-running this parser never silently
// reintroduces the stale wording. Each entry shallow-merges over the
// parsed task. See the StudyBuddy app's CLAUDE.md for the ground truth:
//   • AI = KI Connect (OpenAI-compatible). Default model "OpenAI GPT-5.3
//     Chat", fast-lane "OpenAI-GPT-5-Mini". No Anthropic models exist
//     here; never send a custom `temperature` (GPT-5 models → HTTP 400).
//   • Auth: anonymous-session bridge (ensureSession) shipped in Sprint 2;
//     documents.user_id already references auth.users. Sprint 5 adds real
//     email/password login on top.
//   • Deploy is MANUAL: `vercel --prod` from the repo (deploys the local
//     working tree). Vercel is NOT wired to the self-hosted GitLab.
const OVERRIDES = {
  // Deployment-safety: de-hardcode migration numbers (the real repo's
  // sequence diverged once Sprints 1–2 shipped) and pin every user_id FK
  // to auth.users (not public.users) so tables work with the anonymous
  // auth bridge, matching documents.user_id.
  's3-02': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute baue ich das Datenmodell für Themen und Fragen.\nBitte führe mich Schritt für Schritt durch:\n1. Neue Migration supabase/migrations/<nächste freie Nummer>_topics_questions.sql (prüfe zuerst die höchste vorhandene Nummer im Verzeichnis — NICHT raten/hardcoden): topics (id, document_id, title, summary, bloom_level), questions (id, topic_id, type \'open\'|\'mc\', prompt, expected_answer, options jsonb).\n2. RLS so, dass sie mit der anonymen Auth-Bridge aus Sprint 2 funktioniert: Zugriff über die Eigentümerschaft des zugehörigen documents-Eintrags (auth.uid() der Session); + Indizes auf document_id und topic_id.\n3. SQL im Supabase-Editor ausführen — Anleitung.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's3-22': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute optimiere ich DB-Performance.\nBitte führe mich Schritt für Schritt durch:\n1. EXPLAIN für die häufigsten Queries laufen lassen.\n2. Indizes ergänzen wo nötig (insbesondere topic_id, document_id).\n3. Schreib eine neue Migration supabase/migrations/<nächste freie Nummer>_indexes.sql (höchste vorhandene Nummer prüfen, nicht hardcoden).\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's4-02': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute baue ich das Dialog-Datenmodell.\nBitte führe mich Schritt für Schritt durch:\n1. Neue Migration supabase/migrations/<nächste freie Nummer>_dialog_schema.sql (prüfe zuerst die höchste vorhandene Nummer): sessions (id, user_id, topic_id, status, started_at, finished_at), messages (id, session_id, role \'user\'|\'assistant\'|\'system\', content, created_at), progress (user_id, topic_id, mastery_level, last_session_at).\n2. WICHTIG: user_id referenziert auth.users (genau wie documents.user_id — NICHT public.users), damit es mit der anonymen Auth-Bridge läuft.\n3. RLS-Policies mit auth.uid() = user_id (funktioniert auch für anonyme Sessions).\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's5-11': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute baue ich /api/profile.\nBitte führe mich Schritt für Schritt durch:\n1. GET liest aus auth.users + public.profiles. PUT aktualisiert public.profiles.\n2. Neue Migration supabase/migrations/<nächste freie Nummer>_profiles.sql für die profiles-Tabelle; profiles.id referenziert auth.users(id) on delete cascade, RLS auth.uid() = id.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's5-21': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute persistiere ich Lernverlauf konsistent.\nBitte führe mich Schritt für Schritt durch:\n1. Neue Migration supabase/migrations/<nächste freie Nummer>_history.sql: history_entries (user_id, action, topic_id, created_at) für Analytics. user_id referenziert auth.users (NICHT public.users), RLS auth.uid() = user_id.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's6-03': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute baue ich das Quiz-Datenmodell.\nBitte führe mich Schritt für Schritt durch:\n1. Neue Migration supabase/migrations/<nächste freie Nummer>_quiz_schema.sql (prüfe zuerst die höchste vorhandene Nummer): quizzes (id, topic_id, time_limit_sec), quiz_attempts (id, user_id, quiz_id, score, started_at, finished_at).\n2. WICHTIG: quiz_attempts.user_id referenziert auth.users (wie documents — NICHT public.users), RLS auth.uid() = user_id (gilt auch für anonyme Sessions).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's2-21': {
    prompt: 'Ich bin Taycir. Heute dokumentiere ich unsere Prompt-Patterns.\nBitte hilf mir:\n1. Schreib docs/prompts/patterns.md als Code-Block:\n- System+User+JSON-Output Pattern\n- Token-Counting-Helper\n- Wann OpenAI GPT-5.3 Chat (Default) vs OpenAI-GPT-5-Mini (Fast-Lane) — beides KI-Connect-Modelle, kein Anthropic\n- Wo Eval-Sets liegen\n2. Git-Befehle.',
  },
  's5-02': {
    title: 'Email/Password-Auth aktivieren + RLS auf alle Tabellen',
    bullets: ['Supabase-Projekt', 'Bestehende anonyme Auth-Bridge aus Sprint 2 (ensureSession)'],
    erfolg: 'Email/Password-Login aktiv (ersetzt die anonyme Bridge), RLS überall.',
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute aktiviere ich echtes Email/Password-Auth.\nKontext: Seit Sprint 2 läuft bereits anonymous Auth als Bridge (ensureSession() in src/lib/supabase/client.ts), und documents.user_id zeigt schon auf auth.users — heute kommt echtes Login dazu.\nBitte führe mich Schritt für Schritt durch:\n1. Email + Password-Provider in Supabase aktivieren (anonyme Anmeldung vorerst als Fallback an lassen).\n2. supabase/migrations/<nächste freie Nummer>_auth_rls.sql: RLS-Policies auf documents, topics, questions, sessions, messages (auth.uid() = user_id) — prüfe zuerst die höchste vorhandene Migrationsnummer im Repo.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's5-04': {
    prompt: 'Ich bin Ayoub im StudyBuddy-Team. Heute verdrahte ich die Auth-Formulare.\nKontext: Das ersetzt die anonyme Session-Bridge (ensureSession() in src/lib/supabase/client.ts) aus Sprint 2 durch echtes Login.\nBitte führe mich Schritt für Schritt durch:\n1. /login + /signup mit supabase.auth.signInWithPassword/signUp.\n2. ensureSession()-Aufrufe entfernen bzw. nur noch als Gast-Fallback nutzen.\n3. Fehler-Handling + Loading-State.\n4. Redirect nach /dashboard bei Erfolg.\n5. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's6-16': {
    prompt: 'Ich bin Taycir im StudyBuddy-Team. Heute beschleunige ich Quiz-Eval.\nBitte führe mich Schritt für Schritt durch:\n1. Schneller Model-Fallback auf OpenAI-GPT-5-Mini (unser Fast-Lane-Modell auf KI Connect) für die Quiz-Bewertung — exakt diese Model-ID; \'Haiku\'/Anthropic-Modelle gibt es bei KI Connect NICHT.\n2. WICHTIG: keinen custom temperature-Parameter senden — KI-Connect-GPT-5-Modelle erlauben nur den Default (sonst HTTP 400).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's6-27': {
    prompt: 'Ich bin Taycir im StudyBuddy-Team. Heute finalisiere ich Quiz-Modell.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/quiz-model-choice.md: Vergleich der realen KI-Connect-Modelle — OpenAI-GPT-5-Mini (Fast-Lane, günstig/schnell) vs. OpenAI GPT-5.3 Chat (Default, stärker). Empfehlung fürs Quiz: Mini wegen Tempo. Model-IDs verbatim übernehmen, kein custom temperature.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
  's9-02': {
    prompt: 'Ich bin Abder im StudyBuddy-Team. Heute bereite ich Production-Deploy vor.\nKontext: Deploy ist bei uns MANUELL — `vercel --prod` aus dem Repo-Ordner (CLI ist verlinkt + eingeloggt als Team-Account). Vercel ist NICHT mit der Hochschul-GitLab verbunden, es gibt KEIN Auto-Deploy; `vercel --prod` deployt den lokalen Working-Tree, nicht einen Git-Branch.\nBitte führe mich Schritt für Schritt durch:\n1. Vercel-Production-Env-Variablen final prüfen (inkl. OPENAI_API_KEY = KI-Connect-Token, OPENAI_BASE_URL).\n2. Sicherstellen, dass der lokale Working-Tree dem RC-Tag entspricht, dann `vercel --prod`.\n3. Custom-Domain (falls vorhanden) + SSL.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch.',
  },
}

// Person + role mapping (matches our existing types).
const VALID_PEOPLE = new Set(['Leon', 'Taycir', 'Ayoub', 'Sara', 'Abder'])
const VALID_ROLES  = new Set(['PM', 'KI', 'FE', 'QA', 'BE'])

async function main() {
  const buf = fs.readFileSync(PDF_PATH)
  const p = new PDFParse({ data: buf })
  const res = await p.getText()
  const fullText = res.text

  // Split by page marker so we don't conflate adjacent pages.
  const pages = fullText.split(/-- \d+ of 352 --/g)
  console.error(`pdf has ${pages.length} page chunks`)

  // Each task page starts with the marker line: "SXX·#NN Welle Y Name [ROLE] BLOCKER|PRIORITÄT"
  // Collect them.
  const taskRe = /S(\d{2})·#(\d{2})\s+Welle\s+(\d+)\s+(\S+)\s+\[(PM|KI|FE|QA|BE)\]\s*(BLOCKER|PRIORITÄT)?/
  const tasks = []

  for (const page of pages) {
    const m = page.match(taskRe)
    if (!m) continue
    const [, sprintStr, taskNumStr, welleStr, person, role, marker] = m
    if (!VALID_PEOPLE.has(person) || !VALID_ROLES.has(role)) continue

    const startIdx = m.index + m[0].length
    let body = page.slice(startIdx)

    // ── Extract sections ─────────────────────────────────────
    // The page header lines are:
    //   <marker info line>  e.g. "Blockiert alle weiteren FE-Aufgaben"
    //                       or  "Nein", "Nein — parallel möglich"
    //   <Title>
    // Then keyword sections in order: VORAUSSETZUNG, WAS DU BRAUCHST,
    // ERFOLGSKRITERIUM, PROMPT FÜR CLAUDE CODE.

    function section(label, terminators) {
      const start = body.indexOf(label)
      if (start === -1) return null
      const valStart = start + label.length
      let end = body.length
      for (const t of terminators) {
        const i = body.indexOf(t, valStart)
        if (i !== -1 && i < end) end = i
      }
      return body.slice(valStart, end).trim()
    }

    const vorauss   = section('VORAUSSETZUNG', ['WAS DU BRAUCHST', 'ERFOLGSKRITERIUM', 'PROMPT FÜR CLAUDE CODE'])
    const wasBraucht = section('WAS DU BRAUCHST', ['ERFOLGSKRITERIUM', 'PROMPT FÜR CLAUDE CODE'])
    const erfolg    = section('ERFOLGSKRITERIUM', ['PROMPT FÜR CLAUDE CODE'])
    const prompt    = section('PROMPT FÜR CLAUDE CODE', [])

    // Title sits between the marker-info line and the VORAUSSETZUNG keyword.
    // The marker-info line is whatever appears before the title on its own.
    const beforeVor = body.slice(0, body.indexOf('VORAUSSETZUNG')).trim()
    // The first non-empty line is the priority info, the rest is the title.
    const lines = beforeVor.split('\n').map(l => l.trim()).filter(Boolean)
    const priorityInfo = lines[0] ?? ''
    const title = lines.slice(1).join(' ').trim()

    // Strip the PDF page-header line ("Ich bin Ayoub..." prompts often
    // have a leading instruction "Im geclonten Repo starten · Block
    // kopieren · in Claude Code einfügen" — keep that as instructions
    // header, but trim the noise).
    const promptClean = (prompt ?? '').replace(/^.*kopieren · in Claude Code einfügen/, '').trim()

    // Parse prereqs: either "—", "keine", "#01", "#01, #04", or longer.
    let prereqs = []
    if (vorauss && !/^(—|keine|-)$/i.test(vorauss.trim())) {
      const m2 = vorauss.match(/#\d{2}/g)
      if (m2) prereqs = m2.map(s => s.slice(1)) // store as ["01","04"]
    }

    // The PDF font maps arrow glyphs (→ / ↔) to NUL bytes ( ) on
    // extraction. Restore them: space-NUL-space was an arrow; any
    // remaining NUL (trailing emoji etc. the font couldn't map) is
    // dropped. Then collapse the doubled space that leaves behind.
    const NUL = String.fromCharCode(0)
    const deNul = (s) =>
      (s ?? '')
        .split(` ${NUL} `).join(' → ')
        .split(NUL).join('')
        .replace(/[ \t]{2,}/g, ' ')
        .trim()

    // Parse "was du brauchst" bullets.
    const bullets = (wasBraucht ?? '')
      .split(/\n|•/)
      .map(s => deNul(s))
      .filter(Boolean)

    tasks.push({
      id: `s${parseInt(sprintStr, 10)}-${taskNumStr.padStart(2, '0')}`,
      sprintNum: sprintStr,
      taskNum: taskNumStr,
      welle: parseInt(welleStr, 10),
      who: person,
      role,
      blocker: marker === 'BLOCKER',
      priorityInfo: deNul(priorityInfo),
      title: deNul(title),
      prereqs,
      bullets,
      erfolg: deNul(erfolg),
      prompt: deNul(promptClean),
    })
  }

  console.error(`parsed ${tasks.length} tasks`)
  // Sanity: should be close to 324 (9 sprints × 36 tasks).

  // Re-apply post-parse corrections so reality fixes survive a re-run.
  let patched = 0
  for (const t of tasks) {
    if (OVERRIDES[t.id]) {
      Object.assign(t, OVERRIDES[t.id])
      patched++
    }
  }
  console.error(`applied ${patched}/${Object.keys(OVERRIDES).length} overrides`)
  for (const id of Object.keys(OVERRIDES)) {
    if (!tasks.some(t => t.id === id)) console.error(`WARN: override ${id} matched no task`)
  }

  // Group by sprint
  const bySprint = {}
  for (const t of tasks) {
    if (!bySprint[t.sprintNum]) bySprint[t.sprintNum] = []
    bySprint[t.sprintNum].push(t)
  }
  for (const k of Object.keys(bySprint)) {
    console.error(`sprint ${k}: ${bySprint[k].length} tasks`)
  }

  fs.writeFileSync(OUT_PATH, 'export const RAW = ' + JSON.stringify(tasks, null, 2) + ' as const\n')
  console.error(`wrote ${OUT_PATH}`)
}

main().catch(e => { console.error(e); process.exit(1) })
