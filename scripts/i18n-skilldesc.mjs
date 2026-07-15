// Adds learnGerman.devoirs.skillDesc.{lesen,hoeren,schreiben,grammar} to all
// 12 locales — localized skill names shown INSTEAD of the raw assignment
// titles (whose themes are Arabic for many lessons). Idempotent.
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.join(process.cwd(), 'messages')

const T = {
  en: { lesen: 'Reading comprehension', hoeren: 'Listening comprehension', schreiben: 'Written expression', grammar: 'Grammar' },
  fr: { lesen: 'Compréhension écrite', hoeren: 'Compréhension orale', schreiben: 'Expression écrite', grammar: 'Grammaire' },
  ar: { lesen: 'فهم المقروء', hoeren: 'فهم المسموع', schreiben: 'التعبير الكتابي', grammar: 'القواعد' },
  de: { lesen: 'Leseverstehen', hoeren: 'Hörverstehen', schreiben: 'Schriftlicher Ausdruck', grammar: 'Grammatik' },
  es: { lesen: 'Comprensión lectora', hoeren: 'Comprensión auditiva', schreiben: 'Expresión escrita', grammar: 'Gramática' },
  tr: { lesen: 'Okuduğunu anlama', hoeren: 'Dinlediğini anlama', schreiben: 'Yazılı anlatım', grammar: 'Dil bilgisi' },
  fa: { lesen: 'درک مطلب', hoeren: 'درک شنیداری', schreiben: 'نگارش', grammar: 'دستور زبان' },
  pt: { lesen: 'Compreensão escrita', hoeren: 'Compreensão oral', schreiben: 'Expressão escrita', grammar: 'Gramática' },
  ru: { lesen: 'Понимание прочитанного', hoeren: 'Понимание на слух', schreiben: 'Письменная речь', grammar: 'Грамматика' },
  hi: { lesen: 'पठन बोध', hoeren: 'श्रवण बोध', schreiben: 'लेखन अभ्यास', grammar: 'व्याकरण' },
  ur: { lesen: 'فہمِ مطالعہ', hoeren: 'فہمِ سماعت', schreiben: 'تحریری اظہار', grammar: 'گرامر' },
  zh: { lesen: '阅读理解', hoeren: '听力理解', schreiben: '书面表达', grammar: '语法' },
}

for (const [loc, skillDesc] of Object.entries(T)) {
  const f = path.join(DIR, `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  j.learnGerman ??= {}
  j.learnGerman.devoirs ??= {}
  j.learnGerman.devoirs.skillDesc = skillDesc
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n')
  console.log(`✔ ${loc}.json`)
}
console.log('Done.')
