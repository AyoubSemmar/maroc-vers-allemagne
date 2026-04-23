import { CVData } from '../cv-builder/types'
import { formatDate } from '../cv-builder/utils'

export default function TemplateModern({ data }: { data: CVData }) {
  const p = data.personalInfo
  return (
    <div dir="ltr" lang="de" style={styles.page}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {p.profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profileImage} alt="" style={styles.avatar} />
        )}
        <div style={styles.sideBlock}>
          <h3 style={styles.sideH3}>Kontakt</h3>
          {p.email && <p style={styles.sideText}>✉ {p.email}</p>}
          {p.phone && <p style={styles.sideText}>☎ {p.phone}</p>}
          {p.address && <p style={styles.sideText}>📍 {p.address}</p>}
          {(p.postalCode || p.city) && <p style={styles.sideText}>{[p.postalCode, p.city].filter(Boolean).join(' ')}</p>}
        </div>

        {(p.dateOfBirth || p.placeOfBirth || p.nationality) && (
          <div style={styles.sideBlock}>
            <h3 style={styles.sideH3}>Persönlich</h3>
            {p.dateOfBirth  && <p style={styles.sideText}>🎂 {formatDate(p.dateOfBirth)}</p>}
            {p.placeOfBirth && <p style={styles.sideText}>📍 {p.placeOfBirth}</p>}
            {p.nationality  && <p style={styles.sideText}>🌍 {p.nationality}</p>}
          </div>
        )}

        {data.skills.technical.length > 0 && (
          <div style={styles.sideBlock}>
            <h3 style={styles.sideH3}>Fachkenntnisse</h3>
            {data.skills.technical.map((s, i) => (
              <div key={i} style={styles.skillPill}>{s}</div>
            ))}
          </div>
        )}

        {data.skills.soft.length > 0 && (
          <div style={styles.sideBlock}>
            <h3 style={styles.sideH3}>Soft Skills</h3>
            {data.skills.soft.map((s, i) => (
              <div key={i} style={styles.skillPill}>{s}</div>
            ))}
          </div>
        )}

        {data.languages.length > 0 && (
          <div style={styles.sideBlock}>
            <h3 style={styles.sideH3}>Sprachen</h3>
            {data.languages.map((l, i) => (
              <div key={i} style={styles.langRow}>
                <span>{l.language}</span>
                <span style={styles.langLevel}>{l.level}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.mainHeader}>
          <h1 style={styles.name}>{p.firstName || 'Vorname'} {p.lastName || 'Nachname'}</h1>
          {p.jobTitle && <p style={styles.jobTitle}>{p.jobTitle}</p>}
          {p.careerGoal && <p style={styles.careerGoal}>{p.careerGoal}</p>}
        </div>

        {data.experience.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.h2}>Berufserfahrung</h2>
            {data.experience.map((e, i) => (
              <div key={i} style={styles.entry}>
                <div style={styles.entryHead}>
                  <strong style={styles.entryTitle}>{e.jobTitle}</strong>
                  <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
                </div>
                <div style={styles.entrySub}>{[e.company, e.location].filter(Boolean).join(' · ')}</div>
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
                  <strong style={styles.entryTitle}>{e.degree}{e.fieldOfStudy && ` in ${e.fieldOfStudy}`}</strong>
                  <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
                </div>
                <div style={styles.entrySub}>{e.institution}</div>
                {e.description && <p style={styles.para}>{e.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

const ACCENT = '#2563eb'

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
    background: '#fff',
    color: '#111',
    display: 'flex',
    width: '794px',
    minHeight: '1123px',
    boxSizing: 'border-box',
    fontSize: 12,
    lineHeight: 1.5,
  },
  sidebar: {
    width: 260,
    background: ACCENT,
    color: '#fff',
    padding: '36px 24px',
    boxSizing: 'border-box',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid rgba(255,255,255,0.3)',
    display: 'block',
    margin: '0 auto 24px',
  },
  sideBlock: { marginBottom: 24 },
  sideH3: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottom: '1px solid rgba(255,255,255,0.35)',
    paddingBottom: 5,
    margin: '0 0 10px',
    fontWeight: 700,
  },
  sideText: { fontSize: 11, margin: '4px 0', wordBreak: 'break-word' },
  skillPill: {
    background: 'rgba(255,255,255,0.15)',
    padding: '4px 10px',
    fontSize: 11,
    borderRadius: 12,
    marginBottom: 5,
    display: 'inline-block',
    marginRight: 4,
  },
  langRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    margin: '3px 0',
  },
  langLevel: { fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '1px 8px', borderRadius: 8 },
  main: { flex: 1, padding: '36px 32px', boxSizing: 'border-box' },
  mainHeader: { marginBottom: 28 },
  name: { fontSize: 30, fontWeight: 800, margin: 0, color: '#111', lineHeight: 1.15 },
  jobTitle: { fontSize: 14, color: ACCENT, margin: '4px 0 0', fontWeight: 600 },
  careerGoal: { fontSize: 11.5, color: '#475569', margin: '8px 0 0', lineHeight: 1.6 },
  section: { marginBottom: 22 },
  h2: { fontSize: 15, margin: '0 0 10px', color: ACCENT, fontWeight: 700, borderLeft: `4px solid ${ACCENT}`, paddingLeft: 10 },
  entry: { marginBottom: 12 },
  entryHead: { display: 'flex', justifyContent: 'space-between', gap: 8 },
  entryTitle: { fontSize: 12.5 },
  entrySub: { fontSize: 11, color: '#555', fontStyle: 'italic' },
  date: { fontSize: 11, color: '#777', whiteSpace: 'nowrap' },
  bullets: { margin: '5px 0 0 16px', padding: 0, fontSize: 11 },
  para: { margin: '5px 0 0', fontSize: 11 },
}
