// Master ON/OFF for the entire live-classes product (booking page, my-course
// dashboard, classroom). Set to false to fully UNLIST it: every entry point
// hides (hub CTA, nav link, PWA tab/shortcut, my-course entry), the pages are
// noindexed, and the public booking page bounces non-admins back to the free
// course. Nothing is deleted — flip back to true to restore instantly. Admins
// (owner/teacher) keep access so it can still be managed/previewed.
export const CLASSES_ENABLED = false

// Public launch switch for the live German course (classes + graded devoirs).
// While false, the whole thing is hidden from the open site — no landing CTA,
// the /learn-german/classes booking page and the booking API are admin-only —
// so we can keep building it. Admins (the owner/teacher) always bypass.
// Flip to true to launch publicly. (Gated behind CLASSES_ENABLED above.)
export const CLASSES_LAUNCHED = true

// Countries where the live classes are offered, as Vercel x-vercel-ip-country
// (ISO-3166 alpha-2) codes: Morocco, France, Germany. Add/remove codes here to
// change where the offer is visible.
export const CLASSES_ALLOWED_COUNTRIES = ['MA', 'FR', 'DE'] as const

// Geo-gate switch. When true, the booking page + hub CTA are limited to
// CLASSES_ALLOWED_COUNTRIES (the live classes are an offline-paid offer targeted
// at those markets). Set to false to open the booking flow to every country —
// handy for testing the whole signup→book funnel from anywhere as a normal
// (non-admin) visitor. Admins always bypass. Read by both geo gates:
// lib/geo.ts (server page redirect) and app/api/geo/route.ts (client hub CTA).
export const CLASSES_GEO_GATED = true
