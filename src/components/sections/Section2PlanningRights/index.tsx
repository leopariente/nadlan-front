import { TabSwitcher } from '@/components/shared/TabSwitcher'
import { GeneralPlanTab } from './GeneralPlanTab'
import { DetailedPlanTab } from './DetailedPlanTab'
import type { GeneralPlanData, Section2Data } from '@/types'

const DEFAULT_GENERAL_PLAN: GeneralPlanData = {
  coveragePct: 50,
  floors: 9,
  floorplatePct: 75,
  avgUnitSqm: 100,
  parkingPerUnit: 1.5,
  parkingSqm: 45,
  basementCoveragePct: 85,
}

const TABS = [
  { key: 'detailed', label: 'תכנית מפורטת' },
  { key: 'general',  label: 'תכנית כוללנית' },
]

interface Props {
  data: Section2Data
  onChange: (data: Section2Data) => void
  registeredArea: number
  readOnly?: boolean
}

export default function Section2PlanningRights({
  data,
  onChange,
  registeredArea,
  readOnly = false,
}: Props) {
  return (
    <div className="space-y-5">
      <TabSwitcher
        tabs={TABS}
        activeTab={data.planType}
        onChange={key => !readOnly && onChange({ ...data, planType: key as Section2Data['planType'] })}
      />

      {data.planType === 'general' && (
        <GeneralPlanTab
          data={data.generalPlan ?? DEFAULT_GENERAL_PLAN}
          onChange={gp => onChange({ ...data, generalPlan: gp })}
          registeredArea={registeredArea}
          readOnly={readOnly}
        />
      )}

      {data.planType === 'detailed' && (
        <DetailedPlanTab
          data={data}
          onChange={onChange}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}
