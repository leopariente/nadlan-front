import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
}

interface TabSwitcherProps {
  tabs: Tab[]
  activeTab: string
  onChange: (key: string) => void
}

export function TabSwitcher({ tabs, activeTab, onChange }: TabSwitcherProps) {
  return (
    <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {tabs.map(({ key, label }, i) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            'flex-1 py-3 text-sm font-medium text-center transition-colors',
            i < tabs.length - 1 && 'border-e border-slate-200',
            activeTab === key ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
