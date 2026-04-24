const fs = require('fs')
const path = require('path')

const meta = {
  ar: {
    cvBuilder: { metaTitle: 'منشئ السيرة الذاتية — مغرب نحو ألمانيا', metaDesc: 'أنشئ سيرة ذاتية ألمانية احترافية (Lebenslauf) بسهولة — عدة قوالب وتصدير PDF مجاني.' },
    anschreiben: { metaTitle: 'مولّد خطاب التحفيز — مغرب نحو ألمانيا', metaDesc: 'اكتب خطاب تحفيز احترافي بالألمانية لطلب Ausbildung بمساعدة الذكاء الاصطناعي — مجاني وسريع.' },
  },
  fr: {
    cvBuilder: { metaTitle: 'Créateur de CV — Maroc vers Allemagne', metaDesc: 'Crée facilement un CV allemand professionnel (Lebenslauf) — plusieurs modèles et export PDF gratuit.' },
    anschreiben: { metaTitle: 'Générateur de lettre de motivation — Maroc vers Allemagne', metaDesc: 'Rédige une lettre de motivation professionnelle en allemand pour une Ausbildung avec l\'aide de l\'IA — gratuit et rapide.' },
  },
  en: {
    cvBuilder: { metaTitle: 'CV Builder — Morocco to Germany', metaDesc: 'Easily build a professional German CV (Lebenslauf) — multiple templates and free PDF export.' },
    anschreiben: { metaTitle: 'Cover Letter Generator — Morocco to Germany', metaDesc: 'Write a professional German cover letter for an Ausbildung with AI help — free and fast.' },
  },
  de: {
    cvBuilder: { metaTitle: 'Lebenslauf-Generator — Marokko nach Deutschland', metaDesc: 'Erstelle einfach einen professionellen deutschen Lebenslauf — mehrere Vorlagen und kostenloser PDF-Export.' },
    anschreiben: { metaTitle: 'Anschreiben-Generator — Marokko nach Deutschland', metaDesc: 'Schreibe ein professionelles deutsches Anschreiben für eine Ausbildung mit KI-Unterstützung — kostenlos und schnell.' },
  },
}

for (const loc of ['ar', 'fr', 'en', 'de']) {
  const p = path.join(__dirname, '..', 'messages', `${loc}.json`)
  const j = JSON.parse(fs.readFileSync(p, 'utf8'))
  j.cvBuilder = { ...(j.cvBuilder || {}), ...meta[loc].cvBuilder }
  j.anschreiben = { ...(j.anschreiben || {}), ...meta[loc].anschreiben }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n', 'utf8')
  console.log(`✓ ${loc}.json`)
}
