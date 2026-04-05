import { produce } from 'immer'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { ReportTable, type ColumnDef } from '@/components/shared/ReportTable'
import { CurrencyInput } from '@/components/shared/CurrencyInput'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { MarketTransaction, Report } from '@/types/report'
import { calcPricePerSqm, calcAveragePricePerSqm, calcTransactionsByRooms } from '@/lib/calculations'

const transactionColumns: ColumnDef<MarketTransaction>[] = [
  { type: 'input', key: 'date',          header: 'תאריך מכירה',    inputType: 'text',     width: '110px' },
  { type: 'input', key: 'address',       header: 'כתובת',          inputType: 'text',     width: '180px' },
  { type: 'input', key: 'projectName',   header: 'פרויקט',         inputType: 'text',     width: '130px' },
  { type: 'input', key: 'floor',         header: 'קומה',           inputType: 'number',   width: '70px'  },
  { type: 'input', key: 'rooms',         header: 'חדרים',          inputType: 'number',   width: '70px'  },
  { type: 'input', key: 'sizeSqm',       header: 'שטח נטו (מ"ר)',  inputType: 'number',   width: '110px' },
  { type: 'input', key: 'totalPriceILS', header: 'מחיר מדווח (₪)', inputType: 'currency', width: '140px' },
  {
    type: 'calculated', key: 'pricePerSqm', header: 'מחיר למ"ר', format: 'currency',
    calculated: (row) => calcPricePerSqm(row as MarketTransaction), width: '110px',
  },
  { type: 'input', key: 'notes', header: 'הערות', inputType: 'text', width: '130px' },
]

function newTransaction(): MarketTransaction {
  return {
    id: crypto.randomUUID(),
    address: '',
    date: new Date().toISOString().split('T')[0],
    projectName: '',
    floor: 0,
    rooms: 4,
    sizeSqm: 0,
    totalPriceILS: 0,
    notes: '',
  }
}

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step4MarketSurvey({ report, updateStep }: Props) {
  if (!report) return null

  const handleTxChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step4.transactions, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step4', value: { ...report.step4, transactions: updated } })
  }

  const handleAddRow = () => {
    updateStep({
      key: 'step4',
      value: { ...report.step4, transactions: [...report.step4.transactions, newTransaction()] },
    })
  }

  const handleBasePriceChange = (v: number) =>
    updateStep({
      key: 'step4',
      value: { ...report.step4, basePricePerSqmOverride: v === 0 ? null : v },
    })

  const avgPrice = calcAveragePricePerSqm(report)
  const byRooms = calcTransactionsByRooms(report)
  const roomGroups = Array.from(byRooms.entries()).sort((a, b) => a[0] - b[0])

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">עסקאות שוק</h3>
        <ReportTable
          columns={transactionColumns}
          rows={report.step4.transactions}
          onRowChange={handleTxChange}
          onAddRow={handleAddRow}
          showAddRow
          report={report}
        />
      </section>

      {roomGroups.length > 0 && (
        <section>
          <h3 className="text-base font-semibold text-slate-700 mb-3">סיכום לפי מספר חדרים</h3>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-4 py-2.5 text-right font-medium">חדרים</th>
                  <th className="px-4 py-2.5 text-right font-medium">מס\' עסקאות</th>
                  <th className="px-4 py-2.5 text-right font-medium">שטח ממוצע (מ"ר)</th>
                  <th className="px-4 py-2.5 text-right font-medium">מחיר ממוצע (₪)</th>
                  <th className="px-4 py-2.5 text-right font-medium">מחיר ממוצע למ"ר</th>
                </tr>
              </thead>
              <tbody>
                {roomGroups.map(([rooms, txs]) => {
                  const avgSize       = txs.reduce((s, t) => s + t.sizeSqm, 0) / txs.length
                  const avgTotalPrice = txs.reduce((s, t) => s + t.totalPriceILS, 0) / txs.length
                  const avgPPS        = txs.reduce((s, t) => s + calcPricePerSqm(t), 0) / txs.length
                  return (
                    <tr key={rooms} className="border-t border-slate-100">
                      <td className="px-4 py-2.5 font-medium">{rooms} חדרים</td>
                      <td className="px-4 py-2.5 text-right">{txs.length}</td>
                      <td className="px-4 py-2.5 text-right">{formatNumber(avgSize)}</td>
                      <td className="px-4 py-2.5 text-right">{formatCurrency(avgTotalPrice)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-blue-700">{formatCurrency(avgPPS)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
          <h3 className="text-base font-bold text-amber-800 mb-3">השווי הבנוי עליו נסתמך</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-amber-700 mb-1">
                ממוצע חישובי: <strong>{formatCurrency(avgPrice)} למ"ר</strong>
              </p>
              <p className="text-xs text-amber-600">
                ניתן להזין ערך עקיפה ידני — אם לא הוזן, המחיר הממוצע ישמש בחישובים
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <label className="text-xs text-amber-700 font-medium">ערך עקיפה (אופציונלי)</label>
              <div className="flex items-center gap-2">
                <CurrencyInput
                  value={report.step4.basePricePerSqmOverride ?? 0}
                  onChange={handleBasePriceChange}
                  placeholder="ממוצע אוטומטי"
                  className="w-36 border border-amber-300 rounded px-3 py-2 text-right bg-white"
                />
                <span className="text-amber-700 font-medium text-sm">₪ / מ"ר</span>
              </div>
              <p className="text-lg font-bold text-amber-900">{formatCurrency(avgPrice)} למ"ר</p>
            </div>
          </div>
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

export default connector(Step4MarketSurvey)
