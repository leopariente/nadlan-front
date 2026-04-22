import type {
  Section1Data,
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
} from '@/types'

export const INITIAL_SECTION1: Section1Data = {
  registeredArea: 0,
  ownershipShare: '',
}

export const INITIAL_SECTION2: Section2Data = {
  planType: 'detailed',
  residentialMainArea: 0,
  residentialServiceArea: 0,
  commercialMainArea: 0,
  commercialServiceArea: 0,
  densityUnits: 0,
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

export const INITIAL_SECTION3: Section3Data = {}

export const INITIAL_SECTION4: Section4Data = {
  newApartments:       { transactions: [], selectedPricePerSqm: 0 },
  secondaryApartments: { transactions: [], selectedPricePerSqm: 0 },
  commercial:          { commercialPctOfResidential: 85 },
}

export const INITIAL_SECTION5: Section5Data = {
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

export const INITIAL_SECTION6: Section6Data = {
  builtValuePerSqmResidential:   0,
  builtValuePerSqmCommercial:    0,
  builtValuePerSqmEmployment:    0,
  newPrimaryEmploymentArea:      0,
  publicSpaceDevelopment:        0,
  kindergartenConstruction:      0,
  demolitionAndDeveloper:        0,
  deferralYears:                 3,
  deferralRate:                  6,
  siteReductionFactor:           100,
  levyRate:                      50,
}

export const INITIAL_SECTION7: Section7Data = {
  vatPct: 18,
}
