import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { FloorRow, FloorUse } from '@/types'

const FLOOR_USE_OPTIONS: FloorUse[] = ['מגורים', 'מסחר', 'מרתף', 'ציבורי', 'גג']

interface Props {
  floors: FloorRow[]
  readOnly: boolean
  onUpdate: (index: number, patch: Partial<FloorRow>) => void
  onAdd: () => void
  onDelete: (index: number) => void
}

export function FloorsTable({ floors, readOnly, onUpdate, onAdd, onDelete }: Props) {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-3 py-2.5 font-medium text-right w-36">קומה</th>
              <th className="px-3 py-2.5 font-medium text-right w-32">ייעוד</th>
              <th className="px-3 py-2.5 font-medium text-right w-36">שטח קומה (מ"ר)</th>
              <th className="px-3 py-2.5 font-medium text-right w-36">שטח מרפסות (מ"ר)</th>
              <th className="px-3 py-2.5 font-medium text-right w-28 bg-slate-600">סה"כ (מ"ר)</th>
              {!readOnly && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {floors.map((row, i) => {
              const rowTotal = Math.round(row.floorArea + row.balconyArea)
              return (
                <tr
                  key={i}
                  className={cn(
                    'border-b border-slate-100 last:border-0',
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40',
                  )}
                >
                  <td className="px-0 py-0 border-e border-slate-100">
                    <input
                      type="text"
                      className="cell-input"
                      value={row.name}
                      disabled={readOnly}
                      placeholder="קומה א׳"
                      onChange={e => onUpdate(i, { name: e.target.value })}
                    />
                  </td>
                  <td className="px-0 py-0 border-e border-slate-100">
                    <select
                      className="cell-input"
                      value={row.use}
                      disabled={readOnly}
                      onChange={e => onUpdate(i, { use: e.target.value as FloorUse })}
                    >
                      {FLOOR_USE_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-0 py-0 border-e border-slate-100">
                    <input
                      type="number"
                      min={0}
                      className="cell-input"
                      value={row.floorArea || ''}
                      disabled={readOnly}
                      placeholder="0"
                      onChange={e => onUpdate(i, { floorArea: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-0 py-0 border-e border-slate-100">
                    <input
                      type="number"
                      min={0}
                      className="cell-input"
                      value={row.balconyArea || ''}
                      disabled={readOnly}
                      placeholder="0"
                      onChange={e => onUpdate(i, { balconyArea: parseFloat(e.target.value) || 0 })}
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-slate-700 bg-slate-100/70 border-e border-slate-100 tabular-nums">
                    {rowTotal.toLocaleString('he-IL')}
                  </td>
                  {!readOnly && (
                    <td className="px-2 py-0 text-center">
                      <button
                        type="button"
                        onClick={() => onDelete(i)}
                        className="text-slate-300 hover:text-red-500 transition-colors text-base leading-none"
                        aria-label="מחק שורה"
                      >
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}

            {floors.length === 0 && (
              <tr>
                <td
                  colSpan={readOnly ? 5 : 6}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  אין קומות — לחץ &quot;הוסף קומה&quot; להוספה
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="mt-3">
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            + הוסף קומה
          </Button>
        </div>
      )}
    </div>
  )
}
