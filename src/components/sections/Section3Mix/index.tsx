import { useEffect, useRef } from 'react'
import type { Section3Data, UnitType } from '@/types'
import { Card } from '@/components/shared/Card'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface Props {
  data: Section3Data
  onChange: (data: Section3Data) => void
  pricePerSqm: number
  constructionCostAbove: number
  constructionCostBelow: number
  totalMainArea: number
  totalUnits: number
  totalUndergroundArea: number
  onPricePerSqmChange: (v: number) => void
  onConstructionCostAboveChange: (v: number) => void
  onConstructionCostBelowChange: (v: number) => void
}

const MAMAD_AREA      = 12
const BALCONY_AREA    = 12
const PARKING_SQM     = 35
const UNITS_PER_FLOOR = 8

export function buildDefaultSection3Units(totalUnits: number, totalMainArea: number): UnitType[] {
  const defSmall = Math.round(totalUnits * 0.20)
  const defStd   = Math.round(totalUnits * 0.60)
  const defLarge = totalUnits - defSmall - defStd
  const avgArea  = totalMainArea / totalUnits
  const rawSum   = defSmall * (avgArea * 0.80) + defStd * avgArea + defLarge * (avgArea * 1.25)
  const f        = rawSum > 0 ? totalMainArea / rawSum : 1
  return [
    { id: crypto.randomUUID(), type: 'קטנה',   count: defSmall, mainArea: Math.round(avgArea * 0.80 * f * 10) / 10, priceMultiplier: 1.10 },
    { id: crypto.randomUUID(), type: 'סטנדרט', count: defStd,   mainArea: Math.round(avgArea * f * 10)        / 10, priceMultiplier: 1.00 },
    { id: crypto.randomUUID(), type: 'גדולה',  count: defLarge, mainArea: Math.round(avgArea * 1.25 * f * 10) / 10, priceMultiplier: 0.95 },
  ]
}

export function computeSection3Revenue(data: Section3Data, pricePerSqm: number): number {
  const priceBalcony = pricePerSqm * 0.50
  let floorIdx = 0
  let total = 0
  for (const unit of data.units) {
    const typePrice = pricePerSqm * unit.priceMultiplier
    for (let i = 0; i < unit.count; i++) {
      if (pricePerSqm > 0) {
        const floor = Math.floor(floorIdx / UNITS_PER_FLOOR) + 1
        total += unit.mainArea * typePrice * (1 + (floor >= 2 ? (floor - 1) * 0.01 : 0)) + BALCONY_AREA * priceBalcony
      }
      floorIdx++
    }
  }
  return total
}

const cellInput = 'w-16 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400'
const paramInput = 'w-24 rounded border border-slate-200 bg-white px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400'
const rowCls = 'flex items-center justify-between rounded-lg bg-white border border-slate-200 px-4 py-2'

export default function Section3Mix({
  data, onChange,
  pricePerSqm, constructionCostAbove, constructionCostBelow,
  totalMainArea, totalUnits, totalUndergroundArea,
  onPricePerSqmChange, onConstructionCostAboveChange, onConstructionCostBelowChange,
}: Props) {
  const canCompute = totalUnits > 0 && totalMainArea > 0
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || data.units.length > 0 || !canCompute) return
    initialized.current = true
    onChange({ units: buildDefaultSection3Units(totalUnits, totalMainArea) })
  }, [canCompute, data.units.length, onChange, totalMainArea, totalUnits])

  const totalAllUnits    = data.units.reduce((s, u) => s + u.count, 0)
  const totalMainAreaAll = data.units.reduce((s, u) => s + u.count * u.mainArea, 0)
  const requiredParkingArea = totalAllUnits * PARKING_SQM
  const parkingFeasible = totalUndergroundArea <= 0 || requiredParkingArea <= totalUndergroundArea

  // per-unit total values (floor-based)
  let floorIdx = 0
  const unitValues = data.units.map(unit => {
    const typePrice   = pricePerSqm * unit.priceMultiplier
    const priceBalcony = pricePerSqm * 0.50
    let v = 0
    for (let i = 0; i < unit.count; i++) {
      if (pricePerSqm > 0) {
        const floor = Math.floor(floorIdx / UNITS_PER_FLOOR) + 1
        v += unit.mainArea * typePrice * (1 + (floor >= 2 ? (floor - 1) * 0.01 : 0)) + BALCONY_AREA * priceBalcony
      }
      floorIdx++
    }
    return v
  })
  const totalValue = unitValues.reduce((s, v) => s + v, 0)

  const update = (id: string, patch: Partial<Omit<UnitType, 'id'>>) =>
    onChange({ units: data.units.map(u => u.id === id ? { ...u, ...patch } : u) })

  const remove = (id: string) =>
    onChange({ units: data.units.filter(u => u.id !== id) })

  const add = () =>
    onChange({ units: [...data.units, { id: crypto.randomUUID(), type: '', count: 0, mainArea: 0, priceMultiplier: 1.00 }] })

  const thCls = 'px-3 py-2 font-medium text-slate-600 whitespace-nowrap'
  const tdCls = 'px-3 py-2'

  const params = [
    { label: 'מחיר בסיס למ"ר — מסקר שוק (סעיף 4)',               value: pricePerSqm,          onChange: onPricePerSqmChange },
    { label: 'עלות בנייה מעל קרקע למ"ר — ניתוח כלכלי (סעיף 8)', value: constructionCostAbove, onChange: onConstructionCostAboveChange },
    { label: 'עלות בנייה תת-קרקע למ"ר — ניתוח כלכלי (סעיף 8)',  value: constructionCostBelow, onChange: onConstructionCostBelowChange },
  ]

  return (
    <div className="space-y-5">
      {!parkingFeasible && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          ⚠️ שטח החניון הנדרש ({formatNumber(requiredParkingArea, 0)} מ"ר) עולה על שטח השירות התת-קרקעי המותר ({formatNumber(totalUndergroundArea, 0)} מ"ר)
        </div>
      )}

      <Card title="פרמטרים">
        <div className="p-5 space-y-2">
          {params.map(({ label, value, onChange: cb }) => (
            <div key={label} className={rowCls}>
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} value={value || ''} placeholder="0"
                  onChange={e => cb(parseFloat(e.target.value) || 0)} className={paramInput} />
                <span className="text-xs text-slate-400 whitespace-nowrap">₪/מ"ר</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="תמהיל יחידות">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={thCls}>סוג</th>
                <th className={thCls}>מס׳ יח"ד</th>
                <th className={thCls}>שטח עיקרי (מ"ר)</th>
                <th className={thCls}>שטח שירות (מ"ר)</th>
                <th className={thCls}>מרפסת (מ"ר)</th>
                <th className={thCls}>מכפיל מחיר</th>
                <th className={thCls}>שווי כולל ללא מע"מ (₪)</th>
                <th className={thCls}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.units.map((unit, i) => (
                <tr key={unit.id} className="hover:bg-slate-50">
                  <td className={tdCls}>
                    <input type="text" value={unit.type} placeholder="סוג"
                      onChange={e => update(unit.id, { type: e.target.value })}
                      className={cellInput + ' w-24'} />
                  </td>
                  <td className={tdCls}>
                    <input type="number" min={0} value={unit.count || ''} placeholder="0"
                      onChange={e => update(unit.id, { count: parseFloat(e.target.value) || 0 })}
                      className={cellInput} />
                  </td>
                  <td className={tdCls}>
                    <input type="number" min={0} step={0.1} value={unit.mainArea || ''} placeholder="0"
                      onChange={e => update(unit.id, { mainArea: parseFloat(e.target.value) || 0 })}
                      className={cellInput} />
                  </td>
                  <td className={tdCls}>{MAMAD_AREA}</td>
                  <td className={tdCls}>{BALCONY_AREA}</td>
                  <td className={tdCls}>
                    <input type="number" min={0} step={0.01} value={unit.priceMultiplier || ''} placeholder="1.00"
                      onChange={e => update(unit.id, { priceMultiplier: parseFloat(e.target.value) || 1 })}
                      className={cellInput} />
                  </td>
                  <td className={tdCls}>{formatCurrency(unitValues[i])}</td>
                  <td className={tdCls}>
                    <button onClick={() => remove(unit.id)}
                      className="text-slate-400 hover:text-red-500 px-1 leading-none">×</button>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-slate-100 border-t-2 border-slate-300">
                <td className={tdCls}>סה"כ</td>
                <td className={tdCls}>{totalAllUnits}</td>
                <td className={tdCls}>{formatNumber(totalMainAreaAll, 1)}</td>
                <td className={tdCls}>{formatNumber(totalAllUnits * MAMAD_AREA, 0)}</td>
                <td className={tdCls}>{formatNumber(totalAllUnits * BALCONY_AREA, 0)}</td>
                <td className={tdCls}></td>
                <td className={tdCls}>{formatCurrency(totalValue)}</td>
                <td className={tdCls}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100">
          <button onClick={add} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            הוסף סוג דירה
          </button>
        </div>
      </Card>
    </div>
  )
}
