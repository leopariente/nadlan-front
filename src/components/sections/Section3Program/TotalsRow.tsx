import { fmt } from './types'
import type { DerivedRow } from './types'
import { EmptyCell } from './EmptyCell'

interface Props {
  label: string
  d: DerivedRow
  units: number
  className: string
}

export function TotalsRow({ label, d, units, className }: Props) {
  return (
    <tr className={`border-b border-slate-100 font-semibold ${className}`}>
      <td className="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">{label}</td>
      <td className="px-3 py-2 text-sm text-slate-500 tabular-nums text-center">{units}</td>
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <EmptyCell />
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(d.totalMain)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(d.totalFloorplate)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(d.totalGross)}</td>
      <td className="px-3 py-2 text-sm text-slate-700 tabular-nums text-center">{fmt(d.totalOpenBalcony)}</td>
      <EmptyCell />
    </tr>
  )
}
