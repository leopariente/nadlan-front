import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  initReport,
  updateSection1,
  updateSection2,
  updateSection3,
  updateSection4,
  updateSection5,
  updateSection6,
  updateSection7,
} from '@/store/reportData/reportDataSlice'
import { Layout } from '@/components/layout/Layout'
import SectionNav from '@/components/layout/SectionNav'
import Section1ExistingState from '@/components/sections/Section1ExistingState'
import Section2PlanningRights from '@/components/sections/Section2PlanningRights'
import Section4MarketSurvey from '@/components/sections/Section4MarketSurvey'
import Section5Levies from '@/components/sections/Section5Levies'
import Section3Program from '@/components/sections/Section3Program'
import Section6BettermentLevy from '@/components/sections/Section6BettermentLevy'
import Section7InventoryValue from '@/components/sections/Section7InventoryValue'
import Section9Summary from '@/components/sections/Section9Summary'
import { SECTIONS, type SectionNumber } from '@/constants/sections'

// ─── Placeholder for unimplemented sections ───────────────────────────────────

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm">
      {label} — בבנייה
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Report() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [currentSection, setCurrentSection] = useState<SectionNumber>(1)

  // Ensure report data is initialized for this ID
  useEffect(() => {
    if (id) dispatch(initReport({ id }))
  }, [id, dispatch])

  const sections = useAppSelector(s => s.reportData.reports[id ?? ''])

  const sectionLabel = SECTIONS.find(s => s.number === currentSection)?.label ?? ''

  if (!sections) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        טוען...
      </div>
    )
  }

  const { section1, section2, section3, section4, section5, section6, section7 } = sections

  // Cross-section values derived from Section 1
  const existingResidentialSqm = section1.floors
    .filter(f => f.use === 'מגורים')
    .reduce((sum, f) => sum + f.floorArea, 0)

  const existingCommercialSqm = section1.floors
    .filter(f => f.use === 'מסחר')
    .reduce((sum, f) => sum + f.floorArea, 0)

  const existingGrossSqm = section1.floors
    .reduce((sum, f) => sum + f.floorArea + f.balconyArea, 0)

  const balconyTotalSqm = section1.floors
    .reduce((sum, f) => sum + f.balconyArea, 0)

  // Section 2 derived
  const s2ResidentialGross = section2.residentialMainArea + section2.residentialServiceArea
  const s2CommercialGross  = section2.commercialMainArea  + section2.commercialServiceArea

  // Section 7 inputs — derived from sections 1, 2, and 4
  const existingWithBonus      = existingResidentialSqm + section2.tenantBonusSqmPerUnit * section1.existingUnits
  const totalFloorplate        = section2.residentialMainArea + section2.densityUnits * section2.mamadSqm
  const developerFloorplateSqm = Math.max(0, totalFloorplate - existingWithBonus)
  const developerUnits         = Math.max(0, section2.densityUnits - section1.existingUnits)
  const tenantCommercialSqm    = existingCommercialSqm * (1 + section2.commercialTenantBonusPct / 100)
  const developerCommercialSqm = Math.max(0, s2CommercialGross - tenantCommercialSqm)

  const s4ResidentialPrice =
    section4.newApartments.selectedPricePerSqm > 0
      ? section4.newApartments.selectedPricePerSqm
      : section4.secondaryApartments.selectedPricePerSqm
  const s4CommercialPrice  =
    s4ResidentialPrice * (section4.commercial.commercialPctOfResidential / 100)

  // Section 9 inputs — derived from sections 1, 2, 3, and 7
  const s9TotalNewUnits          = section2.densityUnits
  const s9TotalFloorAreaProject  = existingWithBonus + developerFloorplateSqm
  const s9CompensationPerUnit    = existingWithBonus / (section1.existingUnits || 1)
  const s9VatFactor              = 1 + section7.vatPct / 100
  const s9ResRevenueK            = Math.round(developerFloorplateSqm * s4ResidentialPrice / 1000)
  const s9CommRevenueK           = Math.round(developerCommercialSqm * s4CommercialPrice  / 1000)
  const s9TotalDeveloperRevenue  = Math.round(s9ResRevenueK / s9VatFactor) + s9CommRevenueK

  function renderSection() {
    switch (currentSection) {
      case 1: return (
        <Section1ExistingState
          data={section1}
          onChange={data => dispatch(updateSection1({ id: id!, data }))}
        />
      )
      case 2: return (
        <Section2PlanningRights
          data={section2}
          onChange={data => dispatch(updateSection2({ id: id!, data }))}
          registeredArea={section1.registeredArea}
          existingResidentialSqm={existingResidentialSqm}
          existingUnits={section1.existingUnits}
          existingCommercialSqm={existingCommercialSqm}
        />
      )
      case 3: return (
        <Section3Program
          data={section3}
          onChange={data => dispatch(updateSection3({ id: id!, data }))}
          developerUnits={developerUnits}
          developerFloorplateSqm={developerFloorplateSqm}
          tenantUnits={section1.existingUnits}
          tenantFloorplateSqm={existingWithBonus / (section1.existingUnits || 1)}
          residentialGross={s2ResidentialGross}
          commercialMainArea={section2.commercialMainArea}
          commercialServiceArea={section2.commercialServiceArea}
        />
      )
      case 4: return (
        <Section4MarketSurvey
          data={section4}
          onChange={data => dispatch(updateSection4({ id: id!, data }))}
        />
      )
      case 5: return (
        <Section5Levies
          data={section5}
          onChange={data => dispatch(updateSection5({ id: id!, data }))}
          registeredArea={section1.registeredArea}
          existingGrossSqm={existingGrossSqm}
          existingUnits={section1.existingUnits}
          residentialGross={s2ResidentialGross}
          commercialGross={s2CommercialGross}
          basementSqm={0}
          balconyTotalSqm={balconyTotalSqm}
          densityUnits={section2.densityUnits}
        />
      )
      case 6: return (
        <Section6BettermentLevy
          data={section6}
          onChange={data => dispatch(updateSection6({ id: id!, data }))}
          existingResidentialArea={existingResidentialSqm}
          existingUnits={section1.existingUnits}
          existingCommercialArea={existingCommercialSqm}
          newPrimaryResidentialArea={section2.residentialMainArea}
          newResidentialUnits={section2.densityUnits}
          newPrimaryCommercialArea={section2.commercialMainArea}
          yad2PricePerSqm={section4.secondaryApartments.selectedPricePerSqm}
        />
      )
      case 7: return (
        <Section7InventoryValue
          data={section7}
          onChange={data => dispatch(updateSection7({ id: id!, data }))}
          developerUnits={developerUnits}
          developerFloorplateSqm={developerFloorplateSqm}
          developerCommercialSqm={developerCommercialSqm}
          residentialPricePerSqm={s4ResidentialPrice}
          commercialPricePerSqm={s4CommercialPrice}
        />
      )
      case 9: return (
        <Section9Summary
          existingUnits={section1.existingUnits}
          newTotalUnits={s9TotalNewUnits}
          totalFloorAreaProject={s9TotalFloorAreaProject}
          compensationPerUnit={s9CompensationPerUnit}
          developerUnitsForSale={developerUnits}
          developerFloorAreaForSale={developerFloorplateSqm}
          totalDeveloperRevenue={s9TotalDeveloperRevenue}
          totalConstructionCosts={0}
        />
      )
      default: return <ComingSoon label={sectionLabel} />
    }
  }

  return (
    <Layout sidebar={(close) => (
      <SectionNav current={currentSection} onChange={n => { setCurrentSection(n); close() }} />
    )}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">דוח #{id}</p>
          <h1 className="text-xl font-bold text-slate-800">{sectionLabel}</h1>
        </div>

        {renderSection()}
      </div>
    </Layout>
  )
}
