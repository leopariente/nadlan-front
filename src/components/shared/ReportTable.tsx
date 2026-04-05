import type { Report } from '@/types/report'
import { CurrencyInput } from './CurrencyInput'
import { formatCurrency, formatNumber, cn } from '@/lib/utils'

// ─── Column Definition (discriminated union) ────────────────────────────────

type BaseCol = {
  header: string
  width?: string
  align?: 'right' | 'left' | 'center'
}

type InputCol<T> = BaseCol & {
  type: 'input'
  key: keyof T
  inputType?: 'text' | 'number' | 'currency'
}

type CalcCol<T> = BaseCol & {
  type: 'calculated'
  key: string
  calculated: (row: T, allRows: T[], report: Report) => number | string
  format?: 'currency' | 'number' | 'pct' | 'text'
}

type SelectCol<T> = BaseCol & {
  type: 'select'
  key: keyof T
  options: string[]
}

type LabelCol = BaseCol & {
  type: 'label'
  key: string
}

export type ColumnDef<T> = InputCol<T> | CalcCol<T> | SelectCol<T> | LabelCol

export interface RowConfig {
  isTotal?: boolean
  isKeyFigure?: boolean
  isSection?: boolean
  isReadOnly?: boolean
}

interface ReportTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[]
  rows: T[]
  rowConfig?: (row: T) => RowConfig
  onRowChange?: (rowId: string, key: string, value: unknown) => void
  onAddRow?: () => void
  showAddRow?: boolean
  caption?: string
  report: Report
  className?: string
}

function formatValue(val: number | string, format?: string): string {
  if (typeof val === 'string') return val
  if (format === 'currency') return formatCurrency(val)
  if (format === 'pct') return `${formatNumber(val, 1)}%`
  if (format === 'number') return formatNumber(val, 1)
  return formatCurrency(val) // default: currency
}

export function ReportTable<T extends { id: string }>({
  columns,
  rows,
  rowConfig,
  onRowChange,
  onAddRow,
  showAddRow,
  caption,
  report,
  className,
}: ReportTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-slate-200', className)}>
      <table className="w-full text-sm border-collapse">
        {caption && (
          <caption className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide py-2 px-3 caption-top">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-slate-700 text-white">
            {columns.map(col => (
              <th
                key={col.key as string}
                className="px-3 py-2.5 font-medium text-right whitespace-nowrap"
                style={col.width ? { width: col.width, minWidth: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => {
            const config = rowConfig?.(row) ?? {}
            const rowClass = cn(
              'border-b border-slate-100 last:border-0',
              config.isKeyFigure && 'bg-amber-50',
              config.isTotal && !config.isKeyFigure && 'bg-slate-50',
              config.isSection && 'bg-slate-100',
              rowIdx % 2 === 0 && !config.isTotal && !config.isKeyFigure && !config.isSection && 'bg-white',
              rowIdx % 2 === 1 && !config.isTotal && !config.isKeyFigure && !config.isSection && 'bg-slate-50/40',
            )

            return (
              <tr key={row.id} className={rowClass}>
                {columns.map(col => {
                  const isReadOnly = config.isReadOnly || config.isTotal || col.type === 'calculated' || col.type === 'label'
                  const cellClass = cn(
                    'px-0 py-0 border-e border-slate-100 last:border-0',
                    isReadOnly ? 'bg-gray-100/70' : '',
                    config.isTotal && 'font-bold',
                    config.isKeyFigure && 'font-bold',
                  )

                  if (col.type === 'calculated') {
                    const rawVal = col.calculated(row, rows, report)
                    const isNeg = typeof rawVal === 'number' && rawVal < 0
                    return (
                      <td key={col.key} className={cn(cellClass, 'bg-gray-100/70')}>
                        <div className={cn(
                          'px-3 py-2 text-right',
                          isNeg && 'text-red-600',
                          config.isKeyFigure && 'font-bold'
                        )}>
                          {formatValue(rawVal, col.format)}
                        </div>
                      </td>
                    )
                  }

                  if (col.type === 'label') {
                    return (
                      <td key={col.key} className={cn(cellClass, 'bg-gray-100/70')}>
                        <div className="px-3 py-2 text-right text-slate-600">
                          {String((row as Record<string, unknown>)[col.key] ?? '')}
                        </div>
                      </td>
                    )
                  }

                  if (col.type === 'select') {
                    const currentVal = String((row as Record<string, unknown>)[col.key as string] ?? '')
                    return (
                      <td key={col.key as string} className={cellClass}>
                        <select
                          className="cell-input"
                          value={currentVal}
                          disabled={isReadOnly}
                          onChange={e => onRowChange?.(row.id, col.key as string, e.target.value)}
                        >
                          {col.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                    )
                  }

                  // type === 'input'
                  const rawVal = (row as Record<string, unknown>)[col.key as string]
                  const numVal = typeof rawVal === 'number' ? rawVal : 0
                  const strVal = typeof rawVal === 'string' ? rawVal : String(rawVal ?? '')
                  const isNeg = typeof rawVal === 'number' && rawVal < 0

                  if (col.inputType === 'currency') {
                    return (
                      <td key={col.key as string} className={cellClass}>
                        <CurrencyInput
                          value={numVal}
                          disabled={isReadOnly}
                          className={cn(isNeg && 'text-red-600')}
                          onChange={v => onRowChange?.(row.id, col.key as string, v)}
                        />
                      </td>
                    )
                  }

                  if (col.inputType === 'number' || typeof rawVal === 'number') {
                    return (
                      <td key={col.key as string} className={cellClass}>
                        <input
                          type="number"
                          className={cn('cell-input', isNeg && 'text-red-600')}
                          value={numVal === 0 ? '' : numVal}
                          disabled={isReadOnly}
                          placeholder="0"
                          onChange={e => onRowChange?.(row.id, col.key as string, parseFloat(e.target.value) || 0)}
                        />
                      </td>
                    )
                  }

                  return (
                    <td key={col.key as string} className={cellClass}>
                      <input
                        type="text"
                        className="cell-input"
                        value={strVal}
                        disabled={isReadOnly}
                        onChange={e => onRowChange?.(row.id, col.key as string, e.target.value)}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {showAddRow && onAddRow && (
        <div className="px-3 py-2 border-t border-slate-200 bg-white">
          <button
            onClick={onAddRow}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <span className="text-lg leading-none">+</span>
            הוסף שורה
          </button>
        </div>
      )}
    </div>
  )
}
