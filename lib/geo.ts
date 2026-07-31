import { headers } from 'next/headers'
import { CLASSES_ALLOWED_COUNTRIES } from '@/lib/classes-flags'

// The visitor's country (Vercel's x-vercel-ip-country header), or null when
// unknown. Dev has no edge header → treated as MA so local testing works.
export async function visitorCountry(): Promise<string | null> {
  if (process.env.NODE_ENV !== 'production') return 'MA'
  try {
    return (await headers()).get('x-vercel-ip-country')
  } catch {
    return null
  }
}

// True when the visitor is in a country where the live German classes are
// offered (CLASSES_ALLOWED_COUNTRIES: Morocco, France, Germany).
export async function isClassesCountry(): Promise<boolean> {
  const country = await visitorCountry()
  return country != null && (CLASSES_ALLOWED_COUNTRIES as readonly string[]).includes(country)
}
