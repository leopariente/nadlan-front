import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { StatCard } from './StatCard'

function avg(nums: number[]): number {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0
}

function pricePerSqm(t: Transaction): number {
  return t.netAreaSqm > 0 ? Math.round(t.reportedPriceILS / t.netAreaSqm) : 0
}

function emptyTransaction(): Transaction {
  return {
    id: crypto.randomUUID(),
    saleDate: '', address: '', gushHelka: '',
    floor: 0, rooms: 0, netAreaSqm: 0, reportedPriceILS: 0, notes: '',
  }
}

interface Props {
  transactions: Transaction[]
  selectedPricePerSqm: number
  onTransactionsChange: (rows: Transaction[]) => void
  onSelectedPriceChange: (v: number) => void
  readOnly: boolean
}

export function TransactionsTab({
  transactions,
  selectedPricePerSqm,
  onTransactionsChange,
  onSelectedPriceChange,
  readOnly,
}: Props) {
  function updateRow(id: string, patch: Partial<Transaction>) {
    onTransactionsChange(transactions.map(t => (t.id === id ? { ...t, ...patch } : t)))
  }

  function deleteRow(id: string) {
    onTransactionsChange(transactions.filter(t => t.id !== id))
  }

  function addRow() {
    onTransactionsChange([...transactions, emptyTransaction()])
  }

  const valid       = transactions.filter(t => t.netAreaSqm > 0 && t.reportedPriceILS > 0)
  const count       = transactions.length
  const avgArea     = avg(valid.map(t => t.netAreaSqm))
  const avgPrice    = avg(valid.map(t => t.reportedPriceILS))
  const avgPriceSqm = avg(valid.map(t => pricePerSqm(t)))

  const numInput = (id: string, field: 'floor' | 'rooms' | 'netAreaSqm' | 'reportedPriceILS') => (
    <input
      type="number"
      min={0}
      className="cell-input"
      value={(transactions.find(t => t.id === id)?.[field] as number) || ''}
      disabled={readOnly}
      placeholder="0"
      onChange={e => updateRow(id, { [field]: parseFloat(e.target.value) || 0 })}
    />
  )

  const textInput = (id: string, field: 'saleDate' | 'address' | 'gushHelka' | 'notes', placeholder = '') => (
    <input
      type="text"
      className="cell-input"
      value={transactions.find(t => t.id === id)?.[field] ?? ''}
      disabled={readOnly}
      placeholder={placeholder}
      onChange={e => updateRow(id, { [field]: e.target.value })}
    />
  )

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 900 }}>
            <thead>
              <tr className="bg-slate-700 text-white">
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-28">תאריך מכירה</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-36">כתובת</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-32">גו&quot;ח / פרויקט</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-14">קומה</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-14">חדרים</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-20">שטח נטו (מ&quot;ר)</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-28">מחיר מדווח (₪)</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-24 bg-slate-600">מחיר למ&quot;ר</th>
                <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap">הערות</th>
                {!readOnly && <th className="w-8" />}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const pps = pricePerSqm(t)
                return (
                  <tr
                    key={t.id}
                    className={cn(
                      'border-b border-slate-100 last:border-0',
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40',
                    )}
                  >
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t.id, 'saleDate', 'DD/MM/YYYY')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t.id, 'address')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t.id, 'gushHelka')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t.id, 'floor')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t.id, 'rooms')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t.id, 'netAreaSqm')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t.id, 'reportedPriceILS')}</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-700 bg-slate-100/70 border-e border-slate-100 tabular-nums whitespace-nowrap">
                      {pps > 0 ? pps.toLocaleString('he-IL') : '—'}
                    </td>
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t.id, 'notes')}</td>
                    {!readOnly && (
                      <td className="px-2 text-center">
                        <button
                          type="button"
                          onClick={() => deleteRow(t.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors text-base leading-none"
                          aria-label="מחק עסקה"
                        >
                          ×
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}

              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={readOnly ? 9 : 10}
                    className="px-4 py-8 text-center text-sm text-slate-400"
                  >
                    אין עסקאות — לחץ &quot;הוסף עסקה&quot; להוספה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!readOnly && (
          <div className="px-4 py-2.5 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              <span className="text-base leading-none">+</span> הוסף עסקה
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <StatCard label="מס׳ עסקאות" value={count} />
        <StatCard label='ממוצע שטח' value={Math.round(avgArea)} suffix='מ"ר' />
        <StatCard label="ממוצע מחיר" value={`${Math.round(avgPrice).toLocaleString('he-IL')} ₪`} />
        <StatCard label='ממוצע מחיר למ"ר' value={`${Math.round(avgPriceSqm).toLocaleString('he-IL')} ₪`} />
      </div>

      {count > 0 && count < 20 && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span className="text-base leading-none">⚠</span>
          פחות מ־20 עסקאות — מומלץ להרחיב את החיפוש
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        {avgPriceSqm > 0 && (
          <p className="text-xs text-blue-500">
            ממוצע מחושב:{' '}
            <span className="font-semibold">{Math.round(avgPriceSqm).toLocaleString('he-IL')} ₪/מ"ר</span>
          </p>
        )}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-blue-900 whitespace-nowrap">
            השווי הנבחר למ&quot;ר
          </label>
          <input
            type="number"
            min={0}
            disabled={readOnly}
            value={selectedPricePerSqm || ''}
            placeholder={avgPriceSqm > 0 ? String(Math.round(avgPriceSqm)) : '0'}
            onChange={e => onSelectedPriceChange(parseFloat(e.target.value) || 0)}
            className={
              'flex-1 max-w-xs rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-right ' +
              'text-slate-800 font-semibold tabular-nums ' +
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ' +
              'disabled:bg-slate-50 disabled:cursor-not-allowed'
            }
          />
          <span className="text-sm text-blue-700">₪ / מ"ר</span>
        </div>
      </div>
    </div>
  )
}
