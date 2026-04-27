// Inject the `readingExercise` UI namespace into all 4 locale files.
// (Reading texts and questions are AI-generated per request, so only
// the UI labels live here.) Idempotent.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = path.join(__dirname, '..', 'messages')

const UI = {
  en: {
    eyebrow: 'Daily Reading',
    title: 'Today\'s reading challenge',
    subtitle: '{level} · A fresh {min}–{max}-word German text and {n} comprehension questions, generated for you, never repeated.',
    topicBadge: 'Today\'s topic',
    wordsShort: 'words',
    questionsTitle: 'Comprehension questions',
    answered: 'answered',
    submit: 'Check my answers',
    generating: 'Generating your text…',
    correct: '{n} correct',
    startBody: 'Read a short German text at your level, then answer the questions below. The text is brand new every day and never repeated.',
    startCta: 'Start today\'s reading',
    errorGeneric: 'Couldn\'t generate today\'s text. Please try again in a moment.',
    signInTitle: 'Sign in to start reading',
    signInBody: 'The daily reading exercise is free with a free account, so we can save your progress and apply fair daily limits.',
    signInCta: 'Sign in',
    doneTitle: 'You\'ve done today\'s reading',
    doneBody: 'Come back in {hours} {hours, plural, one {hour} other {hours}} for tomorrow\'s text.',
    comeBackTomorrow: 'Come back tomorrow for a new text',
    grade: { excellent: 'Excellent!', good: 'Good job', ok: 'Keep going', practice: 'Re-read carefully' },
  },
  fr: {
    eyebrow: 'Lecture quotidienne',
    title: 'Défi de lecture du jour',
    subtitle: '{level} · Un texte allemand inédit de {min}–{max} mots et {n} questions de compréhension — généré pour vous, jamais répété.',
    topicBadge: 'Thème du jour',
    wordsShort: 'mots',
    questionsTitle: 'Questions de compréhension',
    answered: 'répondues',
    submit: 'Vérifier mes réponses',
    generating: 'Génération de votre texte…',
    correct: '{n} correctes',
    startBody: 'Lisez un texte court en allemand à votre niveau, puis répondez aux questions. Le texte est inédit chaque jour, jamais répété.',
    startCta: 'Démarrer la lecture du jour',
    errorGeneric: 'Impossible de générer le texte du jour. Réessayez dans un instant.',
    signInTitle: 'Connectez-vous pour commencer',
    signInBody: 'L\'exercice quotidien est gratuit avec un compte gratuit, pour enregistrer votre progression et appliquer une limite équitable.',
    signInCta: 'Se connecter',
    doneTitle: 'Vous avez fait la lecture du jour',
    doneBody: 'Revenez dans {hours} {hours, plural, one {heure} other {heures}} pour le texte de demain.',
    comeBackTomorrow: 'Revenez demain pour un nouveau texte',
    grade: { excellent: 'Excellent !', good: 'Bon travail', ok: 'Continuez', practice: 'Relisez attentivement' },
  },
  ar: {
    eyebrow: 'قراءة يومية',
    title: 'تحدّي القراءة اليومي',
    subtitle: '{level} · نص ألماني جديد من {min} إلى {max} كلمة و{n} أسئلة فهم — مُولَّد لك، لا يتكرّر.',
    topicBadge: 'موضوع اليوم',
    wordsShort: 'كلمة',
    questionsTitle: 'أسئلة الفهم',
    answered: 'مُجابة',
    submit: 'تحقّق من إجاباتي',
    generating: 'جاري توليد النص…',
    correct: '{n} صحيحة',
    startBody: 'اقرأ نصاً قصيراً بالألمانية في مستواك، ثم أجب عن الأسئلة. النص جديد كل يوم ولا يتكرّر.',
    startCta: 'ابدأ قراءة اليوم',
    errorGeneric: 'تعذّر توليد نص اليوم. أعد المحاولة بعد قليل.',
    signInTitle: 'سجّل الدخول للبدء',
    signInBody: 'التمرين اليومي مجاني بإنشاء حساب، حتى نحفظ تقدّمك ونطبّق حدّاً يومياً عادلاً.',
    signInCta: 'تسجيل الدخول',
    doneTitle: 'لقد أنجزت قراءة اليوم',
    doneBody: 'عُد بعد {hours} {hours, plural, one {ساعة} other {ساعات}} لنص الغد.',
    comeBackTomorrow: 'عُد غداً لنص جديد',
    grade: { excellent: 'ممتاز!', good: 'عمل جيّد', ok: 'استمرّ', practice: 'أعد القراءة بانتباه' },
  },
  de: {
    eyebrow: 'Tägliches Lesen',
    title: 'Heutige Lese-Aufgabe',
    subtitle: '{level} · Ein frischer deutscher Text mit {min}–{max} Wörtern und {n} Verständnisfragen — für dich generiert, nie wiederholt.',
    topicBadge: 'Thema heute',
    wordsShort: 'Wörter',
    questionsTitle: 'Verständnisfragen',
    answered: 'beantwortet',
    submit: 'Antworten prüfen',
    generating: 'Text wird generiert…',
    correct: '{n} richtig',
    startBody: 'Lies einen kurzen deutschen Text auf deinem Niveau, dann beantworte die Fragen. Der Text ist täglich neu und einzigartig.',
    startCta: 'Heute lesen starten',
    errorGeneric: 'Heutiger Text konnte nicht generiert werden. Gleich nochmal versuchen.',
    signInTitle: 'Melde dich an zum Lesen',
    signInBody: 'Die tägliche Übung ist kostenlos — mit kostenlosem Konto speichern wir deinen Fortschritt und wenden ein faires Tageslimit an.',
    signInCta: 'Einloggen',
    doneTitle: 'Du hast die heutige Übung gemacht',
    doneBody: 'Komm in {hours} {hours, plural, one {Stunde} other {Stunden}} wieder für den Text von morgen.',
    comeBackTomorrow: 'Komm morgen für einen neuen Text wieder',
    grade: { excellent: 'Ausgezeichnet!', good: 'Gut gemacht', ok: 'Weiter so', practice: 'Nochmal sorgfältig lesen' },
  },
}

const LOCALES = ['en', 'fr', 'ar', 'de']

for (const locale of LOCALES) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  json.readingExercise = UI[locale]
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${locale}.json — readingExercise namespace injected`)
}
