import axios from 'axios'
import type { ProjectSummary } from '@/types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }

export class projectsApi {
  fetchProjects(): Promise<ProjectSummary[]> {
    return api.get<ProjectSummary[]>('/api/reports').then(r => r.data)
  }

  deleteProject(id: string): Promise<void> {
    return api.delete(`/api/reports/${id}`).then(() => undefined)
  }
}
