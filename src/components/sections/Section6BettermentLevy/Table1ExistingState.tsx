import { Card } from '@/components/shared/Card'

export function Table1ExistingState() {
  return (
    <Card title="טבלה 1 — מצב קיים" bodyClassName="p-0">
      <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
        <span className="text-xs font-semibold text-amber-900">שווי מצב קיים</span>
        <span className="text-sm font-bold text-amber-800 tabular-nums">&#x20AA;0</span>
      </div>
    </Card>
  )
}
