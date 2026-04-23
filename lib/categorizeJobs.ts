import { CATEGORIES, CategoryKey } from './jobCategories'

// Return the first category whose keywords match the job title (case-insensitive).
// Falls back to null if nothing matches (caller should skip storing it).
export function categorizeJob(title: string): CategoryKey | null {
  const t = title.toLowerCase()
  for (const cat of Object.values(CATEGORIES)) {
    for (const kw of cat.keywords) {
      if (t.includes(kw.toLowerCase())) return cat.key
    }
  }
  return null
}
