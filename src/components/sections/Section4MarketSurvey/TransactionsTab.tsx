import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'
import { StatCard } from './StatCard'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TablePagination } from '@/components/shared/TablePagination'

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
    floor: null, rooms: 0, netAreaSqm: 0, reportedPriceILS: 0,
  }
}

interface Props {
  transactions: Transaction[]
  selectedPricePerSqm: number
  onTransactionsChange: (rows: Transaction[]) => void
  onSelectedPriceChange: (v: number) => void
  onGenerate: () => void
  generating: boolean
  readOnly: boolean
}

export function TransactionsTab({
  transactions,
  selectedPricePerSqm,
  onTransactionsChange,
  onSelectedPriceChange,
  onGenerate,
  generating,
  readOnly,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  function updateRow(id: string, patch: Partial<Transaction>) {
    onTransactionsChange(transactions.map(t => (t.id === id ? { ...t, ...patch } : t)))
  }

  function handleGenerateClick() {
    if (transactions.length === 0) {
      onGenerate()
    } else {
      setConfirmOpen(true)
    }
  }

  function addRow() {
    onTransactionsChange([...transactions, emptyTransaction()])
    setPage(Math.ceil((transactions.length + 1) / PAGE_SIZE))
  }

  function deleteRow(id: string) {
    const next = transactions.filter(t => t.id !== id)
    onTransactionsChange(next)
    const maxPage = Math.max(1, Math.ceil(next.length / PAGE_SIZE))
    if (page > maxPage) setPage(maxPage)
  }

  const totalPages  = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const pageRows    = transactions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const valid       = transactions.filter(t => t.netAreaSqm > 0 && t.reportedPriceILS > 0)
  const count       = transactions.length
  const avgArea     = avg(valid.map(t => t.netAreaSqm))
  const avgPrice    = avg(valid.map(t => t.reportedPriceILS))
  const totalArea   = valid.reduce((s, t) => s + t.netAreaSqm, 0)
  const totalPrice  = valid.reduce((s, t) => s + t.reportedPriceILS, 0)
  const avgPriceSqm = totalArea > 0 ? totalPrice / totalArea : 0

  const numInput = (t: Transaction, field: 'rooms' | 'netAreaSqm' | 'reportedPriceILS') => (
    <input
      type="number"
      min={0}
      className="cell-input"
      value={t[field] || ''}
      disabled={readOnly}
      placeholder="0"
      onChange={e => updateRow(t.id, { [field]: parseFloat(e.target.value) || 0 })}
    />
  )

  const textInput = (t: Transaction, field: 'saleDate' | 'address' | 'gushHelka' | 'floor', placeholder = '') => (
    <input
      type="text"
      className="cell-input"
      value={t[field] ?? ''}
      disabled={readOnly}
      placeholder={placeholder}
      onChange={e => updateRow(t.id, { [field]: e.target.value })}
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
                {!readOnly && <th className="w-8" />}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((t, i) => {
                const pps = pricePerSqm(t)
                return (
                  <tr
                    key={t.id}
                    className={cn(
                      'border-b border-slate-100 last:border-0',
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40',
                    )}
                  >
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t, 'saleDate', 'DD/MM/YYYY')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t, 'address')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t, 'gushHelka')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{textInput(t, 'floor')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t, 'rooms')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t, 'netAreaSqm')}</td>
                    <td className="px-0 py-0 border-e border-slate-100">{numInput(t, 'reportedPriceILS')}</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-700 bg-slate-100/70 border-e border-slate-100 tabular-nums whitespace-nowrap">
                      {pps > 0 ? pps.toLocaleString('he-IL') : '—'}
                    </td>
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
                    colSpan={readOnly ? 8 : 9}
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
          <div className="px-4 py-2.5 border-t border-slate-200 bg-white flex items-center justify-between">
            <button
              type="button"
              onClick={addRow}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
            >
              <span className="text-base leading-none">+</span> הוסף עסקה
            </button>
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={generating}
              className="text-sm text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <span className="inline-block w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  מייצר סקר שוק...
                </>
              ) : (
                <>
                  <span className="text-base leading-none">✦</span> ייצר סקר שוק
                </>
              )}
            </button>
          </div>
        )}

        <TablePagination
          page={safePage}
          totalPages={totalPages}
          totalItems={count}
          pageSize={PAGE_SIZE}
          onChange={setPage}
        />
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="איפוס סקר שוק"
        description="קיימות עסקאות — יצירת סקר שוק חדש תמחק את כל הנתונים הקיימים. האם להמשיך?"
        onConfirm={onGenerate}
      />
    </div>
  )
}
