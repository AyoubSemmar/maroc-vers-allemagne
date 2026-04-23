import { CVData } from '../cv-builder/types'
import { formatDate } from '../cv-builder/utils'

export default function TemplateMinimal({ data }: { data: CVData }) {
  const p = data.personalInfo
  return (
    <div dir="ltr" lang="de" style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.name}>{p.firstName || 'Vorname'} {p.lastName || 'Nachname'}</h1>
        {p.jobTitle && <p style={styles.jobTitle}>{p.jobTitle}</p>}
        {p.careerGoal && <p style={styles.careerGoal}>{p.careerGoal}</p>}
        <div style={styles.contact}>
          {[p.email, p.phone, [p.postalCode, p.city].filter(Boolean).join(' '), p.nationality].filter(Boolean).join('  ·  ')}
        </div>
      </header>

      <Divider />

      {data.experience.length > 0 && (
        <Section title="Erfahrung">
          {data.experience.map((e, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryHead}>
                <strong>{e.jobTitle}</strong>
                <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
              </div>
              <div style={styles.sub}>{[e.company, e.location].filter(Boolean).join(', ')}</div>
              {e.description && (
                <ul style={styles.bullets}>
                  {e.description.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Ausbildung">
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
        </Section>
      )}

      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <Section title="Kenntnisse">
          {data.skills.technical.length > 0 && (
            <p style={styles.para}><b>Technisch</b> — {data.skills.technical.join(', ')}</p>
          )}
          {data.skills.soft.length > 0 && (
            <p style={styles.para}><b>Soft Skills</b> — {data.skills.soft.join(', ')}</p>
          )}
        </Section>
      )}

      {data.languages.length > 0 && (
        <Section title="Sprachen">
          <p style={styles.para}>{data.languages.map(l => `${l.language} (${l.level})`).join(' · ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>{title}</h2>
      {children}
    </section>
  )
}

function Divider() { return <hr style={{ border: 0, borderTop: '1px solid #e5e5e5', margin: '18px 0' }} /> }

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    background: '#fff',
    color: '#0f172a',
    padding: '56px 64px',
    width: '794px',
    minHeight: '1123px',
    boxSizing: 'border-box',
    fontSize: 11.5,
    lineHeight: 1.6,
    letterSpacing: 0.1,
  },
  header: { marginBottom: 6 },
  name: { fontSize: 32, fontWeight: 300, margin: 0, letterSpacing: 1, color: '#0f172a' },
  jobTitle: { fontSize: 13, color: '#64748b', margin: '6px 0 6px', textTransform: 'uppercase', letterSpacing: 3 },
  careerGoal: { fontSize: 11.5, color: '#475569', margin: '6px auto 12px', lineHeight: 1.6, maxWidth: 540, textAlign: 'center' },
  contact: { fontSize: 11, color: '#64748b' },
  section: { marginBottom: 22 },
  h2: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 4,
    fontWeight: 600,
    color: '#0f172a',
    margin: '0 0 12px',
  },
  entry: { marginBottom: 14 },
  entryHead: { display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' },
  sub: { color: '#64748b', fontSize: 11, marginTop: 2 },
  date: { fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', letterSpacing: 0.5 },
  bullets: { margin: '5px 0 0 16px', padding: 0, fontSize: 11, color: '#334155' },
  para: { margin: '4px 0', fontSize: 11 },
}
