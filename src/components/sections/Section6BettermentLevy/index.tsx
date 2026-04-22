import { Table1ExistingState } from './Table1ExistingState'
import { Table2NewState } from './Table2NewState'
import { Table3Obligations } from './Table3Obligations'
import { Table4Summary } from './Table4Summary'
import { Table5Appreciation } from './Table5Appreciation'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
  newPrimaryResidentialArea: number
  newResidentialUnits: number
  newPrimaryCommercialArea: number
}

export default function Section6BettermentLevy({
  data,
  onChange,
  newPrimaryResidentialArea,
  newResidentialUnits,
  newPrimaryCommercialArea,
}: Props) {
  const newStateTotal =
    newPrimaryResidentialArea * data.builtValuePerSqmResidential +
    newPrimaryCommercialArea * data.builtValuePerSqmCommercial +
    data.newPrimaryEmploymentArea * data.builtValuePerSqmEmployment

  const obligationsTotal =
    data.publicSpaceDevelopment + data.kindergartenConstruction + data.demolitionAndDeveloper

  const deferralFactor = 1 / Math.pow(1 + data.deferralRate / 100, data.deferralYears)
  const finalNewStateValue =
    (newStateTotal - obligationsTotal) * deferralFactor * (data.siteReductionFactor / 100)

  return (
    <div className="space-y-5">
      <Table1ExistingState />
      <Table2NewState
        data={data}
        onChange={onChange}
        newResidentialUnits={newResidentialUnits}
        newPrimaryResidentialArea={newPrimaryResidentialArea}
        newPrimaryCommercialArea={newPrimaryCommercialArea}
      />
      <Table3Obligations data={data} onChange={onChange} />
      <Table4Summary
        data={data}
        onChange={onChange}
        newStateTotal={newStateTotal}
        obligationsTotal={obligationsTotal}
      />
      <Table5Appreciation
        data={data}
        onChange={onChange}
        finalNewStateValue={finalNewStateValue}
        deferralFactor={deferralFactor}
      />
    </div>
  )
}

// ─── Exported helper for cross-section use ────────────────────────────────────

export function computeEstimatedBettermentLevy(
  data: Section6Data,
  newPrimaryResidentialArea: number,
  newPrimaryCommercialArea: number,
): number {
  const newStateTotal =
    newPrimaryResidentialArea * data.builtValuePerSqmResidential +
    newPrimaryCommercialArea * data.builtValuePerSqmCommercial +
    data.newPrimaryEmploymentArea * data.builtValuePerSqmEmployment

  const obligationsTotal =
    data.publicSpaceDevelopment + data.kindergartenConstruction + data.demolitionAndDeveloper

  const deferralFactor = 1 / Math.pow(1 + data.deferralRate / 100, data.deferralYears)
  const finalNewStateValue =
    (newStateTotal - obligationsTotal) * deferralFactor * (data.siteReductionFactor / 100)

  return finalNewStateValue * deferralFactor * (data.levyRate / 100)
}
