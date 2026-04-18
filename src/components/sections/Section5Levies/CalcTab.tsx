import { cn, fmt } from '@/lib/utils'
import { Card } from '@/components/shared/Card'
import { EXISTING_CREDIT_FACTOR, FLAT_RATE_PER_SQM } from '@/constants/levies'
import type { Section5Data } from '@/types'

const fmtR = (n: number) => n.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

interface Props {
  data: Section5Data
  registeredArea: number
  existingGrossSqm: number
  existingUnits: number
  residentialGross: number
  commercialGross: number
  basementSqm: number
  balconyTotalSqm: number
  densityUnits: number
}

export function CalcTab({
  data,
  registeredArea,
  existingGrossSqm,
  residentialGross,
  commercialGross,
  basementSqm,
  balconyTotalSqm,
  densityUnits,
}: Props) {
  const { rates, useFlatRate } = data

  const allSurface     = residentialGross + commercialGross + basementSqm + balconyTotalSqm
  const existingCredit = existingGrossSqm * EXISTING_CREDIT_FACTOR
  const netNew         = allSurface - existingCredit
  const aboveGround    = residentialGross + commercialGross

  const levyRows = [
    { label: 'אגרות בנייה — על כלל השטחים',  area: allSurface,     rate: rates.constructionPermit, total: allSurface * rates.constructionPermit  },
    { label: 'היטל כביש — קרקע',              area: registeredArea, rate: rates.roadLand,            total: registeredArea * rates.roadLand           },
    { label: 'היטל כביש — בנייה',             area: netNew,         rate: rates.roadBuilding,        total: netNew * rates.roadBuilding               },
    { label: 'היטל מדרכה — קרקע',             area: registeredArea, rate: rates.sidewalkLand,        total: registeredArea * rates.sidewalkLand        },
    { label: 'היטל מדרכה — בנייה',            area: netNew,         rate: rates.sidewalkBuilding,    total: netNew * rates.sidewalkBuilding            },
    { label: 'היטל תיעול — קרקע',             area: registeredArea, rate: rates.drainageLand,        total: registeredArea * rates.drainageLand        },
    { label: 'היטל תיעול — בנייה',            area: netNew,         rate: rates.drainageBuilding,    total: netNew * rates.drainageBuilding            },
    { label: 'דמי הקמה תאגיד המים',           area: netNew,         rate: rates.waterAuthority,      total: netNew * rates.waterAuthority              },
  ]

  const subtotal   = levyRows.reduce((s, r) => s + r.total, 0)
  const finalTotal = subtotal * (1 + rates.safetyBuffer / 100)
  const perSqm     = residentialGross > 0 ? finalTotal / residentialGross : 0
  const flatTotal  = aboveGround * FLAT_RATE_PER_SQM

  const baseDataRows = [
    { label: 'שטח המגרש נטו (קרקע)',             value: registeredArea,  unit: 'מ"ר' },
    { label: 'שטח מבונה למגורים (ברוטו)',          value: residentialGross, unit: 'מ"ר' },
    { label: 'שטח מבונה למסחר',                    value: commercialGross,  unit: 'מ"ר' },
    { label: 'שטח תת"ק',                           value: basementSqm,      unit: 'מ"ר' },
    { label: 'מרפסות',                             value: balconyTotalSqm,  unit: 'מ"ר' },
    { label: 'יח"ד מגורים',                        value: densityUnits,     unit: 'יח׳' },
    { label: 'סה"כ שטח קיים לקיזוז (80%)',         value: existingCredit,   unit: 'מ"ר' },
  ]

  return (
    <div className="space-y-5">
      <Card title="נתוני בסיס">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="pb-2 text-right text-xs font-semibold text-slate-500">נתון</th>
              <th className="pb-2 text-right text-xs font-semibold text-slate-500 w-28">כמות</th>
              <th className="pb-2 text-right text-xs font-semibold text-slate-500 w-16">יח׳</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {baseDataRows.map(({ label, value, unit }) => (
              <tr key={label}>
                <td className="py-2 text-slate-600">{label}</td>
                <td className="py-2 text-right font-semibold text-slate-800 tabular-nums">{fmt(value)}</td>
                <td className="py-2 text-right text-slate-400 text-xs">{unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="תחשיב האגרות">
        {useFlatRate ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5 text-sm">
              <span className="text-slate-500">שטח עילי כולל (מגורים + מסחר)</span>
              <span className="font-semibold text-slate-700 tabular-nums">{fmt(aboveGround)} מ&quot;ר</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5 text-sm">
              <span className="text-slate-500">תעריף אחיד</span>
              <span className="font-semibold text-slate-700 tabular-nums">500 ₪/מ&quot;ר</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <span className="text-sm font-bold text-amber-900">סה&quot;כ אגרות (תעריף אחיד)</span>
              <span className="text-base font-bold text-amber-800 tabular-nums">{fmt(flatTotal)} ₪</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="px-3 py-2.5 text-right font-medium">אגרה / היטל</th>
                    <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-32">שטח לחישוב (מ&quot;ר)</th>
                    <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-28">תעריף (₪/מ&quot;ר)</th>
                    <th className="px-3 py-2.5 text-right font-medium whitespace-nowrap w-32 bg-slate-600">סה&quot;כ (₪)</th>
                  </tr>
                </thead>
                <tbody>
                  {levyRows.map(({ label, area, rate, total }, i) => (
                    <tr
                      key={label}
                      className={cn(
                        'border-b border-slate-100 last:border-0',
                        i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40',
                      )}
                    >
                      <td className="px-3 py-2.5 text-slate-700">{label}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmt(area)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">{fmtR(rate)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-medium text-slate-700 bg-slate-100/50">{fmt(total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5">
                <span className="text-xs font-medium text-slate-500">סה&quot;כ אגרות והיטלים</span>
                <span className="text-sm font-bold text-slate-700 tabular-nums">{fmt(subtotal)} ₪</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <span className="text-sm font-bold text-amber-900">
                  בתוספת מקדם בטחון {rates.safetyBuffer}% — סה&quot;כ סופי
                </span>
                <span className="text-base font-bold text-amber-800 tabular-nums">{fmt(finalTotal)} ₪</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5">
                <span className="text-xs font-medium text-slate-500">אגרות למ&quot;ר עילי בפרויקט</span>
                <span className="text-sm font-semibold text-slate-700 tabular-nums">
                  {residentialGross > 0 ? `${fmt(perSqm)} ₪/מ"ר` : '—'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
