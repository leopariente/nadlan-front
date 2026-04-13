import { createSlice } from '@reduxjs/toolkit'
import type { ProjectSummary } from '@/types'
import { loadProjects } from './projectActions'
import { createReport, loadReport, saveReport } from '@/store/reportData/reportDataActions'
import { MOCK_PROJECT } from '@/mocks/mockProject'

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'

interface ProjectsState {
  projects: ProjectSummary[]
  loadStatus: LoadStatus
}

const initialState: ProjectsState = {
  projects: [MOCK_PROJECT],
  loadStatus: 'idle',
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.pending, (state) => {
        state.loadStatus = 'loading'
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.projects = action.payload
        state.loadStatus = 'loaded'
      })
      .addCase(loadProjects.rejected, (state) => {
        state.loadStatus = 'error'
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.projects.unshift(action.payload.project)
      })
      .addCase(loadReport.fulfilled, (state, action) => {
        const incoming = action.payload.project
        const idx = state.projects.findIndex(p => p.id === incoming.id)
        if (idx !== -1) {
          state.projects[idx] = incoming
        } else {
          state.projects.unshift(incoming)
        }
      })
      .addCase(saveReport.fulfilled, (state, action) => {
        const project = state.projects.find(p => p.id === action.payload.id)
        if (project) {
          project.updatedAt = action.payload.updatedAt
        }
      })
  },
})

export default projectsSlice.reducer
