import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Report } from '@/types/report'
import { fetchReport, patchReport } from './reportApi'

export const loadReport = createAsyncThunk(
  'report/load',
  (id: string) => fetchReport(id)
)

export const saveReport = createAsyncThunk(
  'report/save',
  ({ id, report }: { id: string; report: Report }) => patchReport(id, report)
)
