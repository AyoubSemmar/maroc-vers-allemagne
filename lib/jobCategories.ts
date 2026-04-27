// ─── Ausbildung Job Categories ──────────────────────────────────
// Maps categories to German Ausbildung job title keywords used for
// both the Bundesagentur API search queries and post-fetch categorization.

export type CategoryKey =
  | 'hospitality'
  | 'handwerk'
  | 'it'
  | 'healthcare'
  | 'logistics'
  | 'education'
  | 'media'
  | 'public_service'
  | 'retail'
  | 'automotive'

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
  education: {
    key: 'education',
    nameEn: 'Education & Training',
    nameAr: 'التعليم والتدريب',
    icon: '📚',
    keywords: [
      'Erzieher', 'Erzieherin',
      'Sozialassistent', 'Sozialassistentin',
      'Kinderpfleger', 'Kinderpflegerin',
      'Heilerziehungspfleger', 'Heilerziehungspflegerin',
    ],
    color: 'berry',
  },
  media: {
    key: 'media',
    nameEn: 'Media & Communication',
    nameAr: 'الإعلام والاتصال',
    icon: '🎬',
    keywords: [
      'Mediengestalter', 'Mediengestalterin',
      'Kaufmann für Marketingkommunikation', 'Kauffrau für Marketingkommunikation',
      'Fachkraft für Veranstaltungstechnik',
      'Audiovisuelle Medien',
      'Contentmanager', 'Contentmanagerin',
    ],
    color: 'gold',
  },
  public_service: {
    key: 'public_service',
    nameEn: 'Public Service & Administration',
    nameAr: 'الخدمة العامة والإدارة',
    icon: '🏛️',
    keywords: [
      'Verwaltungsfachangestellte', 'Verwaltungsfachangestellter',
      'Notarfachangestellte', 'Notarfachangestellter',
      'Kaufmann für Büromanagement', 'Kauffrau für Büromanagement',
      'Industriekaufmann', 'Industriekauffrau',
    ],
    color: 'teal',
  },
  retail: {
    key: 'retail',
    nameEn: 'Sales & Retail',
    nameAr: 'البيع والتجارة',
    icon: '🛒',
    keywords: [
      'Kaufmann im Einzelhandel', 'Kauffrau im Einzelhandel',
      'Verkäufer', 'Verkäuferin',
      'E-Commerce',
      'Groß- und Außenhandel',
      'Handelsfachwirt', 'Handelsfachwirtin',
      'Gestalter für visuelles Marketing', 'Gestalterin für visuelles Marketing',
    ],
    color: 'gold',
  },
  automotive: {
    key: 'automotive',
    nameEn: 'Automotive & Vehicles',
    nameAr: 'السيارات والمركبات',
    icon: '🚗',
    keywords: [
      'Kfz-Mechatroniker', 'Kfz-Mechatronikerin',
      'Kraftfahrzeugmechatroniker', 'Kraftfahrzeugmechatronikerin',
      'Fahrzeuglackierer', 'Fahrzeuglackiererin',
      'Karosserie- und Fahrzeugbaumechaniker', 'Karosserie- und Fahrzeugbaumechanikerin',
      'Nutzfahrzeugtechnik',
    ],
    color: 'brand',
  },
}

export const CATEGORIES_ORDER: CategoryKey[] = [
  'healthcare', 'it', 'handwerk', 'hospitality', 'logistics',
  'education', 'media', 'public_service', 'retail', 'automotive',
]
