// Public launch switch for the live German course (classes + graded devoirs).
// While false, the whole thing is hidden from the open site — no landing CTA,
// the /learn-german/classes booking page and the booking API are admin-only —
// so we can keep building it. Admins (the owner/teacher) always bypass.
// Flip to true to launch publicly.
export const CLASSES_LAUNCHED = false
