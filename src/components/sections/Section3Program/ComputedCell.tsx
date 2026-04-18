import { fmt } from '@/lib/utils'

interface Props {
  value: number
}

export function ComputedCell({ value }: Props) {
  return (
    <td className="px-3 py-2 text-sm text-slate-600 tabular-nums text-center bg-slate-50/80">
      {fmt(value)}
    </td>
  )
}
