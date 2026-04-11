import type { ReportSections } from './types'

export function createEmptyReportSections(): ReportSections {
  return {
    section1: {
      gush: '',
      helka: '',
      address: '',
      registeredArea: 0,
      ownershipShare: '',
      existingUnits: 0,
      floors: [],
    },
    section2: {
      planType: 'detailed',
      residentialMainArea: 0,
      residentialServiceArea: 0,
      commercialMainArea: 0,
      commercialServiceArea: 0,
      densityUnits: 0,
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
    },
    section3: {
      tenantRow: { mainAreaPerUnit: 0, mamadPerUnit: 12, sharedAreaPerUnit: 0, openBalconyPerUnit: 0, roofBalconySqm: 0 },
      developerRow: { mainAreaPerUnit: 0, mamadPerUnit: 12, sharedAreaPerUnit: 0, openBalconyPerUnit: 0, roofBalconySqm: 0 },
      commercial: { sqm: 0 },
      publicBuildings: { sqm: 0 },
      underground: {
        tenantRow: { parkingPerUnit: 1, parkingAboveGround: 0, parkingUnderground: 0, avgParkingSqm: 45 },
        developerRow: { parkingPerUnit: 1.5, parkingAboveGround: 0, parkingUnderground: 0, avgParkingSqm: 45 },
        commercial: { additionalSqm: 0, parkingSpots: 0, avgParkingSqm: 45 },
        disabled: { additionalSqm: 0, parkingSpots: 0, avgParkingSqm: 45 },
        publicBuildings: { additionalSqm: 0, parkingSpots: 0, avgParkingSqm: 45 },
      },
    },
    section4: {
      newApartments: { selectedPricePerSqm: 0, transactions: [] },
      secondaryApartments: { selectedPricePerSqm: 0, transactions: [] },
      commercial: { commercialPctOfResidential: 85 },
    },
    section5: {
      useFlatRate: false,
      rates: {
        constructionPermit: 0,
        roadLand: 0,
        roadBuilding: 0,
        sidewalkLand: 0,
        sidewalkBuilding: 0,
        drainageLand: 0,
        drainageBuilding: 0,
        waterAuthority: 0,
        safetyBuffer: 6,
      },
    },
    section6: {
      builtValuePerSqmResidential: 0,
      builtValuePerSqmCommercial: 0,
      builtValuePerSqmEmployment: 0,
      existingCommercialValuePerSqm: 0,
      newPrimaryEmploymentArea: 0,
      publicSpaceDevelopment: 0,
      kindergartenConstruction: 0,
      demolitionAndDeveloper: 0,
      deferralYears: 3,
      deferralRate: 6,
      siteReductionFactor: 100,
      levyRate: 50,
    },
    section7: {
      vatPct: 18,
    },
  }
}
