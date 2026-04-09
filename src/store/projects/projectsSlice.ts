import { createSlice } from '@reduxjs/toolkit'
import type { ProjectSummary } from '@/types'
import { loadProjects } from './projectActions'
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
  },
})

export default projectsSlice.reducer
