import { cn } from '@/lib/utils'
import { Card } from '@/components/shared/Card'
import { Field } from '@/components/shared/Field'
import { inputClass } from '@/components/shared/formStyles'
import type { Section5Data } from '@/types'

const RATE_FIELDS: { key: keyof Section5Data['rates']; label: string; unit: string; step: string }[] = [
  { key: 'constructionPermit', label: 'אגרות בנייה',          unit: '₪/מ"ר', step: '0.01' },
  { key: 'roadLand',           label: 'היטל כביש — קרקע',     unit: '₪/מ"ר', step: '0.01' },
  { key: 'roadBuilding',       label: 'היטל כביש — בנייה',    unit: '₪/מ"ר', step: '0.01' },
  { key: 'sidewalkLand',       label: 'היטל מדרכה — קרקע',    unit: '₪/מ"ר', step: '0.01' },
  { key: 'sidewalkBuilding',   label: 'היטל מדרכה — בנייה',   unit: '₪/מ"ר', step: '0.01' },
  { key: 'drainageLand',       label: 'היטל תיעול — קרקע',    unit: '₪/מ"ר', step: '0.01' },
  { key: 'drainageBuilding',   label: 'היטל תיעול — בנייה',   unit: '₪/מ"ר', step: '0.01' },
  { key: 'waterAuthority',     label: 'דמי הקמה תאגיד המים',  unit: '₪/מ"ר', step: '0.01' },
  { key: 'safetyBuffer',       label: 'מקדם בטחון',           unit: '%',      step: '0.1'  },
]

interface Props {
  data: Section5Data
  onChange: (data: Section5Data) => void
  readOnly: boolean
}

export function RatesTab({ data, onChange, readOnly }: Props) {
  function setRate(key: keyof Section5Data['rates'], value: number) {
    onChange({ ...data, rates: { ...data.rates, [key]: value } })
  }

  return (
    <div className="space-y-5">
      <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => !readOnly && onChange({ ...data, useFlatRate: false })}
          className={cn(
            'flex-1 py-3 text-sm font-medium text-center transition-colors border-e border-slate-200',
            !data.useFlatRate ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50',
          )}
        >
          תעריפים מפורטים לפי עירייה
        </button>
        <button
          onClick={() => !readOnly && onChange({ ...data, useFlatRate: true })}
          className={cn(
            'flex-1 py-3 text-sm font-medium text-center transition-colors',
            data.useFlatRate ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50',
          )}
        >
          תעריף אחיד — 500 ₪/מ&quot;ר עילי
        </button>
      </div>

      {data.useFlatRate ? (
        <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 px-5 py-4 text-sm text-blue-700">
          <span className="text-2xl">📌</span>
          <span>
            החישוב יתבצע לפי <strong>500 ₪ למ&quot;ר עילי</strong> (מגורים + מסחר).
            כל שדות התעריף המפורט מוסתרים.
          </span>
        </div>
      ) : (
        <Card title="תעריפים לפי עירייה">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {RATE_FIELDS.map(({ key, label, unit, step }) => (
              <Field key={key} label={label} unit={unit}>
                <input
                  type="number"
                  min={0}
                  step={step}
                  className={inputClass}
                  value={data.rates[key] || ''}
                  disabled={readOnly}
                  placeholder="0"
                  onChange={e => setRate(key, parseFloat(e.target.value) || 0)}
                />
              </Field>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
