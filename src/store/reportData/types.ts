import type {
  Section1Data,
  Section2Data,
  Section3Data,
  Section4Data,
  Section5Data,
  Section6Data,
  Section7Data,
} from '@/types'

export interface ReportSections {
  section1: Section1Data
  section2: Section2Data
  section3: Section3Data
  section4: Section4Data
  section5: Section5Data
  section6: Section6Data
  section7: Section7Data
}

export interface ReportDataState {
  reports: Record<string, ReportSections>
}
