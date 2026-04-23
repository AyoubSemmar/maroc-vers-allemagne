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

export const TEMPLATES: TemplateMeta[] = [
  { id: 'classic',  name: 'Classic German',   nameAr: 'الكلاسيكي الألماني', description: 'القالب التقليدي الألماني — مناسب لكل المجالات', isPremium: false, accentColor: '#1f2937' },
  { id: 'modern',   name: 'Modern Blue',      nameAr: 'الحديث الأزرق',       description: 'تصميم حديث بلون أزرق أنيق',                  isPremium: false, accentColor: '#2563eb' },
  { id: 'minimal',  name: 'Minimal Clean',    nameAr: 'الأدنى النظيف',       description: 'بسيط ونظيف — يركز على المحتوى',               isPremium: true,  accentColor: '#0f172a' },
  { id: 'dark',     name: 'Professional Dark',nameAr: 'الاحترافي الداكن',    description: 'قالب داكن للمهن الإبداعية والتقنية',         isPremium: true,  accentColor: '#18181b' },
  { id: 'compact',  name: 'Compact One-Page', nameAr: 'المضغوط صفحة واحدة',  description: 'تصميم مضغوط يناسب الصفحة الواحدة',          isPremium: true,  accentColor: '#dc2626' },
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
  { id: 1, key: 'personal',   label: 'المعلومات الشخصية',  labelDe: 'Persönliche Daten' },
  { id: 2, key: 'education',  label: 'التعليم',            labelDe: 'Ausbildung' },
  { id: 3, key: 'experience', label: 'الخبرة المهنية',     labelDe: 'Berufserfahrung' },
  { id: 4, key: 'skills',     label: 'المهارات',           labelDe: 'Kenntnisse' },
  { id: 5, key: 'languages',  label: 'اللغات',             labelDe: 'Sprachen' },
  { id: 6, key: 'documents',  label: 'الوثائق',            labelDe: 'Dokumente' },
  { id: 7, key: 'preview',    label: 'المعاينة والتحميل',  labelDe: 'Vorschau & Download' },
] as const
