import { fmt } from './types'
import type { DerivedRow } from './types'
import { EmptyCell } from './EmptyCell'

interface Props {
  label: string
  totalUnits: number
  projectD: DerivedRow
  className: string
}

export function ProjectAveragesRow({ label, totalUnits, projectD, className }: Props) {
  const avg = (n: number) => (totalUnits > 0 ? fmt(n / totalUnits) : '—')
  return (
    <tr className={`border-b border-slate-100 italic text-slate-500 text-xs ${className}`}>
      <td className="px-3 py-2 whitespace-nowrap">{label}</td>
      <EmptyCell />
      <td className="px-3 py-2 tabular-nums text-center">{avg(projectD.totalMain)}</td>
      <EmptyCell />
      <td className="px-3 py-2 tabular-nums text-center">{avg(projectD.totalFloorplate)}</td>
      <EmptyCell />
      <EmptyCell />
      <td className="px-3 py-2 tabular-nums text-center">{avg(projectD.totalMain)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{avg(projectD.totalFloorplate)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{avg(projectD.totalGross)}</td>
      <td className="px-3 py-2 tabular-nums text-center">{avg(projectD.totalOpenBalcony)}</td>
      <EmptyCell />
    </tr>
  )
}
