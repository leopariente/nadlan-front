import { createSlice } from '@reduxjs/toolkit'
import type { ReportDataState } from './types'
import type { Section2Data, Section3Data, UnitType } from '@/types'
import { createReport, fetchDeals, loadReport, saveReport } from './reportDataActions'
import { DEFAULT_SECTION8 } from '@/components/sections/Section8EconomicAnalysis/types'

const initialState: ReportDataState = {
  currentReportId: null,
  project: null,
  sections: null,
  loadStatus: 'idle',
  saveStatus: 'idle',
  fetchDealsStatus: 'idle',
}

const reportDataSlice = createSlice({
  name: 'reportData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadReport.pending, (state) => {
        state.loadStatus = 'loading'
        state.sections = null
      })
      .addCase(loadReport.fulfilled, (state, action) => {
        state.currentReportId = action.payload.project.id
        state.project = action.payload.project
        const rawS2 = action.payload.sections.section2 as unknown as { undergroundSqm?: number } & Section2Data
        const section2: Section2Data = { ...rawS2, undergroundSqm: rawS2.undergroundSqm ?? 0 }
        const raw3 = action.payload.sections.section3 as unknown as Record<string, unknown>
        const section3: Section3Data = {
          units: Array.isArray(raw3.units) ? raw3.units as UnitType[] : [],
        }
        state.sections = {
          ...action.payload.sections,
          section2,
          section3,
          section8: action.payload.sections.section8 ?? DEFAULT_SECTION8,
        }
        state.loadStatus = 'loaded'
      })
      .addCase(loadReport.rejected, (state) => {
        state.loadStatus = 'error'
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.currentReportId = action.payload.project.id
        state.project = action.payload.project
        const rawS2 = action.payload.sections.section2 as unknown as { undergroundSqm?: number } & Section2Data
        const section2: Section2Data = { ...rawS2, undergroundSqm: rawS2.undergroundSqm ?? 0 }
        const raw3 = action.payload.sections.section3 as unknown as Record<string, unknown>
        const section3: Section3Data = {
          units: Array.isArray(raw3.units) ? raw3.units as UnitType[] : [],
        }
        state.sections = {
          ...action.payload.sections,
          section2,
          section3,
          section8: action.payload.sections.section8 ?? DEFAULT_SECTION8,
        }
        state.loadStatus = 'loaded'
        state.saveStatus = 'idle'
      })
      .addCase(saveReport.pending, (state) => {
        state.saveStatus = 'saving'
      })
      .addCase(saveReport.fulfilled, (state) => {
        state.saveStatus = 'saved'
      })
      .addCase(saveReport.rejected, (state) => {
        state.saveStatus = 'error'
      })
      .addCase(fetchDeals.pending, (state) => {
        state.fetchDealsStatus = 'loading'
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.fetchDealsStatus = 'idle'
        if (!state.sections) return
        const { tab } = action.meta.arg
        const rows = action.payload
        const valid = rows.filter(t => t.netAreaSqm > 0 && t.reportedPriceILS > 0)
        const totalArea  = valid.reduce((s, t) => s + t.netAreaSqm, 0)
        const totalPrice = valid.reduce((s, t) => s + t.reportedPriceILS, 0)
        const avg = totalArea > 0 ? Math.round(totalPrice / totalArea) : 0
        if (tab === 'new') {
          state.sections.section4.newApartments.transactions = rows
          if (state.sections.section4.newApartments.selectedPricePerSqm === 0 && avg > 0)
            state.sections.section4.newApartments.selectedPricePerSqm = avg
        } else {
          state.sections.section4.secondaryApartments.transactions = rows
          if (state.sections.section4.secondaryApartments.selectedPricePerSqm === 0 && avg > 0)
            state.sections.section4.secondaryApartments.selectedPricePerSqm = avg
        }
      })
      .addCase(fetchDeals.rejected, (state) => {
        state.fetchDealsStatus = 'error'
      })
  },
})

export default reportDataSlice.reducer
