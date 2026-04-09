import { undergroundSqm, specialUndergroundSqm, fmt } from './types'
import type { Section3Data } from './types'
import { EmptyCell } from './EmptyCell'
import { UndergroundEditableRow } from './UndergroundEditableRow'
import { UndergroundTotalsRow } from './UndergroundTotalsRow'
import { UndergroundSpecialEditableRow } from './UndergroundSpecialEditableRow'

interface Props {
  data: Section3Data
  onChange: (data: Section3Data) => void
  tenantUnits: number
  developerUnits: number
  readOnly: boolean
}

export function UndergroundTab({ data, onChange, tenantUnits, developerUnits, readOnly }: Props) {
  const ug = data.underground
  const setUg = (patch: Partial<typeof ug>) => onChange({ ...data, underground: { ...ug, ...patch } })

  const totalSqm =
    undergroundSqm(ug.tenantRow) +
    undergroundSqm(ug.developerRow) +
    specialUndergroundSqm(ug.commercial) +
    specialUndergroundSqm(ug.disabled) +
    specialUndergroundSqm(ug.publicBuildings)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">שטח תת"ק — חניה</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[700px]" dir="rtl">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-xs font-semibold border-b border-slate-200">
              <th className="px-3 py-2.5 text-right whitespace-nowrap">סוג הדירות</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">מספר יח"ד /<br/>שטחים נוספים</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">מקומות חניה<br/>ליח"ד</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">מקומות חניה<br/>עיליים</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">מקומות חניה<br/>תת קרקעיים</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap">שטח ממוצע<br/>למקום חניה (מ"ר)</th>
              <th className="px-3 py-2.5 text-center whitespace-nowrap bg-slate-200/60">סך שטח<br/>תת"ק (מ"ר)</th>
              <th className="w-4" />
            </tr>
          </thead>
          <tbody>
            {/* Rows 1–2: tenant */}
            <UndergroundEditableRow
              label="דירות תמורה"
              units={tenantUnits}
              row={ug.tenantRow}
              onChange={r => setUg({ tenantRow: r })}
              readOnly={readOnly}
            />
            <UndergroundTotalsRow
              label="סך מ״ח לדירות תמורה"
              units={tenantUnits}
              row={ug.tenantRow}
              className="bg-slate-50"
            />

            <tr><td colSpan={8} className="h-px bg-slate-200" /></tr>

            {/* Rows 3–4: developer */}
            <UndergroundEditableRow
              label="דירות יזם"
              units={developerUnits}
              row={ug.developerRow}
              onChange={r => setUg({ developerRow: r })}
              readOnly={readOnly}
            />
            <UndergroundTotalsRow
              label="סך מ״ח לדירות היזם"
              units={developerUnits}
              row={ug.developerRow}
              className="bg-slate-50"
            />

            <tr><td colSpan={8} className="h-px bg-slate-200" /></tr>

            {/* Row 5: commercial */}
            <UndergroundSpecialEditableRow
              label="שטחי מסחר"
              row={ug.commercial}
              showAdditionalSqm
              onChange={r => setUg({ commercial: r })}
              readOnly={readOnly}
            />

            {/* Row 6: disabled */}
            <UndergroundSpecialEditableRow
              label="נכים"
              row={ug.disabled}
              onChange={r => setUg({ disabled: r })}
              readOnly={readOnly}
            />

            {/* Row 7: public buildings */}
            <UndergroundSpecialEditableRow
              label="מבני ציבור"
              row={ug.publicBuildings}
              onChange={r => setUg({ publicBuildings: r })}
              readOnly={readOnly}
            />

            <tr><td colSpan={8} className="h-px bg-slate-200" /></tr>

            {/* Row 8: grand total */}
            <tr className="bg-blue-50 font-bold">
              <td className="px-3 py-2.5 text-sm text-blue-900 whitespace-nowrap">סה"כ</td>
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <EmptyCell />
              <td className="px-3 py-2.5 text-sm text-blue-900 tabular-nums text-center">{fmt(totalSqm)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
