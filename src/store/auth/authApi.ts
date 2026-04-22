import axios from 'axios'

// Raw axios client — intentionally NOT the shared interceptor-ed client.
// Login has no token yet; /refresh must not trigger the 401-retry loop.
const rawApi = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RefreshResponse {
  access_token: string
  token_type: string
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return rawApi
    .post<LoginResponse>('/api/auth/login', { username, password })
    .then(r => r.data)
}

export function refresh(refreshToken: string): Promise<RefreshResponse> {
  return rawApi
    .post<RefreshResponse>('/api/auth/refresh', { refresh_token: refreshToken })
    .then(r => r.data)
}
