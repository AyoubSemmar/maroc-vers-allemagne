// Daily writing-exercise prompts for the Learn German tool.
// Each level has its own word-count window and a bank of themes; the UI
// picks one at random per session. Themes are structured so the API
// route can deterministically build the German instruction for the
// student and the level-appropriate correction prompt for Claude.

export type WritingLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type LevelSpec = {
  level: WritingLevel
  /** Word count window the student must hit. */
  minWords: number
  maxWords: number
  /** Brief description of grammar/vocabulary expected at this level —
   *  passed verbatim to Claude so corrections stay level-appropriate. */
  rubric: string
}

export const LEVEL_SPECS: Record<WritingLevel, LevelSpec> = {
  A1: {
    level: 'A1',
    minWords: 30,
    maxWords: 50,
    rubric:
      'A1 (Goethe-Zertifikat A1). Use only the present tense and very simple connectors (und, aber, weil). Short sentences. Vocabulary limited to ~650 most-common words: family, daily routine, hobbies, weather, food, school, simple feelings. Avoid Konjunktiv, Passiv, complex subordinate clauses, Genitiv.',
  },
  A2: {
    level: 'A2',
    minWords: 50,
    maxWords: 80,
    rubric:
      'A2 (Goethe-Zertifikat A2). Allow Perfekt and Präteritum of common verbs, modal verbs, simple werden-future. Connectors: und, aber, denn, weil, dass, wenn. Short paragraphs OK. Vocabulary ~1300 words: travel, work, shopping, health, plans. Still avoid heavy Passiv and Genitiv.',
  },
  B1: {
    level: 'B1',
    minWords: 100,
    maxWords: 150,
    rubric:
      'B1 (Goethe-Zertifikat B1). Full Präteritum/Perfekt/Plusquamperfekt, Konjunktiv II für höfliche Bitten und Wünsche, simple Passiv. Connectors: obwohl, deshalb, trotzdem, falls. Express opinions, give reasons, narrate experiences. ~2700 words vocabulary.',
  },
  B2: {
    level: 'B2',
    minWords: 150,
    maxWords: 250,
    rubric:
      'B2 (Goethe-Zertifikat B2). Konjunktiv I/II, alle Passivformen, Nominalstil, Partizipialkonstruktionen. Connectors: dennoch, infolgedessen, einerseits/andererseits, sofern, sodass. Argument structure with thesis, evidence, counter-argument. Abstract topics: society, environment, technology.',
  },
  C1: {
    level: 'C1',
    minWords: 250,
    maxWords: 350,
    rubric:
      'C1 (Goethe-Zertifikat C1). Nuanced register, idiomatic phrases, gehobener Wortschatz, komplexe Konjunktivformen, Funktionsverbgefüge, advanced Konnektoren (zumal, ungeachtet dessen, sofern, geschweige denn). Argumentation should be sophisticated; sentences may be long but must remain clear.',
  },
}

/**
 * Theme bank per level. Each theme has:
 *  - id: stable key, used for i18n lookup of localised prompt + instructions
 *  - tagKey: i18n key under writingExercise.tags.* (one-word category badge)
 *
 * UI strings for each (the German instruction line shown to the student,
 * plus the theme title in the user's UI language) live in messages/*.json
 * under writingExercise.themes.<id>.{title,instruction,hint}
 */
export type Theme = { id: string; tagKey: string }

export const THEMES: Record<WritingLevel, Theme[]> = {
  A1: [
    { id: 'a1_self',         tagKey: 'self'      },
    { id: 'a1_family',       tagKey: 'family'    },
    { id: 'a1_daily',        tagKey: 'daily'     },
    { id: 'a1_hobby',        tagKey: 'hobbies'   },
    { id: 'a1_weekend',      tagKey: 'free_time' },
    { id: 'a1_food',         tagKey: 'food'      },
    { id: 'a1_room',         tagKey: 'home'      },
    { id: 'a1_weather',      tagKey: 'weather'   },
    { id: 'a1_friend',       tagKey: 'people'    },
    { id: 'a1_city',         tagKey: 'places'    },
  ],
  A2: [
    { id: 'a2_holiday',      tagKey: 'travel'    },
    { id: 'a2_school_day',   tagKey: 'school'    },
    { id: 'a2_shopping',     tagKey: 'daily'     },
    { id: 'a2_doctor',       tagKey: 'health'    },
    { id: 'a2_birthday',     tagKey: 'people'    },
    { id: 'a2_dream_trip',   tagKey: 'travel'    },
    { id: 'a2_work_day',     tagKey: 'work'      },
    { id: 'a2_apartment',    tagKey: 'home'      },
    { id: 'a2_movie',        tagKey: 'free_time' },
    { id: 'a2_germany_first',tagKey: 'culture'   },
  ],
  B1: [
    { id: 'b1_opinion_phone',  tagKey: 'opinion' },
    { id: 'b1_complaint',      tagKey: 'formal'  },
    { id: 'b1_email_friend',   tagKey: 'people'  },
    { id: 'b1_pros_cons_city', tagKey: 'opinion' },
    { id: 'b1_my_career',      tagKey: 'work'    },
    { id: 'b1_health_tip',     tagKey: 'health'  },
    { id: 'b1_bad_day',        tagKey: 'story'   },
    { id: 'b1_culture_shock',  tagKey: 'culture' },
    { id: 'b1_environment',    tagKey: 'society' },
    { id: 'b1_app_review',     tagKey: 'opinion' },
  ],
  B2: [
    { id: 'b2_social_media',     tagKey: 'society'    },
    { id: 'b2_remote_work',      tagKey: 'work'       },
    { id: 'b2_immigration',      tagKey: 'society'    },
    { id: 'b2_climate',          tagKey: 'environment'},
    { id: 'b2_education_reform', tagKey: 'education'  },
    { id: 'b2_ai_jobs',          tagKey: 'technology' },
    { id: 'b2_consumerism',      tagKey: 'society'    },
    { id: 'b2_generation_gap',   tagKey: 'culture'    },
    { id: 'b2_health_systems',   tagKey: 'society'    },
    { id: 'b2_minimum_wage',     tagKey: 'economy'    },
  ],
  C1: [
    { id: 'c1_digitalisation',     tagKey: 'technology' },
    { id: 'c1_demography',         tagKey: 'society'    },
    { id: 'c1_freedom_security',   tagKey: 'politics'   },
    { id: 'c1_globalisation',      tagKey: 'economy'    },
    { id: 'c1_meritocracy',        tagKey: 'society'    },
    { id: 'c1_arts_funding',       tagKey: 'culture'    },
    { id: 'c1_renewables',         tagKey: 'environment'},
    { id: 'c1_journalism',         tagKey: 'media'      },
    { id: 'c1_urban_rural',        tagKey: 'society'    },
    { id: 'c1_lifelong_learning',  tagKey: 'education'  },
  ],
}

/** Return today's theme for (level, userKey). Stable for the calendar
 * day so that refreshing doesn't re-roll. */
export function pickTodaysTheme(level: WritingLevel, userKey: string): Theme {
  const day = new Date()
  const seed = `${level}|${userKey}|${day.getUTCFullYear()}-${day.getUTCMonth()}-${day.getUTCDate()}`
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const list = THEMES[level]
  return list[Math.abs(h) % list.length]
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
