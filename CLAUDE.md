# CLAUDE.md

> **Maintenance rule:** After any change that affects this file — new section implemented, file moved, shared component added, type system changed, pattern updated — update CLAUDE.md before finishing the task.

B2B SaaS tool for Israeli real-estate feasibility reports (תמ"א 38 / pinui-binui). RTL Hebrew UI, desktop-first. Pairs with `nadlan-back` (FastAPI). All 9 sections live; data persists to backend via Redux thunks.

## Component Rule

**One component per file.** Every React component lives in its own `ComponentName.tsx` file. Never define multiple components in a single file.

## Tech Stack

- React 19 + Vite + TypeScript (strict)
- Tailwind CSS v3 + shadcn/ui (Radix UI)
- Redux Toolkit — `projects`, `reportData`, `auth` slices
- React Router v6 — `/login`, `/` Dashboard, `/report/:id` Report editor (last two wrapped in `ProtectedRoute`)
- Axios with request-interceptor that pulls JWT from `localStorage` per request
- Backend at `import.meta.env.VITE_API_URL` (no fallback — must be set)
- MSW present in deps + `public/` for mocks (currently unused at runtime)

## Commands

```bash
npm run dev    # dev server
npm run build  # tsc -b + vite build (ALWAYS run to verify changes)
npm run lint   # eslint
```

## Project Structure

```
src/
  App.tsx                          # router + ProtectedRoute wrapping
  main.tsx                         # Provider<store> + render
  types.ts                         # barrel — ALL type imports come from here
  constants/
    sections.ts                    # SECTIONS array + SectionNumber type (9 sections)
  pages/
    Login.tsx                      # username/password form → setToken → /
    Dashboard.tsx                  # project list, multi-select delete, create form, navigates to /report/:id
    Report.tsx                     # local useState for sections (seeded from store), saves via saveReport thunk
  store/
    store.ts                       # configureStore — projects + reportData + auth reducers
    auth/
      authSlice.ts                 # token in localStorage + redux state
      authApi.ts                   # POST /api/auth/login (⚠ ignores refresh_token)
    projects/
      types.ts                     # ProjectSummary
      projectsApi.ts               # axios instance + interceptor (single source of truth for `api`); fetchProjects, deleteProject
      projectActions.ts            # loadProjects, deleteProjects (Promise.all)
      projectsSlice.ts             # also reacts to createReport/loadReport/saveReport from reportData slice
    reportData/
      types.ts                     # ReportSections + LoadStatus/SaveStatus/FetchDealsStatus + ReportDataState
      reportDataApi.ts             # createReport, loadReport, saveReport, fetchDeals, extractRights
      reportDataActions.ts         # createAsyncThunks for the above
      reportDataSlice.ts           # owns currentReportId, project, sections, all statuses
  components/
    ProtectedRoute.tsx             # Navigate to /login when no token
    layout/
      Layout.tsx                   # TopBar + responsive sidebar (desktop fixed, mobile full-screen)
      TopBar.tsx                   # logo + יציאה (sign-out) + mobile menu button
      Sidebar.tsx                  # (separate sidebar component — currently unused by Layout, kept for future)
      SectionNav.tsx               # step indicator nav (9 sections)
    dashboard/
      ProjectCard.tsx              # project tile (clickable + selectable)
      ProjectCardSkeleton.tsx
      ProjectsEmptyState.tsx
      ProjectsErrorState.tsx
      CreateProjectForm.tsx        # inline new-project form (name/address/gush/helka)
    shared/
      Card.tsx                     # <Card title="..." bodyClassName="p-5">
      Field.tsx                    # <Field label="..." unit?="...">
      formStyles.ts                # inputClass string
      RowVariants.tsx              # ComputedRow, Section1Row, InlineInputRow, KeyRow
      TabSwitcher.tsx              # <TabSwitcher tabs activeTab onChange>
      CurrencyInput.tsx            # controlled, formats on blur
      ReportTable.tsx              # generic configurable table (under shared in earlier docs — now lives in section dirs as needed)
      BackButton.tsx               # RTL-aware back nav
      ConfirmDialog.tsx            # controlled Hebrew confirm modal
      TablePagination.tsx          # null when totalPages ≤ 1
      ReportSkeleton.tsx           # report-page loading skeleton
      StatusIndicator.tsx          # generic status pill
    sections/
      Section1ExistingState/       # parcel card + floors table
      Section2PlanningRights/      # detailed | general tab
      Section3Program/             # tenant/developer above+below ground; deriveRow, undergroundSqm helpers
      Section4MarketSurvey/        # new | secondary | commercial; dispatches fetchDeals (does NOT use /seker-shuk endpoint)
      Section5Levies/              # exports computeTotalLeviesAndFees()
      Section6BettermentLevy/      # exports computeEstimatedBettermentLevy()
      Section7InventoryValue/      # vat % + derived inventory
      Section8EconomicAnalysis/    # 5-tab cost analysis; exports computeSection8(); DEFAULT_SECTION8 used as fallback when backend payload lacks section8
      Section9Summary/             # read-only summary
    ui/
      button.tsx / collapsible.tsx / separator.tsx / dialog.tsx   # shadcn primitives
  lib/
    utils.ts                       # cn(), formatCurrency(), formatNumber(), parseCurrencyInput()
  hooks/
    redux.ts                       # useAppSelector, useAppDispatch
  mocks/                           # MSW handlers (not wired in)
```

## Cross-Section Helpers

Pure functions exported from section folders, used in `Report.tsx` to derive cross-section props:

- `Section3Program/types` → `deriveRow`, `undergroundSqm`, `specialUndergroundSqm`
- `Section5Levies` → `computeTotalLeviesAndFees(data, ...)` — Section 8 input
- `Section6BettermentLevy` → `computeEstimatedBettermentLevy(data, ...)` — Section 8 input
- `Section8EconomicAnalysis` → `computeSection8(data, props)` → `{ directConstructionCosts, totalConstructionCosts }` — Section 9 input

## State Architecture

**Two-layer pattern in `Report.tsx`:**
1. Redux `reportData` slice owns the canonical `sections` (loaded from backend, mutated by `fetchDeals` for section4).
2. Local `useState<ReportSections | null>` is **seeded** from the Redux copy on first load (and re-seeded when `section4` changes, e.g. after `fetchDeals` completes). All in-progress edits live in local state until the user clicks שמור (`saveReport` thunk).

**Why two layers:** unsaved edits don't leak across navigations to other reports (the `useEffect([id])` resets local state to null on report switch); but the canonical sections survive remounts and feed back the async deal-fetch result.

`createReport` / `loadReport` / `saveReport` are dispatched from pages; the `projects` slice subscribes to those actions to keep the dashboard list in sync.

**Auth slice:** `token` mirrored in `localStorage`. Axios request interceptor (in `store/projects/projectsApi.ts`) attaches `Authorization: Bearer <token>` from localStorage on every request. The same `api` instance is re-imported by `reportDataApi.ts`.

## Type System

All types are defined in the local `types.ts` of the component or store slice they belong to.
**Always import from `@/types` (the barrel). Never import from a local `types.ts` directly.**

```ts
import type { Section1Data, Section5Data, ProjectSummary, ReportSections } from '@/types'
```

To add a type: define it in the relevant section's or slice's `types.ts`, then re-export it from `src/types.ts`.

## Shared Components — Usage

```tsx
<Card title="פרטי חלקה">…</Card>
<Card title="…" bodyClassName="p-5 space-y-5">…</Card>

<Field label="גוש">…</Field>
<Field label="אגרות בנייה" unit='₪/מ"ר'>…</Field>

import { inputClass } from '@/components/shared/formStyles'
<input className={inputClass} … />

<ComputedRow label="…" value={num} unit='מ"ר' />     // gray bg, derived
<Section1Row label="…" value={num} />                 // darker bg, "מסעיף 1" badge
<InlineInputRow label="…" value={n} onChange={fn} unit="%" disabled={readOnly} />
<KeyRow label="…" value={num} />                      // amber bg, key output

<TabSwitcher tabs={[{key:'a',label:'…'},{key:'b',label:'…'}]} activeTab={tab} onChange={setTab} />
```

## TypeScript Constraints

- `erasableSyntaxOnly: true` — no `enum` or `namespace`; use `const` objects + union types
- `noUnusedLocals/Parameters` — every import and destructured param must be used
- `verbatimModuleSyntax` — use `import type { … }` for type-only imports
- `strict: true`

## RTL Notes

- `dir="rtl"` on `<html>` in index.html
- Use logical CSS: `ms-*`/`me-*`/`ps-*`/`pe-*` — never `ml-*`/`mr-*`/`pl-*`/`pr-*`
- Sidebar: `fixed end-0` (right side in RTL). Main content: `md:me-64`

## Adding a New Section

1. Create `src/components/sections/SectionN.../` directory
2. Add `types.ts` with the section's data interface
3. Export the type from `src/types.ts`
4. Create `index.tsx` (main component) + sub-files as needed
5. Add the new field to backend `app/schemas/report.py` `ReportSections` (default factory) — backend stores the whole blob as JSONB
6. Add `case N:` in `renderSection()` in `Report.tsx`, wire derived props

## Known Gaps / Bugs

- **Refresh token discarded.** `authApi.login` only reads `access_token`; the backend's 15-min access token expires and there's no refresh path → user gets booted to /login mid-session.
- **`/api/deals` schema mismatch.** `mapDeal` expects `gush_helka` but backend `Deal` schema has no such field (it returns `polygon_id`). Calling `fetchDeals` will leave `gushHelka` undefined.
- **Logout doesn't hit backend.** `TopBar.handleSignOut` only clears local token; backend refresh tokens are never revoked. Should `POST /api/auth/logout` first.
- **Hooks-rule violation in `Login.tsx`.** Early `if (token) return <Navigate />` precedes `useState` calls — re-render with token transitions will change hook count.
- **Shared `fetchDealsStatus`.** Section 4 "generating" spinner shows on both new+secondary tabs even when only one was clicked.
- **`/api/reports/{id}/seker-shuk` endpoint exists on backend but is never called from front** — frontend uses `/api/deals` direct fetch instead.
