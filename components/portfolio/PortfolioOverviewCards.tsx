import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Activity } from 'lucide-react'
import { PortfolioOverviewCardsProps } from '@/types/portfolio'
import { useCurrency } from '@/contexts/currency-context'
import { MarketService } from '@/lib/market-service'

export function PortfolioOverviewCards({
  portfolioItems,
  totalPortfolioValue,
  totalProfitLoss,
  total24hChange
}: PortfolioOverviewCardsProps) {
  const { currency } = useCurrency()

  const formatCurrency = (value: number) => {
    const symbol = MarketService.getCurrencySymbol(currency)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace(currency, symbol)
  }

  const formatCurrencyWithSign = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return sign + formatCurrency(value)
  }

  const statsData = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(totalPortfolioValue),
      icon: DollarSign,
      color: 'text-foreground'
    },
    {
      label: 'Total Profit/Loss',
      value: formatCurrencyWithSign(totalProfitLoss),
      icon: totalProfitLoss >= 0 ? TrendingUp : TrendingDown,
      color: totalProfitLoss >= 0 ? 'text-[#00DC33]' : 'text-red-600'
    },
    {
      label: 'Assets',
      value: portfolioItems.length.toString(),
      icon: PieChartIcon,
      color: 'text-foreground'
    },
    {
      label: '24h Change',
      value: formatCurrencyWithSign(total24hChange),
      icon: Activity,
      color: total24hChange >= 0 ? 'text-[#00DC33]' : 'text-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-card rounded-lg p-4 border shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className={`text-lg font-semibold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}