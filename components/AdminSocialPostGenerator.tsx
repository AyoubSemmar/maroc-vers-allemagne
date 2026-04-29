'use client'

/**
 * Admin social-post generator.
 *
 * Pairs Claude (writes the copy) with the four 1080×1080 templates from
 * /public/social-launch-templates.html. The visual rendering is a 1:1
 * port of those templates so anything generated here matches the
 * launch posts and can be dropped straight into Instagram / LinkedIn.
 *
 * Flow:
 *   1. Admin (optionally) picks a template type and types a topic hint.
 *   2. POST /api/admin/generate-social-post → Claude returns content
 *      shaped per template.
 *   3. We render a live preview AND keep the post in the DOM at full
 *      1080×1080 (just visually scaled) so the PNG export captures the
 *      right pixel size.
 *   4. "Download PNG" uses the html-to-image lib loaded from CDN on
 *      first click — same approach as the static templates page so we
 *      don't bloat the bundle.
 */

import { useEffect, useRef, useState } from 'react'

type Hook = {
  tagFr: string; tagAr: string
  headlineFr: string; headlineAr: string
  statNum: string
  statLabelFr: string; statLabelAr: string
}
type Fact = {
  tagFr: string; tagAr: string
  numText: string
  numSubFr: string
  summaryFr: string; summaryAr: string
}
type Explainer = {
  tagFr: string; tagAr: string
  qFr: string; qAr: string
  bigFr: string; bigAr: string
  stats: { num: string; labelFr: string; labelAr: string }[]
}
type Budget = {
  tagFr: string; tagAr: string
  headlineFr: string; headlineAr: string
  items: { icon: string; labelFr: string; value: string }[]
  totalLabelFr: string; totalLabelAr: string
  totalNum: string
  footAr: string
}
type CarouselSlide = {
  stepLabelFr: string; stepLabelAr: string
  titleFr: string; titleAr: string
  bodyFr: string; bodyAr: string
}
type Carousel = {
  seriesTagFr: string; seriesTagAr: string
  seriesTitleFr: string; seriesTitleAr: string
  seriesIntroFr: string; seriesIntroAr: string
  slides: CarouselSlide[]
}

type Draft =
  | { templateType: 'hook'; fields: Hook; topic: string }
  | { templateType: 'fact'; fields: Fact; topic: string }
  | { templateType: 'explainer'; fields: Explainer; topic: string }
  | { templateType: 'budget'; fields: Budget; topic: string }
  | { templateType: 'carousel'; fields: Carousel; topic: string }

const TEMPLATE_LABELS: Record<Draft['templateType'], string> = {
  hook: '📢 Hook (yellow border)',
  fact: '💡 Fun fact (orange wedge)',
  explainer: '📚 Explainer (Q&A + stats)',
  budget: '💸 Budget (browser frame)',
  carousel: '🧭 Carousel (5-slide guide)',
}

// CSS lifted from social-launch-templates.html, scoped under .gg-social
// so it doesn't bleed into the rest of the admin panel. Only the parts
// we actually use are kept; print/page-chrome rules are dropped.
const TEMPLATE_CSS = `
.gg-social {
  --navy: #0E1A36;
  --navy-deep: #0A1429;
  --navy-soft: #142244;
  --brand: #E27940;
  --brand-warm: #F08A2E;
  --gold: #F4C842;
  --red: #C8252C;
  --black: #1A1A1A;
  --line: rgba(255,255,255,0.08);
  --ink: #FFFFFF;
  --ink-soft: rgba(255,255,255,0.72);
  --ink-mute: rgba(255,255,255,0.5);
}
.gg-social * { box-sizing: border-box; }
/* Tag pills now host two separate <bdi> containers (one Latin, one
   Arabic) joined visually by a "·". Each <bdi> sets its own direction
   so the parent doesn't need any bidi rule — keeping it neutral
   prevents conflicts with the inner isolation. */
.gg-social .p1-tag, .gg-social .p2-tag, .gg-social .p3-tag, .gg-social .p4-tag,
.gg-social .cs-step {
  unicode-bidi: isolate;
}
/* Arabic-only blocks: lock direction so the * highlight wrapping doesn't
   accidentally re-set it. */
.gg-social .p1-ar, .gg-social .p2-ar, .gg-social .p3-q-ar, .gg-social .p3-big-ar,
.gg-social .p4-headline-ar, .gg-social .p4-window-foot,
.gg-social .cs-title-ar, .gg-social .cs-body-ar {
  unicode-bidi: isolate;
}

.gg-social .post {
  position: relative;
  width: 1080px;
  height: 1080px;
  background: var(--navy);
  color: var(--ink);
  overflow: hidden;
  isolation: isolate;
  border-radius: 8px;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Helvetica Neue", Arial, sans-serif;
}
.gg-social .post::before {
  content: ''; position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.4px);
  background-size: 24px 24px; pointer-events: none; z-index: 1;
}
.gg-social .logo {
  position: absolute; top: 64px; right: 64px;
  display: flex; align-items: center; gap: 18px; z-index: 30;
}
.gg-social .logo-mark {
  width: 92px; height: 92px; border-radius: 22px;
  background: linear-gradient(135deg, #E78B3D 0%, #D9542B 100%);
  box-shadow: 0 14px 32px -10px rgba(232,124,55,0.6);
  position: relative; display: grid; place-items: center; overflow: hidden;
}
.gg-social .logo-mark::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 16px;
  background: linear-gradient(to bottom,
    var(--black) 0%, var(--black) 33.33%,
    var(--red) 33.33%, var(--red) 66.66%,
    var(--gold) 66.66%, var(--gold) 100%);
}
.gg-social .logo-mark .g {
  color: white; font-weight: 900; font-size: 60px; line-height: 1;
  letter-spacing: -0.04em; margin-top: -8px;
}
.gg-social .logo-text { color: white; font-weight: 800; font-size: 38px; letter-spacing: -0.02em; }
.gg-social .url {
  position: absolute; bottom: 56px; right: 64px;
  font-size: 18px; letter-spacing: 0.34em; color: var(--ink-mute);
  text-transform: uppercase; z-index: 30; font-weight: 600;
}

/* HOOK */
.gg-social .p1-frame {
  position: absolute; inset: 36px; border-radius: 32px;
  border: 4px solid transparent;
  background:
    linear-gradient(var(--navy), var(--navy)) padding-box,
    linear-gradient(135deg, var(--brand-warm) 0%, var(--gold) 100%) border-box;
  z-index: 5; pointer-events: none;
}
.gg-social .p1-content {
  position: absolute; inset: 36px;
  display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
  /* extra right + bottom inset so long stat labels don't run under the
     URL footer (bottom: 56px right: 64px) */
  padding: 96px 72px 140px;
  z-index: 10;
}
.gg-social .p1-tag {
  font-size: 16px; color: var(--gold); font-weight: 800; letter-spacing: 0.22em;
  text-transform: uppercase; margin-bottom: 32px; padding: 10px 20px;
  background: rgba(244, 200, 66, 0.12); border: 1.5px solid rgba(244, 200, 66, 0.35);
  border-radius: 999px;
}
.gg-social .p1-headline {
  font-size: 76px; font-weight: 900; line-height: 1.04; letter-spacing: -0.025em;
  margin: 0 0 24px; max-width: 800px;
}
.gg-social .p1-headline em { font-style: normal; color: var(--gold); }
.gg-social .p1-ar {
  font-size: 56px; font-weight: 800; line-height: 1.3; color: var(--ink-soft);
  margin: 0 0 56px; max-width: 880px; direction: rtl;
}
.gg-social .p1-stat-row { display: flex; gap: 56px; margin-top: 12px; align-items: center; }
.gg-social .p1-stat-num {
  font-size: 132px; font-weight: 900; line-height: 1; color: var(--gold);
  letter-spacing: -0.03em; text-shadow: 0 6px 24px rgba(232,124,55,0.35);
}
.gg-social .p1-stat-label { font-size: 22px; color: var(--ink-soft); line-height: 1.4; max-width: 380px; }
.gg-social .p1-stat-label strong { color: white; font-size: 24px; display: block; margin-bottom: 4px; }

/* FACT */
.gg-social .p2-diagonal { position: absolute; inset: 0; z-index: 2; }
.gg-social .p2-diagonal::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--brand-warm) 0%, var(--gold) 100%);
  clip-path: polygon(40% 0, 100% 0, 100% 100%, 70% 100%);
}
.gg-social .p2-flag {
  position: absolute; left: 0; right: 0; bottom: 0; height: 18px;
  background: linear-gradient(to right,
    var(--black) 0%, var(--black) 33.33%,
    var(--red) 33.33%, var(--red) 66.66%,
    var(--gold) 66.66%, var(--gold) 100%);
  z-index: 25;
}
.gg-social .p2-content {
  /* bottom: 170 — clears the German-flag bar (h:18) and url (bottom 80, h~30) */
  position: absolute; inset: 0; padding: 140px 110px 170px; z-index: 10;
  display: flex; flex-direction: column; justify-content: space-between;
}
.gg-social .p2-bottom { padding-right: 240px; } /* don't let summary run under url */
.gg-social .p2-tag {
  font-size: 14px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 24px;
}
.gg-social .p2-stat { margin-top: 80px; max-width: 540px; }
.gg-social .p2-num {
  font-size: 240px; line-height: 0.95; font-weight: 900; color: #F4C842;
  letter-spacing: -0.06em; text-shadow: 0 6px 30px rgba(0,0,0,0.45);
}
.gg-social .p2-num-sub { font-size: 24px; color: var(--ink-soft); margin-top: 16px; max-width: 460px; line-height: 1.4; }
.gg-social .p2-bottom { display: flex; flex-direction: column; gap: 18px; max-width: 540px; }
.gg-social .p2-fr { font-size: 38px; font-weight: 800; line-height: 1.2; letter-spacing: -0.015em; }
.gg-social .p2-ar { font-size: 32px; font-weight: 700; line-height: 1.45; color: var(--ink-soft); direction: rtl; }

/* EXPLAINER */
.gg-social .p3-tri { position: absolute; inset: 0; z-index: 2; }
.gg-social .p3-tri::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(180deg, var(--brand-warm) 0%, var(--gold) 100%);
  clip-path: polygon(55% 0, 100% 0, 100% 95%);
}
.gg-social .p3-flag {
  position: absolute; left: 0; right: 0; bottom: 0; height: 14px;
  background: linear-gradient(to right,
    var(--black) 0%, var(--black) 33.33%,
    var(--red) 33.33%, var(--red) 66.66%,
    var(--gold) 66.66%, var(--gold) 100%);
  z-index: 25;
}
.gg-social .p3-content {
  /* bottom: 160 to clear flag bar (14) + url (60+~30) */
  position: absolute; left: 90px; right: 90px; top: 240px; bottom: 160px; z-index: 10;
  display: flex; flex-direction: column; justify-content: center; max-width: 720px;
}
.gg-social .p3-tag {
  font-size: 14px; color: var(--gold); font-weight: 800; letter-spacing: 0.22em;
  text-transform: uppercase; margin-bottom: 22px;
}
.gg-social .p3-q { font-size: 44px; font-weight: 700; line-height: 1.2; letter-spacing: -0.015em; margin: 0 0 8px; }
.gg-social .p3-q-ar { font-size: 38px; font-weight: 700; color: var(--ink-soft); line-height: 1.4; margin: 0 0 36px; direction: rtl; }
.gg-social .p3-big { font-size: 88px; font-weight: 900; line-height: 1.05; letter-spacing: -0.025em; margin: 0 0 14px; }
.gg-social .p3-big em { font-style: normal; color: var(--gold); }
.gg-social .p3-big-ar { font-size: 60px; font-weight: 900; color: var(--ink-soft); line-height: 1.3; margin: 0 0 32px; direction: rtl; }
.gg-social .p3-stats { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 6px; }
.gg-social .p3-stat {
  background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.12);
  border-radius: 18px; padding: 16px 22px;
}
.gg-social .p3-stat-num { font-size: 28px; font-weight: 900; color: var(--gold); line-height: 1; display: block; margin-bottom: 4px; }
.gg-social .p3-stat-lbl { font-size: 14px; color: var(--ink-soft); line-height: 1.3; }

/* BUDGET */
.gg-social .p4-window {
  position: absolute; left: 130px; right: 130px; top: 460px; bottom: 110px;
  background: var(--navy-deep); border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 20px; z-index: 5; overflow: hidden;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,0.5);
}
.gg-social .p4-window::before {
  content: ''; position: absolute; left: 0; right: 0; top: 0; height: 6px;
  background: linear-gradient(to right,
    var(--black) 0%, var(--black) 33.33%,
    var(--red) 33.33%, var(--red) 66.66%,
    var(--gold) 66.66%, var(--gold) 100%);
}
.gg-social .p4-dots { position: absolute; top: 22px; right: 22px; display: flex; gap: 8px; z-index: 6; }
.gg-social .p4-dot { width: 12px; height: 12px; border-radius: 50%; }
.gg-social .p4-dot.grey { background: #5a5a5a; }
.gg-social .p4-dot.gold { background: var(--gold); }
.gg-social .p4-dot.orange { background: var(--brand); }
.gg-social .p4-window-content { position: absolute; inset: 56px 50px 28px; display: flex; flex-direction: column; gap: 0; }
.gg-social .p4-line {
  display: flex; align-items: center; gap: 20px; padding: 18px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08); min-height: 70px;
}
.gg-social .p4-line-icon { font-size: 30px; flex: none; width: 48px; text-align: center; }
.gg-social .p4-line-fr { flex: 1; font-size: 24px; font-weight: 700; color: white; line-height: 1.2; letter-spacing: -0.005em; }
.gg-social .p4-line-val { font-size: 26px; font-weight: 900; color: var(--gold); flex: none; font-variant-numeric: tabular-nums; }
.gg-social .p4-total {
  margin-top: 4px; padding: 14px 22px;
  background: linear-gradient(135deg, rgba(232,124,55,0.18) 0%, rgba(244,200,66,0.12) 100%);
  border: 1.5px solid rgba(244,200,66,0.4); border-radius: 14px;
  display: flex; align-items: center; justify-content: space-between;
}
.gg-social .p4-total-label { font-size: 18px; font-weight: 800; color: white; letter-spacing: 0.04em; text-transform: uppercase; }
.gg-social .p4-total-num { font-size: 38px; font-weight: 900; color: var(--gold); }
.gg-social .p4-window-foot {
  margin-top: 14px; padding-top: 14px; border-top: 1px dashed rgba(255,255,255,0.12);
  text-align: center; font-size: 18px; font-weight: 600; color: var(--ink-soft); direction: rtl;
}
.gg-social .p4-headline-wrap {
  position: absolute; left: 130px; right: 130px; top: 200px; z-index: 8;
  display: flex; flex-direction: column; gap: 6px;
}
.gg-social .p4-tag {
  font-size: 14px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 8px;
}
.gg-social .p4-headline { font-size: 48px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.1; margin: 0; max-width: 820px; }
.gg-social .p4-headline em { font-style: normal; color: var(--gold); }
.gg-social .p4-headline-ar { font-size: 34px; font-weight: 800; color: var(--ink-soft); line-height: 1.35; direction: rtl; margin: 2px 0 0; }

/* CAROUSEL slide — matches the journey-themed reference templates:
   yellow→orange gradient frame, dashed flight path, city skyline, page indicator. */
.gg-social .cs-frame {
  position: absolute; inset: 28px; border-radius: 28px;
  border: 5px solid transparent;
  background:
    linear-gradient(180deg, #0E1A36 0%, #0A1429 100%) padding-box,
    linear-gradient(135deg, var(--brand-warm) 0%, var(--gold) 100%) border-box;
  z-index: 5; pointer-events: none;
}
.gg-social .cs-logo {
  position: absolute; top: 56px; left: 64px;
  display: flex; align-items: center; gap: 14px; z-index: 30;
}
.gg-social .cs-logo .logo-text { font-size: 30px; font-weight: 800; }
.gg-social .cs-logo .logo-mark { width: 56px; height: 56px; border-radius: 14px; }
.gg-social .cs-logo .logo-mark .g { font-size: 38px; margin-top: -4px; }
.gg-social .cs-logo .logo-mark::after { height: 10px; }

.gg-social .cs-path {
  position: absolute; inset: 0; z-index: 4; pointer-events: none;
}
.gg-social .cs-skyline {
  position: absolute; left: 60px; right: 60px; bottom: 70px;
  height: 130px; opacity: 0.32; z-index: 3; pointer-events: none;
}
.gg-social .cs-skyline svg { width: 100%; height: 100%; display: block; }

.gg-social .cs-content {
  position: absolute; left: 80px; right: 80px;
  top: 380px; bottom: 220px;
  z-index: 10; display: flex; flex-direction: column; justify-content: center;
}
.gg-social .cs-step {
  font-size: 18px; font-weight: 800; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--gold); margin-bottom: 18px;
}
.gg-social .cs-title {
  font-size: 64px; font-weight: 900; letter-spacing: -0.025em;
  line-height: 1.05; margin: 0 0 14px; max-width: 880px;
}
.gg-social .cs-title em { font-style: normal; color: var(--gold); }
.gg-social .cs-title-ar {
  font-size: 44px; font-weight: 800; color: var(--ink-soft);
  line-height: 1.3; direction: rtl; margin: 0 0 28px; max-width: 880px;
}
.gg-social .cs-body {
  font-size: 24px; font-weight: 500; color: var(--ink-soft);
  line-height: 1.45; margin: 0 0 10px; max-width: 820px;
}
.gg-social .cs-body-ar {
  font-size: 22px; font-weight: 500; color: var(--ink-mute);
  line-height: 1.55; direction: rtl; margin: 0; max-width: 820px;
}

/* Cover slide: bigger title, smaller body region (intro). */
.gg-social .cs-cover .cs-title { font-size: 78px; }
.gg-social .cs-cover .cs-title-ar { font-size: 50px; }

.gg-social .cs-page {
  position: absolute; left: 80px; bottom: 88px;
  display: flex; align-items: center; gap: 14px;
  font-size: 30px; font-weight: 900; color: var(--ink-soft);
  z-index: 30; font-variant-numeric: tabular-nums;
}
.gg-social .cs-page .cs-page-tick {
  width: 60px; height: 4px; background: var(--gold); border-radius: 2px;
}
.gg-social .cs-page .cs-page-tick.dim { background: rgba(255,255,255,0.18); }
.gg-social .cs-page .cs-page-num strong { color: var(--gold); }
.gg-social .cs-url {
  position: absolute; right: 80px; bottom: 90px;
  font-size: 18px; letter-spacing: 0.34em; color: var(--ink-mute);
  text-transform: uppercase; z-index: 30; font-weight: 600;
}
`

// Continuous "journey from Morocco to Germany" path threaded across the
// 5 carousel slides. Each path's left/right edge anchor matches the
// previous/next slide so when posted as an Instagram swipe set the
// dashed line visually flows from slide 1 to slide 5.
//
// Slide-to-slide handoff y-coordinates (chosen to feel natural, not flat):
//   exit slide 1 → enter slide 2: y = 240   (top-right of slide 1)
//   exit slide 2 → enter slide 3: y = 380
//   exit slide 3 → enter slide 4: y = 280
//   exit slide 4 → enter slide 5: y = 220
//   slide 5 ends at the flag pin at (200, 320)
const CS_PATHS = [
  // slide 1 — takeoff from bottom-left, climbs to airplane at top-right (1040, 200)
  'M -40 920 C 220 880 380 700 540 540 S 880 280 1040 200',
  // slide 2 — enters left at y=240, gentle wave, exits right at y=380
  'M -40 240 C 200 320 360 480 540 460 S 880 360 1120 380',
  // slide 3 — enters left at y=380, dips up over the middle, exits right at y=280
  'M -40 380 C 220 360 420 220 620 280 S 940 360 1120 280',
  // slide 4 — enters left at y=280, swoops down then up, exits right at y=220
  'M -40 280 C 200 420 420 460 620 380 S 940 240 1120 220',
  // slide 5 — enters right at y=220, descends to the German-flag pin at (200, 320)
  'M 1120 220 C 880 240 700 280 540 300 S 320 320 200 320',
] as const

// X/Y location of the airplane on slide 1 and the flag-pin on slide 5,
// matching the path endpoints above.
const CS_AIRPLANE = { x: 1040, y: 200, rotateDeg: -25 } as const
const CS_FLAGPIN  = { x: 200,  y: 200 } as const

function CsPath({ index }: { index: number }) {
  const d = CS_PATHS[Math.min(index, CS_PATHS.length - 1)]
  return (
    <svg viewBox="0 0 1080 1080" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <path
        d={d}
        fill="none"
        stroke="#F4C842"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="22 22"
        opacity="0.85"
      />
      {index === 0 && (
        // Slide 1: airplane lifting off at the end of the dashed path
        <g transform={`translate(${CS_AIRPLANE.x} ${CS_AIRPLANE.y}) rotate(${CS_AIRPLANE.rotateDeg})`}>
          <path
            d="M -60 -8 L 30 -8 L 60 -28 L 78 -22 L 50 8 L 80 8 L 96 -8 L 108 -4 L 92 14 L 108 32 L 96 36 L 80 20 L 50 20 L 78 50 L 60 56 L 30 36 L -60 36 Z"
            fill="#F4C842"
            stroke="#F4C842"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}
      {index === CS_PATHS.length - 1 && (
        // Slide 5: German-flag pin planted at the destination
        <g transform={`translate(${CS_FLAGPIN.x} ${CS_FLAGPIN.y})`}>
          <line x1="0" y1="0" x2="0" y2="120" stroke="#F4C842" strokeWidth="6" />
          <circle cx="0" cy="124" r="14" fill="none" stroke="#F4C842" strokeWidth="6" />
          <rect x="2" y="0"  width="80" height="22" fill="#1A1A1A" />
          <rect x="2" y="22" width="80" height="22" fill="#C8252C" />
          <rect x="2" y="44" width="80" height="22" fill="#F4C842" />
        </g>
      )}
    </svg>
  )
}

// Light, line-only Berlin-ish skyline silhouette anchored to the bottom edge.
function CsSkyline() {
  return (
    <svg viewBox="0 0 960 130" preserveAspectRatio="none">
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
        {/* TV tower */}
        <line x1="80"  y1="130" x2="80"  y2="40" />
        <circle cx="80" cy="32" r="14" />
        <line x1="80"  y1="18"  x2="80"  y2="0" />
        {/* Block buildings */}
        <rect x="130" y="60"  width="80" height="70" />
        <line x1="170" y1="60" x2="170" y2="130" />
        <rect x="240" y="80"  width="120" height="50" />
        {/* Brandenburg-ish gate */}
        <rect x="400" y="55" width="200" height="75" />
        <line x1="440" y1="55" x2="440" y2="130" />
        <line x1="490" y1="55" x2="490" y2="130" />
        <line x1="555" y1="55" x2="555" y2="130" />
        {/* Cathedral dome */}
        <rect x="640" y="50" width="120" height="80" />
        <path d="M 640 50 C 660 18 740 18 760 50" />
        {/* Tall block */}
        <rect x="800" y="40" width="90" height="90" />
        <line x1="845" y1="40" x2="845" y2="130" />
      </g>
    </svg>
  )
}

function CsPageIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="cs-page">
      <div className={'cs-page-tick' + (current > 1 ? ' dim' : '')} />
      <div className="cs-page-num">
        <strong>{current}</strong> / {total}
      </div>
    </div>
  )
}

function CarouselSlideRender({
  index,
  total,
  isCover,
  stepLabelFr,
  stepLabelAr,
  titleFr,
  titleAr,
  bodyFr,
  bodyAr,
  exportId,
}: {
  index: number          // zero-based slide index
  total: number
  isCover: boolean
  stepLabelFr: string
  stepLabelAr: string
  titleFr: string
  titleAr: string
  bodyFr: string
  bodyAr: string
  exportId: string
}) {
  return (
    <article className={'post' + (isCover ? ' cs-cover' : '')} id={exportId}>
      <div className="cs-frame" />
      <div className="cs-logo logo">
        <span className="logo-text">GoGermany</span>
        <div className="logo-mark"><span className="g">G</span></div>
      </div>

      <div className="cs-path">
        <CsPath index={index} />
      </div>
      <div className="cs-skyline">
        <CsSkyline />
      </div>

      <div className="cs-content">
        <div className="cs-step"><Bilingual fr={stepLabelFr} ar={stepLabelAr} /></div>
        <h2 className="cs-title">{highlightStar(titleFr)}</h2>
        <p className="cs-title-ar">{titleAr}</p>
        <p className="cs-body">{bodyFr}</p>
        <p className="cs-body-ar">{bodyAr}</p>
      </div>

      <CsPageIndicator current={index + 1} total={total} />
      <div className="cs-url">www.gogermany.ma</div>
    </article>
  )
}

// Render an FR + AR pair with a "·" between them, each side in its own
// bidi-isolated container so neither script can corrupt the other's
// punctuation/digit ordering. This is THE root fix for the wrong-facing
// punctuation + flipped numbers we kept seeing in mixed-language strings.
function Bilingual({
  fr, ar, sep = ' · ', frClass, arClass, style,
}: {
  fr?: string; ar?: string; sep?: string
  frClass?: string; arClass?: string
  style?: React.CSSProperties
}) {
  if (!fr && !ar) return null
  return (
    <span style={{ display: 'inline-block', ...style }}>
      {fr && (
        <bdi
          className={frClass}
          style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
        >
          {fr}
        </bdi>
      )}
      {fr && ar && <span style={{ opacity: 0.55, margin: '0 6px' }}>{sep.trim()}</span>}
      {ar && (
        <bdi
          className={arClass}
          style={{ direction: 'rtl', unicodeBidi: 'isolate' }}
        >
          {ar}
        </bdi>
      )}
    </span>
  )
}

// Convert "before *highlighted* after" → JSX with the middle wrapped in <em>.
// Only the FIRST *…* span is highlighted (matches the brand convention of
// one accent per headline).
function highlightStar(s: string) {
  const m = s.match(/^([^*]*)\*([^*]+)\*(.*)$/)
  if (!m) return s
  return (
    <>
      {m[1]}
      <em>{m[2]}</em>
      {m[3]}
    </>
  )
}

function PostPreview({ draft }: { draft: Draft }) {
  if (draft.templateType === 'hook') {
    const f = draft.fields
    return (
      <article className="post" id="gg-export-target">
        <div className="p1-frame" />
        <div className="logo">
          <div className="logo-mark"><span className="g">G</span></div>
          <span className="logo-text">GoGermany</span>
        </div>
        <div className="p1-content">
          <span className="p1-tag"><Bilingual fr={f.tagFr} ar={f.tagAr} /></span>
          <h2 className="p1-headline">{highlightStar(f.headlineFr)}</h2>
          <p className="p1-ar">{f.headlineAr}</p>
          <div className="p1-stat-row">
            <div className="p1-stat-num">{f.statNum}</div>
            <div className="p1-stat-label">
              <strong>{f.statLabelFr}</strong>
              <bdi style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>{f.statLabelAr}</bdi>
            </div>
          </div>
        </div>
        <div className="url">www.gogermany.ma</div>
      </article>
    )
  }

  if (draft.templateType === 'fact') {
    const f = draft.fields
    return (
      <article className="post" id="gg-export-target">
        <div className="p2-diagonal" />
        <div className="logo">
          <div className="logo-mark"><span className="g">G</span></div>
          <span className="logo-text">GoGermany</span>
        </div>
        <div className="p2-content">
          <div>
            <div className="p2-tag"><Bilingual fr={f.tagFr} ar={f.tagAr} /></div>
            <div className="p2-stat">
              <div className="p2-num">{f.numText}</div>
              <p className="p2-num-sub">{f.numSubFr}</p>
            </div>
          </div>
          <div className="p2-bottom">
            <p className="p2-fr">{f.summaryFr}</p>
            <p className="p2-ar">{f.summaryAr}</p>
          </div>
        </div>
        <div className="p2-flag" />
        <div className="url" style={{ bottom: 80 }}>www.gogermany.ma</div>
      </article>
    )
  }

  if (draft.templateType === 'explainer') {
    const f = draft.fields
    return (
      <article className="post" id="gg-export-target">
        <div className="p3-tri" />
        <div className="logo">
          <div className="logo-mark"><span className="g">G</span></div>
          <span className="logo-text">GoGermany</span>
        </div>
        <div className="p3-content">
          <div className="p3-tag"><Bilingual fr={f.tagFr} ar={f.tagAr} /></div>
          <h2 className="p3-q">{f.qFr}</h2>
          <p className="p3-q-ar">{f.qAr}</p>
          <h3 className="p3-big">{highlightStar(f.bigFr)}</h3>
          <p className="p3-big-ar">{f.bigAr}</p>
          <div className="p3-stats">
            {f.stats.slice(0, 4).map((s, i) => (
              <div key={i} className="p3-stat">
                <span className="p3-stat-num">{s.num}</span>
                <span className="p3-stat-lbl">
                  <bdi style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{s.labelFr}</bdi>
                  <br />
                  <bdi style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>{s.labelAr}</bdi>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p3-flag" />
        <div className="url" style={{ bottom: 60 }}>www.gogermany.ma</div>
      </article>
    )
  }

  if (draft.templateType === 'budget') {
    const f = draft.fields
    return (
      <article className="post" id="gg-export-target">
        <div className="logo">
          <div className="logo-mark"><span className="g">G</span></div>
          <span className="logo-text">GoGermany</span>
        </div>
        <div className="p4-headline-wrap">
          <div className="p4-tag"><Bilingual fr={f.tagFr} ar={f.tagAr} /></div>
          <h2 className="p4-headline">{highlightStar(f.headlineFr)}</h2>
          <p className="p4-headline-ar">{f.headlineAr}</p>
        </div>
        <div className="p4-window">
          <div className="p4-dots">
            <span className="p4-dot grey" />
            <span className="p4-dot gold" />
            <span className="p4-dot orange" />
          </div>
          <div className="p4-window-content">
            {f.items.slice(0, 5).map((it, i) => (
              <div key={i} className="p4-line">
                <span className="p4-line-icon">{it.icon}</span>
                <span className="p4-line-fr">{it.labelFr}</span>
                <span className="p4-line-val">
                  <bdi style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{it.value}</bdi>
                </span>
              </div>
            ))}
            <div className="p4-total">
              <span className="p4-total-label">
                <Bilingual fr={f.totalLabelFr} ar={f.totalLabelAr} />
              </span>
              <span className="p4-total-num">
                <bdi style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>{f.totalNum}</bdi>
              </span>
            </div>
            <div className="p4-window-foot">{f.footAr}</div>
          </div>
        </div>
        <div className="url">www.gogermany.ma</div>
      </article>
    )
  }

  // Carousel: render 5 slides (cover + 4 steps) stacked vertically with a
  // gap so the admin can see all of them. Each slide gets its own export
  // id so we can capture them one at a time.
  const f = draft.fields
  const slides = (f.slides || []).slice(0, 4)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* Slide 1 — cover */}
      <CarouselSlideRender
        index={0}
        total={5}
        isCover
        stepLabelFr={f.seriesTagFr}
        stepLabelAr={f.seriesTagAr}
        titleFr={f.seriesTitleFr}
        titleAr={f.seriesTitleAr}
        bodyFr={f.seriesIntroFr}
        bodyAr={f.seriesIntroAr}
        exportId="gg-export-target-1"
      />
      {slides.map((s, i) => (
        <CarouselSlideRender
          key={i}
          index={i + 1}
          total={5}
          isCover={false}
          stepLabelFr={s.stepLabelFr}
          stepLabelAr={s.stepLabelAr}
          titleFr={s.titleFr}
          titleAr={s.titleAr}
          bodyFr={s.bodyFr}
          bodyAr={s.bodyAr}
          exportId={`gg-export-target-${i + 2}`}
        />
      ))}
    </div>
  )
}

// Lazy-load html-to-image from CDN on first download click. Avoids
// bundling 100 KB into the admin shell for a feature most admins
// won't use every session.
function loadHtmlToImage(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject('SSR')
  const w = window as any
  if (w.htmlToImage) return Promise.resolve(w.htmlToImage)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js'
    s.async = true
    s.onload = () => {
      const lib = (window as any).htmlToImage
      if (lib && lib.toPng) resolve(lib)
      else reject(new Error('html-to-image loaded but exports missing'))
    }
    s.onerror = () => reject(new Error('Failed to load html-to-image from CDN'))
    document.head.appendChild(s)
  })
}

export default function AdminSocialPostGenerator() {
  const [topic, setTopic] = useState('')
  const [templateType, setTemplateType] = useState<'random' | Draft['templateType']>('random')
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Inject the template CSS once. (Could also live in globals.css but
  // this keeps the feature self-contained — easy to lift out later.)
  useEffect(() => {
    const id = 'gg-social-template-style'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = TEMPLATE_CSS
    document.head.appendChild(style)
  }, [])

  async function generate() {
    setLoading(true)
    setError(null)
    setDraft(null)
    try {
      const resp = await fetch('/api/admin/generate-social-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || undefined,
          templateType: templateType === 'random' ? undefined : templateType,
        }),
      })
      // Defensive parse — see AdminAiArticleGenerator for why we don't
      // call resp.json() directly.
      const raw = await resp.text()
      let data: any = null
      try { data = raw ? JSON.parse(raw) : null } catch { /* HTML error page */ }
      if (!resp.ok || !data) {
        const msg =
          data?.error ||
          (resp.status === 504
            ? 'The generator timed out. Try again.'
            : `Generation failed (HTTP ${resp.status}).`)
        setError(msg)
        return
      }
      setDraft(data.draft)
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  async function exportOne(lib: any, target: HTMLElement, fileName: string) {
    const dataUrl = await lib.toPng(target, {
      width: 1080,
      height: 1080,
      pixelRatio: 2,
      backgroundColor: '#0E1A36',
      cacheBust: true,
      skipFonts: true,
      fontEmbedCSS: '',
    })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  async function downloadPng() {
    if (!draft) return
    setDownloading(true)
    setError(null)
    try {
      const lib = await loadHtmlToImage()

      // Carousel = 5 separate PNGs, captured one at a time. Single-slide
      // templates use the legacy id 'gg-export-target'.
      const isCarousel = draft.templateType === 'carousel'
      const ids = isCarousel
        ? ['gg-export-target-1', 'gg-export-target-2', 'gg-export-target-3', 'gg-export-target-4', 'gg-export-target-5']
        : ['gg-export-target']

      const ts = Date.now()
      for (let i = 0; i < ids.length; i++) {
        const target = document.getElementById(ids[i]) as HTMLElement | null
        if (!target) {
          if (isCarousel) continue // skip missing slide rather than abort the whole batch
          throw new Error('preview not in DOM')
        }
        const fileName = isCarousel
          ? `gogermany-carousel-${ts}-slide-${i + 1}.png`
          : `gogermany-${draft.templateType}-${ts}.png`
        await exportOne(lib, target, fileName)
        // tiny pause so the browser doesn't squash the download events
        if (isCarousel && i < ids.length - 1) await new Promise(r => setTimeout(r, 250))
      }
    } catch (e: any) {
      setError(e?.message || 'PNG export failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section className="adm-card" style={{
      marginBottom: 18,
      borderColor: '#a78bfa',
      background: 'linear-gradient(135deg, #faf5ff 0%, #fef3c7 100%)',
    }}>
      <div className="adm-card-head">
        <h3 className="adm-card-title">📣 Social-media post generator</h3>
        <span style={{ fontSize: 12, color: 'var(--adm-ink-mute)' }}>
          1080×1080 · brand-matched · FR + AR · download as PNG
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        <div className="adm-row" style={{ alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label className="adm-label">Topic hint (optional)</label>
            <input
              className="adm-input"
              placeholder="e.g. Anmeldung deadline · Krankenkasse comparison · Deutschlandticket"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              disabled={loading}
            />
          </div>
          <div style={{ minWidth: 220 }}>
            <label className="adm-label">Template</label>
            <select
              className="adm-select"
              value={templateType}
              onChange={e => setTemplateType(e.target.value as any)}
              disabled={loading}
            >
              <option value="random">🎲 Random (single slide)</option>
              <option value="hook">{TEMPLATE_LABELS.hook}</option>
              <option value="fact">{TEMPLATE_LABELS.fact}</option>
              <option value="explainer">{TEMPLATE_LABELS.explainer}</option>
              <option value="budget">{TEMPLATE_LABELS.budget}</option>
              <option value="carousel">{TEMPLATE_LABELS.carousel}</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="adm-btn"
            onClick={generate}
            disabled={loading}
          >
            {loading ? 'Generating…' : '✨ Generate post'}
          </button>
          {draft && (
            <>
              <button
                type="button"
                className="adm-btn"
                onClick={downloadPng}
                disabled={downloading || loading}
                style={{ background: '#16a34a' }}
              >
                {downloading
                  ? 'Rendering PNG…'
                  : draft.templateType === 'carousel'
                    ? '⬇ Download 5 PNGs'
                    : '⬇ Download PNG'}
              </button>
              <button
                type="button"
                className="adm-btn"
                onClick={generate}
                disabled={loading}
                style={{ background: '#0f172a' }}
              >
                🎲 Regenerate
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2', border: '1px solid #fca5a5', color: '#7f1d1d',
          borderRadius: 10, padding: 12, fontSize: 13, marginBottom: 12, fontFamily: 'monospace',
        }}>
          <strong>⚠ {error}</strong>
        </div>
      )}

      {draft && (
        <>
          <div style={{ fontSize: 12, color: 'var(--adm-ink-mute)', marginBottom: 8 }}>
            <strong>Topic:</strong> {draft.topic} ·{' '}
            <strong>Template:</strong> {TEMPLATE_LABELS[draft.templateType]}
          </div>

          {/* The preview: real 1080×1080 inside a viewport that scales it
              to ~600px wide so it fits the admin column. The DOM size
              is preserved so the PNG export grabs the right pixels.
              Carousels expand vertically to show all 5 slides. */}
          {(() => {
            const isCarousel = draft.templateType === 'carousel'
            const slideGapInner = 36 // matches the gap inside CarouselSlideRender stack
            const innerH = isCarousel ? 5 * 1080 + 4 * slideGapInner : 1080
            const scale = 0.574
            return (
              <div
                ref={previewRef}
                className="gg-social"
                style={{
                  width: '100%',
                  maxWidth: 620,
                  height: innerH * scale,
                  overflow: 'hidden',
                  borderRadius: 12,
                  margin: '0 auto',
                  background: '#0E1A36',
                }}
              >
                <div style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: 1080,
                  height: innerH,
                }}>
                  <PostPreview draft={draft} />
                </div>
              </div>
            )
          })()}
        </>
      )}
    </section>
  )
}
