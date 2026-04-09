export const inputCls =
  'w-16 rounded border border-slate-200 bg-white px-1.5 py-1 text-sm text-right text-slate-800 tabular-nums ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
  'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed'

interface Props {
  value: number
  onChange: (v: number) => void
  readOnly: boolean
}

export function InputCell({ value, onChange, readOnly }: Props) {
  return (
    <td className="px-3 py-2 text-center">
      <input
        type="number"
        min={0}
        disabled={readOnly}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className={inputCls}
      />
    </td>
  )
}
