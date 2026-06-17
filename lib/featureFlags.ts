// Site-wide feature flags.
//
// CONSULTATIONS_ENABLED — the paid 1-on-1 consultation service (Calendly
// booking buttons, the /dashboard/services catalogue, and the path-hub
// consultation lead form). Turned OFF while the service is being reviewed;
// flip to `true` to re-launch it everywhere at once. No copy or wiring is
// deleted, so re-enabling is a one-line change.
export const CONSULTATIONS_ENABLED = false
