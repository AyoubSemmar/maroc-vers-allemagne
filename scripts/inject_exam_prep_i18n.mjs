// Inject the `examPrepCta` namespace + the dashboardServices.services.german-exam-prep
// entry into all 4 locale files. Idempotent.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = path.join(__dirname, '..', 'messages')

const CTA = {
  en: {
    eyebrow: 'Goethe & telc Exam Prep',
    title: 'Need help passing your A1, B1 or B2 exam?',
    subtitle: 'Book a 30-minute paid 1-on-1 session with a German-speaking specialist who knows the Moroccan Goethe and telc exam routine — Casablanca, Rabat, Tanger, online.',
    bullet1: 'Diagnostic in your first 5 minutes — exact gaps to fix',
    bullet2: 'Strategy for each module: lesen, hören, schreiben, sprechen',
    bullet3: 'Mock speaking part with the same format as the real exam',
    bullet4: 'Practical tips: timing, signing up, what to bring on exam day',
  },
  fr: {
    eyebrow: 'Préparation Goethe & telc',
    title: 'Besoin d\'aide pour réussir votre A1, B1 ou B2 ?',
    subtitle: 'Réservez une session payante de 30 minutes en 1-à-1 avec un spécialiste germanophone qui connaît les sessions Goethe et telc au Maroc — Casablanca, Rabat, Tanger, en ligne.',
    bullet1: 'Diagnostic dès les 5 premières minutes — vos lacunes précises',
    bullet2: 'Stratégie par module : lesen, hören, schreiben, sprechen',
    bullet3: 'Simulation orale au format exact de l\'examen',
    bullet4: 'Conseils pratiques : timing, inscription, jour J',
  },
  ar: {
    eyebrow: 'تحضير امتحانات Goethe وtelc',
    title: 'تحتاج مساعدة لاجتياز A1 أو B1 أو B2؟',
    subtitle: 'احجز جلسة فردية مدفوعة مدّتها 30 دقيقة مع مختصّ ناطق بالألمانية يعرف امتحانات Goethe وtelc في المغرب — الدار البيضاء، الرباط، طنجة، أو عن بُعد.',
    bullet1: 'تشخيص في أوّل 5 دقائق — تحديد دقيق لنقاط الضعف',
    bullet2: 'استراتيجية لكل اختبار: lesen، hören، schreiben، sprechen',
    bullet3: 'محاكاة الجزء الشفوي بنفس صيغة الامتحان الحقيقي',
    bullet4: 'نصائح عملية: إدارة الوقت، التسجيل، يوم الامتحان',
  },
  de: {
    eyebrow: 'Goethe- & telc-Prüfungsvorbereitung',
    title: 'Brauchst du Hilfe für deine A1-, B1- oder B2-Prüfung?',
    subtitle: 'Buche eine 30-minütige bezahlte 1-zu-1-Sitzung mit einem deutschsprachigen Spezialisten, der die marokkanischen Goethe- und telc-Prüfungstermine kennt — Casablanca, Rabat, Tanger oder online.',
    bullet1: 'Diagnose in den ersten 5 Minuten — exakte Lücken',
    bullet2: 'Strategie pro Modul: Lesen, Hören, Schreiben, Sprechen',
    bullet3: 'Mündliche Simulation im echten Prüfungsformat',
    bullet4: 'Praktische Tipps: Zeitmanagement, Anmeldung, Prüfungstag',
  },
}

const SERVICE_ENTRY = {
  en: {
    name: 'Goethe / telc Exam Prep',
    blurb: 'Pass your A1, B1 or B2 with confidence — strategy, mock speaking, exam-day playbook.',
    bullet1: 'Module-by-module strategy: lesen, hören, schreiben, sprechen',
    bullet2: 'Mock speaking part recorded in the real Goethe format',
    bullet3: 'Exam-day plan: where in Casablanca/Rabat, what to bring, time per task',
  },
  fr: {
    name: 'Préparation Goethe / telc',
    blurb: 'Passez votre A1, B1 ou B2 avec confiance — stratégie, simulation orale, plan jour J.',
    bullet1: 'Stratégie module par module : lesen, hören, schreiben, sprechen',
    bullet2: 'Simulation orale enregistrée au format Goethe réel',
    bullet3: 'Plan jour J : centre Casablanca/Rabat, à apporter, timing',
  },
  ar: {
    name: 'تحضير Goethe / telc',
    blurb: 'اجتز A1 أو B1 أو B2 بثقة — استراتيجية، محاكاة شفوية، خطة يوم الامتحان.',
    bullet1: 'استراتيجية مفصّلة لكل اختبار: lesen، hören، schreiben، sprechen',
    bullet2: 'تسجيل محاكاة شفوية بنفس صيغة Goethe الحقيقية',
    bullet3: 'خطة يوم الامتحان: مركز الدار البيضاء/الرباط، ما يجب اصطحابه، التوقيت',
  },
  de: {
    name: 'Goethe / telc Prüfungs-Coaching',
    blurb: 'Bestehe A1, B1 oder B2 mit Sicherheit — Strategie, Mündlich-Simulation, Prüfungstag-Plan.',
    bullet1: 'Strategie pro Modul: Lesen, Hören, Schreiben, Sprechen',
    bullet2: 'Aufgezeichnete Mündlich-Simulation im echten Goethe-Format',
    bullet3: 'Prüfungstag-Plan: Centre Casablanca/Rabat, was mitbringen, Timing',
  },
}

const LOCALES = ['en', 'fr', 'ar', 'de']

for (const locale of LOCALES) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  json.examPrepCta = CTA[locale]

  // Append the new service entry alongside the existing ones.
  if (json.dashboardServices && json.dashboardServices.services) {
    json.dashboardServices.services['german-exam-prep'] = SERVICE_ENTRY[locale]
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${locale}.json — examPrepCta + service entry injected`)
}
