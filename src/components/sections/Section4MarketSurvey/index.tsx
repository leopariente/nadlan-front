import { useState } from 'react'
import type { Transaction } from '@/types'
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
  const [noDealsFound, setNoDealsFound] = useState<Record<'new' | 'secondary', boolean>>({
    new: false,
    secondary: false,
  })
  const dispatch = useAppDispatch()
  const generating = useAppSelector(s => s.reportData?.fetchDealsStatus === 'loading')

  function calcAvgPriceSqm(rows: Transaction[]): number {
    const valid = rows.filter(t => t.netAreaSqm > 0 && t.reportedPriceILS > 0)
    const totalArea  = valid.reduce((s, t) => s + t.netAreaSqm, 0)
    const totalPrice = valid.reduce((s, t) => s + t.reportedPriceILS, 0)
    return totalArea > 0 ? Math.round(totalPrice / totalArea) : 0
  }

  async function handleGenerate(tab: 'new' | 'secondary') {
    setNoDealsFound(p => ({ ...p, [tab]: false }))
    try {
      const res = await dispatch(fetchDeals({ gush, helka, tab })).unwrap()
      setNoDealsFound(p => ({ ...p, [tab]: res.length === 0 }))
    } catch {
      // rejection handled by slice status
    }
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
          onTransactionsChange={rows => {
            const avg = calcAvgPriceSqm(rows)
            onChange({
              ...data,
              newApartments: {
                transactions: rows,
                selectedPricePerSqm: data.newApartments.selectedPricePerSqm === 0 && avg > 0 ? avg : data.newApartments.selectedPricePerSqm,
              },
            })
          }}
          onSelectedPriceChange={v =>
            onChange({ ...data, newApartments: { ...data.newApartments, selectedPricePerSqm: v } })
          }
          onGenerate={() => handleGenerate('new')}
          generating={generating}
          noDealsFound={noDealsFound.new}
          readOnly={readOnly}
        />
      )}

      {activeTab === 'secondary' && (
        <TransactionsTab
          transactions={data.secondaryApartments.transactions}
          selectedPricePerSqm={data.secondaryApartments.selectedPricePerSqm}
          onTransactionsChange={rows => {
            const avg = calcAvgPriceSqm(rows)
            onChange({
              ...data,
              secondaryApartments: {
                transactions: rows,
                selectedPricePerSqm: data.secondaryApartments.selectedPricePerSqm === 0 && avg > 0 ? avg : data.secondaryApartments.selectedPricePerSqm,
              },
            })
          }}
          onSelectedPriceChange={v =>
            onChange({ ...data, secondaryApartments: { ...data.secondaryApartments, selectedPricePerSqm: v } })
          }
          onGenerate={() => handleGenerate('secondary')}
          generating={generating}
          noDealsFound={noDealsFound.secondary}
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
