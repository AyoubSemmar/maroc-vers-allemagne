export const RAW = [
  {
    "id": "s1-01",
    "sprintNum": "01",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": true,
    "priorityInfo": "Blockiert das gesamte Team",
    "title": "GitLab-Repo einrichten + Branch Protection + CLAUDE.md",
    "prereqs": [],
    "bullets": [
      "GitLab-Zugang",
      "E-Mails der 4 Teammitglieder",
      "CLAUDE.md aus Projektordner"
    ],
    "erfolg": "Repo eingerichtet, Branches geschützt, CLAUDE.md im Repo.",
    "prompt": "Ich bin Leon, Project Manager im StudyBuddy-Team. Der Dozent hat das Repo angelegt (2026-study-buddy). Heute richte ich es vollständig\nein.\nBitte führe mich Schritt für Schritt durch:\n1. Branch Protection für main aktivieren — exakte Klick-Reihenfolge.\n2. develop-Branch erstellen und schützen.\n3. Vier Teammitglieder als Maintainer einladen.\n4. Gib mir je einen Code-Block für: .gitignore (Node.js + Next.js + .env),\n.gitlab/merge_request_templates/default.md, README.md (Platzhalter).\n5. Wie ich CLAUDE.md aus meinem lokalen Projektordner ins Repo bekomme.\nErkläre auf Deutsch. Warte nach jedem Schritt auf meine Bestätigung."
  },
  {
    "id": "s1-02",
    "sprintNum": "01",
    "taskNum": "02",
    "welle": 1,
    "who": "Taycir",
    "role": "KI",
    "blocker": true,
    "priorityInfo": "Blockiert Claude Code für das Team",
    "title": "Anthropic-Workspace + zwei API-Keys (Dev + Prod)",
    "prereqs": [],
    "bullets": [
      "Geteilte Team-E-Mail",
      "Zahlungsmethode"
    ],
    "erfolg": "Workspace + 2 Keys aktiv, docs/anthropic-setup.md fertig.",
    "prompt": "Ich bin Taycir, AI-Lead im StudyBuddy-Team. Heute lege ich unseren Anthropic-Workspace an.\nBitte führe mich durch:\n1. Workspace „StudyBuddy\" auf console.anthropic.com anlegen.\n2. Vier Teammitglieder per E-Mail einladen.\n3. Zwei API-Keys mit jeweils eigenem Spend-Limit erstellen:\n- „claude-code-dev\" Limit 15 EUR/Monat\n- „studybuddy-prod\" Limit 0 EUR/Monat (kommt in Sprint 2)\n4. Bitwarden-Eintrag-Vorlage.\n5. Schreib mir docs/anthropic-setup.md als Code-Block (Workspace, Region,\nwie ein Teammitglied ANTHROPIC_API_KEY setzt — Windows + Bash).\nWICHTIG: keine Keys in der Datei. Erkläre auf Deutsch."
  },
  {
    "id": "s1-03",
    "sprintNum": "01",
    "taskNum": "03",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert das gesamte Backend",
    "title": "Supabase-Projekt in EU-Frankfurt anlegen",
    "prereqs": [],
    "bullets": [
      "Geteilte Team-E-Mail",
      "Bitwarden-Tresor offen"
    ],
    "erfolg": "Supabase läuft in EU-Frankfurt, docs/supabase-setup.md fertig.",
    "prompt": "Ich bin Abder, Backend-Lead im StudyBuddy-Team. Heute lege ich unser Supabase-Projekt an.\nBitte führe mich durch:\n1. Wie ich auf supabase.com ein Projekt „StudyBuddy\" anlege.\n2. Einstellungen (DSGVO-kritisch):\n- Region: Central EU (Frankfurt)\n- DB-Passwort sofort in Bitwarden\n- Enable Data API: JA · Automatically expose: NEIN · Auto-RLS: JA\n3. Wo Project URL + anon public Key zu finden sind.\n4. Schreib mir docs/supabase-setup.md als Code-Block (Projektname,\nRegion, ENV-Variablen für Teammitglieder, Hinweis service_role-Key\nNIE im Repo).\nErkläre auf Deutsch."
  },
  {
    "id": "s1-04",
    "sprintNum": "01",
    "taskNum": "04",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": true,
    "priorityInfo": "Blockiert alle weiteren FE-Aufgaben",
    "title": "Next.js 14 + TypeScript + Tailwind im Repo initialisieren",
    "prereqs": [
      "01"
    ],
    "bullets": [
      "Repo geklont (#1)",
      "Node.js 20 LTS"
    ],
    "erfolg": "npm run dev startet, „Hello StudyBuddy\" sichtbar, MR offen.",
    "prompt": "Ich bin Ayoub, FE-Lead. Heute setze ich Next.js 14 im Repo auf.\nBitte führe mich durch:\n1. Exakter `npx create-next-app`-Befehl mit TS + Tailwind + ESLint +\nsrc/ + App Router + npm.\n2. Antworten auf die interaktiven Fragen.\n3. Ordner anlegen: src/components/ui, src/components/layout, src/lib,\nsrc/types, src/config.\n4. Schreib mir src/config/site.ts als Code-Block.\n5. Schreib mir src/app/page.tsx als „Hello StudyBuddy\"-Code-Block mit\nTailwind-Styling (cream-Background, Serif-H1).\n6. Git-Befehle für feature/init-nextjs.\nErkläre auf Deutsch, prüfe nach jedem Schritt."
  },
  {
    "id": "s1-05",
    "sprintNum": "01",
    "taskNum": "05",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "GitLab-Wiki anlegen + Bug-Label-System",
    "prereqs": [
      "01"
    ],
    "bullets": [
      "GitLab Maintainer-Rechte (#1)"
    ],
    "erfolg": "Wiki hat 6 Seiten, ca. 25 Labels existieren.",
    "prompt": "Ich bin Sara, QA+FE-Lead. Heute richte ich unser Wiki und Bug-Labels ein.\nBitte führe mich durch:\n1. Wiki aktivieren + 6 Seiten anlegen: Home · Onboarding · Dev-Setup ·\nArchitektur · Sprint-Berichte · Risiken & Maßnahmen.\n2. Schreib mir Home + Onboarding + Dev-Setup als 3 Code-Blöcke.\n3. Label-Schema mit Farben (Tabelle): bug, enhancement, question, doc,\npriority/(critical|major|minor), status/(todo|in-progress|blocked|done),\nsprint/1..9, week/1..4, role/(pm|ki|fe|qa|be).\nErkläre auf Deutsch."
  },
  {
    "id": "s1-06",
    "sprintNum": "01",
    "taskNum": "06",
    "welle": 2,
    "who": "Taycir",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Sprint-1-Backlog mit 36 Tickets als Markdown",
    "prereqs": [
      "01"
    ],
    "bullets": [
      "Repo (#1)",
      "Sprint-1-Aufgabenliste"
    ],
    "erfolg": "backlog/sprint-1.md mit 36 strukturierten Tickets.",
    "prompt": "Ich bin Taycir. Heute schreibe ich das Sprint-1-Backlog.\nBitte hilf mir:\n1. Lege backlog/sprint-1.md an.\n2. Frag mich nach der Sprint-1-Aufgabenliste (Person + Woche).\n3. Für jedes Ticket im Format:\n## [Task-ID] [Wer] — [Titel]\n**Woche:** · **Rolle:** · **Voraussetzung:** · **Akzeptanzkriterium:**\n4. Schreib die fertige Datei als Code-Block.\n5. Git-Befehle für feature/backlog.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-07",
    "sprintNum": "01",
    "taskNum": "07",
    "welle": 2,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein — parallel möglich",
    "title": "Landing-Page Low-Fi-Wireframe entwerfen",
    "prereqs": [],
    "bullets": [
      "Stift & Papier oder HTML-Editor"
    ],
    "erfolg": "docs/wireframes/landing.html zeigt Struktur klar.",
    "prompt": "Ich bin Sara. Heute entwerfe ich ein Low-Fi-Wireframe für die Landing-Page.\nBitte hilf mir:\n1. Frag mich nach den Sektionen, die wir wollen.\n2. Schreib mir docs/wireframes/landing.html als Code-Block —\nreines HTML, Graustufen, klare Boxen, mit Sektionen:\nTop-Nav · Hero · Wie funktioniert (3 Karten) · Für wen (3 Karten) ·\nFooter.\n3. Git-Befehle für feature/wireframes.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-08",
    "sprintNum": "01",
    "taskNum": "08",
    "welle": 2,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Claude-Sonnet-Preise & Modelle recherchieren",
    "prereqs": [],
    "bullets": [
      "Web-Zugang"
    ],
    "erfolg": "docs/ai-models.md mit Tabelle, Empfehlung, Quellen.",
    "prompt": "Ich bin Leon. Heute recherchiere ich aktuelle Anthropic-Modelle.\nBitte hilf mir:\n1. Recherchiere die aktuellen Claude-Modelle (Sonnet, Haiku, Opus).\n2. Schreib mir docs/ai-models.md als Code-Block mit Vergleichstabelle:\nModell · Eingabe-$/1M · Ausgabe-$/1M · Kontextfenster · Wann einsetzen\n3. Empfehlungs-Absatz: welches Modell bei 15 EUR/Monat Budget?\n4. Quellen verlinken.\n5. Git-Befehle für feature/ai-models.\nBei Unsicherheit Preise: nutze letzten Stand mit Hinweis „bitte vor\nCommit verifizieren\". Erkläre auf Deutsch."
  },
  {
    "id": "s1-09",
    "sprintNum": "01",
    "taskNum": "09",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": true,
    "priorityInfo": "Blockiert Landing-Page und Login",
    "title": "Root-Layout + Header/Footer + UI-Primitive",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Next.js läuft (#4)"
    ],
    "erfolg": "Header, Footer, Button, Input nutzbar.",
    "prompt": "Ich bin Ayoub. Heute baue ich die ersten UI-Komponenten.\nBitte führe mich durch:\n1. Erweitere src/app/layout.tsx (Inter via next/font, cream BG, Header,\nFooter) — Code-Block.\n2. src/components/layout/Header.tsx (Logo „Study\" + italic „Buddy\" in\nOrange, Login-Link) — Code-Block.\n3. src/components/layout/Footer.tsx (Hochschule, Team, Datenschutz) —\nCode-Block.\n4. src/components/ui/Button.tsx (Varianten primary/secondary/ghost,\nGrößen sm/md/lg) — Code-Block.\n5. src/components/ui/Input.tsx (Label, Error, Focus-Ring Orange) —\nCode-Block.\n6. Git-Befehle für feature/ui-primitives.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-10",
    "sprintNum": "01",
    "taskNum": "10",
    "welle": 3,
    "who": "Sara",
    "role": "FE",
    "blocker": true,
    "priorityInfo": "Blockiert konsistentes Styling",
    "title": "Tailwind-Design-Tokens in tailwind.config.ts definieren",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Next.js (#4)"
    ],
    "erfolg": "Tokens (bg-cream, text-navy …) nutzbar.",
    "prompt": "Ich bin Sara. Heute definiere ich unsere Tailwind-Design-Tokens.\nBitte hilf mir:\n1. Erkläre kurz theme.extend.\n2. Schreib mir die fertige tailwind.config.ts als Code-Block mit:\ncream/navy/orange/ink/muted/line Farben (Hex aus CLAUDE.md),\nfontFamily.serif Georgia, fontFamily.sans Inter,\nspacing.section 6rem, borderRadius.card 0.75rem.\n3. Schreib docs/design-tokens.md mit Übersichts-Tabelle.\n4. Git-Befehle für feature/design-tokens.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-11",
    "sprintNum": "01",
    "taskNum": "11",
    "welle": 3,
    "who": "Ayoub",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor CI-Pipeline",
    "title": "ESLint + Prettier härten + npm-Scripts ergänzen",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Next.js (#4)"
    ],
    "erfolg": "npm run check:all grün.",
    "prompt": "Ich bin Ayoub. Heute härte ich Lint + Prettier.\nBitte hilf mir:\n1. Schreib .eslintrc.json (next/core-web-vitals + ts-recommended + rules)\nals Code-Block.\n2. .prettierrc + .prettierignore als Code-Blöcke.\n3. package.json scripts ergänzen: lint, lint:fix, format, typecheck,\ncheck:all — gib mir die genaue Zeile.\n4. Welche Befehle ich einmal lokal teste.\n5. Git-Befehle für feature/lint-config.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-12",
    "sprintNum": "01",
    "taskNum": "12",
    "welle": 3,
    "who": "Ayoub",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Teststrategie-Dokument verfassen",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "docs/test-strategy.md gemerged.",
    "prompt": "Ich bin Ayoub. Heute schreibe ich unsere Teststrategie.\nBitte hilf mir:\n1. Schreib docs/test-strategy.md als Code-Block mit:\n1) Ziel > 60 % Coverage bis Sprint 7\n2) Test-Ebenen + Tools (Jest, RTL, Playwright)\n3) Was wird getestet, was nicht (Anthropic-API gemockt)\n4) Coverage-Reporting via GitLab CI\n5) Bug-Triage mit 3 Prioritätsstufen.\n2. Git-Befehle für feature/test-strategy.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-13",
    "sprintNum": "01",
    "taskNum": "13",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert Health-Check",
    "title": "Supabase-Client + .env.example + Tabellen-Stubs",
    "prereqs": [
      "03",
      "04"
    ],
    "bullets": [
      "Supabase (#3)",
      "Next.js (#4)"
    ],
    "erfolg": "Client bereit, .env.example da, Tabellen mit RLS.",
    "prompt": "Ich bin Abder. Heute verbinde ich Next.js mit Supabase.\nBitte hilf mir:\n1. npm-Befehl für @supabase/supabase-js.\n2. src/lib/supabase/client.ts als Code-Block (createClient mit\nNEXT_PUBLIC_* env).\n3. src/lib/supabase/types.ts als Code-Block (Platzhalter Database type).\n4. .env.example als Code-Block (2 NEXT_PUBLIC_* + Hinweis service_role).\n5. supabase/migrations/0001_initial.sql als Code-Block: users + documents\nPlatzhalter + RLS aktivieren.\n6. Schritt-für-Schritt SQL im Supabase-Editor ausführen.\n7. Git-Befehle für feature/supabase-client.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-14",
    "sprintNum": "01",
    "taskNum": "14",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "DoD-Kriterium",
    "title": "GitLab CI-Pipeline (.gitlab-ci.yml) aufsetzen",
    "prereqs": [
      "04",
      "11"
    ],
    "bullets": [
      "Next.js + Lint-Config (#4, #11)"
    ],
    "erfolg": "Pipeline grün auf jedem MR.",
    "prompt": "Ich bin Sara. Heute schreibe ich unsere CI-Pipeline.\nBitte hilf mir:\n1. Erkläre kurz wie .gitlab-ci.yml + Stages funktionieren.\n2. Schreib mir die fertige .gitlab-ci.yml als Code-Block:\nStages install · lint · typecheck · build · test\nimage: node:20-alpine, cache node_modules,\nrules: nur auf MRs + develop, test mit Coverage-Artifact.\n3. Wie ich Pipeline-Status auf GitLab sehe.\n4. Was tun bei rotem Job.\n5. Git-Befehle für feature/ci-pipeline.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-15",
    "sprintNum": "01",
    "taskNum": "15",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Kanban-Board + Tickets verteilen",
    "prereqs": [
      "01",
      "06"
    ],
    "bullets": [
      "Repo + Backlog (#1, #6)"
    ],
    "erfolg": "Board existiert, 36 Issues sichtbar, gelabelt.",
    "prompt": "Ich bin Leon. Heute richte ich das Kanban-Board ein.\nBitte hilf mir:\n1. Board „Sprint 1\" mit Spalten Open/InProgress/InReview/Blocked/Done\n(via status/-Labels).\n2. Anleitung wie ich die 36 Issues aus backlog/sprint-1.md halbautomatisch\nanlege.\n3. Markdown-Template für Issue-Titel + Beschreibung zum Schnellkopieren.\n4. Bulk-Edit für Labels.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-16",
    "sprintNum": "01",
    "taskNum": "16",
    "welle": 4,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Token-Strategie für StudyBuddy",
    "prereqs": [
      "08"
    ],
    "bullets": [
      "docs/ai-models.md (#8)"
    ],
    "erfolg": "ai-models.md hat Token-Strategie-Abschnitt.",
    "prompt": "Ich bin Leon. Heute ergänze ich docs/ai-models.md um „Token-Strategie\".\nBitte hilf mir:\n1. Erkläre Tokens in 3 Sätzen.\n2. Schreib mir den Markdown-Abschnitt als Code-Block zum Anhängen:\n- Tokens pro 50-Seiten-PDF (Schätzung)\n- Kontextfenster pro Modell\n- Ab welcher PDF-Größe Chunking?\n- Tokens pro Lernsession (System + Skript + Q&A;)\n3. Git-Befehle für feature/token-strategy.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-17",
    "sprintNum": "01",
    "taskNum": "17",
    "welle": 4,
    "who": "Taycir",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wöchentliche Meetings + Begrüßungs-Mail an Dozent",
    "prereqs": [],
    "bullets": [
      "Kalender + Zoom"
    ],
    "erfolg": "Doku gemerged, Mail bereit zum Senden.",
    "prompt": "Ich bin Taycir. Heute plane ich Meeting-Kadenz + Mail an Dozent.\nBitte hilf mir:\n1. Schreib docs/meeting-cadence.md als Code-Block mit:\n- Team-Meeting (Di 10:00, 30 Min, Zoom)\n- Dozenten-Update (Di 9:00, 15 Min)\n- Sprint-Review (letzter Fr im Monat, 45 Min, Demo)\n- Sprint-Retro (30 Min, Start/Stop/Continue)\nPro Meeting: Agenda-Vorlage.\n2. Schreib eine höfliche Begrüßungs-Mail an Tobias Urban als Code-Block.\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-18",
    "sprintNum": "01",
    "taskNum": "18",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Prompt-Engineering 101 für das gesamte Team",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "docs/prompt-engineering-101.md verständlich für Team.",
    "prompt": "Ich bin Taycir. Heute schreibe ich eine Einführung in Prompt Engineering.\nBitte hilf mir:\n1. Schreib docs/prompt-engineering-101.md als Code-Block. Sektionen\n(je max. 5 Sätze):\n1) Was ist ein Prompt?\n2) System / User / Assistant\n3) Few-shot vs. Zero-shot\n4) JSON-Output erzwingen\n5) Chain-of-Thought\n6) Häufige Fehler\n7) Qualitäts-Tests\n2. 1 TS-Code-Beispiel pro Konzept (Anthropic SDK).\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-19",
    "sprintNum": "01",
    "taskNum": "19",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Landing-Page bauen (Hero · Wie · Zielgruppen · Footer)",
    "prereqs": [
      "07",
      "09",
      "10"
    ],
    "bullets": [
      "Wireframe + UI-Primitive + Tokens"
    ],
    "erfolg": "Landing sichtbar, Lighthouse > 90, Tests grün.",
    "prompt": "Ich bin Ayoub. Heute baue ich die finale Landing-Page.\nBitte hilf mir:\n1. Schau docs/wireframes/landing.html an.\n2. Schreib src/app/page.tsx als Code-Block mit:\n- H1 „Lerne, indem du erklärst.\" (Serif, 5xl/3xl) +\nUntertitel + Button primary lg\n- 3 Schritt-Karten\n- 3 Karten\n3. Neue Komponenten als separate Code-Blöcke.\n4. Mobile-first ab 375px erklären.\n5. Snapshot-Test pro neuer Komponente.\n6. Git-Befehle für feature/landing-page.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-20",
    "sprintNum": "01",
    "taskNum": "20",
    "welle": 5,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Login-Page bauen (statisches Formular)",
    "prereqs": [
      "09",
      "10"
    ],
    "bullets": [
      "UI-Primitive + Tokens"
    ],
    "erfolg": "/login erreichbar, kein echtes Anmelden.",
    "prompt": "Ich bin Sara. Heute baue ich die Login-Seite (ohne echte Auth).\nBitte hilf mir:\n1. Erkläre Next.js Route-Groups (auth).\n2. Schreib src/app/(auth)/layout.tsx als Code-Block.\n3. Schreib src/app/(auth)/login/page.tsx als Code-Block:\nCard · H1 · Email-Input · Password-Input · Button · Register-Link.\n4. Toast „Wird in Sprint 5 verkabelt\" bei Submit.\n5. Snapshot-Test.\n6. Git-Befehle für feature/login-page.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-21",
    "sprintNum": "01",
    "taskNum": "21",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DoD-Kriterium (DB erreichbar)",
    "title": "Health-Check-Endpoint + documents-Schema",
    "prereqs": [
      "13"
    ],
    "bullets": [
      "Supabase-Client (#13)"
    ],
    "erfolg": "/api/health = {ok: true, db: 'ok'}, documents-Tabelle da.",
    "prompt": "Ich bin Abder. Heute baue ich Health-Check + documents-Schema.\nBitte hilf mir:\n1. Schreib src/app/api/health/route.ts als Code-Block (GET, prüft DB,\nantwortet {ok, db, timestamp}, 503 bei Fehler).\n2. Schreib supabase/migrations/0002_documents_schema.sql als Code-Block\n(documents-Tabelle mit user_id ref, filename, file_path, extracted_text,\nstatus, created_at, updated_at + RLS-Policies).\n3. SQL im Supabase-Editor ausführen — Schritt für Schritt.\n4. Update src/lib/supabase/types.ts mit Document-Typ.\n5. Git-Befehle für feature/documents-schema.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-22",
    "sprintNum": "01",
    "taskNum": "22",
    "welle": 5,
    "who": "Ayoub",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Ende",
    "title": "Jest + RTL + Snapshot-Tests Setup",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "UI-Primitive (#9)"
    ],
    "erfolg": "npm test grün, mind. 8 Snapshots.",
    "prompt": "Ich bin Ayoub. Heute setze ich Jest + RTL auf.\nBitte hilf mir:\n1. npm-Install-Befehl (jest, jest-environment-jsdom, RTL,\njest-dom, ts-jest, @types/jest).\n2. jest.config.ts als Code-Block.\n3. jest.setup.ts als Code-Block.\n4. package.json scripts: test, test:watch.\n5. __tests__/ui/Button.test.tsx (Snapshots aller Varianten×Größen).\n6. __tests__/ui/Input.test.tsx (Snapshots leer/Label/Error).\n7. Git-Befehle für feature/jest-setup.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-23",
    "sprintNum": "01",
    "taskNum": "23",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "MR-Template erweitern + README finalisieren",
    "prereqs": [
      "01"
    ],
    "bullets": [
      "Repo (#1)"
    ],
    "erfolg": "MR-Template + README onboarding-tauglich.",
    "prompt": "Ich bin Sara. Heute härte ich Repo-Hygiene.\nBitte hilf mir:\n1. .gitlab/merge_request_templates/default.md als Code-Block:\nWas ändert sich? · Warum? · Wie getestet? · Screenshots ·\nReviewer-Checkliste (DSGVO, Secrets, Naming, Performance).\n2. README.md als Code-Block: Projekt · Tech-Stack · Setup · Scripts ·\nTeam · Lizenz.\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-24",
    "sprintNum": "01",
    "taskNum": "24",
    "welle": 6,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Code-Review-Guidelines schreiben",
    "prereqs": [
      "01"
    ],
    "bullets": [
      "—"
    ],
    "erfolg": "docs/code-review-guidelines.md gemerged.",
    "prompt": "Ich bin Leon. Heute schreibe ich Code-Review-Regeln.\nBitte hilf mir:\n1. Schreib docs/code-review-guidelines.md als Code-Block mit:\n- MR-Größe < 400 Zeilen\n- Review-Checkliste\n- Tone: konstruktiv, mit Vorschlag\n- 24h-SLA\n- Rotation: FE ↔ Sara/Ayoub, BE Abder+Tandem, KI Leon ↔ Taycir.\n2. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-25",
    "sprintNum": "01",
    "taskNum": "25",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Themen-Extraktions-Research (Vorbereitung Sprint 3)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Research-Doku mit Quellen + Edge-Cases.",
    "prompt": "Ich bin Taycir. Heute recherchiere ich Themen-Extraktion für Sprint 3.\nBitte hilf mir:\n1. Schreib docs/prompts/topic-extraction-research.md als Code-Block:\n- Forschung zu 'topic extraction' (3 Quellen)\n- Bloom-Stufen für unsere Fragen (Verstehen + Anwenden)\n- Definition „Hauptthema\"\n- Beispiel Dijkstra: 4-6 Themen, 2-3 Concepts\n- Edge-Cases (Diagramme, mehrsprachig, kurz).\n2. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-26",
    "sprintNum": "01",
    "taskNum": "26",
    "welle": 6,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Drei Prompt-Entwürfe für Themen-Extraktion",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Research (#25)"
    ],
    "erfolg": "3 Prompts + Eval-Plan dokumentiert.",
    "prompt": "Ich bin Leon. Mit Taycir entwerfe ich 3 Prompt-Varianten.\nBitte hilf mir:\n1. Schreib docs/prompts/topic-extraction-v1.md als Code-Block.\nPro Variante: System-Message, User-Message-Vorlage mit\n{{document_text}}, JSON-Schema { topics: [{title, summary,\nkey_concepts}] }.\nA. Direkter Output B. Chain-of-Thought C. Few-Shot (2 Beispiele).\n2. Eval-Plan für Sprint 3 (Metriken: Vollständigkeit, Granularität,\nLatenz, Tokens/EUR).\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-27",
    "sprintNum": "01",
    "taskNum": "27",
    "welle": 6,
    "who": "Taycir",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Risiko-Log mit 6 Hauptrisiken",
    "prereqs": [],
    "bullets": [
      "Sprintplan-Risiko-Seite"
    ],
    "erfolg": "docs/risk-log.md mit 6 Risiken + Maßnahmen.",
    "prompt": "Ich bin Taycir. Heute schreibe ich das Risiko-Log.\nBitte hilf mir:\n1. Schreib docs/risk-log.md als Code-Block mit Tabelle:\nID · Risiko · Wahrscheinlichkeit · Auswirkung · Owner · Maßnahme · Status\n2. Sechs Risiken aus Sprintplan: API-Kosten, PDF-Extraktion,\nTeammitglied-Ausfall, KI-Qualität, DSGVO, Klausurphase.\nPro Risiko: 2 konkrete Maßnahmen + Owner.\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-28",
    "sprintNum": "01",
    "taskNum": "28",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Landing-Page polieren + Lighthouse > 90",
    "prereqs": [
      "19"
    ],
    "bullets": [
      "Landing-Page (#19)"
    ],
    "erfolg": "Lighthouse > 90, polished UI.",
    "prompt": "Ich bin Ayoub. Heute poliere ich die Landing-Page.\nBitte hilf mir:\n1. 375px-Mobile-Check: Tailwind-Diffs falls etwas überläuft.\n2. Schreib docs/sprint-reviews/lighthouse-w4.md mit Eintrags-Vorlage.\nErkläre wie ich Lighthouse in Chrome laufen lasse.\n3. Visuelle Politur: Hover-Animation CTA, shadow-sm auf Karten,\nsanftere Section-Übergänge — gib mir die Tailwind-Diffs.\n4. Git-Befehle für feature/landing-polish.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-29",
    "sprintNum": "01",
    "taskNum": "29",
    "welle": 7,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Login-Page auf 4 Auflösungen prüfen + Fixes",
    "prereqs": [
      "20"
    ],
    "bullets": [
      "Login-Page (#20)"
    ],
    "erfolg": "Login sauber auf 4 Auflösungen.",
    "prompt": "Ich bin Sara. Heute prüfe ich Login responsive.\nBitte hilf mir:\n1. Schreib docs/responsive-checks-login.md als Code-Block (Tabelle:\nAuflösung · Probleme · Fixes). Auflösungen 375 · 414 · 768 · 1280.\n2. Wie simuliere ich Auflösungen in Chrome DevTools.\n3. Tailwind-Klassen-Diffs für gefundene Probleme.\n4. Snapshot-Tests aktualisieren falls nötig.\n5. Git-Befehle für feature/login-responsive.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-30",
    "sprintNum": "01",
    "taskNum": "30",
    "welle": 7,
    "who": "Ayoub",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "CI-Status verifizieren + npm run check:all",
    "prereqs": [
      "14"
    ],
    "bullets": [
      "CI-Pipeline (#14)"
    ],
    "erfolg": "Alle MRs grün, ci-status-w4.md ausgefüllt.",
    "prompt": "Ich bin Ayoub. Heute prüfe ich alle MRs auf grüne CI.\nBitte hilf mir:\n1. Schreib docs/ci-status-w4.md mit Tabellen-Vorlage (Branch · Commit\n· Lint · Typecheck · Build · Test · Status).\n2. Wie ich offene MRs im GitLab-UI finde.\n3. Optional: scripts/check-mrs.sh als Code-Block (curl + GitLab REST).\n4. npm run check:all lokal vor Push.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-31",
    "sprintNum": "01",
    "taskNum": "31",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DoD-Kriterium (Live-URL)",
    "title": "Vercel-Projekt einrichten + Auto-Deploy",
    "prereqs": [
      "13",
      "19",
      "21"
    ],
    "bullets": [
      "Landing + Health-Check + Supabase"
    ],
    "erfolg": "https://studybuddy.vercel.app live, /api/health = ok.",
    "prompt": "Ich bin Abder. Heute stelle ich StudyBuddy auf Vercel live.\nBitte führe mich durch:\n1. Vercel-Projekt mit Team-E-Mail erstellen + GitLab-Repo verknüpfen.\n2. Branch-Settings: Production = main, Preview = develop + feature/*.\n3. Env-Variablen für Production + Preview setzen\n(NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY).\n4. Verifizieren: Push auf develop → Preview-Deploy, /api/health = ok,\nLanding < 2 Sek.\n5. Schreib docs/vercel-setup.md als Code-Block.\n6. README.md-Snippet für Vercel-Status-Badge.\n7. Git-Befehle für feature/vercel-deploy.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-32",
    "sprintNum": "01",
    "taskNum": "32",
    "welle": 7,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Pair-Programming-Plan mit Ayoub",
    "prereqs": [
      "19"
    ],
    "bullets": [
      "Landing-Page (#19)"
    ],
    "erfolg": "Pair-Programming-Plan bereit.",
    "prompt": "Ich bin Leon. Ich will FE-Pair-Programming mit Ayoub.\nBitte hilf mir:\n1. Schreib docs/pair-programming/leon-onboarding.md als Code-Block mit\n3 kleinen FE-Aufgaben:\na) Footer + Datenschutz-Link\nb) Hero-CTA-Button-Variante anpassen\nc) als UI-Primitive bauen\nPro Aufgabe: Dateien, Tailwind-Klassen, Akzeptanz.\n2. Driver/Navigator-Rotation alle 20 Min.\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-33",
    "sprintNum": "01",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Review",
    "title": "Sprint-Review-Folien + Retrospektive vorbereiten",
    "prereqs": [],
    "bullets": [
      "Status aller 5 Teammitglieder"
    ],
    "erfolg": "Folien-Skript + Retro-Vorlage bereit.",
    "prompt": "Ich bin Leon. Heute bereite ich Sprint-Review-Folien vor.\nBitte hilf mir:\n1. Schreib docs/sprint-reviews/sprint-1-review.md als Code-Block —\n6 Folien: Sprintziel · Fortschritte · Live-Demo-Verteilung ·\nHerausforderungen · Learnings · Nächste Schritte (Sprint 2).\n2. Schreib sprint-1-retro.md mit Start/Stop/Continue-Vorlage.\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-34",
    "sprintNum": "01",
    "taskNum": "34",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Review",
    "title": "Sprint-1-Testbericht (Coverage · Bugs · Fazit)",
    "prereqs": [
      "22",
      "30"
    ],
    "bullets": [
      "Jest + CI-Status"
    ],
    "erfolg": "Testbericht abgabefähig.",
    "prompt": "Ich bin Sara. Heute schreibe ich den Sprint-1-Testbericht.\nBitte hilf mir:\n1. Coverage-Werte aus npm test -- --coverage extrahieren.\n2. Schreib docs/sprint-reviews/sprint-1-test-report.md als Code-Block:\nExecutive Summary · Coverage · Test-Inventar · offene Bugs ·\nRisiken für Sprint 2 · DoD-Erreichung · Go/No-Go.\n3. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-35",
    "sprintNum": "01",
    "taskNum": "35",
    "welle": 8,
    "who": "Taycir",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Review",
    "title": "Demo-Skript für 45-Minuten Sprint-Review",
    "prereqs": [
      "33"
    ],
    "bullets": [
      "Sprint-Review-Folien (#33)"
    ],
    "erfolg": "Minutengenaues Demo-Skript.",
    "prompt": "Ich bin Taycir. Heute schreibe ich das Demo-Skript.\nBitte hilf mir:\n1. Schreib docs/sprint-reviews/sprint-1-demo-script.md als Code-Block\nmit Minuten-Slots (0–5 Begrüßung Leon · 5–10 Landing Ayoub · 10–15\nLogin Sara · 15–20 Backend Abder · 20–25 Anthropic Taycir · 25–30\nBoard Leon · 30–35 Challenges · 35–40 Sprint-2 · 40–45 Q&A;).\nPro Slot: was wird gezeigt, was gesagt, Backup-Plan.\n2. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s1-36",
    "sprintNum": "01",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "DSGVO-Notizen für Anthropic-API-Nutzung",
    "prereqs": [],
    "bullets": [
      "docs/anthropic-setup.md (#2)"
    ],
    "erfolg": "DSGVO-Notizen gemerged.",
    "prompt": "Ich bin Taycir. Heute schreibe ich DSGVO-Notizen.\nBitte hilf mir:\n1. Schreib docs/legal/anthropic-dsgvo-notes.md als Code-Block:\n1) Welche Daten senden wir? 2) Welche nicht?\n3) AVV-Status (Link recherchieren) 4) Datenresidenz\n5) Maßnahmen (Upload-Hinweis, keine PII in Logs, 90-Tage-Retention)\n6) Offene Fragen für Hochschul-DSB.\n2. Git-Befehle.\nErkläre auf Deutsch."
  },
  {
    "id": "s2-01",
    "sprintNum": "02",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-Planung + User-Journey-Workshop",
    "prereqs": [],
    "bullets": [
      "Sprint-1-Review-Ergebnisse"
    ],
    "erfolg": "Sprint-2-Planung dokumentiert, User-Journey klar.",
    "prompt": "Ich bin Leon. Heute moderiere ich Sprint-2-Planung + User-Journey-Workshop.\nBitte hilf mir:\n1. Schreib docs/sprint-reviews/sprint-2-planning.md als Code-Block (Sprintziel, DoD, Aufgaben-Verteilung).\n2. Schreib docs/user-journeys/upload-to-answer.md als Code-Block (7-Schritt-Journey von Login bis Antwort, mit Touchpoints).\n3. Git-Befehle für feature/sprint-2-planning."
  },
  {
    "id": "s2-02",
    "sprintNum": "02",
    "taskNum": "02",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert Upload-Komponente",
    "title": "Supabase-Storage-Bucket „pdfs\" + Upload-API-Route",
    "prereqs": [],
    "bullets": [
      "Supabase-Projekt (S1)"
    ],
    "erfolg": "/api/upload akzeptiert PDFs, speichert sie + DB-Eintrag.",
    "prompt": "Ich bin Abder. Heute richte ich Storage + Upload-API ein.\nBitte hilf mir:\n1. Anleitung: Bucket „pdfs\" in Supabase anlegen (Privacy: privat).\n2. Schreib src/app/api/upload/route.ts als Code-Block (POST mit\nFormData, Größenlimit 20 MB, nur application/pdf, Upload in Bucket,\nInsert in documents-Tabelle).\n3. Schreib supabase/migrations/0003_storage_policies.sql für RLS.\n4. Git-Befehle für feature/upload-api."
  },
  {
    "id": "s2-03",
    "sprintNum": "02",
    "taskNum": "03",
    "welle": 1,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor allen KI-Aufgaben",
    "title": "Anthropic-SDK integrieren + erster API-Call",
    "prereqs": [],
    "bullets": [
      "Anthropic-API-Key (S1)"
    ],
    "erfolg": "anthropic-Client funktioniert, Testfrage beantwortet.",
    "prompt": "Ich bin Taycir. Heute integriere ich das Anthropic-SDK.\nBitte hilf mir:\n1. npm-Befehl für @anthropic-ai/sdk.\n2. Schreib src/lib/anthropic/client.ts als Code-Block (Anthropic\nClient mit ANTHROPIC_API_KEY aus env, Helper sendMessage).\n3. Schreib einen Test-Script test-anthropic.ts der „Hallo, wer bist du?\" sendet.\n4. Git-Befehle für feature/anthropic-sdk."
  },
  {
    "id": "s2-04",
    "sprintNum": "02",
    "taskNum": "04",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "PDF-Upload-Komponente (Drag & Drop)",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Upload-API (#2)"
    ],
    "erfolg": "Upload-Komponente nutzbar, Datei landet im Bucket.",
    "prompt": "Ich bin Ayoub. Heute baue ich die Upload-Komponente.\nBitte hilf mir:\n1. Schreib src/components/upload/PdfUpload.tsx als Code-Block:\nDrag & Drop + Datei-Auswahl + Vorschau Dateiname + Submit.\n2. POST an /api/upload, Erfolgs-Toast.\n3. Snapshot-Test.\n4. Git-Befehle für feature/upload-component."
  },
  {
    "id": "s2-05",
    "sprintNum": "02",
    "taskNum": "05",
    "welle": 2,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Upload-Progress-UI + Loading-States",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Upload-Komponente (#4)"
    ],
    "erfolg": "Upload zeigt Fortschritt, Fehler werden klar angezeigt.",
    "prompt": "Ich bin Sara. Heute ergänze ich UX rund um den Upload.\nBitte hilf mir:\n1. Erweitere PdfUpload um eine Progress-Bar (via fetch + ReadableStream\noder XHR).\n2. Loading-Spinner + Disabled-State für den Button.\n3. Klare Fehlermeldung bei Fehler (zu groß, falscher Typ).\n4. Git-Befehle für feature/upload-ux."
  },
  {
    "id": "s2-06",
    "sprintNum": "02",
    "taskNum": "06",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor E2E-Tests",
    "title": "Test-Fixtures: 5 Beispiel-PDFs sammeln",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "5 Beispiel-PDFs versioniert, Doku dazu.",
    "prompt": "Ich bin Sara. Heute lege ich unsere Test-PDF-Sammlung an.\nBitte hilf mir:\n1. Welche Eigenschaften sollten die 5 PDFs haben? (Mindestens: kurz,\nlang, mit Bildern, gescannt, mehrsprachig).\n2. Schreib docs/test-fixtures.md als Code-Block mit Beschreibung.\n3. Welcher Ordner im Repo (tests/fixtures/pdfs/)?\n4. Git-Befehle für feature/test-fixtures."
  },
  {
    "id": "s2-07",
    "sprintNum": "02",
    "taskNum": "07",
    "welle": 2,
    "who": "Ayoub",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Unit-Tests für Upload-Komponente",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Upload-Komponente (#4)"
    ],
    "erfolg": "Mind. 4 Unit-Tests für Upload, alle grün.",
    "prompt": "Ich bin Ayoub. Heute teste ich die Upload-Komponente.\nBitte hilf mir:\n1. Schreib __tests__/upload/PdfUpload.test.tsx als Code-Block:\n- rendert\n- akzeptiert PDF (Mock)\n- lehnt zu große Dateien ab\n- zeigt Fehlermeldung\n2. Git-Befehle für feature/upload-tests."
  },
  {
    "id": "s2-08",
    "sprintNum": "02",
    "taskNum": "08",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Budget-Tracking-Dashboard für API-Kosten",
    "prereqs": [],
    "bullets": [
      "Anthropic-Console-Zugang"
    ],
    "erfolg": "Budget-Tracking-Doku, Wochenrhythmus etabliert.",
    "prompt": "Ich bin Leon. Heute setze ich unser API-Kosten-Tracking auf.\nBitte hilf mir:\n1. Anleitung: wie ich in Anthropic-Console täglich/wöchentlich die\nKosten ablese.\n2. Schreib docs/budget-tracking.md als Code-Block (Vorlage für\nwöchentliche Erfassung: Datum · Verbrauch · Trend · Maßnahme).\n3. Slack-Reminder-Vorschlag: jeden Montag 9:00 Budget-Check.\n4. Git-Befehle."
  },
  {
    "id": "s2-09",
    "sprintNum": "02",
    "taskNum": "09",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor KI-Anbindung",
    "title": "PDF-Textextraktion (pdf-parse) + Text in DB speichern",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Upload-API (#2)"
    ],
    "erfolg": "Hochgeladene PDFs haben extracted_text in DB.",
    "prompt": "Ich bin Abder. Heute extrahiere ich Text aus hochgeladenen PDFs.\nBitte hilf mir:\n1. npm-Install pdf-parse.\n2. Erweitere /api/upload (oder neue /api/extract) um nach dem Upload\nden Text zu extrahieren und in documents.extracted_text zu speichern.\n3. Setze status='processing' während Extraktion, dann 'ready'.\n4. Schreib als Code-Block.\n5. Git-Befehle für feature/pdf-extract."
  },
  {
    "id": "s2-10",
    "sprintNum": "02",
    "taskNum": "10",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Dokumenten-Listenansicht",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Upload funktioniert (#4)"
    ],
    "erfolg": "/documents zeigt eigene Dokumente mit Status.",
    "prompt": "Ich bin Ayoub. Heute baue ich die Liste aller Dokumente.\nBitte hilf mir:\n1. Schreib src/app/(app)/documents/page.tsx als Code-Block — listet\nalle Documents des Users (Tabelle: Dateiname · Status · Upload-Datum).\n2. Status-Badge (uploaded/processing/ready/failed) mit Farbe.\n3. Klick auf Eintrag öffnet Detail-Seite (Platzhalter).\n4. Git-Befehle für feature/documents-list."
  },
  {
    "id": "s2-11",
    "sprintNum": "02",
    "taskNum": "11",
    "welle": 3,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Test-Stage in CI-Pipeline ergänzen",
    "prereqs": [],
    "bullets": [
      "CI-Pipeline (S1)"
    ],
    "erfolg": "CI führt Tests + Coverage automatisch aus.",
    "prompt": "Ich bin Sara. Heute erweitere ich unsere CI-Pipeline.\nBitte hilf mir:\n1. Wie ich in .gitlab-ci.yml einen Test-Stage ergänze, der\n`npm test -- --coverage` ausführt.\n2. Coverage als Artifact speichern.\n3. Coverage-Badge im README integrieren.\n4. Git-Befehle für feature/ci-tests."
  },
  {
    "id": "s2-12",
    "sprintNum": "02",
    "taskNum": "12",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor E2E-Test",
    "title": "Erstes Prompt-Template (Q&A; zum Text)",
    "prereqs": [
      "03",
      "09"
    ],
    "bullets": [
      "Anthropic-SDK + extrahierter Text"
    ],
    "erfolg": "Erstes Q&A-Prompt; funktioniert mit Testdaten.",
    "prompt": "Ich bin Taycir. Heute baue ich das erste Q&A-Prompt.;\nBitte hilf mir:\n1. Schreib src/lib/anthropic/prompts/qa-on-text.ts als Code-Block:\n- System-Message: „Beantworte Fragen ausschließlich auf Basis des\nTexts. Wenn unklar, sag das.\"\n- User-Template mit {{document_text}} + {{question}}.\n- JSON-Output: { answer: string, confidence: 'high'|'medium'|'low' }.\n2. Schreib einen Test-Aufruf-Beispiel-Script.\n3. Git-Befehle für feature/qa-prompt."
  },
  {
    "id": "s2-13",
    "sprintNum": "02",
    "taskNum": "13",
    "welle": 3,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Error-State-UI-Komponenten",
    "prereqs": [],
    "bullets": [
      "UI-Primitive (S1)"
    ],
    "erfolg": "ErrorBox + EmptyState einsatzbereit.",
    "prompt": "Ich bin Sara. Heute baue ich wiederverwendbare Error-Komponenten.\nBitte hilf mir:\n1. Schreib src/components/ui/ErrorBox.tsx (rote Variante + warnende\ngelbe Variante, mit Icon + Titel + Body + optionalem Retry-Button).\n2. Schreib src/components/ui/EmptyState.tsx (zentriert, mit Icon +\nTitel + Beschreibung + optionalem Action-Button).\n3. Snapshot-Tests.\n4. Git-Befehle für feature/error-empty-states."
  },
  {
    "id": "s2-14",
    "sprintNum": "02",
    "taskNum": "14",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "API-Kosten-Monitoring + Dozenten-Update",
    "prereqs": [
      "08"
    ],
    "bullets": [
      "Budget-Tracking (#8)"
    ],
    "erfolg": "Dozenten-Update versendet, Kostenstand dokumentiert.",
    "prompt": "Ich bin Leon. Heute kommuniziere ich Wochenstatus + Kosten.\nBitte hilf mir:\n1. Schreib einen Dozenten-Update-Mail-Entwurf als Code-Block.\n2. Schreib docs/sprint-reviews/sprint-2-w2-update.md mit\nFortschritt/Kosten/Blocker.\n3. Git-Befehle."
  },
  {
    "id": "s2-15",
    "sprintNum": "02",
    "taskNum": "15",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "DoD-kritisch",
    "title": "End-to-End: PDF \u0000 Text \u0000 Claude-Antwort",
    "prereqs": [
      "09",
      "12"
    ],
    "bullets": [
      "PDF-Extraktion + Q&A-Prompt;"
    ],
    "erfolg": "PDF → Text → Claude-Antwort funktioniert E2E.",
    "prompt": "Ich bin Taycir. Heute verbinde ich alles zum End-to-End-Flow.\nBitte hilf mir:\n1. Schreib src/app/api/ask/route.ts als Code-Block: POST mit\n{ documentId, question } → liest extracted_text aus DB → ruft\nAnthropic mit qa-on-text-Prompt → gibt Antwort zurück.\n2. Token-Counting + Logging der Kosten pro Anfrage.\n3. Test-Script: PDF hochladen, Frage stellen, Antwort prüfen.\n4. Git-Befehle für feature/ask-endpoint."
  },
  {
    "id": "s2-16",
    "sprintNum": "02",
    "taskNum": "16",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Dokumenten-Detailseite (Text-Preview)",
    "prereqs": [
      "10"
    ],
    "bullets": [
      "Dokumenten-Liste (#10)"
    ],
    "erfolg": "Detail-Seite zeigt Text und erlaubt erste Frage.",
    "prompt": "Ich bin Ayoub. Heute baue ich die Detail-Seite eines Dokuments.\nBitte hilf mir:\n1. Schreib src/app/(app)/documents/[id]/page.tsx als Code-Block.\n2. Zeigt: Metadaten, extracted_text (scrollbar), Status.\n3. Eingabefeld „Stelle eine Frage zu diesem Dokument\" → POST /api/ask\n→ zeigt Antwort.\n4. Git-Befehle für feature/document-detail."
  },
  {
    "id": "s2-17",
    "sprintNum": "02",
    "taskNum": "17",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "E2E-Test des Upload-Flows in Playwright",
    "prereqs": [
      "04",
      "09"
    ],
    "bullets": [
      "Upload (#4) + Extract (#9)"
    ],
    "erfolg": "Upload-E2E-Test grün in CI.",
    "prompt": "Ich bin Sara. Heute schreibe ich den E2E-Upload-Test.\nBitte hilf mir:\n1. Schreib tests/e2e/upload.spec.ts als Code-Block:\n- Login (Mock oder echter)\n- Navigiere zu /documents\n- Lade eine kleine PDF hoch\n- Warte auf Status='ready'\n- Prüfe dass extracted_text befüllt ist\n2. Git-Befehle."
  },
  {
    "id": "s2-18",
    "sprintNum": "02",
    "taskNum": "18",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "OCR-Fallback für gescannte PDFs (Recherche)",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "PDF-Extraktion (#9)"
    ],
    "erfolg": "OCR-Empfehlung dokumentiert.",
    "prompt": "Ich bin Abder. Heute recherchiere ich OCR-Optionen für gescannte PDFs.\nBitte hilf mir:\n1. Recherchiere: Tesseract.js, Anthropic Vision, andere Optionen.\n2. Schreib docs/ocr-research.md als Code-Block: Vergleich, Kosten,\nEmpfehlung.\n3. Git-Befehle."
  },
  {
    "id": "s2-19",
    "sprintNum": "02",
    "taskNum": "19",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Upload-UX polieren (Empty-States, Bestätigungen)",
    "prereqs": [
      "04",
      "13"
    ],
    "bullets": [
      "Upload + Error-States"
    ],
    "erfolg": "Upload-UX rund, kein Verwirren mehr.",
    "prompt": "Ich bin Ayoub. Heute poliere ich den Upload-Flow.\nBitte hilf mir:\n1. EmptyState wenn noch keine Dokumente hochgeladen wurden.\n2. Success-Toast nach erfolgreichem Upload mit Link zur Detail-Seite.\n3. Disabled State des Upload-Buttons während Verarbeitung.\n4. Tailwind-Diffs.\n5. Git-Befehle für feature/upload-polish."
  },
  {
    "id": "s2-20",
    "sprintNum": "02",
    "taskNum": "20",
    "welle": 5,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Mobile Responsive-Layout für Upload + Detail",
    "prereqs": [
      "04",
      "16"
    ],
    "bullets": [
      "Upload + Detail-Seite"
    ],
    "erfolg": "Upload-Flow auch mobil nutzbar.",
    "prompt": "Ich bin Sara. Heute mache ich Upload + Detail mobile-tauglich.\nBitte hilf mir:\n1. Welche Tailwind-Klassen ändern für 375px-Breite (Stack statt Spalten).\n2. Detail-Seite: extracted_text scrollbar in einer Höhen-begrenzten Box.\n3. Git-Befehle für feature/upload-mobile."
  },
  {
    "id": "s2-21",
    "sprintNum": "02",
    "taskNum": "21",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Prompt-Patterns im Repo dokumentieren",
    "prereqs": [
      "15"
    ],
    "bullets": [
      "Q&A-Prompt; produktiv (#15)"
    ],
    "erfolg": "Prompt-Patterns dokumentiert.",
    "prompt": "Ich bin Taycir. Heute dokumentiere ich unsere Prompt-Patterns.\nBitte hilf mir:\n1. Schreib docs/prompts/patterns.md als Code-Block:\n- System+User+JSON-Output Pattern\n- Token-Counting-Helper\n- Wann Sonnet vs Haiku\n- Wo Eval-Sets liegen\n2. Git-Befehle."
  },
  {
    "id": "s2-22",
    "sprintNum": "02",
    "taskNum": "22",
    "welle": 5,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Kosten-pro-Upload-Bericht mit Taycir",
    "prereqs": [
      "15"
    ],
    "bullets": [
      "E2E-Flow (#15)"
    ],
    "erfolg": "Kosten pro Upload + Q&A; dokumentiert.",
    "prompt": "Ich bin Leon. Heute analysiere ich die Kosten pro Upload mit Taycir.\nBitte hilf mir:\n1. Lade ein Beispiel-PDF hoch, stelle 5 Fragen, miss Tokens & EUR.\n2. Schreib docs/cost-analysis/upload-and-qa.md als Code-Block:\nDatei · Tokens In · Tokens Out · EUR-Wert · Hochrechnung pro 100 User.\n3. Git-Befehle."
  },
  {
    "id": "s2-23",
    "sprintNum": "02",
    "taskNum": "23",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Performance-Test mit großen PDFs",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "PDF-Extraktion (#9)"
    ],
    "erfolg": "Performance-Daten + Optimierungs-Vorschlag.",
    "prompt": "Ich bin Abder. Heute teste ich Performance mit großen PDFs.\nBitte hilf mir:\n1. Lade 50-Seiten- und 100-Seiten-PDFs hoch.\n2. Miss Upload-Zeit + Extraktions-Zeit + DB-Speichergröße.\n3. Schreib docs/perf-test.md als Code-Block.\n4. Falls > 30 Sek: Vorschlag für Async-Verarbeitung (Edge Function /\nWorker).\n5. Git-Befehle."
  },
  {
    "id": "s2-24",
    "sprintNum": "02",
    "taskNum": "24",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Regressions-Checkliste für Sprint-2-Demo",
    "prereqs": [],
    "bullets": [
      "Alle Features bisher"
    ],
    "erfolg": "Regressions-Checkliste bereit.",
    "prompt": "Ich bin Sara. Heute schreibe ich die Demo-Regression-Checkliste.\nBitte hilf mir:\n1. Schreib docs/sprint-reviews/sprint-2-regression.md als Code-Block —\nCheckliste mit Schritten: Sprint-1-Pfade (Login, Landing) +\nSprint-2-Pfade (Upload, Detail, Frage stellen).\n2. Git-Befehle."
  },
  {
    "id": "s2-25",
    "sprintNum": "02",
    "taskNum": "25",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Review",
    "title": "Sprint-2-Testbericht",
    "prereqs": [
      "17",
      "24"
    ],
    "bullets": [
      "E2E + Regressions-Checkliste"
    ],
    "erfolg": "Testbericht abgabefähig.",
    "prompt": "Ich bin Sara. Heute schreibe ich den Sprint-2-Testbericht.\nBitte hilf mir:\n1. Schreib docs/sprint-reviews/sprint-2-test-report.md als Code-Block:\nCoverage · neue Tests · Bugs · Performance · Risiken.\n2. Git-Befehle."
  },
  {
    "id": "s2-26",
    "sprintNum": "02",
    "taskNum": "26",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Demo-Day Politur (UI-Feinschliff)",
    "prereqs": [
      "19",
      "20"
    ],
    "bullets": [
      "Upload + Mobile (#19, #20)"
    ],
    "erfolg": "Demo-tauglich, Lighthouse > 90.",
    "prompt": "Ich bin Ayoub. Heute mache ich letzte Politur vor Sprint-2-Demo.\nBitte hilf mir:\n1. Lighthouse-Check der neuen Seiten.\n2. Visuelle Konsistenz: alle neuen Komponenten nutzen Design-Tokens?\n3. Loading-Skeletons wo noch fehlend.\n4. Tailwind-Diffs.\n5. Git-Befehle."
  },
  {
    "id": "s2-27",
    "sprintNum": "02",
    "taskNum": "27",
    "welle": 6,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Review",
    "title": "Sprint-2-Demo vorbereiten",
    "prereqs": [
      "25",
      "26"
    ],
    "bullets": [
      "Testbericht + Politur"
    ],
    "erfolg": "Demo-Skript + Folien bereit.",
    "prompt": "Ich bin Leon. Heute bereite ich die Sprint-2-Demo vor.\nBitte hilf mir:\n1. Schreib docs/sprint-reviews/sprint-2-demo-script.md als Code-Block —\n45-Min-Drehbuch mit Demo-Slots pro Person, Backup-Plan.\n2. Schreib docs/sprint-reviews/sprint-2-review.md (6-Punkte-Folien).\n3. Git-Befehle."
  },
  {
    "id": "s2-28",
    "sprintNum": "02",
    "taskNum": "28",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Vorbereitung Sprint 3: Themen-Clustering-Konzept",
    "prereqs": [],
    "bullets": [
      "Topic-Extraction-Research (S1)"
    ],
    "erfolg": "Sprint-3-Konzept dokumentiert.",
    "prompt": "Ich bin Taycir. Heute bereite ich Sprint 3 (Themen-Extraktion) vor.\nBitte hilf mir:\n1. Schreib docs/prompts/topic-clustering-concept.md als Code-Block:\n- Algorithmus-Skizze: Text → Chunks → Themen → Konsolidierung\n- Welche Anthropic-Calls in welcher Reihenfolge\n- Welches Datenmodell in der DB (topics-Tabelle Spalten).\n2. Git-Befehle."
  },
  {
    "id": "s2-29",
    "sprintNum": "02",
    "taskNum": "29",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Ende",
    "title": "Sprint-3-Backlog vorbereiten",
    "prereqs": [
      "28"
    ],
    "bullets": [
      "Sprint-3-Konzept (#28)"
    ],
    "erfolg": "backlog/sprint-3.md bereit für Sprint 3.",
    "prompt": "Ich bin Leon. Heute schreibe ich das Sprint-3-Backlog.\nBitte hilf mir:\n1. Schreib backlog/sprint-3.md als Code-Block — gleiche Struktur wie\nsprint-1.md, ~36 Aufgaben für Themen-Extraktion + Fragegenerierung.\n2. Git-Befehle."
  },
  {
    "id": "s2-30",
    "sprintNum": "02",
    "taskNum": "30",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Storage-Cleanup-Job (alte Uploads entfernen)",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Storage (#2)"
    ],
    "erfolg": "Cleanup läuft automatisch.",
    "prompt": "Ich bin Abder. Heute baue ich einen Cleanup für alte Uploads.\nBitte hilf mir:\n1. Schreib supabase/functions/cleanup-old-uploads.sql als Code-Block\n(Stored Procedure, löscht documents mit status='failed' älter als\n7 Tage).\n2. Schreib Cron-Setup-Anleitung (Supabase Edge Functions oder GitHub\nAction).\n3. Git-Befehle."
  },
  {
    "id": "s2-31",
    "sprintNum": "02",
    "taskNum": "31",
    "welle": 7,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Accessibility-Audit der neuen Seiten",
    "prereqs": [
      "10",
      "16",
      "19"
    ],
    "bullets": [
      "Neue Seiten gebaut"
    ],
    "erfolg": "A11y-Audit dokumentiert, Findings gefixt.",
    "prompt": "Ich bin Sara. Heute prüfe ich Accessibility der neuen Seiten.\nBitte hilf mir:\n1. Checkliste: ARIA-Labels, Tab-Reihenfolge, Kontrast, Fokus-Indikator.\n2. Schreib docs/a11y-audit-sprint-2.md als Code-Block mit Findings.\n3. Fixes als Tailwind-Diffs.\n4. Git-Befehle."
  },
  {
    "id": "s2-32",
    "sprintNum": "02",
    "taskNum": "32",
    "welle": 7,
    "who": "Ayoub",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Snapshot-Tests für alle neuen Komponenten",
    "prereqs": [
      "04",
      "13",
      "16"
    ],
    "bullets": [
      "Komponenten gebaut"
    ],
    "erfolg": "Mind. 6 neue Snapshot-Tests grün.",
    "prompt": "Ich bin Ayoub. Heute füge ich Snapshot-Tests hinzu.\nBitte hilf mir:\n1. Snapshot-Tests für PdfUpload, ErrorBox, EmptyState,\nDocumentDetail-Page.\n2. Schreib als Code-Blöcke.\n3. npm test laufen lassen.\n4. Git-Befehle."
  },
  {
    "id": "s2-33",
    "sprintNum": "02",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-2-Review halten + Retrospektive",
    "prereqs": [
      "27"
    ],
    "bullets": [
      "Demo bereit (#27)"
    ],
    "erfolg": "Review gehalten, Retro dokumentiert.",
    "prompt": "Ich bin Leon. Heute moderiere ich Sprint-2-Review + Retro.\nBitte hilf mir:\n1. Retrospektive-Vorlage Start/Stop/Continue als Code-Block.\n2. Schreib docs/sprint-reviews/sprint-2-retro.md mit dem Ergebnis-\nPlatzhalter.\n3. Git-Befehle."
  },
  {
    "id": "s2-34",
    "sprintNum": "02",
    "taskNum": "34",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Sprint-2-KI-Bericht: was wir gelernt haben",
    "prereqs": [
      "15",
      "22"
    ],
    "bullets": [
      "E2E + Cost-Analyse"
    ],
    "erfolg": "KI-Bericht für Dozent + Team.",
    "prompt": "Ich bin Taycir. Heute schreibe ich den KI-Bericht für Sprint 2.\nBitte hilf mir:\n1. Schreib docs/ki-reports/sprint-2.md als Code-Block:\n- Was funktioniert (Q&A-Prompt;)\n- Was nicht (Edge-Cases, Halluzinationen)\n- Kosten\n- Empfehlung für Sprint 3.\n2. Git-Befehle."
  },
  {
    "id": "s2-35",
    "sprintNum": "02",
    "taskNum": "35",
    "welle": 8,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Production-Smoke-Test nach jedem Deploy",
    "prereqs": [],
    "bullets": [
      "Vercel-Deploy (S1)"
    ],
    "erfolg": "Smoke-Test läuft automatisch nach Deploy.",
    "prompt": "Ich bin Abder. Heute füge ich einen Smoke-Test nach jedem Deploy ein.\nBitte hilf mir:\n1. Schreib scripts/smoke-test.sh als Code-Block: prüft /api/health,\nLanding-Page-Status 200, Login-Seite-Status 200.\n2. Wie ich das in GitLab CI nach Deploy laufen lasse.\n3. Git-Befehle."
  },
  {
    "id": "s2-36",
    "sprintNum": "02",
    "taskNum": "36",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Bug-Triage für Sprint 3 + offene Issues sortieren",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Testbericht (#25)"
    ],
    "erfolg": "Bugs für Sprint 3 sortiert.",
    "prompt": "Ich bin Sara. Heute triagiere ich Bugs für Sprint 3.\nBitte hilf mir:\n1. Liste alle offenen GitLab-Issues mit Label bug.\n2. Schreib docs/bug-triage-w8.md als Code-Block: Tabelle ID · Titel ·\nPriorität · Owner · in Sprint 3 fixen?\n3. Git-Befehle."
  },
  {
    "id": "s3-01",
    "sprintNum": "03",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-3-Kickoff + Bloom-Taxonomie-Workshop",
    "prereqs": [],
    "bullets": [
      "Sprint-2-Review-Ergebnisse"
    ],
    "erfolg": "Kickoff-Doku + Workshop-Vorlage.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-3-Kickoff inkl. Bloom-Taxonomie.\nBitte führe mich Schritt für Schritt durch:\n1. Schreib docs/sprint-reviews/sprint-3-kickoff.md (Ziele, DoD, Bloom-Stufen die wir abdecken).\n2. Workshop-Vorlage für Team-Diskussion: welche Bloom-Level pro Fragetyp.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-02",
    "sprintNum": "03",
    "taskNum": "02",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert API-Routen",
    "title": "DB-Schema: topics + questions + Indizes",
    "prereqs": [],
    "bullets": [
      "Documents-Schema (S1)"
    ],
    "erfolg": "Tabellen topics + questions mit RLS in DB.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich das Datenmodell für Themen und Fragen.\nBitte führe mich Schritt für Schritt durch:\n1. supabase/migrations/0004_topics_questions.sql: topics (id, document_id, title, summary, bloom_level), questions (id, topic_id, ty\npe 'open'|'mc', prompt, expected_answer, options jsonb).\n2. RLS + Indizes auf document_id und topic_id.\n3. SQL im Supabase-Editor ausführen — Anleitung.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-03",
    "sprintNum": "03",
    "taskNum": "03",
    "welle": 1,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Generator-Implementierung",
    "title": "Themen-Clustering-Prompt (finale Version)",
    "prereqs": [],
    "bullets": [
      "Topic-Research (S1)"
    ],
    "erfolg": "cluster-topics-Prompt funktioniert mit Testdaten.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich den finalen Themen-Clustering-Prompt.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/anthropic/prompts/cluster-topics.ts mit System+User-Template + JSON-Schema {topics: [{title, summary, key_concepts, bloom\n_levels}]}.\n2. Chunking-Strategie: ab welcher Textlänge in Chunks.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-04",
    "sprintNum": "03",
    "taskNum": "04",
    "welle": 2,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert UI-Liste",
    "title": "/api/topics/extract Route bauen",
    "prereqs": [
      "02",
      "03"
    ],
    "bullets": [
      "Schema + Prompt"
    ],
    "erfolg": "/api/topics/extract liefert gespeicherte Themen.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich die Themen-Extraktions-API.\nBitte führe mich Schritt für Schritt durch:\n1. src/app/api/topics/extract/route.ts: POST {documentId} → liest extracted_text → cluster-topics-Prompt → speichert topics in DB.\n2. Statusverwaltung: documents.status auf 'extracting' während Lauf.\n3. Token-Counting + Cost-Logging.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-05",
    "sprintNum": "03",
    "taskNum": "05",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Dashboard-Layout (Sidebar + Main)",
    "prereqs": [],
    "bullets": [
      "UI-Primitive (S1)"
    ],
    "erfolg": "Dashboard-Skelett sichtbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich das App-Dashboard-Layout.\nBitte führe mich Schritt für Schritt durch:\n1. src/app/(app)/layout.tsx mit Sidebar (Documents-Liste) + Main.\n2. Sidebar collapsible auf Mobile.\n3. Tailwind-Code.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-06",
    "sprintNum": "03",
    "taskNum": "06",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Eval-Lauf",
    "title": "Eval-Set: 5 PDFs + erwartete Themen",
    "prereqs": [],
    "bullets": [
      "Test-PDFs (S2)"
    ],
    "erfolg": "Eval-Set bereit zum Laufen.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute baue ich unser Eval-Set für Themen-Qualität.\nBitte führe mich Schritt für Schritt durch:\n1. tests/eval/topics-eval-set.json mit 5 PDFs + jeweils 3-6 Soll-Themen.\n2. docs/eval-methodology.md erklären wie wir scoren (Vollständigkeit, Granularität, False-Positives).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-07",
    "sprintNum": "03",
    "taskNum": "07",
    "welle": 2,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Fragegenerierungs-Prompt (offen + MC)",
    "prereqs": [
      "03"
    ],
    "bullets": [
      "Cluster-Prompt (#3)"
    ],
    "erfolg": "generate-questions-Prompt funktioniert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich den Frage-Generator.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/anthropic/prompts/generate-questions.ts: Input topic+text, Output {questions: [{type, prompt, expected_answer, options?}]\n}.\n2. Mind. 10 Fragen pro Topic, mind. 30% open / 30% MC.\n3. Bloom-Stufen Verstehen + Anwenden.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-08",
    "sprintNum": "03",
    "taskNum": "08",
    "welle": 2,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor finalem Prompt",
    "title": "Eval-Plan: Chain-of-Thought vs. direkt",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Eval-Plan für CoT-Vergleich.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute plane ich den CoT-Vergleich.\nBitte führe mich Schritt für Schritt durch:\n1. docs/eval/cot-vs-direct.md: Methodik, Metriken, Datenpunkte.\n2. Skript-Skeleton tests/eval/run-comparison.ts.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-09",
    "sprintNum": "03",
    "taskNum": "09",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert Frage-UI",
    "title": "/api/questions/generate Route",
    "prereqs": [
      "02",
      "07"
    ],
    "bullets": [
      "Schema + Prompt"
    ],
    "erfolg": "/api/questions/generate funktioniert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich die Fragen-Generierungs-API.\nBitte führe mich Schritt für Schritt durch:\n1. /api/questions/generate POST {topicId} → ruft generate-questions → speichert in questions-Tabelle.\n2. Prompt-Version pro Eintrag mitschreiben.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-10",
    "sprintNum": "03",
    "taskNum": "10",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Themen-Karten + Themen-Liste",
    "prereqs": [
      "04",
      "05"
    ],
    "bullets": [
      "Dashboard + API"
    ],
    "erfolg": "Themen sichtbar im Dashboard.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich die Themen-Übersicht.\nBitte führe mich Schritt für Schritt durch:\n1. src/components/topics/TopicCard.tsx + TopicList.tsx.\n2. Klick auf Karte → /topics/[id] (Platzhalter).\n3. Empty-State wenn keine Themen.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-11",
    "sprintNum": "03",
    "taskNum": "11",
    "welle": 3,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Frage-Anzeige (offen + MC)",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Frage-API (#9)"
    ],
    "erfolg": "QuestionCard funktioniert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute baue ich die Frage-UI.\nBitte führe mich Schritt für Schritt durch:\n1. src/components/questions/QuestionCard.tsx für beide Typen (offen + MC mit Radio-Group).\n2. Submit-Button schickt Antwort an Platzhalter-Endpoint.\n3. Snapshot-Tests.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-12",
    "sprintNum": "03",
    "taskNum": "12",
    "welle": 3,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Eval-Set laufen lassen + Scores loggen",
    "prereqs": [
      "04",
      "06"
    ],
    "bullets": [
      "Extract-API + Eval-Set"
    ],
    "erfolg": "Eval-Bericht mit Scores.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute messe ich Themen-Qualität.\nBitte führe mich Schritt für Schritt durch:\n1. scripts/run-topics-eval.ts der für jedes Eval-PDF Themen extrahiert und gegen Soll vergleicht.\n2. Schreib Output in docs/eval-results/topics-vN.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-13",
    "sprintNum": "03",
    "taskNum": "13",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wochen-Update + Dozenten-Update",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Dozent informiert, Risiko-Log aktuell.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute kommuniziere ich Sprint-Status.\nBitte führe mich Schritt für Schritt durch:\n1. Dozenten-Update-Mail als Code-Block.\n2. Risiko-Log aktualisieren (sind die KI-Kosten in Plan?).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-14",
    "sprintNum": "03",
    "taskNum": "14",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Ende",
    "title": "CoT vs. direkt: Vergleich durchführen",
    "prereqs": [
      "03",
      "07",
      "08"
    ],
    "bullets": [
      "Eval-Plan (#8)"
    ],
    "erfolg": "Klare Empfehlung CoT vs. direkt.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute vergleiche ich CoT und direktes Prompting.\nBitte führe mich Schritt für Schritt durch:\n1. Beide Varianten gegen Eval-Set laufen lassen.\n2. Ergebnisse in docs/eval-results/cot-comparison.md schreiben.\n3. Empfehlung welche Variante wir produktiv nutzen.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-15",
    "sprintNum": "03",
    "taskNum": "15",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Themen-Detail-Seite mit Fragen",
    "prereqs": [
      "10",
      "11"
    ],
    "bullets": [
      "TopicCard + QuestionCard"
    ],
    "erfolg": "Detail-Seite zeigt Fragen pro Thema.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich die Themen-Detail-Seite.\nBitte führe mich Schritt für Schritt durch:\n1. src/app/(app)/topics/[id]/page.tsx zeigt Topic + alle Questions.\n2. Lade per fetch /api/questions?topicId=.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-16",
    "sprintNum": "03",
    "taskNum": "16",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Snapshot-Tests für Themen + Fragen UI",
    "prereqs": [
      "10",
      "11"
    ],
    "bullets": [
      "Topic + Question UI"
    ],
    "erfolg": "Mind. 5 neue Tests grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute teste ich die neuen UI-Komponenten.\nBitte führe mich Schritt für Schritt durch:\n1. Snapshot-Tests für TopicCard, TopicList, QuestionCard.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-17",
    "sprintNum": "03",
    "taskNum": "17",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Prompt-Versionierung in DB einführen",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Questions-API (#9)"
    ],
    "erfolg": "Prompt-Versionen in DB nachvollziehbar.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute versioniere ich Prompts in der DB.\nBitte führe mich Schritt für Schritt durch:\n1. Migration: questions.prompt_version Spalte (Text).\n2. Speichere bei jeder Generierung die Version.\n3. docs/prompts/CHANGELOG.md anlegen.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-18",
    "sprintNum": "03",
    "taskNum": "18",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Caching: Themen pro Dokument cachen",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Extract-API"
    ],
    "erfolg": "Themen-Extraktion wird nicht doppelt aufgerufen.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute füge ich Caching ein, um Kosten zu senken.\nBitte führe mich Schritt für Schritt durch:\n1. Wenn topics für ein Dokument bereits existieren: nicht erneut extrahieren, sondern aus DB lesen.\n2. API-Force-Refresh-Parameter für manuelle Neugenerierung.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-19",
    "sprintNum": "03",
    "taskNum": "19",
    "welle": 5,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Qualitätsbericht der generierten Fragen",
    "prereqs": [
      "12",
      "14"
    ],
    "bullets": [
      "Eval-Ergebnisse"
    ],
    "erfolg": "Qualitätsbericht abgabefähig.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schreibe ich den Qualitätsbericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/sprint-3-quality.md mit Tabellen: Topic-Qualität, Frage-Qualität, Kosten.\n2. Empfehlungen für Sprint 4.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-20",
    "sprintNum": "03",
    "taskNum": "20",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Fragen-Navigation mit Tastatur-Shortcuts",
    "prereqs": [
      "11",
      "15"
    ],
    "bullets": [
      "Question-UI"
    ],
    "erfolg": "Tastatur-Navigation funktioniert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute füge ich Tastatur-Navigation hinzu.\nBitte führe mich Schritt für Schritt durch:\n1. Pfeiltasten ←/→ wechseln zwischen Fragen, Enter sendet Antwort.\n2. useKeyboardShortcut-Hook + ARIA-Hints.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-21",
    "sprintNum": "03",
    "taskNum": "21",
    "welle": 5,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Themen-Liste polieren + Empty-States",
    "prereqs": [
      "10"
    ],
    "bullets": [
      "TopicList"
    ],
    "erfolg": "Themen-Liste polished.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute poliere ich die Themen-Liste.\nBitte führe mich Schritt für Schritt durch:\n1. Empty-State 'Lade ein PDF hoch'.\n2. Loading-Skeleton während Generierung.\n3. Filter/Sortierung (Alphabetisch, Bloom-Stufe).\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-22",
    "sprintNum": "03",
    "taskNum": "22",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Performance: SQL-Indizes prüfen",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Schema (#2)"
    ],
    "erfolg": "Wichtige Queries unter 100 ms.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute optimiere ich DB-Performance.\nBitte führe mich Schritt für Schritt durch:\n1. EXPLAIN für die häufigsten Queries laufen lassen.\n2. Indizes ergänzen wo nötig (insbesondere topic_id, document_id).\n3. Schreib supabase/migrations/0005_indexes.sql.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-23",
    "sprintNum": "03",
    "taskNum": "23",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Regressions-Tests für Sprint 2+3",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Alle Regressions-Tests grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute laufe ich die Regressions-Suite.\nBitte führe mich Schritt für Schritt durch:\n1. Liste alle E2E-Tests + neue.\n2. Schreib das Ergebnis in docs/sprint-reviews/sprint-3-regression.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-24",
    "sprintNum": "03",
    "taskNum": "24",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Responsive: Dashboard auf Mobile",
    "prereqs": [
      "05"
    ],
    "bullets": [
      "Dashboard (#5)"
    ],
    "erfolg": "Dashboard auf Mobile nutzbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich das Dashboard mobil-tauglich.\nBitte führe mich Schritt für Schritt durch:\n1. Sidebar wird Hamburger-Menü auf 375 px.\n2. Tailwind-Diffs.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-25",
    "sprintNum": "03",
    "taskNum": "25",
    "welle": 6,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-3-Review + Demo-Skript",
    "prereqs": [
      "19",
      "23"
    ],
    "bullets": [
      "Qualitätsbericht + Regression"
    ],
    "erfolg": "Review + Demo-Skript bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute bereite ich Sprint-3-Review vor.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-3-review.md (6-Folien).\n2. docs/sprint-reviews/sprint-3-demo-script.md (minutengenau).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-26",
    "sprintNum": "03",
    "taskNum": "26",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Prompt-Doku konsolidieren in docs/prompts/",
    "prereqs": [
      "03",
      "07",
      "14"
    ],
    "bullets": [
      "Alle Prompts gebaut"
    ],
    "erfolg": "Prompt-Doku zentral auffindbar.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute konsolidiere ich unsere Prompt-Doku.\nBitte führe mich Schritt für Schritt durch:\n1. docs/prompts/index.md als Inhaltsverzeichnis.\n2. Pro Prompt: Zweck, Version, Eval-Score, Kosten.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-27",
    "sprintNum": "03",
    "taskNum": "27",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Fehlerbehandlung in Generator-API",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Questions-API"
    ],
    "erfolg": "Generator robust gegen API-Fehler.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute härte ich Fehlerpfade.\nBitte führe mich Schritt für Schritt durch:\n1. Was passiert wenn Claude antwortet mit nicht-JSON?\n2. Retry-Logik (max 2x) + Fallback auf einfache Variante.\n3. Logging-Format definieren.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-28",
    "sprintNum": "03",
    "taskNum": "28",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Review",
    "title": "Sprint-3-Testbericht",
    "prereqs": [
      "23"
    ],
    "bullets": [
      "Regression (#23)"
    ],
    "erfolg": "Testbericht abgabefähig.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich den Testbericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-3-test-report.md mit Coverage, neue Tests, Bugs, Risiken Sprint 4.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-29",
    "sprintNum": "03",
    "taskNum": "29",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Demo-Day-Polish: Animationen + Skeletons",
    "prereqs": [
      "21",
      "24"
    ],
    "bullets": [
      "Themen-Liste + Mobile"
    ],
    "erfolg": "App fühlt sich poliert an.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Demo-Polish.\nBitte führe mich Schritt für Schritt durch:\n1. Fade-In Animationen für neue Themen-Karten.\n2. Loading-Skeletons konsistent überall.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-30",
    "sprintNum": "03",
    "taskNum": "30",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Risiko-Log aktualisieren (KI-Qualität, Kosten)",
    "prereqs": [
      "19"
    ],
    "bullets": [
      "Qualitätsbericht"
    ],
    "erfolg": "Risiko-Log spiegelt aktuelle Lage.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute update ich das Risiko-Log.\nBitte führe mich Schritt für Schritt durch:\n1. docs/risk-log.md: Welche Risiken sind realer? Welche Maßnahmen sind aktiv?\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-31",
    "sprintNum": "03",
    "taskNum": "31",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Vorbereitung Sprint 4: Dialog-System-Konzept",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Sprint-4-Konzept bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute skizziere ich das Dialog-System für Sprint 4.\nBitte führe mich Schritt für Schritt durch:\n1. docs/concepts/dialog-system.md: Antwort → Bewertung → Rückfrage → Abschluss-Logik.\n2. Datenmodell-Skizze: sessions, messages, progress.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-32",
    "sprintNum": "03",
    "taskNum": "32",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Backups + DB-Snapshot manuell testen",
    "prereqs": [],
    "bullets": [
      "Supabase-Projekt"
    ],
    "erfolg": "Backup-Strategie validiert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute teste ich unseren Backup-Workflow.\nBitte führe mich Schritt für Schritt durch:\n1. Supabase-Backup manuell erstellen + dokumentieren.\n2. docs/backup-recovery.md schreiben.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-33",
    "sprintNum": "03",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-3-Review halten + Retrospektive",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Review-Doku"
    ],
    "erfolg": "Review gehalten, Retro dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich den Review und moderiere Retro.\nBitte führe mich Schritt für Schritt durch:\n1. Folge dem Demo-Skript.\n2. Sammle Retro-Punkte in docs/sprint-reviews/sprint-3-retro.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-34",
    "sprintNum": "03",
    "taskNum": "34",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Bugfix-Stunde vor Sprint-3-Ende",
    "prereqs": [
      "28"
    ],
    "bullets": [
      "Testbericht (#28)"
    ],
    "erfolg": "Kritische Bugs gefixt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute fixe ich offene Sprint-3-Bugs.\nBitte führe mich Schritt für Schritt durch:\n1. Aus Testbericht: kritische Bugs zuerst.\n2. Pro Fix: Branch, MR, Tests.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-35",
    "sprintNum": "03",
    "taskNum": "35",
    "welle": 8,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Sprint-4-Vorbereitung: Chat-UI-Skizze",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Chat-UI-Wireframe bereit.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute skizziere ich die Chat-UI für Sprint 4.\nBitte führe mich Schritt für Schritt durch:\n1. docs/wireframes/chat.html als Code-Block (Low-Fi).\n2. Komponenten-Liste die wir bauen werden.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s3-36",
    "sprintNum": "03",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-3-KI-Bericht abschließen",
    "prereqs": [
      "19",
      "26"
    ],
    "bullets": [
      "Qualitätsbericht + Prompt-Doku"
    ],
    "erfolg": "KI-Bericht für Dozent bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schließe ich den KI-Sprint-Bericht ab.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/sprint-3.md mit allen Learnings, Kosten, Empfehlungen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-01",
    "sprintNum": "04",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-4-Kickoff + Dijkstra-Referenz definieren",
    "prereqs": [],
    "bullets": [
      "Sprint-3-Retro"
    ],
    "erfolg": "Kickoff dokumentiert, Demo-Referenz klar.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-4-Kickoff.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-4-kickoff.md mit Sprintziel + DoD.\n2. Dijkstra-Demo-Definition: welches PDF, welche Soll-Fragen.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-02",
    "sprintNum": "04",
    "taskNum": "02",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert APIs",
    "title": "DB-Schema: sessions + messages + progress",
    "prereqs": [],
    "bullets": [
      "Documents+Topics (S2+S3)"
    ],
    "erfolg": "Dialog-Tabellen mit RLS in DB.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich das Dialog-Datenmodell.\nBitte führe mich Schritt für Schritt durch:\n1. supabase/migrations/0006_dialog_schema.sql: sessions (id, user_id, topic_id, status, started_at, finished_at), messages (id, sess\nion_id, role 'user'|'assistant'|'system', content, created_at), progress (user_id, topic_id, mastery_level, last_session_at).\n2. RLS-Policies.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-03",
    "sprintNum": "04",
    "taskNum": "03",
    "welle": 1,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Dialog-Logik",
    "title": "Antwort-Analyse-Prompt entwerfen",
    "prereqs": [],
    "bullets": [
      "Sprint-3-Konzept"
    ],
    "erfolg": "analyze-answer-Prompt funktioniert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich den Antwort-Analyse-Prompt.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/anthropic/prompts/analyze-answer.ts. Input: Frage, erwartete Antwort, User-Antwort. Output JSON: {verdict: 'correct'|'par\ntial'|'wrong', missing_concepts: [], suggested_followup: string}.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-04",
    "sprintNum": "04",
    "taskNum": "04",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Chat-UI-Grundgerüst (Bubbles, Input, Scroll)",
    "prereqs": [],
    "bullets": [
      "UI-Primitive"
    ],
    "erfolg": "Chat-UI sichtbar, Bubbles testbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich das Chat-UI-Skelett.\nBitte führe mich Schritt für Schritt durch:\n1. src/components/chat/ChatContainer.tsx mit Bubble-Liste + Eingabefeld + Auto-Scroll.\n2. Bubble-Komponenten für User vs. Assistant.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-05",
    "sprintNum": "04",
    "taskNum": "05",
    "welle": 2,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor E2E",
    "title": "Edge-Case-Test-Szenarien sammeln",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Dialog-Test-Szenarien dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute sammle ich Test-Szenarien.\nBitte führe mich Schritt für Schritt durch:\n1. docs/test-scenarios/dialog.md: leere Antwort, Off-Topic, sehr lang, Sprache wechseln mitten im Dialog, Abbruch.\n2. Pro Szenario: erwartetes Verhalten.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-06",
    "sprintNum": "04",
    "taskNum": "06",
    "welle": 2,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor Chat-Logik",
    "title": "/api/session/start Endpoint",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Schema (#2)"
    ],
    "erfolg": "/api/session/start funktioniert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich Session-Start-API.\nBitte führe mich Schritt für Schritt durch:\n1. src/app/api/session/start/route.ts: POST {topicId} → erstellt session, wählt eine erste Frage, gibt {sessionId, firstQuestion} zu\nrück.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-07",
    "sprintNum": "04",
    "taskNum": "07",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Daily Coordination Plan (AI \u0000 Frontend)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Sync-Format definiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute plane ich AI-FE-Sync.\nBitte führe mich Schritt für Schritt durch:\n1. docs/coordination/sprint-4-syncs.md mit Mini-Standup-Format jeden Morgen 10 Min.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-08",
    "sprintNum": "04",
    "taskNum": "08",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Rückfragen-Generierung bei Wissenslücken",
    "prereqs": [
      "03"
    ],
    "bullets": [
      "analyze-answer (#3)"
    ],
    "erfolg": "Rückfragen-Generator funktioniert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute baue ich die Rückfragen-Logik.\nBitte führe mich Schritt für Schritt durch:\n1. Prompt followup-question.ts: Input session-Historie + erkannte Lücke. Output: gezielte Rückfrage.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-09",
    "sprintNum": "04",
    "taskNum": "09",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-kritisch",
    "title": "/api/session/answer Endpoint (mit Bewertung)",
    "prereqs": [
      "02",
      "03",
      "06"
    ],
    "bullets": [
      "Schema + Prompts + Start-API"
    ],
    "erfolg": "/api/session/answer funktioniert E2E.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich die Antwort-Verarbeitung.\nBitte führe mich Schritt für Schritt durch:\n1. /api/session/answer POST {sessionId, answer} → speichert message → ruft analyze-answer → entscheidet (Folge-Frage / Abschluss) →\nspeichert Assistant-Message → gibt Verlauf zurück.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-10",
    "sprintNum": "04",
    "taskNum": "10",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Streaming-Anzeige + Typing-Animation",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Chat-UI (#4)"
    ],
    "erfolg": "Streaming sichtbar wenn KI antwortet.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Streaming-UI.\nBitte führe mich Schritt für Schritt durch:\n1. Während KI-Antwort: blinkender Cursor / progressive Anzeige.\n2. Hook useStreamingMessage.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-11",
    "sprintNum": "04",
    "taskNum": "11",
    "welle": 3,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Unit-Tests für Antwort-Bewertungs-Logik",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Answer-API"
    ],
    "erfolg": "Bewertungs-Logik > 80% Coverage.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute teste ich die Bewertungs-Logik.\nBitte führe mich Schritt für Schritt durch:\n1. Mock-Tests für korrekt/teilweise/falsch-Klassifikation.\n2. Tests für Edge-Cases (leere Antwort).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-12",
    "sprintNum": "04",
    "taskNum": "12",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wochen-Update + Dozenten-Update",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Dozent informiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schreibe ich Wochen-Update.\nBitte führe mich Schritt für Schritt durch:\n1. Dozenten-Mail-Entwurf als Code-Block.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-13",
    "sprintNum": "04",
    "taskNum": "13",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Demo-kritisch",
    "title": "Mehrstufige Dialog-Logik + Terminierung",
    "prereqs": [
      "03",
      "08"
    ],
    "bullets": [
      "Analyze + Followup"
    ],
    "erfolg": "Dialog-Orchestrator funktioniert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute baue ich die Dialog-Steuerung.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/dialog/orchestrator.ts: state machine mit States ask → wait_answer → analyze → (followup|next_question|finish).\n2. Abbruch nach N falschen Antworten oder M Min Inaktivität.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-14",
    "sprintNum": "04",
    "taskNum": "14",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Fortschrittsbalken + Session-Zusammenfassung",
    "prereqs": [
      "04",
      "09"
    ],
    "bullets": [
      "Chat-UI + Answer-API"
    ],
    "erfolg": "Fortschritt + Summary sichtbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Fortschrittsbalken + Summary.\nBitte führe mich Schritt für Schritt durch:\n1. Fortschritts-Balken zeigt 'Frage 2 von 5'.\n2. Am Ende: Summary-Card mit korrekt/falsch + Streak.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-15",
    "sprintNum": "04",
    "taskNum": "15",
    "welle": 4,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Mobile Chat-Layout (Tastatur, Scroll)",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Chat-UI (#4)"
    ],
    "erfolg": "Chat auf Mobile nutzbar.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute mache ich Chat mobile-tauglich.\nBitte führe mich Schritt für Schritt durch:\n1. Eingabefeld bleibt sichtbar wenn Tastatur ausgefahren.\n2. Tailwind-Klassen-Diffs.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-16",
    "sprintNum": "04",
    "taskNum": "16",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Session-State-Machine + Sessions fortsetzen",
    "prereqs": [
      "02",
      "09"
    ],
    "bullets": [
      "Schema + Answer-API"
    ],
    "erfolg": "Sessions können fortgesetzt werden.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute mache ich Sessions resumable.\nBitte führe mich Schritt für Schritt durch:\n1. Eine pausierte Session kann später fortgesetzt werden.\n2. Status 'paused' + 'resumed_at' im Schema.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-17",
    "sprintNum": "04",
    "taskNum": "17",
    "welle": 5,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Mit Taycir: Dialog-Abbruchkriterien tunen",
    "prereqs": [
      "13"
    ],
    "bullets": [
      "Orchestrator (#13)"
    ],
    "erfolg": "Dialog endet 'natürlich', kein Hängen.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute tune ich Dialog-Terminierung mit Taycir.\nBitte führe mich Schritt für Schritt durch:\n1. 5 Demo-Sessions laufen lassen, Abbrüche analysieren.\n2. docs/dialog-tuning.md mit angepassten Schwellwerten.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-18",
    "sprintNum": "04",
    "taskNum": "18",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Demo-kritisch",
    "title": "E2E-Test: vollständige Dijkstra-Session",
    "prereqs": [
      "04",
      "09",
      "13"
    ],
    "bullets": [
      "Chat + APIs + Orchestrator"
    ],
    "erfolg": "Dijkstra-E2E grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich den Dijkstra-E2E-Test.\nBitte führe mich Schritt für Schritt durch:\n1. tests/e2e/dijkstra-session.spec.ts: Lade Dijkstra-PDF, starte Session, beantworte 5 Fragen (eine falsch), prüfe Abschluss.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-19",
    "sprintNum": "04",
    "taskNum": "19",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Demo-kritisch",
    "title": "Prompt-Tuning gegen Dijkstra-Demo",
    "prereqs": [
      "03",
      "08",
      "13"
    ],
    "bullets": [
      "Alle Dialog-Prompts"
    ],
    "erfolg": "Dijkstra-Demo läuft flüssig.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute tune ich Prompts gezielt auf Dijkstra.\nBitte führe mich Schritt für Schritt durch:\n1. Welche Antworten sind problematisch? Prompt-Diffs.\n2. docs/prompts/CHANGELOG.md aktualisieren.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-20",
    "sprintNum": "04",
    "taskNum": "20",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Animationen + Polish vor Demo",
    "prereqs": [
      "10",
      "14"
    ],
    "bullets": [
      "Streaming + Summary"
    ],
    "erfolg": "Demo-Day-tauglich.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich finale UI-Politur.\nBitte führe mich Schritt für Schritt durch:\n1. Smooth-Scroll-Effekte, Bubble-Fade-In, Button-Animationen.\n2. Tailwind-Diffs.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-21",
    "sprintNum": "04",
    "taskNum": "21",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Accessibility-Check Chat-UI",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Chat-UI (#4)"
    ],
    "erfolg": "Chat-UI A11y-konform.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute prüfe ich Chat-A11y.\nBitte führe mich Schritt für Schritt durch:\n1. Screenreader-Test (z. B. NVDA), Tab-Navigation, ARIA-Live-Regions für neue Messages.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-22",
    "sprintNum": "04",
    "taskNum": "22",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Fortschritts-Statistik pro Thema speichern",
    "prereqs": [
      "02",
      "09"
    ],
    "bullets": [
      "Schema + Answer-API"
    ],
    "erfolg": "Mastery-Werte pro User+Topic gespeichert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute speichere ich Mastery pro Thema.\nBitte führe mich Schritt für Schritt durch:\n1. Update progress-Tabelle nach jeder Session (mastery_level basierend auf Antwort-Qualität).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-23",
    "sprintNum": "04",
    "taskNum": "23",
    "welle": 6,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Finale Dijkstra-Evaluation",
    "prereqs": [
      "18",
      "19"
    ],
    "bullets": [
      "E2E + Prompt-Tuning"
    ],
    "erfolg": "Dijkstra-Evaluation dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute evaluiere ich Dijkstra-Demo final.\nBitte führe mich Schritt für Schritt durch:\n1. Welche Fälle laufen, welche nicht?\n2. docs/eval-results/dijkstra-final.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-24",
    "sprintNum": "04",
    "taskNum": "24",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Streak / Motivationselemente",
    "prereqs": [
      "14",
      "22"
    ],
    "bullets": [
      "Summary + Progress"
    ],
    "erfolg": "Motivations-Elemente sichtbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Streak-Anzeige.\nBitte führe mich Schritt für Schritt durch:\n1. \u0000 Streak-Counter wenn N Tage in Folge gelernt.\n2. Confetti bei Abschluss eines Themas (z.B. canvas-confetti).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-25",
    "sprintNum": "04",
    "taskNum": "25",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Regressions-Suite laufen lassen",
    "prereqs": [],
    "bullets": [
      "Alle E2Es"
    ],
    "erfolg": "Alle Tests grün vor Demo.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute laufe ich alle Regressions-Tests.\nBitte führe mich Schritt für Schritt durch:\n1. Test-Report in docs/sprint-reviews/sprint-4-regression.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-26",
    "sprintNum": "04",
    "taskNum": "26",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Sprint-4-Prompt-Doku konsolidieren",
    "prereqs": [
      "03",
      "08",
      "13",
      "19"
    ],
    "bullets": [
      "Alle Prompts gebaut"
    ],
    "erfolg": "Prompt-Doku zentral.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute konsolidiere ich Sprint-4-Prompts.\nBitte führe mich Schritt für Schritt durch:\n1. docs/prompts/dialog/index.md.\n2. Versions-Tabelle aller Prompts.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-27",
    "sprintNum": "04",
    "taskNum": "27",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-4-Review + Demo-Skript",
    "prereqs": [
      "23",
      "25"
    ],
    "bullets": [
      "Dijkstra-Eval + Regression"
    ],
    "erfolg": "Review + Demo-Skript bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute bereite ich Sprint-4-Review vor.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-4-review.md.\n2. docs/sprint-reviews/sprint-4-demo-script.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-28",
    "sprintNum": "04",
    "taskNum": "28",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Review",
    "title": "Sprint-4-Testbericht",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Regression (#25)"
    ],
    "erfolg": "Testbericht abgabefähig.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich Sprint-4-Testbericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-4-test-report.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-29",
    "sprintNum": "04",
    "taskNum": "29",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Demo-Day-Polish + Lighthouse",
    "prereqs": [
      "20"
    ],
    "bullets": [
      "Animationen (#20)"
    ],
    "erfolg": "Lighthouse > 90.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Demo-Polish + Lighthouse-Check.\nBitte führe mich Schritt für Schritt durch:\n1. Lighthouse-Werte in docs/sprint-reviews/lighthouse-sprint-4.md.\n2. Letzte Fixes.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-30",
    "sprintNum": "04",
    "taskNum": "30",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Performance-Optimierung Session-Queries",
    "prereqs": [
      "22"
    ],
    "bullets": [
      "Progress (#22)"
    ],
    "erfolg": "Queries < 100 ms.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute optimiere ich Session-Queries.\nBitte führe mich Schritt für Schritt durch:\n1. EXPLAIN, Indizes wo nötig.\n2. docs/perf/session-queries.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-31",
    "sprintNum": "04",
    "taskNum": "31",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Vorbereitung Sprint 5: Personalisierung",
    "prereqs": [
      "22"
    ],
    "bullets": [
      "Progress (#22)"
    ],
    "erfolg": "Sprint-5-Konzept bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute skizziere ich Personalisierung für Sprint 5.\nBitte führe mich Schritt für Schritt durch:\n1. docs/concepts/personalization.md: welche Daten, welcher Algorithmus.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-32",
    "sprintNum": "04",
    "taskNum": "32",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-5-Backlog",
    "prereqs": [
      "31"
    ],
    "bullets": [
      "Konzept (#31)"
    ],
    "erfolg": "Sprint-5-Backlog bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schreibe ich Sprint-5-Backlog.\nBitte führe mich Schritt für Schritt durch:\n1. backlog/sprint-5.md mit ~36 Aufgaben.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-33",
    "sprintNum": "04",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-4-Review halten + Retro",
    "prereqs": [
      "27"
    ],
    "bullets": [
      "Review-Doku"
    ],
    "erfolg": "Review gehalten, Retro dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich Sprint-4-Review + Retro.\nBitte führe mich Schritt für Schritt durch:\n1. Folge dem Demo-Skript.\n2. Retro in docs/sprint-reviews/sprint-4-retro.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-34",
    "sprintNum": "04",
    "taskNum": "34",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Bugfix-Stunde Sprint-4",
    "prereqs": [
      "28"
    ],
    "bullets": [
      "Testbericht"
    ],
    "erfolg": "Kritische Bugs gefixt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute fixe ich offene Sprint-4-Bugs.\nBitte führe mich Schritt für Schritt durch:\n1. Kritische Bugs zuerst.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-35",
    "sprintNum": "04",
    "taskNum": "35",
    "welle": 8,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wireframe Sprint 5: Auth + Profil",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Wireframes für Sprint 5.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute skizziere ich Sprint-5-UI.\nBitte führe mich Schritt für Schritt durch:\n1. docs/wireframes/profile.html.\n2. docs/wireframes/signup.html.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s4-36",
    "sprintNum": "04",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-4-KI-Bericht abschließen",
    "prereqs": [
      "23",
      "26"
    ],
    "bullets": [
      "Eval + Prompt-Doku"
    ],
    "erfolg": "KI-Bericht abgabefähig.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schließe ich Sprint-4-KI-Bericht ab.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/sprint-4.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-01",
    "sprintNum": "05",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-5-Kickoff + DSGVO-Workshop mit Sara",
    "prereqs": [],
    "bullets": [
      "Sprint-4-Retro"
    ],
    "erfolg": "Kickoff + DSGVO-Anforderungen klar.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-5-Kickoff inkl. DSGVO-Workshop.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-5-kickoff.md mit DoD + Auth-Plan.\n2. DSGVO-Workshop-Protokoll.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-02",
    "sprintNum": "05",
    "taskNum": "02",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": true,
    "priorityInfo": "Blockiert alles",
    "title": "Supabase Auth aktivieren + RLS auf alle Tabellen",
    "prereqs": [],
    "bullets": [
      "Supabase-Projekt"
    ],
    "erfolg": "Auth aktiv, RLS überall.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute aktiviere ich Supabase Auth.\nBitte führe mich Schritt für Schritt durch:\n1. Auth in Supabase aktivieren (Email + Password).\n2. supabase/migrations/0007_auth_rls.sql: RLS-Policies auf documents, topics, questions, sessions, messages (auth.uid() = user_id).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-03",
    "sprintNum": "05",
    "taskNum": "03",
    "welle": 1,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Cookie-Banner",
    "title": "DSGVO-Checkliste v1 + Cookie-Anforderungen",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "DSGVO-Status klar dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich DSGVO-Checkliste v1.\nBitte führe mich Schritt für Schritt durch:\n1. docs/legal/dsgvo-checklist-v1.md: alle Pflichten + Status.\n2. docs/legal/cookies.md: welche Cookies wir setzen, Kategorie.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-04",
    "sprintNum": "05",
    "taskNum": "04",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Registrierungs- + Login-Formulare wirklich verdrahten",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Auth (#2)"
    ],
    "erfolg": "Echtes Login + Signup funktioniert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute verdrahte ich die Auth-Formulare.\nBitte führe mich Schritt für Schritt durch:\n1. /login + /signup mit supabase.auth.signIn/signUp.\n2. Fehler-Handling + Loading-State.\n3. Redirect nach /dashboard bei Erfolg.\n4. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-05",
    "sprintNum": "05",
    "taskNum": "05",
    "welle": 2,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Profilseite anlegen",
    "prereqs": [],
    "bullets": [
      "UI-Primitive"
    ],
    "erfolg": "Profil sichtbar + editierbar.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute baue ich die Profilseite.\nBitte führe mich Schritt für Schritt durch:\n1. /profile mit Avatar-Bereich + Fachauswahl + Anzeigename.\n2. GET/PUT-Endpoints.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-06",
    "sprintNum": "05",
    "taskNum": "06",
    "welle": 2,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Empfehlungs-Prompt entwerfen",
    "prereqs": [],
    "bullets": [
      "Progress-Daten (S4)"
    ],
    "erfolg": "Empfehlungs-Prompt fertig.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich Empfehlungs-Prompt.\nBitte führe mich Schritt für Schritt durch:\n1. Prompt recommend-topic.ts: Input User-Historie → Output: 3 Empfehlungen mit Begründung.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-07",
    "sprintNum": "05",
    "taskNum": "07",
    "welle": 2,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Auth-Middleware + Protected Routes",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Auth (#2)"
    ],
    "erfolg": "Geschützte Routen funktionieren.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich Auth-Middleware.\nBitte führe mich Schritt für Schritt durch:\n1. src/middleware.ts: protected routes redirect nach /login wenn nicht eingeloggt.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-08",
    "sprintNum": "05",
    "taskNum": "08",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Sprint-5-Wochen-Plan",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Wochen-Plan transparent.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schreibe ich den Wochen-Plan.\nBitte führe mich Schritt für Schritt durch:\n1. docs/coordination/sprint-5-plan.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-09",
    "sprintNum": "05",
    "taskNum": "09",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Avatar-Upload mit Supabase Storage",
    "prereqs": [
      "02",
      "05"
    ],
    "bullets": [
      "Auth + Profil"
    ],
    "erfolg": "Avatar-Upload funktioniert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Avatar-Upload.\nBitte führe mich Schritt für Schritt durch:\n1. Upload-Bucket avatars (public Read, private Write).\n2. Profilseiten-Komponente AvatarUpload.tsx.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-10",
    "sprintNum": "05",
    "taskNum": "10",
    "welle": 3,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Einstellungs-Seite (Theme, Sprache, Logout)",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Auth (#4)"
    ],
    "erfolg": "Settings-Seite nutzbar.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute baue ich /settings.\nBitte führe mich Schritt für Schritt durch:\n1. Theme-Toggle (Light/Dark Vorbereitung), Sprache (de/en stub), Logout-Button.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-11",
    "sprintNum": "05",
    "taskNum": "11",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Profil-API + Persistenz",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Auth (#2)"
    ],
    "erfolg": "Profil-API funktioniert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich /api/profile.\nBitte führe mich Schritt für Schritt durch:\n1. GET liest aus auth.users + public.profiles. PUT aktualisiert public.profiles.\n2. Migration 0008_profiles.sql für profiles-Tabelle.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-12",
    "sprintNum": "05",
    "taskNum": "12",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Empfehlungslogik (schwache Themen \u0000 Review)",
    "prereqs": [
      "06"
    ],
    "bullets": [
      "Prompt (#6)"
    ],
    "erfolg": "Recommendation Engine funktioniert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute implementiere ich die Empfehlungslogik.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/recommendations/engine.ts: Input progress → Output Top 3 Topics.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-13",
    "sprintNum": "05",
    "taskNum": "13",
    "welle": 3,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Auth-Flow E2E-Tests",
    "prereqs": [
      "04",
      "07"
    ],
    "bullets": [
      "Auth funktional"
    ],
    "erfolg": "Auth-E2E grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute teste ich Auth E2E.\nBitte führe mich Schritt für Schritt durch:\n1. tests/e2e/auth.spec.ts: Signup, Login, Logout, Protected Route.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-14",
    "sprintNum": "05",
    "taskNum": "14",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Dozenten-Update + Risiko-Log",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Status kommuniziert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute kommuniziere ich Status.\nBitte führe mich Schritt für Schritt durch:\n1. Dozenten-Mail.\n2. Risiko-Log mit Datenschutz-Risiken.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-15",
    "sprintNum": "05",
    "taskNum": "15",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Empfehlungs-Karten auf Dashboard",
    "prereqs": [
      "12"
    ],
    "bullets": [
      "Engine (#12)"
    ],
    "erfolg": "Empfehlungen sichtbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Empfehlungs-Karten.\nBitte führe mich Schritt für Schritt durch:\n1. Dashboard zeigt 'Für dich empfohlen' + 3 Themen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-16",
    "sprintNum": "05",
    "taskNum": "16",
    "welle": 4,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "DSGVO-Pflicht",
    "title": "Cookie-Banner mit Consent",
    "prereqs": [
      "03"
    ],
    "bullets": [
      "DSGVO-Check (#3)"
    ],
    "erfolg": "Cookie-Banner aktiv.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute baue ich das Cookie-Banner.\nBitte führe mich Schritt für Schritt durch:\n1. src/components/legal/CookieBanner.tsx mit Accept/Reject/Customize.\n2. Persistenz in localStorage.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-17",
    "sprintNum": "05",
    "taskNum": "17",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DSGVO-Pflicht",
    "title": "Account-Löschung + Daten-Export (DSGVO)",
    "prereqs": [
      "02",
      "11"
    ],
    "bullets": [
      "Auth + Profil"
    ],
    "erfolg": "DSGVO-Endpoints funktionieren.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich DSGVO-Endpoints.\nBitte führe mich Schritt für Schritt durch:\n1. /api/account/delete: löscht User + Cascade.\n2. /api/account/export: liefert JSON-ZIP aller Daten.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-18",
    "sprintNum": "05",
    "taskNum": "18",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Prompts mit User-Historie kontextualisieren",
    "prereqs": [
      "12"
    ],
    "bullets": [
      "Engine (#12)"
    ],
    "erfolg": "Personalisierte Prompts.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute füge ich User-Historie in Dialog-Prompts ein.\nBitte führe mich Schritt für Schritt durch:\n1. Prompts erhalten progress-Daten als Kontext: 'User hatte Schwierigkeiten bei X'.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-19",
    "sprintNum": "05",
    "taskNum": "19",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Mobile-Layouts für Smartphone (<640 px)",
    "prereqs": [
      "05",
      "10"
    ],
    "bullets": [
      "Profil + Settings"
    ],
    "erfolg": "Alle Seiten mobil nutzbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich alle Seiten Mobile-tauglich.\nBitte führe mich Schritt für Schritt durch:\n1. Tailwind-Diffs pro Seite.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-20",
    "sprintNum": "05",
    "taskNum": "20",
    "welle": 5,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Mobile-Tests auf echten Geräten",
    "prereqs": [
      "19"
    ],
    "bullets": [
      "Mobile-Layouts (#19)"
    ],
    "erfolg": "Mobil-Test-Bericht.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute teste ich auf echten Geräten.\nBitte führe mich Schritt für Schritt durch:\n1. iPhone Safari + Android Chrome.\n2. docs/sprint-reviews/mobile-tests-sprint-5.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-21",
    "sprintNum": "05",
    "taskNum": "21",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Lernhistorie persistieren über Sessions",
    "prereqs": [],
    "bullets": [
      "Progress (S4)"
    ],
    "erfolg": "Lernhistorie persistent.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute persistiere ich Lernverlauf konsistent.\nBitte führe mich Schritt für Schritt durch:\n1. Migration: history_entries (user_id, action, topic_id, created_at) für Analytics.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-22",
    "sprintNum": "05",
    "taskNum": "22",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Empfehlungs-Qualität evaluieren",
    "prereqs": [
      "12"
    ],
    "bullets": [
      "Engine (#12)"
    ],
    "erfolg": "Empfehlungs-Qualität dokumentiert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute evaluiere ich Empfehlungen.\nBitte führe mich Schritt für Schritt durch:\n1. 5 Team-Member-Profile mock-daten, manuell scoren.\n2. docs/eval-results/recommendations.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-23",
    "sprintNum": "05",
    "taskNum": "23",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "DSGVO-Tests (Cookie-Banner, Account-Löschung)",
    "prereqs": [
      "16",
      "17"
    ],
    "bullets": [
      "Cookie + Delete"
    ],
    "erfolg": "DSGVO-Tests grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute teste ich DSGVO-Pfade E2E.\nBitte führe mich Schritt für Schritt durch:\n1. tests/e2e/dsgvo.spec.ts: Cookie-Reject, Account-Delete, Export.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-24",
    "sprintNum": "05",
    "taskNum": "24",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Tablet-Layouts (640-1024 px)",
    "prereqs": [
      "19"
    ],
    "bullets": [
      "Smartphone-Layouts"
    ],
    "erfolg": "Tablet-Layouts ok.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Tablet-Layouts.\nBitte führe mich Schritt für Schritt durch:\n1. Tailwind-Diffs.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-25",
    "sprintNum": "05",
    "taskNum": "25",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Ende",
    "title": "WCAG-2.1-AA-Audit der gesamten App",
    "prereqs": [],
    "bullets": [
      "Alle Features"
    ],
    "erfolg": "WCAG-Audit dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute mache ich einen WCAG-Audit.\nBitte führe mich Schritt für Schritt durch:\n1. Tool axe-core in CI integrieren.\n2. Findings in docs/a11y-wcag-sprint-5.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-26",
    "sprintNum": "05",
    "taskNum": "26",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Performance: Auth-Sessions cachen",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Auth"
    ],
    "erfolg": "Auth-Pfade < 50 ms.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute cache ich Auth-Sessions.\nBitte führe mich Schritt für Schritt durch:\n1. Edge-Caching für JWT-Verifizierung.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-27",
    "sprintNum": "05",
    "taskNum": "27",
    "welle": 6,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Mit Taycir: Empfehlungs-Qualität testen",
    "prereqs": [
      "22"
    ],
    "bullets": [
      "Eval (#22)"
    ],
    "erfolg": "Empfehlungen werden akzeptiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute teste ich Empfehlungen mit Taycir.\nBitte führe mich Schritt für Schritt durch:\n1. 5 Team-Sessions, Empfehlungen manuell bewerten.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-28",
    "sprintNum": "05",
    "taskNum": "28",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Sprint-Ende",
    "title": "DSGVO-Notizen für Storage erweitern",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Storage-DSGVO dokumentiert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute erweitere ich DSGVO-Notizen.\nBitte führe mich Schritt für Schritt durch:\n1. docs/legal/storage-dsgvo.md (Retention, Verschlüsselung-Plan für Sprint 7).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-29",
    "sprintNum": "05",
    "taskNum": "29",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-5-Review + Demo-Skript",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Review-Material bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute bereite ich Sprint-5-Review vor.\nBitte führe mich Schritt für Schritt durch:\n1. Review-Folien + Demo-Skript.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-30",
    "sprintNum": "05",
    "taskNum": "30",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Demo-Polish + Lighthouse",
    "prereqs": [
      "19",
      "24"
    ],
    "bullets": [
      "Mobile + Tablet"
    ],
    "erfolg": "Lighthouse > 90.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Demo-Polish.\nBitte führe mich Schritt für Schritt durch:\n1. Lighthouse-Werte aktualisieren.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-31",
    "sprintNum": "05",
    "taskNum": "31",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Review",
    "title": "Sprint-5-Testbericht + Regression",
    "prereqs": [
      "13",
      "23"
    ],
    "bullets": [
      "Tests"
    ],
    "erfolg": "Testbericht abgabefähig.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich Sprint-5-Testbericht.\nBitte führe mich Schritt für Schritt durch:\n1. Coverage, neue Tests, Bugs, Risiken.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-32",
    "sprintNum": "05",
    "taskNum": "32",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Datenbank-Backup für Demo verifizieren",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Backup-Restore funktioniert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute verifiziere ich Backups.\nBitte führe mich Schritt für Schritt durch:\n1. Backup ziehen + restore in Sandbox testen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-33",
    "sprintNum": "05",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-5-Review halten + Retro",
    "prereqs": [
      "29"
    ],
    "bullets": [
      "Review-Doku"
    ],
    "erfolg": "Review gehalten.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich Review + Retro.\nBitte führe mich Schritt für Schritt durch:\n1. Retro-Doku.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-34",
    "sprintNum": "05",
    "taskNum": "34",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Bugfix-Stunde Sprint-5",
    "prereqs": [
      "31"
    ],
    "bullets": [
      "Testbericht"
    ],
    "erfolg": "Kritische Bugs gefixt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute fixe ich offene Bugs.\nBitte führe mich Schritt für Schritt durch:\n1. Kritisch zuerst.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-35",
    "sprintNum": "05",
    "taskNum": "35",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-5-KI-Bericht",
    "prereqs": [
      "22"
    ],
    "bullets": [
      "Eval"
    ],
    "erfolg": "KI-Bericht bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich Sprint-5-KI-Bericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/sprint-5.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s5-36",
    "sprintNum": "05",
    "taskNum": "36",
    "welle": 8,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wireframe Sprint 6: Dark Mode + Quiz",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Wireframes für Sprint 6.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute skizziere ich Sprint-6-UI.\nBitte führe mich Schritt für Schritt durch:\n1. docs/wireframes/dark-mode.md + quiz.html.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-01",
    "sprintNum": "06",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-6-Kickoff + User-Testing-Plan",
    "prereqs": [],
    "bullets": [
      "Sprint-5-Retro"
    ],
    "erfolg": "Kickoff + Testing-Plan.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-6-Kickoff.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-6-kickoff.md.\n2. docs/user-testing/plan.md mit Methodik (8-10 Studierende, je 30 Min, Aufgaben-Liste).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-02",
    "sprintNum": "06",
    "taskNum": "02",
    "welle": 1,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Redesign",
    "title": "Style-Guide v1 + Komponenten-Library auditieren",
    "prereqs": [],
    "bullets": [
      "UI-Bestand"
    ],
    "erfolg": "Style-Guide dokumentiert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute dokumentiere ich unseren Style-Guide.\nBitte führe mich Schritt für Schritt durch:\n1. docs/design/style-guide-v1.md mit Tokens, Komponenten, Patterns.\n2. Liste aller Komponenten + Reuse-Status.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-03",
    "sprintNum": "06",
    "taskNum": "03",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor Quiz-API",
    "title": "Quiz-Schema: quizzes + quiz_attempts",
    "prereqs": [],
    "bullets": [
      "Schema bisher"
    ],
    "erfolg": "Quiz-Tabellen mit RLS.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich das Quiz-Datenmodell.\nBitte führe mich Schritt für Schritt durch:\n1. supabase/migrations/0009_quiz_schema.sql: quizzes (id, topic_id, time_limit_sec), quiz_attempts (id, user_id, quiz_id, score, sta\nrted_at, finished_at).\n2. RLS-Policies.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-04",
    "sprintNum": "06",
    "taskNum": "04",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Testing",
    "title": "User-Testing-Skript + Aufgaben-Set",
    "prereqs": [
      "01"
    ],
    "bullets": [
      "Plan (#1)"
    ],
    "erfolg": "Testing-Skript bereit.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich das Testing-Skript.\nBitte führe mich Schritt für Schritt durch:\n1. docs/user-testing/script.md mit 5 Aufgaben (Login, Upload, Lerndialog usw.).\n2. Konkrete Aufgaben für Teilnehmende.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-05",
    "sprintNum": "06",
    "taskNum": "05",
    "welle": 2,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Quiz-API",
    "title": "Quiz-Fragen-Prompt (Zeitlimit-tauglich)",
    "prereqs": [],
    "bullets": [
      "Sprint-3-Prompts"
    ],
    "erfolg": "Quiz-Prompt fertig.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich den Quiz-Fragen-Prompt.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/anthropic/prompts/quiz-questions.ts: kompakte, eindeutig-bewertbare Fragen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-06",
    "sprintNum": "06",
    "taskNum": "06",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Dark-Mode-Vorbereitung: CSS-Variablen",
    "prereqs": [],
    "bullets": [
      "Tailwind-Tokens"
    ],
    "erfolg": "Dark-Mode-Infrastruktur bereit.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute bereite ich Dark Mode vor.\nBitte führe mich Schritt für Schritt durch:\n1. Tailwind-Config mit dark: Varianten.\n2. Globale CSS-Variablen.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-07",
    "sprintNum": "06",
    "taskNum": "07",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Testing",
    "title": "8-10 Test-Nutzer rekrutieren",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "8-10 Slots gebucht.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute rekrutiere ich Test-Nutzer.\nBitte führe mich Schritt für Schritt durch:\n1. Aushang/Slack-Posting in Hochschul-Channels.\n2. Termin-Doodle mit Slots.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-08",
    "sprintNum": "06",
    "taskNum": "08",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Quiz-API mit Timer + Scoring",
    "prereqs": [
      "03"
    ],
    "bullets": [
      "Schema (#3)"
    ],
    "erfolg": "Quiz-API funktioniert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich Quiz-Endpoints.\nBitte führe mich Schritt für Schritt durch:\n1. /api/quiz/start + /api/quiz/submit. Timer serverseitig validieren.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-09",
    "sprintNum": "06",
    "taskNum": "09",
    "welle": 3,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "User-Testing-Sessions (4-5 Teilnehmende)",
    "prereqs": [
      "04",
      "07"
    ],
    "bullets": [
      "Skript + Slots"
    ],
    "erfolg": "5 Sessions dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute führe ich die ersten User-Tests durch.\nBitte führe mich Schritt für Schritt durch:\n1. Pro Session: Notizen in docs/user-testing/sessions/.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-10",
    "sprintNum": "06",
    "taskNum": "10",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Dark-Mode-Implementierung in allen Komponenten",
    "prereqs": [
      "06"
    ],
    "bullets": [
      "Dark-Mode-Vorbereitung"
    ],
    "erfolg": "Dark Mode überall.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute migriere ich alle Komponenten auf Dark-Mode.\nBitte führe mich Schritt für Schritt durch:\n1. Pro Komponente: dark: Tailwind-Varianten.\n2. Theme-Toggle in Header.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-11",
    "sprintNum": "06",
    "taskNum": "11",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Quiz-Fragen-Qualität evaluieren",
    "prereqs": [
      "05"
    ],
    "bullets": [
      "Prompt (#5)"
    ],
    "erfolg": "Quiz-Fragen-Qualität dokumentiert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute evaluiere ich Quiz-Fragen.\nBitte führe mich Schritt für Schritt durch:\n1. 5 Themen, je 10 Fragen, manuell scoren.\n2. docs/eval-results/quiz-questions.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-12",
    "sprintNum": "06",
    "taskNum": "12",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wochen-Update + Priorisierungs-Workshop",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Erste Sessions"
    ],
    "erfolg": "Findings priorisiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Feedback-Priorisierung.\nBitte führe mich Schritt für Schritt durch:\n1. docs/user-testing/findings-w2.md.\n2. Backlog neu sortieren.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-13",
    "sprintNum": "06",
    "taskNum": "13",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Restliche User-Tests + Bericht",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Erste Sessions"
    ],
    "erfolg": "User-Testing-Bericht abgeschlossen.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute mache ich die restlichen Tests + Bericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/user-testing/report.md mit Top-Findings und Empfehlungen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-14",
    "sprintNum": "06",
    "taskNum": "14",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Quiz-Modus UI",
    "prereqs": [
      "08",
      "10"
    ],
    "bullets": [
      "API + Dark Mode"
    ],
    "erfolg": "Quiz-Modus nutzbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich die Quiz-UI.\nBitte führe mich Schritt für Schritt durch:\n1. src/app/(app)/quiz/[topicId]/page.tsx: Timer-Anzeige, Frage, Submit.\n2. Result-Card am Ende.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-15",
    "sprintNum": "06",
    "taskNum": "15",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Statistik-Endpunkte: Lernverhalten",
    "prereqs": [],
    "bullets": [
      "Progress + Sessions"
    ],
    "erfolg": "Stats-API funktioniert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich Statistik-Endpoints.\nBitte führe mich Schritt für Schritt durch:\n1. /api/stats/me liefert Streak, Sessions, Zeit pro Thema, Quiz-Score.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-16",
    "sprintNum": "06",
    "taskNum": "16",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Antwort-Eval für Quiz-Tempo optimieren",
    "prereqs": [
      "05"
    ],
    "bullets": [
      "Prompt (#5)"
    ],
    "erfolg": "Quiz-Antworten < 1 Sek.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute beschleunige ich Quiz-Eval.\nBitte führe mich Schritt für Schritt durch:\n1. Schneller Model-Fallback (Haiku) für Quiz-Bewertung.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-17",
    "sprintNum": "06",
    "taskNum": "17",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Pflicht",
    "title": "Statistik-Dashboard mit Charts",
    "prereqs": [
      "15"
    ],
    "bullets": [
      "Stats-API"
    ],
    "erfolg": "Stats-Dashboard sichtbar.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich das Stats-Dashboard.\nBitte führe mich Schritt für Schritt durch:\n1. Recharts einbauen.\n2. src/app/(app)/stats/page.tsx mit 3 Charts.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-18",
    "sprintNum": "06",
    "taskNum": "18",
    "welle": 5,
    "who": "Sara",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Theme-Präferenz persistent pro Nutzer",
    "prereqs": [
      "10"
    ],
    "bullets": [
      "Dark Mode"
    ],
    "erfolg": "Theme bleibt nach Logout erhalten.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute speichere ich Theme-Wahl in DB.\nBitte führe mich Schritt für Schritt durch:\n1. Migration profiles.theme.\n2. Hook useTheme schreibt + liest.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-19",
    "sprintNum": "06",
    "taskNum": "19",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Performance-Optimierung Stats-Queries",
    "prereqs": [
      "15"
    ],
    "bullets": [
      "Stats-API"
    ],
    "erfolg": "Stats-API < 200 ms.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute optimiere ich Stats-Queries.\nBitte führe mich Schritt für Schritt durch:\n1. Aggregate als Materialized Views.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-20",
    "sprintNum": "06",
    "taskNum": "20",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Prompt-Cleanup + finale Bewertung",
    "prereqs": [
      "11"
    ],
    "bullets": [
      "Eval (#11)"
    ],
    "erfolg": "Prompts konsolidiert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute räume ich Prompts auf.\nBitte führe mich Schritt für Schritt durch:\n1. docs/prompts/sprint-6-summary.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-21",
    "sprintNum": "06",
    "taskNum": "21",
    "welle": 5,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Mit Taycir: finale Eval-Runde",
    "prereqs": [
      "11",
      "20"
    ],
    "bullets": [
      "Eval-Daten"
    ],
    "erfolg": "Eval-Trend dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute machen wir die finale Eval-Runde.\nBitte führe mich Schritt für Schritt durch:\n1. Vergleich Sprint-1 bis 6.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-22",
    "sprintNum": "06",
    "taskNum": "22",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Snapshot-Tests für Quiz + Stats",
    "prereqs": [
      "14",
      "17"
    ],
    "bullets": [
      "Quiz + Stats"
    ],
    "erfolg": "Tests grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute teste ich neue Komponenten.\nBitte führe mich Schritt für Schritt durch:\n1. Snapshot-Tests.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-23",
    "sprintNum": "06",
    "taskNum": "23",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Animationen + Sprint-6-Polish",
    "prereqs": [
      "14",
      "17"
    ],
    "bullets": [
      "Quiz + Stats"
    ],
    "erfolg": "Demo-tauglich.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Polish.\nBitte führe mich Schritt für Schritt durch:\n1. Animationen, Skeletons, Empty-States.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-24",
    "sprintNum": "06",
    "taskNum": "24",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Regressions-Suite + neue E2E-Tests",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "E2Es grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute laufe ich Regression + neue E2E.\nBitte führe mich Schritt für Schritt durch:\n1. tests/e2e/quiz.spec.ts + dark-mode.spec.ts.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-25",
    "sprintNum": "06",
    "taskNum": "25",
    "welle": 6,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Backlog für Sprint 7 (QA + Security)",
    "prereqs": [
      "13"
    ],
    "bullets": [
      "User-Bericht"
    ],
    "erfolg": "Sprint-7-Backlog bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schreibe ich Sprint-7-Backlog.\nBitte führe mich Schritt für Schritt durch:\n1. backlog/sprint-7.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-26",
    "sprintNum": "06",
    "taskNum": "26",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "DB-Cleanup-Job für alte Quiz-Attempts",
    "prereqs": [
      "03"
    ],
    "bullets": [
      "Quiz-Schema"
    ],
    "erfolg": "Cleanup aktiv.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich Cleanup.\nBitte führe mich Schritt für Schritt durch:\n1. Stored Procedure löscht failed attempts > 30 Tage.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-27",
    "sprintNum": "06",
    "taskNum": "27",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Quiz-Modell-Auswahl finalisieren",
    "prereqs": [
      "16"
    ],
    "bullets": [
      "Performance-Tuning"
    ],
    "erfolg": "Modell-Entscheidung dokumentiert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute finalisiere ich Quiz-Modell.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/quiz-model-choice.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-28",
    "sprintNum": "06",
    "taskNum": "28",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Review",
    "title": "Sprint-6-Testbericht + Feedback in Backlog",
    "prereqs": [
      "24",
      "13"
    ],
    "bullets": [
      "E2E + User-Bericht"
    ],
    "erfolg": "Testbericht abgabefähig.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich Sprint-6-Testbericht.\nBitte führe mich Schritt für Schritt durch:\n1. Coverage, Bugs, Findings.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-29",
    "sprintNum": "06",
    "taskNum": "29",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-6-Review + Demo-Skript",
    "prereqs": [
      "25",
      "28"
    ],
    "bullets": [
      "Backlog + Bericht"
    ],
    "erfolg": "Review-Material bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute bereite ich Review vor.\nBitte führe mich Schritt für Schritt durch:\n1. Review-Folien + Demo-Skript.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-30",
    "sprintNum": "06",
    "taskNum": "30",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Demo-Day-Polish + Lighthouse",
    "prereqs": [
      "23"
    ],
    "bullets": [
      "Polish (#23)"
    ],
    "erfolg": "Lighthouse > 90.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Demo-Polish.\nBitte führe mich Schritt für Schritt durch:\n1. Lighthouse-Werte.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-31",
    "sprintNum": "06",
    "taskNum": "31",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Production-Smoke-Test erweitern",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Smoke-Test umfasst neue Features.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute erweitere ich Smoke-Tests.\nBitte führe mich Schritt für Schritt durch:\n1. Tests für Quiz + Stats nach Deploy.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-32",
    "sprintNum": "06",
    "taskNum": "32",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Vorbereitung Sprint 7: Security-Plan",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Plan bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute skizziere ich Security-Plan.\nBitte führe mich Schritt für Schritt durch:\n1. docs/concepts/security-plan.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-33",
    "sprintNum": "06",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-6-Review halten + Retro",
    "prereqs": [
      "29"
    ],
    "bullets": [
      "Review-Doku"
    ],
    "erfolg": "Review gehalten.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich Review + Retro.\nBitte führe mich Schritt für Schritt durch:\n1. Retro in docs/sprint-reviews/sprint-6-retro.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-34",
    "sprintNum": "06",
    "taskNum": "34",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Bugfix-Stunde Sprint-6",
    "prereqs": [
      "28"
    ],
    "bullets": [
      "Testbericht"
    ],
    "erfolg": "Kritische Bugs gefixt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute fixe ich kritische Bugs.\nBitte führe mich Schritt für Schritt durch:\n1. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-35",
    "sprintNum": "06",
    "taskNum": "35",
    "welle": 8,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Erste Skizze A11y-Verbesserungen Sprint 7",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "A11y-Aufgaben definiert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute skizziere ich A11y-Aufgaben.\nBitte führe mich Schritt für Schritt durch:\n1. Aufgabenliste in backlog/sprint-7-a11y.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s6-36",
    "sprintNum": "06",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-6-KI-Bericht abschließen",
    "prereqs": [
      "21"
    ],
    "bullets": [
      "Eval"
    ],
    "erfolg": "KI-Bericht bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schließe ich KI-Bericht ab.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/sprint-6.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-01",
    "sprintNum": "07",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-7-Kickoff + Security-Audit-Plan",
    "prereqs": [],
    "bullets": [
      "Sprint-6-Retro"
    ],
    "erfolg": "Kickoff dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-7-Kickoff.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-7-kickoff.md mit Security-Audit-Plan.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-02",
    "sprintNum": "07",
    "taskNum": "02",
    "welle": 1,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Coverage-Plan",
    "title": "Test-Coverage-Gap-Analyse",
    "prereqs": [],
    "bullets": [
      "Bestehende Tests"
    ],
    "erfolg": "Gap-Liste dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute analysiere ich, wo wir < 60% Coverage sind.\nBitte führe mich Schritt für Schritt durch:\n1. npm test -- --coverage Ergebnisse interpretieren.\n2. docs/qa/coverage-gaps.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-03",
    "sprintNum": "07",
    "taskNum": "03",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sicherheits-Pflicht",
    "title": "Rate-Limiting auf allen APIs",
    "prereqs": [],
    "bullets": [
      "Bestehende APIs"
    ],
    "erfolg": "Rate-Limiting aktiv.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute baue ich Rate-Limiting.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/rate-limit/index.ts (Redis-frei mit Supabase Realtime oder einfacher Counter).\n2. Anwendung auf /api/ask, /api/upload, /api/session/*.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-04",
    "sprintNum": "07",
    "taskNum": "04",
    "welle": 2,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sicherheits-Pflicht",
    "title": "Prompt-Injection-Schutz + Input-Sanitization",
    "prereqs": [],
    "bullets": [
      "Prompts bisher"
    ],
    "erfolg": "Prompts injection-sicher.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute härte ich KI-Aufrufe gegen Injection.\nBitte führe mich Schritt für Schritt durch:\n1. src/lib/anthropic/sanitize.ts: filtert/escapet User-Eingaben in Prompts.\n2. Tests gegen gängige Injection-Patterns.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-05",
    "sprintNum": "07",
    "taskNum": "05",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Lighthouse-Audit + A11y-Fixes",
    "prereqs": [],
    "bullets": [
      "Bestehende UI"
    ],
    "erfolg": "Lighthouse > 90 überall.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute fahre ich Lighthouse + fixe Findings.\nBitte führe mich Schritt für Schritt durch:\n1. Lighthouse pro Hauptseite, Score < 90 fixen.\n2. ARIA-Labels, Kontrast, Keyboard-Nav.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-06",
    "sprintNum": "07",
    "taskNum": "06",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Test-Sprint",
    "title": "Coverage-Plan: Welche Tests fehlen, wer schreibt",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Gap-Analyse (#2)"
    ],
    "erfolg": "Coverage-Plan dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich den Coverage-Plan.\nBitte führe mich Schritt für Schritt durch:\n1. Pro fehlenden Bereich: Owner + ETA.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-07",
    "sprintNum": "07",
    "taskNum": "07",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Pen-Test",
    "title": "Pen-Test organisieren (Scope + Tools)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Pen-Test-Plan bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute organisiere ich internen Pen-Test.\nBitte führe mich Schritt für Schritt durch:\n1. docs/security/pentest-plan.md (Scope, Tools wie OWASP ZAP, Termin).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-08",
    "sprintNum": "07",
    "taskNum": "08",
    "welle": 3,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Coverage-Pflicht",
    "title": "Fehlende Unit + Integrationstests nachziehen",
    "prereqs": [
      "06"
    ],
    "bullets": [
      "Coverage-Plan"
    ],
    "erfolg": "Coverage steigt > 60%.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich fehlende Tests.\nBitte führe mich Schritt für Schritt durch:\n1. Folge dem Plan, schreibe Tests Stück für Stück.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-09",
    "sprintNum": "07",
    "taskNum": "09",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Performance: Bilder, Lazy-Load, Bundle-Splitting",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Bundle < 200 KB initial.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute optimiere ich Frontend-Performance.\nBitte führe mich Schritt für Schritt durch:\n1. next/image überall, dynamic imports für große Komponenten.\n2. Bundle-Analyzer-Run.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-10",
    "sprintNum": "07",
    "taskNum": "10",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DSGVO-Pflicht",
    "title": "PDF-Speicherung at-rest verschlüsseln",
    "prereqs": [],
    "bullets": [
      "Storage"
    ],
    "erfolg": "Storage-Verschlüsselung dokumentiert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute aktiviere ich Verschlüsselung.\nBitte führe mich Schritt für Schritt durch:\n1. Supabase Storage-Verschlüsselung prüfen (default on).\n2. docs/security/encryption.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-11",
    "sprintNum": "07",
    "taskNum": "11",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "API-Kosten-Monitoring + Alerts",
    "prereqs": [],
    "bullets": [
      "Bestehende KI-Aufrufe"
    ],
    "erfolg": "Kosten-Alerts aktiv.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute setze ich Kosten-Alerts auf.\nBitte führe mich Schritt für Schritt durch:\n1. Anthropic-Console-Alert bei 80% des Budgets.\n2. Slack-Webhook für Notifications.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-12",
    "sprintNum": "07",
    "taskNum": "12",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "DoD-Pflicht",
    "title": "DSGVO-Checkliste final abschließen",
    "prereqs": [],
    "bullets": [
      "DSGVO-Doku bisher"
    ],
    "erfolg": "DSGVO-Checkliste 100% abgeschlossen.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schließe ich die DSGVO-Checkliste ab.\nBitte führe mich Schritt für Schritt durch:\n1. docs/legal/dsgvo-final.md alle Punkte abhaken.\n2. AVV mit Anthropic Status klären.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-13",
    "sprintNum": "07",
    "taskNum": "13",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Internen Pen-Test durchführen",
    "prereqs": [
      "07",
      "03",
      "04"
    ],
    "bullets": [
      "Pen-Test-Plan + Hardening"
    ],
    "erfolg": "Pen-Test-Bericht.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute führe ich Pen-Test durch.\nBitte führe mich Schritt für Schritt durch:\n1. OWASP ZAP + manuelle Tests gegen häufige Vulns.\n2. Findings in docs/security/pentest-results.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-14",
    "sprintNum": "07",
    "taskNum": "14",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Bundle-Analyse-Findings beheben",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Performance-Audit"
    ],
    "erfolg": "Bundle weiter reduziert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute fixe ich Bundle-Findings.\nBitte führe mich Schritt für Schritt durch:\n1. Unused Dependencies entfernen.\n2. Code-Splits.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-15",
    "sprintNum": "07",
    "taskNum": "15",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sicherheits-Pflicht",
    "title": "Backup-Strategie + DB-Recovery testen",
    "prereqs": [],
    "bullets": [
      "DB"
    ],
    "erfolg": "Recovery validiert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute teste ich Recovery.\nBitte führe mich Schritt für Schritt durch:\n1. Backup ziehen, in Sandbox restoren, verifizieren.\n2. docs/security/backup-recovery.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-16",
    "sprintNum": "07",
    "taskNum": "16",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "KI-Edge-Case-Bugs fixen",
    "prereqs": [],
    "bullets": [
      "Bekannte Bugs"
    ],
    "erfolg": "Edge-Cases gehandhabt.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute fixe ich KI-Edge-Cases.\nBitte führe mich Schritt für Schritt durch:\n1. Leerantworten, Endlosschleifen, Off-Topic.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-17",
    "sprintNum": "07",
    "taskNum": "17",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Security-Tests (npm audit, Snyk)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Vulns dokumentiert + gefixt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute laufe ich Security-Scans.\nBitte führe mich Schritt für Schritt durch:\n1. npm audit fix, Snyk-Report.\n2. docs/security/vuln-scan.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-18",
    "sprintNum": "07",
    "taskNum": "18",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Fehlerseiten (404, 500) klar gestalten",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "404 + 500 sehen gut aus.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Fehlerseiten.\nBitte führe mich Schritt für Schritt durch:\n1. src/app/not-found.tsx + error.tsx.\n2. Freundlich + Action-Buttons.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-19",
    "sprintNum": "07",
    "taskNum": "19",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Bugfixes aus Pen-Test + QA-Backlog",
    "prereqs": [
      "13"
    ],
    "bullets": [
      "Pen-Test-Findings"
    ],
    "erfolg": "Findings gefixt.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute fixe ich Findings.\nBitte führe mich Schritt für Schritt durch:\n1. Pro Finding: Branch, Fix, Test.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-20",
    "sprintNum": "07",
    "taskNum": "20",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Bugfixes Dialog-Edge-Cases",
    "prereqs": [
      "16"
    ],
    "bullets": [
      "Edge-Cases (#16)"
    ],
    "erfolg": "Dialog stabil.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute fixe ich Dialog-Bugs aus E2E + User-Tests.\nBitte führe mich Schritt für Schritt durch:\n1. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-21",
    "sprintNum": "07",
    "taskNum": "21",
    "welle": 5,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Risiko-Register abschließen",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Risiko-Log final.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schließe ich Risiko-Register ab.\nBitte führe mich Schritt für Schritt durch:\n1. Alle Risiken Status final setzen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-22",
    "sprintNum": "07",
    "taskNum": "22",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Coverage verifizieren > 60%",
    "prereqs": [
      "08"
    ],
    "bullets": [
      "Tests (#8)"
    ],
    "erfolg": "Coverage > 60% bestätigt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute verifiziere ich Coverage.\nBitte führe mich Schritt für Schritt durch:\n1. npm test -- --coverage > 60% bestätigen.\n2. Bericht in docs/qa/coverage-final.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-23",
    "sprintNum": "07",
    "taskNum": "23",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Lighthouse > 90 final verifizieren",
    "prereqs": [
      "05"
    ],
    "bullets": [
      "Audit"
    ],
    "erfolg": "Lighthouse > 90 dokumentiert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute verifiziere ich Lighthouse.\nBitte führe mich Schritt für Schritt durch:\n1. Pro Seite Werte dokumentieren.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-24",
    "sprintNum": "07",
    "taskNum": "24",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "Production-Hardening: Monitoring + Alerts",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Monitoring aktiv.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute härte ich Production.\nBitte führe mich Schritt für Schritt durch:\n1. Sentry oder Logflare integrieren.\n2. Uptime-Monitor (z.B. UptimeRobot).\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-25",
    "sprintNum": "07",
    "taskNum": "25",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Finalen KI-Qualitätsbericht schreiben",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Bericht bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich finalen KI-Bericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/final-quality.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-26",
    "sprintNum": "07",
    "taskNum": "26",
    "welle": 6,
    "who": "Leon",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Mit Taycir KI-Eval konsolidieren",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Bericht (#25)"
    ],
    "erfolg": "Eval-Trend dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute konsolidiere ich KI-Eval-Stand.\nBitte führe mich Schritt für Schritt durch:\n1. Vergleich Sprints 2-7.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-27",
    "sprintNum": "07",
    "taskNum": "27",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-7-Review + Demo-Skript",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Review-Material bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute bereite ich Review vor.\nBitte führe mich Schritt für Schritt durch:\n1. Review-Folien + Demo-Skript.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-28",
    "sprintNum": "07",
    "taskNum": "28",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Review",
    "title": "Sprint-7-Testbericht (Security + Coverage)",
    "prereqs": [
      "13",
      "17",
      "22"
    ],
    "bullets": [
      "Pen-Test + Scans + Coverage"
    ],
    "erfolg": "Testbericht final.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich finalen Sprint-Bericht.\nBitte führe mich Schritt für Schritt durch:\n1. Coverage, Bugs, Security-Findings.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-29",
    "sprintNum": "07",
    "taskNum": "29",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Demo-Day-Polish",
    "prereqs": [
      "18",
      "23"
    ],
    "bullets": [
      "Fehlerseiten + Lighthouse"
    ],
    "erfolg": "Demo-tauglich.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Polish.\nBitte führe mich Schritt für Schritt durch:\n1. Letzte Visual-Fixes.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-30",
    "sprintNum": "07",
    "taskNum": "30",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "DoD",
    "title": "0 kritische Bugs verifizieren",
    "prereqs": [
      "19"
    ],
    "bullets": [
      "Bugfixes (#19)"
    ],
    "erfolg": "0 kritische Bugs.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute prüfe ich Bug-Tracker.\nBitte führe mich Schritt für Schritt durch:\n1. Liste alle Issues mit Priority critical.\n2. Verifizieren dass keine offen sind.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-31",
    "sprintNum": "07",
    "taskNum": "31",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Vorbereitung Sprint 8: Dokumentations-Plan",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Doku-Plan bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute skizziere ich Doku-Plan für Sprint 8.\nBitte führe mich Schritt für Schritt durch:\n1. docs/concepts/documentation-plan.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-32",
    "sprintNum": "07",
    "taskNum": "32",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "DoD-Pflicht",
    "title": "Vollständiger Security- + DSGVO-Bericht",
    "prereqs": [
      "12",
      "13",
      "17"
    ],
    "bullets": [
      "Alle Audits"
    ],
    "erfolg": "Sicherheitsbericht abgabefähig.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich den Abgabe-relevanten Sicherheitsbericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/legal/security-dsgvo-final.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-33",
    "sprintNum": "07",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-7-Review halten + Retro",
    "prereqs": [
      "27"
    ],
    "bullets": [
      "Review-Doku"
    ],
    "erfolg": "Review gehalten.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich Review + Retro.\nBitte führe mich Schritt für Schritt durch:\n1. Retro-Doku.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-34",
    "sprintNum": "07",
    "taskNum": "34",
    "welle": 8,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Wireframe Sprint 8: Doku-Seiten",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Wireframes bereit.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute skizziere ich Sprint-8-UI.\nBitte führe mich Schritt für Schritt durch:\n1. docs/wireframes/help-pages.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-35",
    "sprintNum": "07",
    "taskNum": "35",
    "welle": 8,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Final-Bugfix-Run",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Sprint-7-Bug-Backlog abgearbeitet.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute fixe ich verbleibende Sprint-7-Bugs.\nBitte führe mich Schritt für Schritt durch:\n1. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s7-36",
    "sprintNum": "07",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-7-KI-Bericht abschließen",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Bericht (#25)"
    ],
    "erfolg": "KI-Bericht bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schließe ich KI-Bericht ab.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/sprint-7.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-01",
    "sprintNum": "08",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Implementation",
    "title": "Sprint-8-Kickoff + Doku-Plan",
    "prereqs": [],
    "bullets": [
      "Sprint-7-Retro"
    ],
    "erfolg": "Kickoff dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-8-Kickoff.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-8-kickoff.md mit Doku-Plan (Tech-Doku + User-Manual + Slides).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-02",
    "sprintNum": "08",
    "taskNum": "02",
    "welle": 1,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "Benutzerhandbuch-Entwurf v1 (mit Screenshots)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Handbuch v1 bereit.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich das Benutzerhandbuch.\nBitte führe mich Schritt für Schritt durch:\n1. docs/user-manual/v1.md: Step-by-step für jeden Hauptpfad.\n2. Screenshots-Anleitung.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-03",
    "sprintNum": "08",
    "taskNum": "03",
    "welle": 1,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "KI-Architektur dokumentieren + Diagramm",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "AI-Architektur-Doku bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute dokumentiere ich die KI-Architektur.\nBitte führe mich Schritt für Schritt durch:\n1. docs/architecture/ai-architecture.md mit Mermaid-Diagramm.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-04",
    "sprintNum": "08",
    "taskNum": "04",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "Finale UI-Politur + Empty-States überall",
    "prereqs": [],
    "bullets": [
      "Alle Features"
    ],
    "erfolg": "UI feel-good überall.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute poliere ich UI.\nBitte führe mich Schritt für Schritt durch:\n1. Empty-States, Loading-Skeletons, Fehler-Toasts.\n2. Tailwind-Diffs.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-05",
    "sprintNum": "08",
    "taskNum": "05",
    "welle": 2,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "API-Doku (OpenAPI) + DB-Schema-Doku",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "API + DB-Doku bereit.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute schreibe ich API-Doku.\nBitte führe mich Schritt für Schritt durch:\n1. openapi.yaml für alle Routes.\n2. docs/architecture/db-schema.md mit ER-Diagramm.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-06",
    "sprintNum": "08",
    "taskNum": "06",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Folien",
    "title": "Finale Präsentations-Gliederung",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Gliederung bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute schreibe ich die Präsentations-Gliederung.\nBitte führe mich Schritt für Schritt durch:\n1. docs/presentation/outline.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-07",
    "sprintNum": "08",
    "taskNum": "07",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "User-Manual mit Screenshots vervollständigen",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "v1 (#2)"
    ],
    "erfolg": "Handbuch mit Screenshots.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute füge ich Screenshots ein.\nBitte führe mich Schritt für Schritt durch:\n1. docs/user-manual/v2.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-08",
    "sprintNum": "08",
    "taskNum": "08",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Loading-Skeletons konsistent überall",
    "prereqs": [
      "04"
    ],
    "bullets": [
      "Politur (#4)"
    ],
    "erfolg": "Skeletons überall.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Skeletons konsistent.\nBitte führe mich Schritt für Schritt durch:\n1. Globale Skeleton-Komponente.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-09",
    "sprintNum": "08",
    "taskNum": "09",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Alle Prompts dokumentieren in docs/prompts/",
    "prereqs": [
      "03"
    ],
    "bullets": [
      "AI-Architektur"
    ],
    "erfolg": "Prompt-Doku final.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute konsolidiere ich Prompt-Doku final.\nBitte führe mich Schritt für Schritt durch:\n1. docs/prompts/index.md mit allen Prompts.\n2. Pro Prompt: Version, Zweck, Eval-Score.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-10",
    "sprintNum": "08",
    "taskNum": "10",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Production-Env-Review (Skalierung, Kosten)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Production-Review bereit.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute reviewe ich Production-Setup.\nBitte führe mich Schritt für Schritt durch:\n1. docs/architecture/production-review.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-11",
    "sprintNum": "08",
    "taskNum": "11",
    "welle": 3,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "Probedurchlauf 1 (intern)",
    "prereqs": [
      "06"
    ],
    "bullets": [
      "Outline"
    ],
    "erfolg": "Probedurchlauf 1 erledigt.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Probedurchlauf 1.\nBitte führe mich Schritt für Schritt durch:\n1. Folien laufen lassen.\n2. Feedback sammeln.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-12",
    "sprintNum": "08",
    "taskNum": "12",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Tech-Doku Review (alle docs/)",
    "prereqs": [
      "03",
      "05",
      "09"
    ],
    "bullets": [
      "Doku gebaut"
    ],
    "erfolg": "Doku konsistent.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute reviewe ich alle docs/.\nBitte führe mich Schritt für Schritt durch:\n1. Konsistenz prüfen, doppelte Inhalte entfernen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-13",
    "sprintNum": "08",
    "taskNum": "13",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Accessibility-Recheck",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "A11y konform.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich finalen A11y-Check.\nBitte führe mich Schritt für Schritt durch:\n1. axe-core auf jeder Seite.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-14",
    "sprintNum": "08",
    "taskNum": "14",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Präsentation",
    "title": "KI-Qualitäts-Metriken Sprints 1-7 visualisieren",
    "prereqs": [],
    "bullets": [
      "Eval-Daten"
    ],
    "erfolg": "KI-Visuals bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute mache ich Charts für die Präsentation.\nBitte führe mich Schritt für Schritt durch:\n1. docs/ki-reports/visual-summary.md mit Recharts/Mermaid.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-15",
    "sprintNum": "08",
    "taskNum": "15",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Kostenbericht 9 Monate",
    "prereqs": [],
    "bullets": [
      "Kostenlogs"
    ],
    "erfolg": "Kostenbericht final.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute schreibe ich Kostenbericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/cost-analysis/final.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-16",
    "sprintNum": "08",
    "taskNum": "16",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "Probedurchlauf 2 + Demo-Skript final",
    "prereqs": [
      "11"
    ],
    "bullets": [
      "P1"
    ],
    "erfolg": "Demo-Skript final.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute mache ich Probedurchlauf 2.\nBitte führe mich Schritt für Schritt durch:\n1. docs/presentation/demo-script-final.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-17",
    "sprintNum": "08",
    "taskNum": "17",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Architektur-Doku reviewen",
    "prereqs": [
      "03",
      "05"
    ],
    "bullets": [
      "AI + DB-Doku"
    ],
    "erfolg": "Architektur-Doku rund.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute reviewe ich Architektur-Doku.\nBitte führe mich Schritt für Schritt durch:\n1. Konsistenz Frontend ↔ Backend ↔ AI.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-18",
    "sprintNum": "08",
    "taskNum": "18",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Letzte Bugfix-Runde + UI-Snapshot-Tests final",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "UI bug-frei.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute fixe ich verbleibende UI-Bugs.\nBitte führe mich Schritt für Schritt durch:\n1. Snapshot-Tests aktualisieren.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-19",
    "sprintNum": "08",
    "taskNum": "19",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Prompt-Freeze + finale Versionierung",
    "prereqs": [
      "09"
    ],
    "bullets": [
      "Prompt-Doku"
    ],
    "erfolg": "Prompts eingefroren.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute friere ich Prompts ein.\nBitte führe mich Schritt für Schritt durch:\n1. Alle Prompts mit Version-Tag.\n2. docs/prompts/FROZEN.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-20",
    "sprintNum": "08",
    "taskNum": "20",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Finale Bugfixes + Migrationen einfrieren",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Backend stabil.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute fixe ich Backend + friere Migrationen ein.\nBitte führe mich Schritt für Schritt durch:\n1. supabase/migrations/FROZEN.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-21",
    "sprintNum": "08",
    "taskNum": "21",
    "welle": 5,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Finales Dozenten-Feedback einholen",
    "prereqs": [
      "16"
    ],
    "bullets": [
      "Demo-Skript final"
    ],
    "erfolg": "Dozenten-Feedback eingearbeitet.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute hole ich finales Dozenten-Feedback.\nBitte führe mich Schritt für Schritt durch:\n1. Termin + Demo + Feedback dokumentieren.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-22",
    "sprintNum": "08",
    "taskNum": "22",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "README final überarbeiten + Contributor-Guide",
    "prereqs": [
      "12"
    ],
    "bullets": [
      "Tech-Review"
    ],
    "erfolg": "README abgabe-tauglich.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute finalisiere ich README.\nBitte führe mich Schritt für Schritt durch:\n1. Mit Badges, Quickstart, Contributing-Section.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-23",
    "sprintNum": "08",
    "taskNum": "23",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "UI-Freeze + finale visuelle QA",
    "prereqs": [
      "18"
    ],
    "bullets": [
      "Bugfixes"
    ],
    "erfolg": "UI eingefroren.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute friere ich UI ein.\nBitte führe mich Schritt für Schritt durch:\n1. Alle Komponenten final.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-24",
    "sprintNum": "08",
    "taskNum": "24",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Code-Freeze auf develop + Release-Candidate-Tag",
    "prereqs": [
      "20"
    ],
    "bullets": [
      "Bugfixes"
    ],
    "erfolg": "RC1 getaggt.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute setze ich RC-Tag.\nBitte führe mich Schritt für Schritt durch:\n1. git tag v0.9.0-rc1.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-25",
    "sprintNum": "08",
    "taskNum": "25",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "KI-Übergabedokumentation finalisieren",
    "prereqs": [
      "09",
      "19"
    ],
    "bullets": [
      "Prompts gefroren"
    ],
    "erfolg": "Handover-Doku bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich KI-Übergabe-Doku.\nBitte führe mich Schritt für Schritt durch:\n1. docs/handover/ai-handover.md (für künftige Wartung).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-26",
    "sprintNum": "08",
    "taskNum": "26",
    "welle": 6,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-8-Review + Demo-Skript",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Review-Material bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute bereite ich Sprint-8-Review vor.\nBitte führe mich Schritt für Schritt durch:\n1. Review-Folien.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-27",
    "sprintNum": "08",
    "taskNum": "27",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Finaler Testdurchlauf",
    "prereqs": [],
    "bullets": [
      "Alle Tests"
    ],
    "erfolg": "Alle Tests grün.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute mache ich den finalen Testdurchlauf.\nBitte führe mich Schritt für Schritt durch:\n1. Alle E2Es + Unit-Tests.\n2. docs/qa/final-test-run.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-28",
    "sprintNum": "08",
    "taskNum": "28",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Letzte visuelle QA mit Sara",
    "prereqs": [
      "23"
    ],
    "bullets": [
      "UI-Freeze"
    ],
    "erfolg": "Visuell sauber.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich visuelle QA.\nBitte führe mich Schritt für Schritt durch:\n1. Mit Sara durchgehen, alle Seiten.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-29",
    "sprintNum": "08",
    "taskNum": "29",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Abgabepaket-Inhalte zusammenstellen",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Abgabepaket bereit.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute stelle ich das Abgabepaket zusammen.\nBitte führe mich Schritt für Schritt durch:\n1. docs/handover/submission-package.md (Liste aller Inhalte).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-30",
    "sprintNum": "08",
    "taskNum": "30",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "AI-Architektur-Übergabe-Dokument",
    "prereqs": [
      "25"
    ],
    "bullets": [
      "Handover (#25)"
    ],
    "erfolg": "Übergabe-Doku final.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich AI-Architektur-Übergabe.\nBitte führe mich Schritt für Schritt durch:\n1. docs/handover/ai-architecture-handover.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-31",
    "sprintNum": "08",
    "taskNum": "31",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor finaler Präsentation",
    "title": "Probedurchlauf 3 (mit Team)",
    "prereqs": [
      "16"
    ],
    "bullets": [
      "Demo-Skript"
    ],
    "erfolg": "Team-Probedurchlauf erledigt.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute mache ich Probedurchlauf 3.\nBitte führe mich Schritt für Schritt durch:\n1. Volle Präsentation mit Team.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-32",
    "sprintNum": "08",
    "taskNum": "32",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Dokumentations-Übergabe + Sign-off",
    "prereqs": [
      "22"
    ],
    "bullets": [
      "README + Doku"
    ],
    "erfolg": "Doku-Sign-off.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute gebe ich Doku formal frei.\nBitte führe mich Schritt für Schritt durch:\n1. docs/handover/documentation-signoff.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-33",
    "sprintNum": "08",
    "taskNum": "33",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Sprint-8-Review halten + Retro",
    "prereqs": [
      "26"
    ],
    "bullets": [
      "Review-Doku"
    ],
    "erfolg": "Review gehalten.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich Sprint-8-Review.\nBitte führe mich Schritt für Schritt durch:\n1. Retro-Doku.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-34",
    "sprintNum": "08",
    "taskNum": "34",
    "welle": 8,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Final UI-QA-Runde vor Code-Freeze",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "UI final.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich finalen UI-QA-Lauf.\nBitte führe mich Schritt für Schritt durch:\n1. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-35",
    "sprintNum": "08",
    "taskNum": "35",
    "welle": 8,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Production-Hardening-Check",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Production gehärtet.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute prüfe ich Production-Hardening.\nBitte führe mich Schritt für Schritt durch:\n1. Alle Security-Settings reviewen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s8-36",
    "sprintNum": "08",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Abgabe-Paket-Beitrag (AI-Teil)",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "AI-Anteil bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schließe ich AI-Beitrag zum Abgabepaket ab.\nBitte führe mich Schritt für Schritt durch:\n1. Letzte Doku-Beiträge.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-01",
    "sprintNum": "09",
    "taskNum": "01",
    "welle": 1,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Go-Live",
    "title": "Sprint-9-Kickoff + Final-Plan",
    "prereqs": [],
    "bullets": [
      "Sprint-8-Retro"
    ],
    "erfolg": "Final-Plan dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich Sprint-9-Kickoff.\nBitte führe mich Schritt für Schritt durch:\n1. docs/sprint-reviews/sprint-9-kickoff.md mit Final-Plan + Termin Abgabe.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-02",
    "sprintNum": "09",
    "taskNum": "02",
    "welle": 1,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-kritisch",
    "title": "Production-Deployment vorbereiten",
    "prereqs": [],
    "bullets": [
      "RC-Tag (Sprint 8)"
    ],
    "erfolg": "Production deploy-ready.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute bereite ich Production-Deploy vor.\nBitte führe mich Schritt für Schritt durch:\n1. Vercel-Production-Env-Variablen final prüfen.\n2. Custom-Domain (falls vorhanden) + SSL.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-03",
    "sprintNum": "09",
    "taskNum": "03",
    "welle": 1,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Go-Live",
    "title": "Production-Anthropic-Key auf 30 EUR Limit setzen",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Production-Key bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute setze ich Production-Key auf produktives Limit.\nBitte führe mich Schritt für Schritt durch:\n1. Anthropic-Console: studybuddy-prod auf 30 EUR/Monat.\n2. Alert bei 80%.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-04",
    "sprintNum": "09",
    "taskNum": "04",
    "welle": 2,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Finale visuelle QA auf Produktiv-URL",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Deploy-Vorbereitung"
    ],
    "erfolg": "Production sieht gut aus.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich finale QA live.\nBitte führe mich Schritt für Schritt durch:\n1. Pro Seite check.\n2. docs/qa/production-visual-check.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-05",
    "sprintNum": "09",
    "taskNum": "05",
    "welle": 2,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Finale Regressions-Suite gegen Production",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Production live"
    ],
    "erfolg": "Production stabil.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute laufe ich Regression gegen Production.\nBitte führe mich Schritt für Schritt durch:\n1. Alle E2E + Smoke-Tests.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-06",
    "sprintNum": "09",
    "taskNum": "06",
    "welle": 2,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Finales Präsentations-Skript + Probelauf",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Probelauf erledigt.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute mache ich finalen Probelauf.\nBitte führe mich Schritt für Schritt durch:\n1. 45-Min Probelauf mit Zeitnahme.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-07",
    "sprintNum": "09",
    "taskNum": "07",
    "welle": 2,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Production-Smoke-Test der AI-Flows",
    "prereqs": [
      "02"
    ],
    "bullets": [
      "Production live"
    ],
    "erfolg": "AI in Production stabil.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute teste ich AI-Flows in Production.\nBitte führe mich Schritt für Schritt durch:\n1. Upload + Frage + Quiz + Empfehlungen.\n2. docs/qa/ai-smoke-test.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-08",
    "sprintNum": "09",
    "taskNum": "08",
    "welle": 3,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Abgabepaket finalisieren",
    "prereqs": [],
    "bullets": [
      "Alle Doku"
    ],
    "erfolg": "Abgabepaket bereit.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute finalisiere ich Abgabepaket.\nBitte führe mich Schritt für Schritt durch:\n1. Liste prüfen + alle Dateien zusammenstellen.\n2. ZIP + GitLab-Tag.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-09",
    "sprintNum": "09",
    "taskNum": "09",
    "welle": 3,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Production-Monitoring + Backups verifizieren",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Production beobachtet.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute prüfe ich Monitoring.\nBitte führe mich Schritt für Schritt durch:\n1. Alerts aktiv? Backups laufen?\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-10",
    "sprintNum": "09",
    "taskNum": "10",
    "welle": 3,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Abgabe",
    "title": "Finaler DSGVO-Sign-off",
    "prereqs": [],
    "bullets": [
      "DSGVO-Doku"
    ],
    "erfolg": "DSGVO sign-off.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute gebe ich finalen DSGVO-Sign-off.\nBitte führe mich Schritt für Schritt durch:\n1. docs/legal/dsgvo-signoff.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-11",
    "sprintNum": "09",
    "taskNum": "11",
    "welle": 3,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Kostenprognose Live-Betrieb",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Kostenprognose bereit.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute erstelle ich Kostenprognose.\nBitte führe mich Schritt für Schritt durch:\n1. docs/cost-analysis/post-launch.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-12",
    "sprintNum": "09",
    "taskNum": "12",
    "welle": 3,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Standby für Blocker-Fixes",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Standby aktiv.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Standby + ggf. schnelle Fixes wenn etwas im Probelauf auffällt.\nBitte führe mich Schritt für Schritt durch:\n1. Logbuch in docs/standby/sprint-9-fe.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-13",
    "sprintNum": "09",
    "taskNum": "13",
    "welle": 4,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ziel",
    "title": "Projektabgabe an Dozent",
    "prereqs": [
      "08"
    ],
    "bullets": [
      "Abgabepaket (#8)"
    ],
    "erfolg": "Projekt abgegeben.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute übergebe ich das Projekt offiziell.\nBitte führe mich Schritt für Schritt durch:\n1. E-Mail mit Abgabepaket + Repo-Link.\n2. docs/handover/submission-email.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-14",
    "sprintNum": "09",
    "taskNum": "14",
    "welle": 4,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Production-Smoke-Tests dokumentieren",
    "prereqs": [
      "05"
    ],
    "bullets": [
      "Regression (#5)"
    ],
    "erfolg": "Smoke-Dokumentation.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute dokumentiere ich Smoke-Tests.\nBitte führe mich Schritt für Schritt durch:\n1. docs/qa/production-smoke.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-15",
    "sprintNum": "09",
    "taskNum": "15",
    "welle": 4,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "Cross-Browser-Check",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Cross-Browser bestätigt.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute mache ich Cross-Browser-Test.\nBitte führe mich Schritt für Schritt durch:\n1. Chrome + Firefox + Safari + Edge.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-16",
    "sprintNum": "09",
    "taskNum": "16",
    "welle": 4,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "7-Tage-Stabilitätslauf einrichten",
    "prereqs": [],
    "bullets": [
      "Monitoring"
    ],
    "erfolg": "Beobachtung läuft.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute starte ich 7-Tage-Beobachtung.\nBitte führe mich Schritt für Schritt durch:\n1. docs/observability/7-day-watch.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-17",
    "sprintNum": "09",
    "taskNum": "17",
    "welle": 4,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nein",
    "title": "AI-Standby-Support",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Standby aktiv.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Standby für AI-Issues.\nBitte führe mich Schritt für Schritt durch:\n1. Logbuch in docs/standby/sprint-9-ai.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-18",
    "sprintNum": "09",
    "taskNum": "18",
    "welle": 5,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Vollständigkeit gegen Anforderungen verifizieren",
    "prereqs": [
      "13"
    ],
    "bullets": [
      "Abgabe (#13)"
    ],
    "erfolg": "Coverage bestätigt.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute prüfe ich Anforderungs-Coverage.\nBitte führe mich Schritt für Schritt durch:\n1. Anforderungen S1-S4 aus Aufgabenstellung abhaken.\n2. docs/handover/requirements-coverage.md.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-19",
    "sprintNum": "09",
    "taskNum": "19",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Bug-Freiheit + Deliverables-Liste verifizieren",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Bug-frei + vollständig.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute prüfe ich Bug-Tracker.\nBitte führe mich Schritt für Schritt durch:\n1. 0 kritische Bugs.\n2. Deliverables vollständig.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-20",
    "sprintNum": "09",
    "taskNum": "20",
    "welle": 5,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Vor Demo",
    "title": "Screenshot-Bibliothek für Präsentation",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Screenshots bereit.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute baue ich Screenshot-Bibliothek.\nBitte führe mich Schritt für Schritt durch:\n1. Pro Hauptpfad ein gutes Screenshot.\n2. docs/presentation/screenshots/.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-21",
    "sprintNum": "09",
    "taskNum": "21",
    "welle": 5,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-Tag",
    "title": "Production stabil halten",
    "prereqs": [
      "16"
    ],
    "bullets": [
      "Watch (#16)"
    ],
    "erfolg": "Production stabil.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute halte ich Production stabil.\nBitte führe mich Schritt für Schritt durch:\n1. Monitoring beobachten.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-22",
    "sprintNum": "09",
    "taskNum": "22",
    "welle": 5,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Demo-Tag",
    "title": "AI-Live-Demo-Support",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "AI-Demo abgesichert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute Standby für AI-Demo.\nBitte führe mich Schritt für Schritt durch:\n1. Fallback-Szenario bereit (Offline-Demo-Daten).\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-23",
    "sprintNum": "09",
    "taskNum": "23",
    "welle": 5,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Test-Artefakte für Archivierung sichern",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Artefakte archiviert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute sichere ich Test-Artefakte.\nBitte führe mich Schritt für Schritt durch:\n1. Coverage-Berichte, E2E-Recordings.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-24",
    "sprintNum": "09",
    "taskNum": "24",
    "welle": 6,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Demo-Tag",
    "title": "Finale Präsentation halten",
    "prereqs": [
      "06",
      "13"
    ],
    "bullets": [
      "Probelauf + Abgabe"
    ],
    "erfolg": "Präsentation gehalten.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute halte ich die Abschluss-Präsentation.\nBitte führe mich Schritt für Schritt durch:\n1. Live-Demo + Q&A.;\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-25",
    "sprintNum": "09",
    "taskNum": "25",
    "welle": 6,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Demo-Tag",
    "title": "Frontend-Standby + Fallback bereithalten",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Frontend-Standby aktiv.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute Standby Frontend.\nBitte führe mich Schritt für Schritt durch:\n1. Offline-Screenshots bereit.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-26",
    "sprintNum": "09",
    "taskNum": "26",
    "welle": 6,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Demo-Tag",
    "title": "Backend-Support während Demo",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Backend stabil.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute Standby Backend.\nBitte führe mich Schritt für Schritt durch:\n1. Logs live verfolgen.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-27",
    "sprintNum": "09",
    "taskNum": "27",
    "welle": 6,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Finale Retro-Notizen aus QA-Sicht",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "QA-Retro dokumentiert.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich finale QA-Retro.\nBitte führe mich Schritt für Schritt durch:\n1. docs/retro/qa-final.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-28",
    "sprintNum": "09",
    "taskNum": "28",
    "welle": 6,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Demo-Tag",
    "title": "AI-Live-Demo-Support",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "AI-Demo erfolgreich.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute Standby AI-Demo.\nBitte führe mich Schritt für Schritt durch:\n1. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-29",
    "sprintNum": "09",
    "taskNum": "29",
    "welle": 7,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Nach Demo",
    "title": "Projekt-Retrospektive (9 Sprints)",
    "prereqs": [
      "24"
    ],
    "bullets": [
      "Präsentation"
    ],
    "erfolg": "Gesamt-Retro dokumentiert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute moderiere ich die Gesamt-Retro.\nBitte führe mich Schritt für Schritt durch:\n1. docs/retro/project-final.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-30",
    "sprintNum": "09",
    "taskNum": "30",
    "welle": 7,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Nach Demo",
    "title": "Finaler Testbericht inkl. Sprint-Vergleich",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Test-Bericht final.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute schreibe ich finalen Testbericht.\nBitte führe mich Schritt für Schritt durch:\n1. docs/qa/final-test-report.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-31",
    "sprintNum": "09",
    "taskNum": "31",
    "welle": 7,
    "who": "Ayoub",
    "role": "FE",
    "blocker": false,
    "priorityInfo": "Nach Demo",
    "title": "UI-Lessons-Learned",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "FE-Lessons dokumentiert.",
    "prompt": "Ich bin Ayoub im StudyBuddy-Team. Heute schreibe ich Frontend-Lessons.\nBitte führe mich Schritt für Schritt durch:\n1. docs/retro/frontend-lessons.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-32",
    "sprintNum": "09",
    "taskNum": "32",
    "welle": 7,
    "who": "Abder",
    "role": "BE",
    "blocker": false,
    "priorityInfo": "Nach Demo",
    "title": "Backend-Lessons-Learned",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "BE-Lessons dokumentiert.",
    "prompt": "Ich bin Abder im StudyBuddy-Team. Heute schreibe ich Backend-Lessons.\nBitte führe mich Schritt für Schritt durch:\n1. docs/retro/backend-lessons.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-33",
    "sprintNum": "09",
    "taskNum": "33",
    "welle": 7,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Nach Demo",
    "title": "AI-Lessons-Learned",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "AI-Lessons dokumentiert.",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute schreibe ich AI-Lessons.\nBitte führe mich Schritt für Schritt durch:\n1. docs/retro/ai-lessons.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-34",
    "sprintNum": "09",
    "taskNum": "34",
    "welle": 8,
    "who": "Leon",
    "role": "PM",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Projekt-Archivierung auf GitLab",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Repo archiviert.",
    "prompt": "Ich bin Leon im StudyBuddy-Team. Heute archiviere ich das Projekt.\nBitte führe mich Schritt für Schritt durch:\n1. git tag v1.0.0-final.\n2. GitLab Repo auf 'archived' setzen.\n3. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-35",
    "sprintNum": "09",
    "taskNum": "35",
    "welle": 8,
    "who": "Sara",
    "role": "QA",
    "blocker": false,
    "priorityInfo": "Sprint-Ende",
    "title": "Übergabe-Dokumentation Sign-off",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Sign-off erfolgt.",
    "prompt": "Ich bin Sara im StudyBuddy-Team. Heute Sign-off für Übergabe.\nBitte führe mich Schritt für Schritt durch:\n1. docs/handover/final-signoff.md.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  },
  {
    "id": "s9-36",
    "sprintNum": "09",
    "taskNum": "36",
    "welle": 8,
    "who": "Taycir",
    "role": "KI",
    "blocker": false,
    "priorityInfo": "Ende",
    "title": "Note + Projekt-Abschluss feiern",
    "prereqs": [],
    "bullets": [
      "—"
    ],
    "erfolg": "Projekt abgeschlossen. \u0000",
    "prompt": "Ich bin Taycir im StudyBuddy-Team. Heute Abschluss.\nBitte führe mich Schritt für Schritt durch:\n1. Team-Feier organisieren.\n2. Git-Befehle.\nWo Code/SQL/Doku entsteht: gib mir alles als Code-Block, ich kopiere selbst. Erkläre auf Deutsch."
  }
] as const
