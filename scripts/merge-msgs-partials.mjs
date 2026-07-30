// Deep-merge translated UI partials into messages/<loc>.json.
// Usage: node scripts/merge-msgs-partials.mjs <loc> <partialsDir>
// Each partial mirrors the full key path from root; we overlay it onto the
// English-seeded messages/<loc>.json, then verify key-parity with messages/en.json.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'

const loc = process.argv[2]
const dir = process.argv[3]
if (!loc || !dir) { console.error('usage: <loc> <partialsDir>'); process.exit(1) }

function deepMerge(base, over) {
  for (const k of Object.keys(over)) {
    const bv = base[k], ov = over[k]
    if (ov && typeof ov === 'object' && !Array.isArray(ov) && bv && typeof bv === 'object' && !Array.isArray(bv)) deepMerge(bv, ov)
    else base[k] = ov
  }
  return base
}
function leaves(o){let n=0;for(const k in o){const v=o[k];if(v&&typeof v==='object')n+=leaves(v);else n++;}return n}
// count leaves that still equal the English source (i.e. untranslated)
function sameAsEn(node, en){let same=0,total=0;for(const k in en){const e=en[k],v=node?.[k];if(e&&typeof e==='object'){const r=sameAsEn(v,e);same+=r.same;total+=r.total}else{total++;if(v===e)same++}}return{same,total}}

const target = `messages/${loc}.json`
const msg = JSON.parse(readFileSync(target, 'utf8'))
const en = JSON.parse(readFileSync('messages/en.json', 'utf8'))

let applied = 0
for (const f of readdirSync(dir).filter(f => /\.json$/.test(f)).sort()) {
  const partial = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))
  deepMerge(msg, partial)
  applied++
  console.log(`merged ${f} (+${leaves(partial)} strings)`)
}
writeFileSync(target, JSON.stringify(msg, null, 2) + '\n')

// parity + coverage
const enKeys = leaves(en), locKeys = leaves(msg)
const { same, total } = sameAsEn(msg, en)
console.log(`\napplied ${applied} partials → ${target}`)
console.log(`key count: ${locKeys} (en ${enKeys}) ${locKeys === enKeys ? 'MATCH' : 'MISMATCH'}`)
console.log(`still English (untranslated): ${same}/${total} (${(100*same/total).toFixed(1)}%)`)
