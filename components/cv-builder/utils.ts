import { CVData, EMPTY_CV } from './types'

export const STORAGE_KEY = 'rihla_cv_data_v1'

export function loadFromStorage(): CVData {
  if (typeof window === 'undefined') return EMPTY_CV
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_CV
    const parsed = JSON.parse(raw) as Partial<CVData>
    return {
      ...EMPTY_CV,
      ...parsed,
      personalInfo: { ...EMPTY_CV.personalInfo, ...(parsed.personalInfo ?? {}) },
      skills: { ...EMPTY_CV.skills, ...(parsed.skills ?? {}) },
      documents: { ...EMPTY_CV.documents, ...(parsed.documents ?? {}) },
    }
  } catch {
    return EMPTY_CV
  }
}

export function saveToStorage(data: CVData) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota errors
  }
}

export function clearStorage() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function formatDate(iso: string) {
  if (!iso) return ''
  // expected YYYY-MM or YYYY-MM-DD
  const [y, m] = iso.split('-')
  if (!y) return iso
  if (!m) return y
  const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  const idx = Math.max(0, Math.min(11, Number(m) - 1))
  return `${months[idx]} ${y}`
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function calculateCompletion(data: CVData): number {
  let score = 0
  let max = 0

  // Personal (weight 4)
  const p = data.personalInfo
  const personalFields = [p.firstName, p.lastName, p.email, p.phone, p.city, p.dateOfBirth, p.nationality]
  max += 4
  score += (personalFields.filter(Boolean).length / personalFields.length) * 4

  // Education (weight 2)
  max += 2
  if (data.education.length > 0) score += Math.min(2, data.education.length)

  // Experience (weight 2)
  max += 2
  if (data.experience.length > 0) score += Math.min(2, data.experience.length)

  // Skills (weight 1)
  max += 1
  if (data.skills.technical.length + data.skills.soft.length > 0) score += 1

  // Languages (weight 1)
  max += 1
  if (data.languages.length > 0) score += 1

  return Math.round((score / max) * 100)
}
