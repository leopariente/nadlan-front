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
  residentialGross: number
  commercialGross: number
  basementSqm: number
  densityUnits: number
  readOnly?: boolean
}

// ─── Exported helper for cross-section use ────────────────────────────────────

export function computeTotalLeviesAndFees(
  data: Section5Data,
  registeredArea: number,
  residentialGross: number,
  commercialGross: number,
  basementSqm: number,
): number {
  const FLAT_RATE_PER_SQM = 500

  const allSurface = residentialGross + commercialGross + basementSqm
  const aboveGround = residentialGross + commercialGross

  if (data.useFlatRate) return aboveGround * FLAT_RATE_PER_SQM

  const { rates } = data
  const subtotal =
    allSurface * rates.constructionPermit +
    registeredArea * rates.roadLand +
    allSurface * rates.roadBuilding +
    registeredArea * rates.sidewalkLand +
    allSurface * rates.sidewalkBuilding +
    registeredArea * rates.drainageLand +
    allSurface * rates.drainageBuilding +
    allSurface * rates.waterAuthority

  return subtotal * (1 + rates.safetyBuffer / 100)
}

export default function Section5Levies({
  data,
  onChange,
  registeredArea,
  residentialGross,
  commercialGross,
  basementSqm,
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
          residentialGross={residentialGross}
          commercialGross={commercialGross}
          basementSqm={basementSqm}
          densityUnits={densityUnits}
        />
      )}
    </div>
  )
}
