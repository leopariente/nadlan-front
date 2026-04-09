export interface AboveGroundRow {
  mainAreaPerUnit: number
  mamadPerUnit: number
  sharedAreaPerUnit: number
  openBalconyPerUnit: number
  roofBalconySqm: number
}

export interface DerivedRow {
  floorplatePerUnit: number
  grossPerUnit: number
  totalMain: number
  totalFloorplate: number
  totalGross: number
  totalOpenBalcony: number
}

export interface UndergroundRow {
  parkingPerUnit: number
  parkingAboveGround: number
  parkingUnderground: number
  avgParkingSqm: number
}

export interface UndergroundSpecialRow {
  additionalSqm: number
  parkingSpots: number
  avgParkingSqm: number
}

export interface Section3Data {
  tenantRow: AboveGroundRow
  developerRow: AboveGroundRow
  commercial: { sqm: number }
  publicBuildings: { sqm: number }
  underground: {
    tenantRow: UndergroundRow
    developerRow: UndergroundRow
    commercial: UndergroundSpecialRow
    disabled: UndergroundSpecialRow
    publicBuildings: UndergroundSpecialRow
  }
}

export function deriveRow(row: AboveGroundRow, units: number): DerivedRow {
  const floorplatePerUnit = row.mainAreaPerUnit + row.mamadPerUnit
  const grossPerUnit = floorplatePerUnit + row.sharedAreaPerUnit
  return {
    floorplatePerUnit,
    grossPerUnit,
    totalMain: row.mainAreaPerUnit * units,
    totalFloorplate: floorplatePerUnit * units,
    totalGross: grossPerUnit * units,
    totalOpenBalcony: row.openBalconyPerUnit * units,
  }
}

export function undergroundSqm(row: UndergroundRow): number {
  return row.parkingUnderground * row.avgParkingSqm
}

export function specialUndergroundSqm(row: UndergroundSpecialRow): number {
  return row.parkingSpots * row.avgParkingSqm
}

export function fmt(n: number): string {
  return Math.round(n).toLocaleString('he-IL')
}
