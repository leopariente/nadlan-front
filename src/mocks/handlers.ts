import { http, HttpResponse } from 'msw'
import type { Report } from '@/types/report'
import { herbertSamuel33 } from './herbertSamuel33'

// In-memory store — mutations persist within the browser session
let reportStore: Report = { ...herbertSamuel33 }

function randomLatency(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200))
}

export const handlers = [
  http.get('/api/reports/:id', async ({ params }) => {
    await randomLatency()
    if (params['id'] !== reportStore.id) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(reportStore)
  }),

  http.patch('/api/reports/:id', async ({ params, request }) => {
    await randomLatency()
    if (params['id'] !== reportStore.id) {
      return new HttpResponse(null, { status: 404 })
    }
    const body = await request.json() as Partial<Report>
    reportStore = deepMerge(reportStore, body)
    reportStore = { ...reportStore, updatedAt: new Date().toISOString() }
    return HttpResponse.json(reportStore)
  }),

  http.get('/api/reports', async () => {
    await randomLatency()
    return HttpResponse.json([
      {
        id: reportStore.id,
        projectName: reportStore.projectName,
        address: reportStore.address,
        createdAt: reportStore.createdAt,
        updatedAt: reportStore.updatedAt,
      },
    ])
  }),
]

// Deep merge utility — merges b into a
function deepMerge<T>(a: T, b: Partial<T>): T {
  if (typeof b !== 'object' || b === null) return b as T
  const result = { ...a }
  for (const key in b) {
    const bVal = b[key]
    const aVal = (a as Record<string, unknown>)[key]
    if (
      typeof bVal === 'object' &&
      bVal !== null &&
      !Array.isArray(bVal) &&
      typeof aVal === 'object' &&
      aVal !== null &&
      !Array.isArray(aVal)
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(aVal, bVal as Partial<typeof aVal>)
    } else {
      (result as Record<string, unknown>)[key] = bVal
    }
  }
  return result
}
