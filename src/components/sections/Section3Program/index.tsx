import { useState } from 'react'
import { TabSwitcher } from '@/components/shared/TabSwitcher'
import { AboveGroundTab } from './AboveGroundTab'
import { UndergroundTab } from './UndergroundTab'
import type { Section3Data } from '@/types'

type TabKey = 'above' | 'underground'

const TABS = [
  { key: 'above',      label: 'שטח עילי'  },
  { key: 'underground', label: 'שטח תת"ק' },
]

interface Props {
  data: Section3Data
  onChange: (data: Section3Data) => void
  developerUnits: number
  developerFloorplateSqm: number
  tenantUnits: number
  tenantFloorplateSqm: number
  residentialGross: number
  commercialMainArea: number
  commercialServiceArea: number
  readOnly?: boolean
}

export default function Section3Program({
  data,
  onChange,
  developerUnits,
  tenantUnits,
  commercialMainArea,
  commercialServiceArea,
  readOnly = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('above')

  return (
    <div className="space-y-5">
      <TabSwitcher
        tabs={TABS}
        activeTab={activeTab}
        onChange={key => setActiveTab(key as TabKey)}
      />

      {activeTab === 'above' && (
        <AboveGroundTab
          data={data}
          onChange={onChange}
          tenantUnits={tenantUnits}
          developerUnits={developerUnits}
          commercialMainArea={commercialMainArea}
          commercialServiceArea={commercialServiceArea}
          readOnly={readOnly}
        />
      )}

      {activeTab === 'underground' && (
        <UndergroundTab
          data={data}
          onChange={onChange}
          tenantUnits={tenantUnits}
          developerUnits={developerUnits}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}
