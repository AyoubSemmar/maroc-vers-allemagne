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
  erfolg: 'Jedes Teammitglied kann mit dem eigenen Key einen Test-Call gegen chat.kiconnect.nrw/app/api-docs/ ausführen, docs/kiconnect-setup.md liegt im Repo.',
  prompt: [
    'Ich bin Taycir, KI-Lead im StudyBuddy-Team. Der Dozent hat uns 5 persönliche API-Keys für die KI Connect-API der Hochschule (chat.kiconnect.nrw/app/api-docs/) gegeben — einen pro Teammitglied. Wir nutzen kein eigenes Anthropic-Konto, sondern nur die universitäre KI Connect-API.',
    '',
    'Bitte führe mich Schritt für Schritt durch:',
    '1. Wie lese ich die OpenAPI-Doku unter https://chat.kiconnect.nrw/app/api-docs/ und finde den Chat-Completions-Endpoint (vermutlich OpenAI-kompatibel, also POST /v1/chat/completions).',
    '2. Gib mir einen curl-Befehl, mit dem ich meinen Key kurz teste — minimaler "Hallo Welt"-Request, der zurückgibt, welches Modell standardmäßig antwortet.',
    '3. Schreib docs/kiconnect-setup.md als Code-Block: Endpoint-URL, Hinweis dass jeder Key persönlich ist (NIE im Repo, NIE im Frontend), Beispiel-curl, wie man OPENAI_API_KEY + OPENAI_BASE_URL als ENV-Variable setzt (Windows + Bash), Key-Zuordnung pro Person (Abder=1, Ayoub=2, Leon=3, Sara=4, Taycir=5).',
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
  erfolg: 'docs/ai-models.md listet die verfügbaren Modelle, GET /v1/models ist getestet, und unser Standardmodell (GPT-4.1) ist festgelegt.',
  prompt: [
    'Ich bin Leon. Heute bestätige ich, welche Modelle die KI Connect-API der Hochschule (chat.kiconnect.nrw) anbietet, und lege unser Standardmodell fest — der Dozent will wissen, welches Modell wir nutzen.',
    'Bitte hilf mir:',
    '1. Gib mir den exakten curl-Befehl für GET https://chat.kiconnect.nrw/v1/models mit Header "Authorization: Bearer $OPENAI_API_KEY". Das gibt die für unseren Key freigeschalteten Modelle zurück.',
    '2. Laut KI-Connect-Doku sind u. a. verfügbar: GPT-5.2, GPT-5, GPT-4.1, GPT-4.1 Mini, DeepSeek R1, Llama 3.1 8B Instruct, Qwen 3 32B, Codestral 22B, Qwen QwQ 32B. Hilf mir die curl-Ausgabe damit abzugleichen — welche davon hat UNSER Key wirklich frei?',
    '3. Schreib docs/ai-models.md als Code-Block: Tabelle (Modell · Kontextfenster · Wofür wir es nutzen) + klare Festlegung: Standardmodell GPT-4.1 für PDF-Q&A, Themen-Extraktion und Dialog; GPT-4.1 Mini als günstige/schnelle Variante für Massen-Aufrufe (Quiz-Bewertung). Da KI Connect für uns kostenfrei ist, KEINE Preis-Spalte.',
    '4. Notiere den EXAKTEN Modell-id-String aus /v1/models (z. B. "gpt-4.1"), den wir später in OPENAI-Calls als model-Parameter setzen.',
    '5. Git-Befehle für feature/ai-models.',
    'Erkläre auf Deutsch. Wenn /v1/models einen anderen id-String liefert als erwartet, nimm den echten String aus der Antwort.',
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
