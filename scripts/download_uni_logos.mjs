// scripts/download_uni_logos.mjs
//
// One-shot: downloads each university's logo to public/uni-logos/{id}.png
// at a normalized 200x200 (fit-contain, white background) and rewrites the
// DB row to point at the local path. Idempotent — skips rows whose
// logo_url is already `/uni-logos/...`.
//
// Files are downloaded as-is (the Wikimedia URLs are mostly SVG which
// scales fine via CSS object-fit). No image processing — the existing
// .unis-card-logo CSS handles the fit + white background.
//
// Run:
//   node scripts/download_uni_logos.mjs                # all rows
//   node scripts/download_uni_logos.mjs --limit 10     # try first N
//   node scripts/download_uni_logos.mjs --dry          # don't write/update
//
// Requires .env.local with SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const OUT_DIR = resolve(REPO_ROOT, 'public', 'uni-logos')
const LOCAL_PREFIX = '/uni-logos/'

try {
  const env = readFileSync(resolve(REPO_ROOT, '.env.local'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.')
  process.exit(1)
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

function extensionFromContentType(ct) {
  if (!ct) return 'svg'
  if (ct.includes('svg')) return 'svg'
  if (ct.includes('png')) return 'png'
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg'
  if (ct.includes('webp')) return 'webp'
  return 'svg' // best guess for Wikimedia file pages
}

async function downloadOne(row, dry) {
  // Already migrated to local path? Skip.
  if (row.logo_url.startsWith(LOCAL_PREFIX)) return { skipped: true }

  const res = await fetch(row.logo_url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'gogermany.ma logo-cache/1.0 (https://gogermany.ma; admin@gogermany.ma)',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 200) throw new Error(`tiny response (${buf.length} bytes)`)

  const ext = extensionFromContentType(res.headers.get('content-type'))
  const filename = `${row.id}.${ext}`
  const localPath = `${OUT_DIR}/${filename}`
  const dbPath = `${LOCAL_PREFIX}${filename}`

  if (dry) return { wrote: false, dbPath, size: buf.length, ext }

  writeFileSync(localPath, buf)
  const { error } = await supabase
    .from('universities')
    .update({ logo_url: dbPath })
    .eq('id', row.id)
  if (error) throw new Error(`DB update: ${error.message}`)
  return { wrote: true, dbPath, size: buf.length, ext }
}

async function main() {
  const args = process.argv.slice(2)
  const dry = args.includes('--dry')
  const limitIdx = args.indexOf('--limit')
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 10000

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

  console.log('▸ Loading universities with remote logo_url...')
  const { data: rows, error } = await supabase
    .from('universities')
    .select('id, name_de, logo_url')
    .not('logo_url', 'is', null)
    .limit(limit)
  if (error) { console.error(error); process.exit(1) }

  const todo = rows.filter(r => !r.logo_url.startsWith(LOCAL_PREFIX))
  console.log(`  ✓ ${rows.length} total; ${todo.length} need download`)
  if (todo.length === 0) return

  let ok = 0, skipped = 0, failed = 0
  for (const row of todo) {
    try {
      const r = await downloadOne(row, dry)
      if (r.skipped) skipped++; else ok++
      process.stdout.write(`\r▸ ok=${ok} skipped=${skipped} failed=${failed} / ${todo.length}`)
    } catch (e) {
      failed++
      console.log(`\n  ✗ ${row.id} (${(row.name_de || '').slice(0, 40)}): ${e.message}`)
    }
    // Be polite to weserv — small inter-request delay
    await new Promise(r => setTimeout(r, 100))
  }
  console.log(`\n✓ Done. ok=${ok} skipped=${skipped} failed=${failed}`)
  if (failed > 0) {
    console.log('  (Failed rows keep their original logo_url — they\'ll show the letter placeholder via UniLogo onError fallback.)')
  }
}

main().catch(err => { console.error(err); process.exit(1) })
