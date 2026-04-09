import { Card } from '@/components/shared/Card'
import { Field } from '@/components/shared/Field'
import { inputClass } from '@/components/shared/formStyles'
import { ComputedRow, Section1Row, InlineInputRow, KeyRow } from '@/components/shared/RowVariants'
import type { Section2Data } from '@/types'

interface Props {
  data: Section2Data
  onChange: (data: Section2Data) => void
  registeredArea: number
  existingResidentialSqm: number
  existingUnits: number
  existingCommercialSqm: number
  readOnly: boolean
}

export function DetailedPlanTab({
  data,
  onChange,
  existingResidentialSqm,
  existingUnits,
  existingCommercialSqm,
  readOnly,
}: Props) {
  function set<K extends keyof Section2Data>(key: K, value: Section2Data[K]) {
    onChange({ ...data, [key]: value })
  }

  function numInput(key: keyof Section2Data, placeholder = '0') {
    return (
      <input
        type="number"
        min={0}
        className={inputClass}
        value={(data[key] as number) || ''}
        disabled={readOnly}
        placeholder={placeholder}
        onChange={e => set(key, (parseFloat(e.target.value) || 0) as Section2Data[typeof key])}
      />
    )
  }

  // Residential derived
  const residentialGross       = data.residentialMainArea + data.residentialServiceArea
  const totalFloorplate        = data.residentialMainArea + data.densityUnits * data.mamadSqm
  const existingWithBonus      = existingResidentialSqm + data.tenantBonusSqmPerUnit * existingUnits
  const developerFloorplateSqm = totalFloorplate - existingWithBonus
  const developerUnits         = data.densityUnits - existingUnits

  // Commercial derived
  const commercialGross        = data.commercialMainArea + data.commercialServiceArea
  const commercialForSale      = commercialGross
  const tenantCommercialSqm    = existingCommercialSqm * (1 + data.commercialTenantBonusPct / 100)
  const developerCommercialSqm = commercialForSale - tenantCommercialSqm

  const tenantBonusLabel = (
    <span className="flex items-center gap-1.5">
      <span>סה&quot;כ שטח מסחרי לדיירים בתמורה של</span>
      <input
        type="number"
        min={0}
        max={100}
        disabled={readOnly}
        value={data.commercialTenantBonusPct || ''}
        placeholder="25"
        onChange={e => set('commercialTenantBonusPct', parseFloat(e.target.value) || 0)}
        className={
          'w-12 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs text-slate-700 text-center ' +
          'focus:outline-none focus:ring-1 focus:ring-blue-500 ' +
          'disabled:bg-slate-100 disabled:cursor-not-allowed'
        }
      />
      <span>%</span>
    </span>
  )

  return (
    <>
      <Card title="מגורים" bodyClassName="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label='שטח לבנייה עיקרי — מגורים (מ"ר)'>{numInput('residentialMainArea')}</Field>
          <Field label='שטח לבנייה שירות — מגורים (מ"ר)'>{numInput('residentialServiceArea')}</Field>
        </div>

        <ComputedRow label='סה"כ שטח ברוטו למגורים (עיקרי + שירות)' value={residentialGross} />

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label='סה"כ יח"ד — לפי נוסחת צפיפות'>{numInput('densityUnits')}</Field>
          <Field label='שטח ממ"ד ליח"ד (מ"ר)'>{numInput('mamadSqm', '12')}</Field>
        </div>

        <ComputedRow label='סה"כ שטח פלדלת בפרויקט (עיקרי + מס׳ יח"ד × ממ"ד)' value={totalFloorplate} />

        <div className="space-y-1.5">
          <Section1Row label='סה"כ שטח דירתי קיים (לפי היתרי בנייה)' value={existingResidentialSqm} />
          <Section1Row label='סה"כ יח"ד קיימות' value={existingUnits} unit='יח"ד' />
        </div>

        <InlineInputRow
          label='תמורה למ"ר ליח"ד (מ"ר)'
          value={data.tenantBonusSqmPerUnit}
          onChange={v => set('tenantBonusSqmPerUnit', v)}
          placeholder="6"
          disabled={readOnly}
        />

        <div className="space-y-1.5">
          <ComputedRow
            label='סה"כ שטח דירתי קיים + תמורה (תמורה × יח"ד קיימות + שטח קיים)'
            value={existingWithBonus}
          />
          <KeyRow label='סה"כ שטח לשיווק היזם (שטח פלדלת בניכוי שטח תמורה)' value={developerFloorplateSqm} />
          <KeyRow label='סה"כ יח"ד לשיווק היזם (יח"ד כולל בניכוי יח"ד קיימות)' value={developerUnits} unit='יח"ד' />
        </div>
      </Card>

      <Card title="מסחר" bodyClassName="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Field label='שטח לבנייה עיקרי — מסחר (מ"ר)'>{numInput('commercialMainArea')}</Field>
          <Field label='שטח לבנייה שירות — מסחר (מ"ר)'>{numInput('commercialServiceArea')}</Field>
        </div>

        <div className="space-y-1.5">
          <ComputedRow label='סה"כ שטח ברוטו למסחר (עיקרי + שירות)' value={commercialGross} />
          <ComputedRow label="שטח לשיווק מסחר (נניח שנשווק את הכל)" value={commercialForSale} />
          <Section1Row label="סה&quot;כ שטח מסחרי דיירים קיים" value={existingCommercialSqm} />
          <ComputedRow label={tenantBonusLabel} value={tenantCommercialSqm} />
          <KeyRow label="סה&quot;כ שטח מסחרי לשיווק היזם" value={developerCommercialSqm} />
        </div>
      </Card>
    </>
  )
}
