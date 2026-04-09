import { createAsyncThunk } from '@reduxjs/toolkit'
import { projectsApi } from '@/store/projects/projectsApi'

const api = new projectsApi();

export const loadProjects = createAsyncThunk(
  'projects/load',
  () => api.fetchProjects()
)
