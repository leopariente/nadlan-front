import { useState } from 'react'
import { TabSwitcher } from '@/components/shared/TabSwitcher'
import { RatesTab } from './RatesTab'
import { CalcTab } from './CalcTab'
import type { Section5Data } from '@/types'

type TabKey = 'rates' | 'calc'

const TABS = [
  { key: 'rates', label: 'מכפילים' },
  { key: 'calc',  label: 'תחשיב'   },
]

interface Props {
  data: Section5Data
  onChange: (data: Section5Data) => void
  registeredArea: number
  existingGrossSqm: number
  existingUnits: number
  residentialGross: number
  commercialGross: number
  basementSqm: number
  balconyTotalSqm: number
  densityUnits: number
  readOnly?: boolean
}

export default function Section5Levies({
  data,
  onChange,
  registeredArea,
  existingGrossSqm,
  existingUnits,
  residentialGross,
  commercialGross,
  basementSqm,
  balconyTotalSqm,
  densityUnits,
  readOnly = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('rates')

  return (
    <div className="space-y-5">
      <TabSwitcher
        tabs={TABS}
        activeTab={activeTab}
        onChange={key => setActiveTab(key as TabKey)}
      />

      {activeTab === 'rates' && (
        <RatesTab data={data} onChange={onChange} readOnly={readOnly} />
      )}

      {activeTab === 'calc' && (
        <CalcTab
          data={data}
          registeredArea={registeredArea}
          existingGrossSqm={existingGrossSqm}
          existingUnits={existingUnits}
          residentialGross={residentialGross}
          commercialGross={commercialGross}
          basementSqm={basementSqm}
          balconyTotalSqm={balconyTotalSqm}
          densityUnits={densityUnits}
        />
      )}
    </div>
  )
}
