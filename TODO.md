# TODO — nadlan-front

Bugs and improvements found during repo inspection (2026-04-18).

## Bugs

- [ ] **Refresh token discarded** — `src/store/auth/authApi.ts:5-12` only types/returns `access_token`, but backend returns `{access_token, refresh_token}`. Access token expires in 15 min → user gets booted to `/login` mid-session. Persist `refresh_token` in localStorage and add an axios response interceptor that on 401 calls `POST /api/auth/refresh` with the stored refresh token, replays the request, and clears auth on refresh failure.
- [ ] **`/api/deals` field mismatch** — `src/store/reportData/reportDataApi.ts:5-26` `mapDeal` reads `r.gush_helka`, but the backend `Deal` schema (`app/schemas/deal.py`) has no `gush_helka` field — it returns `polygon_id`. Result: every fetched `Transaction.gushHelka` is `undefined`. Either change backend to include `gush_helka`, or compute it on the front from the project's gush/helka.
- [ ] **Logout doesn't revoke server tokens** — `src/components/layout/TopBar.tsx:13` only dispatches `clearToken`. Backend `refresh_tokens` row stays valid for 7 days. Call `POST /api/auth/logout` (with the access token) before clearing local state.
- [ ] **Hooks-rule violation in Login** — `src/pages/Login.tsx:12` does `if (token) return <Navigate />` BEFORE the `useState` calls on lines 13-16. When `token` flips, hook count changes → React warning / undefined behavior. Move all `useState` above the early return.
- [ ] **Shared `fetchDealsStatus`** — `src/components/sections/Section4MarketSurvey/index.tsx:28` reads one global `loading` flag, so clicking "generate" on the new-apartments tab spins the secondary tab's button too. Track per-tab status, or scope the spinner to the active tab.
- [ ] **Dead code path: `/api/reports/{id}/seker-shuk`** — backend exposes it, frontend never calls it (uses `/api/deals` direct). Decide which is canonical and remove the loser.
- [ ] **Axios `api` instance lives in projects slice** — `src/store/projects/projectsApi.ts:4-14` defines the shared axios instance + auth interceptor, then `reportDataApi.ts` re-imports it. Misleading. Move to `src/lib/api.ts`.

## Minor / UX

- [ ] **`VITE_API_URL` has no fallback** — `axios.create({ baseURL: import.meta.env.VITE_API_URL })`. If the env var is missing, requests go to the page origin and silently 404. Either fail loud at startup or default to `http://localhost:8000` in dev.
- [ ] **`crypto.randomUUID()` in `mapDeal`** — `reportDataApi.ts:17` regenerates a UUID on every map, so React `key` reuse breaks across re-fetches. Use `r.deal_id` once backend exposes it.
- [ ] **`saveStatus = 'saved'` is sticky** — `src/store/reportData/reportDataSlice.ts:50` never resets to `idle`, so the green ✓ on the save button persists forever after first save. Add a `setTimeout` reset or transition on next edit.
- [ ] **`Sidebar.tsx` is unused** — Layout uses inline sidebar. Either wire `Sidebar.tsx` in or delete it.
- [ ] **`Promise.all` in `deleteProjects`** (`src/store/projects/projectActions.ts:14`) — partial failure leaves the list inconsistent. Use `Promise.allSettled` and surface per-id errors.

## Improvements

- [ ] Consider RTK Query (or move edit state into Redux with autosave) — the current "Redux + local `useState` mirror" pattern in `Report.tsx` (lines 44-79) is brittle and requires three `useEffect`s to keep them in sync.
- [ ] MSW is in `package.json` and `public/` but not initialized in `main.tsx`. Either wire it into dev or remove the dep.
- [ ] `redux-persist` and `immer` are in deps but unused.
