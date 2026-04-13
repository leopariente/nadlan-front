# Backend Implementation Prompt — דוח אפס API

## Context

This is the backend for a B2B SaaS real estate feasibility report tool (תמ"א 38 / פינוי-בינוי).
The frontend is React + Redux at `http://localhost:3000`, expecting a REST API at `http://localhost:8000`.

All request/response shapes below are the **exact contracts the frontend depends on**.
Do not rename fields or change types — the frontend will break.

---

## API Endpoints

### 1. List Projects
```
GET /api/reports
```
**Response:** `ProjectSummary[]`

Used by the Dashboard to list all projects.

---

### 2. Create Project + Report
```
POST /api/reports
Content-Type: application/json
```
**Request body:**
```json
{
  "projectName": "string",
  "address": "string",
  "gush": "string",
  "helka": "string"
}
```
**Response:** `ReportResponse`
```json
{
  "project": { ...ProjectSummary },
  "sections": { ...ReportSections }
}
```

Creates a new project record and initializes all 7 sections with default values (see defaults below).
The `id` must be server-generated (UUID).

---

### 3. Get Project + Report
```
GET /api/reports/:id
```
**Response:** `ReportResponse`
```json
{
  "project": { ...ProjectSummary },
  "sections": { ...ReportSections }
}
```

Returns the project metadata and all 7 sections for a given report ID.

---

### 4. Save Report
```
PUT /api/reports/:id
Content-Type: application/json
```
**Request body:** `ReportSections` (full sections object, all 7 sections)

**Response:** `ProjectSummary` (updated — `updatedAt` must reflect the save time)

---

## Full Type Definitions

### ProjectSummary
```typescript
interface ProjectSummary {
  id: string           // UUID
  projectName: string
  address: string
  gush: string
  helka: string
  createdAt: string    // ISO 8601 datetime
  updatedAt: string    // ISO 8601 datetime
}
```

---

### ReportSections
```typescript
interface ReportSections {
  section1: Section1Data
  section2: Section2Data
  section3: Section3Data
  section4: Section4Data
  section5: Section5Data
  section6: Section6Data
  section7: Section7Data
}
```

---

### Section1Data — מצב קיים
```typescript
type FloorUse = 'מגורים' | 'מסחר' | 'מרתף' | 'ציבורי' | 'גג'

interface FloorRow {
  name: string        // floor label, e.g. "קרקע", "א׳"
  use: FloorUse
  floorArea: number   // sqm
  balconyArea: number // sqm
}

interface Section1Data {
  gush: string
  helka: string
  address: string
  registeredArea: number   // sqm
  ownershipShare: string   // e.g. "בשלמות"
  existingUnits: number
  floors: FloorRow[]
}
```

**Defaults:** empty floors array, all numbers = 0, strings = ""

---

### Section2Data — זכויות תכנוניות
```typescript
interface GeneralPlanData {
  coveragePct: number          // default: 50
  floors: number               // default: 9
  floorplatePct: number        // default: 75
  avgUnitSqm: number           // default: 100
  parkingPerUnit: number       // default: 1.5
  parkingSqm: number           // default: 45
  basementCoveragePct: number  // default: 85
}

interface Section2Data {
  planType: 'detailed' | 'general'  // default: "detailed"
  residentialMainArea: number        // default: 0
  residentialServiceArea: number     // default: 0
  commercialMainArea: number         // default: 0
  commercialServiceArea: number      // default: 0
  densityUnits: number               // default: 0
  mamadSqm: number                   // default: 12
  tenantBonusSqmPerUnit: number      // default: 6
  commercialTenantBonusPct: number   // default: 25
  generalPlan: GeneralPlanData
}
```

---

### Section3Data — תכנית
```typescript
interface AboveGroundRow {
  mainAreaPerUnit: number      // default: 0
  mamadPerUnit: number         // default: 12
  sharedAreaPerUnit: number    // default: 0
  openBalconyPerUnit: number   // default: 0
  roofBalconySqm: number       // default: 0
}

interface UndergroundRow {
  parkingPerUnit: number       // default: 1 (tenant), 1.5 (developer)
  parkingAboveGround: number   // default: 0
  parkingUnderground: number   // default: 0
  avgParkingSqm: number        // default: 45
}

interface UndergroundSpecialRow {
  additionalSqm: number  // default: 0
  parkingSpots: number   // default: 0
  avgParkingSqm: number  // default: 45
}

interface Section3Data {
  tenantRow: AboveGroundRow
  developerRow: AboveGroundRow
  commercial: { sqm: number }       // default: 0
  publicBuildings: { sqm: number }  // default: 0
  underground: {
    tenantRow: UndergroundRow
    developerRow: UndergroundRow
    commercial: UndergroundSpecialRow
    disabled: UndergroundSpecialRow
    publicBuildings: UndergroundSpecialRow
  }
}
```

---

### Section4Data — סקר שוק
```typescript
interface Transaction {
  id: string
  saleDate: string         // display string, e.g. "15/09/2025"
  address: string
  gushHelka: string
  floor: number
  rooms: number
  netAreaSqm: number
  reportedPriceILS: number
  notes: string
}

interface Section4Data {
  newApartments: {
    transactions: Transaction[]     // default: []
    selectedPricePerSqm: number     // default: 0
  }
  secondaryApartments: {
    transactions: Transaction[]     // default: []
    selectedPricePerSqm: number     // default: 0
  }
  commercial: {
    commercialPctOfResidential: number  // default: 85
  }
}
```

---

### Section5Data — היטלים ואגרות
```typescript
interface Section5Data {
  useFlatRate: boolean  // default: false
  rates: {
    constructionPermit: number  // default: 37.65
    roadLand: number            // default: 82.51
    roadBuilding: number        // default: 118.28
    sidewalkLand: number        // default: 67.51
    sidewalkBuilding: number    // default: 96.77
    drainageLand: number        // default: 32.08
    drainageBuilding: number    // default: 57.53
    waterAuthority: number      // default: 94.19
    safetyBuffer: number        // default: 6
  }
}
```

---

### Section6Data — היטל השבחה
```typescript
interface Section6Data {
  builtValuePerSqmResidential: number    // default: 0
  builtValuePerSqmCommercial: number     // default: 0
  builtValuePerSqmEmployment: number     // default: 0
  existingCommercialValuePerSqm: number  // default: 0
  newPrimaryEmploymentArea: number       // default: 0
  publicSpaceDevelopment: number         // default: 0
  kindergartenConstruction: number       // default: 0
  demolitionAndDeveloper: number         // default: 0
  deferralYears: number                  // default: 3
  deferralRate: number                   // default: 6
  siteReductionFactor: number            // default: 100
  levyRate: number                       // default: 50
}
```

---

### Section7Data — שווי מלאי
```typescript
interface Section7Data {
  vatPct: number  // default: 18
}
```

---

## Database Schema

Store two logical entities: **projects** (metadata) and **report_sections** (the full JSON blob per project).

### SQL (PostgreSQL)

```sql
CREATE TABLE projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  address      TEXT NOT NULL DEFAULT '',
  gush         TEXT NOT NULL DEFAULT '',
  helka        TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE report_sections (
  report_id   UUID PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  section1    JSONB NOT NULL DEFAULT '{}',
  section2    JSONB NOT NULL DEFAULT '{}',
  section3    JSONB NOT NULL DEFAULT '{}',
  section4    JSONB NOT NULL DEFAULT '{}',
  section5    JSONB NOT NULL DEFAULT '{}',
  section6    JSONB NOT NULL DEFAULT '{}',
  section7    JSONB NOT NULL DEFAULT '{}'
);
```

**Notes:**
- Each section column stores the JSON object exactly matching the TypeScript interface above.
- On `PUT /api/reports/:id`, update all section columns + set `projects.updated_at = now()`.
- On `GET /api/reports` return all rows from `projects` mapped to `ProjectSummary[]`.
- `projectName` in the API maps to `project_name` in the DB (camelCase ↔ snake_case conversion in the API layer).

---

## Response Mapping Notes

- All datetime fields must be serialized as **ISO 8601 strings** (e.g. `"2026-04-12T10:00:00.000Z"`).
- All numeric fields in sections must be serialized as **numbers** (not strings).
- `FloorUse` values are Hebrew strings — store and return them verbatim.
- `Transaction.id` is a client-generated string (UUID or sequential) — store as-is.
- `planType` is `"detailed"` or `"general"` — store as string.

---

## CORS

Allow `http://localhost:3000` (frontend dev server) for all endpoints.
