// ─── Step 1 ───────────────────────────────────────────────────────────────────

export interface PropertyDetail {
  id: string
  gush: string
  helka: string
  address: string
  registeredAreaSqm: number
  existingUnits: number
  participatingShare: number // percentage 0-100
}

export interface FloorPermitRow {
  id: string
  floorName: string
  floorAreaSqm: number
  balconyAreaSqm: number
  isCommercial: boolean
  isBasement: boolean
}

export interface Step1Data {
  propertyDetails: PropertyDetail[]
  floorPermits: FloorPermitRow[]
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

export interface ZoningRightsRow {
  id: string
  designation: string        // יעוד
  usage: string              // שימוש
  buildingLocation: string   // בניין מיקום
  plotSizeSqm: number        // גודל מגרש
  mainBuildingRightsSqm: number   // שטחי בנייה עיקרי
  serviceBuildingRightsSqm: number // שטחי בנייה שירות
  density: number            // צפיפות (units per dunam)
  coverage: number           // תכסית, percentage
  floors: number             // מס' קומות
  balconiesSqm: number       // מרפסות
}

export interface Step2Data {
  zoningRights: ZoningRightsRow[]
  tenantCompensationPct: number   // % of new residential area given to existing tenants (default 20%)
  commercialTenantCompensationPct: number // % for commercial (default 25%)
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

export interface AboveGroundRow {
  id: string
  label: string              // e.g. "דירות תמורה", "דירות יזם לשיווק"
  isTenant: boolean          // tenant compensation vs developer
  isSubtotal: boolean        // subtotal row (bold)
  unitCount: number
  mainAreaPerUnit: number    // שטח עיקרי ליח"ד
  safeRoomArea: number       // שטח ממ"ד (per unit)
  balconyArea: number        // שטח מרפסת (per unit)
  roofBalconyArea: number    // מרפסת גג (per unit)
  sharedAreaPct: number      // % רכוש משותף
}

export interface UndergroundRow {
  id: string
  label: string
  parkingSpacesAboveGround: number
  parkingSpacesUnderground: number
  avgParkingSpaceSqm: number
}

export interface Step3Data {
  aboveGround: AboveGroundRow[]
  underground: UndergroundRow[]
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

export interface MarketTransaction {
  id: string
  address: string
  date: string               // ISO date
  projectName: string        // גו"ח/פרויקט
  floor: number
  rooms: number
  sizeSqm: number            // שטח נטו (מ"ר)
  totalPriceILS: number      // מחיר מדווח
  notes: string
}

export interface Step4Data {
  transactions: MarketTransaction[]
  basePricePerSqmOverride: number | null  // manual override (null = use average)
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────

export interface LevyRow {
  id: string
  levyName: string           // שם האגרה/היטל
  areaCategory: string       // category label
  areaSqm: number            // שטח לחישוב (overridable)
  ratePerSqm: number         // תעריף
}

export interface Step5Data {
  levies: LevyRow[]
}

// ─── Step 6 ───────────────────────────────────────────────────────────────────

export interface BettermentLevyData {
  // מצב קיים - מגורים
  existingResidentialUnits: number
  existingResidentialAreaSqm: number
  existingResidentialValuePerSqm: number

  // מצב קיים - מסחר
  existingCommercialAreaSqm: number
  existingCommercialValuePerSqm: number

  // מצב חדש
  newResidentialAreaSqm: number
  newResidentialValuePerSqm: number
  newCommercialAreaSqm: number
  newCommercialValuePerSqm: number

  // הפחתת מטלות
  demolitionAndDeveloperObligations: number

  // דחייה
  deferralYears: number
  deferralRatePct: number    // % annual discount rate (default 6)

  // שיעור היטל
  levyPct: number            // default 50
}

export interface Step6Data {
  betterment: BettermentLevyData
}

// ─── Step 7 ───────────────────────────────────────────────────────────────────

export interface InventoryRow {
  id: string
  productType: string        // "דירת 4 חדרים", "מסחר" etc.
  unitCount: number
  avgSizeSqm: number         // שטח פלדלת ממוצע
  pricePerSqmILS: number     // שווי מ"ר (from step 4 by default)
  isCommercial: boolean
}

export interface Step7Data {
  inventoryRows: InventoryRow[]
}

// ─── Step 8 ───────────────────────────────────────────────────────────────────

export interface EconomicRow {
  id: string
  description: string        // הסעיף
  rateLabel: string          // עלות למ"ר/יח'/% — display label
  rateValue: number
  quantity: number           // כמות
  areaSqm: number            // שטח/מס'
  calcMode: 'rate_x_area' | 'rate_x_qty' | 'fixed' | 'pct_of_total' | 'ref'
  // calcMode:
  //   rate_x_area: total = rateValue × areaSqm
  //   rate_x_qty:  total = rateValue × quantity
  //   fixed:       total = rateValue (pre-entered lump sum)
  //   pct_of_total: total = rateValue% × (sum of sections 1-4)
  //   ref:         total pulled from another step (betterment / levies)
  refTotal: number | null    // used when calcMode = 'ref'
}

export interface EconomicSection {
  id: string
  label: string
  rows: EconomicRow[]
}

export interface Step8Data {
  sections: EconomicSection[]
}

// ─── Top-level Report ─────────────────────────────────────────────────────────

export interface ProjectSummary {
  id: string
  projectName: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface Report {
  id: string
  projectName: string
  address: string
  createdAt: string
  updatedAt: string
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
  step4: Step4Data
  step5: Step5Data
  step6: Step6Data
  step7: Step7Data
  step8: Step8Data
  // step9 has NO stored fields — it is entirely derived
}

// ─── Step 9 derived summary ────────────────────────────────────────────────────

export interface Step9Summary {
  existingUnits: number
  newTotalUnits: number
  densificationFactor: number
  developerMarketingUnits: number
  totalPladeletProject: number
  compensationPerUnit: number
  developerMarketingArea: number

  totalDeveloperRevenue: number
  totalConstructionCosts: number
  projectedSurplus: number
  profitToCoastPct: number
  profitToRevenuePct: number
}
