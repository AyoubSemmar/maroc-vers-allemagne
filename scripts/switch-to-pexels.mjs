import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const p = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`

// All Pexels photo IDs — verified to load
const imageMap = {
  // ═══════════ العمل (Work) ═══════════
  26: p(3184291),   // salary negotiation — business people talking
  27: p(1181671),   // cover letter — person typing on laptop
  28: p(3760093),   // minijob — casual work at desk
  29: p(4143800),   // werkstudent — student with laptop studying
  30: p(3184465),   // job interview — two people face to face
  31: p(730547),    // payslip — calculator and finances
  32: p(4386431),   // tax return — tax documents phone
  33: p(3183150),   // networking — diverse team meeting
  34: p(8112163),   // Kündigung — signing a contract
  35: p(4974986),   // remote work — home office laptop

  // ═══════════ البنوك (Banking) ═══════════
  36: p(259249),    // Schufa/credit — piggy bank savings
  37: p(164501),    // Girocard vs Visa — payment cards/money
  38: p(1602726),   // Tagesgeld savings — credit cards on table
  39: p(6863183),   // Freistellungsauftrag — financial document
  40: p(3943722),   // insurance — protection hands
  41: p(4386371),   // Dauerauftrag — mobile banking transfer
  42: p(6801874),   // smart savings — money growth
  43: p(5716001),   // ATM fees — cash machine
  44: p(3823488),   // retirement — elderly hands planning
  45: p(4386431),   // Wise/Revolut — phone with bank app

  // ═══════════ شرائح الاتصال (SIM Cards) ═══════════
  46: p(607812),    // Telekom comparison — smartphones on table
  47: p(1092644),   // prepaid — phone in hand
  48: p(5077779),   // eSIM — modern slim phone
  49: p(1181316),   // home internet — router wifi
  50: p(2148217),   // number transfer — phone screen close-up
  51: p(3852577),   // calls Morocco — making a phone call
  52: p(4050291),   // contract traps — reading fine print
  53: p(1008155),   // roaming Europe — travel/europe
  54: p(4219883),   // LTE router — wifi device
  72: p(1128678),   // arrival SIM — airport terminal

  // ═══════════ الجامعات (Universities) ═══════════
  55: p(256520),    // Studienkolleg — open book studying
  56: p(4143800),   // TestDaF/DSH — student with exam papers
  57: p(271816),    // student housing — apartment room
  58: p(3943722),   // BAföG — financial support planning
  59: p(466685),    // student cities — European city street
  60: p(1181671),   // PhD supervisor — research on laptop
  61: p(1438072),   // university life — students on campus
  62: p(3862132),   // part-time work — student working
  63: p(3769021),   // post-graduation — graduation ceremony
  73: p(267491),    // masters application — university library

  // ═══════════ Ausbildung ═══════════
  64: p(3259629),   // nursing — healthcare worker
  65: p(1181244),   // Fachinformatiker — coding on screen
  66: p(5212345),   // Berufsschule — classroom lecture
  67: p(3184306),   // EQ entry — team training
  68: p(4144923),   // IHK exam — exam hall writing
  69: p(8112163),   // Azubi rights — contract signing
  70: p(3762800),   // over-25 — mature adult learning
  71: p(3183197),   // after Ausbildung — career growth
  74: p(2226458),   // logistics — warehouse shelves
  75: p(2544829),   // hospitality/cooking — chef in kitchen
}

let ok = 0, err = 0
for (const [id, image_url] of Object.entries(imageMap)) {
  const { error } = await sb.from('articles').update({ image_url }).eq('id', Number(id))
  if (error) { console.error(`❌ ${id}: ${error.message}`); err++ }
  else { console.log(`✅ ${id}`); ok++ }
}
console.log(`\nDone: ${ok} updated | ${err} errors`)
