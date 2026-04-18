import { fmt } from '@/lib/utils'
import { specialUndergroundSqm } from './types'
import type { UndergroundSpecialRow } from './types'
import { InputCell } from './InputCell'
import { EmptyCell } from './EmptyCell'

interface Props {
  label: string
  row: UndergroundSpecialRow
  showAdditionalSqm?: boolean
  onChange: (r: UndergroundSpecialRow) => void
  readOnly: boolean
}

export function UndergroundSpecialEditableRow({ label, row, showAdditionalSqm = false, onChange, readOnly }: Props) {
  const set = (key: keyof UndergroundSpecialRow) => (v: number) => onChange({ ...row, [key]: v })

  return (
    <tr className="bg-white border-b border-slate-100">
      <td className="px-3 py-2.5 text-sm font-medium text-slate-700 whitespace-nowrap">{label}</td>
      {showAdditionalSqm ? (
        <InputCell value={row.additionalSqm} onChange={set('additionalSqm')} readOnly={readOnly} />
      ) : (
        <EmptyCell />
      )}
      <EmptyCell />
      <EmptyCell />
      <InputCell value={row.parkingSpots} onChange={set('parkingSpots')} readOnly={readOnly} />
      <InputCell value={row.avgParkingSqm} onChange={set('avgParkingSqm')} readOnly={readOnly} />
      <td className="px-3 py-2 text-sm text-slate-600 tabular-nums text-center bg-slate-50/80">
        {fmt(specialUndergroundSqm(row))}
      </td>
      <EmptyCell />
    </tr>
  )
}
