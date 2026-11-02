import { revalidatePath } from 'next/cache'
import { routing } from '@/i18n/routing'

/**
 * Refresh a public path in every locale.
 *
 * revalidatePath('/articles') does NOT match /[locale]/articles, so the cached
 * copies in the 15 locales must be named one by one. Pages now stay cached for
 * days (Vercel bills every ISR rewrite, by size — 2.3M write units in Oct 2026),
 * so an admin edit has to push its change out explicitly.
 */
export function revalidateLocalized(...paths: string[]) {
  // '' = the home page: '/' bare, '/fr' with its locale.
  for (const p of paths) {
    revalidatePath(p || '/')
    for (const l of routing.locales) revalidatePath(`/${l}${p}`)
  }
}

/** Every page that lists articles: home, the index, the hubs and the categories. */
export function revalidateArticleLists() {
  revalidateLocalized('', '/articles', '/studium', '/ausbildung')
  revalidatePath('/[locale]/categories/[name]', 'page')
}
