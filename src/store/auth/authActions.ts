import { createAsyncThunk } from '@reduxjs/toolkit'
import { login, refresh } from './authApi'
import { setTokens, setAccessToken, clearTokens } from './authSlice'
import type { RootState } from '@/store/store'

interface LoginArgs {
  username: string
  password: string
}

export const loginThunk = createAsyncThunk<void, LoginArgs>(
  'auth/login',
  async ({ username, password }, { dispatch }) => {
    const res = await login(username, password)
    dispatch(
      setTokens({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      }),
    )
  },
)

/**
 * Exchange the stored refresh token for a new access token. Rejects if there
 * is no refresh token or if the server rejects it; the response interceptor
 * uses the rejection as a signal to force logout.
 */
export const refreshAccessToken = createAsyncThunk<string, void, { state: RootState }>(
  'auth/refresh',
  async (_arg, { getState, dispatch, rejectWithValue }) => {
    const refreshToken = getState().auth.refreshToken
    if (!refreshToken) {
      dispatch(clearTokens())
      return rejectWithValue('no refresh token')
    }
    try {
      const res = await refresh(refreshToken)
      dispatch(setAccessToken(res.access_token))
      return res.access_token
    } catch (err) {
      dispatch(clearTokens())
      throw err
    }
  },
)

export const logoutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async (_arg, { dispatch }) => {
    dispatch(clearTokens())
  },
)
