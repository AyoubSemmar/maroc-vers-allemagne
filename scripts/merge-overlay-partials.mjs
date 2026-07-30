// Deep-merge translated course-overlay partials into translations/<level>.<loc>.json.
// Usage: node scripts/merge-overlay-partials.mjs <level> <loc> <partialsDir>
// Each partial is { lessons: { "<id>": { …translated lesson… } } } (or a top-level
// { title, lessons }); we overlay onto the English-seeded overlay file, then verify
// key-parity + report how much still equals the English source.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const level = process.argv[2]
const loc = process.argv[3]
const dir = process.argv[4]
if (!level || !loc || !dir) { console.error('usage: <level> <loc> <partialsDir>'); process.exit(1) }

function deepMerge(base, over) {
  for (const k of Object.keys(over)) {
    const bv = base[k], ov = over[k]
    if (ov && typeof ov === 'object' && !Array.isArray(ov) && bv && typeof bv === 'object' && !Array.isArray(bv)) deepMerge(bv, ov)
    else base[k] = ov
  }
  return base
}
function leaves(o){let n=0;for(const k in o){const v=o[k];if(v&&typeof v==='object')n+=leaves(v);else n++;}return n}
function sameAsEn(node, en){let same=0,total=0;for(const k in en){const e=en[k],v=node?.[k];if(e&&typeof e==='object'){const r=sameAsEn(v,e);same+=r.same;total+=r.total}else{total++;if(v===e)same++}}return{same,total}}

const target = `lib/german-data/translations/${level}.${loc}.json`
const en = JSON.parse(readFileSync(`lib/german-data/translations/${level}.en.json`, 'utf8'))
const msg = JSON.parse(readFileSync(target, 'utf8'))

let applied = 0
for (const f of readdirSync(dir).filter(f => /\.json$/.test(f)).sort()) {
  const partial = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))
  deepMerge(msg, partial)
  applied++
  console.log(`merged ${f} (+${leaves(partial)} leaves)`)
}
writeFileSync(target, JSON.stringify(msg, null, 2) + '\n')

const enKeys = leaves(en), locKeys = leaves(msg)
const { same, total } = sameAsEn(msg, en)
console.log(`\napplied ${applied} partials → ${target}`)
console.log(`key count: ${locKeys} (en ${enKeys}) ${locKeys === enKeys ? 'MATCH' : 'MISMATCH'}`)
console.log(`still English (untranslated): ${same}/${total} (${(100*same/total).toFixed(1)}%)`)
