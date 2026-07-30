// Phase A / Step 1: seed the 3 new locales (uk, sq, id) from English so they
// exist and the app builds/renders (English content until translated in later
// steps). Copies: messages, the 5 course-level overlays, and extra-vocab
// per-locale meanings.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const NEW = ['uk', 'sq', 'id']
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1']

// 1) UI messages — copy en verbatim (translated later).
for (const loc of NEW) {
  const dst = `messages/${loc}.json`
  writeFileSync(dst, readFileSync('messages/en.json', 'utf8'))
  console.log(`seed ${dst}`)
}

// 2) Course level overlays — copy the en overlay (full English lesson content).
for (const loc of NEW) {
  for (const lvl of LEVELS) {
    const src = `lib/german-data/translations/${lvl}.en.json`
    const dst = `lib/german-data/translations/${lvl}.${loc}.json`
    writeFileSync(dst, readFileSync(src, 'utf8'))
  }
  console.log(`seed translations/*.${loc}.json (${LEVELS.length} levels)`)
}

// 3) extra-vocab meanings — add uk/sq/id = en for every vocab item.
{
  const p = 'lib/german-data/extra-vocab.json'
  const v = JSON.parse(readFileSync(p, 'utf8'))
  let touched = 0
  for (const id of Object.keys(v)) {
    for (const item of v[id]) {
      if (item.meanings && item.meanings.en != null) {
        for (const loc of NEW) if (item.meanings[loc] == null) { item.meanings[loc] = item.meanings.en; touched++ }
      }
    }
  }
  writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
  console.log(`extra-vocab: added ${touched} uk/sq/id meanings`)
}

// sanity
for (const loc of NEW) {
  const ok = existsSync(`messages/${loc}.json`) && LEVELS.every(l => existsSync(`lib/german-data/translations/${l}.${loc}.json`))
  console.log(`${loc}: ${ok ? 'OK' : 'MISSING FILES'}`)
}
