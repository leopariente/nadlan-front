import { createAsyncThunk } from '@reduxjs/toolkit'
import { reportDataApi, type CreateReportPayload, type ReportResponse } from './reportDataApi'
import type { ProjectSummary, Transaction } from '@/types'
import type { ReportSections } from './types'

const api = new reportDataApi()

export const createReport = createAsyncThunk<ReportResponse, CreateReportPayload>(
  'reportData/create',
  (payload) => api.createReport(payload)
)

export const loadReport = createAsyncThunk<ReportResponse, string>(
  'reportData/load',
  (id) => api.loadReport(id)
)

export const saveReport = createAsyncThunk<ProjectSummary, { id: string; sections: ReportSections }>(
  'reportData/save',
  ({ id, sections }) => api.saveReport(id, sections)
)

export const fetchDeals = createAsyncThunk<Transaction[], { gush: string; helka: string; tab: 'new' | 'secondary' }>(
  'reportData/fetchDeals',
  ({ gush, helka }) => api.fetchDeals({ gush, helka })
)
