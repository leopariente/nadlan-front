import { fmt } from './types'
import type { AboveGroundRow, DerivedRow } from './types'
import { EmptyCell } from './EmptyCell'

interface Props {
  label: string
  row: AboveGroundRow
  d: DerivedRow
  units: number
  className: string
}

export function AveragesRow({ label, row, d, units, className }: Props) {
  const safe = (n: number) => (units > 0 ? fmt(n) : '—')
  return (
    <tr className={`border-b border-slate-100 italic text-slate-500 text-xs ${className}`}>
      <td className="px-3 py-2 whitespace-nowrap">{label}</td>
      <EmptyCell />
      <td className="px-3 py-2 tabular-nums text-center">{safe(row.mainAreaPerUnit)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(row.mamadPerUnit)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(d.floorplatePerUnit)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(row.sharedAreaPerUnit)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(row.openBalconyPerUnit)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(d.totalMain / (units || 1))}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(d.totalFloorplate / (units || 1))}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(d.totalGross / (units || 1))}</td>
      <td className="px-3 py-2 tabular-nums text-center">{safe(d.totalOpenBalcony / (units || 1))}</td>
      <EmptyCell />
    </tr>
  )
}
