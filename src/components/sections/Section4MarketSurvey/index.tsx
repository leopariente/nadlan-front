import { useState } from 'react'
import { TabSwitcher } from '@/components/shared/TabSwitcher'
import { TransactionsTab } from './TransactionsTab'
import { CommercialTab } from './CommercialTab'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchDeals } from '@/store/reportData/reportDataActions'
import type { Section4Data } from '@/types'

type TabKey = 'new' | 'secondary' | 'commercial'

const TABS = [
  { key: 'new',        label: 'דירות חדשות' },
  { key: 'secondary',  label: 'יד 2'        },
  { key: 'commercial', label: 'מסחר'        },
]

interface Props {
  data: Section4Data
  onChange: (data: Section4Data) => void
  gush: string
  helka: string
  readOnly?: boolean
}

export default function Section4MarketSurvey({ data, onChange, gush, helka, readOnly = false }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('new')
  const dispatch = useAppDispatch()
  const generating = useAppSelector(s => s.reportData?.fetchDealsStatus === 'loading')

  function handleGenerate(tab: 'new' | 'secondary') {
    dispatch(fetchDeals({ gush, helka, tab }))
  }

  return (
    <div className="space-y-5">
      <TabSwitcher
        tabs={TABS}
        activeTab={activeTab}
        onChange={key => setActiveTab(key as TabKey)}
      />

      {activeTab === 'new' && (
        <TransactionsTab
          transactions={data.newApartments.transactions}
          selectedPricePerSqm={data.newApartments.selectedPricePerSqm}
          onTransactionsChange={rows =>
            onChange({ ...data, newApartments: { ...data.newApartments, transactions: rows } })
          }
          onSelectedPriceChange={v =>
            onChange({ ...data, newApartments: { ...data.newApartments, selectedPricePerSqm: v } })
          }
          onGenerate={() => handleGenerate('new')}
          generating={generating}
          readOnly={readOnly}
        />
      )}

      {activeTab === 'secondary' && (
        <TransactionsTab
          transactions={data.secondaryApartments.transactions}
          selectedPricePerSqm={data.secondaryApartments.selectedPricePerSqm}
          onTransactionsChange={rows =>
            onChange({ ...data, secondaryApartments: { ...data.secondaryApartments, transactions: rows } })
          }
          onSelectedPriceChange={v =>
            onChange({ ...data, secondaryApartments: { ...data.secondaryApartments, selectedPricePerSqm: v } })
          }
          onGenerate={() => handleGenerate('secondary')}
          generating={generating}
          readOnly={readOnly}
        />
      )}

      {activeTab === 'commercial' && (
        <CommercialTab
          commercialPctOfResidential={data.commercial.commercialPctOfResidential}
          newApartmentsSelectedPrice={data.newApartments.selectedPricePerSqm}
          onChange={pct => onChange({ ...data, commercial: { commercialPctOfResidential: pct } })}
          readOnly={readOnly}
        />
      )}
    </div>
  )
}
