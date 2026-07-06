// Central ad configuration, shared by AdSlot (renders units) and AdRail
// (decides whether to show the rail) so the two never disagree.
//
// Adsterra banner KEYS are public — they appear in page source for every
// visitor — so baking them in as defaults is safe and mirrors the hardcoded
// AdSense client. Per-environment env vars override when present.
export type AdFormat = 'vertical' | 'in-article'

export const ADSTERRA_KEY: Record<AdFormat, string | undefined> = {
  // 160x600 skyscraper — desktop sidebar rail.
  vertical: process.env.NEXT_PUBLIC_ADSTERRA_KEY_SIDEBAR || '261a948493ee0ae0b60c348930008a51',
  // 300x250 medium rectangle — in-content + mobile.
  'in-article': process.env.NEXT_PUBLIC_ADSTERRA_KEY_INARTICLE || '3ccbf217012e9d02089e5d238ddda3cd',
}

// AdSense per-placement slot ids (used once the account is approved). No
// baked-in default — AdSense only drives a slot when its id is set, and
// Adsterra takes precedence per format when both are present.
export const ADSENSE_SLOT: Record<AdFormat, string | undefined> = {
  vertical: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  'in-article': process.env.NEXT_PUBLIC_ADSENSE_SLOT_INARTICLE,
}

/** Fixed Adsterra banner dimensions per placement. */
export const ADSTERRA_SIZE: Record<AdFormat, { w: number; h: number }> = {
  vertical: { w: 160, h: 600 },
  'in-article': { w: 300, h: 250 },
}

// Adsterra Native Banner — used for the in-content slot (blends with the
// article text). Unlike the fixed banners it's injected into the page DOM (not
// an iframe) so it inherits the site's fonts/colours. `src` + `containerId`
// come straight from the unit's "Get code". Env-overridable; public values.
export const ADSTERRA_NATIVE = {
  src: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SRC ||
    'https://pl30234783.effectivecpmnetwork.com/cb5e783f9256ced8b3349602302f93e7/invoke.js',
  containerId: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER ||
    'container-cb5e783f9256ced8b3349602302f93e7',
}

/** The rail has something to show when any placement has an ad unit configured. */
export const ADS_CONFIGURED = Boolean(
  ADSTERRA_KEY.vertical || ADSTERRA_KEY['in-article'] || ADSTERRA_NATIVE.src ||
  ADSENSE_SLOT.vertical || ADSENSE_SLOT['in-article'],
)
