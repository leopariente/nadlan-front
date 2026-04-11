import { fmt } from '@/lib/utils'
import { inputCls } from './tableUtils'
import { Card } from '@/components/shared/Card'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
  newResidentialUnits: number
  newPrimaryResidentialArea: number
  newPrimaryCommercialArea: number
}

export function Table2NewState({
  data,
  onChange,
  newResidentialUnits,
  newPrimaryResidentialArea,
  newPrimaryCommercialArea,
}: Props) {
  const residentialTotal = newPrimaryResidentialArea * data.builtValuePerSqmResidential
  const commercialTotal = newPrimaryCommercialArea * data.builtValuePerSqmCommercial
  const employmentTotal = data.newPrimaryEmploymentArea * data.builtValuePerSqmEmployment
  const grandTotal = residentialTotal + commercialTotal + employmentTotal

  return (
    <Card title="טבלה 2 — מצב חדש" bodyClassName="p-0">
      {/* Section A */}
      <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold">א. מגורים</div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">מס׳ יח&quot;ד חדשות</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(newResidentialUnits)}{' '}
            <span className="text-xs font-normal text-slate-400">יח&quot;ד</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">שטח עיקרי</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(newPrimaryResidentialArea)}{' '}
            <span className="text-xs font-normal text-slate-400">מ&quot;ר</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">שווי למ&quot;ר מבונה מגורים</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.builtValuePerSqmResidential || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, builtValuePerSqmResidential: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">&#x20AA;/מ&quot;ר</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך שווי מ&quot;ר מבונה מגורים</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">&#x20AA;{fmt(residentialTotal)}</span>
        </div>
      </div>

      {/* Section B */}
      <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold border-t-2 border-emerald-900">
        ב. מסחר
      </div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50">
          <span className="text-xs text-slate-500">מ&quot;ר עיקרי חדש מסחר</span>
          <span className="text-sm font-semibold text-slate-700 tabular-nums">
            {fmt(newPrimaryCommercialArea)}{' '}
            <span className="text-xs font-normal text-slate-400">מ&quot;ר</span>
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">שווי ממוצע מ&quot;ר מבונה מסחר</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.builtValuePerSqmCommercial || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, builtValuePerSqmCommercial: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">&#x20AA;/מ&quot;ר</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך שווי מ&quot;ר מבונה מסחר</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">&#x20AA;{fmt(commercialTotal)}</span>
        </div>
      </div>

      {/* Section C */}
      <div className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold border-t-2 border-emerald-900">
        ג. תעסוקה
      </div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">מ&quot;ר עיקרי חדש תעסוקה</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.newPrimaryEmploymentArea || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, newPrimaryEmploymentArea: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400">מ&quot;ר</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">שווי ממוצע מ&quot;ר מבונה תעסוקה</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.builtValuePerSqmEmployment || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, builtValuePerSqmEmployment: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400 whitespace-nowrap">&#x20AA;/מ&quot;ר</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך שווי מ&quot;ר מבונה תעסוקה</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">&#x20AA;{fmt(employmentTotal)}</span>
        </div>
      </div>

      {/* Grand total */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-700 text-white">
        <span className="text-sm font-bold">סה&quot;כ שווי במצב חדש</span>
        <span className="text-base font-bold tabular-nums">&#x20AA;{fmt(grandTotal)}</span>
      </div>

      {/* Note */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-400 leading-relaxed">
          שווי מ&quot;ר מבונה מבטא את שווי מ&quot;ר זכויות בקרקע ולא את הבנוי.
          נשמש בשווי מ&quot;ר מבונה אך ורק לתחשיב היטל ההשבחה.
        </p>
      </div>
    </Card>
  )
}
