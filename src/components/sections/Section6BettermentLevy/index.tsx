import { Table1ExistingState } from './Table1ExistingState'
import { Table2NewState } from './Table2NewState'
import { Table3Obligations } from './Table3Obligations'
import { Table4Summary } from './Table4Summary'
import { Table5Appreciation } from './Table5Appreciation'
import type { Section6Data } from '@/types'

interface Props {
  data: Section6Data
  onChange: (data: Section6Data) => void
  existingResidentialArea: number
  existingUnits: number
  existingCommercialArea: number
  newPrimaryResidentialArea: number
  newResidentialUnits: number
  newPrimaryCommercialArea: number
  yad2PricePerSqm: number
}

export default function Section6BettermentLevy({
  data,
  onChange,
  existingResidentialArea,
  existingUnits,
  existingCommercialArea,
  newPrimaryResidentialArea,
  newResidentialUnits,
  newPrimaryCommercialArea,
  yad2PricePerSqm,
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

  const totalExistingValue =
    existingResidentialArea * yad2PricePerSqm +
    existingCommercialArea * data.existingCommercialValuePerSqm

  return (
    <div className="space-y-5">
      <Table1ExistingState
        data={data}
        onChange={onChange}
        existingUnits={existingUnits}
        existingResidentialArea={existingResidentialArea}
        existingCommercialArea={existingCommercialArea}
        yad2PricePerSqm={yad2PricePerSqm}
      />
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
        totalExistingValue={totalExistingValue}
        deferralFactor={deferralFactor}
      />
    </div>
  )
}

// ─── Exported helper for cross-section use ────────────────────────────────────

export function computeEstimatedBettermentLevy(
  data: Section6Data,
  existingResidentialArea: number,
  existingCommercialArea: number,
  newPrimaryResidentialArea: number,
  newPrimaryCommercialArea: number,
  yad2PricePerSqm: number,
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

  const totalExistingValue =
    existingResidentialArea * yad2PricePerSqm +
    existingCommercialArea * data.existingCommercialValuePerSqm

  const appreciation = finalNewStateValue - totalExistingValue
  return appreciation * deferralFactor * (data.levyRate / 100)
}
