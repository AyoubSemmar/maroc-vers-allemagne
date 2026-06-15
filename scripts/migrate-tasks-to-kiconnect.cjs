/**
 * One-off migration: rewrite Anthropic references → KI Connect.
 *
 * The Dozent asked the team to use the university's KI Connect API
 * (chat.kiconnect.nrw, OpenAI-compatible) instead of their own
 * Anthropic account. This script edits lib/studybuddy/tasks.generated.ts
 * in place to reflect that:
 *
 *  • Replaces brand / SDK / env-var names everywhere they appear.
 *  • Replaces specific model names with model-agnostic phrasing,
 *    since KI Connect picks the backing model for us.
 *  • Fully rewrites task #s1-02 (the previous Anthropic-Workspace
 *    setup task) into a KI Connect verification task — every team
 *    member already has a key, the work is just confirming it works.
 *
 * Re-run is idempotent (replacements are no-ops if already applied).
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'lib', 'studybuddy', 'tasks.generated.ts')

const REPLACEMENTS = [
  // Title arrow artifact from PDF parse (→ collapsed to spaces).
  [/PDF\s+Text\s+Claude-Antwort/g, 'PDF → Text → KI-Antwort'],

  // Brand / service names
  [/Anthropic-Workspace/g, 'KI Connect-Zugang'],
  [/Anthropic-Account/g, 'KI Connect-Zugang'],
  [/Anthropic-Console/g, 'KI Connect-Konsole'],
  [/Anthropic-API/g, 'KI Connect-API'],
  [/Anthropic-SDK/g, 'OpenAI-SDK (kompatibel mit KI Connect)'],
  [/console\.anthropic\.com/g, 'chat.kiconnect.nrw/app'],
  [/anthropic\.com/g, 'chat.kiconnect.nrw'],
  [/\bAnthropic\b/g, 'KI Connect'],

  // Env vars and SDK package names
  [/ANTHROPIC_API_KEY/g, 'OPENAI_API_KEY'],
  [/@anthropic-ai\/sdk/g, 'openai'],

  // Model names — KI Connect picks the model server-side; keep prompts
  // model-agnostic so they survive whatever model the uni provisions.
  [/claude-sonnet-4-5/g, 'das KI-Connect-Standardmodell'],
  [/claude-haiku-4-5/g, 'das KI-Connect-Standardmodell'],
  [/claude-3-5-sonnet[\w-]*/gi, 'das KI-Connect-Standardmodell'],
  [/claude-3-5-haiku[\w-]*/gi, 'das KI-Connect-Standardmodell'],
  [/\bClaude Sonnet\b/g, 'das KI-Connect-Standardmodell'],
  [/\bClaude Haiku\b/g, 'das KI-Connect-Standardmodell'],
  [/\bClaude Opus\b/g, 'das KI-Connect-Standardmodell'],

  // File paths — the PDF assumes src/lib/anthropic/. Rename to a
  // generic src/lib/ai/ that's truthful for any backing API.
  [/src\/lib\/anthropic\//g, 'src/lib/ai/'],
  [/test-anthropic\.ts/g, 'test-kiconnect.ts'],
  [/\banthropic\.ts/g, 'kiconnect.ts'],

  // Stray bare "Claude" mentions in narrative text.
  // NOTE: "Claude Code" (the dev CLI the team types prompts into) is a
  // tool, not the runtime API — it must stay. None of these patterns
  // match "Claude Code".
  [/\bClaude-Modelle\b/g, 'die per KI Connect verfügbaren Modelle'],
  [/\bClaude-Modell\b/g, 'das KI-Connect-Modell'],
  [/\bClaude-API\b/g, 'die KI Connect-API'],
  [/\bClaude antwortet\b/g, 'die KI Connect-API antwortet'],
  [/\bClaude beantwortet\b/g, 'die KI Connect-API beantwortet'],
  [/\bClaude-Antwort\b/g, 'KI-Antwort'],
  [/\bClaude-Antworten\b/g, 'KI-Antworten'],

  // Doc filenames + lowercase leftovers.
  [/docs\/anthropic-setup\.md/g, 'docs/kiconnect-setup.md'],
  [/docs\/legal\/anthropic-dsgvo-notes\.md/g, 'docs/legal/kiconnect-dsgvo-notes.md'],
  [/\banthropic-Client\b/g, 'KI Connect-Client'],
  [/\banthropic-client\b/g, 'kiconnect-client'],
  [/feature\/anthropic-([\w-]+)/g, 'feature/kiconnect-$1'],
]

// Task #s1-02 in the PDF is "Anthropic-Workspace + zwei API-Keys" —
// no longer applicable. Replace it wholesale with a KI Connect
// verification task suited to Taycir's KI role.
const OVERRIDE_S1_02 = {
  id: 's1-02',
  sprintNum: '01',
  taskNum: '02',
  welle: 1,
  who: 'Taycir',
  role: 'KI',
  blocker: true,
  priorityInfo: 'Blockiert die KI-Integration für das Team',
  title: 'KI Connect-Zugang prüfen + Setup-Doku erstellen',
  prereqs: [],
  bullets: [
    '5 persönliche KI Connect-Keys vom Dozent (aus Slack-Nachricht 26. Mai)',
    'curl oder Postman zum Testen',
    'Bitwarden-Tresor offen',
  ],
  erfolg: 'Jedes Teammitglied kann mit dem eigenen Key einen Test-Call gegen https://chat.kiconnect.nrw/api/v1/chat/completions ausführen, docs/kiconnect-setup.md liegt im Repo.',
  prompt: [
    'Ich bin Taycir, KI-Lead im StudyBuddy-Team. Der Dozent hat uns 5 persönliche API-Keys für die KI Connect-API der Hochschule gegeben — einen pro Teammitglied. Wir nutzen kein eigenes Anthropic-Konto, sondern nur die universitäre KI Connect-API. Sie ist OpenAI-kompatibel.',
    '',
    'Fakten aus der OpenAPI-Doku (https://chat.kiconnect.nrw/app/api-docs/):',
    '- Base URL: https://chat.kiconnect.nrw/api/v1 (wichtig: /api-Präfix!)',
    '- Auth: Header "Authorization: Bearer <KEY>" — der ganze Key-String.',
    '- Endpoints: POST /chat/completions, GET /models, POST /embeddings, POST /responses.',
    '',
    'Bitte führe mich Schritt für Schritt durch:',
    '1. Gib mir einen curl-Befehl für einen minimalen "Hallo Welt"-Chat-Request an https://chat.kiconnect.nrw/api/v1/chat/completions (model: "OpenAI GPT-5.3 Chat" — exakt so, mit Leerzeichen; eine User-Message), mit Bearer-Auth.',
    '2. Schreib docs/kiconnect-setup.md als Code-Block: Base URL, Auth-Format, Hinweis dass jeder Key persönlich ist (NIE im Repo, NIE im Frontend), Beispiel-curl, wie man OPENAI_API_KEY und OPENAI_BASE_URL (= https://chat.kiconnect.nrw/api/v1) als ENV-Variable setzt (Windows + Bash), Key-Zuordnung pro Person (Abder=1, Ayoub=2, Leon=3, Sara=4, Taycir=5).',
    '3. Zeig mir, wie ich das offizielle openai-npm-Paket mit baseURL + apiKey auf KI Connect zeige (clientseitig NIE, nur serverseitig).',
    '4. Git-Befehle für feature/kiconnect-setup.',
    '',
    'Erkläre auf Deutsch. WICHTIG: keine Keys in der Datei, nur Platzhalter.',
  ].join('\n'),
}

// Task #s1-08 was "Claude-Sonnet-Preise & Modelle recherchieren".
// Anthropic pricing is irrelevant now — KI Connect is a free,
// uni-provided service. Re-purpose the slot to "verfügbare Modelle
// recherchieren" against KI Connect's API docs.
const OVERRIDE_S1_08 = {
  id: 's1-08',
  sprintNum: '01',
  taskNum: '08',
  welle: 2,
  who: 'Leon',
  role: 'KI',
  blocker: false,
  priorityInfo: 'Nein',
  title: 'KI Connect-Modelle recherchieren + docs/ai-models.md',
  prereqs: [],
  bullets: [
    'Web-Zugang',
    'KI Connect-OpenAPI-Doku (chat.kiconnect.nrw/app/api-docs/)',
  ],
  erfolg: 'docs/ai-models.md listet die per GET /api/v1/models bestätigten Modelle; Standardmodell "OpenAI GPT-5.3 Chat" ist festgelegt.',
  prompt: [
    'Ich bin Leon. Heute dokumentiere ich, welche Modelle unsere KI Connect-Keys (Hochschule, owned_by w-hs.de) freigeschaltet haben, und lege unser Standardmodell fest — der Dozent will wissen, welches Modell wir nutzen.',
    'Bitte hilf mir:',
    '1. Gib mir den curl-Befehl für GET https://chat.kiconnect.nrw/api/v1/models mit Header "Authorization: Bearer $OPENAI_API_KEY", zum erneuten Bestätigen.',
    '2. Bereits per API bestätigt sind diese Chat-Modelle (id-String EXAKT so, inkl. Leerzeichen/Unterstriche): "OpenAI GPT-5.3 Chat", "OpenAI_GPT-5.2", "OpenAI-GPT-5-Mini", "OpenAI GPT-5.3-Codex", "OpenAI GPT OSS 120B", "Mistral Small 4 119B"; Embedding-Modelle: "Qwen 3 Embedding 8B", "E5 Mistral 7B Instruct Inferenz.nrw".',
    '3. Schreib docs/ai-models.md als Code-Block: Tabelle (Modell · Typ · Wofür wir es nutzen) + klare Festlegung: Standard-Chat "OpenAI GPT-5.3 Chat" (PDF-Q&A, Themen-Extraktion, Dialog), "OpenAI-GPT-5-Mini" für Massen-/Schnell-Aufrufe (Quiz-Bewertung), "Qwen 3 Embedding 8B" für spätere semantische Suche. Da KI Connect für uns kostenfrei ist, KEINE Preis-Spalte.',
    '4. WICHTIG: Die id-Strings enthalten Leerzeichen — sie müssen 1:1 als model-Parameter gesetzt werden (kein Slugifizieren).',
    '5. Git-Befehle für feature/ai-models.',
    'Erkläre auf Deutsch.',
  ].join('\n'),
}

function main() {
  const txt = fs.readFileSync(FILE, 'utf8')
  // The file is `export const RAW = [...] as const`. Extract the array.
  const arrJsonRaw = txt.replace(/^export const RAW = /, '').replace(/\s*as const\s*\n?$/, '')
  const arr = JSON.parse(arrJsonRaw)

  let touched = 0
  for (const task of arr) {
    if (task.id === 's1-02') {
      Object.assign(task, OVERRIDE_S1_02)
      touched++
      continue
    }
    if (task.id === 's1-08') {
      Object.assign(task, OVERRIDE_S1_08)
      touched++
      continue
    }
    for (const field of ['title', 'priorityInfo', 'erfolg', 'prompt']) {
      const before = task[field]
      if (typeof before !== 'string') continue
      let after = before
      for (const [re, rep] of REPLACEMENTS) after = after.replace(re, rep)
      if (after !== before) {
        task[field] = after
        touched++
      }
    }
    if (Array.isArray(task.bullets)) {
      for (let i = 0; i < task.bullets.length; i++) {
        const before = task.bullets[i]
        let after = before
        for (const [re, rep] of REPLACEMENTS) after = after.replace(re, rep)
        if (after !== before) {
          task.bullets[i] = after
          touched++
        }
      }
    }
  }

  fs.writeFileSync(FILE, 'export const RAW = ' + JSON.stringify(arr, null, 2) + ' as const\n')
  console.error(`updated ${touched} fields across ${arr.length} tasks`)
}

main()
