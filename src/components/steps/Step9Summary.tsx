import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import { calcStep9Summary } from '@/lib/calculations'
import type { Report } from '@/types/report'

function SummaryRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-2.5 px-4 text-slate-600">{label}</td>
      <td className="py-2.5 px-4 text-right font-semibold text-slate-800">
        {value} {unit && <span className="text-slate-400 font-normal text-xs">{unit}</span>}
      </td>
    </tr>
  )
}

function HighlightRow({
  label,
  value,
  color = 'amber',
}: {
  label: string
  value: string
  color?: 'green' | 'amber' | 'red'
}) {
  return (
    <tr className={cn(
      'border-t-2',
      color === 'green' && 'bg-green-50 border-green-200',
      color === 'amber' && 'bg-amber-50 border-amber-200',
      color === 'red'   && 'bg-red-50 border-red-200',
    )}>
      <td className={cn(
        'py-3 px-4 font-bold',
        color === 'green' && 'text-green-900',
        color === 'amber' && 'text-amber-900',
        color === 'red'   && 'text-red-900',
      )}>{label}</td>
      <td className={cn(
        'py-3 px-4 text-right text-lg font-bold',
        color === 'green' && 'text-green-800',
        color === 'amber' && 'text-amber-800',
        color === 'red'   && 'text-red-800',
      )}>{value}</td>
    </tr>
  )
}

type Props = { report: Report | null }

function Step9Summary({ report }: Props) {
  if (!report) return null

  const summary = calcStep9Summary(report)

  const profitColor: 'green' | 'amber' | 'red' =
    summary.profitToCoastPct >= 15 ? 'green' :
    summary.profitToCoastPct >= 10 ? 'amber' : 'red'

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        סיכום פרויקט — כל הנתונים מחושבים אוטומטית מהשלבים הקודמים
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-700 text-white px-5 py-3">
            <h3 className="font-semibold">סיכום פרויקט</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <SummaryRow label='סה"כ דירות קיימות לפינוי'  value={String(summary.existingUnits)}                          unit='יח"ד' />
              <SummaryRow label='סה"כ דירות חדשות'           value={String(summary.newTotalUnits)}                         unit='יח"ד' />
              <SummaryRow label='מקדם ציפוף'                  value={formatNumber(summary.densificationFactor, 2) + 'x'}   />
              <SummaryRow label='יתרת דירות לשיווק היזם'     value={String(summary.developerMarketingUnits)}               unit='יח"ד' />
              <SummaryRow label='סה"כ שטח פלדלת בפרויקט'     value={formatNumber(summary.totalPladeletProject)}           unit='מ"ר' />
              <SummaryRow label='תמורה ממוצעת ליח"ד'          value={formatNumber(summary.compensationPerUnit)}            unit='מ"ר' />
              <SummaryRow label='סה"כ שטח לשיווק היזם'        value={formatNumber(summary.developerMarketingArea)}         unit='מ"ר' />
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-700 text-white px-5 py-3">
            <h3 className="font-semibold">סיכום כלכלי</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              <SummaryRow label='סה"כ פדיון חזוי ליזם'  value={formatCurrency(summary.totalDeveloperRevenue)}   />
              <SummaryRow label='סה"כ עלויות הקמה'       value={formatCurrency(summary.totalConstructionCosts)} />
              <SummaryRow label='עודף חזוי בפרויקט'      value={formatCurrency(summary.projectedSurplus)}       />
              <HighlightRow
                label='שיעור רווח לעלות'
                value={`${formatNumber(summary.profitToCoastPct, 1)}%`}
                color={profitColor}
              />
              <HighlightRow
                label='שיעור רווח מפדיון'
                value={`${formatNumber(summary.profitToRevenuePct, 1)}%`}
                color={profitColor}
              />
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-slate-500 pt-2">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> רווח &gt;15% — טוב</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> רווח 10-15% — בינוני</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> רווח &lt;10% — נמוך</span>
      </div>
    </div>
  )
}

const mapStateToProps = (state: RootState) => ({
  report: state.report.report,
})

const connector = connect(mapStateToProps)

export default connector(Step9Summary)
