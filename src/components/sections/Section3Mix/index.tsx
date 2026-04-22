import type { Section3Data, CustomUnitType } from '@/types'
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

const cellInput = 'w-16 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400'
const paramInput = 'w-24 rounded border border-slate-200 bg-white px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-400'
const rowCls    = 'flex items-center justify-between rounded-lg bg-white border border-slate-200 px-4 py-2'

export default function Section3Mix({
  data, onChange,
  pricePerSqm, constructionCostAbove, constructionCostBelow,
  totalMainArea, totalUnits, totalUndergroundArea,
  onPricePerSqmChange, onConstructionCostAboveChange, onConstructionCostBelowChange,
}: Props) {
  const canCompute = totalUnits > 0 && totalMainArea > 0

  const defaultSmall = canCompute ? Math.round(totalUnits * 0.20) : 0
  const defaultStd   = canCompute ? Math.round(totalUnits * 0.60) : 0
  const defaultLarge = canCompute ? totalUnits - defaultSmall - defaultStd : 0

  const avgArea = canCompute ? totalMainArea / totalUnits : 0
  const rawSum  = defaultSmall * (avgArea * 0.80) + defaultStd * avgArea + defaultLarge * (avgArea * 1.25)
  const f       = rawSum > 0 ? totalMainArea / rawSum : 1

  const smallCount    = data.overrides.smallCount ?? defaultSmall
  const stdCount      = data.overrides.stdCount   ?? defaultStd
  const largeCount    = data.overrides.largeCount ?? defaultLarge
  const smallMainArea = data.overrides.smallArea  ?? (canCompute ? avgArea * 0.80 * f : 0)
  const stdMainArea   = data.overrides.stdArea    ?? (canCompute ? avgArea * f        : 0)
  const largeMainArea = data.overrides.largeArea  ?? (canCompute ? avgArea * 1.25 * f : 0)

  const customTotal   = data.customTypes.reduce((s, ct) => s + ct.count, 0)
  const totalAllUnits = smallCount + stdCount + largeCount + customTotal

  const requiredParkingArea = totalAllUnits * PARKING_SQM
  const parkingFeasible     = totalUndergroundArea <= 0 || requiredParkingArea <= totalUndergroundArea

  const priceBalcony = pricePerSqm * 0.50
  const allDefs = [
    { count: smallCount,  mainArea: smallMainArea,  typePrice: pricePerSqm * 1.10 },
    { count: stdCount,    mainArea: stdMainArea,    typePrice: pricePerSqm * 1.00 },
    { count: largeCount,  mainArea: largeMainArea,  typePrice: pricePerSqm * 0.95 },
    ...data.customTypes.map(ct => ({ count: ct.count, mainArea: ct.mainArea, typePrice: pricePerSqm * 1.00 })),
  ]

  let floorIdx = 0
  const groupValues = allDefs.map(def => {
    let v = 0
    for (let i = 0; i < def.count; i++) {
      if (pricePerSqm > 0) {
        const floor = Math.floor(floorIdx / UNITS_PER_FLOOR) + 1
        v += def.mainArea * def.typePrice * (1 + (floor >= 2 ? (floor - 1) * 0.01 : 0)) + BALCONY_AREA * priceBalcony
      }
      floorIdx++
    }
    return v
  })

  const totalValue       = groupValues.reduce((s, v) => s + v, 0)
  const totalMainAreaAll = smallCount * smallMainArea + stdCount * stdMainArea + largeCount * largeMainArea
    + data.customTypes.reduce((s, ct) => s + ct.count * ct.mainArea, 0)

  const setOverride = (key: keyof Section3Data['overrides'], value: number | undefined) => {
    const next = { ...data.overrides }
    if (value === undefined) delete next[key]; else next[key] = value
    onChange({ ...data, overrides: next })
  }

  const parseCell = (raw: string): number | undefined => raw === '' ? undefined : (parseFloat(raw) || 0)

  const addCustomType = () =>
    onChange({ ...data, customTypes: [...data.customTypes, { id: Date.now().toString(), type: '', count: 0, mainArea: 0 } satisfies CustomUnitType] })

  const updateCustomType = (id: string, updates: Partial<Omit<CustomUnitType, 'id'>>) =>
    onChange({ ...data, customTypes: data.customTypes.map(ct => ct.id === id ? { ...ct, ...updates } : ct) })

  const removeCustomType = (id: string) =>
    onChange({ ...data, customTypes: data.customTypes.filter(ct => ct.id !== id) })

  const thCls = 'px-3 py-2 font-medium text-slate-600 whitespace-nowrap'
  const tdCls = 'px-3 py-2'

  const params = [
    { label: 'מחיר בסיס למ"ר — מסקר שוק (סעיף 4)',               value: pricePerSqm,          onChange: onPricePerSqmChange },
    { label: 'עלות בנייה מעל קרקע למ"ר — ניתוח כלכלי (סעיף 8)', value: constructionCostAbove, onChange: onConstructionCostAboveChange },
    { label: 'עלות בנייה תת-קרקע למ"ר — ניתוח כלכלי (סעיף 8)',  value: constructionCostBelow, onChange: onConstructionCostBelowChange },
  ]

  const fixedRows = [
    { label: 'קטנה',   countKey: 'smallCount' as const, areaKey: 'smallArea' as const, count: smallCount, mainArea: smallMainArea },
    { label: 'סטנדרט', countKey: 'stdCount'   as const, areaKey: 'stdArea'   as const, count: stdCount,   mainArea: stdMainArea   },
    { label: 'גדולה',  countKey: 'largeCount' as const, areaKey: 'largeArea' as const, count: largeCount, mainArea: largeMainArea },
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
                <th className={thCls}>שווי כולל ללא מע"מ (₪)</th>
                <th className={thCls}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fixedRows.map(({ label, countKey, areaKey, count, mainArea }, i) => (
                <tr key={label} className="hover:bg-slate-50">
                  <td className={tdCls}>{label}</td>
                  <td className={tdCls}>
                    <input type="number" min={0} value={count}
                      onChange={e => setOverride(countKey, parseCell(e.target.value))} className={cellInput} />
                  </td>
                  <td className={tdCls}>
                    <input type="number" min={0} step={0.1} value={parseFloat(mainArea.toFixed(1))}
                      onChange={e => setOverride(areaKey, parseCell(e.target.value))} className={cellInput} />
                  </td>
                  <td className={tdCls}>{MAMAD_AREA}</td>
                  <td className={tdCls}>{BALCONY_AREA}</td>
                  <td className={tdCls}>{formatCurrency(groupValues[i])}</td>
                  <td className={tdCls}></td>
                </tr>
              ))}
              {data.customTypes.map((ct, i) => (
                <tr key={ct.id} className="hover:bg-slate-50">
                  <td className={tdCls}>
                    <input type="text" value={ct.type} placeholder="סוג חדש"
                      onChange={e => updateCustomType(ct.id, { type: e.target.value })}
                      className={cellInput + ' w-24'} />
                  </td>
                  <td className={tdCls}>
                    <input type="number" min={0} value={ct.count || ''} placeholder="0"
                      onChange={e => updateCustomType(ct.id, { count: parseFloat(e.target.value) || 0 })}
                      className={cellInput} />
                  </td>
                  <td className={tdCls}>
                    <input type="number" min={0} step={0.1} value={ct.mainArea || ''} placeholder="0"
                      onChange={e => updateCustomType(ct.id, { mainArea: parseFloat(e.target.value) || 0 })}
                      className={cellInput} />
                  </td>
                  <td className={tdCls}>{MAMAD_AREA}</td>
                  <td className={tdCls}>{BALCONY_AREA}</td>
                  <td className={tdCls}>{formatCurrency(groupValues[3 + i])}</td>
                  <td className={tdCls}>
                    <button onClick={() => removeCustomType(ct.id)}
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
                <td className={tdCls}>{formatCurrency(totalValue)}</td>
                <td className={tdCls}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-slate-100">
          <button onClick={addCustomType} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            הוסף סוג דירה
          </button>
        </div>
      </Card>
    </div>
  )
}
