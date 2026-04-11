import { fmt } from '@/lib/utils'
import { inputCls } from './tableUtils'
import { Card } from '@/components/shared/Card'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
}

export function Table3Obligations({ data, onChange }: Props) {
  const total =
    data.publicSpaceDevelopment + data.kindergartenConstruction + data.demolitionAndDeveloper

  return (
    <Card title='טבלה 3 — הפחתת מטלות ועלויות הריסה' bodyClassName="p-0">
      <div className="px-4 py-2 bg-orange-700 text-white text-xs font-semibold">מטלות ועלויות</div>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">פיתוח שטחי שצ&quot;פ</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.publicSpaceDevelopment || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, publicSpaceDevelopment: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400">&#x20AA;</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">הקמת גני ילדים</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.kindergartenConstruction || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, kindergartenConstruction: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400">&#x20AA;</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 bg-white">
          <span className="text-xs text-slate-500">הריסת מבנים קיימים + מטלת יזם</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={0}
              value={data.demolitionAndDeveloper || ''}
              placeholder="0"
              onChange={e =>
                onChange({ ...data, demolitionAndDeveloper: parseFloat(e.target.value) || 0 })
              }
              className={inputCls}
            />
            <span className="text-xs text-slate-400">&#x20AA;</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
          <span className="text-xs font-semibold text-amber-900">סך עלויות מטלה</span>
          <span className="text-sm font-bold text-amber-800 tabular-nums">&#x20AA;{fmt(total)}</span>
        </div>
      </div>
    </Card>
  )
}
