import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const u = id => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`

// All replacements confirmed working via HTTP check
const fixes = {
  33: u('1522071820081-009f0129c71c'),   // networking → office meeting (✅ verified)
  39: u('1563013544-824ae1b704d3'),       // Freistellungsauftrag → banking app (✅ verified)
  48: u('1585771724684-38269d6639fd'),    // eSIM → SIM card close-up (✅ verified)
  50: u('1511707171634-5f897ff02aa9'),    // number transfer → smartphone (✅ verified)
  51: u('1512941937669-90a1b58e7e9c'),    // calls Morocco → phone in hand (✅ verified)
  54: u('1558618666-fcd25c85cd64'),       // LTE router → wifi/router (✅ verified)
  57: u('1484154218962-a197022b5858'),    // student housing → apartment living room (✅ verified)
  64: u('1527613426441-4da17471b66d'),    // nursing → healthcare worker (✅ verified)
  66: u('1523050854058-8df90110c9f1'),    // Berufsschule → students campus (✅ verified)
  68: u('1456513080510-7bf3a84b82f8'),    // IHK exam → exam papers (✅ verified)
  70: u('1507003211169-0a1dd7228f2d'),    // over-25 Azubi → job interview/adult (✅ verified)
  74: u('1553413077-190dd305871c'),       // logistics → warehouse shelves (✅ verified)
  75: u('1542314831-068cd1dbfeeb'),       // hospitality → chef kitchen (✅ verified)
}

let ok = 0, err = 0
for (const [id, image_url] of Object.entries(fixes)) {
  const { error } = await sb.from('articles').update({ image_url }).eq('id', Number(id))
  if (error) { console.error(`❌ ${id}: ${error.message}`); err++ }
  else { console.log(`✅ ${id} fixed`); ok++ }
}
console.log(`\nFixed: ${ok} | Errors: ${err}`)
