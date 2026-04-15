import { createSlice } from '@reduxjs/toolkit'
import type { ReportDataState } from './types'
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
        state.sections = {
          ...action.payload.sections,
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
        state.sections = {
          ...action.payload.sections,
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
        if (tab === 'new') {
          state.sections.section4.newApartments.transactions = action.payload
        } else {
          state.sections.section4.secondaryApartments.transactions = action.payload
        }
      })
      .addCase(fetchDeals.rejected, (state) => {
        state.fetchDealsStatus = 'error'
      })
  },
})

export default reportDataSlice.reducer
