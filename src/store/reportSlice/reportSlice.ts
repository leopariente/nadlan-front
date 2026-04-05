import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Report } from '@/types/report'
import { loadReport, saveReport } from './reportActions'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'

interface ReportState {
  report: Report | null
  currentStep: number
  saveStatus: SaveStatus
  loadStatus: LoadStatus
}

const initialState: ReportState = {
  report: null,
  currentStep: 1,
  saveStatus: 'idle',
  loadStatus: 'idle',
}

// PayloadAction type for updateStep — key + value pair
export interface UpdateStepPayload {
  key: keyof Report
  value: Report[keyof Report]
}

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReport(state, action: PayloadAction<Report>) {
      state.report = action.payload
    },

    // RTK uses immer internally — direct mutation is safe here
    updateStep(state, action: PayloadAction<UpdateStepPayload>) {
      if (!state.report) return
      const { key, value } = action.payload
      // Safe cast: we know key is a valid key of Report
      ;(state.report as Record<string, unknown>)[key as string] = value
      state.report.updatedAt = new Date().toISOString()
    },

    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload
    },

    setSaveStatus(state, action: PayloadAction<SaveStatus>) {
      state.saveStatus = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadReport.pending, (state) => {
        state.loadStatus = 'loading'
      })
      .addCase(loadReport.fulfilled, (state, action) => {
        state.report = action.payload
        state.loadStatus = 'loaded'
      })
      .addCase(loadReport.rejected, (state) => {
        state.loadStatus = 'error'
      })
      .addCase(saveReport.pending, (state) => {
        state.saveStatus = 'saving'
      })
      .addCase(saveReport.fulfilled, (state, action) => {
        state.report = action.payload
        state.saveStatus = 'saved'
      })
      .addCase(saveReport.rejected, (state) => {
        state.saveStatus = 'error'
      })
  },
})

export const { setReport, updateStep, setCurrentStep, setSaveStatus } = reportSlice.actions
export default reportSlice.reducer
