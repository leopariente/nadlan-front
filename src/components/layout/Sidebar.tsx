import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import { setCurrentStep } from '@/store/reportSlice'
import { STEPS } from '@/constants/steps'
import { cn } from '@/lib/utils'

type Props = {
  currentStep: number
  setCurrentStep: (step: number) => void
}

function Sidebar({ currentStep, setCurrentStep }: Props) {
  return (
    <aside className="fixed top-14 end-0 bottom-0 w-64 bg-slate-50 border-s border-slate-200 overflow-y-auto z-40">
      <nav className="p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">שלבי הדוח</p>
        <ol className="space-y-1">
          {STEPS.map(step => {
            const isActive = currentStep === step.number
            const isDone = currentStep > step.number
            return (
              <li key={step.number}>
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-right',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-e-2 border-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  )}
                >
                  <span
                    className={cn(
                      'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isDone
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {isDone ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </span>
                  <span className="flex-1">{step.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </aside>
  )
}

const mapStateToProps = (state: RootState) => ({
  currentStep: state.report.currentStep,
})

const mapDispatchToProps = {
  setCurrentStep,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Sidebar)
