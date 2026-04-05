import { produce } from 'immer'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { ReportTable, type ColumnDef } from '@/components/shared/ReportTable'
import { formatCurrency } from '@/lib/utils'
import type { InventoryRow, Report } from '@/types/report'
import {
  calcInventoryRowTotal,
  calcInventoryResidentialTotal,
  calcInventoryCommercialTotal,
  calcInventoryTotalWithVAT,
  calcInventoryTotalWithoutVAT,
  calcAveragePricePerSqm,
} from '@/lib/calculations'

const inventoryColumns: ColumnDef<InventoryRow>[] = [
  { type: 'input', key: 'productType',   header: 'טיפוס / מוצר',      inputType: 'text',     width: '170px' },
  { type: 'input', key: 'unitCount',     header: 'מספר יח"ד',         inputType: 'number',   width: '90px'  },
  { type: 'input', key: 'avgSizeSqm',    header: 'שטח פלדלת ממוצע',   inputType: 'number',   width: '130px' },
  {
    type: 'calculated', key: 'totalAreaSqm', header: 'סך שטח פלדלת', format: 'number',
    calculated: (row) => row.unitCount * row.avgSizeSqm, width: '110px',
  },
  { type: 'input', key: 'pricePerSqmILS', header: 'שווי מ"ר פלדלת (₪)', inputType: 'currency', width: '140px' },
  {
    type: 'calculated', key: 'totalValue', header: 'סה"כ שווי מלאי (₪)', format: 'currency',
    calculated: (row) => calcInventoryRowTotal(row.unitCount, row.avgSizeSqm, row.pricePerSqmILS),
    width: '150px',
  },
  {
    type: 'calculated', key: 'pricePerUnit', header: 'מחיר ליח"ד ממוצעת (₪)', format: 'currency',
    calculated: (row) =>
      row.unitCount > 0
        ? calcInventoryRowTotal(row.unitCount, row.avgSizeSqm, row.pricePerSqmILS) / row.unitCount
        : 0,
    width: '160px',
  },
]

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step7Inventory({ report, updateStep }: Props) {
  if (!report) return null

  const handleRowChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step7.inventoryRows, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step7', value: { ...report.step7, inventoryRows: updated } })
  }

  const avgPrice         = calcAveragePricePerSqm(report)
  const residentialTotal = calcInventoryResidentialTotal(report)
  const commercialTotal  = calcInventoryCommercialTotal(report)
  const totalWithVAT     = calcInventoryTotalWithVAT(report)
  const totalWithoutVAT  = calcInventoryTotalWithoutVAT(report)

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
        מחיר שוק ממוצע (מ-שלב 4): <strong>{formatCurrency(avgPrice)} למ"ר</strong>
        &nbsp;— ניתן לעדכן ידנית בכל שורה
      </div>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">תקבולים יזם — שווי מלאי</h3>
        <ReportTable
          columns={inventoryColumns}
          rows={report.step7.inventoryRows}
          onRowChange={handleRowChange}
          report={report}
        />
      </section>

      <section>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-t border-slate-100 font-semibold">
                <td className="px-4 py-2.5 text-slate-700">סה"כ דירות יזם — מגורים</td>
                <td className="px-4 py-2.5 text-right">{formatCurrency(residentialTotal)}</td>
              </tr>
              <tr className="border-t border-slate-100 font-semibold">
                <td className="px-4 py-2.5 text-slate-700">מסחר לשיווק</td>
                <td className="px-4 py-2.5 text-right">{formatCurrency(commercialTotal)}</td>
              </tr>
              <tr className="border-t border-slate-100 font-semibold bg-slate-50">
                <td className="px-4 py-2.5 text-slate-800">סה"כ דירות יזם כולל מע"מ</td>
                <td className="px-4 py-2.5 text-right font-bold">{formatCurrency(totalWithVAT)}</td>
              </tr>
              <tr className="border-t-2 border-amber-200 bg-amber-50 font-bold">
                <td className="px-4 py-2.5 text-amber-900">סה"כ מגורים + מסחר לא כולל מע"מ (÷1.18)</td>
                <td className="px-4 py-2.5 text-right text-amber-900 text-base">{formatCurrency(totalWithoutVAT)}</td>
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

export default connector(Step7Inventory)
