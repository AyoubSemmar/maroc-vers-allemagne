// Inject the `writingExercise` namespace into all 4 locale files.
// Idempotent: re-running overwrites the namespace.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_DIR = path.join(__dirname, '..', 'messages')

// UI strings (per locale).
const UI = {
  en: {
    eyebrow: 'Daily Writing',
    title: 'Today\'s writing challenge',
    subtitle: '{level} · Write {min}–{max} words. Submit and get your text corrected with explanations.',
    themeBadge: 'Today\'s theme',
    wordsShort: 'words',
    placeholder: 'Write your text here in German…',
    submit: 'Submit for correction',
    submitting: 'Correcting…',
    errorGeneric: 'Something went wrong. Please try again in a moment.',
    inRange: 'within range',
    outOfRange: 'aim for {min}–{max}',
    mistakesTitle: '{n} {n, plural, one {mistake} other {mistakes}} found',
    mistakesSub: 'Each underlined part is a mistake. Hover or check the list below to see why.',
    correctedTitle: 'Corrected version',
    correctedSub: 'Your text rewritten in correct German, kept at your level.',
    comeBackTomorrow: 'Come back tomorrow for a new theme',
    signInTitle: 'Sign in to start writing',
    signInBody: 'The daily writing exercise is free with a free account, so we can save your progress and give you fair daily limits.',
    signInCta: 'Sign in',
    doneTitle: 'You\'ve done today\'s exercise',
    doneBody: 'Come back in {hours} {hours, plural, one {hour} other {hours}} for tomorrow\'s theme.',
    grade: { excellent: 'Excellent!', good: 'Good job', ok: 'Keep going', practice: 'Practice more' },
  },
  fr: {
    eyebrow: 'Écriture quotidienne',
    title: 'Défi d\'écriture du jour',
    subtitle: '{level} · Écrivez {min}–{max} mots. Soumettez et recevez votre texte corrigé avec explications.',
    themeBadge: 'Thème du jour',
    wordsShort: 'mots',
    placeholder: 'Écrivez votre texte ici en allemand…',
    submit: 'Envoyer pour correction',
    submitting: 'Correction en cours…',
    errorGeneric: 'Une erreur est survenue. Réessayez dans un instant.',
    inRange: 'dans la fourchette',
    outOfRange: 'visez {min}–{max}',
    mistakesTitle: '{n} {n, plural, one {erreur trouvée} other {erreurs trouvées}}',
    mistakesSub: 'Chaque passage souligné est une erreur. Survolez-le ou consultez la liste pour voir pourquoi.',
    correctedTitle: 'Version corrigée',
    correctedSub: 'Votre texte réécrit en allemand correct, gardé à votre niveau.',
    comeBackTomorrow: 'Revenez demain pour un nouveau thème',
    signInTitle: 'Connectez-vous pour écrire',
    signInBody: 'L\'exercice quotidien est gratuit avec un compte gratuit, pour pouvoir enregistrer votre progression et appliquer une limite équitable.',
    signInCta: 'Se connecter',
    doneTitle: 'Vous avez fait l\'exercice du jour',
    doneBody: 'Revenez dans {hours} {hours, plural, one {heure} other {heures}} pour le thème de demain.',
    grade: { excellent: 'Excellent !', good: 'Bon travail', ok: 'Continuez', practice: 'Encore un effort' },
  },
  ar: {
    eyebrow: 'كتابة يومية',
    title: 'تحدّي الكتابة اليومي',
    subtitle: '{level} · اكتب من {min} إلى {max} كلمة. أرسل النص واحصل على تصحيحه مع شروحات.',
    themeBadge: 'موضوع اليوم',
    wordsShort: 'كلمة',
    placeholder: 'اكتب نصّك هنا بالألمانية…',
    submit: 'إرسال للتصحيح',
    submitting: 'جاري التصحيح…',
    errorGeneric: 'وقع خطأ. أعد المحاولة بعد قليل.',
    inRange: 'ضمن المجال',
    outOfRange: 'استهدف {min}–{max}',
    mistakesTitle: '{n} {n, plural, one {خطأ مكتشف} other {أخطاء مكتشفة}}',
    mistakesSub: 'كل مقطع مسطّر هو خطأ. مرّر فوقه أو راجع القائمة أسفله لمعرفة السبب.',
    correctedTitle: 'النسخة المصحّحة',
    correctedSub: 'نصّك مُعاد صياغته بالألمانية الصحيحة، في مستواك دون مبالغة.',
    comeBackTomorrow: 'عُد غداً لموضوع جديد',
    signInTitle: 'سجّل الدخول للبدء',
    signInBody: 'التمرين اليومي مجاني بمجرد إنشاء حساب مجاني، حتى نحفظ تقدّمك ونطبّق حدّاً يومياً عادلاً.',
    signInCta: 'تسجيل الدخول',
    doneTitle: 'لقد أنجزت تمرين اليوم',
    doneBody: 'عُد بعد {hours} {hours, plural, one {ساعة} other {ساعات}} لموضوع الغد.',
    grade: { excellent: 'ممتاز!', good: 'عمل جيّد', ok: 'استمرّ', practice: 'تحتاج المزيد من التمرين' },
  },
  de: {
    eyebrow: 'Tägliches Schreiben',
    title: 'Heutige Schreib-Aufgabe',
    subtitle: '{level} · Schreibe {min}–{max} Wörter. Abschicken und korrigierten Text mit Erklärungen erhalten.',
    themeBadge: 'Thema heute',
    wordsShort: 'Wörter',
    placeholder: 'Schreibe deinen Text hier auf Deutsch…',
    submit: 'Zur Korrektur abschicken',
    submitting: 'Korrektur läuft…',
    errorGeneric: 'Etwas ist schiefgegangen. Bitte gleich nochmal versuchen.',
    inRange: 'im Bereich',
    outOfRange: 'ziele auf {min}–{max}',
    mistakesTitle: '{n} {n, plural, one {Fehler gefunden} other {Fehler gefunden}}',
    mistakesSub: 'Jeder unterstrichene Teil ist ein Fehler. Mit der Maus drüber oder Liste unten lesen.',
    correctedTitle: 'Korrigierte Fassung',
    correctedSub: 'Dein Text in korrektem Deutsch — auf deinem Niveau gehalten.',
    comeBackTomorrow: 'Komm morgen für ein neues Thema wieder',
    signInTitle: 'Melde dich an zum Schreiben',
    signInBody: 'Die tägliche Schreibübung ist kostenlos — mit kostenlosem Konto können wir deinen Fortschritt speichern und ein faires Tageslimit anwenden.',
    signInCta: 'Einloggen',
    doneTitle: 'Du hast die heutige Übung gemacht',
    doneBody: 'Komm in {hours} {hours, plural, one {Stunde} other {Stunden}} wieder fürs Thema von morgen.',
    grade: { excellent: 'Ausgezeichnet!', good: 'Gut gemacht', ok: 'Weiter so', practice: 'Mehr üben' },
  },
}

// 50 themes — 10 per level. Each has the German instruction (sent to Claude
// + shown to student), and per-locale title + instruction translation.
const T = {
  // ── A1 ────────────────────────────────────────────────────
  a1_self: {
    de: 'Stelle dich vor: Name, Alter, Herkunft, Beruf oder Studium, eine Sache, die du gerne machst. Schreibe in vollständigen Sätzen.',
    titles: { en: 'Introduce yourself', fr: 'Présente-toi', ar: 'قدّم نفسك', de: 'Stell dich vor' },
    hint: { en: 'Use: ich heiße, ich bin … Jahre alt, ich komme aus, ich mag', fr: 'Utilise : ich heiße, ich bin … Jahre alt, ich komme aus, ich mag', ar: 'استعمل: ich heiße, ich bin … Jahre alt, ich komme aus, ich mag', de: 'Verwende: ich heiße, ich bin … Jahre alt, ich komme aus, ich mag' },
  },
  a1_family: {
    de: 'Beschreibe deine Familie: Wer gehört dazu? Wie heißen sie? Wie alt sind sie? Was machen sie?',
    titles: { en: 'My family', fr: 'Ma famille', ar: 'عائلتي', de: 'Meine Familie' },
    hint: { en: 'Useful: Mutter, Vater, Bruder, Schwester, mein/meine', fr: 'Utile : Mutter, Vater, Bruder, Schwester, mein/meine', ar: 'مفيد: Mutter, Vater, Bruder, Schwester, mein/meine', de: 'Nützlich: Mutter, Vater, Bruder, Schwester, mein/meine' },
  },
  a1_daily: {
    de: 'Beschreibe einen normalen Tag: Was machst du am Morgen, am Mittag und am Abend? Schreibe einfache Sätze.',
    titles: { en: 'A normal day', fr: 'Une journée typique', ar: 'يوم عادي', de: 'Ein normaler Tag' },
    hint: { en: 'Use: aufstehen, frühstücken, arbeiten, essen, schlafen', fr: 'Utilise : aufstehen, frühstücken, arbeiten, essen, schlafen', ar: 'استعمل: aufstehen, frühstücken, arbeiten, essen, schlafen', de: 'Verwende: aufstehen, frühstücken, arbeiten, essen, schlafen' },
  },
  a1_hobby: {
    de: 'Was sind deine Hobbys? Was machst du gerne in deiner Freizeit? Wann und wo machst du das?',
    titles: { en: 'My hobbies', fr: 'Mes loisirs', ar: 'هواياتي', de: 'Meine Hobbys' },
    hint: { en: 'Use ich spiele, ich lese, ich höre, gerne', fr: 'Utilise ich spiele, ich lese, ich höre, gerne', ar: 'استعمل ich spiele, ich lese, ich höre, gerne', de: 'Verwende ich spiele, ich lese, ich höre, gerne' },
  },
  a1_weekend: {
    de: 'Was machst du am Wochenende? Wo gehst du hin? Mit wem? Wie lange?',
    titles: { en: 'My weekend', fr: 'Mon week-end', ar: 'عطلة نهاية أسبوعي', de: 'Mein Wochenende' },
    hint: { en: 'am Samstag / am Sonntag, mit Freunden, ich gehe', fr: 'am Samstag / am Sonntag, mit Freunden, ich gehe', ar: 'am Samstag / am Sonntag, mit Freunden, ich gehe', de: 'am Samstag / am Sonntag, mit Freunden, ich gehe' },
  },
  a1_food: {
    de: 'Was isst und trinkst du gerne? Was magst du nicht? Was isst du heute?',
    titles: { en: 'Food I like', fr: 'Ce que j\'aime manger', ar: 'الأكلات التي أحبها', de: 'Mein Essen' },
    hint: { en: 'ich esse / trinke gern, ich mag … nicht', fr: 'ich esse / trinke gern, ich mag … nicht', ar: 'ich esse / trinke gern, ich mag … nicht', de: 'ich esse / trinke gern, ich mag … nicht' },
  },
  a1_room: {
    de: 'Beschreibe dein Zimmer: Was gibt es dort? Welche Farben? Wo stehen die Möbel?',
    titles: { en: 'My room', fr: 'Ma chambre', ar: 'غرفتي', de: 'Mein Zimmer' },
    hint: { en: 'es gibt, links, rechts, vor, neben', fr: 'es gibt, links, rechts, vor, neben', ar: 'es gibt, links, rechts, vor, neben', de: 'es gibt, links, rechts, vor, neben' },
  },
  a1_weather: {
    de: 'Wie ist das Wetter heute? Was trägst du? Was machst du bei diesem Wetter?',
    titles: { en: 'Today\'s weather', fr: 'Le temps aujourd\'hui', ar: 'طقس اليوم', de: 'Wetter heute' },
    hint: { en: 'es ist sonnig / regnerisch / kalt / warm', fr: 'es ist sonnig / regnerisch / kalt / warm', ar: 'es ist sonnig / regnerisch / kalt / warm', de: 'es ist sonnig / regnerisch / kalt / warm' },
  },
  a1_friend: {
    de: 'Beschreibe deinen besten Freund oder deine beste Freundin: Name, Alter, Charakter, was ihr zusammen macht.',
    titles: { en: 'My best friend', fr: 'Mon/ma meilleur(e) ami(e)', ar: 'صديقي المفضل', de: 'Mein bester Freund' },
    hint: { en: 'er/sie ist nett, lustig, wir machen zusammen', fr: 'er/sie ist nett, lustig, wir machen zusammen', ar: 'er/sie ist nett, lustig, wir machen zusammen', de: 'er/sie ist nett, lustig, wir machen zusammen' },
  },
  a1_city: {
    de: 'Beschreibe deine Stadt: Wie heißt sie? Was gibt es dort? Was magst du, was magst du nicht?',
    titles: { en: 'My city', fr: 'Ma ville', ar: 'مدينتي', de: 'Meine Stadt' },
    hint: { en: 'meine Stadt heißt, es gibt, ich finde … schön', fr: 'meine Stadt heißt, es gibt, ich finde … schön', ar: 'meine Stadt heißt, es gibt, ich finde … schön', de: 'meine Stadt heißt, es gibt, ich finde … schön' },
  },

  // ── A2 ────────────────────────────────────────────────────
  a2_holiday: {
    de: 'Beschreibe deinen letzten Urlaub: Wohin bist du gefahren? Mit wem? Was hast du gemacht? Wie war es?',
    titles: { en: 'My last holiday', fr: 'Mes dernières vacances', ar: 'عطلتي الأخيرة', de: 'Mein letzter Urlaub' },
    hint: { en: 'Use Perfekt: ich bin gefahren, ich habe gesehen', fr: 'Utilise le Perfekt : ich bin gefahren, ich habe gesehen', ar: 'استعمل الـPerfekt: ich bin gefahren, ich habe gesehen', de: 'Verwende Perfekt: ich bin gefahren, ich habe gesehen' },
  },
  a2_school_day: {
    de: 'Wie war dein Tag in der Schule oder bei der Arbeit? Was hast du gemacht? Wer war dabei?',
    titles: { en: 'A day at school/work', fr: 'Une journée d\'école/travail', ar: 'يوم في الدراسة أو العمل', de: 'Ein Tag in Schule/Arbeit' },
    hint: { en: 'Perfekt + Zeitangaben: zuerst, dann, danach', fr: 'Perfekt + connecteurs : zuerst, dann, danach', ar: 'Perfekt + روابط: zuerst, dann, danach', de: 'Perfekt + Zeitangaben: zuerst, dann, danach' },
  },
  a2_shopping: {
    de: 'Beschreibe einen Einkauf: Wo warst du? Was hast du gekauft? Wie viel hat es gekostet? War es gut?',
    titles: { en: 'My last shopping trip', fr: 'Mes dernières courses', ar: 'تسوّقي الأخير', de: 'Einkauf neulich' },
    hint: { en: 'kosten, Euro, ich habe gekauft, billig/teuer', fr: 'kosten, Euro, ich habe gekauft, billig/teuer', ar: 'kosten, Euro, ich habe gekauft, billig/teuer', de: 'kosten, Euro, ich habe gekauft, billig/teuer' },
  },
  a2_doctor: {
    de: 'Du warst beim Arzt. Was tat dir weh? Was hast du gemacht? Was hat der Arzt gesagt?',
    titles: { en: 'At the doctor\'s', fr: 'Chez le médecin', ar: 'عند الطبيب', de: 'Beim Arzt' },
    hint: { en: 'mir tut … weh, der Arzt hat gesagt, Tabletten', fr: 'mir tut … weh, der Arzt hat gesagt, Tabletten', ar: 'mir tut … weh, der Arzt hat gesagt, Tabletten', de: 'mir tut … weh, der Arzt hat gesagt, Tabletten' },
  },
  a2_birthday: {
    de: 'Beschreibe einen Geburtstag, den du gefeiert hast: Wer war da? Was habt ihr gemacht? Was war das Geschenk?',
    titles: { en: 'A birthday party', fr: 'Un anniversaire', ar: 'حفل عيد ميلاد', de: 'Ein Geburtstag' },
    hint: { en: 'Geschenk, feiern, Kuchen, eingeladen', fr: 'Geschenk, feiern, Kuchen, eingeladen', ar: 'Geschenk, feiern, Kuchen, eingeladen', de: 'Geschenk, feiern, Kuchen, eingeladen' },
  },
  a2_dream_trip: {
    de: 'Wohin möchtest du in den nächsten Sommer fahren? Mit wem? Was möchtest du dort machen? Schreibe deine Pläne.',
    titles: { en: 'My dream trip', fr: 'Mon voyage rêvé', ar: 'رحلتي المثالية', de: 'Meine Traumreise' },
    hint: { en: 'Future: ich werde, ich möchte', fr: 'Futur : ich werde, ich möchte', ar: 'المستقبل: ich werde, ich möchte', de: 'Zukunft: ich werde, ich möchte' },
  },
  a2_work_day: {
    de: 'Wie sieht dein Arbeitstag aus? Was machst du? Welche Kollegen hast du? Was magst du an deiner Arbeit?',
    titles: { en: 'A day at work', fr: 'Une journée au travail', ar: 'يوم عمل', de: 'Mein Arbeitstag' },
    hint: { en: 'Kollege, Chef, Aufgaben, ich beginne', fr: 'Kollege, Chef, Aufgaben, ich beginne', ar: 'Kollege, Chef, Aufgaben, ich beginne', de: 'Kollege, Chef, Aufgaben, ich beginne' },
  },
  a2_apartment: {
    de: 'Beschreibe deine Wohnung: Wie viele Zimmer? Welche Möbel? Was ist gut, was ist nicht so gut?',
    titles: { en: 'My apartment', fr: 'Mon appartement', ar: 'شقتي', de: 'Meine Wohnung' },
    hint: { en: 'Zimmer, Küche, Bad, Balkon, Möbel', fr: 'Zimmer, Küche, Bad, Balkon, Möbel', ar: 'Zimmer, Küche, Bad, Balkon, Möbel', de: 'Zimmer, Küche, Bad, Balkon, Möbel' },
  },
  a2_movie: {
    de: 'Beschreibe einen Film, den du gesehen hast. Worum ging es? Wer hat gespielt? Hat er dir gefallen? Warum?',
    titles: { en: 'A movie I saw', fr: 'Un film que j\'ai vu', ar: 'فيلم شاهدته', de: 'Ein gesehener Film' },
    hint: { en: 'es geht um, der Hauptdarsteller, mir hat … gefallen', fr: 'es geht um, der Hauptdarsteller, mir hat … gefallen', ar: 'es geht um, der Hauptdarsteller, mir hat … gefallen', de: 'es geht um, der Hauptdarsteller, mir hat … gefallen' },
  },
  a2_germany_first: {
    de: 'Was würdest du als Erstes in Deutschland machen? Wohin würdest du gehen? Was möchtest du essen, sehen, lernen?',
    titles: { en: 'My first day in Germany', fr: 'Mon premier jour en Allemagne', ar: 'يومي الأول في ألمانيا', de: 'Mein erster Tag in DE' },
    hint: { en: 'ich möchte, zuerst, dann, danach', fr: 'ich möchte, zuerst, dann, danach', ar: 'ich möchte, zuerst, dann, danach', de: 'ich möchte, zuerst, dann, danach' },
  },

  // ── B1 ────────────────────────────────────────────────────
  b1_opinion_phone: {
    de: 'Schreibe deine Meinung: Sind Smartphones für Jugendliche gut oder schlecht? Gib zwei Argumente und ein Beispiel.',
    titles: { en: 'Smartphones for teens', fr: 'Smartphones et ados', ar: 'الهواتف الذكية والمراهقون', de: 'Smartphones für Jugendliche' },
    hint: { en: 'meiner Meinung nach, einerseits, andererseits, zum Beispiel', fr: 'meiner Meinung nach, einerseits, andererseits, zum Beispiel', ar: 'meiner Meinung nach, einerseits, andererseits, zum Beispiel', de: 'meiner Meinung nach, einerseits, andererseits, zum Beispiel' },
  },
  b1_complaint: {
    de: 'Schreibe eine kurze Beschwerde-E-Mail an ein Hotel: Du warst unzufrieden mit deinem Zimmer. Erkläre das Problem und was du dir wünschst.',
    titles: { en: 'Hotel complaint email', fr: 'Plainte à un hôtel', ar: 'شكوى إلى فندق', de: 'Beschwerde an ein Hotel' },
    hint: { en: 'Sehr geehrte Damen und Herren, leider, ich erwarte', fr: 'Sehr geehrte Damen und Herren, leider, ich erwarte', ar: 'Sehr geehrte Damen und Herren, leider, ich erwarte', de: 'Sehr geehrte Damen und Herren, leider, ich erwarte' },
  },
  b1_email_friend: {
    de: 'Schreibe eine E-Mail an einen Freund in Deutschland: Du planst einen Besuch. Erkläre, wann du kommst und was du gerne machen möchtest.',
    titles: { en: 'Email to a friend', fr: 'E-mail à un ami', ar: 'بريد لصديق', de: 'E-Mail an einen Freund' },
    hint: { en: 'Hallo …, ich plane, vielleicht können wir, freue mich', fr: 'Hallo …, ich plane, vielleicht können wir, freue mich', ar: 'Hallo …, ich plane, vielleicht können wir, freue mich', de: 'Hallo …, ich plane, vielleicht können wir, freue mich' },
  },
  b1_pros_cons_city: {
    de: 'Lebt man besser in der Stadt oder auf dem Land? Nenne je zwei Vorteile und Nachteile und gib deine Meinung.',
    titles: { en: 'City vs. countryside', fr: 'Ville ou campagne ?', ar: 'المدينة أم الريف؟', de: 'Stadt oder Land?' },
    hint: { en: 'der Vorteil, der Nachteil, im Gegensatz dazu', fr: 'der Vorteil, der Nachteil, im Gegensatz dazu', ar: 'der Vorteil, der Nachteil, im Gegensatz dazu', de: 'der Vorteil, der Nachteil, im Gegensatz dazu' },
  },
  b1_my_career: {
    de: 'Beschreibe deine Karrierepläne: Was möchtest du beruflich machen? Warum? Welche Schritte hast du schon gemacht?',
    titles: { en: 'My career plan', fr: 'Mon plan de carrière', ar: 'مشروعي المهني', de: 'Meine Karriere' },
    hint: { en: 'mein Ziel ist, ich plane, weil, deshalb', fr: 'mein Ziel ist, ich plane, weil, deshalb', ar: 'mein Ziel ist, ich plane, weil, deshalb', de: 'mein Ziel ist, ich plane, weil, deshalb' },
  },
  b1_health_tip: {
    de: 'Gib einer Freundin Tipps: Sie fühlt sich gestresst und schläft schlecht. Was sollte sie tun? Erkläre warum.',
    titles: { en: 'Health advice for a friend', fr: 'Conseils santé', ar: 'نصائح صحية لصديقة', de: 'Gesundheits-Tipps' },
    hint: { en: 'du solltest, es ist wichtig, weil, sonst', fr: 'du solltest, es ist wichtig, weil, sonst', ar: 'du solltest, es ist wichtig, weil, sonst', de: 'du solltest, es ist wichtig, weil, sonst' },
  },
  b1_bad_day: {
    de: 'Erzähle einen schlechten Tag aus deinem Leben: Was ist passiert? Wie hast du reagiert? Was hast du daraus gelernt?',
    titles: { en: 'A bad day', fr: 'Une mauvaise journée', ar: 'يوم سيّئ', de: 'Ein schlechter Tag' },
    hint: { en: 'plötzlich, danach, schließlich, ich habe gelernt', fr: 'plötzlich, danach, schließlich, ich habe gelernt', ar: 'plötzlich, danach, schließlich, ich habe gelernt', de: 'plötzlich, danach, schließlich, ich habe gelernt' },
  },
  b1_culture_shock: {
    de: 'Was findest du in der deutschen Kultur überraschend oder anders als in deinem Land? Gib zwei konkrete Beispiele.',
    titles: { en: 'A cultural surprise', fr: 'Surprise culturelle', ar: 'مفاجأة ثقافية', de: 'Kulturschock' },
    hint: { en: 'im Vergleich zu, ich war überrascht, dass', fr: 'im Vergleich zu, ich war überrascht, dass', ar: 'im Vergleich zu, ich war überrascht, dass', de: 'im Vergleich zu, ich war überrascht, dass' },
  },
  b1_environment: {
    de: 'Was kann jeder Mensch im Alltag tun, um die Umwelt zu schützen? Nenne drei konkrete Tipps.',
    titles: { en: 'Helping the environment', fr: 'Protéger l\'environnement', ar: 'حماية البيئة', de: 'Umwelt schützen' },
    hint: { en: 'man sollte, statt, indem, deshalb', fr: 'man sollte, statt, indem, deshalb', ar: 'man sollte, statt, indem, deshalb', de: 'man sollte, statt, indem, deshalb' },
  },
  b1_app_review: {
    de: 'Beschreibe eine App oder Website, die du oft benutzt: Was kann man damit machen? Was findest du gut und nicht so gut?',
    titles: { en: 'Reviewing an app', fr: 'Une appli que j\'utilise', ar: 'تطبيق أستعمله', de: 'App-Bewertung' },
    hint: { en: 'damit kann man, ich finde gut, allerdings', fr: 'damit kann man, ich finde gut, allerdings', ar: 'damit kann man, ich finde gut, allerdings', de: 'damit kann man, ich finde gut, allerdings' },
  },

  // ── B2 ────────────────────────────────────────────────────
  b2_social_media: {
    de: 'Diskutiere: Wie verändern soziale Medien das Verhalten junger Menschen? Nenne positive und negative Aspekte und gib deine begründete Meinung.',
    titles: { en: 'Social media impact', fr: 'Réseaux sociaux et jeunesse', ar: 'الشبكات الاجتماعية والشباب', de: 'Soziale Medien' },
    hint: { en: 'darüber hinaus, dennoch, infolgedessen', fr: 'darüber hinaus, dennoch, infolgedessen', ar: 'darüber hinaus, dennoch, infolgedessen', de: 'darüber hinaus, dennoch, infolgedessen' },
  },
  b2_remote_work: {
    de: 'Sollten Unternehmen Mitarbeiter dauerhaft im Homeoffice arbeiten lassen? Argumentiere mit Vor- und Nachteilen für beide Seiten.',
    titles: { en: 'Remote work for good?', fr: 'Télétravail durable ?', ar: 'العمل عن بعد بشكل دائم؟', de: 'Dauerhaftes Homeoffice' },
    hint: { en: 'einerseits/andererseits, zudem, allerdings', fr: 'einerseits/andererseits, zudem, allerdings', ar: 'einerseits/andererseits, zudem, allerdings', de: 'einerseits/andererseits, zudem, allerdings' },
  },
  b2_immigration: {
    de: 'Welche Vorteile bringt qualifizierte Zuwanderung für Deutschland? Welche Herausforderungen gibt es? Gib eine begründete Stellungnahme.',
    titles: { en: 'Skilled immigration', fr: 'Immigration qualifiée', ar: 'الهجرة المؤهَّلة', de: 'Fachkräfte-Zuwanderung' },
    hint: { en: 'zur Folge haben, beitragen zu, voraussetzen', fr: 'zur Folge haben, beitragen zu, voraussetzen', ar: 'zur Folge haben, beitragen zu, voraussetzen', de: 'zur Folge haben, beitragen zu, voraussetzen' },
  },
  b2_climate: {
    de: 'Wer trägt mehr Verantwortung für den Klimaschutz: der einzelne Bürger oder die Politik? Begründe deine Position mit Beispielen.',
    titles: { en: 'Climate responsibility', fr: 'Responsabilité climatique', ar: 'مسؤولية المناخ', de: 'Klimaverantwortung' },
    hint: { en: 'verantwortlich für, im Vergleich zu, letztendlich', fr: 'verantwortlich für, im Vergleich zu, letztendlich', ar: 'verantwortlich für, im Vergleich zu, letztendlich', de: 'verantwortlich für, im Vergleich zu, letztendlich' },
  },
  b2_education_reform: {
    de: 'Wie sollte die Schule der Zukunft aussehen? Schlage zwei konkrete Reformen vor und begründe sie.',
    titles: { en: 'School of the future', fr: 'L\'école du futur', ar: 'مدرسة المستقبل', de: 'Schule der Zukunft' },
    hint: { en: 'es bedarf, ich schlage vor, vorausgesetzt, dass', fr: 'es bedarf, ich schlage vor, vorausgesetzt, dass', ar: 'es bedarf, ich schlage vor, vorausgesetzt, dass', de: 'es bedarf, ich schlage vor, vorausgesetzt, dass' },
  },
  b2_ai_jobs: {
    de: 'Wird KI mehr Arbeitsplätze schaffen oder vernichten? Argumentiere differenziert mit zwei Beispielen aus verschiedenen Branchen.',
    titles: { en: 'AI and jobs', fr: 'IA et emploi', ar: 'الذكاء الاصطناعي والشغل', de: 'KI und Arbeit' },
    hint: { en: 'ersetzen, automatisieren, neu entstehen', fr: 'ersetzen, automatisieren, neu entstehen', ar: 'ersetzen, automatisieren, neu entstehen', de: 'ersetzen, automatisieren, neu entstehen' },
  },
  b2_consumerism: {
    de: 'Konsumieren wir zu viel? Diskutiere die Folgen unseres Konsumverhaltens und schlage Lösungen vor.',
    titles: { en: 'Consumer society', fr: 'Société de consommation', ar: 'مجتمع الاستهلاك', de: 'Konsumgesellschaft' },
    hint: { en: 'der Konsum, das Bewusstsein, nachhaltig', fr: 'der Konsum, das Bewusstsein, nachhaltig', ar: 'der Konsum, das Bewusstsein, nachhaltig', de: 'der Konsum, das Bewusstsein, nachhaltig' },
  },
  b2_generation_gap: {
    de: 'Worin unterscheiden sich die Werte der Generation deiner Eltern und deiner eigenen Generation? Gib konkrete Beispiele.',
    titles: { en: 'Generation gap', fr: 'Écart entre générations', ar: 'الفجوة بين الأجيال', de: 'Generationsunterschied' },
    hint: { en: 'im Gegensatz zu, früher, heutzutage', fr: 'im Gegensatz zu, früher, heutzutage', ar: 'im Gegensatz zu, früher, heutzutage', de: 'im Gegensatz zu, früher, heutzutage' },
  },
  b2_health_systems: {
    de: 'Was unterscheidet ein gutes Gesundheitssystem von einem schlechten? Vergleiche zwei Aspekte aus Marokko und Deutschland.',
    titles: { en: 'Health systems compared', fr: 'Comparer les systèmes de santé', ar: 'مقارنة الأنظمة الصحية', de: 'Gesundheitssysteme' },
    hint: { en: 'während, hingegen, der Zugang zu', fr: 'während, hingegen, der Zugang zu', ar: 'während, hingegen, der Zugang zu', de: 'während, hingegen, der Zugang zu' },
  },
  b2_minimum_wage: {
    de: 'Sollte der Mindestlohn weiter erhöht werden? Diskutiere die wirtschaftlichen und sozialen Folgen mit Pro- und Contra-Argumenten.',
    titles: { en: 'Minimum wage debate', fr: 'Salaire minimum', ar: 'الحد الأدنى للأجور', de: 'Mindestlohn-Debatte' },
    hint: { en: 'erhöhen, sich auswirken auf, Arbeitsmarkt', fr: 'erhöhen, sich auswirken auf, Arbeitsmarkt', ar: 'erhöhen, sich auswirken auf, Arbeitsmarkt', de: 'erhöhen, sich auswirken auf, Arbeitsmarkt' },
  },

  // ── C1 ────────────────────────────────────────────────────
  c1_digitalisation: {
    de: 'Erörtere, inwiefern die Digitalisierung des Alltags die soziale Interaktion verändert hat. Gehe auf positive und negative Aspekte ein und nimm begründet Stellung.',
    titles: { en: 'Digitalisation & society', fr: 'Numérisation et société', ar: 'الرقمنة والمجتمع', de: 'Digitalisierung & Gesellschaft' },
    hint: { en: 'eine ambivalente Entwicklung, gleichwohl, sich gewahr werden', fr: 'eine ambivalente Entwicklung, gleichwohl, sich gewahr werden', ar: 'eine ambivalente Entwicklung, gleichwohl, sich gewahr werden', de: 'eine ambivalente Entwicklung, gleichwohl, sich gewahr werden' },
  },
  c1_demography: {
    de: 'Diskutiere die Folgen des demografischen Wandels für die deutsche Sozialversicherung. Welche Maßnahmen hältst du für erforderlich?',
    titles: { en: 'Demographic change', fr: 'Changement démographique', ar: 'التحول الديموغرافي', de: 'Demografischer Wandel' },
    hint: { en: 'Überalterung, generationengerecht, struktureller Reformbedarf', fr: 'Überalterung, generationengerecht, struktureller Reformbedarf', ar: 'Überalterung, generationengerecht, struktureller Reformbedarf', de: 'Überalterung, generationengerecht, struktureller Reformbedarf' },
  },
  c1_freedom_security: {
    de: 'Wie lässt sich das Spannungsfeld zwischen Freiheit und Sicherheit im modernen Staat ausbalancieren? Begründe deine Position kritisch.',
    titles: { en: 'Freedom vs. security', fr: 'Liberté vs. sécurité', ar: 'الحرية مقابل الأمن', de: 'Freiheit & Sicherheit' },
    hint: { en: 'Grundrechte abwägen, ungeachtet dessen, einen Kompromiss erfordern', fr: 'Grundrechte abwägen, ungeachtet dessen, einen Kompromiss erfordern', ar: 'Grundrechte abwägen, ungeachtet dessen, einen Kompromiss erfordern', de: 'Grundrechte abwägen, ungeachtet dessen, einen Kompromiss erfordern' },
  },
  c1_globalisation: {
    de: 'Inwiefern profitieren Schwellenländer von der Globalisierung – und welche Risiken trägt sie? Erörtere mit fundierten Argumenten.',
    titles: { en: 'Globalisation\'s winners', fr: 'Globalisation et gagnants', ar: 'الفائزون من العولمة', de: 'Globalisierung' },
    hint: { en: 'Schwellenländer, Wertschöpfungskette, einseitige Abhängigkeit', fr: 'Schwellenländer, Wertschöpfungskette, einseitige Abhängigkeit', ar: 'Schwellenländer, Wertschöpfungskette, einseitige Abhängigkeit', de: 'Schwellenländer, Wertschöpfungskette, einseitige Abhängigkeit' },
  },
  c1_meritocracy: {
    de: 'Ist Leistung wirklich ein gerechtes Kriterium für sozialen Erfolg? Diskutiere kritisch unter Berücksichtigung struktureller Ungleichheiten.',
    titles: { en: 'Is meritocracy fair?', fr: 'La méritocratie est-elle juste ?', ar: 'هل الجدارة عادلة؟', de: 'Leistungsgerechtigkeit' },
    hint: { en: 'Chancengleichheit, soziale Mobilität, vermeintlich', fr: 'Chancengleichheit, soziale Mobilität, vermeintlich', ar: 'Chancengleichheit, soziale Mobilität, vermeintlich', de: 'Chancengleichheit, soziale Mobilität, vermeintlich' },
  },
  c1_arts_funding: {
    de: 'Sollte der Staat Kunst und Kultur stärker fördern, oder sollte sich Kultur am Markt selbst tragen? Begründe deine Position.',
    titles: { en: 'State funding for arts', fr: 'Financement public de l\'art', ar: 'دعم الدولة للفن', de: 'Kulturförderung' },
    hint: { en: 'kulturelle Vielfalt, marktwirtschaftlich, gemeinwohlorientiert', fr: 'kulturelle Vielfalt, marktwirtschaftlich, gemeinwohlorientiert', ar: 'kulturelle Vielfalt, marktwirtschaftlich, gemeinwohlorientiert', de: 'kulturelle Vielfalt, marktwirtschaftlich, gemeinwohlorientiert' },
  },
  c1_renewables: {
    de: 'Diskutiere die Energiewende in Deutschland: Welche Erfolge gibt es, welche Hindernisse bleiben? Welche politischen Maßnahmen wären sinnvoll?',
    titles: { en: 'Germany\'s energy transition', fr: 'Transition énergétique allemande', ar: 'التحول الطاقي الألماني', de: 'Energiewende' },
    hint: { en: 'erneuerbare Energien, Versorgungssicherheit, Netzausbau', fr: 'erneuerbare Energien, Versorgungssicherheit, Netzausbau', ar: 'erneuerbare Energien, Versorgungssicherheit, Netzausbau', de: 'erneuerbare Energien, Versorgungssicherheit, Netzausbau' },
  },
  c1_journalism: {
    de: 'Welche Rolle spielen Qualitätsmedien in einer Demokratie und wie wirken sich soziale Medien auf diese Rolle aus? Argumentiere differenziert.',
    titles: { en: 'Quality journalism', fr: 'Journalisme de qualité', ar: 'الصحافة الجادة', de: 'Qualitätsjournalismus' },
    hint: { en: 'vierte Gewalt, Filterblase, Diskursqualität', fr: 'vierte Gewalt, Filterblase, Diskursqualität', ar: 'vierte Gewalt, Filterblase, Diskursqualität', de: 'vierte Gewalt, Filterblase, Diskursqualität' },
  },
  c1_urban_rural: {
    de: 'Erörtere die wachsende Kluft zwischen Stadt und Land in entwickelten Ländern. Welche politischen Maßnahmen könnten Abhilfe schaffen?',
    titles: { en: 'Urban-rural divide', fr: 'Fracture ville-campagne', ar: 'الفجوة المدنية الريفية', de: 'Stadt-Land-Kluft' },
    hint: { en: 'strukturschwache Regionen, Daseinsvorsorge, Abwanderung', fr: 'strukturschwache Regionen, Daseinsvorsorge, Abwanderung', ar: 'strukturschwache Regionen, Daseinsvorsorge, Abwanderung', de: 'strukturschwache Regionen, Daseinsvorsorge, Abwanderung' },
  },
  c1_lifelong_learning: {
    de: 'Welche Bedeutung hat lebenslanges Lernen im 21. Jahrhundert? Welche Verantwortung tragen Staat, Arbeitgeber und Individuum?',
    titles: { en: 'Lifelong learning', fr: 'Apprentissage tout au long de la vie', ar: 'التعلّم مدى الحياة', de: 'Lebenslanges Lernen' },
    hint: { en: 'Wandel der Arbeitswelt, Eigenverantwortung, Weiterbildungsförderung', fr: 'Wandel der Arbeitswelt, Eigenverantwortung, Weiterbildungsförderung', ar: 'Wandel der Arbeitswelt, Eigenverantwortung, Weiterbildungsförderung', de: 'Wandel der Arbeitswelt, Eigenverantwortung, Weiterbildungsförderung' },
  },
}

const LOCALES = ['en', 'fr', 'ar', 'de']

for (const locale of LOCALES) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`)
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  const themes = {}
  for (const [id, t] of Object.entries(T)) {
    themes[id] = {
      title: t.titles[locale],
      // German instruction stays the same in every locale (it's what the
      // student must read in German), but a localised hint helps comprehension.
      instruction_de: t.de,
      instruction: locale === 'de' ? t.de : translateHelper(t.de, locale),
      hint: t.hint[locale],
    }
  }

  json.writingExercise = {
    ...UI[locale],
    themes,
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8')
  console.log(`✓ ${locale}.json — writingExercise namespace injected`)
}

// We don't need a real translation here — for non-DE locales we keep the
// German instruction (the student reads German, that's the point). The
// localised "title" + "hint" already give enough meta-information in the
// user's UI language. So this helper just returns the German verbatim.
function translateHelper(de, _locale) {
  return de
}
