/* eslint-disable */
const fs = require('fs')
const path = require('path')

const CSS = `
/* ============================================================
   DASHBOARD
   ============================================================ */
.dash { min-height: 100vh; background: var(--bg); }

/* Hero */
.dash-hero {
  position: relative;
  padding: 56px 0 36px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
}
.dash-hero-glow {
  position: absolute; inset: -20% -10% auto -10%; height: 60%;
  background:
    radial-gradient(600px 260px at 15% 30%, oklch(0.72 0.26 25 / 0.18), transparent 70%),
    radial-gradient(500px 240px at 85% 40%, oklch(0.66 0.15 195 / 0.18), transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}
.dash-hero-inner {
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 32px; flex-wrap: wrap; position: relative;
}
.dash-hero-id { display: flex; gap: 20px; align-items: center; min-width: 0; flex: 1; }
.dash-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--bg);
  box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 0 0 1px var(--border);
  flex: none;
}
.dash-avatar-fallback {
  display: grid; place-items: center;
  background: linear-gradient(135deg, oklch(0.72 0.26 25 / 0.22), oklch(0.66 0.15 195 / 0.22));
  font-size: 32px; font-weight: 800; color: var(--text);
}
.dash-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800; letter-spacing: -0.02em;
  margin: 8px 0 6px;
}
.dash-sub { color: var(--muted); font-size: 15px; margin: 0; }

/* Path switcher */
.dash-path-switch {
  display: inline-flex; gap: 6px;
  padding: 6px; border-radius: 999px;
  background: var(--bg-warm);
  border: 1px solid var(--border);
}
.dash-path-pill {
  appearance: none; border: 0; background: transparent;
  padding: 10px 18px; border-radius: 999px;
  font-size: 14px; font-weight: 600; color: var(--muted);
  cursor: pointer; transition: all .2s ease;
  white-space: nowrap;
}
.dash-path-pill:hover { color: var(--text); }
.dash-path-pill.is-active {
  background: var(--bg);
  color: var(--text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.dash-path-pill.is-active[data-c="brand"] { color: oklch(0.56 0.22 28); }
.dash-path-pill.is-active[data-c="teal"]  { color: oklch(0.46 0.14 195); }

/* Body grid */
.dash-body { padding: 40px 0 80px; }
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 20px;
}
@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }

.dash-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow .25s ease, transform .25s ease;
}
.dash-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.06); }

.dash-card-head {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; gap: 12px;
}
.dash-card-head h2 {
  font-size: 18px; font-weight: 700; letter-spacing: -0.01em;
  margin: 0;
}
.dash-card-link {
  font-size: 13px; font-weight: 600; color: var(--muted);
  text-decoration: none;
}
.dash-card-link:hover { color: var(--text); }

/* Profile completion card */
.dash-card-profile { display: flex; flex-direction: column; }
.dash-pct-badge {
  font-size: 12px; font-weight: 700;
  padding: 4px 10px; border-radius: 999px;
  background: oklch(0.72 0.26 25 / 0.12);
  color: oklch(0.56 0.22 28);
}
.dash-progress-ring {
  --pct: 0;
  width: 140px; height: 140px;
  margin: 8px auto 20px;
  border-radius: 50%;
  background:
    conic-gradient(
      oklch(0.72 0.26 25) calc(var(--pct) * 1%),
      oklch(0.72 0.26 25 / 0.12) 0
    );
  display: grid; place-items: center;
  position: relative;
}
.dash-progress-inner {
  width: 106px; height: 106px; border-radius: 50%;
  background: var(--bg);
  display: grid; place-items: center;
}
.dash-progress-num {
  font-size: 32px; font-weight: 800; color: var(--text);
  letter-spacing: -0.02em;
}
.dash-progress-num small {
  font-size: 14px; font-weight: 700; color: var(--muted);
  margin-inline-start: 2px;
}

.dash-complete {
  text-align: center; font-size: 14px; font-weight: 600;
  color: oklch(0.46 0.14 155); margin: 12px 0 0;
}

.dash-check-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.dash-check-list li {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 12px;
  background: var(--bg-warm);
  font-size: 14px;
}
.dash-check-list li.is-done { opacity: 0.55; text-decoration: line-through; }
.dash-check {
  width: 22px; height: 22px; border-radius: 50%;
  display: grid; place-items: center;
  background: oklch(0.92 0.02 160);
  color: oklch(0.46 0.14 155);
  font-size: 12px; font-weight: 800;
  flex: none;
}
.dash-check-list li.is-done .dash-check {
  background: oklch(0.72 0.18 155);
  color: white;
}
.dash-check-label { flex: 1; min-width: 0; }
.dash-check-fix {
  font-size: 12px; font-weight: 700;
  color: oklch(0.56 0.22 28);
  text-decoration: none;
  white-space: nowrap;
}
.dash-check-fix:hover { text-decoration: underline; }

/* Journey tracker */
.dash-card-journey .dash-journey {
  display: grid; gap: 10px;
}
.dash-step {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  gap: 16px; align-items: center;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--bg-warm);
  text-decoration: none; color: inherit;
  transition: all .25s ease;
}
.dash-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
  border-color: transparent;
}
.dash-step[data-c="brand"]:hover { background: oklch(0.72 0.26 25 / 0.06); }
.dash-step[data-c="teal"]:hover  { background: oklch(0.66 0.15 195 / 0.06); }
.dash-step-num {
  font-size: 11px; font-weight: 800; color: var(--muted);
  letter-spacing: 0.1em;
}
.dash-step-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center;
  font-size: 22px; flex: none;
  background: var(--bg);
  border: 1px solid var(--border);
}
.dash-step-body { min-width: 0; }
.dash-step-body h3 {
  font-size: 15px; font-weight: 700; letter-spacing: -0.01em;
  margin: 0 0 2px;
}
.dash-step-body p {
  font-size: 12.5px; color: var(--muted);
  margin: 0 0 6px;
  line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  overflow: hidden;
}
.dash-step-status {
  display: inline-block;
  font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 999px;
  letter-spacing: 0.02em;
}
.dash-step-status.status-todo  { background: var(--bg); color: var(--muted); border: 1px solid var(--border); }
.dash-step-status.status-doing { background: oklch(0.84 0.18 75 / 0.18); color: oklch(0.48 0.18 60); }
.dash-step-status.status-done  { background: oklch(0.72 0.18 155 / 0.18); color: oklch(0.46 0.14 155); }
.dash-step-status.status-soon  { background: oklch(0.66 0.15 195 / 0.14); color: oklch(0.46 0.14 195); }
.dash-step-arrow {
  font-size: 20px; color: var(--muted);
  transition: transform .25s ease;
}
.dash-step:hover .dash-step-arrow { transform: translateX(4px); color: var(--text); }
html[dir="rtl"] .dash-step-arrow { transform: scaleX(-1); }
html[dir="rtl"] .dash-step:hover .dash-step-arrow { transform: scaleX(-1) translateX(4px); }

/* Docs summary */
.dash-docs-count {
  font-size: 13px; color: var(--muted); font-weight: 600;
  margin: 0 0 12px;
}
.dash-docs-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.dash-docs-list li {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 12px;
  background: var(--bg-warm); font-size: 14px;
}
.dash-doc-icon { font-size: 20px; flex: none; }
.dash-doc-title {
  flex: 1; min-width: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-weight: 600;
}
.dash-doc-type {
  font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 999px;
  background: var(--bg);
  color: var(--muted);
  border: 1px solid var(--border);
  white-space: nowrap;
}
.dash-docs-empty { text-align: center; padding: 20px 0; color: var(--muted); }
.dash-docs-empty-icon { font-size: 40px; margin-bottom: 8px; }
.dash-docs-empty p { margin: 0; font-size: 13.5px; }

/* Quick tools */
.dash-tools { display: grid; gap: 10px; }
.dash-tool {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px; align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--border); border-radius: 14px;
  background: var(--bg-warm);
  text-decoration: none; color: inherit;
  transition: all .25s ease;
}
.dash-tool:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
  border-color: transparent;
}
.dash-tool[data-c="brand"]:hover { background: oklch(0.72 0.26 25 / 0.06); }
.dash-tool[data-c="teal"]:hover  { background: oklch(0.66 0.15 195 / 0.06); }
.dash-tool-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center;
  font-size: 22px;
  background: var(--bg); border: 1px solid var(--border);
}
.dash-tool h3 { font-size: 14.5px; font-weight: 700; margin: 0 0 2px; letter-spacing: -0.01em; }
.dash-tool p { font-size: 12px; color: var(--muted); margin: 0; line-height: 1.4; }
.dash-tool-arrow { font-size: 20px; color: var(--muted); transition: transform .25s ease; }
.dash-tool:hover .dash-tool-arrow { transform: translateX(4px); color: var(--text); }
html[dir="rtl"] .dash-tool-arrow { transform: scaleX(-1); }
html[dir="rtl"] .dash-tool:hover .dash-tool-arrow { transform: scaleX(-1) translateX(4px); }

/* Footer CTAs */
.dash-footer-ctas {
  display: flex; justify-content: center; gap: 12px;
  margin-top: 36px; flex-wrap: wrap;
}

@media (max-width: 640px) {
  .dash-hero-inner { align-items: flex-start; }
  .dash-hero-id { flex-direction: column; text-align: start; }
  .dash-path-switch { width: 100%; }
  .dash-path-pill { flex: 1; text-align: center; font-size: 13px; padding: 10px 10px; }
  .dash-step { grid-template-columns: auto 1fr auto; }
  .dash-step-num { display: none; }
}
`

const p = path.join(__dirname, '..', 'app', 'globals.css')
const current = fs.readFileSync(p, 'utf8')
if (current.includes('/* ===== DASHBOARD ===== */') || current.includes('DASHBOARD\n   ==')) {
  console.log('already present; skipping')
} else {
  fs.writeFileSync(p, current + CSS, 'utf8')
  console.log('appended dashboard CSS')
}
