import { useState } from 'react'
import { TabSwitcher } from '@/components/shared/TabSwitcher'
import { CostTable } from './CostTable'
import type { CostRowDef } from './CostTable'
import { formatCurrency } from '@/lib/utils'
import { inputClass } from '@/components/shared/formStyles'
import type { Section8Data } from '@/types'

type TabKey = 'direct' | 'indirect' | 'residents' | 'taxes' | 'financing'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'direct',    label: 'עלות בנייה ישירה' },
  { key: 'indirect',  label: 'עלויות עקיפות'    },
  { key: 'residents', label: 'עלות דיירים'       },
  { key: 'taxes',     label: 'עלויות מיסוי'      },
  { key: 'financing', label: 'עלויות מימון'      },
]

interface Props {
  data: Section8Data
  onChange: (data: Section8Data) => void
  // From Section 3
  totalGrossResidentialArea: number
  totalGrossCommercialArea: number
  totalOpenBalconies: number
  totalRoofBalconies: number
  totalUndergroundArea: number
  newTotalUnits: number
  developerUnitsForSale: number
  // From Section 5
  totalLeviesAndFees: number
  // From Section 6
  estimatedBettermentLevy: number
  // From Section 7
  totalRevenueIncVat: number
  totalRevenueExVat: number
  developerRevenueExVat: number
  readOnly?: boolean
}

export default function Section8EconomicAnalysis({
  data,
  onChange,
  totalGrossResidentialArea,
  totalGrossCommercialArea,
  totalOpenBalconies,
  totalRoofBalconies,
  totalUndergroundArea,
  newTotalUnits,
  totalLeviesAndFees,
  estimatedBettermentLevy,
  totalRevenueIncVat,
  totalRevenueExVat,
  developerRevenueExVat,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('direct')

  const set =
    <K extends keyof Section8Data>(key: K) =>
    (value: Section8Data[K]) =>
      onChange({ ...data, [key]: value })

  // ─── Compute table totals ─────────────────────────────────────────────────

  const table1Total =
    data.t1ResidentialRate * totalGrossResidentialArea +
    data.t1CommercialRate * totalGrossCommercialArea +
    data.t1OpenBalconyRate * totalOpenBalconies +
    data.t1RoofBalconyRate * totalRoofBalconies +
    data.t1ParkingCompRate * data.t1ParkingCompQty +
    data.t1UndergroundRate * totalUndergroundArea +
    data.t1OutdoorDevRate * data.t1OutdoorDevQty +
    data.t1DemolitionRate * 0 +
    data.t1PublicBuildingRate * data.t1PublicBuildingQty +
    data.t1LandscapeTotal

  const table2Total =
    totalLeviesAndFees +
    data.t2ElectricRate * newTotalUnits +
    data.t2PlanningRate * newTotalUnits +
    (data.t2MarketingPct / 100) * totalRevenueExVat +
    (data.t2OverheadPct / 100) * table1Total +
    (data.t2ContingencyPct / 100) * table1Total +
    (data.t2BrokeragePct / 100) * developerRevenueExVat +
    (data.t2LegalPct / 100) * totalRevenueIncVat

  const table3Total = 0

  const table4Total =
    (data.t4PurchaseTaxPct / 100) * data.t4PurchaseTaxBasis +
    data.t4VatServiceTotal +
    data.t4CapGainTotal +
    estimatedBettermentLevy

  const tables1to4 = table1Total + table2Total + table3Total + table4Total
  const table5Total = (data.t5FinancingPct / 100) * tables1to4
  const totalConstructionCosts = tables1to4 + table5Total

  // ─── Row definitions ──────────────────────────────────────────────────────

  const table1Rows: CostRowDef[] = [
    {
      key: 'res',
      label: 'שטח עילי מגורים',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1ResidentialRate,
      rateEditable: true,
      onRateChange: set('t1ResidentialRate'),
      quantityValue: totalGrossResidentialArea,
      quantityUnit: 'מ"ר',
      calculationBasis: 'עלויות בנייה מקובלות',
      total: data.t1ResidentialRate * totalGrossResidentialArea,
    },
    {
      key: 'comm',
      label: 'שטח עילי מסחר — מעטפת',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1CommercialRate,
      rateEditable: true,
      onRateChange: set('t1CommercialRate'),
      quantityValue: totalGrossCommercialArea,
      quantityUnit: 'מ"ר',
      calculationBasis: 'עלויות בנייה מקובלות',
      total: data.t1CommercialRate * totalGrossCommercialArea,
    },
    {
      key: 'openBalcony',
      label: 'מרפסות פתוחות',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1OpenBalconyRate,
      rateEditable: true,
      onRateChange: set('t1OpenBalconyRate'),
      quantityValue: totalOpenBalconies,
      quantityUnit: 'מ"ר',
      calculationBasis: 'עלויות בנייה מקובלות',
      total: data.t1OpenBalconyRate * totalOpenBalconies,
    },
    {
      key: 'roofBalcony',
      label: 'מרפסות גג',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1RoofBalconyRate,
      rateEditable: true,
      onRateChange: set('t1RoofBalconyRate'),
      quantityValue: totalRoofBalconies,
      quantityUnit: 'מ"ר',
      calculationBasis: 'הנחה',
      total: data.t1RoofBalconyRate * totalRoofBalconies,
    },
    {
      key: 'parkingComp',
      label: 'פיצוי חניות עיליות קיימות',
      rateUnit: '₪/יח"ד',
      rateValue: data.t1ParkingCompRate,
      rateEditable: true,
      onRateChange: set('t1ParkingCompRate'),
      quantityValue: data.t1ParkingCompQty,
      quantityUnit: 'יח"ד',
      quantityEditable: true,
      onQuantityChange: set('t1ParkingCompQty'),
      calculationBasis: 'הנחה',
      total: data.t1ParkingCompRate * data.t1ParkingCompQty,
    },
    {
      key: 'underground',
      label: 'שטח תת"ק',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1UndergroundRate,
      rateEditable: true,
      onRateChange: set('t1UndergroundRate'),
      quantityValue: totalUndergroundArea,
      quantityUnit: 'מ"ר',
      calculationBasis: 'עלויות בנייה מקובלות',
      total: data.t1UndergroundRate * totalUndergroundArea,
    },
    {
      key: 'outdoorDev',
      label: 'פיתוח צמוד (כולל חניה עילית)',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1OutdoorDevRate,
      rateEditable: true,
      onRateChange: set('t1OutdoorDevRate'),
      quantityValue: data.t1OutdoorDevQty,
      quantityUnit: 'מ"ר',
      quantityEditable: true,
      onQuantityChange: set('t1OutdoorDevQty'),
      calculationBasis: "לפי תכסית 50%, כולל גדר היקפית, שבילים, שער גינון וכו'",
      total: data.t1OutdoorDevRate * data.t1OutdoorDevQty,
    },
    {
      key: 'demolition',
      label: 'הריסה ופינוי',
      rateUnit: '₪/מ"ר',
      rateValue: data.t1DemolitionRate,
      rateEditable: true,
      onRateChange: set('t1DemolitionRate'),
      quantityValue: 0,
      quantityUnit: 'מ"ר',
      calculationBasis: 'סה"כ שטח קיים להריסה',
      total: 0,
    },
    {
      key: 'publicBuilding',
      label: 'הקמת שב"צ — באחריות היזם',
      rateUnit: '₪/מ"ר כולל מע"מ',
      rateValue: data.t1PublicBuildingRate,
      rateEditable: true,
      onRateChange: set('t1PublicBuildingRate'),
      quantityValue: data.t1PublicBuildingQty,
      quantityUnit: 'מ"ר',
      quantityEditable: true,
      onQuantityChange: set('t1PublicBuildingQty'),
      calculationBasis: 'כולל מע"מ',
      total: data.t1PublicBuildingRate * data.t1PublicBuildingQty,
    },
    {
      key: 'landscape',
      label: 'פיצוי נופי',
      calculationBasis: 'שימור והעתקת עצים קיימים',
      total: data.t1LandscapeTotal,
      totalEditable: true,
      onTotalChange: set('t1LandscapeTotal'),
    },
  ]

  const table2Rows: CostRowDef[] = [
    {
      key: 'levies',
      label: 'אגרות בנייה והיטלי פיתוח',
      calculationBasis: 'עפ"י תחשיב',
      total: totalLeviesAndFees,
      isPropDerived: true,
    },
    {
      key: 'electric',
      label: 'חיבור חשמל — מגורים',
      rateUnit: '₪/יח"ד',
      rateValue: data.t2ElectricRate,
      rateEditable: true,
      onRateChange: set('t2ElectricRate'),
      quantityValue: newTotalUnits,
      quantityUnit: 'יח"ד',
      calculationBasis: 'עלויות בנייה מקובלות',
      total: data.t2ElectricRate * newTotalUnits,
    },
    {
      key: 'planning',
      label: 'תכנון ויועצים',
      rateUnit: '₪/יח"ד',
      rateValue: data.t2PlanningRate,
      rateEditable: true,
      onRateChange: set('t2PlanningRate'),
      quantityValue: newTotalUnits,
      quantityUnit: 'יח"ד',
      calculationBasis: 'עלויות בנייה מקובלות',
      total: data.t2PlanningRate * newTotalUnits,
    },
    {
      key: 'marketing',
      label: 'שיווק ופרסום',
      rateUnit: '%',
      rateValue: data.t2MarketingPct,
      rateEditable: true,
      onRateChange: set('t2MarketingPct'),
      isRatePercent: true,
      quantityValue: totalRevenueExVat,
      quantityUnit: '₪',
      calculationBasis: 'משווי מלאי ללא מע"מ',
      total: (data.t2MarketingPct / 100) * totalRevenueExVat,
    },
    {
      key: 'overhead',
      label: 'תקורה, הנהלה וכלליות לרבות פיקוח פיננסי',
      rateUnit: '%',
      rateValue: data.t2OverheadPct,
      rateEditable: true,
      onRateChange: set('t2OverheadPct'),
      isRatePercent: true,
      quantityValue: table1Total,
      quantityUnit: '₪',
      calculationBasis: 'מעלויות בנייה ישירה',
      total: (data.t2OverheadPct / 100) * table1Total,
    },
    {
      key: 'contingency',
      label: 'בצ"מ',
      rateUnit: '%',
      rateValue: data.t2ContingencyPct,
      rateEditable: true,
      onRateChange: set('t2ContingencyPct'),
      isRatePercent: true,
      quantityValue: table1Total,
      quantityUnit: '₪',
      calculationBasis: 'מעלויות בנייה ישירה',
      total: (data.t2ContingencyPct / 100) * table1Total,
    },
    {
      key: 'brokerage',
      label: 'תיווך',
      rateUnit: '%',
      rateValue: data.t2BrokeragePct,
      rateEditable: true,
      onRateChange: set('t2BrokeragePct'),
      isRatePercent: true,
      quantityValue: developerRevenueExVat,
      quantityUnit: '₪',
      calculationBasis: 'משווי מלאי יזם ללא מע"מ',
      total: (data.t2BrokeragePct / 100) * developerRevenueExVat,
    },
    {
      key: 'legal',
      label: 'משפטיות',
      rateUnit: '%',
      rateValue: data.t2LegalPct,
      rateEditable: true,
      onRateChange: set('t2LegalPct'),
      isRatePercent: true,
      quantityValue: totalRevenueIncVat,
      quantityUnit: '₪',
      calculationBasis: 'משווי מלאי כולל מע"מ',
      total: (data.t2LegalPct / 100) * totalRevenueIncVat,
    },
  ]

  const table3Rows: CostRowDef[] = [
    {
      key: 'resRent',
      label: 'שכ"ד דיור חלופי לדירות הפינוי',
      rateUnit: '₪/יח"ד/חודש',
      rateValue: data.t3ResRentRate,
      rateEditable: true,
      onRateChange: set('t3ResRentRate'),
      quantityValue: 0,
      quantityUnit: 'יח"ד',
      calculationBasis: `יחידות קיימות למשך ${data.constructionMonths} חודשי הקמה`,
      total: 0,
    },
    {
      key: 'commRent',
      label: 'שכ"ד דיור חלופי ליחידות המסחר',
      rateUnit: '₪/מ"ר/חודש',
      rateValue: data.t3CommRentRate,
      rateEditable: true,
      onRateChange: set('t3CommRentRate'),
      quantityValue: 0,
      quantityUnit: 'מ"ר',
      calculationBasis: `יחידות קיימות למשך ${data.constructionMonths} חודשי הקמה`,
      total: 0,
    },
    {
      key: 'moving',
      label: 'הוצאות העברה ואחסון הלוך חזור',
      rateUnit: '₪/יח"ד',
      rateValue: data.t3MovingRate,
      rateEditable: true,
      onRateChange: set('t3MovingRate'),
      quantityValue: 0,
      quantityUnit: 'יח"ד',
      calculationBasis: 'שני כיוונים, כולל מע"מ',
      total: 0,
    },
    {
      key: 'lawyer',
      label: 'עו"ד, שמאי מקרקעין ומפקח דיירים',
      rateUnit: '₪/יח"ד',
      rateValue: data.t3LawyerRate,
      rateEditable: true,
      onRateChange: set('t3LawyerRate'),
      quantityValue: 0,
      quantityUnit: 'יח"ד',
      calculationBasis: 'כולל מע"מ',
      total: 0,
    },
    {
      key: 'maintenanceFund',
      label: 'קרן אחזקה',
      rateUnit: '₪/יח"ד/חודש',
      rateValue: data.t3MaintenanceFundRate,
      rateEditable: true,
      onRateChange: set('t3MaintenanceFundRate'),
      quantityValue: 0,
      quantityUnit: 'יח"ד',
      calculationBasis: 'לתקופה של 5 שנים (60 חודשים)',
      total: 0,
    },
  ]

  const table4Rows: CostRowDef[] = [
    {
      key: 'purchaseTax',
      label: 'מס רכישה ליזם (אומדן שירותי בניה לדיירים)',
      rateUnit: '%',
      rateValue: data.t4PurchaseTaxPct,
      rateEditable: true,
      onRateChange: set('t4PurchaseTaxPct'),
      isRatePercent: true,
      quantityValue: data.t4PurchaseTaxBasis,
      quantityUnit: '₪',
      quantityEditable: true,
      onQuantityChange: set('t4PurchaseTaxBasis'),
      calculationBasis: 'מהווה אומדן בלבד',
      total: (data.t4PurchaseTaxPct / 100) * data.t4PurchaseTaxBasis,
    },
    {
      key: 'vatService',
      label: 'מע"מ שירותי בנייה דיור ציבורי',
      calculationBasis: 'הבדיקה נערכה תחת הנחת פטור',
      total: data.t4VatServiceTotal,
      totalEditable: true,
      onTotalChange: set('t4VatServiceTotal'),
    },
    {
      key: 'capGain',
      label: 'מס שבח לדיירים',
      calculationBasis: 'הבדיקה נערכה תחת הנחת פטור ממס שבח',
      total: data.t4CapGainTotal,
      totalEditable: true,
      onTotalChange: set('t4CapGainTotal'),
    },
    {
      key: 'betterment',
      label: 'היטל השבחה',
      calculationBasis: 'אומדן ראשוני בגין אישור תכנית מפורטת',
      total: estimatedBettermentLevy,
      isPropDerived: true,
    },
  ]

  const table5Rows: CostRowDef[] = [
    {
      key: 'financing',
      label: 'מימון',
      rateUnit: '%',
      rateValue: data.t5FinancingPct,
      rateEditable: true,
      onRateChange: set('t5FinancingPct'),
      isRatePercent: true,
      quantityValue: tables1to4,
      quantityUnit: '₪',
      calculationBasis:
        "אומדן עמלות ערבויות חוק מכר, עמלות ליווי, ריביות, ערבות ביצוע לבעלים וכיוב'",
      total: table5Total,
    },
  ]

  // ─── Per-table sub-totals summary strip ───────────────────────────────────

  const summaryItems = [
    { label: 'בנייה ישירה', value: table1Total },
    { label: 'עקיפות',      value: table2Total },
    { label: 'דיירים',      value: table3Total },
    { label: 'מיסוי',       value: table4Total },
    { label: 'מימון',       value: table5Total },
  ]

  return (
    <div className="space-y-5">
      <TabSwitcher
        tabs={TABS}
        activeTab={activeTab}
        onChange={key => setActiveTab(key as TabKey)}
      />

      {activeTab === 'direct' && (
        <CostTable
          title="עלות בנייה ישירה"
          rows={table1Rows}
          totalLabel='סה"כ עלות בנייה ישירה'
          totalValue={table1Total}
        />
      )}

      {activeTab === 'indirect' && (
        <CostTable
          title="עלויות עקיפות"
          rows={table2Rows}
          totalLabel='סה"כ עלויות עקיפות'
          totalValue={table2Total}
        />
      )}

      {activeTab === 'residents' && (
        <div className="space-y-4">
          {/* Construction months — shared input above table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
              תקופת הקמה (חודשים)
            </label>
            <input
              type="number"
              min={1}
              value={data.constructionMonths || ''}
              placeholder="18"
              className={`${inputClass} w-24`}
              onChange={e =>
                set('constructionMonths')(parseFloat(e.target.value) || 18)
              }
            />
            <span className="text-xs text-slate-400">ברירת מחדל: 18 חודשים</span>
          </div>
          <CostTable
            title="עלות דיירים"
            rows={table3Rows}
            totalLabel='סה"כ עלות דיירים'
            totalValue={table3Total}
          />
        </div>
      )}

      {activeTab === 'taxes' && (
        <CostTable
          title="עלויות מיסוי"
          rows={table4Rows}
          totalLabel='סה"כ עלויות מיסוי'
          totalValue={table4Total}
        />
      )}

      {activeTab === 'financing' && (
        <CostTable
          title="עלויות מימון"
          rows={table5Rows}
          totalLabel='סה"כ עלויות מימון'
          totalValue={table5Total}
        />
      )}

      {/* Sub-totals strip */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {summaryItems.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg border border-slate-200 px-3 py-2.5 text-center shadow-sm"
          >
            <div className="text-[10px] text-slate-500 mb-0.5">{label}</div>
            <div className="text-xs font-semibold text-slate-700 tabular-nums leading-tight">
              {formatCurrency(value)}
            </div>
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div className="rounded-xl bg-blue-700 px-6 py-5 flex items-center justify-between gap-4 shadow-lg">
        <div className="text-white">
          <div className="text-base font-bold">סה&quot;כ עלויות הקמה</div>
          <div className="text-xs opacity-70 mt-0.5">
            כולל בנייה ישירה, עקיפות, דיירים, מיסוי ומימון
          </div>
        </div>
        <div className="text-white font-bold text-2xl tabular-nums whitespace-nowrap">
          {formatCurrency(totalConstructionCosts)}
        </div>
      </div>
    </div>
  )
}

// ─── Exported helper for cross-section use (Section 9) ───────────────────────

export function computeSection8(
  data: Section8Data,
  p: {
    totalGrossResidentialArea: number
    totalGrossCommercialArea: number
    totalOpenBalconies: number
    totalRoofBalconies: number
    totalUndergroundArea: number
    newTotalUnits: number
    totalLeviesAndFees: number
    estimatedBettermentLevy: number
    totalRevenueIncVat: number
    totalRevenueExVat: number
    developerRevenueExVat: number
  },
): { directConstructionCosts: number; totalConstructionCosts: number } {
  const t1 =
    data.t1ResidentialRate * p.totalGrossResidentialArea +
    data.t1CommercialRate * p.totalGrossCommercialArea +
    data.t1OpenBalconyRate * p.totalOpenBalconies +
    data.t1RoofBalconyRate * p.totalRoofBalconies +
    data.t1ParkingCompRate * data.t1ParkingCompQty +
    data.t1UndergroundRate * p.totalUndergroundArea +
    data.t1OutdoorDevRate * data.t1OutdoorDevQty +
    data.t1PublicBuildingRate * data.t1PublicBuildingQty +
    data.t1LandscapeTotal

  const t2 =
    p.totalLeviesAndFees +
    data.t2ElectricRate * p.newTotalUnits +
    data.t2PlanningRate * p.newTotalUnits +
    (data.t2MarketingPct / 100) * p.totalRevenueExVat +
    (data.t2OverheadPct / 100) * t1 +
    (data.t2ContingencyPct / 100) * t1 +
    (data.t2BrokeragePct / 100) * p.developerRevenueExVat +
    (data.t2LegalPct / 100) * p.totalRevenueIncVat

  const t4 =
    (data.t4PurchaseTaxPct / 100) * data.t4PurchaseTaxBasis +
    data.t4VatServiceTotal +
    data.t4CapGainTotal +
    p.estimatedBettermentLevy

  const t5 = (data.t5FinancingPct / 100) * (t1 + t2 + t4)

  return {
    directConstructionCosts: t1,
    totalConstructionCosts: t1 + t2 + t4 + t5,
  }
}
