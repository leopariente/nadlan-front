// Section 3 has no user-editable state — all inputs derived from sections 4 and 8.
// Empty type kept for backend compatibility (section3 key still sent in PUT /api/reports/:id).
export type Section3Data = Record<string, never>

export const DEFAULT_SECTION3: Section3Data = {}
