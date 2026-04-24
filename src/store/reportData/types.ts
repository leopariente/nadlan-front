import type {
  Section1Data,
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
  Section8Data,
  ProjectSummary,
} from '@/types'

export interface ReportSections {
  section1: Section1Data
  section2: Section2Data
  section3: Section3Data
  section4: Section4Data
  section5: Section5Data
  section6: Section6Data
  section7: Section7Data
  section8: Section8Data
}

export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error'
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
export type FetchDealsStatus = 'idle' | 'loading' | 'error'
export type ExtractionStatus = 'idle' | 'extracting' | 'extracted' | 'error'

export interface ReportDataState {
  currentReportId: string | null
  project: ProjectSummary | null
  sections: ReportSections | null
  loadStatus: LoadStatus
  saveStatus: SaveStatus
  fetchDealsStatus: FetchDealsStatus
  extractionStatus: ExtractionStatus
  extractionId: string | null
}
