// Consolidate whatever the backfill subagents produced into merged.json.
// Handles the per-article per-locale files the nested agents wrote:
//   tmp-<loc>-<id>.json : single { id, title, summary, content, faqs } for ONE locale
// (The 'id' locale code collides with the article 'id' field, so we NEVER key a
// plain object by both — locales are nested under `t`.)
// Output: scripts/out/article-backfill/merged.json = [{ id, t: { uk, sq, id } }, ...]
// including only articles that have ALL THREE locales.
import fs from 'node:fs'

const OUT = 'scripts/out/article-backfill/out'
const LOCS = ['uk', 'sq', 'id']
const nonEmpty = (o) => o && typeof o.title === 'string' && o.title && typeof o.content === 'string' && o.content
const pick = (o) => ({ title: o.title, summary: o.summary || '', content: o.content, faqs: Array.isArray(o.faqs) ? o.faqs : [] })

const rec = new Map() // articleId -> { uk?, sq?, id? }
const get = (id) => { const k = String(id); if (!rec.has(k)) rec.set(k, {}); return rec.get(k) }

for (const f of fs.readdirSync(OUT).filter(f => /\.json$/.test(f))) {
  let data; try { data = JSON.parse(fs.readFileSync(`${OUT}/${f}`, 'utf8')) } catch { console.log(`skip (parse) ${f}`); continue }
  // Clean per-locale files: tmp-<loc>-<id>.json (one locale each).
  const m = f.match(/^tmp-(uk|sq|id)-(.+)\.json$/)
  if (m) {
    const loc = m[1]
    const obj = Array.isArray(data) ? data[0] : data
    if (obj && obj.id != null && nonEmpty(obj)) get(obj.id)[loc] = pick(obj)
    continue
  }
  // Legacy straggler files: frag-<id>.json = {id, uk, sq, id} — the duplicate
  // "id" key means JSON.parse keeps the LAST (Indonesian) under `.id`; the
  // article id is taken from the filename. Salvage uk/sq/id if all are objects.
  const mf = f.match(/^frag-(.+)\.json$/)
  if (mf) {
    const articleId = mf[1]
    const o = Array.isArray(data) ? data[0] : data
    if (o && nonEmpty(o.uk) && nonEmpty(o.sq) && nonEmpty(o.id)) {
      const r = get(articleId); r.uk = pick(o.uk); r.sq = pick(o.sq); r.id = pick(o.id)
    }
  }
}

const complete = []
const incomplete = []
for (const [id, t] of rec) {
  if (LOCS.every(l => t[l])) complete.push({ id: isNaN(+id) ? id : +id, t })
  else incomplete.push(`${id}[${LOCS.filter(l => t[l]).join('+') || 'none'}]`)
}

fs.writeFileSync('scripts/out/article-backfill/merged.json', JSON.stringify(complete, null, 2))
console.log(`consolidated: ${complete.length} complete (all 3 locales), ${incomplete.length} incomplete`)
if (incomplete.length) console.log('  incomplete:', incomplete.slice(0, 40).join(', '))
