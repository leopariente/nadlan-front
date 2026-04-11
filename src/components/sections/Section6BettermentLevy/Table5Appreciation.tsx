import { fmt } from '@/lib/utils'
import { inputClsSm as inputCls } from './tableUtils'
import { Card } from '@/components/shared/Card'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
  finalNewStateValue: number
  totalExistingValue: number
  deferralFactor: number
}

export function Table5Appreciation({
  data,
  onChange,
  finalNewStateValue,
  totalExistingValue,
  deferralFactor,
}: Props) {
  const appreciation = finalNewStateValue - totalExistingValue
  const appreciationWithDeferral = appreciation * deferralFactor
  const estimatedLevy = appreciationWithDeferral * (data.levyRate / 100)

  return (
    <Card title="טבלה 5 — השבחה" bodyClassName="p-0">
      <div className="px-4 py-2 bg-rose-700 text-white text-xs font-semibold">תחשיב היטל השבחה</div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">סך שווי מצב חדש</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(finalNewStateValue)}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">סך שווי מצב קיים</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(totalExistingValue)}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך השבחה</span>
          <span
            className={
              'text-sm font-bold tabular-nums ' +
              (appreciation < 0 ? 'text-red-600' : 'text-amber-800')
            }
          >
            {appreciation < 0 ? <>&minus;</> : null}&#x20AA;{fmt(Math.abs(appreciation))}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">סך השבחה &times; מקדם דחייה</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(appreciationWithDeferral)}
          </span>
        </div>

        {/* Levy rate input */}
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">שיעור היטל השבחה</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={100}
              value={data.levyRate || ''}
              placeholder="50"
              onChange={e => onChange({ ...data, levyRate: parseFloat(e.target.value) || 0 })}
              className={inputCls}
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>

        {/* Key result */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-700 text-white">
          <span className="text-sm font-bold">אומדן היטל השבחה צפוי</span>
          <span className="text-base font-bold tabular-nums">&#x20AA;{fmt(estimatedLevy)}</span>
        </div>
      </div>
    </Card>
  )
}
