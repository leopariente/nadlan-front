import type {
  ProjectSummary,
  Section1Data,
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
  Section8Data,
} from '@/types'
import { DEFAULT_SECTION8 } from '@/components/sections/Section8EconomicAnalysis/types'

export const MOCK_ID = 'demo-1'

export const MOCK_PROJECT: ProjectSummary = {
  id: MOCK_ID,
  projectName: 'הרצל 12 — פינוי-בינוי',
  address: 'הרצל 12, תל אביב-יפו',
  gush: '6660',
  helka: '50',
  createdAt: '2025-11-01T08:00:00.000Z',
  updatedAt: '2026-03-20T14:30:00.000Z',
}

export const MOCK_SECTION1: Section1Data = {
  registeredArea: 1200,
  ownershipShare: 'בשלמות',
}

export const MOCK_SECTION2: Section2Data = {
  planType: 'detailed',
  residentialMainArea: 5280,
  residentialServiceArea: 576,
  commercialMainArea: 350,
  commercialServiceArea: 70,
  densityUnits: 48,
  mamadSqm: 12,
  undergroundSqm: 0,
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

export const MOCK_SECTION3: Section3Data = {
  overrides: {},
  customTypes: [],
}

export const MOCK_SECTION4: Section4Data = {
  newApartments: {
    selectedPricePerSqm: 28000,
    transactions: [
      { id: '1', saleDate: '15/09/2025', address: 'הרצל 8',     gushHelka: '6660/48', floor: 'שלישי',   rooms: 4, netAreaSqm: 95,  reportedPriceILS: 2_660_000 },
      { id: '2', saleDate: '22/09/2025', address: 'הרצל 18',    gushHelka: '6660/55', floor: 'חמישי',   rooms: 4, netAreaSqm: 98,  reportedPriceILS: 2_800_000 },
      { id: '3', saleDate: '01/10/2025', address: 'אלנבי 40',   gushHelka: '6661/12', floor: 'שישי',    rooms: 5, netAreaSqm: 115, reportedPriceILS: 3_300_000 },
      { id: '4', saleDate: '14/10/2025', address: 'הרצל 22',    gushHelka: '6660/61', floor: 'שני',     rooms: 3, netAreaSqm: 78,  reportedPriceILS: 2_100_000 },
      { id: '5', saleDate: '29/10/2025', address: 'לילינבלום 5', gushHelka: '6660/70', floor: 'שמיני',  rooms: 5, netAreaSqm: 120, reportedPriceILS: 3_480_000 },
    ],
  },
  secondaryApartments: {
    selectedPricePerSqm: 24000,
    transactions: [
      { id: '6', saleDate: '05/08/2025', address: 'הרצל 14',   gushHelka: '6660/51', floor: 'שני',     rooms: 3, netAreaSqm: 72,  reportedPriceILS: 1_728_000 },
      { id: '7', saleDate: '18/08/2025', address: 'הרצל 20',   gushHelka: '6660/58', floor: 'רביעי',   rooms: 4, netAreaSqm: 88,  reportedPriceILS: 2_112_000 },
      { id: '8', saleDate: '02/09/2025', address: 'אלנבי 35',  gushHelka: '6661/09', floor: 'ראשון',   rooms: 3, netAreaSqm: 70,  reportedPriceILS: 1_645_000 },
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

export const MOCK_SECTION8: Section8Data = {
  ...DEFAULT_SECTION8,
}
