// ─── Ausbildung Job Categories ──────────────────────────────────
// Maps categories to German Ausbildung job title keywords used for
// both the Bundesagentur API search queries and post-fetch categorization.

export type CategoryKey = 'hospitality' | 'handwerk' | 'it' | 'healthcare' | 'logistics'

export type Category = {
  key: CategoryKey
  nameEn: string
  nameAr: string
  icon: string
  keywords: string[] // Matched against job title (case-insensitive, contains)
  color: 'brand' | 'gold' | 'teal' | 'berry'
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  hospitality: {
    key: 'hospitality',
    nameEn: 'Hospitality',
    nameAr: 'الفندقة والمطاعم',
    icon: '🍽',
    keywords: ['Hotelfachmann', 'Hotelfachfrau', 'Koch', 'Köchin'],
    color: 'gold',
  },
  handwerk: {
    key: 'handwerk',
    nameEn: 'Skilled Trades',
    nameAr: 'الحرف المهنية',
    icon: '🔧',
    keywords: ['Elektroniker', 'Elektronikerin', 'Anlagenmechaniker', 'Anlagenmechanikerin', 'Mechatroniker', 'Mechatronikerin'],
    color: 'brand',
  },
  it: {
    key: 'it',
    nameEn: 'IT',
    nameAr: 'المعلوماتية',
    icon: '💻',
    keywords: ['Fachinformatiker', 'Fachinformatikerin'],
    color: 'teal',
  },
  healthcare: {
    key: 'healthcare',
    nameEn: 'Healthcare',
    nameAr: 'الصحة',
    icon: '🩺',
    keywords: [
      'Pflegefachmann', 'Pflegefachfrau',
      'Medizinische Fachangestellte', 'Medizinischer Fachangestellter',
      'Zahnmedizinische Fachangestellte', 'Zahnmedizinischer Fachangestellter',
    ],
    color: 'berry',
  },
  logistics: {
    key: 'logistics',
    nameEn: 'Logistics & Transport',
    nameAr: 'النقل واللوجستيك',
    icon: '🚚',
    keywords: [
      'LKW-Fahrer', 'LKW-Fahrerin', 'LKW Fahrer', 'LKW Fahrerin',
      'Berufskraftfahrer', 'Berufskraftfahrerin',
      'Kraftfahrer', 'Kraftfahrerin',
      'Fachkraft für Lagerlogistik',
    ],
    color: 'teal',
  },
}

export const CATEGORIES_ORDER: CategoryKey[] = ['healthcare', 'it', 'handwerk', 'hospitality', 'logistics']
