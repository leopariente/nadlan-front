import { fmt } from '@/lib/utils'
import { inputClsSm as inputCls } from './tableUtils'
import { Card } from '@/components/shared/Card'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
  newStateTotal: number
  obligationsTotal: number
}

export function Table4Summary({ data, onChange, newStateTotal, obligationsTotal }: Props) {
  const grossNewState = newStateTotal - obligationsTotal
  const deferralFactor = 1 / Math.pow(1 + data.deferralRate / 100, data.deferralYears)
  const deferredGross = grossNewState * deferralFactor
  const finalNewStateValue = deferredGross * (data.siteReductionFactor / 100)

  return (
    <Card title="טבלה 4 — סיכום מצב חדש" bodyClassName="p-0">
      <div className="px-4 py-2 bg-violet-700 text-white text-xs font-semibold">חישוב שווי מצב חדש</div>
      <div className="divide-y divide-slate-100">
        {/* Inputs from Tables 2 & 3 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">שווי מצב חדש</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(newStateTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">הפחתת עלות המטלות</span>
          <span className="text-sm font-semibold text-red-600 tabular-nums">
            &minus;&#x20AA;{fmt(obligationsTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך שווי מצב חדש גולמי</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">&#x20AA;{fmt(grossNewState)}</span>
        </div>

        {/* Deferral parameters */}
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">מס׳ שנים לדחייה</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.deferralYears || ''}
              placeholder="3"
              onChange={e => onChange({ ...data, deferralYears: parseFloat(e.target.value) || 0 })}
              className={inputCls}
            />
            <span className="text-xs text-slate-400">שנים</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">שיעור היוון</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={100}
              value={data.deferralRate || ''}
              placeholder="6"
              onChange={e => onChange({ ...data, deferralRate: parseFloat(e.target.value) || 0 })}
              className={inputCls}
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">דחייה עד למימוש</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(deferredGross)}{' '}
            <span className="text-xs font-normal text-slate-400">
              ({(deferralFactor * 100).toFixed(2)}%)
            </span>
          </span>
        </div>

        {/* Site reduction */}
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">הפחתה לגודל המתחם</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              max={100}
              value={data.siteReductionFactor || ''}
              placeholder="100"
              onChange={e =>
                onChange({ ...data, siteReductionFactor: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>

        {/* Key result */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-700 text-white">
          <span className="text-sm font-bold">סך שווי מצב חדש</span>
          <span className="text-base font-bold tabular-nums">&#x20AA;{fmt(finalNewStateValue)}</span>
        </div>
      </div>
    </Card>
  )
}
