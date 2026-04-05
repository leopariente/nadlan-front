# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# nadlan-front — דוח אפס

B2B SaaS tool for Israeli real estate feasibility reports. RTL Hebrew UI, desktop-first.

## Tech Stack

- **React 19** + **Vite** + **TypeScript** (strict mode)
- **Tailwind CSS v3** + shadcn/ui components (Radix UI primitives)
- **Redux Toolkit** — global state (`src/store/`)
- **React Router v6** — `/` (Dashboard) and `/report/:id` (Report editor)
- **immer** — immutable updates in step components
- **MSW v2** — mock backend in `src/mocks/` (currently disabled; real backend at `http://localhost:8000`)

## Commands

```bash
npm run dev      # start dev server
npm run build    # tsc + vite build
npm run lint     # eslint
```

## Backend

All API calls go through `src/store/reportSlice/reportApi.ts` via an axios instance with `baseURL: 'http://localhost:8000'`. This is the only file to change when the backend URL changes.

MSW is disabled in `src/main.tsx`. To re-enable for local development without a backend, restore the `enableMocking()` body in `main.tsx`.

## Project Structure

```
src/
  store/
    reportSlice/
      reportSlice.ts   # Redux slice: report, currentStep, saveStatus, loadStatus
      reportActions.ts # loadReport, saveReport async thunks
      reportApi.ts     # axios calls: fetchReport, patchReport, fetchProjects
      index.ts         # re-exports
    projectsSlice.ts   # Redux slice: projects list for Dashboard, loadProjects thunk
    store.ts           # configureStore — reducers: report, projects
  hooks/
    redux.ts           # useAppSelector, useAppDispatch (typed wrappers)
  types/
    report.ts          # All TypeScript interfaces (Report, Step1Data…Step8Data, ProjectSummary)
  lib/
    calculations.ts    # Pure functions — ALL derived/calculated fields live here
    utils.ts           # cn(), formatCurrency(), formatNumber(), parseCurrencyInput()
  mocks/
    herbertSamuel33.ts # Seed data — Herbert Samuel 33, Hadera (canonical shape reference)
    handlers.ts        # MSW handlers (disabled but kept as reference)
  components/
    layout/            # TopBar, Sidebar, Layout
    shared/            # ReportTable, CurrencyInput, StatusIndicator
    steps/             # Step1Background … Step9Summary
    ui/                # shadcn components (button, collapsible, separator)
  pages/
    Dashboard.tsx      # dispatches loadProjects on mount, reads from projects Redux slice
    Report.tsx         # dispatches loadReport(id) on mount, autosaves on report change
  constants/
    steps.ts           # STEPS array (9 steps, used by Sidebar and Report)
```

## State Architecture

**Redux** owns: `report`, `currentStep`, `saveStatus`, `loadStatus`, `projects`

**Two slices:**
- `reportSlice` — single report being edited
- `projectsSlice` — project list for Dashboard

**Data flow — Dashboard:**
1. `Dashboard` mounts → dispatches `loadProjects()` → `GET /api/reports` → populates `projects[]`

**Data flow — Report editor:**
1. `Report` mounts → dispatches `loadReport(id)` → `GET /api/reports/:id` → sets `report` in Redux
2. User edits → component dispatches `updateStep({ key: 'stepN', value: newData })`
3. `Report.tsx` watches `report` ref → debounces 500ms → dispatches `saveReport` → `PATCH /api/reports/:id`

## Key Patterns

### Dispatching step updates
```ts
const dispatch = useAppDispatch()
dispatch(updateStep({ key: 'step1', value: { ...report.step1, someField: newValue } }))
```

### Calculated fields
Never stored in Redux or sent to the backend — always derived on render:
```ts
import { calcBettermentLevy } from '@/lib/calculations'
const levy = calcBettermentLevy(report)  // pure function, no side effects
```

### Adding a new step input field
1. Add the field to the relevant interface in `src/types/report.ts`
2. Update seed data in `src/mocks/herbertSamuel33.ts`
3. Add any derived calculations to `src/lib/calculations.ts`
4. Update the step component to read/dispatch the field

## TypeScript Constraints

- `erasableSyntaxOnly: true` — no `enum` or `namespace`; use `const` objects + union types
- `noUnusedLocals/Parameters` — all imports and params must be used
- `verbatimModuleSyntax` — use `import type { ... }` for type-only imports
- `strict: true` — no implicit any, strict null checks

## RTL Notes

- `dir="rtl"` is set on `<html>` in `index.html`
- Use logical CSS properties: `ms-*`/`me-*`/`ps-*`/`pe-*` instead of `ml-*`/`mr-*`/`pl-*`/`pr-*`
- Sidebar is `fixed end-0` (right side visually in RTL)
- Main content uses `me-64` to clear the sidebar
