import { produce } from 'immer'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { ReportTable, type ColumnDef } from '@/components/shared/ReportTable'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { LevyRow, Report } from '@/types/report'
import {
  calcLeviesSubtotal,
  calcLeviesTotal,
  calcLeviesPerAboveGroundSqm,
  calcStep3Areas,
  calcLevyRowTotal,
} from '@/lib/calculations'

const levyColumns: ColumnDef<LevyRow>[] = [
  { type: 'input', key: 'levyName',     header: 'אגרה / היטל',       inputType: 'text',     width: '230px' },
  { type: 'input', key: 'areaCategory', header: 'קטגוריה',            inputType: 'text',     width: '110px' },
  { type: 'input', key: 'areaSqm',      header: 'שטח לחישוב (מ"ר)',   inputType: 'number',   width: '130px' },
  { type: 'input', key: 'ratePerSqm',   header: 'תעריף (₪/מ"ר)',      inputType: 'currency', width: '130px' },
  {
    type: 'calculated', key: 'total', header: 'סה"כ לתשלום (₪)', format: 'currency',
    calculated: (row) => calcLevyRowTotal(row.ratePerSqm, row.areaSqm), width: '150px',
  },
]

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step5Levies({ report, updateStep }: Props) {
  if (!report) return null

  const handleLevyChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step5.levies, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step5', value: { ...report.step5, levies: updated } })
  }

  const subtotal = calcLeviesSubtotal(report)
  const total    = calcLeviesTotal(report)
  const perSqm   = calcLeviesPerAboveGroundSqm(report)
  const areas    = calcStep3Areas(report)

  const areasRows = [
    { label: 'שטח המגרש נטו',              value: formatNumber(areas.plotSqm),                  unit: 'מ"ר' },
    { label: 'שטח מבונה למגורים (ברוטו)',   value: formatNumber(areas.residentialAboveGroundSqm), unit: 'מ"ר' },
    { label: 'שטח מבונה למסחר',             value: formatNumber(areas.commercialSqm),            unit: 'מ"ר' },
    { label: 'שטח תת"ק',                    value: formatNumber(areas.undergroundSqm),            unit: 'מ"ר' },
    { label: 'מרפסות',                      value: formatNumber(areas.balconiesSqm),              unit: 'מ"ר' },
    { label: 'יח"ד מגורים',                 value: String(areas.unitCount),                       unit: 'יח"ד' },
    { label: 'סה"כ שטח קיים לקיזוז (80%)', value: formatNumber(areas.existingAreaToDeduct),       unit: 'מ"ר', bold: true },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">כלל השטחים לבנייה (מ-שלב 3)</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {areasRows.map(({ label, value, unit, bold }) => (
                <tr key={label} className="border-t border-slate-100 first:border-0">
                  <td className={cn('px-4 py-2.5', bold ? 'font-bold text-slate-800' : 'text-slate-600')}>{label}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800 w-32">{value}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs w-16">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">חישוב אגרות והיטלים</h3>
        <ReportTable
          columns={levyColumns}
          rows={report.step5.levies}
          onRowChange={handleLevyChange}
          report={report}
        />

        <div className="mt-2 bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t border-slate-100 font-semibold">
                <td className="px-4 py-2.5 text-slate-700">סה"כ</td>
                <td className="px-4 py-2.5 text-right text-slate-800">{formatCurrency(subtotal)}</td>
              </tr>
              <tr className="border-t border-slate-100 font-semibold bg-slate-50">
                <td className="px-4 py-2.5 text-slate-700">בתוספת מקדם 6%</td>
                <td className="px-4 py-2.5 text-right text-slate-800">{formatCurrency(total)}</td>
              </tr>
              <tr className="border-t-2 border-amber-200 bg-amber-50 font-bold">
                <td className="px-4 py-2.5 text-amber-900">אגרות למ"ר עילי בפרויקט</td>
                <td className="px-4 py-2.5 text-right text-amber-900">{formatCurrency(perSqm)} / מ"ר</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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

export default connector(Step5Levies)
