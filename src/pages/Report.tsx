import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import SectionNav from '@/components/layout/SectionNav'
import Section1ExistingState from '@/components/sections/Section1ExistingState'
import Section2PlanningRights from '@/components/sections/Section2PlanningRights'
import Section4MarketSurvey from '@/components/sections/Section4MarketSurvey'
import Section5Levies from '@/components/sections/Section5Levies'
import Section3Program from '@/components/sections/Section3Program'
import Section7InventoryValue from '@/components/sections/Section7InventoryValue'
import type { Section1Data, Section2Data, Section3Data, Section4Data, Section5Data, Section7Data } from '@/types'
import { SECTIONS, type SectionNumber } from '@/constants/sections'

// ─── Empty initial states ─────────────────────────────────────────────────────

const EMPTY_SECTION1: Section1Data = {
  gush: '',
  helka: '',
  address: '',
  registeredArea: 0,
  ownershipShare: '',
  existingUnits: 0,
  floors: [],
}

const EMPTY_SECTION2: Section2Data = {
  planType: 'detailed',

  residentialMainArea: 0,
  residentialServiceArea: 0,
  commercialMainArea: 0,
  commercialServiceArea: 0,
  densityUnits: 0,
  mamadSqm: 12,
  tenantBonusSqmPerUnit: 6,
  commercialTenantBonusPct: 25,

  generalPlan: {
    coveragePct: 50,
    floors: 9,
    floorplatePct: 75,
    avgUnitSqm: 100,
    parkingPerUnit: 1.5,
    parkingSqm: 45,
    basementCoveragePct: 85,
  },
}

const EMPTY_UNDERGROUND_ROW = { parkingPerUnit: 0, parkingAboveGround: 0, parkingUnderground: 0, avgParkingSqm: 45 }
const EMPTY_UNDERGROUND_SPECIAL = { additionalSqm: 0, parkingSpots: 0, avgParkingSqm: 45 }

const EMPTY_SECTION3: Section3Data = {
  tenantRow: { mainAreaPerUnit: 0, mamadPerUnit: 12, sharedAreaPerUnit: 8, openBalconyPerUnit: 12, roofBalconySqm: 0 },
  developerRow: { mainAreaPerUnit: 0, mamadPerUnit: 12, sharedAreaPerUnit: 8, openBalconyPerUnit: 12, roofBalconySqm: 0 },
  commercial: { sqm: 0 },
  publicBuildings: { sqm: 0 },
  underground: {
    tenantRow: EMPTY_UNDERGROUND_ROW,
    developerRow: EMPTY_UNDERGROUND_ROW,
    commercial: EMPTY_UNDERGROUND_SPECIAL,
    disabled: EMPTY_UNDERGROUND_SPECIAL,
    publicBuildings: EMPTY_UNDERGROUND_SPECIAL,
  },
}

const EMPTY_SECTION5: Section5Data = {
  useFlatRate: false,
  rates: {
    constructionPermit: 37.65,
    roadLand:           82.51,
    roadBuilding:      118.28,
    sidewalkLand:       67.51,
    sidewalkBuilding:   96.77,
    drainageLand:       32.08,
    drainageBuilding:   57.53,
    waterAuthority:     94.19,
    safetyBuffer:        6,
  },
}

const EMPTY_SECTION7: Section7Data = {
  vatPct: 18,
}

const EMPTY_SECTION4: Section4Data = {
  newApartments:       { transactions: [], selectedPricePerSqm: 0 },
  secondaryApartments: { transactions: [], selectedPricePerSqm: 0 },
  commercial:          { commercialPctOfResidential: 85 },
}

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
  const [currentSection, setCurrentSection] = useState<SectionNumber>(1)
  const [section1, setSection1] = useState<Section1Data>(EMPTY_SECTION1)
  const [section2, setSection2] = useState<Section2Data>(EMPTY_SECTION2)
  const [section3, setSection3] = useState<Section3Data>(EMPTY_SECTION3)
  const [section4, setSection4] = useState<Section4Data>(EMPTY_SECTION4)
  const [section5, setSection5] = useState<Section5Data>(EMPTY_SECTION5)
  const [section7, setSection7] = useState<Section7Data>(EMPTY_SECTION7)

  const sectionLabel = SECTIONS.find(s => s.number === currentSection)?.label ?? ''

  // Cross-section values derived from Section 1
  const existingResidentialSqm = section1.floors
    .filter(f => f.use === 'מגורים')
    .reduce((sum, f) => sum + f.floorArea, 0)

  const existingCommercialSqm = section1.floors
    .filter(f => f.use === 'מסחר')
    .reduce((sum, f) => sum + f.floorArea, 0)

  // Section 1 total gross (floor + balcony for all floors)
  const existingGrossSqm = section1.floors
    .reduce((sum, f) => sum + f.floorArea + f.balconyArea, 0)

  const balconyTotalSqm = section1.floors
    .reduce((sum, f) => sum + f.balconyArea, 0)

  // Section 2 derived (detailed plan values; general plan would override these in future)
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

  function renderSection() {
    switch (currentSection) {
      case 1: return <Section1ExistingState data={section1} onChange={setSection1} />
      case 2: return (
        <Section2PlanningRights
          data={section2}
          onChange={setSection2}
          registeredArea={section1.registeredArea}
          existingResidentialSqm={existingResidentialSqm}
          existingUnits={section1.existingUnits}
          existingCommercialSqm={existingCommercialSqm}
        />
      )
      case 3: return (
        <Section3Program
          data={section3}
          onChange={setSection3}
          developerUnits={developerUnits}
          developerFloorplateSqm={developerFloorplateSqm}
          tenantUnits={section1.existingUnits}
          tenantFloorplateSqm={existingWithBonus / (section1.existingUnits || 1)}
          residentialGross={s2ResidentialGross}
          commercialMainArea={section2.commercialMainArea}
          commercialServiceArea={section2.commercialServiceArea}
        />
      )
      case 4: return <Section4MarketSurvey data={section4} onChange={setSection4} />
      case 5: return (
        <Section5Levies
          data={section5}
          onChange={setSection5}
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
      case 7: return (
        <Section7InventoryValue
          data={section7}
          onChange={setSection7}
          developerUnits={developerUnits}
          developerFloorplateSqm={developerFloorplateSqm}
          developerCommercialSqm={developerCommercialSqm}
          residentialPricePerSqm={s4ResidentialPrice}
          commercialPricePerSqm={s4CommercialPrice}
        />
      )
      default: return <ComingSoon label={sectionLabel} />
    }
  }

  return (
    <Layout sidebar={<SectionNav current={currentSection} onChange={setCurrentSection} />}>
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
