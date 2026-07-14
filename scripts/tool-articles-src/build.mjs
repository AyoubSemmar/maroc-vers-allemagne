// Build scripts/out/tool-articles/*.json from the .mjs sources in this dir.
// Authoring in .mjs template literals avoids hand-escaping JSON; the insert
// script (scripts/insert-tool-articles.mjs) consumes the emitted JSON.
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(here, '../out/tool-articles')
fs.mkdirSync(outDir, { recursive: true })

const LOCALES = ['ar', 'fr', 'en', 'de', 'es', 'tr', 'fa', 'pt', 'ru', 'hi', 'ur', 'zh']

for (const f of fs.readdirSync(here)) {
  if (!f.endsWith('.mjs') || f === 'build.mjs') continue
  const mod = await import(pathToFileURL(path.join(here, f)).href)
  const a = mod.default
  // Validate before emitting — a malformed file must fail loudly here,
  // not silently skip at insert time.
  const problems = []
  if (!a.slug) problems.push('missing slug')
  if (!a.category) problems.push('missing category')
  for (const l of LOCALES) {
    const t = a.translations?.[l]
    if (!t?.title || !t?.summary || !t?.content) problems.push(`locale ${l} incomplete`)
    else if (!Array.isArray(t.faqs) || t.faqs.length !== 5) problems.push(`locale ${l} needs exactly 5 faqs (has ${t?.faqs?.length ?? 0})`)
  }
  if (problems.length) {
    console.error(`✗ ${f}: ${problems.join('; ')}`)
    process.exitCode = 1
    continue
  }
  a.audience = a.audience || 'global'
  a.locales = LOCALES
  const out = path.join(outDir, f.replace(/\.mjs$/, '.json'))
  fs.writeFileSync(out, JSON.stringify(a, null, 1))
  console.log(`✓ ${path.basename(out)} (${a.slug})`)
}
