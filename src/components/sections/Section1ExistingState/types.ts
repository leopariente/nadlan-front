export type FloorUse = 'מגורים' | 'מסחר' | 'מרתף' | 'ציבורי' | 'גג'

export interface FloorRow {
  name: string
  use: FloorUse
  floorArea: number
  balconyArea: number
}

export interface Section1Data {
  gush: string
  helka: string
  address: string
  registeredArea: number
  ownershipShare: string
  existingUnits: number
  floors: FloorRow[]
}
