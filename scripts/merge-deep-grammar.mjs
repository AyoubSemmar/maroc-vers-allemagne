// Merge translated deep grammar back into the per-locale course overlays.
//
// Input : scripts/out/deep-i18n/<level>.<loc>.json = [{ id, content }, ...]
//         (deep grammar.content, translated from the English master)
// Target: lib/german-data/translations/<level>.<loc>.json
//         → for each entry, sets lessons[id].grammar.content = content
//
// Only grammar.content is replaced; tables/rules/examples/tip (already
// localized) are left untouched. Idempotent. Reports any id that doesn't
// match an overlay lesson.
//
// Usage: node scripts/merge-deep-grammar.mjs            (merge everything present)
//        node scripts/merge-deep-grammar.mjs es tr      (only these locales)
import fs from 'node:fs'
import path from 'node:path'

const IN = 'scripts/out/deep-i18n'
const OUTDIR = 'lib/german-data/translations'
const LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1']
const onlyLocs = process.argv.slice(2)

if (!fs.existsSync(IN)) { console.error('no input dir', IN); process.exit(1) }

let merged = 0, files = 0
const problems = []
for (const f of fs.readdirSync(IN).filter((f) => /^(a1|a2|b1|b2|c1)\.[a-z]{2}\.json$/.test(f))) {
  const [level, loc] = f.replace('.json', '').split('.')
  if (onlyLocs.length && !onlyLocs.includes(loc)) continue
  const target = path.join(OUTDIR, `${level}.${loc}.json`)
  if (!fs.existsSync(target)) { problems.push(`no overlay ${target}`); continue }

  let deep
  try { deep = JSON.parse(fs.readFileSync(path.join(IN, f), 'utf8')) } catch { problems.push(`parse ${f}`); continue }
  const entries = Array.isArray(deep) ? deep : Object.values(deep)

  const ov = JSON.parse(fs.readFileSync(target, 'utf8'))
  const lessons = ov.lessons
  let hits = 0, misses = 0
  for (const e of entries) {
    const id = String(e.id)
    const content = typeof e.content === 'string' ? e.content : (e.grammar && e.grammar.content)
    if (!content) { misses++; continue }
    const lesson = Array.isArray(lessons) ? lessons.find((x) => String(x.id) === id) : lessons[id]
    if (!lesson) { misses++; continue }
    lesson.grammar = lesson.grammar || {}
    lesson.grammar.content = content
    hits++
  }
  fs.writeFileSync(target, JSON.stringify(ov, null, 2) + '\n')
  merged += hits; files++
  console.log(`${f} → ${level}.${loc}: ${hits} lessons updated${misses ? `, ${misses} skipped` : ''}`)
}
console.log(`\nDONE: ${merged} lessons across ${files} files`)
if (problems.length) console.log('problems:', problems.join('; '))
