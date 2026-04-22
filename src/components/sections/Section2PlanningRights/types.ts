export interface GeneralPlanData {
  coveragePct: number          // תכסית %                   (default: 50)
  floors: number               // מס׳ קומות                 (default: 9)
  floorplatePct: number        // שטח פלדלת מברוטו %        (default: 75)
  avgUnitSqm: number           // שטח ממוצע ליח"ד (מ"ר)     (default: 100)
  parkingPerUnit: number       // חניות ליח"ד               (default: 1.5)
  parkingSqm: number           // שטח חניה תת"ק (מ"ר)       (default: 45)
  basementCoveragePct: number  // תכסית תת"ק %              (default: 85)
}

export interface Section2Data {
  planType: 'detailed' | 'general'

  // תכנית מפורטת fields
  residentialMainArea: number      // שטח עיקרי מגורים
  residentialServiceArea: number   // שטח שירות מגורים
  commercialMainArea: number       // שטח עיקרי מסחר
  commercialServiceArea: number    // שטח שירות מסחר
  densityUnits: number             // סה"כ יח"ד לפי צפיפות
  mamadSqm: number                 // שטח ממ"ד ליח"ד (default: 12)

  // תכנית כוללנית fields
  generalPlan: GeneralPlanData
}
