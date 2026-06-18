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

export type Question = {
  id: string
  category: CategoryKey
  difficulty: Difficulty
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
