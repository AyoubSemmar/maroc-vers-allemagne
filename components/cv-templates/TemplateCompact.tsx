import { CVData } from '../cv-builder/types'
import { formatDate } from '../cv-builder/utils'

export default function TemplateCompact({ data }: { data: CVData }) {
  const p = data.personalInfo
  return (
    <div dir="ltr" lang="de" style={styles.page}>
      {/* Top band */}
      <div style={styles.topBand}>
        <div style={{ flex: 1 }}>
          <h1 style={styles.name}>{p.firstName || 'Vorname'} {p.lastName || 'Nachname'}</h1>
          {p.jobTitle && <p style={styles.jobTitle}>{p.jobTitle}</p>}
          {p.careerGoal && <p style={styles.careerGoal}>{p.careerGoal}</p>}
          <div style={styles.contactRow}>
            {p.email && <span>✉ {p.email}</span>}
            {p.phone && <span>☎ {p.phone}</span>}
            {(p.postalCode || p.city) && <span>📍 {[p.postalCode, p.city].filter(Boolean).join(' ')}</span>}
            {p.nationality && <span>🌍 {p.nationality}</span>}
            {p.dateOfBirth && <span>🎂 {formatDate(p.dateOfBirth)}</span>}
          </div>
        </div>
        {p.profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profileImage} alt="" style={styles.avatar} />
        )}
      </div>

      <div style={styles.twoCol}>
        {/* Left column */}
        <div style={styles.colLeft}>
          {data.experience.length > 0 && (
            <section>
              <h2 style={styles.h2}>Erfahrung</h2>
              {data.experience.map((e, i) => (
                <div key={i} style={styles.entryCompact}>
                  <div style={styles.entryHead}>
                    <strong style={{ fontSize: 11 }}>{e.jobTitle}</strong>
                    <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
                  </div>
                  <div style={styles.sub}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                  {e.description && (
                    <ul style={styles.bullets}>
                      {e.description.split('\n').filter(Boolean).slice(0, 3).map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {data.education.length > 0 && (
            <section style={{ marginTop: 10 }}>
              <h2 style={styles.h2}>Ausbildung</h2>
              {data.education.map((e, i) => (
                <div key={i} style={styles.entryCompact}>
                  <div style={styles.entryHead}>
                    <strong style={{ fontSize: 11 }}>{e.degree}{e.fieldOfStudy && `, ${e.fieldOfStudy}`}</strong>
                    <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
                  </div>
                  <div style={styles.sub}>{e.institution}</div>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div style={styles.colRight}>
          {data.skills.technical.length > 0 && (
            <section>
              <h2 style={styles.h2}>Skills</h2>
              <div style={styles.tagRow}>
                {data.skills.technical.map((s, i) => (
                  <span key={i} style={styles.tag}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {data.skills.soft.length > 0 && (
            <section style={{ marginTop: 10 }}>
              <h2 style={styles.h2}>Soft Skills</h2>
              <div style={styles.tagRow}>
                {data.skills.soft.map((s, i) => (
                  <span key={i} style={{ ...styles.tag, background: '#fef3c7' }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {data.languages.length > 0 && (
            <section style={{ marginTop: 10 }}>
              <h2 style={styles.h2}>Sprachen</h2>
              {data.languages.map((l, i) => (
                <div key={i} style={styles.langRow}>
                  <span>{l.language}</span>
                  <span style={styles.langBadge}>{l.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

const ACCENT = '#dc2626'

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    background: '#fff',
    color: '#1f2937',
    padding: '28px 32px',
    width: '794px',
    minHeight: '1123px',
    boxSizing: 'border-box',
    fontSize: 10.5,
    lineHeight: 1.4,
  },
  topBand: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
    paddingBottom: 12,
    borderBottom: `3px solid ${ACCENT}`,
    marginBottom: 14,
  },
  name: { fontSize: 24, fontWeight: 800, margin: 0, color: '#111', letterSpacing: 0.2 },
  jobTitle: { fontSize: 12, color: ACCENT, margin: '2px 0 4px', fontWeight: 600 },
  careerGoal: { fontSize: 10.5, color: '#475569', margin: '2px 0 6px', lineHeight: 1.45 },
  contactRow: { display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10, color: '#555' },
  avatar: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ACCENT}` },
  twoCol: { display: 'flex', gap: 20 },
  colLeft: { flex: 2 },
  colRight: { flex: 1 },
  h2: {
    fontSize: 11,
    margin: '0 0 6px',
    color: ACCENT,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 3,
  },
  entryCompact: { marginBottom: 6 },
  entryHead: { display: 'flex', justifyContent: 'space-between', gap: 6 },
  sub: { color: '#666', fontSize: 10, fontStyle: 'italic' },
  date: { fontSize: 9.5, color: '#888', whiteSpace: 'nowrap' },
  bullets: { margin: '3px 0 0 14px', padding: 0, fontSize: 10 },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  tag: { background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 8, fontSize: 10, fontWeight: 500 },
  langRow: { display: 'flex', justifyContent: 'space-between', margin: '3px 0', fontSize: 10.5 },
  langBadge: { background: ACCENT, color: '#fff', padding: '1px 7px', borderRadius: 6, fontSize: 10, fontWeight: 600 },
}
