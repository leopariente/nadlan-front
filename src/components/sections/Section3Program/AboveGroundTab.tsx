import { deriveRow, fmt } from './types'
import type { Section3Data, DerivedRow } from './types'
import { EmptyCell } from './EmptyCell'
import { inputCls } from './InputCell'
import { EditableRow } from './EditableRow'
import { TotalsRow } from './TotalsRow'
import { AveragesRow } from './AveragesRow'
import { ProjectAveragesRow } from './ProjectAveragesRow'

interface Props {
  data: Section3Data
  onChange: (data: Section3Data) => void
  tenantUnits: number
  developerUnits: number
  commercialMainArea: number
  commercialServiceArea: number
  readOnly: boolean
}

export function AboveGroundTab({
  data,
  onChange,
  tenantUnits,
  developerUnits,
  commercialMainArea,
  commercialServiceArea,
  readOnly,
}: Props) {
  const tenantD = deriveRow(data.tenantRow, tenantUnits)
  const developerD = deriveRow(data.developerRow, developerUnits)
  const totalUnits = tenantUnits + developerUnits

  const projectD: DerivedRow = {
    floorplatePerUnit: totalUnits > 0 ? (tenantD.totalFloorplate + developerD.totalFloorplate) / totalUnits : 0,
    grossPerUnit: totalUnits > 0 ? (tenantD.totalGross + developerD.totalGross) / totalUnits : 0,
    totalMain: tenantD.totalMain + developerD.totalMain,
    totalFloorplate: tenantD.totalFloorplate + developerD.totalFloorplate,
    totalGross: tenantD.totalGross + developerD.totalGross,
    totalOpenBalcony: tenantD.totalOpenBalcony + developerD.totalOpenBalcony,
  }

  const commercialFloorplate = commercialMainArea + commercialServiceArea

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">שטח עילי — תכנית בנייה</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[900px]" dir="rtl">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="px-3 py-2.5 text-right whitespace-nowrap">סוג הדירות</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">מספר<br/>יח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">שטח עיקרי<br/>ליח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">שטח ממ"ד<br/>ליח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap bg-slate-200/60">שטח פלדלת<br/>ליח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">רכוש משותף<br/>ליח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">מרפסת פתוחה<br/>ליח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap bg-slate-200/60">סך עיקרי</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap bg-slate-200/60">סך פלדלת</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap bg-slate-200/60">סך ברוטו עילי<br/>ללא מרפסות</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap bg-slate-200/60">סך מרפסות<br/>פתוחות</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">סך מרפסות גג</th>
            </tr>
          </thead>
          <tbody>
            {/* Rows 1–3: tenant */}
            <EditableRow
              label="דירות תמורה"
              row={data.tenantRow}
              units={tenantUnits}
              onChange={r => onChange({ ...data, tenantRow: r })}
              readOnly={readOnly}
            />
            <TotalsRow label="סך דירות תמורה" d={tenantD} units={tenantUnits} className="bg-slate-50" />
            <AveragesRow label="ממוצעים לדירות תמורה" row={data.tenantRow} d={tenantD} units={tenantUnits} className="bg-slate-50/50" />

            <tr><td colSpan={12} className="h-px bg-slate-200" /></tr>

            {/* Rows 4–6: developer */}
            <EditableRow
              label="דירות יזם לשיווק"
              row={data.developerRow}
              units={developerUnits}
              onChange={r => onChange({ ...data, developerRow: r })}
              readOnly={readOnly}
            />
            <TotalsRow label="סך דירות היזם" d={developerD} units={developerUnits} className="bg-slate-50" />
            <AveragesRow label="ממוצעים לדירות היזם" row={data.developerRow} d={developerD} units={developerUnits} className="bg-slate-50/50" />

            <tr><td colSpan={12} className="h-px bg-slate-200" /></tr>

            {/* Rows 7–8: project totals */}
            <tr className="bg-blue-50 border-b border-blue-100 font-bold">
              <td className="px-3 py-2.5 text-sm text-blue-900 whitespace-nowrap">סך הפרויקט למגורים</td>
              <td className="px-3 py-2.5 text-sm text-blue-700 tabular-nums text-center">{totalUnits}</td>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <td className="px-3 py-2.5 text-sm text-blue-900 tabular-nums text-center">{fmt(projectD.totalMain)}</td>
              <td className="px-3 py-2.5 text-sm text-blue-900 tabular-nums text-center">{fmt(projectD.totalFloorplate)}</td>
              <td className="px-3 py-2.5 text-sm text-blue-900 tabular-nums text-center">{fmt(projectD.totalGross)}</td>
              <td className="px-3 py-2.5 text-sm text-blue-900 tabular-nums text-center">{fmt(projectD.totalOpenBalcony)}</td>
              <EmptyCell />
            </tr>
            <ProjectAveragesRow
              label="ממוצעים לדירות הפרויקט"
              totalUnits={totalUnits}
              projectD={projectD}
              className="bg-blue-50/40"
            />

            <tr><td colSpan={12} className="h-px bg-slate-200" /></tr>

            {/* Row 9: commercial */}
            <tr className="bg-white border-b border-slate-100">
              <td className="px-3 py-2 text-sm font-medium text-slate-700 whitespace-nowrap">מסחר</td>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <td className="px-3 py-2 text-sm text-slate-600 tabular-nums text-center bg-slate-50/80">{fmt(commercialMainArea)}</td>
              <td className="px-3 py-2 text-sm text-slate-600 tabular-nums text-center bg-slate-50/80">{fmt(commercialFloorplate)}</td>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
            </tr>

            {/* Row 10: public buildings */}
            <tr className="bg-white">
              <td className="px-3 py-2 text-sm font-medium text-slate-700 whitespace-nowrap">מבני ציבור</td>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <td className="px-3 py-2 text-center">
                <input
                  type="number"
                  min={0}
                  disabled={readOnly}
                  value={data.publicBuildings.sqm || ''}
                  onChange={e => onChange({ ...data, publicBuildings: { sqm: parseFloat(e.target.value) || 0 } })}
                  className={inputCls}
                />
              </td>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
