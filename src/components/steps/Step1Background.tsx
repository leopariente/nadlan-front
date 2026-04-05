import { produce } from 'immer'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { ReportTable, type ColumnDef } from '@/components/shared/ReportTable'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { PropertyDetail, FloorPermitRow, Report } from '@/types/report'
import {
  calcTotalGrossBuiltArea,
  calcTotalResidentialBuiltArea,
  calcTotalCommercialBuiltArea,
} from '@/lib/calculations'

const propertyColumns: ColumnDef<PropertyDetail>[] = [
  { type: 'input', key: 'gush',               header: 'גוש',              inputType: 'text',   width: '80px'  },
  { type: 'input', key: 'helka',              header: 'חלקה',             inputType: 'text',   width: '80px'  },
  { type: 'input', key: 'address',            header: 'כתובת',            inputType: 'text',   width: '220px' },
  { type: 'input', key: 'registeredAreaSqm',  header: 'שטח רשום (מ"ר)',   inputType: 'number', width: '120px' },
  { type: 'input', key: 'existingUnits',      header: 'מס\' יח"ד קיימות', inputType: 'number', width: '120px' },
  { type: 'input', key: 'participatingShare', header: 'חלק משתתף (%)',    inputType: 'number', width: '110px' },
]

const floorColumns: ColumnDef<FloorPermitRow>[] = [
  { type: 'input', key: 'floorName',     header: 'קומה',           inputType: 'text',   width: '160px' },
  { type: 'input', key: 'floorAreaSqm',  header: 'שטח קומה (מ"ר)', inputType: 'number', width: '130px' },
  { type: 'input', key: 'balconyAreaSqm', header: 'שטח מרפסות',    inputType: 'number', width: '120px' },
  {
    type: 'calculated',
    key: 'total',
    header: 'סה"כ',
    format: 'number',
    calculated: (row) => row.floorAreaSqm + row.balconyAreaSqm,
    width: '100px',
  },
]

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step1Background({ report, updateStep }: Props) {
  if (!report) return null

  const handlePropertyChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step1.propertyDetails, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step1', value: { ...report.step1, propertyDetails: updated } })
  }

  const handleFloorChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step1.floorPermits, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step1', value: { ...report.step1, floorPermits: updated } })
  }

  const totalResidential = calcTotalResidentialBuiltArea(report)
  const totalCommercial = calcTotalCommercialBuiltArea(report)
  const totalGross = calcTotalGrossBuiltArea(report)

  const summaryRows = [
    { label: 'מס\' יח"ד מגורים קיימות', value: String(report.step1.propertyDetails[0]?.existingUnits ?? 0), unit: 'יח"ד' },
    { label: 'סה"כ שטח דירתי בנוי',     value: formatNumber(totalResidential),                              unit: 'מ"ר' },
    { label: 'סה"כ שטח מסחרי קיים',      value: formatNumber(totalCommercial),                              unit: 'מ"ר' },
    { label: 'סה"כ שטח בנוי ברוטו',      value: formatNumber(totalGross),                                   unit: 'מ"ר', highlight: true },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">פרטי הנכס</h3>
        <ReportTable
          columns={propertyColumns}
          rows={report.step1.propertyDetails}
          onRowChange={handlePropertyChange}
          report={report}
        />
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">היתרי בנייה קיימים</h3>
        <ReportTable
          columns={floorColumns}
          rows={report.step1.floorPermits}
          onRowChange={handleFloorChange}
          report={report}
        />

        <div className="mt-4 bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {summaryRows.map(({ label, value, unit, highlight }) => (
                <tr
                  key={label}
                  className={cn(
                    highlight ? 'bg-amber-50 border-t-2 border-amber-200' : 'border-t border-slate-100'
                  )}
                >
                  <td className="px-4 py-2.5 text-slate-600 font-medium">{label}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-slate-800 w-32">{value}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs w-16">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="text-xs text-slate-400 border-t border-dashed border-slate-200 pt-3">
        * נתונים אלה ישמשו בחישובי שלב 2 (תכנון) ושלב 6 (היטל השבחה)
        — סה"כ שטח דירתי בנוי: {formatCurrency(totalResidential)} מ"ר
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  report: state.report.report,
})

const mapDispatchToProps = {
  updateStep,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Step1Background)
