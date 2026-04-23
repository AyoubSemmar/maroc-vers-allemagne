import { CVData } from '../cv-builder/types'
import { formatDate } from '../cv-builder/utils'

export default function TemplateDark({ data }: { data: CVData }) {
  const p = data.personalInfo
  return (
    <div dir="ltr" lang="de" style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.name}>{p.firstName || 'Vorname'} {p.lastName || 'Nachname'}</h1>
          {p.jobTitle && <p style={styles.jobTitle}>{p.jobTitle}</p>}
          {p.careerGoal && <p style={styles.careerGoal}>{p.careerGoal}</p>}
        </div>
        {p.profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profileImage} alt="" style={styles.avatar} />
        )}
      </header>

      <div style={styles.contactBar}>
        {p.email && <span>✉ {p.email}</span>}
        {p.phone && <span>☎ {p.phone}</span>}
        {(p.postalCode || p.city) && <span>📍 {[p.postalCode, p.city].filter(Boolean).join(' ')}</span>}
        {p.nationality && <span>🌍 {p.nationality}</span>}
      </div>

      <div style={styles.body}>
        <div style={styles.leftCol}>
          {data.experience.length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.h2}>Berufserfahrung</h2>
              {data.experience.map((e, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHead}>
                    <strong>{e.jobTitle}</strong>
                    <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
                  </div>
                  <div style={styles.sub}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                  {e.description && (
                    <ul style={styles.bullets}>
                      {e.description.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}

          {data.education.length > 0 && (
            <section style={styles.section}>
              <h2 style={styles.h2}>Ausbildung</h2>
              {data.education.map((e, i) => (
                <div key={i} style={styles.entry}>
                  <div style={styles.entryHead}>
                    <strong>{e.degree}{e.fieldOfStudy && ` — ${e.fieldOfStudy}`}</strong>
                    <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
                  </div>
                  <div style={styles.sub}>{e.institution}</div>
                  {e.description && <p style={styles.para}>{e.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div style={styles.rightCol}>
          {(p.dateOfBirth || p.placeOfBirth) && (
            <section style={styles.sideSection}>
              <h3 style={styles.h3}>Persönlich</h3>
              {p.dateOfBirth  && <p style={styles.sideText}>{formatDate(p.dateOfBirth)}</p>}
              {p.placeOfBirth && <p style={styles.sideText}>{p.placeOfBirth}</p>}
            </section>
          )}

          {data.skills.technical.length > 0 && (
            <section style={styles.sideSection}>
              <h3 style={styles.h3}>Skills</h3>
              {data.skills.technical.map((s, i) => (
                <div key={i} style={styles.sideItem}>▸ {s}</div>
              ))}
            </section>
          )}

          {data.skills.soft.length > 0 && (
            <section style={styles.sideSection}>
              <h3 style={styles.h3}>Soft Skills</h3>
              {data.skills.soft.map((s, i) => (
                <div key={i} style={styles.sideItem}>▸ {s}</div>
              ))}
            </section>
          )}

          {data.languages.length > 0 && (
            <section style={styles.sideSection}>
              <h3 style={styles.h3}>Sprachen</h3>
              {data.languages.map((l, i) => (
                <div key={i} style={styles.sideItem}>
                  {l.language} — <span style={{ color: ACCENT }}>{l.level}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

const ACCENT = '#f59e0b' // amber accent

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    background: '#18181b',
    color: '#e4e4e7',
    padding: '40px 44px',
    width: '794px',
    minHeight: '1123px',
    boxSizing: 'border-box',
    fontSize: 11.5,
    lineHeight: 1.5,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 14,
    borderBottom: `2px solid ${ACCENT}`,
  },
  headerLeft: { flex: 1 },
  name: { fontSize: 30, fontWeight: 800, margin: 0, color: '#fff', letterSpacing: 0.3 },
  jobTitle: { fontSize: 14, color: ACCENT, margin: '4px 0 0', fontWeight: 600, letterSpacing: 1 },
  careerGoal: { fontSize: 11.5, color: '#d4d4d8', margin: '8px 0 0', lineHeight: 1.6, maxWidth: 540 },
  avatar: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ACCENT}` },
  contactBar: {
    display: 'flex',
    gap: 18,
    padding: '12px 0',
    fontSize: 11,
    color: '#a1a1aa',
    borderBottom: '1px solid #27272a',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  body: { display: 'flex', gap: 28 },
  leftCol: { flex: 1 },
  rightCol: { width: 200 },
  section: { marginBottom: 22 },
  sideSection: { marginBottom: 18 },
  h2: { fontSize: 13, margin: '0 0 10px', color: ACCENT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 },
  h3: { fontSize: 11, margin: '0 0 8px', color: ACCENT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 },
  entry: { marginBottom: 12 },
  entryHead: { display: 'flex', justifyContent: 'space-between', gap: 8 },
  sub: { color: '#a1a1aa', fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  date: { fontSize: 10.5, color: '#71717a', whiteSpace: 'nowrap' },
  bullets: { margin: '5px 0 0 16px', padding: 0, fontSize: 11, color: '#d4d4d8' },
  para: { margin: '4px 0 0', fontSize: 11 },
  sideText: { fontSize: 11, margin: '2px 0', color: '#d4d4d8' },
  sideItem: { fontSize: 11, margin: '3px 0', color: '#d4d4d8' },
}
