import { useState } from 'react'
import { produce } from 'immer'
import { connect } from 'react-redux'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { cn, formatCurrency } from '@/lib/utils'
import type { EconomicRow, Report } from '@/types/report'
import {
  calcEconomicRowTotal,
  calcSectionTotal,
  calcSections1to4Total,
  calcTotalConstructionCosts,
  calcLeviesTotal,
  calcBettermentLevy,
} from '@/lib/calculations'

const SECTION_LABELS = [
  'עלות בנייה ישירה',
  'עלויות עקיפות',
  'עלות דיירים',
  'עלויות מיסוי',
  'עלויות מימון',
]

function EconomicRowTable({
  rows,
  sectionIndex,
  onRowChange,
  s14Total,
}: {
  rows: EconomicRow[]
  sectionIndex: number
  onRowChange: (rowId: string, key: string, value: unknown) => void
  s14Total: number
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-600 text-white text-xs">
            <th className="px-3 py-2 text-right font-medium w-52">הסעיף</th>
            <th className="px-3 py-2 text-right font-medium w-28">עלות / %</th>
            <th className="px-3 py-2 text-right font-medium w-20">כמות</th>
            <th className="px-3 py-2 text-right font-medium w-24">שטח (מ"ר)</th>
            <th className="px-3 py-2 text-right font-medium w-28">אופן חישוב</th>
            <th className="px-3 py-2 text-right font-medium w-36">סה"כ (₪)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const total = calcEconomicRowTotal(row, s14Total)
            const isRef = row.calcMode === 'ref' || row.calcMode === 'pct_of_total'
            const isQtyMode = row.calcMode === 'rate_x_qty' || row.calcMode === 'fixed'
            const isAreaMode = row.calcMode === 'rate_x_area'
            return (
              <tr key={row.id} className={cn(idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')}>
                <td className="px-3 py-2 border-e border-slate-100">
                  <input
                    type="text"
                    className="cell-input"
                    value={row.description}
                    onChange={e => onRowChange(row.id, 'description', e.target.value)}
                  />
                </td>
                <td className="px-3 py-2 border-e border-slate-100">
                  <input
                    type="number"
                    className="cell-input"
                    value={row.rateValue === 0 ? '' : row.rateValue}
                    disabled={isRef}
                    placeholder="0"
                    onChange={e => onRowChange(row.id, 'rateValue', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2 border-e border-slate-100">
                  <input
                    type="number"
                    className="cell-input"
                    value={row.quantity === 0 ? '' : row.quantity}
                    disabled={!isQtyMode}
                    placeholder="0"
                    onChange={e => onRowChange(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2 border-e border-slate-100">
                  <input
                    type="number"
                    className="cell-input"
                    value={row.areaSqm === 0 || row.areaSqm === 1 ? '' : row.areaSqm}
                    disabled={!isAreaMode}
                    placeholder="—"
                    onChange={e => onRowChange(row.id, 'areaSqm', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2 border-e border-slate-100 bg-gray-100/70">
                  <div className="px-1 py-1 text-xs text-slate-500 text-right">{row.rateLabel}</div>
                </td>
                <td className={cn('px-3 py-2 text-right font-semibold bg-gray-100/70', total < 0 ? 'text-red-600' : 'text-slate-800')}>
                  {formatCurrency(total)}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-amber-50 border-t-2 border-amber-200">
            <td colSpan={5} className="px-3 py-2.5 font-bold text-amber-900">
              סה"כ {SECTION_LABELS[sectionIndex]}
            </td>
            <td className="px-3 py-2.5 text-right font-bold text-amber-900">
              {formatCurrency(rows.reduce((s, r) => s + calcEconomicRowTotal(r, s14Total), 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step8Economic({ report, updateStep }: Props) {
  // openSections is pure UI state — not stored in Redux
  const [openSections, setOpenSections] = useState<boolean[]>([true, false, false, false, false])

  if (!report) return null

  const toggleSection = (i: number) => {
    setOpenSections(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  const handleRowChange = (sectionIndex: number) => (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step8.sections, draft => {
      const section = draft[sectionIndex]
      if (!section) return
      const row = section.rows.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step8', value: { sections: updated } })
  }

  // Inject ref totals from other steps before rendering
  const leviesTotal    = calcLeviesTotal(report)
  const bettermentLevy = calcBettermentLevy(report)

  const reportWithRefTotals = produce(report, draft => {
    const s2r1 = draft.step8.sections[1]?.rows[0]
    if (s2r1 && s2r1.calcMode === 'ref') s2r1.refTotal = leviesTotal
    const s4r4 = draft.step8.sections[3]?.rows[3]
    if (s4r4 && s4r4.calcMode === 'ref') s4r4.refTotal = bettermentLevy
  })

  const s14Total   = calcSections1to4Total(reportWithRefTotals)
  const totalCosts = calcTotalConstructionCosts(reportWithRefTotals)

  return (
    <div className="space-y-4">
      {reportWithRefTotals.step8.sections.map((section, i) => (
        <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSection(i)}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <span className="font-semibold">{section.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm bg-white/10 px-3 py-1 rounded-full">
                {formatCurrency(calcSectionTotal(reportWithRefTotals, i))}
              </span>
              {openSections[i] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {openSections[i] && (
            <EconomicRowTable
              rows={section.rows}
              sectionIndex={i}
              onRowChange={handleRowChange(i)}
              s14Total={s14Total}
            />
          )}
        </div>
      ))}

      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-5 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-amber-900">סה"כ עלויות הקמה</span>
        <span className="text-2xl font-bold text-amber-900">{formatCurrency(totalCosts)}</span>
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

export default connector(Step8Economic)
