import { cn, fmt } from '@/lib/utils'
import { Card } from '@/components/shared/Card'
import { inputClass } from '@/components/shared/formStyles'
import type { Section7Data } from '@/types'

interface Props {
  data: Section7Data
  onChange: (data: Section7Data) => void
  developerUnits: number
  developerFloorplateSqm: number
  developerCommercialSqm: number
  residentialPricePerSqm: number
  commercialPricePerSqm: number
  readOnly?: boolean
}

export default function Section7InventoryValue({
  data,
  onChange,
  developerUnits,
  developerFloorplateSqm,
  developerCommercialSqm,
  residentialPricePerSqm,
  commercialPricePerSqm,
  readOnly = false,
}: Props) {
  const { vatPct } = data

  const safeUnits = developerUnits > 0 ? developerUnits : 1

  // Row 1 / 2 — residential (with VAT)
  const avgFloorplate    = Math.round(developerFloorplateSqm / safeUnits)
  const resTotal         = Math.round(developerFloorplateSqm * residentialPricePerSqm / 1000)
  const resPricePerUnit  = Math.round(developerFloorplateSqm * residentialPricePerSqm / safeUnits)

  // Row 3 — residential without VAT
  const vatFactor        = 1 + vatPct / 100
  const resTotalNoVat    = Math.round(resTotal / vatFactor)
  const resPPUNoVat      = Math.round(resPricePerUnit / vatFactor)

  // Row 4 — commercial (no VAT)
  const commTotal        = Math.round(developerCommercialSqm * commercialPricePerSqm / 1000)

  // Row 5 — grand total
  const grandTotal       = resTotalNoVat + commTotal

  type Row = {
    label: string
    units: number | null
    avgSqm: number | null
    totalSqm: number | null
    pricePerSqm: number | null
    inventoryTotal: number | null
    pricePerUnit: number | null
    bold?: boolean
    highlight?: boolean
  }

  const rows: Row[] = [
    {
      label:          'דירה ממוצעת לשיווק היזם',
      units:          developerUnits,
      avgSqm:         avgFloorplate,
      totalSqm:       developerFloorplateSqm,
      pricePerSqm:    residentialPricePerSqm,
      inventoryTotal: resTotal,
      pricePerUnit:   resPricePerUnit,
    },
    {
      label:          'סה"כ דירות יזם לשיווק — כולל מע"מ',
      units:          developerUnits,
      avgSqm:         avgFloorplate,
      totalSqm:       developerFloorplateSqm,
      pricePerSqm:    residentialPricePerSqm,
      inventoryTotal: resTotal,
      pricePerUnit:   resPricePerUnit,
      bold:           true,
    },
    {
      label:          'סה"כ ללא מע"מ',
      units:          developerUnits,
      avgSqm:         avgFloorplate,
      totalSqm:       developerFloorplateSqm,
      pricePerSqm:    residentialPricePerSqm,
      inventoryTotal: resTotalNoVat,
      pricePerUnit:   resPPUNoVat,
    },
    {
      label:          'מסחר לשיווק',
      units:          null,
      avgSqm:         null,
      totalSqm:       developerCommercialSqm,
      pricePerSqm:    commercialPricePerSqm,
      inventoryTotal: commTotal,
      pricePerUnit:   null,
    },
    {
      label:          'סה"כ מגורים + מסחר — לא כולל מע"מ',
      units:          null,
      avgSqm:         null,
      totalSqm:       null,
      pricePerSqm:    null,
      inventoryTotal: grandTotal,
      pricePerUnit:   null,
      bold:           true,
      highlight:      true,
    },
  ]

  const colHeader = 'px-3 py-2.5 text-right font-medium whitespace-nowrap'

  return (
    <div className="space-y-5">
      <Card title="מלאי הדירות — שווי כולל">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-700 text-white text-xs">
                <th className={cn(colHeader, 'min-w-48')}>טיפוס</th>
                <th className={cn(colHeader, 'w-24')}>מספר יח"ד</th>
                <th className={cn(colHeader, 'w-36')}>שטח פלדלת ממוצע ליח"ד (מ"ר)</th>
                <th className={cn(colHeader, 'w-32')}>סך שטח פלדלת (מ"ר)</th>
                <th className={cn(colHeader, 'w-32')}>שווי מ"ר ממוצע (₪)</th>
                <th className={cn(colHeader, 'w-36 bg-slate-600')}>סך שווי מלאי (א׳ ₪)</th>
                <th className={cn(colHeader, 'w-36')}>מחיר ליח"ד ממוצעת (₪)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-slate-100 last:border-0',
                    row.highlight
                      ? 'bg-amber-50'
                      : i % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50/40',
                  )}
                >
                  <td
                    className={cn(
                      'px-3 py-2.5 text-slate-700',
                      row.bold && 'font-bold',
                      row.highlight && 'text-amber-900',
                    )}
                  >
                    {row.label}
                  </td>

                  {(['units', 'avgSqm', 'totalSqm', 'pricePerSqm'] as const).map(key => (
                    <td
                      key={key}
                      className={cn(
                        'px-3 py-2.5 text-right tabular-nums text-slate-600',
                        row.bold && 'font-bold',
                      )}
                    >
                      {row[key] != null ? fmt(row[key]) : '—'}
                    </td>
                  ))}

                  <td
                    className={cn(
                      'px-3 py-2.5 text-right tabular-nums bg-slate-100/50',
                      row.bold ? 'font-bold text-slate-800' : 'font-medium text-slate-700',
                      row.highlight && 'bg-amber-100/60 text-amber-900',
                    )}
                  >
                    {row.inventoryTotal != null ? fmt(row.inventoryTotal) : '—'}
                  </td>

                  <td
                    className={cn(
                      'px-3 py-2.5 text-right tabular-nums text-slate-600',
                      row.bold && 'font-bold',
                    )}
                  >
                    {row.pricePerUnit != null ? fmt(row.pricePerUnit) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 whitespace-nowrap">מע"מ:</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={vatPct}
                onChange={e => !readOnly && onChange({ ...data, vatPct: Number(e.target.value) })}
                disabled={readOnly}
                className={cn(inputClass, 'w-20')}
              />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            מע"מ מנוכה ממגורים בלבד (שוק מגורים). מסחר ומשרדים — ללא ניכוי מע"מ.
          </p>
        </div>
      </Card>
    </div>
  )
}
