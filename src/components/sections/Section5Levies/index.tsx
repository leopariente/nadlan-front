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

// ─── Exported helper for cross-section use ────────────────────────────────────

export function computeTotalLeviesAndFees(
  data: Section5Data,
  registeredArea: number,
  existingGrossSqm: number,
  residentialGross: number,
  commercialGross: number,
  basementSqm: number,
  balconyTotalSqm: number,
): number {
  const FLAT_RATE_PER_SQM = 500
  const EXISTING_CREDIT_FACTOR = 0.8

  const allSurface = residentialGross + commercialGross + basementSqm + balconyTotalSqm
  const existingCredit = existingGrossSqm * EXISTING_CREDIT_FACTOR
  const netNew = allSurface - existingCredit
  const aboveGround = residentialGross + commercialGross

  if (data.useFlatRate) return aboveGround * FLAT_RATE_PER_SQM

  const { rates } = data
  const subtotal =
    allSurface * rates.constructionPermit +
    registeredArea * rates.roadLand +
    netNew * rates.roadBuilding +
    registeredArea * rates.sidewalkLand +
    netNew * rates.sidewalkBuilding +
    registeredArea * rates.drainageLand +
    netNew * rates.drainageBuilding +
    netNew * rates.waterAuthority

  return subtotal * (1 + rates.safetyBuffer / 100)
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
