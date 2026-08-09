import { levels, getLevel } from './index'
import { localizeLesson } from './localize'
import type { AppLocale } from '@/i18n/routing'
import type { Lesson, Level } from './types'

// SEO grammar reference: one indexable topic per course lesson's grammar point.
// The deep grammar explanations already exist per-lesson in 15 languages but
// live inside the client-rendered interactive course, invisible to search. This
// module exposes them as a flat, server-renderable topic list with stable,
// keyword-rich slugs so /learn-german/grammar/<slug> can rank in every language.

export type GrammarTopic = {
  slug: string        // stable, English-derived, shared across all locales
  levelId: string     // 'A1'..'C1'
  lessonId: string    // e.g. 'a1-03'
  order: number       // position within its level
  enTitle: string     // English grammar title (used for the slug + hub fallback)
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')     // strip diacritics
    .replace(/[äöü]/g, (m) => ({ ä: 'ae', ö: 'oe', ü: 'ue' } as Record<string, string>)[m] || m)
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/g, '')
}

// Built once at module load. Slug = "<level>-<slugified English grammar title>",
// de-duplicated. Level prefix keeps A1/B2 topics with similar names distinct and
// makes the URL self-describing.
export const grammarTopics: GrammarTopic[] = (() => {
  const out: GrammarTopic[] = []
  const seen = new Set<string>()
  for (const level of levels) {
    for (const lesson of level.lessons) {
      const en = localizeLesson(lesson, level.id, 'en' as AppLocale)
      const enTitle = (en.grammar?.title || lesson.grammar.title || lesson.title || lesson.id).trim()
      const base = `${level.id.toLowerCase()}-${slugify(enTitle)}` || level.id.toLowerCase() + '-' + lesson.id
      let slug = base
      let n = 2
      while (seen.has(slug)) slug = `${base}-${n++}`
      seen.add(slug)
      out.push({ slug, levelId: level.id, lessonId: lesson.id, order: lesson.order, enTitle })
    }
  }
  return out
})()

export function getGrammarTopic(slug: string): GrammarTopic | undefined {
  return grammarTopics.find((t) => t.slug === slug)
}

export type LocalizedTopic = {
  topic: GrammarTopic
  lesson: Lesson
  level: Level
  prev?: GrammarTopic
  next?: GrammarTopic
}

// Resolve a slug to its fully-localized lesson for a given locale, plus the
// prev/next topic within the same level (for internal linking).
export function localizedTopic(slug: string, locale: AppLocale): LocalizedTopic | undefined {
  const topic = getGrammarTopic(slug)
  if (!topic) return undefined
  const level = getLevel(topic.levelId)
  if (!level) return undefined
  const lesson = level.lessons.find((l) => l.id === topic.lessonId)
  if (!lesson) return undefined
  const inLevel = grammarTopics.filter((t) => t.levelId === topic.levelId).sort((a, b) => a.order - b.order)
  const idx = inLevel.findIndex((t) => t.slug === slug)
  return {
    topic,
    lesson: localizeLesson(lesson, topic.levelId, locale),
    level,
    prev: idx > 0 ? inLevel[idx - 1] : undefined,
    next: idx >= 0 && idx < inLevel.length - 1 ? inLevel[idx + 1] : undefined,
  }
}

// Topics grouped by level, in course order — for the hub page.
export function grammarTopicsByLevel(locale: AppLocale): { level: Level; topics: { topic: GrammarTopic; title: string }[] }[] {
  return levels.map((level) => ({
    level,
    topics: grammarTopics
      .filter((t) => t.levelId === level.id)
      .sort((a, b) => a.order - b.order)
      .map((t) => {
        const lesson = level.lessons.find((l) => l.id === t.lessonId)!
        const loc = localizeLesson(lesson, level.id, locale)
        return { topic: t, title: loc.grammar?.title || t.enTitle }
      }),
  }))
}

// Strip markdown to a plain-text meta description (~155 chars).
export function plainDescription(md: string, max = 155): string {
  const text = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[*_`#>|]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}
