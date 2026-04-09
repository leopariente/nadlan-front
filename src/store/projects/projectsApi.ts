import axios from 'axios'
import type { ProjectSummary } from '@/types'

const api = axios.create({ baseURL: 'http://localhost:8000' })
export class projectsApi {
  fetchProjects(): Promise<ProjectSummary[]> {
    return api.get<ProjectSummary[]>('/api/reports').then(r => r.data)
  }
}
