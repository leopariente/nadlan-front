import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const LEGACY_KEY = 'token'

// One-shot migration: if only the old 'token' key exists, treat it as access.
// No refresh token → user gets a forced re-login on the next expiry.
function bootstrap(): AuthState {
  const legacy = localStorage.getItem(LEGACY_KEY)
  if (legacy && !localStorage.getItem(ACCESS_KEY)) {
    localStorage.setItem(ACCESS_KEY, legacy)
  }
  localStorage.removeItem(LEGACY_KEY)
  return {
    accessToken: localStorage.getItem(ACCESS_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY),
  }
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
}

interface TokenPair {
  accessToken: string
  refreshToken: string
}

const initialState: AuthState = bootstrap()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<TokenPair>) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem(ACCESS_KEY, action.payload.accessToken)
      localStorage.setItem(REFRESH_KEY, action.payload.refreshToken)
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      localStorage.setItem(ACCESS_KEY, action.payload)
    },
    clearTokens(state) {
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
    },
  },
})

export const { setTokens, setAccessToken, clearTokens } = authSlice.actions
export default authSlice.reducer
