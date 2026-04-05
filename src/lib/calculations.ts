import type { Report, Step9Summary, MarketTransaction } from '@/types/report'

// ─── Step 1 ───────────────────────────────────────────────────────────────────

export function calcTotalResidentialBuiltArea(r: Report): number {
  return r.step1.floorPermits
    .filter(f => !f.isCommercial && !f.isBasement)
    .reduce((sum, f) => sum + f.floorAreaSqm, 0)
}

export function calcTotalCommercialBuiltArea(r: Report): number {
  return r.step1.floorPermits
    .filter(f => f.isCommercial)
    .reduce((sum, f) => sum + f.floorAreaSqm, 0)
}

export function calcTotalGrossBuiltArea(r: Report): number {
  return r.step1.floorPermits.reduce(
    (sum, f) => sum + f.floorAreaSqm + f.balconyAreaSqm,
    0
  )
}

export function calcExistingUnits(r: Report): number {
  const detail = r.step1.propertyDetails[0]
  return detail ? detail.existingUnits : 0
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

export function calcResidentialZoning(r: Report) {
  return r.step2.zoningRights.find(z => z.designation === 'מגורים') ?? null
}

export function calcCommercialZoning(r: Report) {
  return r.step2.zoningRights.find(z => z.designation === 'מסחר') ?? null
}

export function calcNewTotalResidentialRightsSqm(r: Report): number {
  const z = calcResidentialZoning(r)
  return z ? z.mainBuildingRightsSqm + z.serviceBuildingRightsSqm : 0
}

export function calcNewTotalCommercialRightsSqm(r: Report): number {
  const z = calcCommercialZoning(r)
  return z ? z.mainBuildingRightsSqm + z.serviceBuildingRightsSqm : 0
}

export function calcNewTotalUnits(r: Report): number {
  const z = calcResidentialZoning(r)
  if (!z || z.plotSizeSqm === 0) return 0
  // Density = units per dunam (1000 m²)
  return Math.floor((z.density / 1000) * z.plotSizeSqm)
}

/** שטח פלדלת = Main area × 0.75 (simplified formula) */
export function calcPladeletPerUnit(r: Report): number {
  const z = calcResidentialZoning(r)
  const totalUnits = calcNewTotalUnits(r)
  if (!z || totalUnits === 0) return 0
  return (z.mainBuildingRightsSqm * 0.75) / totalUnits
}

export function calcTotalPladeletProject(r: Report): number {
  const z = calcResidentialZoning(r)
  if (!z) return 0
  return z.mainBuildingRightsSqm * 0.75
}

export function calcTenantCompensationUnits(r: Report): number {
  return calcExistingUnits(r)
}

export function calcDeveloperMarketingUnits(r: Report): number {
  return calcNewTotalUnits(r) - calcTenantCompensationUnits(r)
}

export function calcTenantCompensationArea(r: Report): number {
  return calcTotalResidentialBuiltArea(r)
}

export function calcDeveloperMarketingArea(r: Report): number {
  return calcTotalPladeletProject(r) - calcTenantCompensationArea(r)
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

/** Total gross above-ground residential sqm for levy calculation */
export function calcStep3AboveGroundResidentialSqm(r: Report): number {
  return r.step3.aboveGround
    .filter(row => !row.isSubtotal)
    .reduce((sum, row) => {
      const pladelet = row.mainAreaPerUnit + row.safeRoomArea
      const shared = pladelet * (row.sharedAreaPct / 100)
      const grossPerUnit = pladelet + shared
      return sum + grossPerUnit * row.unitCount
    }, 0)
}

export function calcStep3TotalBalconies(r: Report): number {
  return r.step3.aboveGround
    .filter(row => !row.isSubtotal)
    .reduce((sum, row) => sum + row.balconyArea * row.unitCount, 0)
}

export function calcStep3UndergroundSqm(r: Report): number {
  return r.step3.underground.reduce((sum, row) => {
    const totalSpaces = row.parkingSpacesAboveGround + row.parkingSpacesUnderground
    return sum + totalSpaces * row.avgParkingSpaceSqm
  }, 0)
}

export function calcStep3Areas(r: Report) {
  return {
    plotSqm: r.step1.propertyDetails[0]?.registeredAreaSqm ?? 0,
    residentialAboveGroundSqm: calcStep3AboveGroundResidentialSqm(r),
    commercialSqm: calcTotalCommercialBuiltArea(r),
    undergroundSqm: calcStep3UndergroundSqm(r),
    balconiesSqm: calcStep3TotalBalconies(r),
    unitCount: calcNewTotalUnits(r),
    existingAreaToDeduct: calcTotalGrossBuiltArea(r) * 0.8,
  }
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

export function calcPricePerSqm(t: MarketTransaction): number {
  if (t.sizeSqm === 0) return 0
  return Math.round(t.totalPriceILS / t.sizeSqm)
}

export function calcAveragePricePerSqm(r: Report): number {
  if (r.step4.basePricePerSqmOverride !== null) return r.step4.basePricePerSqmOverride
  const txs = r.step4.transactions
  if (txs.length === 0) return 0
  const sum = txs.reduce((acc, t) => acc + calcPricePerSqm(t), 0)
  return Math.round(sum / txs.length)
}

export function calcTransactionsByRooms(r: Report): Map<number, MarketTransaction[]> {
  const map = new Map<number, MarketTransaction[]>()
  for (const tx of r.step4.transactions) {
    const existing = map.get(tx.rooms) ?? []
    existing.push(tx)
    map.set(tx.rooms, existing)
  }
  return map
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────

export function calcLevyRowTotal(ratePerSqm: number, areaSqm: number): number {
  return ratePerSqm * areaSqm
}

export function calcLeviesSubtotal(r: Report): number {
  return r.step5.levies.reduce((sum, row) => sum + calcLevyRowTotal(row.ratePerSqm, row.areaSqm), 0)
}

export function calcLeviesTotal(r: Report): number {
  return calcLeviesSubtotal(r) * 1.06
}

export function calcLeviesPerAboveGroundSqm(r: Report): number {
  const aboveGround = calcStep3AboveGroundResidentialSqm(r)
  if (aboveGround === 0) return 0
  return Math.round(calcLeviesTotal(r) / aboveGround)
}

// ─── Step 6 ───────────────────────────────────────────────────────────────────

export function calcExistingResidentialValue(r: Report): number {
  const b = r.step6.betterment
  return b.existingResidentialAreaSqm * b.existingResidentialValuePerSqm
}

export function calcExistingCommercialValue(r: Report): number {
  const b = r.step6.betterment
  return b.existingCommercialAreaSqm * b.existingCommercialValuePerSqm
}

export function calcTotalExistingValue(r: Report): number {
  return calcExistingResidentialValue(r) + calcExistingCommercialValue(r)
}

export function calcNewResidentialValue(r: Report): number {
  const b = r.step6.betterment
  return b.newResidentialAreaSqm * b.newResidentialValuePerSqm
}

export function calcNewCommercialValue(r: Report): number {
  const b = r.step6.betterment
  return b.newCommercialAreaSqm * b.newCommercialValuePerSqm
}

export function calcTotalNewValueGross(r: Report): number {
  return calcNewResidentialValue(r) + calcNewCommercialValue(r)
}

export function calcDeferralMultiplier(r: Report): number {
  const b = r.step6.betterment
  if (b.deferralYears === 0) return 1
  const rate = b.deferralRatePct / 100
  return 1 / Math.pow(1 + rate, b.deferralYears)
}

export function calcTotalNewValueDeferred(r: Report): number {
  return (calcTotalNewValueGross(r) - r.step6.betterment.demolitionAndDeveloperObligations) *
    calcDeferralMultiplier(r)
}

export function calcBettermentIncrease(r: Report): number {
  return Math.max(0, calcTotalNewValueDeferred(r) - calcTotalExistingValue(r))
}

export function calcBettermentLevy(r: Report): number {
  return calcBettermentIncrease(r) * (r.step6.betterment.levyPct / 100)
}

// ─── Step 7 ───────────────────────────────────────────────────────────────────

export function calcInventoryRowTotal(unitCount: number, avgSizeSqm: number, pricePerSqmILS: number): number {
  return unitCount * avgSizeSqm * pricePerSqmILS
}

export function calcInventoryResidentialTotal(r: Report): number {
  return r.step7.inventoryRows
    .filter(row => !row.isCommercial)
    .reduce((sum, row) => sum + calcInventoryRowTotal(row.unitCount, row.avgSizeSqm, row.pricePerSqmILS), 0)
}

export function calcInventoryCommercialTotal(r: Report): number {
  return r.step7.inventoryRows
    .filter(row => row.isCommercial)
    .reduce((sum, row) => sum + calcInventoryRowTotal(row.unitCount, row.avgSizeSqm, row.pricePerSqmILS), 0)
}

export function calcInventoryTotalWithVAT(r: Report): number {
  return calcInventoryResidentialTotal(r) + calcInventoryCommercialTotal(r)
}

export function calcInventoryTotalWithoutVAT(r: Report): number {
  return calcInventoryTotalWithVAT(r) / 1.18
}

// ─── Step 8 ───────────────────────────────────────────────────────────────────

export function calcEconomicRowTotal(row: { rateValue: number; areaSqm: number; quantity: number; calcMode: string; refTotal: number | null }, sectionsTotalSoFar: number): number {
  switch (row.calcMode) {
    case 'rate_x_area': return row.rateValue * row.areaSqm
    case 'rate_x_qty':  return row.rateValue * row.quantity
    case 'fixed':       return row.rateValue
    case 'pct_of_total': return (row.rateValue / 100) * sectionsTotalSoFar
    case 'ref':         return row.refTotal ?? 0
    default:            return 0
  }
}

export function calcSectionTotal(r: Report, sectionIndex: number): number {
  const section = r.step8.sections[sectionIndex]
  if (!section) return 0

  // sections 1-4 total (for financing calculation)
  const s14Total = sectionIndex <= 3
    ? r.step8.sections.slice(0, sectionIndex).reduce((sum, s) => {
        return sum + s.rows.reduce((rowSum, row) => {
          return rowSum + calcEconomicRowTotal(row, 0)
        }, 0)
      }, 0)
    : calcSections1to4Total(r)

  return section.rows.reduce((sum, row) => {
    return sum + calcEconomicRowTotal(row, s14Total)
  }, 0)
}

export function calcSections1to4Total(r: Report): number {
  return [0, 1, 2, 3].reduce((sum, i) => {
    const section = r.step8.sections[i]
    if (!section) return sum
    return sum + section.rows.reduce((rowSum, row) => rowSum + calcEconomicRowTotal(row, 0), 0)
  }, 0)
}

export function calcFinancingCost(r: Report): number {
  const section = r.step8.sections[4]
  if (!section) return 0
  const s14 = calcSections1to4Total(r)
  return section.rows.reduce((sum, row) => sum + calcEconomicRowTotal(row, s14), 0)
}

export function calcTotalConstructionCosts(r: Report): number {
  return r.step8.sections.reduce((sum, _section, i) => sum + calcSectionTotal(r, i), 0)
}

// ─── Step 9 ───────────────────────────────────────────────────────────────────

export function calcStep9Summary(r: Report): Step9Summary {
  const existingUnits = calcExistingUnits(r)
  const newTotalUnits = calcNewTotalUnits(r)
  const developerMarketingUnits = calcDeveloperMarketingUnits(r)
  const totalPladeletProject = calcTotalPladeletProject(r)
  const developerMarketingArea = calcDeveloperMarketingArea(r)
  const compensationPerUnit = newTotalUnits > 0
    ? calcTenantCompensationArea(r) / existingUnits
    : 0

  const totalDeveloperRevenue = calcInventoryTotalWithoutVAT(r)
  const totalConstructionCosts = calcTotalConstructionCosts(r)
  const projectedSurplus = totalDeveloperRevenue - totalConstructionCosts
  const profitToCoastPct = totalConstructionCosts > 0
    ? (projectedSurplus / totalConstructionCosts) * 100
    : 0
  const profitToRevenuePct = totalDeveloperRevenue > 0
    ? (projectedSurplus / totalDeveloperRevenue) * 100
    : 0

  return {
    existingUnits,
    newTotalUnits,
    densificationFactor: existingUnits > 0 ? newTotalUnits / existingUnits : 0,
    developerMarketingUnits,
    totalPladeletProject,
    compensationPerUnit,
    developerMarketingArea,
    totalDeveloperRevenue,
    totalConstructionCosts,
    projectedSurplus,
    profitToCoastPct,
    profitToRevenuePct,
  }
}
