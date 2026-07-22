// Public launch switch for the live German course (classes + graded devoirs).
// While false, the whole thing is hidden from the open site — no landing CTA,
// the /learn-german/classes booking page and the booking API are admin-only —
// so we can keep building it. Admins (the owner/teacher) always bypass.
// Flip to true to launch publicly.
export const CLASSES_LAUNCHED = true

// Geo-gate switch. When true, the booking page + hub CTA are Morocco-only (the
// live classes are a MA-targeted, offline-paid offer). Set to false to open the
// booking flow to every country — handy for testing the whole signup→book
// funnel from outside Morocco as a normal (non-admin) visitor. Flip back to
// true to restore the MA-only production posture. Read by both geo gates:
// lib/geo.ts (server page redirect) and app/api/geo/route.ts (client hub CTA).
export const CLASSES_MOROCCO_ONLY = false
