export const SECTIONS = [
  { number: 1, label: 'נתונים כלליים' },
  { number: 2, label: 'זכויות בנייה'  },
  { number: 3, label: 'תמהיל דירות'   },
  { number: 4, label: 'סקר שוק'       },
  { number: 5, label: 'אגרות והיטלים' },
  { number: 6, label: 'היטל השבחה'    },
  { number: 7, label: 'מלאי יזמי'     },
  { number: 8, label: 'ניתוח כלכלי'   },
  { number: 9, label: 'סיכום'         },
] as const

export type SectionNumber = (typeof SECTIONS)[number]['number']
