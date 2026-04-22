export interface CustomUnitType {
  id: string
  type: string
  count: number
  mainArea: number
}

export interface Section3Data {
  overrides: {
    smallCount?: number
    smallArea?: number
    stdCount?: number
    stdArea?: number
    largeCount?: number
    largeArea?: number
  }
  customTypes: CustomUnitType[]
}

export const DEFAULT_SECTION3: Section3Data = {
  overrides: {},
  customTypes: [],
}
