export interface UnitType {
  id: string
  type: string
  count: number
  mainArea: number
  priceMultiplier: number
}

export interface Section3Data {
  units: UnitType[]
}

export const DEFAULT_SECTION3: Section3Data = {
  units: [],
}
