import { fmt } from '@/lib/utils'
import { undergroundSqm } from './types'
import type { UndergroundRow } from './types'
import { InputCell } from './InputCell'
import { EmptyCell } from './EmptyCell'

interface Props {
  label: string
  units: number
  row: UndergroundRow
  onChange: (r: UndergroundRow) => void
  readOnly: boolean
}

export function UndergroundEditableRow({ label, units, row, onChange, readOnly }: Props) {
  const set = (key: keyof UndergroundRow) => (v: number) => onChange({ ...row, [key]: v })

  return (
    <tr className="bg-white border-b border-slate-100">
      <td className="px-3 py-2.5 text-sm font-medium text-slate-700 whitespace-nowrap">{label}</td>
      <td className="px-3 py-2.5 text-sm text-slate-400 tabular-nums text-center">{units}</td>
      <InputCell value={row.parkingPerUnit} onChange={set('parkingPerUnit')} readOnly={readOnly} />
      <InputCell value={row.parkingAboveGround} onChange={set('parkingAboveGround')} readOnly={readOnly} />
      <InputCell value={row.parkingUnderground} onChange={set('parkingUnderground')} readOnly={readOnly} />
      <InputCell value={row.avgParkingSqm} onChange={set('avgParkingSqm')} readOnly={readOnly} />
      <td className="px-3 py-2 text-sm text-slate-600 tabular-nums text-center bg-slate-50/80">
        {fmt(undergroundSqm(row))}
      </td>
      <EmptyCell />
    </tr>
  )
}
