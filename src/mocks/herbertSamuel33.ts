import type { Report } from '@/types/report'

export const herbertSamuel33: Report = {
  id: 'herbert-samuel-33',
  projectName: 'הרברט סמואל 33',
  address: 'הרברט סמואל 33, חדרה',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-03-20T14:30:00Z',

  step1: {
    propertyDetails: [
      {
        id: 'pd-1',
        gush: '10152',
        helka: '45',
        address: 'הרברט סמואל 33, חדרה',
        registeredAreaSqm: 830,
        existingUnits: 12,
        participatingShare: 100,
      },
    ],
    floorPermits: [
      { id: 'fp-1', floorName: 'קומת מרתף',        floorAreaSqm: 420, balconyAreaSqm: 0,   isCommercial: false, isBasement: true  },
      { id: 'fp-2', floorName: 'קומת קרקע מסחר',   floorAreaSqm: 310, balconyAreaSqm: 0,   isCommercial: true,  isBasement: false },
      { id: 'fp-3', floorName: "א' מגורים",         floorAreaSqm: 340, balconyAreaSqm: 60,  isCommercial: false, isBasement: false },
      { id: 'fp-4', floorName: "ב' מגורים",         floorAreaSqm: 340, balconyAreaSqm: 60,  isCommercial: false, isBasement: false },
      { id: 'fp-5', floorName: "ג' מגורים",         floorAreaSqm: 340, balconyAreaSqm: 60,  isCommercial: false, isBasement: false },
      { id: 'fp-6', floorName: "ד' מגורים",         floorAreaSqm: 340, balconyAreaSqm: 60,  isCommercial: false, isBasement: false },
    ],
  },

  step2: {
    zoningRights: [
      {
        id: 'zr-1',
        designation: 'מגורים',
        usage: 'בניה רוויה',
        buildingLocation: 'צמוד דופן',
        plotSizeSqm: 830,
        mainBuildingRightsSqm: 3200,
        serviceBuildingRightsSqm: 640,
        density: 38,         // 38 units per dunam
        coverage: 40,
        floors: 8,
        balconiesSqm: 480,
      },
      {
        id: 'zr-2',
        designation: 'מסחר',
        usage: 'מסחר ושירותים',
        buildingLocation: 'קומת קרקע',
        plotSizeSqm: 830,
        mainBuildingRightsSqm: 350,
        serviceBuildingRightsSqm: 70,
        density: 0,
        coverage: 40,
        floors: 1,
        balconiesSqm: 0,
      },
    ],
    tenantCompensationPct: 20,
    commercialTenantCompensationPct: 25,
  },

  step3: {
    aboveGround: [
      {
        id: 'ag-1',
        label: 'דירות תמורה',
        isTenant: true,
        isSubtotal: false,
        unitCount: 12,
        mainAreaPerUnit: 90,
        safeRoomArea: 9,
        balconyArea: 12,
        roofBalconyArea: 0,
        sharedAreaPct: 15,
      },
      {
        id: 'ag-2',
        label: 'סה"כ דירות תמורה',
        isTenant: true,
        isSubtotal: true,
        unitCount: 12,
        mainAreaPerUnit: 90,
        safeRoomArea: 9,
        balconyArea: 12,
        roofBalconyArea: 0,
        sharedAreaPct: 15,
      },
      {
        id: 'ag-3',
        label: 'דירות יזם לשיווק',
        isTenant: false,
        isSubtotal: false,
        unitCount: 19,
        mainAreaPerUnit: 100,
        safeRoomArea: 9,
        balconyArea: 14,
        roofBalconyArea: 0,
        sharedAreaPct: 15,
      },
      {
        id: 'ag-4',
        label: 'סה"כ דירות היזם',
        isTenant: false,
        isSubtotal: true,
        unitCount: 19,
        mainAreaPerUnit: 100,
        safeRoomArea: 9,
        balconyArea: 14,
        roofBalconyArea: 0,
        sharedAreaPct: 15,
      },
    ],
    underground: [
      {
        id: 'ug-1',
        label: 'חניון תת קרקעי',
        parkingSpacesAboveGround: 5,
        parkingSpacesUnderground: 26,
        avgParkingSpaceSqm: 26,
      },
    ],
  },

  step4: {
    transactions: [
      { id: 't-1',  address: 'הרצל 15, חדרה',        date: '2024-01-10', projectName: 'פרויקט הרצל',    floor: 3, rooms: 4, sizeSqm: 102, totalPriceILS: 1_250_000, notes: '' },
      { id: 't-2',  address: 'ביאליק 22, חדרה',       date: '2024-01-20', projectName: '',                floor: 5, rooms: 5, sizeSqm: 125, totalPriceILS: 1_580_000, notes: '' },
      { id: 't-3',  address: 'ויצמן 8, חדרה',         date: '2024-02-05', projectName: 'מגדל ויצמן',     floor: 7, rooms: 4, sizeSqm: 108, totalPriceILS: 1_350_000, notes: '' },
      { id: 't-4',  address: 'דיזנגוף 14, חדרה',      date: '2024-02-15', projectName: '',                floor: 2, rooms: 3, sizeSqm: 78,  totalPriceILS:   890_000, notes: '' },
      { id: 't-5',  address: 'הרברט סמואל 41, חדרה',  date: '2024-02-28', projectName: '',                floor: 4, rooms: 5, sizeSqm: 132, totalPriceILS: 1_620_000, notes: 'עסקת ממ"ד' },
      { id: 't-6',  address: 'רוטשילד 3, חדרה',       date: '2024-03-10', projectName: 'פרויקט רוטשילד', floor: 6, rooms: 4, sizeSqm: 110, totalPriceILS: 1_380_000, notes: '' },
      { id: 't-7',  address: 'אחד העם 17, חדרה',      date: '2024-03-20', projectName: '',                floor: 3, rooms: 4, sizeSqm: 105, totalPriceILS: 1_290_000, notes: '' },
      { id: 't-8',  address: 'בן גוריון 11, חדרה',    date: '2024-04-02', projectName: 'מגדלי בן גוריון', floor: 9, rooms: 5, sizeSqm: 130, totalPriceILS: 1_690_000, notes: '' },
      { id: 't-9',  address: 'שמואל הנגיד 7, חדרה',   date: '2024-04-15', projectName: '',                floor: 2, rooms: 3, sizeSqm: 75,  totalPriceILS:   870_000, notes: '' },
      { id: 't-10', address: 'נורדאו 20, חדרה',        date: '2024-05-01', projectName: '',                floor: 5, rooms: 4, sizeSqm: 112, totalPriceILS: 1_410_000, notes: '' },
    ],
    basePricePerSqmOverride: null,
  },

  step5: {
    levies: [
      { id: 'lv-1', levyName: 'אגרות בנייה - על כלל השטחים', areaCategory: 'כלל שטחים',  areaSqm: 3840, ratePerSqm: 110 },
      { id: 'lv-2', levyName: 'כביש - קרקע',                  areaCategory: 'קרקע',        areaSqm: 830,  ratePerSqm: 90  },
      { id: 'lv-3', levyName: 'כביש - בנייה',                  areaCategory: 'בנייה',       areaSqm: 3840, ratePerSqm: 55  },
      { id: 'lv-4', levyName: 'מדרכה - קרקע',                  areaCategory: 'קרקע',        areaSqm: 830,  ratePerSqm: 40  },
      { id: 'lv-5', levyName: 'מדרכה - בנייה',                 areaCategory: 'בנייה',       areaSqm: 3840, ratePerSqm: 25  },
      { id: 'lv-6', levyName: 'תיעול - מגרש',                  areaCategory: 'מגרש',        areaSqm: 830,  ratePerSqm: 60  },
      { id: 'lv-7', levyName: 'תיעול - בנייה',                 areaCategory: 'בנייה',       areaSqm: 3840, ratePerSqm: 35  },
      { id: 'lv-8', levyName: 'דמי הקמה תאגיד המים',          areaCategory: 'יח"ד',        areaSqm: 31,   ratePerSqm: 6500 },
    ],
  },

  step6: {
    betterment: {
      existingResidentialUnits: 12,
      existingResidentialAreaSqm: 1360,
      existingResidentialValuePerSqm: 7500,

      existingCommercialAreaSqm: 310,
      existingCommercialValuePerSqm: 8000,

      newResidentialAreaSqm: 3200,
      newResidentialValuePerSqm: 12500,
      newCommercialAreaSqm: 350,
      newCommercialValuePerSqm: 10000,

      demolitionAndDeveloperObligations: 3_200_000,

      deferralYears: 3,
      deferralRatePct: 6,
      levyPct: 50,
    },
  },

  step7: {
    inventoryRows: [
      { id: 'iv-1', productType: 'דירת 3 חדרים',  unitCount: 4,  avgSizeSqm: 85,  pricePerSqmILS: 12_000, isCommercial: false },
      { id: 'iv-2', productType: 'דירת 4 חדרים',  unitCount: 10, avgSizeSqm: 110, pricePerSqmILS: 12_500, isCommercial: false },
      { id: 'iv-3', productType: 'דירת 5 חדרים',  unitCount: 5,  avgSizeSqm: 135, pricePerSqmILS: 13_000, isCommercial: false },
      { id: 'iv-4', productType: 'מסחר לשיווק',   unitCount: 1,  avgSizeSqm: 262, pricePerSqmILS: 9_000,  isCommercial: true  },
    ],
  },

  step8: {
    sections: [
      {
        id: 's1',
        label: 'עלות בנייה ישירה',
        rows: [
          { id: 's1r1', description: 'שטח עילי מגורים',    rateLabel: '₪ למ"ר',  rateValue: 6_500,  quantity: 1, areaSqm: 3200, calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r2', description: 'שטח עילי מסחר',      rateLabel: '₪ למ"ר',  rateValue: 4_500,  quantity: 1, areaSqm: 350,  calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r3', description: 'מרפסות פתוחות',       rateLabel: '₪ למ"ר',  rateValue: 1_500,  quantity: 1, areaSqm: 480,  calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r4', description: 'מרפסות גג',           rateLabel: '₪ למ"ר',  rateValue: 1_800,  quantity: 1, areaSqm: 80,   calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r5', description: 'שטח תת"ק',            rateLabel: '₪ למ"ר',  rateValue: 4_000,  quantity: 1, areaSqm: 806,  calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r6', description: 'פיתוח צמוד',          rateLabel: '₪ למ"ר',  rateValue: 800,    quantity: 1, areaSqm: 830,  calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r7', description: 'הריסה ופינוי',         rateLabel: '₪ למ"ר',  rateValue: 400,    quantity: 1, areaSqm: 1820, calcMode: 'rate_x_area', refTotal: null },
          { id: 's1r8', description: 'הקמת שב"צ',            rateLabel: 'סכום',    rateValue: 350_000, quantity: 1, areaSqm: 1,   calcMode: 'fixed',       refTotal: null },
          { id: 's1r9', description: 'פיצוי נופי',           rateLabel: 'סכום',    rateValue: 120_000, quantity: 1, areaSqm: 1,   calcMode: 'fixed',       refTotal: null },
        ],
      },
      {
        id: 's2',
        label: 'עלויות עקיפות',
        rows: [
          { id: 's2r1', description: 'אגרות בנייה והיטלי פיתוח', rateLabel: 'מ-שלב 5', rateValue: 0, quantity: 1, areaSqm: 1, calcMode: 'ref', refTotal: null },
          { id: 's2r2', description: 'חיבור חשמל - מגורים',       rateLabel: '₪ ליח"ד', rateValue: 8_000,   quantity: 31, areaSqm: 1,    calcMode: 'rate_x_qty', refTotal: null },
          { id: 's2r3', description: 'חיבורי חשמל - מסחר',        rateLabel: '₪ למ"ר',  rateValue: 150,     quantity: 1,  areaSqm: 350,  calcMode: 'rate_x_area', refTotal: null },
          { id: 's2r4', description: 'תכנון ויועצים',              rateLabel: '% מבנייה', rateValue: 6,       quantity: 1,  areaSqm: 1,    calcMode: 'pct_of_total', refTotal: null },
          { id: 's2r5', description: 'שיווק ופרסום',               rateLabel: '₪ ליח"ד', rateValue: 18_000,  quantity: 19, areaSqm: 1,    calcMode: 'rate_x_qty', refTotal: null },
          { id: 's2r6', description: 'תקורה, הנהלה וכלליות',       rateLabel: '₪ ליח"ד', rateValue: 12_000,  quantity: 31, areaSqm: 1,    calcMode: 'rate_x_qty', refTotal: null },
          { id: 's2r7', description: 'בצ"מ',                       rateLabel: '% מבנייה', rateValue: 4,       quantity: 1,  areaSqm: 1,    calcMode: 'pct_of_total', refTotal: null },
          { id: 's2r8', description: 'תיווך',                      rateLabel: '₪ ליח"ד', rateValue: 25_000,  quantity: 19, areaSqm: 1,    calcMode: 'rate_x_qty', refTotal: null },
          { id: 's2r9', description: 'משפטיות',                    rateLabel: '₪ ליח"ד', rateValue: 10_000,  quantity: 31, areaSqm: 1,    calcMode: 'rate_x_qty', refTotal: null },
        ],
      },
      {
        id: 's3',
        label: 'עלות דיירים',
        rows: [
          { id: 's3r1', description: 'שכ"ד דיור חלופי לדירות',          rateLabel: '₪ לחודש', rateValue: 3_500, quantity: 30, areaSqm: 12, calcMode: 'rate_x_qty', refTotal: null },
          { id: 's3r2', description: 'שכ"ד דיור חלופי ליח. מסחר',       rateLabel: '₪ לחודש', rateValue: 5_000, quantity: 18, areaSqm: 1,  calcMode: 'rate_x_qty', refTotal: null },
          { id: 's3r3', description: 'הוצאות העברה ואחסון',              rateLabel: '₪ לדייר', rateValue: 8_000, quantity: 12, areaSqm: 1,  calcMode: 'rate_x_qty', refTotal: null },
          { id: 's3r4', description: 'עו"ד, שמאי, מפקח דיירים',          rateLabel: '₪ לדייר', rateValue: 15_000, quantity: 12, areaSqm: 1, calcMode: 'rate_x_qty', refTotal: null },
          { id: 's3r5', description: 'קרן אחזקה',                        rateLabel: 'סכום',    rateValue: 200_000, quantity: 1, areaSqm: 1, calcMode: 'fixed',      refTotal: null },
        ],
      },
      {
        id: 's4',
        label: 'עלויות מיסוי',
        rows: [
          { id: 's4r1', description: 'מס רכישה',           rateLabel: 'סכום', rateValue: 0,         quantity: 1, areaSqm: 1, calcMode: 'fixed', refTotal: null },
          { id: 's4r2', description: 'מעמ שירותי בניה',    rateLabel: '% מבנייה', rateValue: 17,   quantity: 1, areaSqm: 1, calcMode: 'pct_of_total', refTotal: null },
          { id: 's4r3', description: 'מס שבח לדיירים',     rateLabel: 'סכום', rateValue: 0,         quantity: 1, areaSqm: 1, calcMode: 'fixed', refTotal: null },
          { id: 's4r4', description: 'היטל השבחה',         rateLabel: 'מ-שלב 6', rateValue: 0,     quantity: 1, areaSqm: 1, calcMode: 'ref',   refTotal: null },
        ],
      },
      {
        id: 's5',
        label: 'עלויות מימון',
        rows: [
          { id: 's5r1', description: 'מימון % מעלויות הפרויקט', rateLabel: '% מעלויות', rateValue: 5, quantity: 1, areaSqm: 1, calcMode: 'pct_of_total', refTotal: null },
        ],
      },
    ],
  },
}
