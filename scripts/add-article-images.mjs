import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Curated Unsplash photos — each one hand-picked for the article topic
// Format: https://images.unsplash.com/photo-{ID}?w=800&auto=format&fit=crop&q=80
const u = id => `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop&q=80`

const imageMap = {
  // ═══════════ العمل (Work) ═══════════
  26: u('1454165804606-c3d57bc86b40'),   // salary negotiation – businesspeople handshake
  27: u('1518455027359-f3f8164ba6bd'),   // cover letter – typing on laptop
  28: u('1504328345606-18bbc8c9d7d1'),   // minijob – part-time work
  29: u('1522202176988-66273c2fd55f'),   // werkstudent – student working
  30: u('1507003211169-0a1dd7228f2d'),   // job interview – two people across table
  31: u('1554224155-8d04cb21cd6c'),      // payslip – euro coins and finance
  32: u('1586943781046-c3e8ccce6d7a'),   // tax return – tax documents
  33: u('1511988617-a7d6b4e9e8b8'),      // networking – professional crowd
  34: u('1450101499163-c8848c66ca85'),   // Kündigung – contract/office
  35: u('1542744173-8e7e53415bb0'),      // remote work – laptop at home

  // ═══════════ البنوك (Banking) ═══════════
  36: u('1563986768609-322da13575f3'),   // Schufa – credit score
  37: u('1559526324-4b87b5e36e44'),      // cards – Girocard vs Visa
  38: u('1579621970588-a6f4562cd6a0'),   // savings – piggy bank
  39: u('1484820540004-14b31e74d0b5'),   // Freistellungsauftrag – financial planning
  40: u('1556742049-0cfed4f6a45d'),      // insurance – protection/umbrella
  41: u('1563013544-824ae1b704d3'),      // Dauerauftrag – banking app
  42: u('1580519542036-c47de6196ba5'),   // smart savings – money planning
  43: u('1501167786272-a8a3b9ea8b08'),   // ATM fees – cash machine
  44: u('1516321318423-f06f85e504b3'),   // retirement – future planning
  45: u('1611974789855-9c2a0a7236a3'),   // Wise/Revolut – money transfer app

  // ═══════════ شرائح الاتصال (SIM Cards) ═══════════
  46: u('1512941937669-90a1b58e7e9c'),   // comparison – multiple phones
  47: u('1511707171634-5f897ff02aa9'),   // prepaid – smartphone hand
  48: u('1601972599720-36b1b2e26dad'),   // eSIM – modern slim phone
  49: u('1558618666-fcd25c85cd64'),      // home internet – wifi router
  50: u('1516321165247-4aa89a48be55'),   // number transfer – phone dial
  51: u('1540553016520-4840f6e6b286'),   // calls Morocco – globe/call
  52: u('1450101499163-c8848c66ca85'),   // contract traps – small print
  53: u('1469854523086-cc02fe5d8800'),   // roaming Europe – europe travel
  54: u('1610630454898-14f6e8bdbf4e'),   // LTE router – wifi device
  72: u('1436491865332-7a61a109cc05'),   // arrival SIM – airport terminal

  // ═══════════ الجامعات (Universities) ═══════════
  55: u('1427504494785-3a9ca7044f45'),   // Studienkolleg – preparation/study
  56: u('1456513080510-7bf3a84b82f8'),   // TestDaF/DSH – exam papers
  57: u('1555854898-a56d22b7aea7'),      // student housing – shared apartment
  58: u('1554224155-8d04cb21cd6c'),      // BAföG – financial support
  59: u('1467803738586-46b7eb7b16a1'),   // student cities – German cityscape
  60: u('1524178232363-1fb2b075b655'),   // PhD supervisor – research desk
  61: u('1523050854058-8df90110c9f1'),   // university life – campus students
  62: u('1521737604893-d14cc237f11d'),   // part-time work – student working
  63: u('1523050854058-8df90110c9f1'),   // post-graduation – commencement
  73: u('1541339907198-e08756dedf3f'),   // master's application – university building

  // ═══════════ Ausbildung ═══════════
  64: u('1559757148-5f5c4b2b6f31'),      // nursing – healthcare worker
  65: u('1461749280684-ddd244de8ede'),   // IT/Fachinformatiker – code on screen
  66: u('1509062522246-51d306f5de51'),   // Berufsschule – classroom
  67: u('1454165804606-c3d57bc86b40'),   // EQ entry – first steps/handshake
  68: u('1434030216411-0b23de065f91'),   // IHK exam – exam hall
  69: u('1558618666-fcd25c85cd64'),      // Azubi rights – contract rights
  70: u('1522529834935-2bfac5f62b52'),   // over 25 – mature student
  71: u('1521737711867-e3b97375f902'),   // after Ausbildung – career growth
  74: u('1566936702582-6b9cf82d4b4a'),   // logistics – warehouse shelves
  75: u('1556909114-44e5cce3e55c'),      // hospitality/cooking – chef kitchen
}

let updated = 0
let errors = 0

for (const [id, image_url] of Object.entries(imageMap)) {
  const { error } = await sb.from('articles').update({ image_url }).eq('id', Number(id))
  if (error) {
    console.error(`❌ ID ${id}: ${error.message}`)
    errors++
  } else {
    console.log(`✅ ID ${id} — updated`)
    updated++
  }
}

console.log(`\nDone: ${updated} updated, ${errors} errors`)
