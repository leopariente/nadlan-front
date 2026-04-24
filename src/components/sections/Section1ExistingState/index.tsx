import { Card } from '@/components/shared/Card'
import { Field } from '@/components/shared/Field'
import { inputClass } from '@/components/shared/formStyles'
import type { Section1Data } from '@/types'
import { ExtractRightsButton } from './ExtractRightsButton'

interface Props {
  data: Section1Data
  onChange: (data: Section1Data) => void
  gush: string
  helka: string
  readOnly?: boolean
}

export default function Section1ExistingState({ data, onChange, gush, helka, readOnly = false }: Props) {
  function setField<K extends keyof Section1Data>(key: K, value: Section1Data[K]) {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="space-y-4">
    {!readOnly && <ExtractRightsButton />}
    <Card title="פרטי חלקה">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        <Field label="גוש">
          <input type="text" className={inputClass} value={gush} disabled readOnly />
        </Field>

        <Field label="חלקה">
          <input type="text" className={inputClass} value={helka} disabled readOnly />
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
      </div>
    </Card>
    </div>
  )
}
