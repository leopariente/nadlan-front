import { produce } from 'immer'
import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { ReportTable, type ColumnDef } from '@/components/shared/ReportTable'
import { cn, formatNumber } from '@/lib/utils'
import type { ZoningRightsRow, Report } from '@/types/report'
import {
  calcNewTotalUnits,
  calcTotalPladeletProject,
  calcTotalResidentialBuiltArea,
  calcExistingUnits,
  calcDeveloperMarketingUnits,
  calcDeveloperMarketingArea,
  calcNewTotalResidentialRightsSqm,
  calcNewTotalCommercialRightsSqm,
} from '@/lib/calculations'

const zoningColumns: ColumnDef<ZoningRightsRow>[] = [
  { type: 'input', key: 'designation',              header: 'יעוד',               inputType: 'text',   width: '100px' },
  { type: 'input', key: 'usage',                    header: 'שימוש',              inputType: 'text',   width: '130px' },
  { type: 'input', key: 'buildingLocation',         header: 'בניין מיקום',        inputType: 'text',   width: '120px' },
  { type: 'input', key: 'plotSizeSqm',              header: 'גודל מגרש (מ"ר)',     inputType: 'number', width: '120px' },
  { type: 'input', key: 'mainBuildingRightsSqm',    header: 'שטח עיקרי (מ"ר)',     inputType: 'number', width: '120px' },
  { type: 'input', key: 'serviceBuildingRightsSqm', header: 'שטח שירות (מ"ר)',     inputType: 'number', width: '120px' },
  { type: 'input', key: 'density',                  header: 'צפיפות (יח\' לדונם)', inputType: 'number', width: '130px' },
  { type: 'input', key: 'coverage',                 header: 'תכסית (%)',           inputType: 'number', width: '90px'  },
  { type: 'input', key: 'floors',                   header: 'מס\' קומות',          inputType: 'number', width: '90px'  },
  { type: 'input', key: 'balconiesSqm',             header: 'מרפסות (מ"ר)',        inputType: 'number', width: '110px' },
]

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step2Planning({ report, updateStep }: Props) {
  if (!report) return null

  const handleZoningChange = (rowId: string, key: string, value: unknown) => {
    const updated = produce(report.step2.zoningRights, draft => {
      const row = draft.find(r => r.id === rowId)
      if (row) (row as Record<string, unknown>)[key] = value
    })
    updateStep({ key: 'step2', value: { ...report.step2, zoningRights: updated } })
  }

  const handleTenantPctChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateStep({ key: 'step2', value: { ...report.step2, tenantCompensationPct: parseFloat(e.target.value) || 0 } })

  const handleCommercialTenantPctChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateStep({ key: 'step2', value: { ...report.step2, commercialTenantCompensationPct: parseFloat(e.target.value) || 0 } })

  const newTotalUnits         = calcNewTotalUnits(report)
  const totalPladelet         = calcTotalPladeletProject(report)
  const existingResidentialArea = calcTotalResidentialBuiltArea(report)
  const existingUnits         = calcExistingUnits(report)
  const developerUnits        = calcDeveloperMarketingUnits(report)
  const developerArea         = calcDeveloperMarketingArea(report)
  const residentialRightsSqm  = calcNewTotalResidentialRightsSqm(report)
  const commercialRightsSqm   = calcNewTotalCommercialRightsSqm(report)

  const summaryRows = [
    { label: 'שטח לבנייה עיקרי - מגורים',         value: formatNumber(report.step2.zoningRights[0]?.mainBuildingRightsSqm ?? 0),    unit: 'מ"ר' },
    { label: 'שטח לבנייה שירות - מגורים',          value: formatNumber(report.step2.zoningRights[0]?.serviceBuildingRightsSqm ?? 0), unit: 'מ"ר' },
    { label: 'סה"כ שטח ברוטו למגורים',             value: formatNumber(residentialRightsSqm),  unit: 'מ"ר', bold: true },
    { label: 'סה"כ יח"ד - לפי נוסחת צפיפות',       value: String(newTotalUnits),               unit: 'יח"ד', highlight: true },
    { label: 'סה"כ שטח פלדלת בפרויקט',             value: formatNumber(totalPladelet),         unit: 'מ"ר', highlight: true },
    { label: 'סה"כ שטח דירתי קיים (משלב 1)',        value: formatNumber(existingResidentialArea), unit: 'מ"ר' },
    { label: 'סה"כ יח"ד קיימות (משלב 1)',           value: String(existingUnits),               unit: 'יח"ד' },
    { label: 'סה"כ שטח לשיווק היזם',               value: formatNumber(developerArea),         unit: 'מ"ר', bold: true },
    { label: 'סה"כ יח"ד לשיווק היזם',              value: String(developerUnits),              unit: 'יח"ד', highlight: true },
    { label: '──── מסחר ────',                      value: '',                                  unit: '', section: true },
    { label: 'שטח לבנייה עיקרי - מסחר',            value: formatNumber(report.step2.zoningRights[1]?.mainBuildingRightsSqm ?? 0),    unit: 'מ"ר' },
    { label: 'שטח לבנייה שירות - מסחר',            value: formatNumber(report.step2.zoningRights[1]?.serviceBuildingRightsSqm ?? 0), unit: 'מ"ר' },
    { label: 'סה"כ שטח ברוטו מסחר',                value: formatNumber(commercialRightsSqm),   unit: 'מ"ר', bold: true },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">זכויות בנייה (תב"ע)</h3>
        <ReportTable
          columns={zoningColumns}
          rows={report.step2.zoningRights}
          onRowChange={handleZoningChange}
          report={report}
        />
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">סיכום זכויות בנייה</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {summaryRows.map(({ label, value, unit, bold, highlight, section }) => (
                <tr
                  key={label}
                  className={cn(
                    section   ? 'bg-slate-100 border-t border-slate-200' :
                    highlight ? 'bg-amber-50 border-t border-amber-100' :
                                'border-t border-slate-100'
                  )}
                >
                  <td className={cn('px-4 py-2.5', bold || highlight ? 'font-bold text-slate-800' : 'text-slate-600')}>{label}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800 w-32">{value}</td>
                  <td className="px-4 py-2.5 text-slate-400 text-xs w-16">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4 flex gap-8">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600 whitespace-nowrap">% תמורה למגורים:</label>
            <input
              type="number"
              className="w-20 border border-slate-300 rounded px-2 py-1 text-right text-sm"
              value={report.step2.tenantCompensationPct}
              onChange={handleTenantPctChange}
            />
            <span className="text-slate-400 text-xs">%</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600 whitespace-nowrap">% תמורה למסחר:</label>
            <input
              type="number"
              className="w-20 border border-slate-300 rounded px-2 py-1 text-right text-sm"
              value={report.step2.commercialTenantCompensationPct}
              onChange={handleCommercialTenantPctChange}
            />
            <span className="text-slate-400 text-xs">%</span>
          </div>
        </div>
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

export default connector(Step2Planning)
