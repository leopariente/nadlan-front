import { Card } from '@/components/shared/Card'
import { ComputedRow } from '@/components/shared/RowVariants'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface Props {
  pricePerSqm: number
  constructionCostAbove: number
  constructionCostBelow: number
  totalMainArea: number
  totalUnits: number
  totalUndergroundArea: number
}

type UnitType = 'קטנה' | 'סטנדרט' | 'גדולה'

interface GroupRow {
  type: UnitType
  count: number
  mainArea: number
  totalValue: number
}

const MAMAD_AREA      = 12
const BALCONY_AREA    = 12
const PARKING_SQM     = 35
const UNITS_PER_FLOOR = 8

export default function Section3Mix({ pricePerSqm, constructionCostAbove, constructionCostBelow, totalMainArea, totalUnits, totalUndergroundArea }: Props) {
  // ── Unit mix (20/60/20) ───────────────────────────────────────────────────
  const smallUnits = Math.round(totalUnits * 0.20)
  const stdUnits   = Math.round(totalUnits * 0.60)
  const largeUnits = totalUnits - smallUnits - stdUnits

  // ── Area per unit type with correction factor ─────────────────────────────
  const canCompute = totalUnits > 0 && totalMainArea > 0
  const avgArea  = canCompute ? totalMainArea / totalUnits : 0
  const rawSmall = avgArea * 0.80
  const rawStd   = avgArea * 1.00
  const rawLarge = avgArea * 1.25
  const rawSum   = smallUnits * rawSmall + stdUnits * rawStd + largeUnits * rawLarge
  const factor   = rawSum > 0 ? totalMainArea / rawSum : 1
  const smallArea = rawSmall * factor
  const stdArea   = rawStd   * factor
  const largeArea = rawLarge * factor

  // ── Parking feasibility ───────────────────────────────────────────────────
  const requiredParkingArea = totalUnits * PARKING_SQM
  const parkingFeasible     = totalUndergroundArea <= 0 || requiredParkingArea <= totalUndergroundArea

  // ── Build grouped rows ────────────────────────────────────────────────────
  const groups: GroupRow[] = []

  if (canCompute && pricePerSqm > 0) {
    const priceByType: Record<UnitType, number> = {
      'קטנה':   pricePerSqm * 1.10,
      'סטנדרט': pricePerSqm * 1.00,
      'גדולה':  pricePerSqm * 0.95,
    }
    const priceBalcony = pricePerSqm * 0.50

    const defs: Array<{ type: UnitType; count: number; mainArea: number }> = [
      { type: 'קטנה',   count: smallUnits, mainArea: smallArea },
      { type: 'סטנדרט', count: stdUnits,   mainArea: stdArea   },
      { type: 'גדולה',  count: largeUnits, mainArea: largeArea },
    ]

    let idx = 0
    for (const def of defs) {
      let totalValue = 0
      for (let i = 0; i < def.count; i++) {
        const floor      = Math.floor(idx / UNITS_PER_FLOOR) + 1
        const floorBonus = floor >= 2 ? (floor - 1) * 0.01 : 0
        const effPrice   = priceByType[def.type] * (1 + floorBonus)
        totalValue += def.mainArea * effPrice + BALCONY_AREA * priceBalcony
        idx++
      }
      if (def.count > 0) {
        groups.push({ type: def.type, count: def.count, mainArea: def.mainArea, totalValue })
      }
    }
  }

  const showTable = canCompute && pricePerSqm > 0

  const thCls = 'px-3 py-2 font-medium text-slate-600 whitespace-nowrap'
  const tdCls = 'px-3 py-2'

  return (
    <div className="space-y-5">
      {/* Parking warning */}
      {!parkingFeasible && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          ⚠️ שטח החניון הנדרש ({formatNumber(requiredParkingArea, 0)} מ"ר) עולה על שטח השירות התת-קרקעי המותר ({formatNumber(totalUndergroundArea, 0)} מ"ר)
        </div>
      )}

      {/* Base parameters (read-only, sourced from other sections) */}
      <Card title="פרמטרים">
        <div className="p-5 space-y-1.5">
          <ComputedRow label='מחיר בסיס למ"ר — מסקר שוק (סעיף 4)'               value={pricePerSqm}          unit='₪/מ"ר' />
          <ComputedRow label='עלות בנייה מעל קרקע למ"ר — ניתוח כלכלי (סעיף 8)' value={constructionCostAbove} unit='₪/מ"ר' />
          <ComputedRow label='עלות בנייה תת-קרקע למ"ר — ניתוח כלכלי (סעיף 8)'  value={constructionCostBelow} unit='₪/מ"ר' />
        </div>
      </Card>

      {/* Unit mix grouped by type */}
      {showTable && (
        <Card title="תמהיל יחידות">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className={thCls}>סוג</th>
                  <th className={thCls}>מס׳ יח"ד</th>
                  <th className={thCls}>שטח עיקרי למ"ר</th>
                  <th className={thCls}>שטח שירות (מ"ר)</th>
                  <th className={thCls}>מרפסת (מ"ר)</th>
                  <th className={thCls}>שווי כולל ללא מע"מ (₪)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groups.map(g => (
                  <tr key={g.type} className="hover:bg-slate-50">
                    <td className={tdCls}>{g.type}</td>
                    <td className={tdCls}>{g.count}</td>
                    <td className={tdCls}>{formatNumber(g.mainArea, 1)}</td>
                    <td className={tdCls}>{MAMAD_AREA}</td>
                    <td className={tdCls}>{BALCONY_AREA}</td>
                    <td className={tdCls}>{formatCurrency(g.totalValue)}</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-slate-100 border-t-2 border-slate-300">
                  <td className={tdCls}>סה"כ</td>
                  <td className={tdCls}>{totalUnits}</td>
                  <td className={tdCls}>{formatNumber(totalMainArea, 1)}</td>
                  <td className={tdCls}>{formatNumber(totalUnits * MAMAD_AREA, 0)}</td>
                  <td className={tdCls}>{formatNumber(totalUnits * BALCONY_AREA, 0)}</td>
                  <td className={tdCls}>{formatCurrency(groups.reduce((s, g) => s + g.totalValue, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
