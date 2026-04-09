import { undergroundSqm, fmt } from './types'
import type { UndergroundRow } from './types'
import { EmptyCell } from './EmptyCell'

interface Props {
  label: string
  units: number
  row: UndergroundRow
  className: string
}

export function UndergroundTotalsRow({ label, units, row, className }: Props) {
  return (
    <tr className={`border-b border-slate-100 font-semibold ${className}`}>
      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{label}</td>
      <td className="px-3 py-2 text-sm text-slate-500 tabular-nums text-center">{units}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(units * row.parkingPerUnit)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(row.parkingAboveGround)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(row.parkingUnderground)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(row.avgParkingSqm)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(undergroundSqm(row))}</td>
      <EmptyCell />
    </tr>
  )
}
