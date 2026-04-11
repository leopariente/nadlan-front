import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  Section1Data,
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
} from '@/types'
import type { ReportDataState, ReportSections } from './types'
import { createEmptyReportSections } from './defaultSections'
import {
  MOCK_ID,
  MOCK_SECTION1,
  MOCK_SECTION2,
  MOCK_SECTION3,
  MOCK_SECTION4,
  MOCK_SECTION5,
  MOCK_SECTION6,
  MOCK_SECTION7,
} from '@/mocks/mockProject'

const initialState: ReportDataState = {
  reports: {
    [MOCK_ID]: {
      section1: MOCK_SECTION1,
      section2: MOCK_SECTION2,
      section3: MOCK_SECTION3,
      section4: MOCK_SECTION4,
      section5: MOCK_SECTION5,
      section6: MOCK_SECTION6,
      section7: MOCK_SECTION7,
    },
  },
}

const reportDataSlice = createSlice({
  name: 'reportData',
  initialState,
  reducers: {
    initReport(state, action: PayloadAction<{ id: string; gush?: string; helka?: string; sections?: ReportSections }>) {
      const { id, sections, gush, helka } = action.payload
      if (!state.reports[id]) {
        const data = sections ?? createEmptyReportSections()
        if (gush !== undefined) data.section1.gush = gush
        if (helka !== undefined) data.section1.helka = helka
        state.reports[id] = data
      }
    },
    updateSection1(state, action: PayloadAction<{ id: string; data: Section1Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section1 = action.payload.data
      }
    },
    updateSection2(state, action: PayloadAction<{ id: string; data: Section2Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section2 = action.payload.data
      }
    },
    updateSection3(state, action: PayloadAction<{ id: string; data: Section3Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section3 = action.payload.data
      }
    },
    updateSection4(state, action: PayloadAction<{ id: string; data: Section4Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section4 = action.payload.data
      }
    },
    updateSection5(state, action: PayloadAction<{ id: string; data: Section5Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section5 = action.payload.data
      }
    },
    updateSection6(state, action: PayloadAction<{ id: string; data: Section6Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section6 = action.payload.data
      }
    },
    updateSection7(state, action: PayloadAction<{ id: string; data: Section7Data }>) {
      if (state.reports[action.payload.id]) {
        state.reports[action.payload.id].section7 = action.payload.data
      }
    },
  },
})

export const {
  initReport,
  updateSection1,
  updateSection2,
  updateSection3,
  updateSection4,
  updateSection5,
  updateSection6,
  updateSection7,
} = reportDataSlice.actions

export default reportDataSlice.reducer
