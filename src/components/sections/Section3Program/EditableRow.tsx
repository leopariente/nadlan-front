import { deriveRow } from './types'
import type { AboveGroundRow } from './types'
import { InputCell } from './InputCell'
import { ComputedCell } from './ComputedCell'

interface Props {
  label: string
  row: AboveGroundRow
  units: number
  onChange: (r: AboveGroundRow) => void
  readOnly: boolean
}

export function EditableRow({ label, row, units, onChange, readOnly }: Props) {
  const d = deriveRow(row, units)
  const set = (key: keyof AboveGroundRow) => (v: number) => onChange({ ...row, [key]: v })

  return (
    <tr className="bg-white border-b border-slate-100">
      <td className="px-3 py-2.5 text-sm font-medium text-slate-700 whitespace-nowrap">{label}</td>
      <td className="px-3 py-2.5 text-sm text-slate-400 tabular-nums text-center">{units}</td>
      <InputCell value={row.mainAreaPerUnit} onChange={set('mainAreaPerUnit')} readOnly={readOnly} />
      <InputCell value={row.mamadPerUnit} onChange={set('mamadPerUnit')} readOnly={readOnly} />
      <ComputedCell value={d.floorplatePerUnit} />
      <InputCell value={row.sharedAreaPerUnit} onChange={set('sharedAreaPerUnit')} readOnly={readOnly} />
      <InputCell value={row.openBalconyPerUnit} onChange={set('openBalconyPerUnit')} readOnly={readOnly} />
      <ComputedCell value={d.totalMain} />
      <ComputedCell value={d.totalFloorplate} />
      <ComputedCell value={d.totalGross} />
      <ComputedCell value={d.totalOpenBalcony} />
      <InputCell value={row.roofBalconySqm} onChange={set('roofBalconySqm')} readOnly={readOnly} />
    </tr>
  )
}
