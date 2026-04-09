import type { ReactNode } from 'react'
import TopBar from './TopBar'

interface LayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <TopBar />
      <aside className="fixed top-14 end-0 bottom-0 w-64 bg-slate-50 border-s border-slate-200 overflow-y-auto z-40">
        {sidebar}
      </aside>
      <main className="pt-14 me-64 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
