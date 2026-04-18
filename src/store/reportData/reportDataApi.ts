import type { ProjectSummary, Transaction, Section2Data } from '@/types'
import type { ReportSections } from './types'
import { api } from '@/store/projects/projectsApi'

interface DealApiRecord {
  sale_date: string
  address: string | null
  gush_helka: string
  floor: string | null
  rooms: number | null
  net_area: number | null
  reported_price: number | null
}

function mapDeal(r: DealApiRecord): Transaction {
  return {
    id: crypto.randomUUID(),
    saleDate: r.sale_date,
    address: r.address ?? '',
    gushHelka: r.gush_helka,
    floor: r.floor ?? null,
    rooms: r.rooms ?? 0,
    netAreaSqm: r.net_area ?? 0,
    reportedPriceILS: r.reported_price ?? 0,
  }
}

export interface CreateReportPayload {
  projectName: string
  address: string
  gush: string
  helka: string
}

export interface ReportResponse {
  project: ProjectSummary
  sections: Omit<ReportSections, 'section8'> & { section8?: ReportSections['section8'] }
}

export class ReportDataApi {
  createReport(payload: CreateReportPayload): Promise<ReportResponse> {
    return api.post<ReportResponse>('/api/reports', payload).then(r => r.data)
  }

  loadReport(id: string): Promise<ReportResponse> {
    return api.get<ReportResponse>(`/api/reports/${id}`).then(r => r.data)
  }

  saveReport(id: string, sections: ReportSections): Promise<ProjectSummary> {
    return api.put<ProjectSummary>(`/api/reports/${id}`, sections).then(r => r.data)
  }

  fetchDeals({ gush, helka }: { gush: string; helka: string }): Promise<Transaction[]> {
    return api
      .get<DealApiRecord[]>('/api/deals', { params: { gush, helka } })
      .then(r => r.data.map(mapDeal))
  }

  extractRights(reportId: string, file: File): Promise<{ section2: Section2Data; page_count: number }> {
    const form = new FormData()
    form.append('file', file)
    return api
      .post<{ section2: Section2Data; page_count: number }>(
        `/api/reports/${reportId}/extract-rights`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then(r => r.data)
  }
}
