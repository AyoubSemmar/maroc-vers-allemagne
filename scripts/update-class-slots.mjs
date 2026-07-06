// One-off DML (2026-07-06): reprice live classes to 450 DH/month and move to
// the new rhythm — two 1h30 slots three times a week (Mon/Wed/Fri), plus the
// weekend intensif kept as-is:
//   {lvl}-1600    → Lun/Mer/Ven 16:00-17:30   (kept, updated)
//   {lvl}-1800    → Lun/Mer/Ven 18:00-19:30   (kept, updated)
//   {lvl}-weekend → Sam-Dim 16:00-19:00       (kept unchanged, 2×3h)
//   {lvl}-1700 / {lvl}-1900 → deactivated (bookings preserved)
// price_mad = 450 on every group, active or not.
// Usage: node scripts/update-class-slots.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
)
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const LEVELS = ['a1', 'a2', 'b1']
const SLOTS = [
  { idSuffix: '1600', time: '16:00-17:30', labelTime: '16h00-17h30' },
  { idSuffix: '1800', time: '18:00-19:30', labelTime: '18h00-19h30' },
]
const DEACTIVATE_SUFFIXES = ['1700', '1900']

const { data: before, error: readErr } = await sb
  .from('class_groups').select('id,label,schedule,price_mad,is_active,booked_count').order('sort_order')
if (readErr) { console.error('read failed:', readErr.message); process.exit(1) }
console.log('BEFORE:')
for (const g of before) console.log(` ${g.is_active ? '●' : '○'} ${g.id.padEnd(12)} ${String(g.price_mad).padEnd(4)} ${g.booked_count} booked  ${g.schedule}`)

// 1) Reprice everything to 450.
{
  const { error } = await sb.from('class_groups').update({ price_mad: 450 }).neq('price_mad', 450)
  if (error) { console.error('reprice failed:', error.message); process.exit(1) }
}

// 2) Update the two kept slots per level.
for (const lvl of LEVELS) {
  for (const s of SLOTS) {
    const id = `${lvl}-${s.idSuffix}`
    const { error } = await sb.from('class_groups').update({
      label: `${lvl.toUpperCase()} — Lun·Mer·Ven ${s.labelTime}`,
      schedule: `Lun/Mer/Ven ${s.time}`,
      is_active: true,
    }).eq('id', id)
    if (error) console.error(`update ${id} failed:`, error.message)
  }
}

// 3) Deactivate the retired slots (bookings preserved; hidden from listing).
for (const lvl of LEVELS) {
  for (const suf of DEACTIVATE_SUFFIXES) {
    const id = `${lvl}-${suf}`
    const { error } = await sb.from('class_groups').update({ is_active: false }).eq('id', id)
    if (error) console.error(`deactivate ${id} failed:`, error.message)
  }
}

// 4) Keep the weekend intensif (Sam-Dim 16:00-19:00, 2×3h) active.
for (const lvl of LEVELS) {
  const id = `${lvl}-weekend`
  const { error } = await sb.from('class_groups').update({ is_active: true }).eq('id', id)
  if (error) console.error(`reactivate ${id} failed:`, error.message)
}

const { data: after } = await sb
  .from('class_groups').select('id,label,schedule,price_mad,is_active,booked_count').order('sort_order')
console.log('\nAFTER:')
for (const g of after) console.log(` ${g.is_active ? '●' : '○'} ${g.id.padEnd(12)} ${String(g.price_mad).padEnd(4)} ${g.booked_count} booked  ${g.schedule}`)

const stranded = after.filter((g) => !g.is_active && g.booked_count > 0)
if (stranded.length) {
  console.log('\n⚠ bookings on deactivated groups (move them from the console):')
  for (const g of stranded) console.log(`   ${g.id}: ${g.booked_count} booked`)
} else {
  console.log('\nno bookings stranded on deactivated groups ✓')
}
