import { Card } from '@/components/shared/Card'

interface Props {
  commercialPctOfResidential: number
  newApartmentsSelectedPrice: number
  onChange: (pct: number) => void
  readOnly: boolean
}

export function CommercialTab({
  commercialPctOfResidential,
  newApartmentsSelectedPrice,
  onChange,
  readOnly,
}: Props) {
  const commercialPricePerSqm = Math.round(
    (newApartmentsSelectedPrice * commercialPctOfResidential) / 100,
  )

  return (
    <Card title="שווי מסחרי" bodyClassName="p-5 space-y-3">
      <div className="flex items-center justify-between rounded-lg bg-slate-100/70 border border-slate-200 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="bg-slate-300 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-semibold leading-none">
            מסעיף 4
          </span>
          ממוצע מחיר למ&quot;ר מגורים חדשים (השווי הנבחר)
        </span>
        <span className="text-sm font-semibold text-slate-600 tabular-nums">
          {newApartmentsSelectedPrice > 0
            ? `${newApartmentsSelectedPrice.toLocaleString('he-IL')} ₪`
            : '—'}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white border border-slate-200 px-4 py-2">
        <span className="text-xs font-medium text-slate-500">% משווי מגורים</span>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={0}
            max={200}
            disabled={readOnly}
            value={commercialPctOfResidential || ''}
            placeholder="85"
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            className={
              'w-20 rounded border border-slate-200 px-2 py-1 text-sm text-right text-slate-800 tabular-nums ' +
              'focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
              'disabled:bg-slate-50 disabled:cursor-not-allowed'
            }
          />
          <span className="text-xs text-slate-400 w-4">%</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
        <span className="text-xs font-semibold text-amber-900">שווי מ&quot;ר מסחרי</span>
        <span className="text-sm font-bold text-amber-800 tabular-nums">
          {newApartmentsSelectedPrice > 0
            ? `${commercialPricePerSqm.toLocaleString('he-IL')} ₪`
            : '—'}
        </span>
      </div>
    </Card>
  )
}
