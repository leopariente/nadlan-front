import { createSlice } from '@reduxjs/toolkit'
import type { ReportDataState } from './types'
import { createReport, fetchDeals, loadReport, saveReport } from './reportDataActions'
import {
  MOCK_ID,
  MOCK_PROJECT,
  MOCK_SECTION1,
  MOCK_SECTION2,
  MOCK_SECTION3,
  MOCK_SECTION4,
  MOCK_SECTION5,
  MOCK_SECTION6,
  MOCK_SECTION7,
} from '@/mocks/mockProject'

const initialState: ReportDataState = {
  currentReportId: MOCK_ID,
  project: MOCK_PROJECT,
  sections: {
    section1: MOCK_SECTION1,
    section2: MOCK_SECTION2,
    section3: MOCK_SECTION3,
    section4: MOCK_SECTION4,
    section5: MOCK_SECTION5,
    section6: MOCK_SECTION6,
    section7: MOCK_SECTION7,
  },
  loadStatus: 'loaded',
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
        state.sections = action.payload.sections
        state.loadStatus = 'loaded'
      })
      .addCase(loadReport.rejected, (state) => {
        state.loadStatus = 'error'
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.currentReportId = action.payload.project.id
        state.project = action.payload.project
        state.sections = action.payload.sections
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
