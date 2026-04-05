import axios from 'axios'
import type { ProjectSummary, Report } from '@/types/report'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export async function fetchReport(id: string): Promise<Report> {
  const { data } = await api.get<Report>(`/api/reports/${id}`)
  return data
}

export async function patchReport(id: string, report: Report): Promise<Report> {
  const { data } = await api.patch<Report>(`/api/reports/${id}`, report)
  return data
}

export async function fetchProjects(): Promise<ProjectSummary[]> {
  const { data } = await api.get<ProjectSummary[]>('/api/reports')
  return data
}
