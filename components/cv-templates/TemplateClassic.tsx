import { CVData } from '../cv-builder/types'
import { formatDate } from '../cv-builder/utils'

export default function TemplateClassic({ data }: { data: CVData }) {
  const p = data.personalInfo
  return (
    <div dir="ltr" lang="de" style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <h1 style={styles.name}>{p.firstName || 'Vorname'} {p.lastName || 'Nachname'}</h1>
          {p.jobTitle && <p style={styles.jobTitle}>{p.jobTitle}</p>}
          {p.careerGoal && <p style={styles.careerGoal}>{p.careerGoal}</p>}
          <div style={styles.contactRow}>
            {p.email && <span>✉ {p.email}</span>}
            {p.phone && <span>☎ {p.phone}</span>}
            {(p.city || p.address) && <span>📍 {[p.address, p.postalCode, p.city].filter(Boolean).join(', ')}</span>}
          </div>
        </div>
        {p.profileImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.profileImage} alt="" style={styles.avatar} />
        )}
      </div>

      {/* Persönliche Daten */}
      {(p.dateOfBirth || p.placeOfBirth || p.nationality) && (
        <Section title="Persönliche Daten">
          <div style={styles.dataGrid}>
            {p.dateOfBirth  && <div><b>Geburtsdatum:</b> {formatDate(p.dateOfBirth)}</div>}
            {p.placeOfBirth && <div><b>Geburtsort:</b> {p.placeOfBirth}</div>}
            {p.nationality  && <div><b>Nationalität:</b> {p.nationality}</div>}
          </div>
        </Section>
      )}

      {/* Berufserfahrung */}
      {data.experience.length > 0 && (
        <Section title="Berufserfahrung">
          {data.experience.map((e, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryRow}>
                <strong>{e.jobTitle || 'Position'}</strong>
                <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
              </div>
              <div style={styles.sub}>
                {[e.company, e.location].filter(Boolean).join(' · ')}
              </div>
              {e.description && (
                <ul style={styles.bullets}>
                  {e.description.split('\n').filter(Boolean).map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Ausbildung */}
      {data.education.length > 0 && (
        <Section title="Ausbildung">
          {data.education.map((e, i) => (
            <div key={i} style={styles.entry}>
              <div style={styles.entryRow}>
                <strong>{e.degree || 'Abschluss'}{e.fieldOfStudy && ` in ${e.fieldOfStudy}`}</strong>
                <span style={styles.date}>{formatDate(e.startDate)} – {e.endDate ? formatDate(e.endDate) : 'heute'}</span>
              </div>
              <div style={styles.sub}>{e.institution}</div>
              {e.description && <p style={styles.para}>{e.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Kenntnisse */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <Section title="Kenntnisse">
          {data.skills.technical.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <b>Fachkenntnisse: </b>{data.skills.technical.join(' · ')}
            </div>
          )}
          {data.skills.soft.length > 0 && (
            <div><b>Soft Skills: </b>{data.skills.soft.join(' · ')}</div>
          )}
        </Section>
      )}

      {/* Sprachen */}
      {data.languages.length > 0 && (
        <Section title="Sprachen">
          <div style={styles.dataGrid}>
            {data.languages.map((l, i) => (
              <div key={i}><b>{l.language}:</b> {l.level}</div>
            ))}
          </div>
        </Section>
      )}

      <div style={styles.footer}>
        {p.city && `${p.city}, `}{new Date().toLocaleDateString('de-DE')}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={styles.section}>
      <h2 style={styles.h2}>{title}</h2>
      <div style={styles.sectionBody}>{children}</div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: '"Times New Roman", Georgia, serif',
    background: '#fff',
    color: '#111',
    padding: '40px 48px',
    fontSize: 12,
    lineHeight: 1.5,
    minHeight: '1123px',
    width: '794px',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    borderBottom: '2px solid #111',
    paddingBottom: 14,
    marginBottom: 20,
  },
  headerText: { flex: 1 },
  name: { fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: 0.3 },
  jobTitle: { fontSize: 13, color: '#555', margin: '4px 0 6px', fontStyle: 'italic' },
  careerGoal: { fontSize: 11.5, color: '#444', margin: '6px 0 8px', lineHeight: 1.5, maxWidth: 520 },
  contactRow: { display: 'flex', gap: 14, fontSize: 11, color: '#333', flexWrap: 'wrap' },
  avatar: { width: 96, height: 120, objectFit: 'cover', border: '1px solid #999', borderRadius: 2 },
  section: { marginBottom: 18 },
  h2: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottom: '1px solid #666',
    paddingBottom: 3,
    margin: '0 0 8px',
    fontWeight: 700,
  },
  sectionBody: {},
  entry: { marginBottom: 10 },
  entryRow: { display: 'flex', justifyContent: 'space-between', gap: 8 },
  date: { color: '#555', fontSize: 11, whiteSpace: 'nowrap' },
  sub: { color: '#555', fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  bullets: { margin: '4px 0 0 16px', padding: 0 },
  para: { margin: '4px 0 0', fontSize: 11 },
  dataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 },
  footer: { marginTop: 30, fontSize: 11, color: '#555', textAlign: 'right', fontStyle: 'italic' },
}
