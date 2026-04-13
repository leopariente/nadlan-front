import { createAsyncThunk } from '@reduxjs/toolkit'
import { projectsApi } from '@/store/projects/projectsApi'

const api = new projectsApi();

export const loadProjects = createAsyncThunk(
  'projects/load',
  () => api.fetchProjects()
)

export const deleteProjects = createAsyncThunk<string[], string[]>(
  'projects/delete',
  async (ids) => {
    await Promise.all(ids.map(id => api.deleteProject(id)))
    return ids
  }
)
