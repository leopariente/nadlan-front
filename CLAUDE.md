# CLAUDE.md

> **Maintenance rule:** After any change that affects this file — new section implemented, file moved, shared component added, type system changed, pattern updated — update CLAUDE.md before finishing the task.

B2B SaaS tool for Israeli real estate feasibility reports (תמ"א 38 / pinui-binui). RTL Hebrew UI, desktop-first.

## Component Rule

**One component per file.** Every React component lives in its own `ComponentName.tsx` file. Never define multiple components in a single file.

## Tech Stack

- React 19 + Vite + TypeScript (strict)
- Tailwind CSS v3 + shadcn/ui (Radix UI)
- Redux Toolkit — only for `projects` list on Dashboard
- React Router v6 — `/` Dashboard, `/report/:id` Report editor
- Real backend at `http://localhost:8000`

## Commands

```bash
npm run dev    # dev server
npm run build  # tsc + vite build (ALWAYS run to verify changes)
npm run lint   # eslint
```

## Project Structure

```
src/
  types.ts                          # barrel — ALL type imports come from here
  types/                            # (deleted — types live near their components)
  constants/
    sections.ts                     # SECTIONS array + SectionNumber type (9 sections)
  pages/
    Dashboard.tsx                   # reads from projects Redux slice
    Report.tsx                      # local useState for all section data, no Redux
  store/
    store.ts                        # configureStore — only 'projects' reducer
    projects/
      types.ts                      # ProjectSummary interface
      projectsSlice.ts              # Redux slice for projects list
      projectsApi.ts                # axios GET /api/reports
      projectActions.ts             # loadProjects async thunk
  components/
    layout/
      Layout.tsx                    # fixed sidebar (RTL end-0) + main content
      SectionNav.tsx                # step indicator nav (9 sections)
      TopBar.tsx                    # fixed header
    shared/
      Card.tsx                      # <Card title="..." bodyClassName="p-5"> — section card wrapper
      Field.tsx                     # <Field label="..." unit?="..."> — label + input wrapper
      formStyles.ts                 # inputClass string (shared across form inputs)
      RowVariants.tsx               # ComputedRow, Section1Row, InlineInputRow, KeyRow
      TabSwitcher.tsx               # <TabSwitcher tabs={[{key,label}]} activeTab onChange>
      CurrencyInput.tsx             # controlled currency input (formats on blur)
      ReportTable.tsx               # generic configurable table
      BackButton.tsx                # <BackButton to="/" label="…"> — navigates back (RTL arrow)
      ConfirmDialog.tsx             # <ConfirmDialog open onOpenChange title description onConfirm> — controlled Hebrew confirm modal
      TablePagination.tsx           # <TablePagination page totalPages totalItems pageSize onChange> — paginator row, renders null when totalPages ≤ 1
    sections/
      Section1ExistingState/
        types.ts                    # FloorUse, FloorRow, Section1Data
        index.tsx                   # parcel card + floors table + metrics grid
        FloorsTable.tsx             # floor rows table with add/delete
      Section2PlanningRights/
        types.ts                    # GeneralPlanData, Section2Data
        index.tsx                   # tab switch: detailed | general
        DetailedPlanTab.tsx         # residential + commercial cards
        GeneralPlanTab.tsx          # general plan (coverage %, floors, parking…)
      Section4MarketSurvey/
        types.ts                    # Transaction, Section4Data
        index.tsx                   # tab switch: new | secondary | commercial
        TransactionsTab.tsx         # transactions table + stats + selected price
        CommercialTab.tsx           # commercial % of residential
      Section5Levies/
        types.ts                    # Section5Data
        index.tsx                   # tab switch: rates | calc; exports computeTotalLeviesAndFees()
        RatesTab.tsx                # flat rate toggle + detailed rate inputs
        CalcTab.tsx                 # base data table + levy calculation table
      Section8EconomicAnalysis/
        types.ts                    # Section8Data, DEFAULT_SECTION8
        index.tsx                   # 5-tab cost analysis; exports computeSection8()
        CostTable.tsx               # shared sub-component: renders a single cost table (CostRowDef[])
    ui/
      button.tsx / collapsible.tsx / separator.tsx / dialog.tsx   # shadcn primitives
  lib/
    utils.ts                        # cn(), formatCurrency(), formatNumber(), parseCurrencyInput()
  hooks/
    redux.ts                        # useAppSelector, useAppDispatch
```

## Cross-Section Helpers

Exported pure functions used in `Report.tsx` to derive cross-section props:

- `Section5Levies` → `computeTotalLeviesAndFees(data, ...)` — Section 8 prop
- `Section6BettermentLevy` → `computeEstimatedBettermentLevy(data, ...)` — Section 8 prop
- `Section8EconomicAnalysis` → `computeSection8(data, props)` → `{ directConstructionCosts, totalConstructionCosts }` — Section 9 prop

**Redux / backend integration:** Only projects list (Dashboard). Report editor uses `useState` — no load/save yet.

## Type System

All types are defined in the local `types.ts` of the component they belong to.  
**Always import from `@/types` (the barrel). Never import from a local types.ts directly.**

```ts
import type { Section1Data, Section5Data, ProjectSummary } from '@/types'
```

To add a type: define it in the relevant section's `types.ts`, then re-export it from `src/types.ts`.

## Shared Components — Usage

```tsx
// Card — section container
<Card title="פרטי חלקה">…</Card>
<Card title="…" bodyClassName="p-5 space-y-5">…</Card>  // when children need vertical gap

// Field — label wrapper for inputs
<Field label="גוש">…</Field>
<Field label="אגרות בנייה" unit='₪/מ"ר'>…</Field>

// inputClass — apply to any <input> / <select>
import { inputClass } from '@/components/shared/formStyles'
<input className={inputClass} … />

// RowVariants — display rows inside cards
<ComputedRow label="…" value={num} unit='מ"ר' />   // gray bg, derived value
<Section1Row label="…" value={num} />               // darker bg, "מסעיף 1" badge
<InlineInputRow label="…" value={n} onChange={fn} unit="%" disabled={readOnly} />
<KeyRow label="…" value={num} />                    // amber bg, key output

// TabSwitcher
<TabSwitcher tabs={[{key:'a',label:'…'},{key:'b',label:'…'}]} activeTab={tab} onChange={setTab} />
```

## State Architecture

**Report.tsx** owns all section state via `useState`. No Redux for report data yet.  
Cross-section values are derived inline in `Report.tsx` and passed as props.

```ts
// Section components receive: data, onChange, readOnly?, and cross-section derived props
// onChange always replaces the full section object:
onChange({ ...data, someField: newValue })
```

**Dashboard** uses Redux: `projects/projectsSlice` + `loadProjects` thunk → `GET /api/reports`.

## TypeScript Constraints

- `erasableSyntaxOnly: true` — no `enum` or `namespace`; use `const` objects + union types
- `noUnusedLocals/Parameters` — every import and destructured param must be used
- `verbatimModuleSyntax` — use `import type { … }` for type-only imports
- `strict: true` — no implicit any, strict null checks

## RTL Notes

- `dir="rtl"` on `<html>` in index.html
- Use logical CSS: `ms-*`/`me-*`/`ps-*`/`pe-*` — never `ml-*`/`mr-*`/`pl-*`/`pr-*`
- Sidebar: `fixed end-0` (right side in RTL). Main content: `me-64`

## Adding a New Section

1. Create `src/components/sections/SectionN.../` directory
2. Add `types.ts` with the section's data interface
3. Export the type from `src/types.ts`
4. Create `index.tsx` (main component) + sub-files as needed
5. Add section state (`useState`) and derived values in `Report.tsx`
6. Add `case N:` in `renderSection()` in `Report.tsx`
