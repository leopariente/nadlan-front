import { Card } from '@/components/shared/Card'
import { Field } from '@/components/shared/Field'
import { inputClass } from '@/components/shared/formStyles'
import { FloorsTable } from './FloorsTable'
import { MetricCard } from './MetricCard'
import type { Section1Data, FloorRow } from '@/types'

interface Props {
  data: Section1Data
  onChange: (data: Section1Data) => void
  readOnly?: boolean
}

export default function Section1ExistingState({ data, onChange, readOnly = false }: Props) {
  function setField<K extends keyof Omit<Section1Data, 'floors'>>(key: K, value: Section1Data[K]) {
    onChange({ ...data, [key]: value })
  }

  function updateFloor(index: number, patch: Partial<FloorRow>) {
    const floors = data.floors.map((row, i) => (i === index ? { ...row, ...patch } : row))
    onChange({ ...data, floors })
  }

  function addFloor() {
    onChange({ ...data, floors: [...data.floors, { name: '', use: 'מגורים', floorArea: 0, balconyArea: 0 }] })
  }

  function deleteFloor(index: number) {
    onChange({ ...data, floors: data.floors.filter((_, i) => i !== index) })
  }

  const totalResidentialArea = data.floors
    .filter(f => f.use === 'מגורים')
    .reduce((sum, f) => sum + f.floorArea, 0)

  const totalCommercialArea = data.floors
    .filter(f => f.use === 'מסחר')
    .reduce((sum, f) => sum + f.floorArea, 0)

  const totalGrossArea = data.floors.reduce((sum, f) => sum + f.floorArea + f.balconyArea, 0)
  const avgUnitArea = data.existingUnits > 0 ? totalResidentialArea / data.existingUnits : 0

  return (
    <div className="space-y-5">
      <Card title="פרטי חלקה">
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <Field label="גוש">
            <input
              type="text"
              className={inputClass}
              value={data.gush}
              disabled={readOnly}
              onChange={e => setField('gush', e.target.value)}
            />
          </Field>

          <Field label="חלקה">
            <input
              type="text"
              className={inputClass}
              value={data.helka}
              disabled={readOnly}
              onChange={e => setField('helka', e.target.value)}
            />
          </Field>

          <Field label="כתובת">
            <input
              type="text"
              className={inputClass}
              value={data.address}
              disabled={readOnly}
              onChange={e => setField('address', e.target.value)}
            />
          </Field>

          <Field label='שטח רשום — מ"ר'>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={data.registeredArea || ''}
              disabled={readOnly}
              placeholder="0"
              onChange={e => setField('registeredArea', parseFloat(e.target.value) || 0)}
            />
          </Field>

          <Field label="חלק משתתף">
            <input
              type="text"
              className={inputClass}
              value={data.ownershipShare}
              disabled={readOnly}
              placeholder="בשלמות"
              onChange={e => setField('ownershipShare', e.target.value)}
            />
          </Field>

          <Field label='מס׳ יח"ד קיימות'>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={data.existingUnits || ''}
              disabled={readOnly}
              placeholder="0"
              onChange={e => setField('existingUnits', parseInt(e.target.value, 10) || 0)}
            />
          </Field>
        </div>
      </Card>

      <Card title='ניתוח היתרי בנייה'>
        <FloorsTable
          floors={data.floors}
          readOnly={readOnly}
          onUpdate={updateFloor}
          onAdd={addFloor}
          onDelete={deleteFloor}
        />
      </Card>

      <div className="grid grid-cols-4 gap-3">
        <MetricCard label='סה"כ שטח דירתי בנוי' value={totalResidentialArea} />
        <MetricCard label='סה"כ שטח מסחרי בנוי' value={totalCommercialArea} />
        <MetricCard label='סה"כ שטח בנוי ברוטו' value={totalGrossArea} />
        <MetricCard label='שטח יח"ד ממוצע' value={avgUnitArea} />
      </div>
    </div>
  )
}
