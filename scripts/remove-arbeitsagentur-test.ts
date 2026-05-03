/**
 * Remove the test Arbeitsagentur listings inserted by
 * scripts/seed-arbeitsagentur-test.ts.
 *
 * Deletes only rows where source='arbeitsagentur_api_test', so it cannot
 * touch your real listings.
 *
 * Usage:
 *   npx tsx scripts/remove-arbeitsagentur-test.ts
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const TEST_SOURCE = 'arbeitsagentur_api_test'

for (const fname of ['.env.local', '.env.development.local', '.env']) {
  const envPath = path.join(process.cwd(), fname)
  if (!fs.existsSync(envPath)) continue
  let text = fs.readFileSync(envPath, 'utf8')
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

async function main() {
  const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { error, count } = await supabase
    .from('ausbildung_jobs')
    .delete({ count: 'exact' })
    .eq('source', TEST_SOURCE)

  if (error) {
    console.error('❌ Delete failed:', error)
    process.exit(1)
  }
  console.log(`✅ Removed ${count ?? 0} test rows (source='${TEST_SOURCE}').`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
