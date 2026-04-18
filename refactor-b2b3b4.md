# Refactor Backlog — B2, B3, B4

## B2 — Structural Cleanup

### Section3Program: split types.ts into types + helpers
- `types.ts` currently exports types **and** functions (`deriveRow`, `undergroundSqm`, `specialUndergroundSqm`)
- Extract fns to `helpers.ts`
- Update ~10 sibling imports to `from './helpers'` for fns, `from '@/types'` for types
- Keeps `verbatimModuleSyntax` clean (no value+type mix in one file)

### Section6BettermentLevy/tableUtils.ts → formStyles.ts
- `inputCls` (w-28) and `inputClsSm` (w-20) duplicate `shared/formStyles.inputClass` with width overrides
- Move to `formStyles.ts` as `cellInputClass = (w: string) => \`\${w} \${base}\`` or two named exports
- Delete `tableUtils.ts`, update 5 import sites in Section6

---

## B3 — Big Refactors

### Section8EconomicAnalysis/index.tsx (632 lines)
Split into:
- `compute.ts` — extract `computeTables(data, p)` returning `{t1,t2,t3,t4,t5,direct,total}`; consolidates duplicated math between render and `computeSection8`. Re-export `computeSection8` wrapper from here.
- `rowDefs.ts` — 5 factory fns `makeTable1Rows(data, props)` … `makeTable5Rows(data, props)` returning `CostRowDef[]`. ~200 lines moved out.
- `ResidentsInputBar.tsx` — the constructionMonths input block (lines 496–519)
- `index.tsx` reduced to orchestration + summary strip + grand total (~100 lines)

### Report.tsx (374 lines)
Split into:
- `Report/deriveCrossSection.ts` — pure fn `deriveCrossSection(sections, project)` → typed derived record. Wrap call in `useMemo`.
- Optionally `Report/SectionRouter.tsx` — `renderSection` switch extracted as component receiving `(currentSection, sections, derived, onChange)`
- Merge 3 seed/sync `useEffect`s into 1 (or 2 max) to fix setState-in-effect lint errors

### TransactionsTab.tsx (265 lines)
Split into:
- `TransactionsTable.tsx` — table + pagination + add/generate buttons + confirm dialog
- `TransactionsStats.tsx` — StatCard strip, low-count warning, selected-price input block
- `TransactionsTab.tsx` composes both

---

## B4 — Polish

### Shared `NumberInput` component
- Pattern `<input type="number" value={x||''} onChange={e=>set(parseFloat(e.target.value)||0)}>` appears 29× across 16 files
- New `shared/NumberInput.tsx`: `<NumberInput value onChange min? step? className? disabled? placeholder?>`
- Replace call sites incrementally (high-traffic sections first: Section6, Section8, Section2)

### Generic `TabSwitcher<K>`
- Each section redefines `TabKey` union + casts `key as TabKey` in onChange
- Change `TabSwitcher` prop: `onChange: (key: K) => void` where `K extends string`
- Eliminates 4 `as TabKey` casts (Section2, 3, 4, 5, 8)

### Section6BettermentLevy — `BettermentBlock` sub-component
- `Table1ExistingState` and `Table2NewState` each have 3 near-identical א/ב/ג blocks:
  `[section header] [display rows] [editable input row] [amber total row]`
- Extract `BettermentBlock({ title, color, rows, inputLabel, inputValue, onChange, total })` in Section6
- Reduces Table1 + Table2 by ~80 lines combined

### AxiosError typing in ExtractFromPdfButton
- Replace manual `err as {response?:{data?:{detail?,message?}}}` cast
- Use `import { isAxiosError } from 'axios'` + `if (isAxiosError(err))` guard
- Type-safe, no cast needed
