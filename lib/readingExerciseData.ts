// Daily reading-exercise specs for the Learn German tool. Each level
// declares its target word range, vocabulary/grammar rubric (sent to
// Claude for level-appropriate generation), and a topic pool from
// which the API picks a random theme so the daily text never repeats.

export type ReadingLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type ReadingLevelSpec = {
  level: ReadingLevel
  /** Target text length range. */
  minWords: number
  maxWords: number
  /** How many MCQ questions Claude should generate. */
  questionCount: number
  /** Rubric — vocabulary/grammar expected at this level. Passed verbatim. */
  rubric: string
  /** Topic pool — Claude picks one at random per generation. */
  topics: string[]
}

export const READING_SPECS: Record<ReadingLevel, ReadingLevelSpec> = {
  A1: {
    level: 'A1',
    minWords: 60,
    maxWords: 110,
    questionCount: 3,
    rubric:
      'A1 (Goethe-Zertifikat A1). Use only the present tense plus haben/sein/können in past. ~650 most-common words: family, daily routine, weather, food, hobbies, school, simple feelings. Very short sentences, basic connectors (und, aber, weil). Avoid Konjunktiv, Passiv, complex subordinate clauses, Genitiv.',
    topics: [
      'a typical day in a German family',
      'a young person describing their hobbies',
      'shopping for groceries at a supermarket',
      'the weather in different German cities',
      'a school day for a German pupil',
      'meeting a new friend at university',
      'a weekend trip to a German city',
      'cooking a simple German meal',
      'visiting grandparents in the village',
      'describing a small apartment',
      'a Saturday morning at the bakery',
      'a child\'s favourite pets',
      'morning routines before work',
      'a holiday at the seaside in Germany',
      'a birthday celebration with friends',
    ],
  },
  A2: {
    level: 'A2',
    minWords: 110,
    maxWords: 170,
    questionCount: 3,
    rubric:
      'A2 (Goethe-Zertifikat A2). Allow Perfekt and Präteritum of common verbs, modal verbs, simple werden-future. Connectors: und, aber, denn, weil, dass, wenn. Vocabulary ~1300 words: travel, work, shopping, health, plans. Short paragraphs OK. Avoid heavy Passiv and Genitiv.',
    topics: [
      'a memorable holiday in Bavaria',
      'first day at a new German workplace',
      'a doctor visit in Berlin',
      'planning a birthday party',
      'a visit to a Christmas market',
      'how Germans celebrate Karneval',
      'a problem with public transport',
      'finding an apartment in Hamburg',
      'a typical weekend with friends',
      'preparing for a job interview',
      'shopping for clothes in winter',
      'a school exchange between Morocco and Germany',
      'an Ausbildung student\'s daily life',
      'the differences between two German cities',
      'a phone call to book a hotel',
    ],
  },
  B1: {
    level: 'B1',
    minWords: 170,
    maxWords: 240,
    questionCount: 4,
    rubric:
      'B1 (Goethe-Zertifikat B1). Full Präteritum/Perfekt/Plusquamperfekt, Konjunktiv II for polite requests and wishes, simple Passiv. Connectors: obwohl, deshalb, trotzdem, falls. Express opinions, give reasons, narrate experiences. ~2700 words vocabulary.',
    topics: [
      'social media and its effect on young Germans',
      'a young newcomer adapting to life in Cologne',
      'why Germans love public libraries',
      'opinion: city versus countryside',
      'the rise of cycling in German cities',
      'recycling habits in German households',
      'experience of starting a new job',
      'health benefits of regular sport',
      'a controversy about smartphones in school',
      'the role of festivals in German culture',
      'cultural surprises for a newcomer in Germany',
      'the importance of learning a foreign language',
      'why Berufsschule is unique to Germany',
      'a personal story of overcoming a setback',
      'the impact of online shopping on local businesses',
    ],
  },
  B2: {
    level: 'B2',
    minWords: 240,
    maxWords: 340,
    questionCount: 4,
    rubric:
      'B2 (Goethe-Zertifikat B2). Konjunktiv I/II, all Passiv forms, Nominalstil, Partizipialkonstruktionen. Connectors: dennoch, infolgedessen, einerseits/andererseits, sofern, sodass. Argumentation with thesis, evidence, counter-argument. Abstract topics: society, environment, technology.',
    topics: [
      'remote work — opportunities and risks',
      'how AI is changing the German job market',
      'climate change and individual responsibility',
      'demographic change and the future of pensions',
      'social media regulation in Germany',
      'the German energy transition (Energiewende)',
      'integration of skilled migrants',
      'urbanisation and the housing crisis',
      'mental health awareness at the workplace',
      'why Germany has so many small companies (Mittelstand)',
      'the changing role of universities',
      'consumerism and minimalism',
      'pros and cons of mass tourism',
      'the future of the German automotive industry',
      'media bias and trust in journalism',
    ],
  },
  C1: {
    level: 'C1',
    minWords: 340,
    maxWords: 450,
    questionCount: 4,
    rubric:
      'C1 (Goethe-Zertifikat C1). Nuanced register, idiomatic phrases, gehobener Wortschatz, complex Konjunktiv forms, Funktionsverbgefüge, advanced connectors (zumal, ungeachtet dessen, sofern, geschweige denn). Sophisticated argumentation; long but clear sentences.',
    topics: [
      'the philosophical implications of artificial intelligence',
      'globalisation\'s effect on emerging economies',
      'the meritocracy debate',
      'state funding for culture and the arts',
      'demographic challenges and immigration policy',
      'the role of journalism in a polarised society',
      'urban-rural divide in modern Germany',
      'lifelong learning in the digital age',
      'the ethics of genetic engineering',
      'sustainable economic models versus growth',
      'identity politics and social cohesion',
      'the future of public broadcasting',
      'data privacy versus public security',
      'the German education system\'s strengths and limits',
      'memory culture and historical responsibility',
    ],
  },
}

/** UTC midnight ms when the next session unlocks. */
export function nextResetUtcMs(): number {
  const now = new Date()
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0,
  ))
  return tomorrow.getTime()
}

/** Today's UTC date as YYYY-MM-DD — used as a localStorage cache key
 * and as a seed for the topic pick so each calendar day looks fresh. */
export function todayKey(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}
