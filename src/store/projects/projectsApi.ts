import axios from 'axios'
import type { ProjectSummary } from '@/types'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
export class projectsApi {
  fetchProjects(): Promise<ProjectSummary[]> {
    return api.get<ProjectSummary[]>('/api/reports').then(r => r.data)
  }

  deleteProject(id: string): Promise<void> {
    return api.delete(`/api/reports/${id}`).then(() => undefined)
  }
}
