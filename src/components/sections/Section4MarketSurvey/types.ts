export interface Transaction {
  id: string
  saleDate: string           // תאריך מכירה
  address: string            // כתובת
  gushHelka: string          // גו"ח / פרויקט
  floor: number              // קומה
  rooms: number              // חדרים
  netAreaSqm: number         // שטח נטו (מ"ר)
  reportedPriceILS: number   // מחיר מדווח (₪)
  // computed: pricePerSqm = Math.round(reportedPriceILS / netAreaSqm)
}

export interface Section4Data {
  newApartments: {
    transactions: Transaction[]
    selectedPricePerSqm: number
  }
  secondaryApartments: {
    transactions: Transaction[]
    selectedPricePerSqm: number
  }
  commercial: {
    commercialPctOfResidential: number  // default 85
    // computed: commercialPricePerSqm = newApartments.selectedPricePerSqm * pct / 100
  }
}
