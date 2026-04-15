import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

export interface LoginResponse {
  access_token: string
  token_type: string
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return api.post<LoginResponse>('/api/auth/login', { username, password }).then(r => r.data)
}
