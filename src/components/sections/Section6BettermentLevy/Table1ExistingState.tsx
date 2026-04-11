import { fmt } from '@/lib/utils'
import { inputCls } from './tableUtils'
import { Card } from '@/components/shared/Card'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
  existingUnits: number
  existingResidentialArea: number
  existingCommercialArea: number
  yad2PricePerSqm: number
}

export function Table1ExistingState({
  data,
  onChange,
  existingUnits,
  existingResidentialArea,
  existingCommercialArea,
  yad2PricePerSqm,
}: Props) {
  const safeUnits = existingUnits > 0 ? existingUnits : 1
  const avgUnitArea = existingResidentialArea / safeUnits
  const avgUnitValue = avgUnitArea * yad2PricePerSqm
  const existingResidentialTotal = existingResidentialArea * yad2PricePerSqm
  const existingCommercialTotal = existingCommercialArea * data.existingCommercialValuePerSqm

  return (
    <Card title="טבלה 1 — מצב קיים" bodyClassName="p-0">
      <div className="px-4 py-2 bg-indigo-700 text-white text-xs font-semibold">א. מגורים</div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">מספר יח&quot;ד בנייה רוויה</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(existingUnits)}{' '}
            <span className="text-xs font-normal text-slate-400">יח&quot;ד</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">סך מ&quot;ר דירתי</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(existingResidentialArea)}{' '}
            <span className="text-xs font-normal text-slate-400">מ&quot;ר</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">שטח דירה ממוצעת</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(avgUnitArea)}{' '}
            <span className="text-xs font-normal text-slate-400">מ&quot;ר</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">שווי למ&quot;ר בנוי בדירות יד 2</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(yad2PricePerSqm)}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">שווי יח&quot;ד ממוצעת</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            &#x20AA;{fmt(avgUnitValue)}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך שווי מצב קיים מגורים</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">
            &#x20AA;{fmt(existingResidentialTotal)}
          </span>
        </div>
      </div>

      <div className="px-4 py-2 bg-indigo-700 text-white text-xs font-semibold border-t-2 border-indigo-900">
        ב. מסחר
      </div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">שטחים מסחריים</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(existingCommercialArea)}{' '}
            <span className="text-xs font-normal text-slate-400">מ&quot;ר</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">שווי מ&quot;ר מסחר בנוי</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.existingCommercialValuePerSqm || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, existingCommercialValuePerSqm: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">&#x20AA;/מ&quot;ר</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך שווי מצב קיים מסחרי</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">
            &#x20AA;{fmt(existingCommercialTotal)}
          </span>
        </div>
      </div>
    </Card>
  )
}
