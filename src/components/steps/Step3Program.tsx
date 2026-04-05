import { produce } from 'immer'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { ReportTable, type ColumnDef } from '@/components/shared/ReportTable'
import { formatNumber } from '@/lib/utils'
import type { AboveGroundRow, UndergroundRow, Report } from '@/types/report'

const aboveGroundColumns: ColumnDef<AboveGroundRow>[] = [
  { type: 'input', key: 'label',          header: 'סוג',              inputType: 'text',   width: '170px' },
  { type: 'input', key: 'unitCount',      header: 'מספר יח"ד',       inputType: 'number', width: '90px'  },
  { type: 'input', key: 'mainAreaPerUnit', header: 'שטח עיקרי ליח"ד', inputType: 'number', width: '120px' },
  { type: 'input', key: 'safeRoomArea',   header: 'שטח ממ"ד',        inputType: 'number', width: '90px'  },
  {
    type: 'calculated', key: 'pladelet', header: 'שטח פלדלת ליח"ד', format: 'number',
    calculated: (row) => row.mainAreaPerUnit + row.safeRoomArea, width: '130px',
  },
  { type: 'input', key: 'balconyArea',    header: 'שטח מרפסת',       inputType: 'number', width: '100px' },
  { type: 'input', key: 'sharedAreaPct',  header: '% רכוש משותף',    inputType: 'number', width: '110px' },
  {
    type: 'calculated', key: 'totalPladelet', header: 'סה"כ פלדלת', format: 'number',
    calculated: (row) => (row.mainAreaPerUnit + row.safeRoomArea) * row.unitCount, width: '110px',
  },
  {
    type: 'calculated', key: 'totalBruto', header: 'סה"כ ברוטו עילי', format: 'number',
    calculated: (row) => {
      const pladelet = row.mainAreaPerUnit + row.safeRoomArea
      return (pladelet + pladelet * (row.sharedAreaPct / 100)) * row.unitCount
    },
    width: '130px',
  },
  {
    type: 'calculated', key: 'totalBalconies', header: 'סה"כ מרפסות', format: 'number',
    calculated: (row) => row.balconyArea * row.unitCount, width: '110px',
  },
]

const undergroundColumns: ColumnDef<UndergroundRow>[] = [
  { type: 'input', key: 'label',                   header: 'תיאור',            inputType: 'text',   width: '180px' },
  { type: 'input', key: 'parkingSpacesAboveGround', header: 'חניות עיליות',     inputType: 'number', width: '110px' },
  { type: 'input', key: 'parkingSpacesUnderground', header: 'חניות תת קרקעיות', inputType: 'number', width: '130px' },
  {
    type: 'calculated', key: 'totalSpaces', header: 'סה"כ מקומות חניה', format: 'number',
    calculated: (row) => row.parkingSpacesAboveGround + row.parkingSpacesUnderground, width: '130px',
  },
  { type: 'input', key: 'avgParkingSpaceSqm', header: 'שטח ממוצע למקום', inputType: 'number', width: '130px' },
  {
    type: 'calculated', key: 'totalUndergroundSqm', header: 'סה"כ שטח תת"ק', format: 'number',
    calculated: (row) => (row.parkingSpacesAboveGround + row.parkingSpacesUnderground) * row.avgParkingSpaceSqm,
    width: '120px',
  },
]

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step3Program({ report, updateStep }: Props) {
  if (!report) return null

  const handleAboveGroundChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step3.aboveGround, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step3', value: { ...report.step3, aboveGround: updated } })
  }

  const handleUndergroundChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step3.underground, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step3', value: { ...report.step3, underground: updated } })
  }

  const totalPladelet = report.step3.aboveGround.reduce(
    (sum, row) => !row.isSubtotal ? sum + (row.mainAreaPerUnit + row.safeRoomArea) * row.unitCount : sum,
    0
  )
  const totalUnits = report.step3.aboveGround.reduce(
    (sum, row) => !row.isSubtotal ? sum + row.unitCount : sum,
    0
  )

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">תוכנית עילית (מגורים)</h3>
        <ReportTable
          columns={aboveGroundColumns}
          rows={report.step3.aboveGround}
          rowConfig={(row) => ({ isTotal: row.isSubtotal, isReadOnly: row.isSubtotal })}
          onRowChange={handleAboveGroundChange}
          report={report}
        />
        <div className="mt-2 flex gap-6 text-sm text-slate-500 px-1">
          <span>סה"כ יח"ד: <strong className="text-slate-700">{totalUnits}</strong></span>
          <span>סה"כ פלדלת: <strong className="text-slate-700">{formatNumber(totalPladelet)} מ"ר</strong></span>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">תוכנית תת קרקעית</h3>
        <ReportTable
          columns={undergroundColumns}
          rows={report.step3.underground}
          onRowChange={handleUndergroundChange}
          report={report}
        />
      </section>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  report: state.report.report,
})

const mapDispatchToProps = {
  updateStep,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Step3Program)
