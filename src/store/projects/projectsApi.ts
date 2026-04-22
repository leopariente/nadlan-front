import { api } from '@/store/http'
import type { ProjectSummary } from '@/types'

// Re-export so existing `import { api } from '@/store/projects/projectsApi'`
// call sites keep working without churn.
export { api }

export class projectsApi {
  fetchProjects(): Promise<ProjectSummary[]> {
    return api.get<ProjectSummary[]>('/api/reports').then(r => r.data)
  }

  deleteProject(id: string): Promise<void> {
    return api.delete(`/api/reports/${id}`).then(() => undefined)
  }
}
