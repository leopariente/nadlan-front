export interface Section8Data {
  // Table 1 - עלות בנייה ישירה
  t1ResidentialRate: number
  t1CommercialRate: number
  t1OpenBalconyRate: number
  t1RoofBalconyRate: number
  t1ParkingCompRate: number
  t1ParkingCompQty: number
  t1UndergroundRate: number
  t1OutdoorDevRate: number
  t1OutdoorDevQty: number
  t1DemolitionRate: number
  t1PublicBuildingRate: number
  t1PublicBuildingQty: number
  t1LandscapeTotal: number
  // Table 2 - עלויות עקיפות
  t2ElectricRate: number
  t2PlanningRate: number
  t2MarketingPct: number
  t2OverheadPct: number
  t2ContingencyPct: number
  t2BrokeragePct: number
  t2LegalPct: number
  // Table 3 - עלות דיירים
  constructionMonths: number
  t3ResRentRate: number
  t3CommRentRate: number
  t3MovingRate: number
  t3LawyerRate: number
  t3MaintenanceFundRate: number
  // Table 4 - עלויות מיסוי
  t4PurchaseTaxPct: number
  t4PurchaseTaxBasis: number
  t4VatServiceTotal: number
  t4CapGainTotal: number
  // Table 5 - עלויות מימון
  t5FinancingPct: number
}

export const DEFAULT_SECTION8: Section8Data = {
  t1ResidentialRate: 0,
  t1CommercialRate: 0,
  t1OpenBalconyRate: 0,
  t1RoofBalconyRate: 0,
  t1ParkingCompRate: 0,
  t1ParkingCompQty: 0,
  t1UndergroundRate: 0,
  t1OutdoorDevRate: 0,
  t1OutdoorDevQty: 0,
  t1DemolitionRate: 0,
  t1PublicBuildingRate: 0,
  t1PublicBuildingQty: 0,
  t1LandscapeTotal: 0,
  t2ElectricRate: 0,
  t2PlanningRate: 0,
  t2MarketingPct: 0,
  t2OverheadPct: 0,
  t2ContingencyPct: 0,
  t2BrokeragePct: 0,
  t2LegalPct: 0,
  constructionMonths: 18,
  t3ResRentRate: 0,
  t3CommRentRate: 0,
  t3MovingRate: 0,
  t3LawyerRate: 0,
  t3MaintenanceFundRate: 0,
  t4PurchaseTaxPct: 0,
  t4PurchaseTaxBasis: 0,
  t4VatServiceTotal: 0,
  t4CapGainTotal: 0,
  t5FinancingPct: 5,
}
