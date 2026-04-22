# Refresh Token Support (Frontend)

## Summary

Backend split JWT into access (15 min) + refresh (7 days). Frontend stores both, auto-refreshes access on 401 without logging user out. Single-flight refresh prevents thundering herd on concurrent 401s.

## What changed

### New files

- **`src/store/http.ts`** — Shared axios client. Two responsibilities:
  1. Request interceptor injects `Authorization: Bearer <accessToken>` from Redux store.
  2. Response interceptor catches 401 → dispatches `refreshAccessToken` → retries original request with new token. Concurrent 401s share one refresh promise (`refreshInFlight`).

- **`src/store/auth/authActions.ts`** — Redux thunks:
  - `loginThunk` — calls `/auth/login`, stores both tokens via `setTokens`.
  - `refreshAccessToken` — calls `/auth/refresh` with stored refresh token, updates access token via `setAccessToken`. Clears tokens on failure (refresh expired/revoked).
  - `logoutThunk` — clears tokens from store + localStorage.

### Rewritten files

- **`src/store/auth/authApi.ts`** — Raw axios (no interceptor). Critical: if `/refresh` itself used the interceptor-ed client, a 401 on refresh would trigger another refresh → infinite loop. Exports `login()` and `refresh()` returning typed responses.

- **`src/store/auth/authSlice.ts`** — State shape now `{ accessToken, refreshToken }`. Reducers: `setTokens`, `setAccessToken`, `clearTokens`. `bootstrap()` on app init reads localStorage keys `access_token` + `refresh_token`; migrates old `token` key for existing sessions.

- **`src/store/projects/projectsApi.ts`** — Imports `api` from `@/store/http`, re-exports it (other modules still import `api` from this path). Class methods unchanged.

### Edited files

- **`src/pages/Login.tsx`** — Uses `dispatch(loginThunk(...)).unwrap()` instead of direct `login()` + `setToken()`. Reads `state.auth.accessToken`.
- **`src/components/ProtectedRoute.tsx`** — Reads `state.auth.accessToken` (was `state.auth.token`).
- **`src/components/layout/TopBar.tsx`** — Uses `dispatch(logoutThunk())` (was `clearToken()`).

## Why

### Two-token split matches backend

Backend issues short access (15 min) for request auth + long refresh (7 days) for renewal. Frontend must store both and know which to send where.

### Single-flight refresh

Without it: 10 parallel requests all 401 → 10 calls to `/refresh` → refresh token possibly rotated mid-flight → race. With it: one shared promise, all 10 original requests retried with the same new token.

### Raw axios for `authApi`

`/refresh` must never trigger the 401-retry interceptor. Using the shared `api` client would cause infinite recursion on expired refresh tokens. Keeping `authApi.ts` on raw axios isolates it.

### Migration path

Old sessions have `localStorage.token` only. `bootstrap()` copies it to `access_token`. User stays logged in until next access-token expiry (~15 min), then refresh fails (no refresh token stored) → user re-logs in once. Acceptable one-time cost.

## Setup / run steps

None. Change is transparent:

- Existing users: auto-migrated on next app load, may need to re-login once when their access token expires.
- New users: login flow stores both tokens, refresh happens silently.

Backend must be running feat/security-resilience (or merged) so `/api/auth/refresh` endpoint exists.

## Verification

1. **Login works**: `npm run dev` → login → DevTools → Application → Local Storage → see `access_token` + `refresh_token`.
2. **Silent refresh**: set access TTL to 30 sec on backend temporarily (`ACCESS_TOKEN_TTL` in `app/auth.py`). Login, wait 40 sec, click any API-triggering button. Network tab shows request 401 → `/auth/refresh` 200 → original request retried 200. No redirect to login.
3. **Refresh token expired**: manually corrupt `refresh_token` in localStorage → trigger API call after access expires → 401 on refresh → `clearTokens` fires → redirect to login.
4. **Concurrent 401s**: set access TTL short, trigger 5 parallel requests. Network tab shows one `/refresh` call, not 5.
5. **Logout clears both**: click יציאה → localStorage `access_token` + `refresh_token` gone.
