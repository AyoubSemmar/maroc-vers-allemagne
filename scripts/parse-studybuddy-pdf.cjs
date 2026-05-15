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

    // Parse "was du brauchst" bullets.
    const bullets = (wasBraucht ?? '')
      .split(/\n|•/)
      .map(s => s.trim())
      .filter(Boolean)

    tasks.push({
      id: `s${parseInt(sprintStr, 10)}-${taskNumStr.padStart(2, '0')}`,
      sprintNum: sprintStr,
      taskNum: taskNumStr,
      welle: parseInt(welleStr, 10),
      who: person,
      role,
      blocker: marker === 'BLOCKER',
      priorityInfo,
      title,
      prereqs,
      bullets,
      erfolg: (erfolg ?? '').trim(),
      prompt: promptClean,
    })
  }

  console.error(`parsed ${tasks.length} tasks`)
  // Sanity: should be close to 324 (9 sprints × 36 tasks).

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
