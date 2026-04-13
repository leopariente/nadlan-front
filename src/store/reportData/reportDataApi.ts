import axios from 'axios'
import type { ProjectSummary, Transaction } from '@/types'
import type { ReportSections } from './types'

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
    floor: r.floor != null ? parseFloat(r.floor) : 0,
    rooms: r.rooms ?? 0,
    netAreaSqm: r.net_area ?? 0,
    reportedPriceILS: r.reported_price ?? 0,
  }
}

const api = axios.create({ baseURL: 'http://localhost:8000' })

export interface CreateReportPayload {
  projectName: string
  address: string
  gush: string
  helka: string
}

export interface ReportResponse {
  project: ProjectSummary
  sections: ReportSections
}

export class reportDataApi {
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
}
