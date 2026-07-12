// Interview Prep — question data for the Vorstellungsgespräch tool.
// 15 high-value questions across 6 categories. The German question text
// + the German sample answer live here (those are what the candidate
// actually says in the interview). All other text (translations, "why
// asked", tips) is i18n.

export type CategoryKey =
  | 'intro'
  | 'motivation'
  | 'strengths'
  | 'experience'
  | 'workplace'
  | 'goals'
  | 'logistics'
  | 'closing'

export type Difficulty = 1 | 2 | 3  // 1 = easy, 3 = tricky

/** Professional fields with their own technical question banks (Fachfragen). */
export type FieldKey =
  | 'pflege'
  | 'kfz'
  | 'elektro'
  | 'it'
  | 'gastro'
  | 'shk'
  | 'kaufmann'
  | 'logistik'
  | 'fahrer'
  | 'bau'
  | 'mfa'
  | 'baecker'

export type Question = {
  id: string
  category: CategoryKey
  difficulty: Difficulty
  /** Set on field-specific technical questions (Fachfragen). */
  field?: FieldKey
  /** The question as it'll be asked in the interview, in German. */
  questionDe: string
  /** Sample model answer in German — the candidate adapts/memorises this. */
  sampleAnswerDe: string
  /** Free preview (no login). After 3 free, rest needs login. */
  isFree?: boolean
}

export const QUESTIONS: Question[] = [
  // ── 1. Self-introduction & motivation ─────────────────────
  {
    id: 'tell_about_yourself',
    category: 'intro',
    difficulty: 1,
    isFree: true,
    questionDe: 'Erzählen Sie etwas über sich.',
    sampleAnswerDe:
      'Mein Name ist [Vorname] [Nachname], ich bin [Alter] Jahre alt und komme aus [Herkunftsland]. Ich habe mein Bac mit Schwerpunkt [Naturwissenschaften / Wirtschaft / etc.] abgeschlossen und in den letzten [X] Monaten intensiv Deutsch gelernt — aktuell bin ich auf dem Niveau [B1/B2]. Was mich an dieser Ausbildung als [Beruf] besonders reizt, ist [konkreter Aspekt: Kontakt mit Menschen / technische Tiefe / praktische Arbeit]. In meiner Freizeit [1 Hobby, das Eigeninitiative zeigt — Sport, Lesen, Programmieren]. Ich freue mich darauf, in Ihrem Unternehmen die Chance zu bekommen, Theorie und Praxis zu verbinden.',
  },
  {
    id: 'why_us',
    category: 'intro',
    difficulty: 2,
    isFree: true,
    questionDe: 'Warum haben Sie sich bei uns beworben?',
    sampleAnswerDe:
      'Ich habe mich bei [Firmenname] beworben, weil [zwei konkrete Gründe aus deren Website / Pressemitteilungen — z. B. Spezialisierung auf X, Schulungsprogramm Y, Standort Z]. Ihr Ruf für [konkrete Stärke des Unternehmens] passt sehr gut zu meinem Ziel, in einem Umfeld zu lernen, in dem [Ihr Lernziel]. Ich bin überzeugt, dass ich hier nicht nur eine Ausbildung mache, sondern eine Karriere starte.',
  },
  {
    id: 'why_germany',
    category: 'motivation',
    difficulty: 2,
    isFree: true,
    questionDe: 'Warum möchten Sie nach Deutschland kommen?',
    sampleAnswerDe:
      'Drei Gründe: Erstens, das duale Ausbildungssystem in Deutschland ist weltweit eines der besten — Theorie und bezahlte Praxis vom ersten Tag an. Zweitens, der Bedarf in [Branche] ist hoch und die Jobchancen sind nach der Ausbildung sehr stabil. Drittens, ich möchte die deutsche Arbeitskultur kennenlernen — Pünktlichkeit, Genauigkeit und Teamarbeit — Werte, die ich auch persönlich schätze. Deutschland ist für mich nicht nur ein Land, sondern ein konkretes berufliches Projekt.',
  },

  // ── 2. Strengths & weaknesses ─────────────────────────────
  {
    id: 'strengths_weaknesses',
    category: 'strengths',
    difficulty: 2,
    questionDe: 'Wo sehen Sie Ihre Stärken und Schwächen?',
    sampleAnswerDe:
      'Meine größte Stärke ist Zuverlässigkeit — wenn ich eine Aufgabe übernehme, halte ich Fristen ein und melde mich proaktiv, wenn etwas schiefläuft. Eine zweite Stärke ist Lernbereitschaft: ich habe in [X] Monaten Deutsch von A0 auf [B1/B2] gebracht, das zeigt meine Disziplin. Eine Schwäche, an der ich aktiv arbeite, ist, dass ich manchmal zu detailorientiert bin und Aufgaben zu lange optimiere. Ich habe gelernt, mir Zeitlimits zu setzen und das Detail dann loszulassen, wenn das Ergebnis gut genug ist.',
  },
  {
    id: 'mistake',
    category: 'experience',
    difficulty: 3,
    questionDe: 'Erzählen Sie mir über einen Fehler, den Sie gemacht haben.',
    sampleAnswerDe:
      'Während meines Praktikums habe ich einmal vergessen, einer Kundin eine wichtige Bestätigungs-E-Mail zu senden. Sie hat angerufen, war verärgert. Ich habe mich sofort entschuldigt, das Problem gelöst, und seitdem führe ich eine tägliche Checkliste mit allen offenen Kommunikationen. Aus diesem Fehler habe ich zwei Dinge gelernt: erstens, wie wichtig systematische Organisation ist; zweitens, dass schnelles, ehrliches Eingeständnis von Fehlern Vertrauen wiederherstellt — die Kundin hat später sogar positiv über meine Reaktion gesprochen.',
  },
  {
    id: 'what_sets_you_apart',
    category: 'strengths',
    difficulty: 2,
    questionDe: 'Was unterscheidet Sie von anderen Bewerbern?',
    sampleAnswerDe:
      'Drei Dinge. Erstens: Ich spreche [Arabisch, Französisch und Deutsch] — das ist ein konkreter Mehrwert, wenn Sie internationale Kunden oder Partner haben. Zweitens: Ich habe meine eigene Migration nach Deutschland organisiert — Visum, Wohnen, Sprache — das beweist Eigeninitiative und Durchhaltevermögen. Drittens: Ich komme nicht zufällig in diese Branche, ich habe mich bewusst entschieden und mich seit [X] Monaten konkret darauf vorbereitet.',
  },

  // ── 3. Workplace situations ───────────────────────────────
  {
    id: 'stress',
    category: 'workplace',
    difficulty: 2,
    questionDe: 'Wie gehen Sie mit Stress um?',
    sampleAnswerDe:
      'Ich gehe ruhig und systematisch mit Stress um. Mein Ansatz: erst priorisieren — was ist dringend, was wichtig, was kann warten. Dann eine Aufgabe nach der anderen, ohne mich von der Gesamtmenge überwältigen zu lassen. Wenn ich merke, dass eine Frist nicht zu halten ist, kommuniziere ich das früh, nicht im letzten Moment. Stress ist für mich ein Signal, das System zu verbessern, nicht eine Ausrede, schlechter zu arbeiten.',
  },
  {
    id: 'criticism',
    category: 'workplace',
    difficulty: 2,
    questionDe: 'Wie reagieren Sie auf Kritik?',
    sampleAnswerDe:
      'Konstruktive Kritik nehme ich sehr gerne an — sie ist die schnellste Art zu lernen. Mein Prozess: zuerst zuhören, ohne mich sofort zu verteidigen. Dann nachfragen, wenn etwas nicht klar ist. Und schließlich konkrete Schritte überlegen, was ich beim nächsten Mal anders mache. Wenn die Kritik nicht ganz fair erscheint, frage ich respektvoll nach Beispielen, statt zu widersprechen — meistens lerne ich auch dann etwas.',
  },
  {
    id: 'team_or_alone',
    category: 'workplace',
    difficulty: 1,
    questionDe: 'Arbeiten Sie lieber allein oder im Team?',
    sampleAnswerDe:
      'Beides hat seinen Platz. Im Team profitiere ich von verschiedenen Perspektiven und kann von erfahreneren Kolleginnen und Kollegen lernen — gerade in der Ausbildung ist das entscheidend. Wenn ich allein arbeite, kann ich mich konzentrieren und Aufgaben gründlich abarbeiten. Was mir wichtig ist: in einem Team mein Versprechen halten und allein nicht in Isolation kippen — also bei Fragen früh genug nachfragen.',
  },
  {
    id: 'overtime',
    category: 'workplace',
    difficulty: 2,
    questionDe: 'Wären Sie bereit, an Wochenenden oder mehr als 40 Stunden zu arbeiten?',
    sampleAnswerDe:
      'Ja, in Phasen mit hoher Arbeitslast oder wenn das Team es braucht, bin ich gerne bereit, zusätzlich zu arbeiten. Mir ist wichtig, dass das Team und der Kunde am Ende zufrieden sind. Gleichzeitig glaube ich, dass dauerhafte Überstunden ein Zeichen für ein Organisationsproblem sind — also würde ich auch versuchen, mit dem Team zu schauen, wie man Spitzenzeiten besser plant.',
  },

  // ── 4. Goals & vision ─────────────────────────────────────
  {
    id: 'five_years',
    category: 'goals',
    difficulty: 2,
    questionDe: 'Wo sehen Sie sich in fünf Jahren?',
    sampleAnswerDe:
      'In fünf Jahren möchte ich meine Ausbildung erfolgreich abgeschlossen und ein bis zwei Jahre in dem Beruf gearbeitet haben — idealerweise hier bei Ihnen, wenn die Möglichkeit besteht. Mein Ziel ist, [konkrete Spezialisierung in der Branche] zu vertiefen und mich vielleicht zum [Meister / Techniker / Fachwirt] weiterzubilden. Ich möchte auf der menschlichen Ebene Verantwortung übernehmen — kleinere Auszubildende mit anleiten, Projekte führen.',
  },
  {
    id: 'why_this_field',
    category: 'motivation',
    difficulty: 2,
    questionDe: 'Warum haben Sie sich für diese Branche entschieden?',
    sampleAnswerDe:
      'Ich habe diese Branche bewusst gewählt, nicht zufällig. Erstens, [konkretes persönliches Erlebnis oder Erfahrung mit dem Beruf]. Zweitens, ich habe [X] Monate lang Beiträge auf [LinkedIn / YouTube-Kanäle / Blog] verfolgt und gemerkt, dass mich die [konkrete Aufgabenfeld] wirklich interessieren. Drittens, der Beruf hat eine starke Zukunft in Deutschland — der Bedarf wächst stetig. Diese Kombination — persönliches Interesse plus stabile Perspektive — hat mich überzeugt.',
  },

  // ── 5. Logistics ──────────────────────────────────────────
  {
    id: 'salary',
    category: 'logistics',
    difficulty: 3,
    questionDe: 'Was ist Ihre Gehaltsvorstellung?',
    sampleAnswerDe:
      'Da es sich um eine Ausbildung handelt, bin ich mit der branchenüblichen Vergütung nach Tarif einverstanden — ich habe gesehen, dass diese im ersten Jahr typischerweise zwischen [X] und [Y] € brutto liegt. Mir ist die Qualität der Ausbildung und die Übernahmechance wichtiger als der genaue Anfangsbetrag. Wenn Sie ein konkretes Angebot machen, freue ich mich, darüber zu sprechen.',
  },
  {
    id: 'relocate',
    category: 'logistics',
    difficulty: 1,
    questionDe: 'Sind Sie umzugsbereit?',
    sampleAnswerDe:
      'Ja, absolut. Ich plane sowieso einen kompletten Umzug nach Deutschland für die Ausbildung, das ist also kein Hindernis, sondern Teil meines Plans. Ich habe mich bereits über [Stadt] informiert — Wohnviertel, öffentliche Verkehrsmittel, Lebenshaltungskosten — und bin flexibel.',
  },

  // ── 5b. International candidates ──────────────────────────
  {
    id: 'intl_visum',
    category: 'logistics',
    difficulty: 2,
    questionDe: 'Wie ist Ihr aktueller Aufenthaltsstatus? Brauchen Sie ein Visum?',
    sampleAnswerDe:
      'Ich bin aktuell in [Herkunftsland] und brauche das Visum zur Berufsausbildung nach §16a. Ich habe mich bereits genau informiert: Sobald ich einen unterschriebenen Ausbildungsvertrag habe, reiche ich den Antrag bei der deutschen Botschaft ein — mit Sprachnachweis [B1/B2], Finanzierungsnachweis und dem Vertrag. Der Prozess dauert erfahrungsgemäß [6–12] Wochen. Ich kümmere mich vollständig selbst darum; von Ihnen brauche ich nur den Vertrag und eventuell eine kurze Bestätigung für die Botschaft.',
  },
  {
    id: 'intl_umzug',
    category: 'logistics',
    difficulty: 2,
    questionDe: 'Wie stellen Sie sich den Umzug nach Deutschland konkret vor?',
    sampleAnswerDe:
      'Ich habe einen konkreten Plan. Nach der Visumserteilung reise ich [2–4] Wochen vor Ausbildungsbeginn ein, damit ich Zeit für Anmeldung, Bankkonto und Krankenkasse habe. Für die erste Zeit suche ich ein möbliertes Zimmer oder ein WG-Zimmer in [Stadt] — ich schaue bereits jetzt auf den üblichen Portalen. Finanziell habe ich Rücklagen für die ersten Monate, zusätzlich zur Ausbildungsvergütung. Mein Ziel ist, am ersten Arbeitstag vollständig angekommen und einsatzbereit zu sein.',
  },
  {
    id: 'intl_familie',
    category: 'motivation',
    difficulty: 1,
    questionDe: 'Was sagt Ihre Familie dazu, dass Sie nach Deutschland gehen?',
    sampleAnswerDe:
      'Meine Familie unterstützt meine Entscheidung voll. Wir haben das gemeinsam besprochen — sie wissen, dass die Ausbildung in Deutschland eine echte Perspektive ist, die es so in [Herkunftsland] nicht gibt. Natürlich werden wir uns vermissen, aber wir telefonieren regelmäßig, und mit den heutigen Möglichkeiten ist der Kontakt einfach. Diese Unterstützung gibt mir Stabilität: Ich gehe nicht weg von etwas, sondern hin zu einem klaren Ziel.',
  },
  {
    id: 'intl_heimweh',
    category: 'motivation',
    difficulty: 2,
    questionDe: 'Was machen Sie, wenn Sie Heimweh bekommen?',
    sampleAnswerDe:
      'Ich nehme die Frage ernst, denn Heimweh ist normal — besonders in den ersten Monaten. Mein Plan dagegen hat drei Teile: Erstens, eine feste Routine — Arbeit, Sport, Deutsch lernen — die mir Struktur gibt. Zweitens, aktiv Kontakte aufbauen: Kollegen, Vereine, andere Azubis. Drittens, regelmäßiger Kontakt nach Hause, ohne darin zu versinken. Ich habe schon einmal [längere Zeit allein / im Ausland / im Internat] gelebt und weiß, dass ich nach einigen Wochen ankomme.',
  },

  // ── 6. Closing ────────────────────────────────────────────
  {
    id: 'questions_for_us',
    category: 'closing',
    difficulty: 2,
    questionDe: 'Haben Sie noch Fragen an uns?',
    sampleAnswerDe:
      'Ja, drei Fragen, wenn ich darf. Erstens: Wie sieht ein typischer erster Monat in der Ausbildung bei Ihnen aus? Zweitens: Welche Eigenschaften haben die Auszubildenden, die bei Ihnen am erfolgreichsten waren? Drittens: Wie ist die Übernahmequote nach der Ausbildung? — Diese Fragen helfen mir zu verstehen, wie ich mich am besten vorbereiten kann und was Sie von mir erwarten.',
  },
]

export const CATEGORY_ICON: Record<CategoryKey, string> = {
  intro:       '👋',
  motivation:  '🎯',
  strengths:   '💪',
  experience:  '🎓',
  workplace:   '🤝',
  goals:       '🚀',
  logistics:   '📦',
  closing:     '🎬',
}

export const CATEGORY_ORDER: CategoryKey[] = [
  'intro', 'motivation', 'strengths', 'experience', 'workplace', 'goals', 'logistics', 'closing',
]

export const FREE_LIMIT = 3 // first N questions revealed without login

// ═══════════════════════════════════════════════════════════
// Field-specific technical questions (Fachfragen) — 5 per field
// for the 8 professions with the most Ausbildung demand. The
// interviewer isn't testing expert knowledge at Azubi level; these
// answers show realistic motivation + basic understanding.
// ═══════════════════════════════════════════════════════════

export const FIELD_QUESTIONS: Question[] = [
  // ── Pflege (care / healthcare) ─────────────────────────────
  {
    id: 'pflege_gute_pflege',
    category: 'motivation',
    field: 'pflege',
    difficulty: 2,
    questionDe: 'Was bedeutet für Sie gute Pflege?',
    sampleAnswerDe:
      'Gute Pflege bedeutet für mich, den Menschen als Ganzes zu sehen — nicht nur die Krankheit. Konkret: die Würde des Patienten respektieren, auch bei intimen Aufgaben; genau beobachten und Veränderungen ans Team melden; und zuhören, denn viele Patienten brauchen das Gespräch genauso wie die Behandlung. Gute Pflege ist außerdem Teamarbeit — eine gute Übergabe an die nächste Schicht ist genauso wichtig wie die Arbeit am Bett.',
  },
  {
    id: 'pflege_dementer_patient',
    category: 'workplace',
    field: 'pflege',
    difficulty: 3,
    questionDe: 'Wie würden Sie mit einem verwirrten oder dementen Patienten umgehen?',
    sampleAnswerDe:
      'Ruhig, geduldig und auf Augenhöhe. Ich würde langsam und in einfachen Sätzen sprechen, Blickkontakt halten und dem Patienten nicht widersprechen, wenn er in seiner eigenen Realität ist — Widerspruch erzeugt nur Angst. Wichtig ist, Sicherheit zu geben: sich vorstellen, erklären, was ich tue, feste Routinen respektieren. Und wenn eine Situation schwierig wird, hole ich rechtzeitig eine erfahrene Kollegin dazu, statt allein weiterzumachen — als Azubi ist Fragen keine Schwäche.',
  },
  {
    id: 'pflege_hygiene',
    category: 'experience',
    field: 'pflege',
    difficulty: 2,
    questionDe: 'Warum ist Hygiene in der Pflege so wichtig?',
    sampleAnswerDe:
      'Weil Patienten oft ein geschwächtes Immunsystem haben — eine Infektion, die für mich harmlos wäre, kann für sie lebensgefährlich sein. Deshalb ist Händedesinfektion vor und nach jedem Patientenkontakt die wichtigste einzelne Maßnahme. Dazu kommen Handschuhe und Schutzkleidung bei bestimmten Tätigkeiten und die richtige Aufbereitung von Materialien. Ich weiß, dass es dafür feste Standards gibt, und genau das schätze ich: In der Pflege gibt es klare Regeln, die Leben schützen.',
  },
  {
    id: 'pflege_schichtdienst',
    category: 'logistics',
    field: 'pflege',
    difficulty: 2,
    questionDe: 'Wie stehen Sie zu Schichtdienst, Nachtdiensten und Wochenendarbeit?',
    sampleAnswerDe:
      'Ich habe mich bewusst für die Pflege entschieden und weiß, dass Kranke nicht nur werktags von 8 bis 17 Uhr versorgt werden müssen — Schichtdienst gehört zum Beruf. Ich bin [Alter] Jahre alt, gesund und habe keine Verpflichtungen, die dagegen sprechen. Ich plane, mit festen Schlafroutinen und guter Organisation damit umzugehen. Und ehrlich gesagt: freie Tage unter der Woche haben auch Vorteile — Behörden, Arzt, Einkaufen ohne Stress.',
  },
  {
    id: 'pflege_belastung',
    category: 'strengths',
    field: 'pflege',
    difficulty: 3,
    questionDe: 'Pflege kann emotional sehr belastend sein. Wie gehen Sie damit um?',
    sampleAnswerDe:
      'Ich mache mir keine Illusionen — ich werde Leid und auch Sterben erleben. Drei Dinge helfen mir: Erstens, professionelle Distanz lernen — mitfühlend sein, ohne jedes Schicksal mit nach Hause zu nehmen. Zweitens, im Team sprechen: Übergaben und kollegiale Gespräche sind auch emotionale Ventile. Drittens, ein stabiles Privatleben mit Sport und festen Kontakten. Und ich weiß, dass es Supervision und Ansprechpartner gibt, wenn etwas zu schwer wird — die würde ich nutzen.',
  },

  // ── KFZ-Mechatronik ────────────────────────────────────────
  {
    id: 'kfz_erfahrung',
    category: 'experience',
    field: 'kfz',
    difficulty: 1,
    questionDe: 'Haben Sie schon einmal praktisch an einem Auto gearbeitet?',
    sampleAnswerDe:
      'Ja — ich habe [bei meinem Onkel in der Werkstatt geholfen / an meinem eigenen Auto gearbeitet / ein Praktikum gemacht]. Konkret habe ich [Ölwechsel, Bremsbeläge, Reifenwechsel, Batterie] gemacht. Dabei habe ich gelernt, sauber und systematisch zu arbeiten: erst die Ursache verstehen, dann reparieren, am Ende prüfen. Mir ist klar, dass die Ausbildung viel tiefer geht — genau deshalb will ich sie machen: Ich will nicht nur schrauben, sondern verstehen, warum.',
  },
  {
    id: 'kfz_motor',
    category: 'experience',
    field: 'kfz',
    difficulty: 2,
    questionDe: 'Was ist der Unterschied zwischen einem Benzin- und einem Dieselmotor?',
    sampleAnswerDe:
      'Der Hauptunterschied ist die Zündung: Beim Benzinmotor zündet eine Zündkerze das Kraftstoff-Luft-Gemisch. Beim Diesel gibt es keine Zündkerze — die Luft wird so stark verdichtet, dass sie sehr heiß wird, und der eingespritzte Diesel entzündet sich selbst. Deshalb hat der Diesel eine höhere Verdichtung, mehr Drehmoment und verbraucht weniger — dafür ist er schwerer und die Abgasreinigung aufwendiger. Ich habe die Grundlagen aus [YouTube-Kanälen / Büchern] gelernt und freue mich darauf, das in der Praxis zu vertiefen.',
  },
  {
    id: 'kfz_elektro',
    category: 'goals',
    field: 'kfz',
    difficulty: 2,
    questionDe: 'Was wissen Sie über Elektroautos, und wie verändert das den Beruf?',
    sampleAnswerDe:
      'Elektroautos haben statt Verbrennungsmotor eine Batterie, einen oder mehrere Elektromotoren und Leistungselektronik. Für den Beruf bedeutet das: weniger klassische Motorarbeit, dafür Hochvolt-Technik, Diagnose mit Software und Batteriemanagement. Man darf an Hochvolt-Systemen nur mit spezieller Schulung arbeiten. Genau das finde ich spannend — ich fange den Beruf in dem Moment an, in dem er sich neu erfindet, und will beide Welten beherrschen: Verbrenner und Elektro.',
  },
  {
    id: 'kfz_diagnose',
    category: 'workplace',
    field: 'kfz',
    difficulty: 2,
    questionDe: 'Ein Kunde sagt nur: „Das Auto macht komische Geräusche." Wie gehen Sie vor?',
    sampleAnswerDe:
      'Systematisch. Zuerst gezielte Fragen stellen: Wann tritt das Geräusch auf — beim Bremsen, Lenken, bei bestimmter Geschwindigkeit? Seit wann? Dann eine Probefahrt oder Sichtprüfung, um das Geräusch selbst einzugrenzen, und das Diagnosegerät anschließen. Wichtig ist, nicht zu raten und nicht einfach Teile zu tauschen, sondern die Ursache zu finden. Als Azubi würde ich meine Vermutung dem Gesellen vorstellen und gemeinsam prüfen — so lerne ich, und der Kunde bekommt eine saubere Diagnose.',
  },
  {
    id: 'kfz_sicherheit',
    category: 'workplace',
    field: 'kfz',
    difficulty: 1,
    questionDe: 'Warum ist Arbeitssicherheit in der Werkstatt so wichtig?',
    sampleAnswerDe:
      'Weil in der Werkstatt echte Gefahren existieren: Fahrzeuge auf der Hebebühne, heiße Teile, schwere Lasten, Chemikalien und bei modernen Autos Hochvolt-Systeme. Sicherheitsregeln — Sicherheitsschuhe, Schutzbrille, gesicherte Hebebühne, saubere Arbeitsplätze — schützen mich und die Kollegen. Ich nehme das ernst: Ein Unfall kann eine Karriere beenden, bevor sie anfängt. Regeln zu respektieren zeigt außerdem Professionalität — genau das erwarte ich von mir selbst.',
  },

  // ── Elektronik ─────────────────────────────────────────────
  {
    id: 'elektro_gefahren',
    category: 'workplace',
    field: 'elektro',
    difficulty: 2,
    questionDe: 'Welche Gefahren gibt es bei der Arbeit mit Strom, und wie schützt man sich?',
    sampleAnswerDe:
      'Die größte Gefahr ist der Stromschlag — schon kleine Ströme durch den Körper können tödlich sein, dazu kommen Lichtbögen und Brandgefahr. Deshalb gelten die fünf Sicherheitsregeln, die ich kenne: freischalten, gegen Wiedereinschalten sichern, Spannungsfreiheit feststellen, erden und kurzschließen, benachbarte Teile abdecken. Als Azubi arbeite ich nie allein an spannungsführenden Teilen und frage lieber einmal zu viel als einmal zu wenig. Elektrotechnik verzeiht keine Nachlässigkeit — das respektiere ich.',
  },
  {
    id: 'elektro_grundlagen',
    category: 'experience',
    field: 'elektro',
    difficulty: 2,
    questionDe: 'Können Sie mir den Unterschied zwischen Spannung, Strom und Widerstand erklären?',
    sampleAnswerDe:
      'Gerne mit einem Bild: Spannung (Volt) ist wie der Druck im Wasserrohr — sie treibt an. Strom (Ampere) ist die Menge, die tatsächlich fließt. Widerstand (Ohm) ist alles, was den Fluss bremst — wie ein enges Rohr. Das Ohmsche Gesetz verbindet die drei: U = R × I. Wenn ich die Spannung erhöhe und der Widerstand gleich bleibt, fließt mehr Strom. Diese Grundlagen habe ich [in der Schule / im Selbststudium] gelernt und übe regelmäßig mit Aufgaben.',
  },
  {
    id: 'elektro_erfahrung',
    category: 'experience',
    field: 'elektro',
    difficulty: 1,
    questionDe: 'Haben Sie schon praktische Erfahrung mit Elektrotechnik?',
    sampleAnswerDe:
      'Ja, im kleinen Rahmen: Ich habe [Lampen und Steckdosen unter Aufsicht montiert / mit Arduino-Bausätzen experimentiert / in der Schule Schaltungen gelötet]. Dabei habe ich gelernt, einen Schaltplan zu lesen und sauber zu arbeiten — jedes Kabel richtig abisolieren, jede Klemme fest. Mir ist bewusst, dass Hausinstallation in Deutschland nur vom Fachmann gemacht werden darf; genau deshalb will ich es richtig lernen, von der Pike auf.',
  },
  {
    id: 'elektro_mathe',
    category: 'strengths',
    field: 'elektro',
    difficulty: 2,
    questionDe: 'Wie gut sind Sie in Mathematik und Physik?',
    sampleAnswerDe:
      'Solide — in der Schule hatte ich in Mathe [Note], und die Bereiche, die für den Beruf wichtig sind, beherrsche ich sicher: Bruchrechnung, Prozentrechnung, Formeln umstellen, Grundlagen der Elektrizitätslehre. Wo ich Lücken hatte, habe ich gezielt nachgearbeitet, zum Beispiel mit [Online-Kursen / Übungsheften]. Ich weiß, dass die Berufsschule Fachrechnen verlangt, und habe keine Angst davor — Rechnen ist Übungssache, und ich übe.',
  },
  {
    id: 'elektro_zukunft',
    category: 'motivation',
    field: 'elektro',
    difficulty: 1,
    questionDe: 'Warum hat der Elektroberuf Ihrer Meinung nach Zukunft?',
    sampleAnswerDe:
      'Weil fast jede große Veränderung in Deutschland über Elektrotechnik läuft: die Energiewende mit Photovoltaik und Speichern, Wärmepumpen statt Ölheizungen, Ladesäulen für E-Autos, Smart-Home und Gebäudeautomation. Überall fehlen Fachkräfte — die Betriebe haben volle Auftragsbücher. Für mich heißt das: sichere Arbeit, gute Bezahlung und ständig neue Technik. Ich will nicht irgendeinen Beruf, sondern einen, der die nächsten 30 Jahre gebraucht wird.',
  },

  // ── IT / Fachinformatik ────────────────────────────────────
  {
    id: 'it_projekte',
    category: 'experience',
    field: 'it',
    difficulty: 2,
    questionDe: 'Haben Sie schon eigene IT-Projekte umgesetzt?',
    sampleAnswerDe:
      'Ja. Mein größtes Projekt ist [eine kleine Website / ein Python-Skript, das X automatisiert / ein Discord-Bot]. Ich habe es von der Idee bis zum fertigen Ergebnis allein umgesetzt: geplant, gebaut, Fehler gesucht, verbessert. Dabei habe ich gelernt, dass der schwierigste Teil nicht das Schreiben von Code ist, sondern das saubere Eingrenzen von Fehlern. Den Code kann ich gern zeigen — er liegt auf [GitHub]. Ich will in der Ausbildung lernen, wie man solche Projekte professionell und im Team macht.',
  },
  {
    id: 'it_sprachen',
    category: 'experience',
    field: 'it',
    difficulty: 1,
    questionDe: 'Welche Programmiersprachen oder Technologien kennen Sie?',
    sampleAnswerDe:
      'Am sichersten bin ich in [Python / JavaScript] — damit habe ich [konkrete Beispiele] gebaut. Grundkenntnisse habe ich in [HTML/CSS, SQL, Linux-Grundlagen]. Ich lerne gerade [Sprache/Technologie], weil [Grund]. Mir ist wichtig zu sagen: Ich halte mich nicht für einen Experten — ich habe eine solide Basis und vor allem gelernt, wie man Neues selbstständig lernt: Dokumentation lesen, kleine Projekte bauen, Fehler recherchieren. Genau diese Fähigkeit ist in der IT wichtiger als jede einzelne Sprache.',
  },
  {
    id: 'it_problem',
    category: 'workplace',
    field: 'it',
    difficulty: 2,
    questionDe: 'Ein Rechner startet nicht mehr. Wie gehen Sie systematisch vor?',
    sampleAnswerDe:
      'Vom Einfachen zum Komplizierten. Zuerst die Basics: Strom da? Kabel fest? Monitor an? Dann eingrenzen: Piept oder leuchtet etwas — also Hardware-Signal? Startet das BIOS, hängt es beim Betriebssystem? Je nach Symptom prüfe ich RAM, Festplatte oder Netzteil beziehungsweise starte im abgesicherten Modus. Wichtig: nach jedem Schritt nur eine Sache ändern und das Ergebnis notieren, sonst weiß ich nie, was geholfen hat. Und vor jedem Eingriff klären, ob die Daten gesichert sind.',
  },
  {
    id: 'it_lernen',
    category: 'goals',
    field: 'it',
    difficulty: 2,
    questionDe: 'IT verändert sich ständig. Wie bleiben Sie auf dem Laufenden?',
    sampleAnswerDe:
      'Mit einer festen Routine: Ich folge [Tech-Newslettern / YouTube-Kanälen / Blogs] und probiere Neues direkt in kleinen Projekten aus — nur lesen bringt in der IT wenig, man muss es bauen. Aktuell beschäftige ich mich zum Beispiel mit [KI-Tools / Docker / einem Framework]. Gleichzeitig versuche ich, mich nicht von jedem Trend ablenken zu lassen, sondern erst die Grundlagen zu beherrschen: Netzwerke, Datenbanken, ein Betriebssystem richtig verstehen. Trends kommen und gehen, Grundlagen bleiben.',
  },
  {
    id: 'it_teamarbeit',
    category: 'workplace',
    field: 'it',
    difficulty: 1,
    questionDe: 'Viele denken, Programmierer arbeiten allein. Wie sehen Sie das?',
    sampleAnswerDe:
      'Das Klischee stimmt nicht — gute Software entsteht im Team. Code wird von Kollegen gelesen und geprüft, Anforderungen kommen von Menschen, und die schwierigsten Probleme löst man im Gespräch. Ich schreibe zwar gern konzentriert allein Code, aber ich weiß: verständlich kommunizieren, Fragen stellen, Code so schreiben, dass andere ihn verstehen — das macht den Unterschied zwischen einem Hobby-Programmierer und einem Profi. Genau das will ich in der Ausbildung lernen.',
  },

  // ── Hotel & Gastronomie ────────────────────────────────────
  {
    id: 'gastro_stress',
    category: 'workplace',
    field: 'gastro',
    difficulty: 2,
    questionDe: 'Freitagabend, volles Restaurant, drei Tische rufen gleichzeitig. Was machen Sie?',
    sampleAnswerDe:
      'Ruhe bewahren und priorisieren. Kurzer Blickkontakt zu allen drei Tischen mit einem „Ich bin gleich bei Ihnen" — das gewinnt Zeit und zeigt, dass sie gesehen werden. Dann in sinnvoller Reihenfolge: erst das Dringende (Rechnung, Reklamation), dann Bestellungen, und auf dem Weg Dinge kombinieren — nie mit leeren Händen laufen. Wenn es wirklich zu viel wird, kurz das Team informieren statt unterzugehen. Stress gehört zur Gastronomie; entscheidend ist, freundlich und organisiert zu bleiben.',
  },
  {
    id: 'gastro_gast',
    category: 'workplace',
    field: 'gastro',
    difficulty: 3,
    questionDe: 'Ein Gast beschwert sich, das Essen sei kalt. Wie reagieren Sie?',
    sampleAnswerDe:
      'Zuerst ehrlich entschuldigen — ohne Diskussion und ohne Schuldzuweisung an die Küche. Dann sofort eine Lösung anbieten: das Gericht neu und heiß bringen lassen, und die Küche direkt informieren. Danach beim Chef oder der Schichtleitung melden, ob wir dem Gast etwas anbieten — einen Espresso, ein Dessert. Wichtig ist die Haltung: Eine gut gelöste Beschwerde macht Gäste oft loyaler als ein Abend ganz ohne Probleme. Der Gast soll gehen und denken: Die haben das professionell gelöst.',
  },
  {
    id: 'gastro_zeiten',
    category: 'logistics',
    field: 'gastro',
    difficulty: 2,
    questionDe: 'In der Gastronomie arbeitet man abends, am Wochenende und an Feiertagen. Passt das zu Ihnen?',
    sampleAnswerDe:
      'Ja — das war mir bei der Berufswahl völlig klar. Die Gastronomie lebt genau dann, wenn andere frei haben; wer das nicht akzeptiert, hat den falschen Beruf gewählt. Ich bin flexibel, habe keine Verpflichtungen, die dagegen sprechen, und sehe auch die Vorteile: freie Tage unter der Woche und Trinkgeld an starken Abenden. Wichtig ist mir nur ein fairer Dienstplan im Team — und den bespricht man, wenn man zuverlässig ist und selbst aushilft, wenn es brennt.',
  },
  {
    id: 'gastro_erfahrung',
    category: 'experience',
    field: 'gastro',
    difficulty: 1,
    questionDe: 'Haben Sie schon in der Gastronomie oder im Service gearbeitet?',
    sampleAnswerDe:
      'Ja, ich habe [im Café meiner Familie / als Aushilfe im Restaurant / bei Festen und Veranstaltungen] gearbeitet. Dabei habe ich das Wichtigste gelernt: Der Gast merkt sofort, ob man aufmerksam ist. Ich habe Bestellungen aufgenommen, serviert, kassiert und auch stressige Abende erlebt. Was mir dabei am meisten Spaß gemacht hat: der Moment, wenn Gäste zufrieden gehen und sich bedanken. Diese Grunderfahrung will ich jetzt mit einer richtigen Ausbildung professionalisieren.',
  },
  {
    id: 'gastro_service',
    category: 'motivation',
    field: 'gastro',
    difficulty: 2,
    questionDe: 'Was bedeutet für Sie guter Service?',
    sampleAnswerDe:
      'Guter Service ist aufmerksam, ohne aufdringlich zu sein. Konkret: Gäste freundlich empfangen, Wünsche erkennen, bevor sie ausgesprochen werden — ein leeres Glas sehen, bevor der Gast winken muss. Dazu Produktkenntnis: Ich sollte jede Frage zur Karte beantworten können, auch zu Allergenen. Und Konstanz: freundlich auch am Ende einer langen Schicht, auch beim schwierigen Gast. Am Ende geht es um ein Gefühl — der Gast soll sich willkommen fühlen und wiederkommen wollen.',
  },

  // ── SHK / Anlagenmechanik ──────────────────────────────────
  {
    id: 'shk_interesse',
    category: 'motivation',
    field: 'shk',
    difficulty: 1,
    questionDe: 'Warum interessieren Sie sich ausgerechnet für den SHK-Beruf?',
    sampleAnswerDe:
      'Aus drei Gründen. Erstens: Es ist ein Beruf mit sichtbarem Ergebnis — am Ende des Tages funktioniert eine Heizung oder ein Bad, das vorher nicht funktioniert hat. Zweitens: Die Branche steht im Zentrum der Energiewende — Wärmepumpen, Solarthermie, effiziente Systeme; Betriebe suchen händeringend Nachwuchs. Drittens: Ich arbeite gern mit den Händen und mit dem Kopf zusammen — Anlagen verstehen, planen, montieren. Diese Mischung finde ich in kaum einem anderen Beruf.',
  },
  {
    id: 'shk_heizung',
    category: 'experience',
    field: 'shk',
    difficulty: 2,
    questionDe: 'Was wissen Sie über moderne Heizsysteme, zum Beispiel Wärmepumpen?',
    sampleAnswerDe:
      'Eine Wärmepumpe funktioniert wie ein umgekehrter Kühlschrank: Sie entzieht der Außenluft, dem Erdreich oder dem Grundwasser Wärme und bringt sie über einen Kältemittelkreislauf mit Verdichter auf Heiztemperatur. Sie braucht Strom, erzeugt daraus aber ein Mehrfaches an Wärme. Wärmepumpen ersetzen zunehmend Öl- und Gasheizungen, besonders mit Fußbodenheizung sind sie effizient. Ich habe mich über [Videos / Herstellerseiten] eingelesen, weil ich verstehen wollte, womit ich die nächsten Jahrzehnte arbeiten werde.',
  },
  {
    id: 'shk_koerperlich',
    category: 'strengths',
    field: 'shk',
    difficulty: 2,
    questionDe: 'Die Arbeit ist körperlich anstrengend — Keller, Baustellen, schwere Teile. Sind Sie darauf vorbereitet?',
    sampleAnswerDe:
      'Ja. Ich bin körperlich fit — ich [treibe regelmäßig Sport / habe schon körperlich gearbeitet] und weiß, wie sich ein langer Arbeitstag anfühlt. Mir ist klar, dass der Beruf Knien, Heben und enge Räume bedeutet, nicht nur saubere Montage. Wichtig finde ich, von Anfang an richtig zu arbeiten: Hebetechniken, Knieschoner, Werkzeuge benutzen statt Kraft — damit ich den Beruf auch mit 50 noch ausüben kann. Anstrengung schreckt mich nicht ab; sie gehört für mich zu einem echten Handwerk dazu.',
  },
  {
    id: 'shk_kunde',
    category: 'workplace',
    field: 'shk',
    difficulty: 2,
    questionDe: 'Sie arbeiten beim Kunden zu Hause. Wie verhalten Sie sich dort?',
    sampleAnswerDe:
      'Respektvoll und professionell — ich bin Gast im Zuhause eines Menschen. Konkret heißt das: pünktlich kommen, sich vorstellen, Schuhe oder Überzieher benutzen, den Arbeitsbereich mit Vlies abdecken und am Ende sauberer verlassen, als ich ihn vorgefunden habe. Dazu klar kommunizieren: erklären, was ich mache, wie lange es dauert, und keine Versprechen machen, die ich nicht halten kann — bei Fachfragen verweise ich als Azubi auf den Gesellen. Der Eindruck beim Kunden entscheidet über den Ruf des Betriebs.',
  },
  {
    id: 'shk_handwerk',
    category: 'experience',
    field: 'shk',
    difficulty: 1,
    questionDe: 'Haben Sie schon einmal handwerklich gearbeitet?',
    sampleAnswerDe:
      'Ja — ich habe [zu Hause renoviert / bei meinem Vater auf Baustellen geholfen / ein Praktikum gemacht]. Dabei habe ich [Rohre verlegt, Fliesen geschnitten, Möbel montiert, mit Bohrmaschine und Schleifer gearbeitet]. Zwei Dinge habe ich dabei über mich gelernt: Ich habe Geduld für präzise Arbeit, und ich gebe nicht auf, wenn etwas beim ersten Mal nicht passt. Werkzeug liegt mir — aber ich will jetzt lernen, wie man es professionell und nach deutschen Standards macht.',
  },

  // ── Kaufmännisch / Büro / Verkauf ──────────────────────────
  {
    id: 'kauf_organisation',
    category: 'workplace',
    field: 'kaufmann',
    difficulty: 2,
    questionDe: 'Wie organisieren Sie Ihre Aufgaben, wenn vieles gleichzeitig ansteht?',
    sampleAnswerDe:
      'Mit einem einfachen System: Alles wird sofort notiert — nichts bleibt nur im Kopf. Dann priorisiere ich nach Dringlichkeit und Wichtigkeit: Was hat eine Frist? Was blockiert Kollegen, wenn es liegen bleibt? Große Aufgaben teile ich in Schritte auf und erledige das Unangenehmste zuerst. Und wenn absehbar ist, dass etwas nicht rechtzeitig fertig wird, sage ich früh Bescheid, statt zu hoffen. So behalte ich auch an vollen Tagen den Überblick.',
  },
  {
    id: 'kauf_programme',
    category: 'experience',
    field: 'kaufmann',
    difficulty: 1,
    questionDe: 'Welche Computerprogramme beherrschen Sie?',
    sampleAnswerDe:
      'Sicher beherrsche ich Word und Excel — in Excel kann ich Tabellen aufbauen, sortieren, filtern und mit Grundformeln wie SUMME und WENN arbeiten, außerdem einfache Auswertungen und Diagramme. Dazu kommen PowerPoint, E-Mail-Programme wie Outlook und schnelles Zehnfinger-Schreiben. Neue Software lerne ich schnell — ich habe mir zum Beispiel [Programm] selbst beigebracht. Falls Sie mit einem speziellen System wie SAP oder DATEV arbeiten: Genau solche Programme möchte ich in der Ausbildung von Grund auf lernen.',
  },
  {
    id: 'kauf_telefon',
    category: 'workplace',
    field: 'kaufmann',
    difficulty: 2,
    questionDe: 'Ein verärgerter Kunde ruft an und beschwert sich lautstark. Wie reagieren Sie?',
    sampleAnswerDe:
      'Ruhig bleiben und zuerst zuhören, ohne zu unterbrechen — oft sinkt die Wut schon, wenn jemand sich ernst genommen fühlt. Dann Verständnis zeigen und das Problem mit eigenen Worten zusammenfassen, damit klar ist, dass ich es verstanden habe. Danach entweder direkt eine Lösung anbieten oder einen konkreten Rückruf mit Zeitangabe versprechen — und den halte ich dann auch ein. Was ich nie tue: persönlich werden, diskutieren oder Versprechen machen, die ich nicht halten kann. Als Azubi hole ich bei schwierigen Fällen früh die Kollegen dazu.',
  },
  {
    id: 'kauf_zahlen',
    category: 'strengths',
    field: 'kaufmann',
    difficulty: 2,
    questionDe: 'Wie gut können Sie mit Zahlen umgehen?',
    sampleAnswerDe:
      'Gut — und vor allem gewissenhaft. Prozentrechnung, Dreisatz, Rabatte und Mehrwertsteuer berechne ich sicher; in der Schule hatte ich in Mathe [Note]. Wichtiger als Kopfrechnen finde ich im Büro aber Sorgfalt: eine Rechnung zweimal prüfen, Beträge nicht verwechseln, bei Unstimmigkeiten nachhaken statt abzeichnen. Zahlenfehler kosten Geld und Vertrauen. Ich arbeite lieber einmal konzentriert und richtig als zweimal schnell und falsch.',
  },
  {
    id: 'kauf_diskretion',
    category: 'workplace',
    field: 'kaufmann',
    difficulty: 2,
    questionDe: 'Im Büro arbeiten Sie mit vertraulichen Daten. Was bedeutet das für Sie?',
    sampleAnswerDe:
      'Dass ich eine Verantwortung trage, die über meinen Schreibtisch hinausgeht. Konkret: Kundendaten, Gehälter oder interne Zahlen werden mit niemandem besprochen — nicht mit Freunden, nicht mit der Familie, nicht mit Kollegen, die es nichts angeht. Dazu gehört auch der praktische Teil: Bildschirm sperren, Dokumente nicht offen liegen lassen, E-Mails an den richtigen Empfänger. Ich weiß, dass es dafür in Deutschland mit der DSGVO klare Regeln gibt, und nehme das ernst — Diskretion ist im Büro keine Option, sondern Pflicht.',
  },

  // ── Lagerlogistik ──────────────────────────────────────────
  {
    id: 'log_genauigkeit',
    category: 'workplace',
    field: 'logistik',
    difficulty: 1,
    questionDe: 'Warum ist Genauigkeit im Lager so wichtig?',
    sampleAnswerDe:
      'Weil jeder kleine Fehler eine Kette auslöst: Ein falsch gescannter Artikel bedeutet falsche Bestände, ein falsch gepacktes Paket einen verärgerten Kunden und teure Retouren. Das Lager ist das Gedächtnis der Firma — wenn die Zahlen im System nicht mit der Realität übereinstimmen, kann der Verkauf nichts verlässlich zusagen. Deshalb: jeden Scan ernst nehmen, Mengen wirklich zählen statt schätzen, und Unstimmigkeiten sofort melden statt weiterzuarbeiten. Lieber 30 Sekunden prüfen als eine Stunde korrigieren.',
  },
  {
    id: 'log_technik',
    category: 'experience',
    field: 'logistik',
    difficulty: 1,
    questionDe: 'Haben Sie Erfahrung mit Gabelstaplern, Scannern oder Lagersystemen?',
    sampleAnswerDe:
      'Ich habe [in einem Lager ausgeholfen und mit Handscannern gearbeitet / noch keinen Staplerschein, aber ich weiß, dass man ihn in der Ausbildung machen kann]. Mit Technik komme ich generell schnell zurecht — Scanner, Tablets und Lagersoftware sind logisch aufgebaut, wenn man das System dahinter versteht. Der Staplerschein ist eines meiner ersten Ziele in der Ausbildung. Bis dahin gilt für mich: Geräte nur bedienen, wenn ich eingewiesen bin — im Lager ist Sicherheit wichtiger als Tempo.',
  },
  {
    id: 'log_koerper',
    category: 'strengths',
    field: 'logistik',
    difficulty: 1,
    questionDe: 'Die Arbeit im Lager ist körperlich. Wie halten Sie durch?',
    sampleAnswerDe:
      'Ich bin fit und daran gewöhnt, mich zu bewegen — [Sport / bisherige körperliche Arbeit]. Acht Stunden auf den Beinen, Heben und Tragen schrecken mich nicht. Wichtig ist mir, von Anfang an richtig zu arbeiten: aus den Beinen heben statt aus dem Rücken, Hilfsmittel wie Hubwagen nutzen, gute Schuhe tragen. Und ich achte auf Erholung — Schlaf und Ausgleich nach der Schicht. Wer im Lager nur auf Kraft setzt, hält nicht lange; wer klug arbeitet, bleibt gesund.',
  },
  {
    id: 'log_schicht',
    category: 'logistics',
    field: 'logistik',
    difficulty: 2,
    questionDe: 'Können Sie im Schichtsystem arbeiten, auch früh oder nachts?',
    sampleAnswerDe:
      'Ja. Ich weiß, dass Logistik oft im Zwei- oder Dreischichtsystem läuft, weil Ware nicht wartet. Ich habe keine Verpflichtungen, die dagegen sprechen, und komme mit frühen Zeiten gut zurecht — ich bin ohnehin [Frühaufsteher / flexibel]. Mein Plan für Nachtschichten: feste Schlafenszeiten, dunkles Zimmer, Routine. Und ich sehe auch die Vorteile: Schichtzulagen und freie Zeit, wenn andere arbeiten. Zuverlässigkeit gilt für mich in jeder Schicht gleich — auch um 4 Uhr morgens.',
  },
  {
    id: 'log_fehler',
    category: 'workplace',
    field: 'logistik',
    difficulty: 2,
    questionDe: 'Sie merken, dass eine Lieferung falsch gepackt wurde — aber nicht von Ihnen. Was tun Sie?',
    sampleAnswerDe:
      'Sofort melden — ohne Schuldzuweisung. Der Kunde interessiert sich nicht dafür, wer den Fehler gemacht hat, sondern nur, ob er die richtige Ware bekommt. Also: Vorgesetzten oder die zuständige Kollegin informieren, die Lieferung stoppen, solange es noch geht, und beim Korrigieren helfen. Was ich nicht tun würde: wegschauen, weil es „nicht mein Fehler" ist. Im Lager arbeitet man als Kette — und eine Kette funktioniert nur, wenn jedes Glied auch auf die anderen achtet.',
  },

  // ── Berufskraftfahrer (LKW/Bus) ────────────────────────────
  {
    id: 'fahrer_warum',
    category: 'motivation',
    field: 'fahrer',
    difficulty: 1,
    questionDe: 'Warum möchten Sie Berufskraftfahrer werden?',
    sampleAnswerDe:
      'Drei Gründe. Erstens: Ich fahre gern und gut — konzentriert, ruhig, auch auf langen Strecken. Zweitens: Der Beruf trägt echte Verantwortung; ohne LKW- und Busfahrer steht das Land still, und genau deshalb werden überall Fahrer gesucht — die Jobsicherheit ist enorm. Drittens: Mir gefällt die Selbstständigkeit — ich habe meine Tour, mein Fahrzeug und mein Ergebnis, und am Ende des Tages weiß ich genau, was ich geleistet habe. Dass die Ausbildung den [C/CE- bzw. D-]Führerschein enthält, macht sie für mich zum perfekten Einstieg.',
  },
  {
    id: 'fahrer_fuehrerschein',
    category: 'experience',
    field: 'fahrer',
    difficulty: 1,
    questionDe: 'Haben Sie schon einen Führerschein, und wie sind Ihre Fahrkenntnisse?',
    sampleAnswerDe:
      'Ich habe [den Führerschein Klasse B seit X Jahren / in meinem Heimatland den Führerschein gemacht und lasse ihn umschreiben]. Ich fahre regelmäßig und unfallfrei — auch längere Strecken und in dichtem Stadtverkehr. Ich weiß, dass die Klassen C und CE [bzw. D für den Bus] Teil der Ausbildung sind, und genau darauf freue ich mich: das Fahren großer Fahrzeuge von Grund auf professionell zu lernen, mit Ladungssicherung, Fahrphysik und allem, was dazugehört.',
  },
  {
    id: 'fahrer_verantwortung',
    category: 'workplace',
    field: 'fahrer',
    difficulty: 2,
    questionDe: 'Als Fahrer tragen Sie große Verantwortung. Wie gehen Sie damit um?',
    sampleAnswerDe:
      'Verantwortung heißt für mich: Regeln ohne Ausnahme einhalten. Konkret: Lenk- und Ruhezeiten respektieren, auch wenn der Termin drückt — ein müder Fahrer ist eine Gefahr für alle. Vor jeder Fahrt die Abfahrtskontrolle: Reifen, Bremsen, Licht, Ladungssicherung. Kein Handy am Steuer, null Alkohol, angepasste Geschwindigkeit bei Regen oder Schnee. Beim Bus kommt die größte Verantwortung dazu: Menschen. Ich verstehe den Beruf so, dass Sicherheit immer vor Pünktlichkeit geht — und ein guter Betrieb sieht das genauso.',
  },
  {
    id: 'fahrer_alleinsein',
    category: 'strengths',
    field: 'fahrer',
    difficulty: 2,
    questionDe: 'Unterwegs sind Sie oft viele Stunden allein. Passt das zu Ihnen?',
    sampleAnswerDe:
      'Ja, das passt gut zu mir. Ich bin gern selbstständig und kann mich über Stunden konzentrieren, ohne dass mir jemand über die Schulter schaut. Die Zeit auf der Strecke nutze ich sinnvoll — ich höre [Podcasts / Hörbücher] und verbessere nebenbei mein Deutsch. Gleichzeitig bin ich kein Einzelgänger: An der Rampe, beim Kunden oder im Depot kommuniziere ich freundlich und klar — gerade als Fahrer ist man ja auch das Gesicht der Firma. Diese Mischung aus Ruhe allein und kurzem, professionellem Kontakt liegt mir.',
  },
  {
    id: 'fahrer_zeiten',
    category: 'logistics',
    field: 'fahrer',
    difficulty: 2,
    questionDe: 'Frühe Abfahrten, Staus, Termindruck — wie bleiben Sie zuverlässig und ruhig?',
    sampleAnswerDe:
      'Mit Planung und Ruhe. Frühe Abfahrten sind Gewohnheitssache — ich stehe [schon jetzt früh auf / plane meinen Schlaf konsequent nach dem Dienstplan]. Gegen Termindruck hilft Vorbereitung: Route und Zeitpuffer vorher prüfen, tanken und Papiere am Vorabend. Und im Stau gilt: Ich kann den Verkehr nicht ändern, also bleibe ich ruhig, melde die Verspätung sofort an die Dispo und hole nichts durch riskantes Fahren auf. Zuverlässigkeit heißt für mich nicht nur pünktlich sein, sondern auch ehrlich kommunizieren, wenn es einmal nicht geht.',
  },

  // ── Bau ────────────────────────────────────────────────────
  {
    id: 'bau_warum',
    category: 'motivation',
    field: 'bau',
    difficulty: 1,
    questionDe: 'Warum wollen Sie auf dem Bau arbeiten?',
    sampleAnswerDe:
      'Weil ich am Ende des Tages sehen will, was ich geschafft habe. Auf dem Bau entsteht etwas Bleibendes — eine Wand, ein Haus, eine Straße, an der ich in zwanzig Jahren vorbeigehen und sagen kann: Da habe ich mitgebaut. Dazu kommt: Ich arbeite gern draußen und mit den Händen, und die Baubranche sucht überall Leute — mit Ausbildung habe ich einen sicheren Beruf mit klarem Aufstieg: Geselle, Vorarbeiter, Polier, vielleicht Meister. Das ist ein Weg, den man sich erarbeiten kann, und genau das will ich.',
  },
  {
    id: 'bau_koerperlich',
    category: 'strengths',
    field: 'bau',
    difficulty: 2,
    questionDe: 'Die Arbeit auf der Baustelle ist hart — Wetter, Lärm, schwere Lasten. Sind Sie bereit dafür?',
    sampleAnswerDe:
      'Ja, und ich sage das nicht leichtfertig. Ich bin körperlich fit [Sport / bisherige körperliche Arbeit] und weiß aus Erfahrung, wie sich ein voller Arbeitstag im Sommer oder bei Kälte anfühlt. Zwei Dinge sind mir dabei wichtig: Erstens, richtig arbeiten statt nur hart — Hebetechnik, Maschinen und Hilfsmittel nutzen, damit der Körper lange durchhält. Zweitens, gute Ausrüstung und Pausen ernst nehmen. Harte Arbeit schreckt mich nicht — sie ist für mich der Grund, warum man auf dem Bau als Team so zusammenhält.',
  },
  {
    id: 'bau_sicherheit',
    category: 'workplace',
    field: 'bau',
    difficulty: 2,
    questionDe: 'Was wissen Sie über Sicherheit auf der Baustelle?',
    sampleAnswerDe:
      'Das Wichtigste: Die persönliche Schutzausrüstung ist Pflicht, keine Option — Helm, Sicherheitsschuhe, Warnweste, je nach Arbeit Handschuhe, Schutzbrille und Gehörschutz. Dazu kommen die Grundregeln: nie unter schwebende Lasten treten, Absperrungen respektieren, Gerüste nur benutzen, wenn sie freigegeben sind, Leitern richtig anstellen. Und als Azubi die goldene Regel: Wenn ich etwas nicht sicher beherrsche, frage ich, bevor ich es tue. Auf dem Bau gibt es keine dummen Fragen — nur vermeidbare Unfälle.',
  },
  {
    id: 'bau_team',
    category: 'workplace',
    field: 'bau',
    difficulty: 1,
    questionDe: 'Auf der Baustelle arbeiten viele Gewerke zusammen. Wie arbeiten Sie im Team?',
    sampleAnswerDe:
      'Zuverlässig und mit Respekt vor der Erfahrung der anderen. Auf der Baustelle hängt jeder vom anderen ab — wenn ich meinen Teil nicht fertig habe, steht das nächste Gewerk. Also: pünktlich sein, Absprachen einhalten, und wenn es ein Problem gibt, sofort sagen statt verstecken. Vom Polier und den Gesellen will ich lernen — die haben Jahre Erfahrung, und wer als Azubi gut zuhört und mit anpackt, wird auf dem Bau schnell respektiert. Anpacken kann ich, und unterordnen, wo es nötig ist, auch.',
  },
  {
    id: 'bau_plaene',
    category: 'experience',
    field: 'bau',
    difficulty: 2,
    questionDe: 'Können Sie technische Zeichnungen oder Baupläne lesen?',
    sampleAnswerDe:
      'Grundkenntnisse habe ich: Ich verstehe Maßstäbe, Bemaßungen und einfache Grundrisse [aus der Schule / aus eigenem Interesse / vom Praktikum]. Mir ist klar, dass Baupläne viel mehr enthalten — Schnitte, Details, Symbole für Material und Bewehrung — und genau das will ich in der Ausbildung systematisch lernen. Was ich mitbringe, ist die Grundlage dafür: gutes räumliches Vorstellungsvermögen und solide Mathematik. Wenn ich einen Plan sehe, will ich verstehen, was gebaut wird — nicht nur ausführen.',
  },

  // ── Medizinische Fachangestellte (MFA) ─────────────────────
  {
    id: 'mfa_warum',
    category: 'motivation',
    field: 'mfa',
    difficulty: 1,
    questionDe: 'Warum möchten Sie in einer Arztpraxis arbeiten?',
    sampleAnswerDe:
      'Weil der Beruf genau meine zwei Stärken verbindet: den Umgang mit Menschen und Organisation. Als MFA bin ich die erste Person, die der Patient sieht — ich nehme Ängste, organisiere Termine, assistiere bei Behandlungen und halte die Praxis am Laufen. Medizin hat mich schon immer interessiert [konkreter Bezug: Familie, eigenes Erlebnis, Praktikum], und die Mischung aus medizinischer Arbeit, Verwaltung und täglichem Patientenkontakt ist für mich attraktiver als reine Büroarbeit oder reine Pflege. Dazu ist der Bedarf riesig — MFA werden überall gesucht.',
  },
  {
    id: 'mfa_patienten',
    category: 'workplace',
    field: 'mfa',
    difficulty: 2,
    questionDe: 'Ein Patient ist nervös oder hat Angst. Wie beruhigen Sie ihn?',
    sampleAnswerDe:
      'Mit Ruhe, Blickkontakt und einfachen Worten. Ich nehme die Angst ernst, statt sie wegzureden — ein Satz wie „Das kenne ich, vielen geht das so" wirkt oft schon. Dann erkläre ich in verständlicher Sprache, was gleich passiert und wie lange es dauert; das Unbekannte macht die meiste Angst. Bei Kindern helfe ich mit Ablenkung, bei älteren Patienten mit etwas mehr Zeit und Geduld. Und wenn ich merke, dass die Angst sehr groß ist, gebe ich der Ärztin oder dem Arzt vorher kurz Bescheid — auch das gehört zu meiner Rolle.',
  },
  {
    id: 'mfa_hygiene',
    category: 'experience',
    field: 'mfa',
    difficulty: 2,
    questionDe: 'Welche Rolle spielt Hygiene in der Praxis?',
    sampleAnswerDe:
      'Eine zentrale — sie schützt Patienten und das Team. Konkret heißt das: Händedesinfektion vor und nach jedem Patientenkontakt, Handschuhe bei Blutabnahme und Wundversorgung, Flächendesinfektion der Behandlungsräume und die korrekte Aufbereitung und Sterilisation von Instrumenten. Dazu die richtige Entsorgung von Spritzen und Kanülen im Sicherheitsbehälter. Ich weiß, dass es dafür feste Hygienepläne gibt, an die man sich exakt hält — und genau diese klaren Standards finde ich gut: In der Medizin darf Sauberkeit keine Frage der Tagesform sein.',
  },
  {
    id: 'mfa_diskretion',
    category: 'workplace',
    field: 'mfa',
    difficulty: 2,
    questionDe: 'Was bedeutet die ärztliche Schweigepflicht für Sie?',
    sampleAnswerDe:
      'Dass alles, was ich in der Praxis über Patienten erfahre, die Praxis niemals verlässt — Diagnosen, Befunde, sogar die Tatsache, dass jemand überhaupt Patient ist. Das gilt gegenüber jedem: Familie, Freunden, sogar Angehörigen des Patienten, wenn keine Einwilligung vorliegt. Praktisch heißt das auch: am Empfang leise sprechen, wenn andere warten, keine Akten offen liegen lassen, am Telefon erst prüfen, mit wem ich spreche. Ich weiß, dass die Schweigepflicht gesetzlich geregelt ist und ein Verstoß strafbar — für mich ist sie aber vor allem eine Frage des Respekts.',
  },
  {
    id: 'mfa_stress',
    category: 'workplace',
    field: 'mfa',
    difficulty: 3,
    questionDe: 'Volles Wartezimmer, das Telefon klingelt, ein Notfall kommt herein. Was machen Sie?',
    sampleAnswerDe:
      'Priorisieren — und der Notfall geht immer vor. Ich informiere sofort die Ärztin oder den Arzt und kümmere mich um den Notfallpatienten. Das Telefon nimmt in dem Moment eine Kollegin, oder es klingelt kurz durch — ein Anruf ist selten lebenswichtig, ein Notfall vielleicht schon. Danach informiere ich die Wartenden ehrlich und freundlich: „Es kam ein Notfall dazwischen, es dauert etwa X Minuten länger." Die meisten Menschen haben dafür Verständnis, wenn man offen kommuniziert. Wichtig ist, ruhig zu bleiben — Hektik überträgt sich aufs ganze Wartezimmer.',
  },

  // ── Bäckerei & Konditorei ──────────────────────────────────
  {
    id: 'baecker_warum',
    category: 'motivation',
    field: 'baecker',
    difficulty: 1,
    questionDe: 'Warum wollen Sie Bäcker werden?',
    sampleAnswerDe:
      'Weil ich ein Handwerk lernen will, dessen Ergebnis man jeden Morgen riechen, sehen und schmecken kann. Backen ist Präzision plus Gefühl — ein Teig verzeiht keine Nachlässigkeit, und genau diese Mischung aus Handarbeit und Genauigkeit liegt mir [konkreter Bezug: Backen zu Hause / Familie / Praktikum]. Dazu kommt: Das deutsche Bäckerhandwerk hat Weltruf mit über 3.000 Brotsorten, und Betriebe suchen dringend Nachwuchs. Ich will einen Beruf, bei dem ich morgens etwas Echtes herstelle, worauf ich stolz bin — kein Bildschirm, sondern Brot.',
  },
  {
    id: 'baecker_nachtarbeit',
    category: 'logistics',
    field: 'baecker',
    difficulty: 3,
    questionDe: 'Bäcker fangen nachts um zwei oder drei Uhr an. Schaffen Sie das dauerhaft?',
    sampleAnswerDe:
      'Ja — und ich habe mir die Antwort gut überlegt, weil ich weiß, dass daran viele scheitern. Mein Plan: Der Schlaf wird konsequent verschoben, nicht verkürzt — früh ins Bett, dunkles Zimmer, feste Routine auch am Wochenende. Ich bin [von Natur aus Frühaufsteher / diszipliniert genug, meinen Rhythmus umzustellen] und habe keine Verpflichtungen, die dagegen sprechen. Und die Arbeitszeit hat eine schöne Seite: Wenn andere anfangen, habe ich Feierabend — der Nachmittag gehört mir. Wer Bäcker werden will, muss die Nacht akzeptieren; ich habe das bewusst getan.',
  },
  {
    id: 'baecker_hygiene',
    category: 'experience',
    field: 'baecker',
    difficulty: 2,
    questionDe: 'Warum ist Hygiene in der Backstube so wichtig?',
    sampleAnswerDe:
      'Weil wir Lebensmittel herstellen, die Menschen direkt essen — Fehler machen im schlimmsten Fall Kunden krank. Konkret: saubere Hände und Arbeitskleidung, Haare bedeckt, kein Schmuck an den Händen, Arbeitsflächen und Maschinen regelmäßig reinigen, rohe Zutaten wie Eier getrennt behandeln und die Kühlkette bei Sahne und Cremes einhalten. Ich weiß, dass Betriebe nach festen Hygieneregeln arbeiten und kontrolliert werden. Für mich gehört Sauberkeit zum Stolz des Handwerks: Eine saubere Backstube ist das erste Qualitätsmerkmal.',
  },
  {
    id: 'baecker_handwerk',
    category: 'experience',
    field: 'baecker',
    difficulty: 1,
    questionDe: 'Haben Sie schon einmal gebacken oder in einer Küche gearbeitet?',
    sampleAnswerDe:
      'Ja — ich backe [regelmäßig zu Hause: Brot, Msemen, Kuchen / habe in der Küche bzw. Bäckerei der Familie geholfen]. Dabei habe ich zwei Dinge gelernt, die zum Beruf passen: Erstens, Rezepte sind Chemie — wer Mengen, Temperaturen und Ruhezeiten nicht respektiert, bekommt kein gutes Ergebnis. Zweitens, Geduld: Ein Hefeteig lässt sich nicht drängen. Mir ist klar, dass die Backstube ein anderes Tempo und andere Mengen hat als die Küche zu Hause — genau deshalb will ich es richtig lernen, vom Profi.',
  },
  {
    id: 'baecker_praezision',
    category: 'strengths',
    field: 'baecker',
    difficulty: 2,
    questionDe: 'Beim Backen zählen Mengen und Zeiten genau. Sind Sie ein genauer Mensch?',
    sampleAnswerDe:
      'Ja — Genauigkeit ist eine meiner Stärken. Ich arbeite gern nach klaren Vorgaben: abwiegen statt schätzen, Timer stellen statt „nach Gefühl", und wenn ein Schritt schiefgeht, von vorn statt improvisieren. Gleichzeitig weiß ich, dass ein guter Bäcker mit der Zeit auch das Gefühl entwickelt — wie sich ein richtig gekneteter Teig anfasst, wann das Brot fertig klingt. Diese Kombination will ich lernen: erst die Präzision nach Rezept, dann die Erfahrung, die daraus ein Handwerk macht.',
  },
]

export const FIELD_ICON: Record<FieldKey, string> = {
  pflege:   '🏥',
  kfz:      '🚗',
  elektro:  '⚡',
  it:       '💻',
  gastro:   '🍽️',
  shk:      '🔧',
  kaufmann: '💼',
  logistik: '📦',
  fahrer:   '🚛',
  bau:      '🏗️',
  mfa:      '🩺',
  baecker:  '🥖',
}

export const FIELD_ORDER: FieldKey[] = [
  'pflege', 'kfz', 'elektro', 'it', 'gastro', 'shk', 'kaufmann', 'logistik',
  'fahrer', 'bau', 'mfa', 'baecker',
]

/** General + field-specific questions, in display order. */
export const ALL_QUESTIONS: Question[] = [...QUESTIONS, ...FIELD_QUESTIONS]
