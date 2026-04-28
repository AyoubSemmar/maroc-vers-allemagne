// Settings — read-only view of platform config + danger zone.
import type { AppLocale } from '@/i18n/routing'

export default async function AdminSettingsPage({
  params,
}: { params: Promise<{ locale: AppLocale }> }) {
  await params

  const env = (key: string, fallback = '—') =>
    process.env[key] ? `${process.env[key]?.slice(0, 8)}…` : fallback

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/contact-gogermany/30min'
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '—'

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Settings</h1>
          <p className="adm-page-sub">Platform configuration. Most values are read-only here — change them on Vercel → Project → Settings → Environment Variables.</p>
        </div>
      </header>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">Service endpoints</h3></div>
          <table className="adm-table">
            <tbody>
              <tr><td><strong>Calendly URL</strong></td><td><a className="adm-link" href={calendlyUrl} target="_blank" rel="noopener noreferrer">{calendlyUrl}</a></td></tr>
              <tr><td><strong>Supabase URL</strong></td><td style={{ fontFamily: 'monospace', fontSize: 12 }}>{supabaseUrl}</td></tr>
              <tr><td><strong>Anthropic key</strong></td><td>{env('ANTHROPIC_API_KEY', '⚠ not set')}</td></tr>
              <tr><td><strong>Replicate key</strong></td><td>{env('REPLICATE_API_TOKEN', '⚠ not set')}</td></tr>
              <tr><td><strong>Admin password</strong></td><td>{process.env.ADMIN_PASSWORD ? '✓ configured' : '⚠ not set'}</td></tr>
            </tbody>
          </table>
        </section>

        <section className="adm-card">
          <div className="adm-card-head"><h3 className="adm-card-title">Daily limits (v1.1)</h3></div>
          <table className="adm-table">
            <thead><tr><th>Feature</th><th>Free daily cap</th></tr></thead>
            <tbody>
              <tr><td>CV-AI improvement</td><td><span className="adm-pill adm-pill--brand">1 / day</span></td></tr>
              <tr><td>Anschreiben generation</td><td><span className="adm-pill adm-pill--brand">1 / day</span></td></tr>
              <tr><td>Photo enhancement</td><td><span className="adm-pill adm-pill--brand">2 / day</span></td></tr>
              <tr><td>Reading exercise</td><td><span className="adm-pill adm-pill--good">2 / level / day</span></td></tr>
              <tr><td>Writing exercise</td><td><span className="adm-pill adm-pill--good">2 / level / day</span></td></tr>
            </tbody>
          </table>
          <p style={{ fontSize: 12, color: 'var(--adm-ink-mute)', marginTop: 12, lineHeight: 1.5 }}>
            Limits are defined in <code style={{ fontFamily: 'monospace' }}>lib/entitlements.ts</code>. Edit there + redeploy to change.
          </p>
        </section>
      </div>

      <section className="adm-card" style={{ marginTop: 18 }}>
        <div className="adm-card-head"><h3 className="adm-card-title">Reference docs</h3></div>
        <div className="adm-row" style={{ alignItems: 'stretch' }}>
          <a href="/cost-report.html" target="_blank" className="adm-btn adm-btn--ghost">📄 Cost report (PDF-ready)</a>
          <a href="/social-launch-templates.html" target="_blank" className="adm-btn adm-btn--ghost">🎨 Social launch templates</a>
          <a href="https://github.com/AyoubSemmar/maroc-vers-allemagne" target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn--ghost">💻 GitHub repo</a>
        </div>
      </section>

      <div className="adm-banner adm-banner--warn" style={{ marginTop: 18 }}>
        ⚠️ Danger zone (DB-level operations like purging stale data, force-translating articles, etc.) lives in <code>scripts/</code> and runs from the local terminal — not this UI. On purpose.
      </div>
    </>
  )
}
