// Hand-crafted A1 Devoir 12 (Kommunikation und Wiederholung) Lesen task —
// the one the model kept failing to generate. Inserted directly.
import fs from 'fs'; import path from 'path'
import { createClient } from '@supabase/supabase-js'
for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const m = l.replace(/\r$/, '').match(/^([^#=]+)=(.*)$/)
  if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const text = `Hallo Nadia,
wie geht es dir? Mir geht es gut. Ich lerne jetzt jeden Tag Deutsch. Am Montag und Mittwoch gehe ich in die Sprachschule. Der Kurs beginnt um 9 Uhr und endet um 12 Uhr. Meine Lehrerin heißt Frau Weber. Sie ist sehr nett.
Am Wochenende telefoniere ich oft mit meiner Familie in Marokko. Manchmal schreibe ich auch eine E-Mail. Nächste Woche habe ich eine Prüfung. Kannst du mir helfen? Wir können zusammen lernen.
Ruf mich bitte heute Abend an!
Viele Grüße,
Youssef`

const questions = [
  { q: "Quel est l'objectif principal de cette e-mail ?", options: [
    'Youssef sucht eine neue Sprachschule.',
    'Youssef erzählt von seinem Deutschkurs und bittet Nadia um Hilfe.',
    'Youssef möchte nach Marokko fahren.',
    'Youssef sucht eine neue Lehrerin.'] },
  { q: 'À quelle heure commence le cours ?', options: [
    'Um 8 Uhr.', 'Um 9 Uhr.', 'Um 12 Uhr.', 'Am Wochenende.'] },
  { q: 'Comment Youssef communique-t-il avec sa famille ?', options: [
    'Er besucht sie jeden Tag.', 'Er telefoniert und schreibt E-Mails.', 'Er schreibt nur Briefe.', 'Er spricht nicht mit ihr.'] },
  { q: 'Pourquoi Youssef a-t-il besoin d’aide ?', options: [
    'Er hat nächste Woche eine Prüfung.', 'Er ist krank.', 'Er hat keine Lehrerin.', 'Er versteht die E-Mail nicht.'] },
  { q: 'Que doit faire Nadia ?', options: [
    'Eine E-Mail schreiben.', 'Youssef heute Abend anrufen.', 'Nach Marokko fahren.', 'Einen Kurs suchen.'] },
]
const answer_key = {
  correct: [1, 1, 1, 0, 1],
  explanations: [
    'Youssef décrit son cours d’allemand (jours, horaires, professeure) puis demande de l’aide pour un examen.',
    'Le texte dit : « Der Kurs beginnt um 9 Uhr ».',
    'Il écrit : « telefoniere ich oft mit meiner Familie » et « schreibe ich auch eine E-Mail ».',
    'Il écrit : « Nächste Woche habe ich eine Prüfung. Kannst du mir helfen? ».',
    'À la fin : « Ruf mich bitte heute Abend an! ».',
  ],
}

const { data: sibling } = await sb.from('assignments')
  .select('content').eq('level_id', 'A1').eq('content->>lessonOrder', '12').limit(1).maybeSingle()
const meta = sibling.content
const content = {
  text, questions,
  lessonId: meta.lessonId, lessonOrder: meta.lessonOrder, lessonTitle: meta.lessonTitle, skill: 'lesen',
}

// Avoid a duplicate if it already exists.
const { data: existing } = await sb.from('assignments').select('id')
  .eq('level_id', 'A1').eq('skill', 'lesen').eq('content->>lessonOrder', '12').maybeSingle()
if (existing) { console.log('Already present:', existing.id); process.exit(0) }

const { data, error } = await sb.from('assignments').insert({
  skill: 'lesen', level_id: 'A1', group_id: null,
  title: `Devoir 12 — Lesen · ${meta.lessonTitle}`,
  instructions: 'Lisez le texte, puis répondez.',
  content, answer_key, max_points: 100, is_published: true,
}).select('id').single()
if (error) { console.error(error); process.exit(1) }
console.log('Inserted A1 Devoir 12 Lesen:', data.id)
