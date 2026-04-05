import { connect } from 'react-redux'
import type { RootState } from '@/store/store'
import type { Report } from '@/types/report'
import StatusIndicator from '@/components/shared/StatusIndicator'

type Props = { report: Report | null }

function TopBar({ report }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <StatusIndicator />
      </div>

      <div className="flex items-center gap-4">
        {report && (
          <div className="text-right">
            <p className="font-semibold text-slate-800 leading-tight">{report.projectName}</p>
            <p className="text-xs text-slate-500">{report.address}</p>
          </div>
        )}
        <div className="flex items-center gap-2 border-s border-slate-200 ps-4">
          <span className="text-sm font-bold text-blue-700 tracking-tight">דוח אפס</span>
        </div>
      </div>
    </header>
  )
}

const mapStateToProps = (state: RootState) => ({
  report: state.report.report,
})

const connector = connect(mapStateToProps)

export default connector(TopBar)
