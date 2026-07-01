// Render the new-lessons draft as a readable HTML page.
// Run: node scripts/goethe-lessons-review.mjs
import fs from 'fs'
import path from 'path'

const src = path.resolve('scripts/out/goethe/new-lessons.json')
const data = JSON.parse(fs.readFileSync(src, 'utf8'))
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const bold = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const GENDER = { der: '#2563eb', die: '#db2777', das: '#16a34a', pl: '#7c3aed' }

const card = ({ level, id, de, insertAfter, lesson: L }) => {
  const tables = (L.tables || []).map(t => `
    <div class="tbl"><div class="tt">${esc(t.title || '')}</div>
    <table><thead><tr>${(t.headers || []).map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${(t.rows || []).map(r => `<tr>${r.map(c => `<td dir="ltr">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
    ${t.note ? `<div class="note">📌 ${esc(t.note)}</div>` : ''}</div>`).join('')
  const rules = (L.rules || []).map(r => `<li><span class="ar">${esc(r.rule)}</span><br><code dir="ltr">${esc(r.example)}</code> <span class="tr">← ${esc(r.translation)}</span></li>`).join('')
  const ex = (L.examples || []).map(e => `<li dir="ltr">${esc(e)}</li>`).join('')
  const vocab = (L.vocabulary || []).map(v => `<tr><td>${v.gender ? `<span class="g" style="background:${GENDER[v.gender] || '#666'}">${v.gender}</span>` : ''}<b dir="ltr">${esc(v.german)}</b>${v.plural ? ` <span class="pl" dir="ltr">·${esc(v.plural)}</span>` : ''}</td><td dir="rtl">${esc(v.arabic)}</td><td dir="ltr" class="ex">${esc(v.example)}</td></tr>`).join('')
  const exs = (L.exercise || []).map((q, i) => `<li><span class="qt">${q.type}</span> <span class="ar">${esc(q.question)}</span>${q.options ? '<br>' + q.options.map(o => `<span class="opt" dir="ltr">${esc(o)}</span>`).join(' ') : ''}${q.words ? '<br><span dir="ltr" class="words">' + q.words.map(esc).join(' · ') + '</span>' : ''}${q.pairs ? '<br>' + q.pairs.map(p => `<span dir="ltr" class="pair">${esc(p.left)} → ${esc(p.right)}</span>`).join(' ') : ''}<br><span class="ans" dir="ltr">✔ ${esc(q.answer)}</span>${q.audioPrompt ? ` <span class="aud">🔊 ${esc(q.audioPrompt)}</span>` : ''}</li>`).join('')
  return `<section>
    <h2><span class="lv">${level}</span> ${esc(de)} <span class="meta">id ${id} · après leçon ${insertAfter}</span></h2>
    <h3>${esc(L.grammarTitle)}</h3>
    <div class="content" dir="rtl">${bold(L.grammarContent)}</div>
    ${tables}
    <h4>القواعد</h4><ul class="rules">${rules}</ul>
    <h4>أمثلة</h4><ul class="examples">${ex}</ul>
    <div class="tip" dir="rtl">${esc(L.tip)}</div>
    <h4>المفردات (${L.vocabulary.length})</h4><table class="vocab"><tbody>${vocab}</tbody></table>
    <h4>التمارين (${L.exercise.length})</h4><ul class="exs">${exs}</ul>
  </section>`
}

const html = `<!doctype html><html lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nouvelles leçons Goethe — révision</title><style>
 body{font-family:system-ui,Segoe UI,sans-serif;max-width:900px;margin:0 auto;padding:22px;background:#fafafa;color:#1a1a1a}
 h1{font-size:21px} .sub{color:#666;margin-bottom:20px}
 section{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;margin-bottom:20px}
 h2{font-size:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 6px}
 .lv{background:#16a34a;color:#fff;font-size:11px;padding:2px 8px;border-radius:6px}
 .meta{margin-left:auto;color:#aaa;font-size:11px;font-weight:400}
 h3{font-size:14px;color:#16a34a;margin:4px 0} h4{font-size:12px;color:#999;text-transform:uppercase;margin:14px 0 6px}
 .content{background:#f9fafb;border-radius:8px;padding:10px;font-size:14px;line-height:1.8}
 .tbl{margin:10px 0} .tt{font-size:12px;color:#666;font-weight:600;margin-bottom:4px}
 table{width:100%;border-collapse:collapse;font-size:13px} th{background:#374151;color:#fff;padding:5px 8px} td{border:1px solid #eee;padding:5px 8px;text-align:center}
 .note{font-size:11px;color:#888;margin-top:4px}
 ul{padding-inline-start:20px;font-size:14px} li{margin:6px 0}
 code{background:#eef2ff;color:#3730a3;padding:1px 6px;border-radius:4px} .tr{color:#888;font-size:12px} .ar{font-size:14px}
 .tip{background:#fef9c3;border:1px solid #fde68a;border-radius:8px;padding:10px;margin:12px 0;font-size:14px}
 table.vocab td{text-align:start} .g{color:#fff;font-size:10px;font-weight:700;padding:1px 5px;border-radius:4px;margin-inline-end:5px}
 .pl{color:#9ca3af;font-size:12px} .ex{color:#6b7280;font-style:italic}
 .qt{background:#eef2ff;color:#4338ca;font-size:10px;padding:1px 6px;border-radius:5px} .opt{border:1px solid #ddd;border-radius:5px;padding:1px 6px;font-size:12px;margin:2px;display:inline-block}
 .ans{color:#16a34a;font-size:12px;font-weight:600} .aud{color:#7c3aed;font-size:11px} .words{color:#7c3aed} .pair{color:#0d9488;font-size:12px;margin-inline-end:8px}
</style></head><body>
<h1>Nouvelles leçons Goethe — à valider</h1>
<div class="sub">${data.length} nouvelles leçons de grammaire (brouillon — rien n'est en ligne)</div>
${data.map(card).join('')}
</body></html>`

const out = path.resolve('scripts/out/goethe/new-lessons-review.html')
fs.writeFileSync(out, html)
console.log('Open in your browser:\n  ' + out)
