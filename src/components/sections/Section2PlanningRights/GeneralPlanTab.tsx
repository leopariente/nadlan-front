import { Card } from '@/components/shared/Card'
import { Field } from '@/components/shared/Field'
import { inputClass } from '@/components/shared/formStyles'
import { ComputedRow, InlineInputRow, KeyRow } from '@/components/shared/RowVariants'
import type { GeneralPlanData } from '@/types'

interface Props {
  data: GeneralPlanData
  onChange: (data: GeneralPlanData) => void
  registeredArea: number
  readOnly?: boolean
}

export function GeneralPlanTab({ data, onChange, registeredArea, readOnly = false }: Props) {
  function set<K extends keyof GeneralPlanData>(key: K, value: GeneralPlanData[K]) {
    onChange({ ...data, [key]: value })
  }

  function numInput(key: keyof GeneralPlanData, placeholder = '0') {
    return (
      <input
        type="number"
        min={0}
        className={inputClass}
        value={(data[key] as number) || ''}
        disabled={readOnly}
        placeholder={placeholder}
        onChange={e => set(key, parseFloat(e.target.value) || 0)}
      />
    )
  }

  const floorSqm        = registeredArea * data.coveragePct / 100
  const totalGross      = floorSqm * data.floors
  const totalFloorplate = totalGross * data.floorplatePct / 100
  const totalUnits      = data.avgUnitSqm > 0 ? totalGross / data.avgUnitSqm : 0
  const totalParking    = totalUnits * data.parkingPerUnit
  const basementSqm     = totalParking * data.parkingSqm
  const basementBase    = registeredArea * data.basementCoveragePct / 100
  const basementFloors  = basementBase > 0 ? basementSqm / basementBase : 0

  return (
    <Card title="תכנית כוללנית" bodyClassName="p-5 space-y-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Field label="תכסית %">{numInput('coveragePct', '50')}</Field>
        <Field label="מס׳ קומות">{numInput('floors', '9')}</Field>
      </div>

      <div className="space-y-1.5">
        <ComputedRow label="שטח קומה ברוטו (שטח חלקה × תכסית)" value={floorSqm} />
        <ComputedRow label='סה"כ שטח ברוטו עילי (שטח קומה × מס׳ קומות)' value={totalGross} />
      </div>

      <InlineInputRow
        label="שטח פלדלת מברוטו %"
        value={data.floorplatePct}
        onChange={v => set('floorplatePct', v)}
        placeholder="75"
        unit="%"
        disabled={readOnly}
      />

      <ComputedRow label='סה"כ שטח פלדלת (ברוטו עילי × % פלדלת)' value={totalFloorplate} />

      <InlineInputRow
        label='שטח ממוצע ליח"ד (מ"ר)'
        value={data.avgUnitSqm}
        onChange={v => set('avgUnitSqm', v)}
        placeholder="100"
        disabled={readOnly}
      />

      <KeyRow label='סה"כ יח"ד (שטח ברוטו ÷ שטח ממוצע)' value={totalUnits} unit='יח"ד' />

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <Field label='חניות ליח"ד'>{numInput('parkingPerUnit', '1.5')}</Field>
        <Field label='שטח חניה תת"ק (מ"ר)'>{numInput('parkingSqm', '45')}</Field>
      </div>

      <div className="space-y-1.5">
        <ComputedRow label='סה"כ חניות (יח"ד × חניות ליח"ד)' value={totalParking} unit="חניות" />
        <ComputedRow label='סה"כ שטח תת"ק (חניות × שטח חניה)' value={basementSqm} />
      </div>

      <InlineInputRow
        label='תכסית תת"ק %'
        value={data.basementCoveragePct}
        onChange={v => set('basementCoveragePct', v)}
        placeholder="85"
        unit="%"
        disabled={readOnly}
      />

      <KeyRow label='מס׳ קומות תת"ק (שטח תת"ק ÷ שטח קומה תת"ק)' value={basementFloors} unit="קומות" />
    </Card>
  )
}
