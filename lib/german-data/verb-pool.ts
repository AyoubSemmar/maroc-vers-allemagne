/**
 * Verb conjugation pool for the daily conjugation drill.
 *
 * Curated to cover the 200+ verbs a Moroccan learner actually meets at
 * each Goethe level. Where a verb is irregular we put the irregular
 * stem-changes inline (du gibst not "gebst", er fährt not "fahrt") —
 * those are the exact forms exam papers test.
 *
 * Tagged by minimum CEFR level: A1 verbs surface in A1 drills only,
 * but the A2 drill includes both A1 and A2, B1 includes A1+A2+B1, etc.
 * That way the pool grows naturally with the learner.
 *
 * Schema is deliberately flat — no irregular-stem flag, no past forms
 * — because v1 only drills present-tense conjugation. Past tenses
 * become a separate drill in a future iteration.
 */

export type VerbLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type Verb = {
  infinitive: string
  meaningFr: string
  meaningAr: string
  level: VerbLevel
  // 6 person forms: ich, du, er/sie/es, wir, ihr, sie/Sie
  forms: {
    ich: string
    du: string
    er: string
    wir: string
    ihr: string
    sie: string
  }
  // Optional flag for separable verbs so we display them correctly
  // in the prompt ("auf|stehen") and accept both "stehe auf" and
  // "stehe ... auf" answers if we ever extend to whole-sentence drills.
  separable?: boolean
}

export const VERB_POOL: Verb[] = [
  // ── A1 essentials ────────────────────────────────────────────────
  { infinitive: 'sein', meaningFr: 'être', meaningAr: 'يكون', level: 'A1',
    forms: { ich: 'bin', du: 'bist', er: 'ist', wir: 'sind', ihr: 'seid', sie: 'sind' } },
  { infinitive: 'haben', meaningFr: 'avoir', meaningAr: 'يملك', level: 'A1',
    forms: { ich: 'habe', du: 'hast', er: 'hat', wir: 'haben', ihr: 'habt', sie: 'haben' } },
  { infinitive: 'werden', meaningFr: 'devenir', meaningAr: 'يصبح', level: 'A1',
    forms: { ich: 'werde', du: 'wirst', er: 'wird', wir: 'werden', ihr: 'werdet', sie: 'werden' } },
  { infinitive: 'gehen', meaningFr: 'aller', meaningAr: 'يذهب', level: 'A1',
    forms: { ich: 'gehe', du: 'gehst', er: 'geht', wir: 'gehen', ihr: 'geht', sie: 'gehen' } },
  { infinitive: 'kommen', meaningFr: 'venir', meaningAr: 'يأتي', level: 'A1',
    forms: { ich: 'komme', du: 'kommst', er: 'kommt', wir: 'kommen', ihr: 'kommt', sie: 'kommen' } },
  { infinitive: 'machen', meaningFr: 'faire', meaningAr: 'يفعل', level: 'A1',
    forms: { ich: 'mache', du: 'machst', er: 'macht', wir: 'machen', ihr: 'macht', sie: 'machen' } },
  { infinitive: 'heißen', meaningFr: 's\'appeler', meaningAr: 'يُسمَّى', level: 'A1',
    forms: { ich: 'heiße', du: 'heißt', er: 'heißt', wir: 'heißen', ihr: 'heißt', sie: 'heißen' } },
  { infinitive: 'wohnen', meaningFr: 'habiter', meaningAr: 'يسكن', level: 'A1',
    forms: { ich: 'wohne', du: 'wohnst', er: 'wohnt', wir: 'wohnen', ihr: 'wohnt', sie: 'wohnen' } },
  { infinitive: 'sprechen', meaningFr: 'parler', meaningAr: 'يتكلم', level: 'A1',
    forms: { ich: 'spreche', du: 'sprichst', er: 'spricht', wir: 'sprechen', ihr: 'sprecht', sie: 'sprechen' } },
  { infinitive: 'lernen', meaningFr: 'apprendre', meaningAr: 'يتعلم', level: 'A1',
    forms: { ich: 'lerne', du: 'lernst', er: 'lernt', wir: 'lernen', ihr: 'lernt', sie: 'lernen' } },
  { infinitive: 'arbeiten', meaningFr: 'travailler', meaningAr: 'يعمل', level: 'A1',
    forms: { ich: 'arbeite', du: 'arbeitest', er: 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', sie: 'arbeiten' } },
  { infinitive: 'essen', meaningFr: 'manger', meaningAr: 'يأكل', level: 'A1',
    forms: { ich: 'esse', du: 'isst', er: 'isst', wir: 'essen', ihr: 'esst', sie: 'essen' } },
  { infinitive: 'trinken', meaningFr: 'boire', meaningAr: 'يشرب', level: 'A1',
    forms: { ich: 'trinke', du: 'trinkst', er: 'trinkt', wir: 'trinken', ihr: 'trinkt', sie: 'trinken' } },
  { infinitive: 'lesen', meaningFr: 'lire', meaningAr: 'يقرأ', level: 'A1',
    forms: { ich: 'lese', du: 'liest', er: 'liest', wir: 'lesen', ihr: 'lest', sie: 'lesen' } },
  { infinitive: 'schreiben', meaningFr: 'écrire', meaningAr: 'يكتب', level: 'A1',
    forms: { ich: 'schreibe', du: 'schreibst', er: 'schreibt', wir: 'schreiben', ihr: 'schreibt', sie: 'schreiben' } },
  { infinitive: 'sehen', meaningFr: 'voir', meaningAr: 'يرى', level: 'A1',
    forms: { ich: 'sehe', du: 'siehst', er: 'sieht', wir: 'sehen', ihr: 'seht', sie: 'sehen' } },
  { infinitive: 'fahren', meaningFr: 'aller (en véhicule)', meaningAr: 'يقود/يسافر', level: 'A1',
    forms: { ich: 'fahre', du: 'fährst', er: 'fährt', wir: 'fahren', ihr: 'fahrt', sie: 'fahren' } },
  { infinitive: 'können', meaningFr: 'pouvoir', meaningAr: 'يستطيع', level: 'A1',
    forms: { ich: 'kann', du: 'kannst', er: 'kann', wir: 'können', ihr: 'könnt', sie: 'können' } },
  { infinitive: 'müssen', meaningFr: 'devoir', meaningAr: 'يجب عليه', level: 'A1',
    forms: { ich: 'muss', du: 'musst', er: 'muss', wir: 'müssen', ihr: 'müsst', sie: 'müssen' } },
  { infinitive: 'wollen', meaningFr: 'vouloir', meaningAr: 'يريد', level: 'A1',
    forms: { ich: 'will', du: 'willst', er: 'will', wir: 'wollen', ihr: 'wollt', sie: 'wollen' } },
  { infinitive: 'mögen', meaningFr: 'aimer (bien)', meaningAr: 'يحب', level: 'A1',
    forms: { ich: 'mag', du: 'magst', er: 'mag', wir: 'mögen', ihr: 'mögt', sie: 'mögen' } },
  { infinitive: 'dürfen', meaningFr: 'avoir le droit', meaningAr: 'يُسمح له', level: 'A1',
    forms: { ich: 'darf', du: 'darfst', er: 'darf', wir: 'dürfen', ihr: 'dürft', sie: 'dürfen' } },
  { infinitive: 'sollen', meaningFr: 'devoir (suggestion)', meaningAr: 'ينبغي', level: 'A1',
    forms: { ich: 'soll', du: 'sollst', er: 'soll', wir: 'sollen', ihr: 'sollt', sie: 'sollen' } },
  { infinitive: 'kaufen', meaningFr: 'acheter', meaningAr: 'يشتري', level: 'A1',
    forms: { ich: 'kaufe', du: 'kaufst', er: 'kauft', wir: 'kaufen', ihr: 'kauft', sie: 'kaufen' } },
  { infinitive: 'kosten', meaningFr: 'coûter', meaningAr: 'يكلف', level: 'A1',
    forms: { ich: 'koste', du: 'kostest', er: 'kostet', wir: 'kosten', ihr: 'kostet', sie: 'kosten' } },
  { infinitive: 'finden', meaningFr: 'trouver', meaningAr: 'يجد', level: 'A1',
    forms: { ich: 'finde', du: 'findest', er: 'findet', wir: 'finden', ihr: 'findet', sie: 'finden' } },
  { infinitive: 'geben', meaningFr: 'donner', meaningAr: 'يعطي', level: 'A1',
    forms: { ich: 'gebe', du: 'gibst', er: 'gibt', wir: 'geben', ihr: 'gebt', sie: 'geben' } },
  { infinitive: 'nehmen', meaningFr: 'prendre', meaningAr: 'يأخذ', level: 'A1',
    forms: { ich: 'nehme', du: 'nimmst', er: 'nimmt', wir: 'nehmen', ihr: 'nehmt', sie: 'nehmen' } },
  { infinitive: 'helfen', meaningFr: 'aider', meaningAr: 'يساعد', level: 'A1',
    forms: { ich: 'helfe', du: 'hilfst', er: 'hilft', wir: 'helfen', ihr: 'helft', sie: 'helfen' } },
  { infinitive: 'verstehen', meaningFr: 'comprendre', meaningAr: 'يفهم', level: 'A1',
    forms: { ich: 'verstehe', du: 'verstehst', er: 'versteht', wir: 'verstehen', ihr: 'versteht', sie: 'verstehen' } },

  // ── A2 ───────────────────────────────────────────────────────────
  { infinitive: 'aufstehen', meaningFr: 'se lever', meaningAr: 'يستيقظ', level: 'A2', separable: true,
    forms: { ich: 'stehe auf', du: 'stehst auf', er: 'steht auf', wir: 'stehen auf', ihr: 'steht auf', sie: 'stehen auf' } },
  { infinitive: 'einkaufen', meaningFr: 'faire les courses', meaningAr: 'يتسوق', level: 'A2', separable: true,
    forms: { ich: 'kaufe ein', du: 'kaufst ein', er: 'kauft ein', wir: 'kaufen ein', ihr: 'kauft ein', sie: 'kaufen ein' } },
  { infinitive: 'anrufen', meaningFr: 'appeler', meaningAr: 'يتصل', level: 'A2', separable: true,
    forms: { ich: 'rufe an', du: 'rufst an', er: 'ruft an', wir: 'rufen an', ihr: 'ruft an', sie: 'rufen an' } },
  { infinitive: 'fernsehen', meaningFr: 'regarder la TV', meaningAr: 'يشاهد التلفاز', level: 'A2', separable: true,
    forms: { ich: 'sehe fern', du: 'siehst fern', er: 'sieht fern', wir: 'sehen fern', ihr: 'seht fern', sie: 'sehen fern' } },
  { infinitive: 'fahren', meaningFr: 'partir/conduire', meaningAr: 'يسافر/يقود', level: 'A2',
    forms: { ich: 'fahre', du: 'fährst', er: 'fährt', wir: 'fahren', ihr: 'fahrt', sie: 'fahren' } },
  { infinitive: 'laufen', meaningFr: 'courir/marcher', meaningAr: 'يجري', level: 'A2',
    forms: { ich: 'laufe', du: 'läufst', er: 'läuft', wir: 'laufen', ihr: 'lauft', sie: 'laufen' } },
  { infinitive: 'schlafen', meaningFr: 'dormir', meaningAr: 'ينام', level: 'A2',
    forms: { ich: 'schlafe', du: 'schläfst', er: 'schläft', wir: 'schlafen', ihr: 'schlaft', sie: 'schlafen' } },
  { infinitive: 'tragen', meaningFr: 'porter', meaningAr: 'يحمل', level: 'A2',
    forms: { ich: 'trage', du: 'trägst', er: 'trägt', wir: 'tragen', ihr: 'tragt', sie: 'tragen' } },
  { infinitive: 'waschen', meaningFr: 'laver', meaningAr: 'يغسل', level: 'A2',
    forms: { ich: 'wasche', du: 'wäschst', er: 'wäscht', wir: 'waschen', ihr: 'wascht', sie: 'waschen' } },
  { infinitive: 'wissen', meaningFr: 'savoir', meaningAr: 'يعلم', level: 'A2',
    forms: { ich: 'weiß', du: 'weißt', er: 'weiß', wir: 'wissen', ihr: 'wisst', sie: 'wissen' } },
  { infinitive: 'denken', meaningFr: 'penser', meaningAr: 'يفكر', level: 'A2',
    forms: { ich: 'denke', du: 'denkst', er: 'denkt', wir: 'denken', ihr: 'denkt', sie: 'denken' } },
  { infinitive: 'bringen', meaningFr: 'apporter', meaningAr: 'يجلب', level: 'A2',
    forms: { ich: 'bringe', du: 'bringst', er: 'bringt', wir: 'bringen', ihr: 'bringt', sie: 'bringen' } },
  { infinitive: 'treffen', meaningFr: 'rencontrer', meaningAr: 'يقابل', level: 'A2',
    forms: { ich: 'treffe', du: 'triffst', er: 'trifft', wir: 'treffen', ihr: 'trefft', sie: 'treffen' } },
  { infinitive: 'vergessen', meaningFr: 'oublier', meaningAr: 'ينسى', level: 'A2',
    forms: { ich: 'vergesse', du: 'vergisst', er: 'vergisst', wir: 'vergessen', ihr: 'vergesst', sie: 'vergessen' } },
  { infinitive: 'empfehlen', meaningFr: 'recommander', meaningAr: 'يوصي', level: 'A2',
    forms: { ich: 'empfehle', du: 'empfiehlst', er: 'empfiehlt', wir: 'empfehlen', ihr: 'empfehlt', sie: 'empfehlen' } },

  // ── B1 ───────────────────────────────────────────────────────────
  { infinitive: 'beginnen', meaningFr: 'commencer', meaningAr: 'يبدأ', level: 'B1',
    forms: { ich: 'beginne', du: 'beginnst', er: 'beginnt', wir: 'beginnen', ihr: 'beginnt', sie: 'beginnen' } },
  { infinitive: 'bekommen', meaningFr: 'recevoir', meaningAr: 'يستلم', level: 'B1',
    forms: { ich: 'bekomme', du: 'bekommst', er: 'bekommt', wir: 'bekommen', ihr: 'bekommt', sie: 'bekommen' } },
  { infinitive: 'bleiben', meaningFr: 'rester', meaningAr: 'يبقى', level: 'B1',
    forms: { ich: 'bleibe', du: 'bleibst', er: 'bleibt', wir: 'bleiben', ihr: 'bleibt', sie: 'bleiben' } },
  { infinitive: 'entscheiden', meaningFr: 'décider', meaningAr: 'يقرر', level: 'B1',
    forms: { ich: 'entscheide', du: 'entscheidest', er: 'entscheidet', wir: 'entscheiden', ihr: 'entscheidet', sie: 'entscheiden' } },
  { infinitive: 'erklären', meaningFr: 'expliquer', meaningAr: 'يشرح', level: 'B1',
    forms: { ich: 'erkläre', du: 'erklärst', er: 'erklärt', wir: 'erklären', ihr: 'erklärt', sie: 'erklären' } },
  { infinitive: 'gefallen', meaningFr: 'plaire', meaningAr: 'يعجب', level: 'B1',
    forms: { ich: 'gefalle', du: 'gefällst', er: 'gefällt', wir: 'gefallen', ihr: 'gefallt', sie: 'gefallen' } },
  { infinitive: 'gehören', meaningFr: 'appartenir', meaningAr: 'ينتمي', level: 'B1',
    forms: { ich: 'gehöre', du: 'gehörst', er: 'gehört', wir: 'gehören', ihr: 'gehört', sie: 'gehören' } },
  { infinitive: 'sich bewerben', meaningFr: 'postuler', meaningAr: 'يتقدم بطلب', level: 'B1',
    forms: { ich: 'bewerbe mich', du: 'bewirbst dich', er: 'bewirbt sich', wir: 'bewerben uns', ihr: 'bewerbt euch', sie: 'bewerben sich' } },
  { infinitive: 'verlangen', meaningFr: 'exiger', meaningAr: 'يطلب/يشترط', level: 'B1',
    forms: { ich: 'verlange', du: 'verlangst', er: 'verlangt', wir: 'verlangen', ihr: 'verlangt', sie: 'verlangen' } },
  { infinitive: 'gelingen', meaningFr: 'réussir', meaningAr: 'ينجح', level: 'B1',
    forms: { ich: 'gelinge', du: 'gelingst', er: 'gelingt', wir: 'gelingen', ihr: 'gelingt', sie: 'gelingen' } },

  // ── B2 ───────────────────────────────────────────────────────────
  { infinitive: 'beeinflussen', meaningFr: 'influencer', meaningAr: 'يؤثر على', level: 'B2',
    forms: { ich: 'beeinflusse', du: 'beeinflusst', er: 'beeinflusst', wir: 'beeinflussen', ihr: 'beeinflusst', sie: 'beeinflussen' } },
  { infinitive: 'unterscheiden', meaningFr: 'distinguer', meaningAr: 'يميز', level: 'B2',
    forms: { ich: 'unterscheide', du: 'unterscheidest', er: 'unterscheidet', wir: 'unterscheiden', ihr: 'unterscheidet', sie: 'unterscheiden' } },
  { infinitive: 'voraussetzen', meaningFr: 'présupposer', meaningAr: 'يفترض', level: 'B2', separable: true,
    forms: { ich: 'setze voraus', du: 'setzt voraus', er: 'setzt voraus', wir: 'setzen voraus', ihr: 'setzt voraus', sie: 'setzen voraus' } },
  { infinitive: 'verbessern', meaningFr: 'améliorer', meaningAr: 'يحسن', level: 'B2',
    forms: { ich: 'verbessere', du: 'verbesserst', er: 'verbessert', wir: 'verbessern', ihr: 'verbessert', sie: 'verbessern' } },
  { infinitive: 'sich auseinandersetzen', meaningFr: 'se confronter à', meaningAr: 'يواجه', level: 'B2', separable: true,
    forms: { ich: 'setze mich auseinander', du: 'setzt dich auseinander', er: 'setzt sich auseinander', wir: 'setzen uns auseinander', ihr: 'setzt euch auseinander', sie: 'setzen sich auseinander' } },

  // ── C1 ───────────────────────────────────────────────────────────
  { infinitive: 'beanspruchen', meaningFr: 'revendiquer', meaningAr: 'يدّعي/يطالب', level: 'C1',
    forms: { ich: 'beanspruche', du: 'beanspruchst', er: 'beansprucht', wir: 'beanspruchen', ihr: 'beansprucht', sie: 'beanspruchen' } },
  { infinitive: 'verzichten', meaningFr: 'renoncer', meaningAr: 'يتنازل', level: 'C1',
    forms: { ich: 'verzichte', du: 'verzichtest', er: 'verzichtet', wir: 'verzichten', ihr: 'verzichtet', sie: 'verzichten' } },
  { infinitive: 'übereinstimmen', meaningFr: 'concorder', meaningAr: 'يتوافق', level: 'C1', separable: true,
    forms: { ich: 'stimme überein', du: 'stimmst überein', er: 'stimmt überein', wir: 'stimmen überein', ihr: 'stimmt überein', sie: 'stimmen überein' } },
]

const LEVEL_ORDER: VerbLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

/** Cumulative pool: B1 drill includes A1+A2+B1, etc. */
export function verbsForLevel(level: VerbLevel): Verb[] {
  const maxIdx = LEVEL_ORDER.indexOf(level)
  return VERB_POOL.filter(v => LEVEL_ORDER.indexOf(v.level) <= maxIdx)
}

export const PERSON_LABELS_FR: Record<keyof Verb['forms'], string> = {
  ich: 'ich',
  du: 'du',
  er: 'er / sie / es',
  wir: 'wir',
  ihr: 'ihr',
  sie: 'sie / Sie',
}

export const PERSON_LABELS_AR: Record<keyof Verb['forms'], string> = {
  ich: 'ich (أنا)',
  du: 'du (أنت)',
  er: 'er / sie / es (هو / هي)',
  wir: 'wir (نحن)',
  ihr: 'ihr (أنتم)',
  sie: 'sie / Sie (هم / حضرتك)',
}
