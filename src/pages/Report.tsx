import { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import type { RootState } from '@/store/store'
import { loadReport, saveReport, setSaveStatus, type LoadStatus } from '@/store/reportSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { Layout } from '@/components/layout/Layout'
import { STEPS } from '@/constants/steps'
import Step1Background from '@/components/steps/Step1Background'
import Step2Planning from '@/components/steps/Step2Planning'
import Step3Program from '@/components/steps/Step3Program'
import Step4MarketSurvey from '@/components/steps/Step4MarketSurvey'
import Step5Levies from '@/components/steps/Step5Levies'
import Step6Betterment from '@/components/steps/Step6Betterment'
import Step7Inventory from '@/components/steps/Step7Inventory'
import Step8Economic from '@/components/steps/Step8Economic'
import Step9Summary from '@/components/steps/Step9Summary'

type Props = { currentStep: number; loadStatus: LoadStatus }

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-64" />
      <div className="h-64 bg-slate-200 rounded" />
    </div>
  )
}

function Report({ currentStep, loadStatus }: Props) {
  const { id } = useParams<{ id: string }>()
  const reportId = id ?? ''
  const dispatch = useAppDispatch()
  const report = useAppSelector(s => s.report.report)

  // Load report on mount
  useEffect(() => {
    if (reportId) dispatch(loadReport(reportId))
  }, [reportId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave — debounced 500ms, skip initial load
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (!report || loadStatus !== 'loaded') return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    dispatch(setSaveStatus('saving'))

    const timer = setTimeout(() => {
      dispatch(saveReport({ id: reportId, report }))
    }, 500)

    return () => clearTimeout(timer)
  }, [report]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentStepDef = STEPS.find(s => s.number === currentStep)

  if (loadStatus === 'loading' || loadStatus === 'idle') {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    )
  }

  if (loadStatus === 'error') {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-red-500 text-lg">לא נמצא הדוח המבוקש</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {currentStep}. {currentStepDef?.label}
        </h2>
      </div>

      {currentStep === 1 && <Step1Background />}
      {currentStep === 2 && <Step2Planning />}
      {currentStep === 3 && <Step3Program />}
      {currentStep === 4 && <Step4MarketSurvey />}
      {currentStep === 5 && <Step5Levies />}
      {currentStep === 6 && <Step6Betterment />}
      {currentStep === 7 && <Step7Inventory />}
      {currentStep === 8 && <Step8Economic />}
      {currentStep === 9 && <Step9Summary />}
    </Layout>
  )
}

const mapStateToProps = (state: RootState) => ({
  currentStep: state.report.currentStep,
  loadStatus: state.report.loadStatus,
})

const connector = connect(mapStateToProps)

export default connector(Report)
