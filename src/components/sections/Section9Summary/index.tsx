import { cn, fmt } from '@/lib/utils'
import { Card } from '@/components/shared/Card'

const fmtPct = (n: number) => n.toLocaleString('he-IL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

interface Props {
  existingUnits: number
  newTotalUnits: number
  totalFloorAreaProject: number
  compensationPerUnit: number
  developerUnitsForSale: number
  developerFloorAreaForSale: number
  totalDeveloperRevenue: number    // אלפי ₪
  totalConstructionCosts: number   // אלפי ₪
}

export default function Section9Summary({
  existingUnits,
  newTotalUnits,
  totalFloorAreaProject,
  compensationPerUnit,
  developerUnitsForSale,
  developerFloorAreaForSale,
  totalDeveloperRevenue,
  totalConstructionCosts,
}: Props) {
  const densityFactor     = existingUnits > 0 ? newTotalUnits / existingUnits : null
  const surplus           = totalDeveloperRevenue - totalConstructionCosts
  const profitOnCost      = totalConstructionCosts !== 0 ? (surplus / totalConstructionCosts) * 100 : null
  const profitOnRevenue   = totalDeveloperRevenue  !== 0 ? (surplus / totalDeveloperRevenue)  * 100 : null

  const isPositive = surplus >= 0

  type RowKind = 'display' | 'calc-neutral' | 'calc-signed'

  type Row = {
    label: string
    value: string
    kind: RowKind
    signed?: boolean   // true → colour by isPositive
  }

  const rows: Row[] = [
    {
      label: 'סה"כ דירות קיימות לפינוי בינוי',
      value: `${fmt(existingUnits)} יח"ד`,
      kind:  'display',
    },
    {
      label: 'סה"כ דירות חדשות',
      value: `${fmt(newTotalUnits)} יח"ד`,
      kind:  'display',
    },
    {
      label: 'מקדם ציפוף ביח"ד',
      value: densityFactor != null ? fmtPct(densityFactor) : '—',
      kind:  'calc-neutral',
    },
    {
      label: 'יתרת דירות לשיווק היזם',
      value: `${fmt(developerUnitsForSale)} יח"ד`,
      kind:  'display',
    },
    {
      label: 'סה"כ שטח פלדלת בפרויקט',
      value: `${fmt(totalFloorAreaProject)} מ"ר`,
      kind:  'display',
    },
    {
      label: 'תמורה ליח"ד',
      value: `${fmt(compensationPerUnit)} מ"ר`,
      kind:  'display',
    },
    {
      label: 'סה"כ שטח לשיווק היזם',
      value: `${fmt(developerFloorAreaForSale)} מ"ר`,
      kind:  'display',
    },
    {
      label: 'סה"כ פדיון חזוי ליזם',
      value: `${fmt(totalDeveloperRevenue)} א׳ ₪`,
      kind:  'display',
    },
    {
      label: 'סה"כ עלויות הקמה',
      value: `${fmt(totalConstructionCosts)} א׳ ₪`,
      kind:  'display',
    },
    {
      label: 'עודף חזוי בפרויקט',
      value: `${fmt(surplus)} א׳ ₪`,
      kind:  'calc-signed',
      signed: true,
    },
    {
      label: 'שיעור רווח לעלות',
      value: profitOnCost != null ? `${fmtPct(profitOnCost)}%` : '—',
      kind:  'calc-signed',
      signed: true,
    },
    {
      label: 'שיעור רווח מפדיון',
      value: profitOnRevenue != null ? `${fmtPct(profitOnRevenue)}%` : '—',
      kind:  'calc-signed',
      signed: true,
    },
  ]

  return (
    <Card title="סיכום התחשיב והצגת הרווח היזמי" bodyClassName="p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" dir="rtl">
          <thead>
            <tr className="bg-slate-800 text-white text-xs">
              <th className="px-5 py-3 text-right font-semibold w-2/3">סעיף</th>
              <th className="px-5 py-3 text-right font-semibold">חלופה מוצעת בהתאם לתכנון</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, value, kind, signed }, i) => {
              const isCalc = kind !== 'display'
              const rowPositive = signed ? isPositive : null

              const rowCls = cn(
                'border-b border-slate-100 last:border-0',
                kind === 'display'
                  ? i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  : kind === 'calc-neutral'
                    ? 'bg-yellow-50'
                    : rowPositive
                      ? 'bg-green-50'
                      : 'bg-red-50',
              )

              const labelCls = cn(
                'px-5 py-3',
                isCalc ? 'font-semibold' : 'text-slate-600',
                kind === 'calc-neutral'  && 'text-yellow-900',
                kind === 'calc-signed' && rowPositive === true  && 'text-green-900',
                kind === 'calc-signed' && rowPositive === false && 'text-red-900',
              )

              const valueCls = cn(
                'px-5 py-3 text-right tabular-nums',
                isCalc ? 'font-bold' : 'font-semibold text-slate-700',
                kind === 'calc-neutral'  && 'text-yellow-800',
                kind === 'calc-signed' && rowPositive === true  && 'text-green-700',
                kind === 'calc-signed' && rowPositive === false && 'text-red-700',
              )

              return (
                <tr key={label} className={rowCls}>
                  <td className={labelCls}>{label}</td>
                  <td className={valueCls}>{value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
