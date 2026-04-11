import { useState, type ReactNode } from 'react'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
  sidebar?: (closeSidebar: () => void) => ReactNode
}

export function Layout({ children, sidebar }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar onMenuClick={() => setSidebarOpen(o => !o)} />

      {/* Desktop sidebar — always visible, hidden on mobile */}
      <aside className="hidden md:block fixed top-14 end-0 bottom-0 w-64 bg-slate-50 border-s border-slate-200 overflow-y-auto z-40">
        {sidebar?.(closeSidebar)}
      </aside>

      {/* Mobile full-screen menu */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col md:hidden">
          <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200 flex-shrink-0">
            <span className="text-sm font-bold text-blue-700 tracking-tight">דוח אפס</span>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="סגור תפריט"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sidebar?.(closeSidebar)}
          </div>
        </div>
      )}

      <main className="pt-14 md:me-64 min-h-screen">
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  )
}
