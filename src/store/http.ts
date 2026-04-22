import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { store } from './store'
import { refreshAccessToken } from './auth/authActions'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

// Request: inject the current access token from the store.
api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Single-flight: concurrent 401s share one refresh promise instead of
// each triggering its own refresh round-trip.
let refreshInFlight: Promise<string> | null = null

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    const status = error.response?.status

    if (status !== 401 || !original || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    if (!refreshInFlight) {
      refreshInFlight = store
        .dispatch(refreshAccessToken())
        .unwrap()
        .finally(() => {
          refreshInFlight = null
        })
    }

    try {
      const newToken = await refreshInFlight
      original.headers.Authorization = `Bearer ${newToken}`
      return api.request(original)
    } catch {
      return Promise.reject(error)
    }
  },
)
