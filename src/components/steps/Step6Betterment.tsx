import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { updateStep, type UpdateStepPayload } from '@/store/reportSlice'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'
import type { BettermentLevyData, Report } from '@/types/report'
import {
  calcExistingResidentialValue,
  calcExistingCommercialValue,
  calcTotalExistingValue,
  calcNewResidentialValue,
  calcTotalNewValueGross,
  calcDeferralMultiplier,
  calcTotalNewValueDeferred,
  calcBettermentIncrease,
  calcBettermentLevy,
} from '@/lib/calculations'

function FieldRow({
  label,
  children,
  highlight,
  bold,
}: {
  label: string
  children: React.ReactNode
  highlight?: boolean
  bold?: boolean
}) {
  return (
    <tr className={cn('border-t border-slate-100', highlight && 'bg-amber-50')}>
      <td className={cn('px-4 py-2.5 text-slate-600', bold && 'font-bold text-slate-800')}>{label}</td>
      <td className="px-4 py-2.5 w-48">{children}</td>
    </tr>
  )
}

function NumInput({ value, onChange, suffix }: { value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div className="flex items-center gap-1 justify-end">
      <input
        type="number"
        className="w-28 border border-slate-300 rounded px-2 py-1 text-right text-sm"
        value={value === 0 ? '' : value}
        placeholder="0"
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
      />
      {suffix && <span className="text-slate-400 text-xs">{suffix}</span>}
    </div>
  )
}

function ReadOnlyValue({ value, isBold, isHighlight }: { value: string; isBold?: boolean; isHighlight?: boolean }) {
  return (
    <div className={cn(
      'text-right px-2 py-1 rounded',
      isHighlight ? 'text-amber-900 font-bold text-base' : isBold ? 'font-bold text-slate-800' : 'text-slate-700'
    )}>
      {value}
    </div>
  )
}

type Props = {
  report: Report | null
  updateStep: (payload: UpdateStepPayload) => void
}

function Step6Betterment({ report, updateStep }: Props) {
  if (!report) return null

  const b = report.step6.betterment

  const patch = (partial: Partial<BettermentLevyData>) => {
    updateStep({ key: 'step6', value: { betterment: { ...b, ...partial } } })
  }

  const existingResVal    = calcExistingResidentialValue(report)
  const existingComVal    = calcExistingCommercialValue(report)
  const totalExisting     = calcTotalExistingValue(report)
  const newResVal         = calcNewResidentialValue(report)
  const totalNewGross     = calcTotalNewValueGross(report)
  const deferralMult      = calcDeferralMultiplier(report)
  const totalNewDeferred  = calcTotalNewValueDeferred(report)
  const bettermentIncrease = calcBettermentIncrease(report)
  const bettermentLevy    = calcBettermentLevy(report)

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">מצב קיים — מגורים</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <FieldRow label="מספר יח&quot;ד">
                <NumInput value={b.existingResidentialUnits} onChange={v => patch({ existingResidentialUnits: v })} suffix='יח"ד' />
              </FieldRow>
              <FieldRow label='סה"כ מ"ר דירתי בנוי'>
                <NumInput value={b.existingResidentialAreaSqm} onChange={v => patch({ existingResidentialAreaSqm: v })} suffix='מ"ר' />
              </FieldRow>
              <FieldRow label='שווי למ"ר יד 2'>
                <NumInput value={b.existingResidentialValuePerSqm} onChange={v => patch({ existingResidentialValuePerSqm: v })} suffix='₪/מ"ר' />
              </FieldRow>
              <FieldRow label='סה"כ שווי מצב קיים' bold highlight>
                <ReadOnlyValue value={formatCurrency(existingResVal)} isBold isHighlight />
              </FieldRow>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">מצב קיים — מסחר</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <FieldRow label='שטחים מסחריים (מ"ר)'>
                <NumInput value={b.existingCommercialAreaSqm} onChange={v => patch({ existingCommercialAreaSqm: v })} suffix='מ"ר' />
              </FieldRow>
              <FieldRow label='שווי מ"ר מסחרי בנוי'>
                <NumInput value={b.existingCommercialValuePerSqm} onChange={v => patch({ existingCommercialValuePerSqm: v })} suffix='₪/מ"ר' />
              </FieldRow>
              <FieldRow label='סה"כ שווי מצב קיים מסחרי' bold highlight>
                <ReadOnlyValue value={formatCurrency(existingComVal)} isBold isHighlight />
              </FieldRow>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">מצב חדש</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <FieldRow label='מ"ר עיקרי חדש מגורים'>
                <NumInput value={b.newResidentialAreaSqm} onChange={v => patch({ newResidentialAreaSqm: v })} suffix='מ"ר' />
              </FieldRow>
              <FieldRow label='שווי למ"ר מבונה מגורים'>
                <NumInput value={b.newResidentialValuePerSqm} onChange={v => patch({ newResidentialValuePerSqm: v })} suffix='₪/מ"ר' />
              </FieldRow>
              <FieldRow label='סה"כ שווי מ"ר מבונה מגורים' bold>
                <ReadOnlyValue value={formatCurrency(newResVal)} isBold />
              </FieldRow>
              <FieldRow label='מ"ר עיקרי חדש מסחר'>
                <NumInput value={b.newCommercialAreaSqm} onChange={v => patch({ newCommercialAreaSqm: v })} suffix='מ"ר' />
              </FieldRow>
              <FieldRow label='שווי ממוצע מ"ר מבונה מסחר'>
                <NumInput value={b.newCommercialValuePerSqm} onChange={v => patch({ newCommercialValuePerSqm: v })} suffix='₪/מ"ר' />
              </FieldRow>
              <FieldRow label='סה"כ שווי במצב חדש' bold highlight>
                <ReadOnlyValue value={formatCurrency(totalNewGross)} isBold isHighlight />
              </FieldRow>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">הפחתת מטלות</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <FieldRow label='הריסת מבנים קיימים + מטלת יזם'>
                <NumInput value={b.demolitionAndDeveloperObligations} onChange={v => patch({ demolitionAndDeveloperObligations: v })} suffix='₪' />
              </FieldRow>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="text-base font-semibold text-slate-700 mb-3">סיכום וחישוב היטל השבחה</h3>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <FieldRow label='שווי מצב חדש גולמי'>
                <ReadOnlyValue value={formatCurrency(totalNewGross)} />
              </FieldRow>
              <FieldRow label='הפחתת עלות המטלות'>
                <ReadOnlyValue value={`(${formatCurrency(b.demolitionAndDeveloperObligations)})`} />
              </FieldRow>
              <FieldRow label='דחייה — שנים'>
                <NumInput value={b.deferralYears} onChange={v => patch({ deferralYears: v })} suffix='שנים' />
              </FieldRow>
              <FieldRow label='דחייה — ריבית שנתית'>
                <NumInput value={b.deferralRatePct} onChange={v => patch({ deferralRatePct: v })} suffix='%' />
              </FieldRow>
              <FieldRow label='מקדם דחייה'>
                <ReadOnlyValue value={formatNumber(deferralMult, 4)} />
              </FieldRow>
              <FieldRow label='סה"כ שווי מצב חדש (מדוחה)' bold>
                <ReadOnlyValue value={formatCurrency(totalNewDeferred)} isBold />
              </FieldRow>
              <FieldRow label='סה"כ שווי מצב קודם'>
                <ReadOnlyValue value={formatCurrency(totalExisting)} />
              </FieldRow>
              <FieldRow label='סה"כ השבחה' bold>
                <ReadOnlyValue value={formatCurrency(bettermentIncrease)} isBold />
              </FieldRow>
              <FieldRow label='אומדן היטל השבחה צפוי (%)'>
                <NumInput value={b.levyPct} onChange={v => patch({ levyPct: v })} suffix='%' />
              </FieldRow>
              <FieldRow label='אומדן היטל השבחה' bold highlight>
                <ReadOnlyValue value={formatCurrency(bettermentLevy)} isBold isHighlight />
              </FieldRow>
            </tbody>
          </table>
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

export default connector(Step6Betterment)
