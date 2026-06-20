import type { LevelId } from './types'

/**
 * Easy German video integration.
 *
 * Easy German (https://www.youtube.com/@EasyGerman) publishes authentic,
 * subtitled German content. They organise videos into CEFR-level playlists
 * (A1–C1). We embed those playlists inside each lesson's "Watch" tab so
 * learners get real listening practice alongside the grammar/vocab/exercises.
 *
 * Two levels of granularity:
 *   1. `playlistId` — the level's whole playlist. Used as the default for
 *      every lesson in that level. The embedded player lets the learner
 *      browse the full playlist.
 *   2. `lessons[lessonId]` — an OPTIONAL specific video that matches a single
 *      lesson's topic. When set, that lesson shows the exact video (and still
 *      threads into the level playlist so the learner can keep watching).
 *
 * Fill `playlistId` with the part of the YouTube URL after `list=`.
 * Fill a lesson video with the part after `watch?v=` (the 11-char id).
 * Leave a field empty ('') to disable — the "Watch" tab hides automatically
 * when no video is configured, so there are never broken embeds.
 */

export const EASY_GERMAN_CHANNEL = {
  name: 'Easy German',
  url: 'https://www.youtube.com/@EasyGerman',
}

export type LevelVideoConfig = {
  /** YouTube playlist ID for this level (the value after `list=`). */
  playlistId: string
  /** Optional per-lesson specific video id (the value after `watch?v=`). */
  lessons?: Record<string, string>
}

// Playlist IDs are Easy German's official CEFR-level playlists (verified):
//   A1/A2 — "Easy German A1-A2" (Super Easy German, grammar/topic focused)
//   B1    — "German B1 | For Intermediate Learners"
//   B2    — "German B2 | For Upper Intermediate Learners"
//   C1    — "German C1 | For Advanced Learners"
// Per-lesson `lessons` entries pin a specific real video whose topic matches
// that lesson's title; all other lessons fall back to the level playlist.
const A1_A2_PLAYLIST = 'PLP_1XWsRux-b8SXezoumMOtZFbfkfGFsV'

export const EASY_GERMAN_VIDEOS: Record<LevelId, LevelVideoConfig> = {
  A1: {
    playlistId: A1_A2_PLAYLIST,
    lessons: {
      'a1-01': 'Yaelm87PTvg', // Introduce yourself in German (for absolute beginners)
      'a1-03': '9h8p08qziG0', // Conjugation of regular verbs: Sagen, Machen, Hören
      'a1-04': 'fivibJ7IaMA', // German Kitchen Vocabulary
      'a1-09': 'HXbYSKRNjqE', // Clothing
      'a1-12': 'uO0jWxhVW1A', // Basic Conversation Phrases 1
      'a1-13': 'QBBlMrj0lTw', // Learn all German Modal Verbs in 8 Minutes
    },
  },
  A2: {
    playlistId: A1_A2_PLAYLIST,
    lessons: {
      'a2-01': 'tj_YhY2RMxs', // Irregular Verbs: Haben, Sein, Gehen (Perfekt auxiliaries)
      'a2-10': 'RvcmpwHG1eQ', // The Weather
      'a2-14': 'lZXGpjKHHo8', // Irregular Verbs: Mögen
    },
  },
  B1: {
    playlistId: 'PLk1fjOl39-53yooogv6RaJAK29mx7nz1d',
    lessons: {
      'b1-01': 'UHJ3_4mWock', // What Is Your Biggest Wish? (Konjunktiv II — wishes)
      'b1-06': 'ABLwUHau5x8', // Learning German on the Job: How Youssef Became a Nurse
      'b1-10': 'G-WTBhyoK7o', // Small Things That Make Germans Happy (society)
      'b1-11': 's4R8XtZXYSM', // How Has Studying Abroad Changed You? (travel/experiences)
    },
  },
  B2: {
    playlistId: 'PLk1fjOl39-51lvdiuQYsLW-0aGIdNNknA',
    lessons: {
      'b2-09': 'eC4j_v8TBIU', // Job Interviews in Germany (Arbeitswelt und Karriere)
      'b2-11': 'FzI2Dfjtc-k', // Are men and women equal in Germany? (Meinung und Argumentation)
      'b2-14': '1H_r9nhnY90', // 6 Meanings of VIELLEICHT — German Modal Particles
    },
  },
  C1: {
    playlistId: 'PLk1fjOl39-53pjPz2VLCeu5vjOUMKZ22O',
    lessons: {
      'c1-07': 'oHQTvWu4shQ', // At a German Research Center (Wissenschaftliche Sprache)
      'c1-08': 'JBUBvonZNI4', // 11 Funny German Expressions Explained (Redewendungen)
      'c1-09': 'v-Wf1UoV-wU', // Germany's Political System Explained (Wirtschaft und Politik)
      'c1-12': 'nOAg4xyScmI', // 7 Tips to Better Understand Fast Spoken German (review)
      'c1-13': '-Awhco_VHWE', // Doch, Halt, Mal, Eben & Ja — modal particles (C1)
    },
  },
}

export type ResolvedLessonVideo = {
  /** Specific video to open first (optional — playlist-only if absent). */
  videoId?: string
  /** Playlist to thread into / browse. */
  playlistId?: string
}

/**
 * Resolve the video to show for a given lesson:
 *  - a lesson-specific video if mapped (threaded into the level playlist), else
 *  - the level playlist, else
 *  - null when nothing is configured (the Watch tab then hides).
 */
export function getLessonVideo(levelId: LevelId, lessonId: string): ResolvedLessonVideo | null {
  const cfg = EASY_GERMAN_VIDEOS[levelId]
  if (!cfg) return null
  const videoId = cfg.lessons?.[lessonId]
  if (videoId) return { videoId, playlistId: cfg.playlistId || undefined }
  if (cfg.playlistId) return { playlistId: cfg.playlistId }
  return null
}
