// Static lookup tables for the Living Cost Calculator.
// Numbers are 2026 estimates derived from DAAD reports + Destatis 2025
// + the goausbildung.com reference figures. Treat them as ranges for
// "typical Ausbildung trainee" lifestyles.

export type CityKey =
  | 'munich' | 'frankfurt' | 'hamburg' | 'stuttgart' | 'dusseldorf'
  | 'cologne' | 'berlin' | 'hannover' | 'bremen' | 'nuremberg'
  | 'dortmund' | 'leipzig' | 'dresden' | 'bochum' | 'chemnitz'

export type AccommodationKey = 'dormitory' | 'shared' | 'studio' | 'apartment'
export type LifestyleKey = 'budget' | 'moderate' | 'comfortable'

export type City = {
  key: CityKey
  tier: 1 | 2 | 3 | 4    // 1 = most expensive
  // Monthly rent ranges in € by accommodation type. We use the midpoint
  // for the calculation. Ranges are shown to the user separately.
  rent: Record<AccommodationKey, [number, number]>
  // Public transport monthly ticket (Deutschland-Ticket subsidized rate
  // varies; trainees mostly pay €30–60 for student/Azubi pass).
  transport: number
  // Utilities (electricity, heating, water, internet) for a single
  // person in a shared/studio setting.
  utilities: number
}

export const CITIES: City[] = [
  // ── Tier 1: most expensive ─────────────────────────────────
  { key: 'munich',    tier: 1, rent: { dormitory: [350, 500], shared: [500, 800], studio: [900, 1400], apartment: [1200, 1800] }, transport: 60, utilities: 140 },
  { key: 'frankfurt', tier: 1, rent: { dormitory: [320, 480], shared: [480, 750], studio: [850, 1300], apartment: [1100, 1650] }, transport: 65, utilities: 140 },
  { key: 'hamburg',   tier: 1, rent: { dormitory: [300, 470], shared: [450, 700], studio: [800, 1250], apartment: [1050, 1550] }, transport: 60, utilities: 135 },

  // ── Tier 2: high ────────────────────────────────────────────
  { key: 'stuttgart',  tier: 2, rent: { dormitory: [280, 450], shared: [430, 670], studio: [780, 1180], apartment: [1000, 1450] }, transport: 55, utilities: 130 },
  { key: 'dusseldorf', tier: 2, rent: { dormitory: [280, 440], shared: [420, 660], studio: [770, 1150], apartment: [980,  1420] }, transport: 55, utilities: 130 },
  { key: 'cologne',    tier: 2, rent: { dormitory: [270, 430], shared: [410, 640], studio: [750, 1120], apartment: [950,  1380] }, transport: 55, utilities: 130 },
  { key: 'berlin',     tier: 2, rent: { dormitory: [270, 420], shared: [400, 650], studio: [750, 1150], apartment: [950,  1450] }, transport: 50, utilities: 130 },

  // ── Tier 3: moderate ────────────────────────────────────────
  { key: 'hannover',  tier: 3, rent: { dormitory: [220, 370], shared: [350, 540], studio: [620, 950],  apartment: [800, 1200] }, transport: 50, utilities: 125 },
  { key: 'bremen',    tier: 3, rent: { dormitory: [210, 360], shared: [340, 530], studio: [600, 920],  apartment: [780, 1180] }, transport: 50, utilities: 120 },
  { key: 'nuremberg', tier: 3, rent: { dormitory: [220, 370], shared: [350, 540], studio: [620, 940],  apartment: [800, 1200] }, transport: 50, utilities: 125 },
  { key: 'dortmund',  tier: 3, rent: { dormitory: [200, 350], shared: [330, 520], studio: [580, 900],  apartment: [760, 1140] }, transport: 45, utilities: 120 },

  // ── Tier 4: most affordable ────────────────────────────────
  { key: 'leipzig',   tier: 4, rent: { dormitory: [180, 320], shared: [330, 520], studio: [560, 850],  apartment: [720, 1080] }, transport: 45, utilities: 115 },
  { key: 'dresden',   tier: 4, rent: { dormitory: [180, 320], shared: [320, 510], studio: [550, 830],  apartment: [710, 1060] }, transport: 45, utilities: 115 },
  { key: 'bochum',    tier: 4, rent: { dormitory: [180, 310], shared: [300, 480], studio: [520, 800],  apartment: [680, 1020] }, transport: 45, utilities: 115 },
  { key: 'chemnitz',  tier: 4, rent: { dormitory: [170, 300], shared: [290, 470], studio: [500, 780],  apartment: [660, 1000] }, transport: 40, utilities: 110 },
]

// Lifestyle determines food + entertainment/misc spending.
// Values are monthly € midpoints we add to the calculation; the
// underlying ranges shown in the UI come from the same numbers ±20%.
export const LIFESTYLE: Record<LifestyleKey, { food: number; entertainment: number }> = {
  budget:      { food: 175, entertainment: 80  },  // Aldi/Lidl, cooking, occasional outings
  moderate:    { food: 250, entertainment: 150 },  // mix of cooking + dining out
  comfortable: { food: 360, entertainment: 250 },  // regular dining, premium groceries
}

// Statutory health insurance is roughly fixed for trainees — public
// "gesetzliche" Krankenversicherung at the reduced student/Azubi rate.
export const INSURANCE_MONTHLY_EUR = 120

// When traveling/living with a partner or dependent, total monthly cost
// scales by ~1.4 (shared accommodation discount, but more food, more
// transport, more entertainment).
export const PARTNER_MULTIPLIER = 1.4

// ── Sector → average Ausbildung stipend (€/month) ─────────────
// Numbers are the midpoint across years 1-3 from public Tarif tables.
export type SectorKey =
  | 'healthcare' | 'it' | 'engineering' | 'automotive' | 'handwerk'
  | 'hospitality' | 'retail' | 'education' | 'media' | 'public_service'
  | 'finance' | 'logistics'

export const SECTOR_STIPEND: Record<SectorKey, number> = {
  healthcare:     1100,
  it:             1050,
  engineering:    1100,
  automotive:     1050,
  handwerk:        950,
  hospitality:     950,
  retail:          900,
  education:      1250,
  media:           950,
  public_service: 1150,
  finance:        1200,
  logistics:       950,
}

// ── Calculation ─────────────────────────────────────────────
export type CalcInput = {
  city: CityKey
  accommodation: AccommodationKey
  lifestyle: LifestyleKey
  stipendMonthlyEur: number
  withPartner: boolean
}

export type CalcResult = {
  rent: number
  food: number
  transport: number
  utilities: number
  insurance: number
  entertainment: number
  total: number
  stipend: number
  surplus: number   // stipend - total (negative = deficit)
  // For UI: the original ranges that drove the midpoint computation.
  rentRange: [number, number]
}

export function calculate(input: CalcInput): CalcResult {
  const city = CITIES.find(c => c.key === input.city)!
  const lifestyle = LIFESTYLE[input.lifestyle]
  const rentRange = city.rent[input.accommodation]
  const rentMid = (rentRange[0] + rentRange[1]) / 2

  let rent = rentMid
  let food = lifestyle.food
  let transport = city.transport
  let utilities = city.utilities
  let insurance = INSURANCE_MONTHLY_EUR
  let entertainment = lifestyle.entertainment

  if (input.withPartner) {
    rent          *= 1.20  // larger place, but shared
    food          *= 1.80  // double-ish, with bulk-cooking discount
    transport     *= 2.00
    utilities     *= 1.30
    insurance     *= 1.85  // partner's insurance is separate but similar
    entertainment *= 1.60
  }

  rent = Math.round(rent)
  food = Math.round(food)
  transport = Math.round(transport)
  utilities = Math.round(utilities)
  insurance = Math.round(insurance)
  entertainment = Math.round(entertainment)

  const total = rent + food + transport + utilities + insurance + entertainment
  const surplus = input.stipendMonthlyEur - total

  return {
    rent, food, transport, utilities, insurance, entertainment,
    total,
    stipend: input.stipendMonthlyEur,
    surplus,
    rentRange,
  }
}
