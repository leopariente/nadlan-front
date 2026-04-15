import { cn, formatCurrency, formatNumber } from '@/lib/utils'

export interface CostRowDef {
  key: string
  label: string
  // Rate column
  rateUnit?: string
  rateValue?: number
  rateEditable?: boolean
  onRateChange?: (v: number) => void
  isRatePercent?: boolean
  // Quantity column
  quantityValue?: number
  quantityUnit?: string
  quantityEditable?: boolean
  onQuantityChange?: (v: number) => void
  // Basis column
  calculationBasis: string
  // Total column
  total: number
  totalEditable?: boolean
  onTotalChange?: (v: number) => void
  // Styling: total is prop-derived (display-only, gray bg)
  isPropDerived?: boolean
}

interface Props {
  title: string
  rows: CostRowDef[]
  totalLabel: string
  totalValue: number
}

export function CostTable({ title, rows, totalLabel, totalValue }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[900px]" dir="rtl">
          <thead>
            <tr className="bg-slate-700 text-white text-xs font-medium">
              <th className="px-3 py-2.5 text-right w-[22%]">סעיף</th>
              <th className="px-3 py-2.5 text-right w-[13%]">עלות (₪ / %)</th>
              <th className="px-3 py-2.5 text-right w-[10%]">כמות</th>
              <th className="px-3 py-2.5 text-right w-[7%]">יח׳</th>
              <th className="px-3 py-2.5 text-right w-[28%]">בסיס חישוב</th>
              <th className="px-3 py-2.5 text-right w-[20%] bg-slate-600">סה&quot;כ (₪)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.key}
                className={cn(
                  'border-b border-slate-100 last:border-0',
                  i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40',
                )}
              >
                {/* Label */}
                <td className="px-3 py-2 text-slate-700 text-xs leading-snug">{row.label}</td>

                {/* Rate */}
                <td className="px-0 py-0 border-e border-slate-100">
                  {row.rateEditable ? (
                    <div className="flex flex-col">
                      <input
                        type="number"
                        className="cell-input"
                        value={row.rateValue || ''}
                        min={0}
                        placeholder="0"
                        onChange={e => row.onRateChange?.(parseFloat(e.target.value) || 0)}
                      />
                      {row.rateUnit && (
                        <span className="text-[10px] text-slate-400 px-2 pb-0.5 leading-none">
                          {row.rateUnit}
                        </span>
                      )}
                    </div>
                  ) : row.rateValue != null ? (
                    <div className="px-3 py-2 bg-slate-50 text-slate-600 tabular-nums text-right text-xs">
                      {row.isRatePercent
                        ? `${formatNumber(row.rateValue, 1)}%`
                        : formatNumber(row.rateValue, 0)}
                      {row.rateUnit && !row.isRatePercent && (
                        <span className="text-slate-400 ms-1">{row.rateUnit}</span>
                      )}
                    </div>
                  ) : null}
                </td>

                {/* Quantity */}
                <td className="px-0 py-0 border-e border-slate-100">
                  {row.quantityEditable ? (
                    <input
                      type="number"
                      className="cell-input"
                      value={row.quantityValue || ''}
                      min={0}
                      placeholder="0"
                      onChange={e => row.onQuantityChange?.(parseFloat(e.target.value) || 0)}
                    />
                  ) : row.quantityValue != null ? (
                    <div className="px-3 py-2 bg-slate-50 text-slate-600 tabular-nums text-right text-xs">
                      {formatNumber(row.quantityValue, 0)}
                    </div>
                  ) : null}
                </td>

                {/* Quantity unit */}
                <td className="px-2 py-2 text-[10px] text-slate-400 text-right whitespace-nowrap">
                  {row.quantityUnit}
                </td>

                {/* Basis */}
                <td className="px-3 py-2 text-[11px] text-slate-500 leading-relaxed">
                  {row.calculationBasis}
                </td>

                {/* Total */}
                <td
                  className={cn(
                    'px-0 py-0',
                    row.isPropDerived
                      ? 'bg-slate-100'
                      : row.totalEditable
                      ? 'bg-white'
                      : 'bg-amber-50/60',
                  )}
                >
                  {row.totalEditable ? (
                    <input
                      type="number"
                      className="cell-input"
                      value={row.total || ''}
                      min={0}
                      placeholder="0"
                      onChange={e => row.onTotalChange?.(parseFloat(e.target.value) || 0)}
                    />
                  ) : (
                    <div
                      className={cn(
                        'px-3 py-2 font-semibold tabular-nums text-right text-sm',
                        row.isPropDerived ? 'text-slate-500' : 'text-slate-800',
                      )}
                    >
                      {formatCurrency(row.total)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-amber-100 border-t-2 border-amber-300">
              <td colSpan={5} className="px-3 py-3 font-bold text-amber-900 text-sm">
                {totalLabel}
              </td>
              <td className="px-3 py-3 font-bold text-amber-800 tabular-nums text-right text-base">
                {formatCurrency(totalValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
