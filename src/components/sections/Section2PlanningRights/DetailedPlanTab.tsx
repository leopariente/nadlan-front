import { Card } from '@/components/shared/Card'
import { Field } from '@/components/shared/Field'
import { inputClass } from '@/components/shared/formStyles'
import { ComputedRow, KeyRow } from '@/components/shared/RowVariants'
import type { Section2Data } from '@/types'

interface Props {
  data: Section2Data
  onChange: (data: Section2Data) => void
  readOnly: boolean
}

export function DetailedPlanTab({ data, onChange, readOnly }: Props) {
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

  const residentialGross = data.residentialMainArea + data.residentialServiceArea
  const totalFloorplate  = data.residentialMainArea + data.densityUnits * data.mamadSqm
  const commercialGross  = data.commercialMainArea + data.commercialServiceArea

  return (
    <>
      <Card title="מגורים" bodyClassName="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field label='שטח לבנייה עיקרי — מגורים (מ"ר)'>{numInput('residentialMainArea')}</Field>
          <Field label='שטח לבנייה שירות — מגורים (מ"ר)'>{numInput('residentialServiceArea')}</Field>
        </div>

        <ComputedRow label='סה"כ שטח ברוטו למגורים (עיקרי + שירות)' value={residentialGross} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field label='סה"כ יח"ד — לפי נוסחת צפיפות'>{numInput('densityUnits')}</Field>
          <Field label='שטח ממ"ד ליח"ד (מ"ר)'>{numInput('mamadSqm', '12')}</Field>
        </div>

        <ComputedRow label='סה"כ שטח פלדלת בפרויקט (עיקרי + מס׳ יח"ד × ממ"ד)' value={totalFloorplate} />

        <div className="space-y-1.5">
          <KeyRow label='סה"כ שטח לשיווק היזם' value={totalFloorplate} />
          <KeyRow label='סה"כ יח"ד לשיווק היזם' value={data.densityUnits} unit='יח"ד' />
        </div>
      </Card>

      <Card title="מסחר" bodyClassName="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field label='שטח לבנייה עיקרי — מסחר (מ"ר)'>{numInput('commercialMainArea')}</Field>
          <Field label='שטח לבנייה שירות — מסחר (מ"ר)'>{numInput('commercialServiceArea')}</Field>
        </div>

        <div className="space-y-1.5">
          <ComputedRow label='סה"כ שטח ברוטו למסחר (עיקרי + שירות)' value={commercialGross} />
          <KeyRow label='סה"כ שטח מסחרי לשיווק היזם' value={commercialGross} />
        </div>
      </Card>
    </>
  )
}
