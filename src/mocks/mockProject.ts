import type {
  ProjectSummary,
  Section1Data,
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
} from '@/types'

export const MOCK_ID = 'demo-1'

export const MOCK_PROJECT: ProjectSummary = {
  id: MOCK_ID,
  projectName: 'הרצל 12 — פינוי-בינוי',
  address: 'הרצל 12, תל אביב-יפו',
  createdAt: '2025-11-01T08:00:00.000Z',
  updatedAt: '2026-03-20T14:30:00.000Z',
}

export const MOCK_SECTION1: Section1Data = {
  gush: '6660',
  helka: '50',
  address: 'הרצל 12, תל אביב-יפו',
  registeredArea: 1200,
  ownershipShare: 'בשלמות',
  existingUnits: 24,
  floors: [
    { name: 'קרקע', use: 'מסחר',  floorArea: 280, balconyArea: 0   },
    { name: 'א׳',   use: 'מגורים', floorArea: 380, balconyArea: 60  },
    { name: 'ב׳',   use: 'מגורים', floorArea: 380, balconyArea: 60  },
    { name: 'ג׳',   use: 'מגורים', floorArea: 380, balconyArea: 60  },
    { name: 'ד׳',   use: 'מגורים', floorArea: 380, balconyArea: 60  },
    { name: 'ה׳',   use: 'מגורים', floorArea: 380, balconyArea: 60  },
    { name: 'ו׳',   use: 'מגורים', floorArea: 380, balconyArea: 60  },
  ],
}

export const MOCK_SECTION2: Section2Data = {
  planType: 'detailed',
  residentialMainArea: 5280,
  residentialServiceArea: 576,
  commercialMainArea: 350,
  commercialServiceArea: 70,
  densityUnits: 48,
  mamadSqm: 12,
  tenantBonusSqmPerUnit: 6,
  commercialTenantBonusPct: 25,
  generalPlan: {
    coveragePct: 50,
    floors: 9,
    floorplatePct: 75,
    avgUnitSqm: 100,
    parkingPerUnit: 1.5,
    parkingSqm: 45,
    basementCoveragePct: 85,
  },
}

const EMPTY_UNDERGROUND_SPECIAL = { additionalSqm: 0, parkingSpots: 0, avgParkingSqm: 45 }

export const MOCK_SECTION3: Section3Data = {
  tenantRow: {
    mainAreaPerUnit: 90,
    mamadPerUnit: 12,
    sharedAreaPerUnit: 8,
    openBalconyPerUnit: 12,
    roofBalconySqm: 0,
  },
  developerRow: {
    mainAreaPerUnit: 110,
    mamadPerUnit: 12,
    sharedAreaPerUnit: 8,
    openBalconyPerUnit: 15,
    roofBalconySqm: 200,
  },
  commercial: { sqm: 350 },
  publicBuildings: { sqm: 0 },
  underground: {
    tenantRow:     { parkingPerUnit: 1, parkingAboveGround: 0,  parkingUnderground: 24, avgParkingSqm: 45 },
    developerRow:  { parkingPerUnit: 1.5, parkingAboveGround: 0, parkingUnderground: 36, avgParkingSqm: 45 },
    commercial:    { additionalSqm: 350, parkingSpots: 4,  avgParkingSqm: 45 },
    disabled:      { additionalSqm: 0,   parkingSpots: 3,  avgParkingSqm: 45 },
    publicBuildings: EMPTY_UNDERGROUND_SPECIAL,
  },
}

export const MOCK_SECTION4: Section4Data = {
  newApartments: {
    selectedPricePerSqm: 28000,
    transactions: [
      { id: '1', saleDate: '15/09/2025', address: 'הרצל 8',     gushHelka: '6660/48', floor: 3, rooms: 4, netAreaSqm: 95,  reportedPriceILS: 2_660_000, notes: '' },
      { id: '2', saleDate: '22/09/2025', address: 'הרצל 18',    gushHelka: '6660/55', floor: 5, rooms: 4, netAreaSqm: 98,  reportedPriceILS: 2_800_000, notes: '' },
      { id: '3', saleDate: '01/10/2025', address: 'אלנבי 40',   gushHelka: '6661/12', floor: 6, rooms: 5, netAreaSqm: 115, reportedPriceILS: 3_300_000, notes: '' },
      { id: '4', saleDate: '14/10/2025', address: 'הרצל 22',    gushHelka: '6660/61', floor: 2, rooms: 3, netAreaSqm: 78,  reportedPriceILS: 2_100_000, notes: '' },
      { id: '5', saleDate: '29/10/2025', address: 'לילינבלום 5', gushHelka: '6660/70', floor: 8, rooms: 5, netAreaSqm: 120, reportedPriceILS: 3_480_000, notes: 'גג' },
    ],
  },
  secondaryApartments: {
    selectedPricePerSqm: 24000,
    transactions: [
      { id: '6', saleDate: '05/08/2025', address: 'הרצל 14',   gushHelka: '6660/51', floor: 2, rooms: 3, netAreaSqm: 72,  reportedPriceILS: 1_728_000, notes: '' },
      { id: '7', saleDate: '18/08/2025', address: 'הרצל 20',   gushHelka: '6660/58', floor: 4, rooms: 4, netAreaSqm: 88,  reportedPriceILS: 2_112_000, notes: '' },
      { id: '8', saleDate: '02/09/2025', address: 'אלנבי 35',  gushHelka: '6661/09', floor: 1, rooms: 3, netAreaSqm: 70,  reportedPriceILS: 1_645_000, notes: '' },
    ],
  },
  commercial: { commercialPctOfResidential: 85 },
}

export const MOCK_SECTION5: Section5Data = {
  useFlatRate: false,
  rates: {
    constructionPermit: 37.65,
    roadLand:           82.51,
    roadBuilding:      118.28,
    sidewalkLand:       67.51,
    sidewalkBuilding:   96.77,
    drainageLand:       32.08,
    drainageBuilding:   57.53,
    waterAuthority:     94.19,
    safetyBuffer:        6,
  },
}

export const MOCK_SECTION6: Section6Data = {
  builtValuePerSqmResidential: 14000,
  builtValuePerSqmCommercial:  8000,
  builtValuePerSqmEmployment:  6000,
  existingCommercialValuePerSqm: 7000,
  newPrimaryEmploymentArea:    0,
  publicSpaceDevelopment:      500_000,
  kindergartenConstruction:    300_000,
  demolitionAndDeveloper:      800_000,
  deferralYears:               3,
  deferralRate:                6,
  siteReductionFactor:         100,
  levyRate:                    50,
}

export const MOCK_SECTION7: Section7Data = {
  vatPct: 18,
}
