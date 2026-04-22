import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { loadReport, saveReport } from '@/store/reportData/reportDataActions'
import type { ReportSections, SaveStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout/Layout'
import SectionNav from '@/components/layout/SectionNav'
import Section1ExistingState from '@/components/sections/Section1ExistingState'
import Section2PlanningRights from '@/components/sections/Section2PlanningRights'
import Section4MarketSurvey from '@/components/sections/Section4MarketSurvey'
import Section5Levies, { computeTotalLeviesAndFees } from '@/components/sections/Section5Levies'
import Section3Mix from '@/components/sections/Section3Mix'
import Section6BettermentLevy, { computeEstimatedBettermentLevy } from '@/components/sections/Section6BettermentLevy'
import Section7InventoryValue from '@/components/sections/Section7InventoryValue'
import Section8EconomicAnalysis, { computeSection8 } from '@/components/sections/Section8EconomicAnalysis'
import Section9Summary from '@/components/sections/Section9Summary'
import { SECTIONS, type SectionNumber } from '@/constants/sections'
import BackButton from '@/components/shared/BackButton'
import ReportSkeleton from '@/components/shared/ReportSkeleton'

// ─── Placeholder for unimplemented sections ───────────────────────────────────

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm">
      {label} — בבנייה
    </div>
  )
}

// ─── Save button label/style maps ─────────────────────────────────────────────

const saveLabels: Record<SaveStatus, string> = {
  idle: 'שמור דוח',
  saving: 'שומר...',
  saved: 'נשמר ✓',
  error: 'שגיאה — נסה שוב',
}

const saveExtraClass: Record<SaveStatus, string> = {
  idle: '',
  saving: '',
  saved: 'text-green-600 border-green-300',
  error: 'text-red-500 border-red-300',
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Report() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const [currentSection, setCurrentSection] = useState<SectionNumber>(1)
  const [sections, setSections] = useState<ReportSections | null>(null)

  const currentReportId = useAppSelector(s => s.reportData?.currentReportId)
  const loadStatus = useAppSelector(s => s.reportData?.loadStatus ?? 'idle')
  const saveStatus = useAppSelector(s => s.reportData?.saveStatus ?? 'idle') as SaveStatus
  const cachedSections = useAppSelector(s => s.reportData?.sections)
  const cachedSection4 = useAppSelector(s => s.reportData?.sections?.section4 ?? null)
  const project = useAppSelector(s => s.reportData?.project ?? null)

  // Reset local sections when navigating to a different report
  useEffect(() => {
    setSections(null)
  }, [id])

  // Fetch from backend — skip if already loading or already have this report
  useEffect(() => {
    if (!id) return
    if (loadStatus === 'loading') return
    if (currentReportId === id && loadStatus !== 'error') return
    dispatch(loadReport(id))
  }, [id, currentReportId, loadStatus, dispatch])

  // Seed local state on initial load (when sections is null)
  useEffect(() => {
    if (cachedSections && currentReportId === id && sections === null) {
      setSections(cachedSections)
    }
  }, [cachedSections, currentReportId, id, sections])

  // Sync section4 from store when deals are fetched
  useEffect(() => {
    if (cachedSection4) {
      setSections(prev => prev ? { ...prev, section4: cachedSection4 } : prev)
    }
  }, [cachedSection4])

  const sectionLabel = SECTIONS.find(s => s.number === currentSection)?.label ?? ''

  const skeletonLayout = (content: React.ReactNode) => (
    <Layout sidebar={(close) => (
      <SectionNav current={currentSection} onChange={n => { setCurrentSection(n); close() }} />
    )}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex items-start gap-3">
          <BackButton />
          <div>
            <div className="h-3 bg-slate-200 rounded w-20 mb-1 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded w-36 animate-pulse" />
          </div>
        </div>
        {content}
      </div>
    </Layout>
  )

  if (loadStatus === 'loading' || (loadStatus === 'idle' && !sections)) {
    return skeletonLayout(<ReportSkeleton />)
  }

  if (loadStatus === 'error') {
    return skeletonLayout(
      <div className="flex items-center justify-center h-48 rounded-xl border-2 border-dashed border-red-200 text-red-400 text-sm">
        שגיאה בטעינת הדוח
      </div>
    )
  }

  if (!sections) {
    return skeletonLayout(<ReportSkeleton />)
  }

  const { section1, section2, section3, section4, section5, section6, section7 } = sections
  const section8 = sections.section8

  // Section 2 derived
  const s2ResidentialGross = section2.residentialMainArea + section2.residentialServiceArea
  const s2CommercialGross  = section2.commercialMainArea  + section2.commercialServiceArea

  // Vacant land — no existing units or buildings
  const developerFloorplateSqm = section2.residentialMainArea + section2.densityUnits * section2.mamadSqm
  const developerUnits         = section2.densityUnits
  const developerCommercialSqm = s2CommercialGross

  const s4ResidentialPrice =
    section4.newApartments.selectedPricePerSqm > 0
      ? section4.newApartments.selectedPricePerSqm
      : section4.secondaryApartments.selectedPricePerSqm
  const s4CommercialPrice  =
    s4ResidentialPrice * (section4.commercial.commercialPctOfResidential / 100)

  // Section 9 inputs — derived from sections 2, 3, and 7
  const s9TotalNewUnits          = section2.densityUnits
  const s9TotalFloorAreaProject  = developerFloorplateSqm
  const s9CompensationPerUnit    = 0
  const s9VatFactor              = 1 + section7.vatPct / 100
  const s9ResRevenueK            = Math.round(developerFloorplateSqm * s4ResidentialPrice / 1000)
  const s9CommRevenueK           = Math.round(developerCommercialSqm * s4CommercialPrice  / 1000)
  const s9TotalDeveloperRevenue  = Math.round(s9ResRevenueK / s9VatFactor) + s9CommRevenueK

  // Section 8 inputs — derived from sections 2, 5, 6, 7
  const s8TotalGrossResidential  = s2ResidentialGross
  const s8TotalGrossCommercial   = section2.commercialMainArea + section2.commercialServiceArea
  const s8TotalOpenBalconies     = 0
  const s8TotalRoofBalconies     = 0
  const s8TotalUnderground       = section2.undergroundSqm
  const s8TotalLeviesAndFees     = computeTotalLeviesAndFees(
    section5,
    section1.registeredArea,
    s2ResidentialGross,
    s2CommercialGross,
    0,
  )
  const s8EstimatedBettermentLevy = computeEstimatedBettermentLevy(
    section6,
    section2.residentialMainArea,
    section2.commercialMainArea,
  )
  const s8VatFactor              = 1 + section7.vatPct / 100
  const s8TotalRevenueIncVat     = developerFloorplateSqm * s4ResidentialPrice + developerCommercialSqm * s4CommercialPrice
  const s8TotalRevenueExVat      = (developerFloorplateSqm * s4ResidentialPrice) / s8VatFactor + developerCommercialSqm * s4CommercialPrice
  const s8DeveloperRevenueExVat  = s8TotalRevenueExVat

  const s8Computed = computeSection8(section8, {
    totalGrossResidentialArea: s8TotalGrossResidential,
    totalGrossCommercialArea:  s8TotalGrossCommercial,
    totalOpenBalconies:        s8TotalOpenBalconies,
    totalRoofBalconies:        s8TotalRoofBalconies,
    totalUndergroundArea:      s8TotalUnderground,
    newTotalUnits:             section2.densityUnits,
    totalLeviesAndFees:        s8TotalLeviesAndFees,
    estimatedBettermentLevy:   s8EstimatedBettermentLevy,
    totalRevenueIncVat:        s8TotalRevenueIncVat,
    totalRevenueExVat:         s8TotalRevenueExVat,
    developerRevenueExVat:     s8DeveloperRevenueExVat,
  })

  function renderSection() {
    switch (currentSection) {
      case 1: return (
        <Section1ExistingState
          data={section1}
          onChange={data => setSections(prev => ({ ...prev!, section1: data }))}
          gush={project?.gush ?? ''}
          helka={project?.helka ?? ''}
        />
      )
      case 2: return (
        <Section2PlanningRights
          data={section2}
          onChange={data => setSections(prev => ({ ...prev!, section2: data }))}
          registeredArea={section1.registeredArea}
        />
      )
      case 3: return (
        <Section3Mix
          data={section3}
          onChange={data => setSections(prev => ({ ...prev!, section3: data }))}
          pricePerSqm={s4ResidentialPrice}
          constructionCostAbove={section8.t1ResidentialRate}
          constructionCostBelow={section8.t1UndergroundRate}
          totalMainArea={section2.residentialMainArea}
          totalUnits={section2.densityUnits}
          totalUndergroundArea={section2.undergroundSqm}
          onPricePerSqmChange={v => setSections(prev => ({
            ...prev!,
            section4: { ...prev!.section4, newApartments: { ...prev!.section4.newApartments, selectedPricePerSqm: v } },
          }))}
          onConstructionCostAboveChange={v => setSections(prev => ({
            ...prev!,
            section8: { ...prev!.section8, t1ResidentialRate: v },
          }))}
          onConstructionCostBelowChange={v => setSections(prev => ({
            ...prev!,
            section8: { ...prev!.section8, t1UndergroundRate: v },
          }))}
        />
      )
      case 4: return (
        <Section4MarketSurvey
          data={section4}
          onChange={data => setSections(prev => ({ ...prev!, section4: data }))}
          gush={project?.gush ?? ''}
          helka={project?.helka ?? ''}
        />
      )
      case 5: return (
        <Section5Levies
          data={section5}
          onChange={data => setSections(prev => ({ ...prev!, section5: data }))}
          registeredArea={section1.registeredArea}
          residentialGross={s2ResidentialGross}
          commercialGross={s2CommercialGross}
          basementSqm={0}
          densityUnits={section2.densityUnits}
        />
      )
      case 6: return (
        <Section6BettermentLevy
          data={section6}
          onChange={data => setSections(prev => ({ ...prev!, section6: data }))}
          newPrimaryResidentialArea={section2.residentialMainArea}
          newResidentialUnits={section2.densityUnits}
          newPrimaryCommercialArea={section2.commercialMainArea}
        />
      )
      case 7: return (
        <Section7InventoryValue
          data={section7}
          onChange={data => setSections(prev => ({ ...prev!, section7: data }))}
          developerUnits={developerUnits}
          developerFloorplateSqm={developerFloorplateSqm}
          developerCommercialSqm={developerCommercialSqm}
          residentialPricePerSqm={s4ResidentialPrice}
          commercialPricePerSqm={s4CommercialPrice}
        />
      )
      case 8: return (
        <Section8EconomicAnalysis
          data={section8}
          onChange={data => setSections(prev => ({ ...prev!, section8: data }))}
          totalGrossResidentialArea={s8TotalGrossResidential}
          totalGrossCommercialArea={s8TotalGrossCommercial}
          totalOpenBalconies={s8TotalOpenBalconies}
          totalRoofBalconies={s8TotalRoofBalconies}
          totalUndergroundArea={s8TotalUnderground}
          newTotalUnits={section2.densityUnits}
          developerUnitsForSale={developerUnits}
          totalLeviesAndFees={s8TotalLeviesAndFees}
          estimatedBettermentLevy={s8EstimatedBettermentLevy}
          totalRevenueIncVat={s8TotalRevenueIncVat}
          totalRevenueExVat={s8TotalRevenueExVat}
          developerRevenueExVat={s8DeveloperRevenueExVat}
        />
      )
      case 9: return (
        <Section9Summary
          newTotalUnits={s9TotalNewUnits}
          totalFloorAreaProject={s9TotalFloorAreaProject}
          compensationPerUnit={s9CompensationPerUnit}
          developerUnitsForSale={developerUnits}
          developerFloorAreaForSale={developerFloorplateSqm}
          totalDeveloperRevenue={s9TotalDeveloperRevenue}
          totalConstructionCosts={s8Computed.totalConstructionCosts}
        />
      )
      default: return <ComingSoon label={sectionLabel} />
    }
  }

  const isDemo = id === 'demo-1'

  return (
    <Layout sidebar={(close) => (
      <SectionNav current={currentSection} onChange={n => { setCurrentSection(n); close() }} />
    )}>
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <BackButton />
            <div>
              <p className="text-xs text-slate-400 mb-0.5">דוח #{id}</p>
              <h1 className="text-xl font-bold text-slate-800">{sectionLabel}</h1>
            </div>
          </div>
          {!isDemo && (
            <Button
              variant="outline"
              size="sm"
              className={saveExtraClass[saveStatus]}
              disabled={saveStatus === 'saving'}
              onClick={() => dispatch(saveReport({ id: id!, sections }))}
            >
              {saveLabels[saveStatus]}
            </Button>
          )}
        </div>

        {renderSection()}
      </div>
    </Layout>
  )
}
