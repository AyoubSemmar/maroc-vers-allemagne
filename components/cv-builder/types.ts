export type PersonalInfo = {
  firstName: string
  lastName: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  profileImage: string // base64 data URL
  jobTitle: string    // target position (shown as subtitle)
  careerGoal: string  // 1-2 sentence Berufsziel shown below name
}

export type EducationEntry = {
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  description: string
}

export type ExperienceEntry = {
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string // newline-separated bullets
}

export type LanguageEntry = {
  language: string
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native'
}

export type DocumentFile = {
  name: string
  size: number
  type: string
  dataUrl: string
  // Populated when the file has been auto-uploaded to Supabase Storage
  // and a row inserted into user_documents.
  storagePath?: string
  storageUrl?: string
  savedId?: string       // user_documents.id
  uploading?: boolean
  uploadError?: string
}

export type CVData = {
  personalInfo: PersonalInfo
  education: EducationEntry[]
  experience: ExperienceEntry[]
  skills: {
    technical: string[]
    soft: string[]
  }
  languages: LanguageEntry[]
  documents: {
    certificates: DocumentFile[]
    diploma: DocumentFile[]
    languageCertificates: DocumentFile[]
    optionalCoverLetter: DocumentFile[]
  }
  selectedTemplate: TemplateId
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'dark' | 'compact'

export type TemplateMeta = {
  id: TemplateId
  name: string
  nameAr: string
  description: string
  isPremium: boolean
  accentColor: string
}

// All five templates are free during launch — flipped from the
// previous classic+modern free / minimal+dark+compact paid split so
// every user can pick whatever style fits their CV. The `isPremium`
// field is kept on the type (and on every row, all set to false) so
// the existing premium-gating UI keeps compiling. If a paid tier is
// re-introduced later, just flip individual rows back to true.
export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic',  name: 'Classic German',   nameAr: 'الكلاسيكي الألماني', description: 'القالب التقليدي الألماني — مناسب لكل المجالات', isPremium: false, accentColor: '#1f2937' },
  { id: 'modern',   name: 'Modern Blue',      nameAr: 'الحديث الأزرق',       description: 'تصميم حديث بلون أزرق أنيق',                  isPremium: false, accentColor: '#2563eb' },
  { id: 'minimal',  name: 'Minimal Clean',    nameAr: 'الأدنى النظيف',       description: 'بسيط ونظيف — يركز على المحتوى',               isPremium: false, accentColor: '#0f172a' },
  { id: 'dark',     name: 'Professional Dark',nameAr: 'الاحترافي الداكن',    description: 'قالب داكن للمهن الإبداعية والتقنية',         isPremium: false, accentColor: '#18181b' },
  { id: 'compact',  name: 'Compact One-Page', nameAr: 'المضغوط صفحة واحدة',  description: 'تصميم مضغوط يناسب الصفحة الواحدة',          isPremium: false, accentColor: '#dc2626' },
]

export const LANGUAGE_LEVELS: LanguageEntry['level'][] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']

export const EMPTY_CV: CVData = {
  personalInfo: {
    firstName: '', lastName: '', dateOfBirth: '', placeOfBirth: '', nationality: '',
    address: '', postalCode: '', city: '', phone: '', email: '', profileImage: '', jobTitle: '', careerGoal: '',
  },
  education: [],
  experience: [],
  skills: { technical: [], soft: [] },
  languages: [],
  documents: {
    certificates: [],
    diploma: [],
    languageCertificates: [],
    optionalCoverLetter: [],
  },
  selectedTemplate: 'classic',
}

export const STEPS = [
  { id: 1, key: 'personal',   labelKey: 'personal',   labelDe: 'Persönliche Daten' },
  { id: 2, key: 'education',  labelKey: 'education',  labelDe: 'Ausbildung' },
  { id: 3, key: 'experience', labelKey: 'experience', labelDe: 'Berufserfahrung' },
  { id: 4, key: 'skills',     labelKey: 'skills',     labelDe: 'Kenntnisse' },
  { id: 5, key: 'languages',  labelKey: 'languages',  labelDe: 'Sprachen' },
  { id: 6, key: 'documents',  labelKey: 'documents',  labelDe: 'Dokumente' },
  { id: 7, key: 'preview',    labelKey: 'preview',    labelDe: 'Vorschau & Download' },
] as const
