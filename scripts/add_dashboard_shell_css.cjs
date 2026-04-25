/* eslint-disable */
const fs = require('fs')
const path = require('path')

const CSS = `
/* ============================================================
   DASHBOARD SHELL (sidebar + topbar + content)
   ============================================================ */
.dashshell {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: 100vh;
  background: var(--bg);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}
.dashshell-loading {
  grid-column: 1 / -1;
  display: grid; place-items: center;
  min-height: 100vh; color: var(--muted);
  font-size: 24px;
}

/* Sidebar */
.dashshell-sidebar {
  position: sticky; top: 0; align-self: start;
  height: 100vh;
  display: flex; flex-direction: column;
  background: oklch(0.97 0.015 80);   /* warm cream */
  border-inline-end: 1px solid var(--border);
  padding: 18px 14px;
  overflow: hidden;
}
html[data-theme="dark"] .dashshell-sidebar {
  background: oklch(0.22 0.015 80);
}

.dashshell-sidebar-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 6px 4px;
  margin-bottom: 14px;
}
.dashshell-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--text);
  min-width: 0;
}
.dashshell-logo-mark {
  width: 34px; height: 34px;
  display: grid; place-items: center;
  font-size: 10px; font-weight: 800;
  color: white;
  border-radius: 10px;
  background: linear-gradient(135deg, oklch(0.72 0.26 25), oklch(0.66 0.15 195));
  letter-spacing: 0.02em;
  flex: none;
}
.dashshell-logo-text {
  font-size: 17px; font-weight: 800; letter-spacing: -0.01em;
}
.dashshell-collapse {
  width: 32px; height: 32px; border-radius: 8px;
  background: transparent; border: 0; cursor: pointer;
  color: var(--muted);
  display: grid; place-items: center;
  transition: all .2s ease;
}
.dashshell-collapse:hover { background: var(--bg); color: var(--text); }

/* My Profile tile */
.dashshell-profile-tile {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg);
  text-decoration: none; color: inherit;
  margin-bottom: 14px;
  transition: all .2s ease;
}
.dashshell-profile-tile:hover {
  border-color: transparent;
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}
.dashshell-profile-tile.is-active {
  background: linear-gradient(135deg, oklch(0.72 0.26 25 / 0.08), oklch(0.66 0.15 195 / 0.08));
  border-color: oklch(0.72 0.26 25 / 0.3);
}
.dashshell-profile-ring {
  --pct: 0;
  width: 44px; height: 44px; border-radius: 50%;
  background: conic-gradient(
    oklch(0.72 0.26 25) calc(var(--pct) * 1%),
    oklch(0.72 0.26 25 / 0.12) 0
  );
  display: grid; place-items: center;
  flex: none;
}
.dashshell-profile-ring-inner {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--bg);
  display: grid; place-items: center;
  font-size: 11px; font-weight: 800;
  color: var(--text); letter-spacing: -0.02em;
}
.dashshell-profile-tile-text {
  display: grid; gap: 2px; min-width: 0;
}
.dashshell-profile-tile-label {
  display: inline-flex; align-items: center; gap: 6px;
  font-weight: 700; font-size: 14px; color: var(--text);
}
.dashshell-profile-tile-label svg { color: var(--muted); }
.dashshell-profile-tile-sub {
  font-size: 11.5px; color: var(--muted);
}

/* Scroll area with sections */
.dashshell-sidebar-scroll {
  flex: 1; overflow-y: auto;
  margin: 0 -4px;
  padding: 0 4px;
  scrollbar-width: thin;
}
.dashshell-section { margin-bottom: 14px; }
.dashshell-section-label {
  font-size: 10.5px; font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  padding: 10px 10px 6px;
}

.dashshell-nav-list {
  list-style: none; margin: 0; padding: 0;
  display: grid; gap: 2px;
}
.dashshell-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none; color: var(--text);
  font-size: 14px; font-weight: 600;
  transition: all .15s ease;
  position: relative;
  cursor: pointer;
}
.dashshell-nav-item:hover { background: var(--bg); }
.dashshell-nav-item.is-active {
  background: oklch(0.72 0.26 25 / 0.12);
  color: oklch(0.56 0.22 28);
}
html[data-theme="dark"] .dashshell-nav-item.is-active {
  background: oklch(0.72 0.26 25 / 0.22);
}
.dashshell-nav-item.is-locked {
  color: oklch(0.55 0.02 80);
  cursor: not-allowed;
}
.dashshell-nav-icon {
  width: 22px; height: 22px;
  display: grid; place-items: center;
  color: currentColor; flex: none;
}
.dashshell-nav-label { flex: 1; min-width: 0; }
.dashshell-lock { color: var(--muted); flex: none; display: grid; place-items: center; }
.dashshell-new-badge {
  font-size: 10px; font-weight: 800;
  color: oklch(0.48 0.18 60);
  background: oklch(0.84 0.18 75 / 0.25);
  padding: 2px 8px; border-radius: 999px;
  letter-spacing: 0.04em; text-transform: uppercase;
}

/* Footer actions */
.dashshell-sidebar-foot {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  display: grid; gap: 2px;
}
.dashshell-wa {
  background: oklch(0.66 0.18 155);
  color: white !important;
  font-weight: 700;
}
.dashshell-wa:hover { background: oklch(0.58 0.18 155); }
.dashshell-wa .dashshell-nav-icon { color: white; }

/* Main area */
.dashshell-main {
  display: flex; flex-direction: column;
  min-width: 0;
}
.dashshell-topbar {
  position: sticky; top: 0; z-index: 40;
  height: 64px;
  display: flex; align-items: center; gap: 12px;
  padding: 0 28px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.dashshell-topbar-menu {
  display: none;
  width: 36px; height: 36px;
  border-radius: 8px; border: 0;
  background: transparent; cursor: pointer;
  color: var(--text);
  place-items: center;
}
.dashshell-topbar-spacer { flex: 1; }
.dashshell-topbar-actions {
  display: flex; align-items: center; gap: 10px;
}
.dashshell-icon-btn {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  display: grid; place-items: center;
  cursor: pointer;
  transition: all .2s ease;
  position: relative;
}
.dashshell-icon-btn:hover {
  background: var(--bg-warm);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.dashshell-icon-wa {
  color: oklch(0.56 0.18 155);
  border-color: oklch(0.66 0.18 155 / 0.3);
}
.dashshell-notif-dot {
  position: absolute; top: 8px; right: 10px;
  width: 7px; height: 7px; border-radius: 50%;
  background: oklch(0.66 0.22 25);
  border: 2px solid var(--bg);
}
.dashshell-topbar-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center;
  background: linear-gradient(135deg, oklch(0.72 0.26 25), oklch(0.66 0.15 195));
  color: white; font-weight: 800; font-size: 15px;
  text-decoration: none;
  overflow: hidden;
  position: relative;
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 1px var(--border);
}
.dashshell-topbar-avatar img {
  width: 100%; height: 100%; object-fit: cover;
}
.dashshell-avatar-dot {
  position: absolute; bottom: -2px; inset-inline-end: -2px;
  width: 10px; height: 10px; border-radius: 50%;
  background: oklch(0.66 0.18 155);
  border: 2px solid var(--bg);
}

/* Content */
.dashshell-content {
  padding: 28px 28px 60px;
  flex: 1; min-width: 0;
}
.dashpage {
  max-width: 1200px;
  margin: 0 auto;
  display: flex; flex-direction: column; gap: 24px;
}

/* Responsive */
@media (max-width: 960px) {
  .dashshell { grid-template-columns: 1fr; }
  .dashshell-sidebar {
    position: fixed;
    top: 0; inset-inline-start: 0;
    z-index: 60;
    width: 280px;
    transform: translateX(-100%);
    transition: transform .25s ease;
  }
  html[dir="rtl"] .dashshell-sidebar { transform: translateX(100%); }
  .dashshell-sidebar.is-open { transform: translateX(0); }
  .dashshell-topbar-menu { display: grid; }
  .dashshell-content { padding: 20px 16px 60px; }
}

/* ============================================================
   DASHBOARD — PROFILE PAGE
   ============================================================ */
/* Hero completion banner (sky/cloud gradient replaces lighthouse photo) */
.dashprof-banner {
  position: relative; overflow: hidden;
  border-radius: 24px;
  background:
    radial-gradient(600px 220px at 85% 20%, oklch(0.82 0.12 75 / 0.7), transparent 70%),
    radial-gradient(700px 300px at 10% 80%, oklch(0.42 0.09 260 / 0.9), transparent 60%),
    linear-gradient(135deg, oklch(0.32 0.08 260), oklch(0.38 0.1 280));
  color: white;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}
.dashprof-banner-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(400px 180px at 50% 110%, oklch(0.72 0.26 25 / 0.25), transparent 70%);
  pointer-events: none;
}
.dashprof-banner-inner {
  position: relative;
  padding: 32px 36px;
  display: flex; flex-direction: column; gap: 22px;
}
.dashprof-banner-main {
  display: flex; gap: 16px; align-items: flex-start;
}
.dashprof-banner-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: oklch(0.72 0.26 25);
  color: white;
  display: grid; place-items: center;
  flex: none;
}
.dashprof-banner-title {
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 800; letter-spacing: -0.02em;
  margin: 0 0 4px;
  line-height: 1.2;
}
.dashprof-banner-sub {
  margin: 0; opacity: 0.85;
  font-size: 14.5px;
}
.dashprof-banner-body {
  display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center;
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 18px 20px;
}
.dashprof-unlock {
  display: flex; gap: 12px; align-items: center;
  grid-column: 1 / -1;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  margin-bottom: 4px;
}
.dashprof-unlock-icon {
  width: 30px; height: 30px; border-radius: 50%;
  background: oklch(0.78 0.18 75);
  color: oklch(0.32 0.1 260);
  display: grid; place-items: center;
  flex: none;
}
.dashprof-unlock-line { font-size: 12.5px; opacity: 0.7; }
.dashprof-unlock-target { font-size: 15px; font-weight: 700; }
.dashprof-missing {
  list-style: none; margin: 0; padding: 0;
  display: grid; gap: 10px;
  font-size: 15px;
}
.dashprof-missing li {
  display: flex; align-items: center; gap: 10px;
}
.dashprof-missing-done { font-size: 28px; }
.dashprof-star {
  color: oklch(0.82 0.18 75);
  font-size: 16px;
  flex: none;
}
.dashprof-banner-actions {
  display: flex; gap: 10px; align-items: center;
  justify-self: end;
}
.dashprof-btn-light {
  background: white !important;
  color: var(--text) !important;
}
.dashprof-btn-light:hover { background: oklch(0.96 0.02 80) !important; }
.dashprof-banner-bar {
  display: grid; gap: 8px;
}
.dashprof-banner-bar-label {
  display: flex; justify-content: space-between;
  font-size: 13px; font-weight: 700;
}
.dashprof-banner-bar-track {
  height: 10px; border-radius: 999px;
  background: rgba(255,255,255,0.15);
  overflow: hidden;
}
.dashprof-banner-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, oklch(0.72 0.26 25), oklch(0.82 0.18 75));
  border-radius: 999px;
  transition: width .4s ease;
}

/* Two stat cards */
.dashprof-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 820px) { .dashprof-stats { grid-template-columns: 1fr; } }

.dashprof-stat-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px 24px;
  display: flex; flex-direction: column; gap: 14px;
  transition: box-shadow .2s ease;
}
.dashprof-stat-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
.dashprof-stat-head {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
}
.dashprof-stat-title {
  display: flex; align-items: center; gap: 10px;
}
.dashprof-stat-title h3 { font-size: 15px; font-weight: 700; margin: 0; }
.dashprof-stat-icon {
  width: 26px; height: 26px; border-radius: 8px;
  display: grid; place-items: center; color: white;
}
.dashprof-stat-icon-warn { background: oklch(0.66 0.22 25); }
.dashprof-stat-icon-strength { background: oklch(0.66 0.22 25); }

.dashprof-stat-badge {
  font-size: 11px; font-weight: 800;
  padding: 4px 10px; border-radius: 999px;
  letter-spacing: 0.02em;
}
.dashprof-stat-badge.tier-weak {
  color: oklch(0.48 0.18 28);
  background: oklch(0.72 0.22 25 / 0.14);
}
.dashprof-stat-badge.tier-fair {
  color: oklch(0.48 0.18 60);
  background: oklch(0.82 0.18 75 / 0.22);
}
.dashprof-stat-badge.tier-strong {
  color: oklch(0.46 0.14 155);
  background: oklch(0.72 0.18 155 / 0.18);
}

.dashprof-stat-big {
  display: flex; align-items: baseline; gap: 8px;
  margin-top: -4px;
}
.dashprof-stat-num {
  font-size: 42px; font-weight: 800; letter-spacing: -0.03em;
  color: var(--text);
  line-height: 1;
}
.dashprof-stat-suffix { font-size: 14px; color: var(--muted); font-weight: 600; }

.dashprof-stat-bar {
  height: 8px; border-radius: 999px;
  background: var(--bg-warm);
  overflow: hidden;
}
.dashprof-stat-bar-fill {
  height: 100%; border-radius: 999px;
  transition: width .4s ease;
}
.dashprof-stat-bar-fill.tier-warn   { background: oklch(0.72 0.22 25); }
.dashprof-stat-bar-fill.tier-weak   { background: oklch(0.66 0.22 25); }
.dashprof-stat-bar-fill.tier-fair   { background: oklch(0.78 0.18 75); }
.dashprof-stat-bar-fill.tier-strong { background: oklch(0.66 0.18 155); }

.dashprof-stat-foot {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; color: var(--muted);
}
.dashprof-stat-foot strong { color: var(--text); font-weight: 700; }
.dashprof-stat-foot-right { text-align: end; }

/* Section cards (Education, Experience, Languages, ...) */
.dashprof-sections {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
@media (max-width: 820px) { .dashprof-sections { grid-template-columns: 1fr; } }

.dashprof-section-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px 22px;
  min-height: 120px;
  display: flex; flex-direction: column;
  transition: box-shadow .2s ease;
}
.dashprof-section-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.04); }
.dashprof-section-head {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.dashprof-section-head h3 {
  font-size: 16px; font-weight: 700; margin: 0;
}
.dashprof-section-add {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 999px;
  background: oklch(0.72 0.26 25 / 0.12);
  color: oklch(0.56 0.22 28);
  font-size: 12.5px; font-weight: 700;
  text-decoration: none;
  transition: background .2s ease;
}
.dashprof-section-add:hover { background: oklch(0.72 0.26 25 / 0.2); }
.dashprof-section-soon {
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 999px;
  background: var(--bg-warm);
  color: var(--muted);
}
.dashprof-section-empty {
  flex: 1;
  display: grid; place-items: center;
  color: var(--muted);
  font-size: 28px;
  padding: 20px 0;
  opacity: 0.4;
}

/* Promo */
.dashprof-promo {
  position: relative; overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, oklch(0.72 0.26 25), oklch(0.78 0.2 55));
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}
.dashprof-promo-glow {
  position: absolute; inset: 0;
  background: radial-gradient(400px 200px at 20% 120%, oklch(0.82 0.18 75 / 0.6), transparent 70%);
  pointer-events: none;
}
.dashprof-promo-inner {
  position: relative;
  display: flex; gap: 20px; align-items: center;
  justify-content: space-between; flex-wrap: wrap;
  padding: 26px 30px;
}
.dashprof-promo-eyebrow {
  font-size: 13px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 6px; opacity: 0.95;
}
.dashprof-promo-body {
  font-size: 18px; font-weight: 600;
  margin: 0; max-width: 620px; line-height: 1.45;
}
.dashprof-promo .btn-primary {
  background: white !important;
  color: oklch(0.56 0.22 28) !important;
}
.dashprof-promo .btn-primary:hover { background: oklch(0.98 0.02 80) !important; }

/* ============================================================
   DASHBOARD OVERVIEW (welcome row, path switch adjustments)
   ============================================================ */
.dash-welcome {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 24px; flex-wrap: wrap;
  margin-bottom: 4px;
}
.dash-welcome-title {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 800; letter-spacing: -0.02em;
  margin: 6px 0 4px;
}
.dash-welcome-sub { color: var(--muted); font-size: 14.5px; margin: 0; }

/* Stub pages */
.dashstub {
  max-width: 560px; margin: 60px auto;
  text-align: center;
  padding: 40px 28px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 24px;
}
.dashstub-icon {
  width: 80px; height: 80px;
  margin: 0 auto 20px;
  display: grid; place-items: center;
  border-radius: 24px;
  background: linear-gradient(135deg, oklch(0.72 0.26 25 / 0.14), oklch(0.66 0.15 195 / 0.14));
  color: oklch(0.56 0.22 28);
}
.dashstub h1 {
  font-size: 24px; font-weight: 800; letter-spacing: -0.02em;
  margin: 0 0 12px;
}
.dashstub p {
  color: var(--muted); font-size: 14.5px; line-height: 1.55;
  margin: 0 0 24px;
}
`

const p = path.join(__dirname, '..', 'app', 'globals.css')
const current = fs.readFileSync(p, 'utf8')
if (current.includes('DASHBOARD SHELL (sidebar')) {
  console.log('already present; skipping')
} else {
  fs.writeFileSync(p, current + CSS, 'utf8')
  console.log('appended dashboard shell CSS')
}
